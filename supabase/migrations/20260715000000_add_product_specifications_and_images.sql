-- Optional product specifications and ordered product image galleries.

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS specifications TEXT;

CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_sort
  ON public.product_images (product_id, sort_order);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
CREATE POLICY "Anyone can view product images"
  ON public.product_images FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert product images" ON public.product_images;
CREATE POLICY "Admins can insert product images"
  ON public.product_images FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update product images" ON public.product_images;
CREATE POLICY "Admins can update product images"
  ON public.product_images FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete product images" ON public.product_images;
CREATE POLICY "Admins can delete product images"
  ON public.product_images FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.replace_product_images(
  _product_id UUID,
  _image_urls TEXT[]
)
RETURNS VOID
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can manage product images.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM UNNEST(_image_urls) AS image_url
    WHERE image_url IS NULL OR BTRIM(image_url) = ''
  ) THEN
    RAISE EXCEPTION 'Product image URLs cannot be empty.';
  END IF;

  DELETE FROM public.product_images
  WHERE product_id = _product_id;

  INSERT INTO public.product_images (product_id, image_url, sort_order)
  SELECT _product_id, image_url, position - 1
  FROM UNNEST(_image_urls) WITH ORDINALITY AS images(image_url, position);

  UPDATE public.products
  SET image_url = NULLIF(BTRIM(_image_urls[1]), '')
  WHERE id = _product_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found.';
  END IF;
END;
$$;

-- Preserve every current products.image_url as its primary gallery image.
INSERT INTO public.product_images (product_id, image_url, sort_order)
SELECT id, image_url, 0
FROM public.products
WHERE image_url IS NOT NULL
  AND BTRIM(image_url) <> ''
  AND NOT EXISTS (
    SELECT 1
    FROM public.product_images
    WHERE product_images.product_id = products.id
  );

-- Ensure the existing public bucket and its access rules support gallery uploads.
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND public.has_role(auth.uid(), 'admin')
  );
