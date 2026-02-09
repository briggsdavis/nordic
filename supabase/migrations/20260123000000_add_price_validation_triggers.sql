-- Migration: Add server-side price validation
-- This prevents price manipulation attacks by validating all prices at database level

-- ============================================================================
-- FUNCTION: Calculate correct price for a product variant
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_product_variant_price(
  p_product_id UUID,
  p_variant TEXT
) RETURNS DECIMAL(10,2) AS $$
DECLARE
  base_price DECIMAL(10,2);
  weight DECIMAL(3,2);
BEGIN
  -- Get the actual product price from database
  SELECT price_per_kg INTO base_price
  FROM public.products
  WHERE id = p_product_id AND available = true;

  -- If product not found or unavailable, reject
  IF base_price IS NULL THEN
    RAISE EXCEPTION 'Product % not found or unavailable', p_product_id;
  END IF;

  -- Calculate weight in kg based on variant
  weight := CASE p_variant
    WHEN '100g' THEN 0.1
    WHEN '200g' THEN 0.2
    WHEN '300g' THEN 0.3
    ELSE NULL
  END;

  -- If invalid variant, reject
  IF weight IS NULL THEN
    RAISE EXCEPTION 'Invalid variant: %. Must be 100g, 200g, or 300g', p_variant;
  END IF;

  -- Return calculated price
  RETURN ROUND(base_price * weight, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER FUNCTION: Validate order item prices
-- Ensures client cannot submit fake prices
-- ============================================================================
CREATE OR REPLACE FUNCTION public.validate_order_item_price()
RETURNS TRIGGER AS $$
DECLARE
  correct_price DECIMAL(10,2);
  correct_subtotal DECIMAL(10,2);
BEGIN
  -- Calculate what the price SHOULD be
  correct_price := public.get_product_variant_price(NEW.product_id, NEW.variant);
  correct_subtotal := ROUND(correct_price * NEW.quantity, 2);

  -- Check if client sent wrong unit_price (allow 1 cent tolerance for rounding)
  IF ABS(NEW.unit_price - correct_price) > 0.01 THEN
    RAISE EXCEPTION 'Price manipulation detected for product %. Expected %, got %',
      NEW.product_name, correct_price, NEW.unit_price;
  END IF;

  -- Check if subtotal is wrong
  IF ABS(NEW.subtotal - correct_subtotal) > 0.01 THEN
    RAISE EXCEPTION 'Subtotal manipulation detected. Expected %, got %',
      correct_subtotal, NEW.subtotal;
  END IF;

  -- Force correct values (defense in depth)
  NEW.unit_price := correct_price;
  NEW.subtotal := correct_subtotal;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to order_items table
DROP TRIGGER IF EXISTS validate_order_item_price_trigger ON public.order_items;
CREATE TRIGGER validate_order_item_price_trigger
  BEFORE INSERT OR UPDATE ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_order_item_price();

-- ============================================================================
-- TRIGGER FUNCTION: Validate order total matches items
-- Ensures total_amount cannot be manipulated
-- ============================================================================
CREATE OR REPLACE FUNCTION public.validate_order_total()
RETURNS TRIGGER AS $$
DECLARE
  calculated_total DECIMAL(10,2);
  items_count INTEGER;
BEGIN
  -- Calculate sum of all order items for this order
  SELECT
    COALESCE(SUM(subtotal), 0),
    COUNT(*)
  INTO calculated_total, items_count
  FROM public.order_items
  WHERE order_id = NEW.id;

  -- Skip validation if no items yet (order just created)
  -- Items are inserted separately after order creation
  IF items_count = 0 THEN
    RETURN NEW;
  END IF;

  -- Validate total matches (allow 1 cent tolerance for rounding)
  IF ABS(NEW.total_amount - calculated_total) > 0.01 THEN
    RAISE EXCEPTION 'Order total manipulation detected. Calculated %, submitted %',
      calculated_total, NEW.total_amount;
  END IF;

  -- Force correct total (defense in depth)
  NEW.total_amount := calculated_total;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to orders table (only on UPDATE, not INSERT)
DROP TRIGGER IF EXISTS validate_order_total_trigger ON public.orders;
CREATE TRIGGER validate_order_total_trigger
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  WHEN (OLD.total_amount IS DISTINCT FROM NEW.total_amount)
  EXECUTE FUNCTION public.validate_order_total();

-- ============================================================================
-- CONSTRAINT: Limit cart item quantities
-- Prevents inventory exhaustion attacks
-- ============================================================================
ALTER TABLE public.cart_items
  DROP CONSTRAINT IF EXISTS cart_items_max_quantity;

ALTER TABLE public.cart_items
  ADD CONSTRAINT cart_items_max_quantity
  CHECK (quantity > 0 AND quantity <= 100);

-- ============================================================================
-- CONSTRAINT: Verify order item subtotal calculation
-- Additional defense layer
-- ============================================================================
ALTER TABLE public.order_items
  DROP CONSTRAINT IF EXISTS order_items_subtotal_check;

ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_subtotal_check
  CHECK (ABS(subtotal - (unit_price * quantity)) < 0.01);

-- ============================================================================
-- ADD MISSING DELETE POLICY: Orders
-- Prevent accidental deletion, use soft-delete pattern instead
-- ============================================================================
DROP POLICY IF EXISTS "Prevent order deletion" ON public.orders;
CREATE POLICY "Prevent order deletion"
  ON public.orders FOR DELETE
  USING (false);  -- No one can delete orders, including admins

-- Add soft-delete column if not exists (for future use)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN deleted_at TIMESTAMPTZ;
  END IF;
END $$;

-- ============================================================================
-- COMMENTS: Documentation
-- ============================================================================
COMMENT ON FUNCTION public.get_product_variant_price IS
  'Calculates the correct price for a product variant based on current product price_per_kg';

COMMENT ON FUNCTION public.validate_order_item_price IS
  'Trigger function that validates order item prices match actual product prices';

COMMENT ON FUNCTION public.validate_order_total IS
  'Trigger function that validates order total_amount matches sum of order items';
