-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  weight_range TEXT,
  price_per_kg DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create unique index on slug
CREATE UNIQUE INDEX idx_products_slug ON public.products(slug);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can view available products
CREATE POLICY "Anyone can view available products"
ON public.products
FOR SELECT
USING (is_available = true);

-- Admins can view all products (including unavailable)
CREATE POLICY "Admins can view all products"
ON public.products
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Admins can insert products
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update products
CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can delete products
CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Add trigger for auto-updating updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial products
INSERT INTO public.products (name, slug, description, weight_range, price_per_kg, image_url) VALUES
('Whole Salmon', 'whole-salmon', 'Premium whole Norwegian salmon, perfect for special occasions and large gatherings.', '4-6 kg', 45.00, 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=800&q=80'),
('Salmon Fillets', 'salmon-fillets', 'Sushi-grade boneless fillets, expertly cut for versatile preparation.', 'Per kg', 65.00, 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?auto=format&fit=crop&w=800&q=80'),
('Salmon Portions', 'salmon-portions', 'Restaurant-quality pre-portioned cuts, ideal for individual servings.', '150-200g', 75.00, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80');