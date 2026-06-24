-- ============================================================================
-- Product availability toggle
--
-- Previously `products.is_available = false` HID a product from customers
-- entirely (the public SELECT policy filtered on it). The new behaviour:
-- unavailable products stay VISIBLE to customers but cannot be added to a
-- cart or ordered. The customer UI shows a green "Available" / red
-- "Unavailable" badge. `is_available` now means "available to order".
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Let customers see ALL products (available and unavailable)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view available products" ON public.products;

CREATE POLICY "Anyone can view products"
ON public.products
FOR SELECT
USING (true);

-- ----------------------------------------------------------------------------
-- 2. Block carting / ordering of unavailable products (server-side guard)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_product_available()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Product must exist and be available
  IF NOT EXISTS (
    SELECT 1 FROM public.products
    WHERE id = NEW.product_id AND is_available = true
  ) THEN
    RAISE EXCEPTION 'This product is currently unavailable and cannot be ordered.';
  END IF;

  -- If a specific option was chosen, it must also be available
  IF NEW.option_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.product_options
    WHERE id = NEW.option_id AND is_available = true
  ) THEN
    RAISE EXCEPTION 'The selected option is currently unavailable and cannot be ordered.';
  END IF;

  RETURN NEW;
END;
$$;

-- cart_items: block adding/updating unavailable products
DROP TRIGGER IF EXISTS check_cart_item_availability_trigger ON public.cart_items;
CREATE TRIGGER check_cart_item_availability_trigger
  BEFORE INSERT OR UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.enforce_product_available();

-- order_items: block ordering unavailable products
-- Named to run before validate_order_item_price_trigger (alphabetical order)
-- so the customer gets the clear availability message first.
DROP TRIGGER IF EXISTS check_order_item_availability_trigger ON public.order_items;
CREATE TRIGGER check_order_item_availability_trigger
  BEFORE INSERT ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.enforce_product_available();
