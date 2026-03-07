CREATE OR REPLACE FUNCTION public.get_product_variant_price(
  p_product_id UUID,
  p_variant TEXT,
  p_option_id UUID DEFAULT NULL
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_price DECIMAL(10,2);
  multiplier DECIMAL(3,2);
BEGIN
  -- Use option's price_per_unit if an option is specified, else fall back to product
  IF p_option_id IS NOT NULL THEN
    SELECT price_per_unit INTO base_price
    FROM public.product_options
    WHERE id = p_option_id;
  END IF;

  IF base_price IS NULL THEN
    SELECT price_per_unit INTO base_price
    FROM public.products
    WHERE id = p_product_id AND is_available = true;
  END IF;

  IF base_price IS NULL THEN
    RAISE EXCEPTION 'Product % not found or unavailable', p_product_id;
  END IF;

  -- 100g = 1x, 200g = 2x, 300g = 3x base price
  multiplier := CASE p_variant
    WHEN '100g' THEN 1.0
    WHEN '200g' THEN 2.0
    WHEN '300g' THEN 3.0
    WHEN 'whole' THEN 1.0
    ELSE NULL
  END;

  IF multiplier IS NULL THEN
    RAISE EXCEPTION 'Invalid variant: %', p_variant;
  END IF;

  RETURN ROUND(base_price * multiplier, 2);
END;
$$;
