-- Catch-up migration: captures all schema changes applied directly to the DB
-- after the last migration (20260122172240).
--
-- This migration is IDEMPOTENT -- safe to run against the live DB where these
-- objects already exist.

-- ============================================================================
-- 1. ENUMS
-- ============================================================================

-- Drop stale enum that was created in an early migration but removed from live DB
DROP TYPE IF EXISTS public.logistics_stage;

-- shipment_stage_status (used by shipment_stages table)
DO $$ BEGIN
  CREATE TYPE public.shipment_stage_status AS ENUM ('pending', 'in_progress', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- 2. NEW TABLES
-- ============================================================================

-- product_options
CREATE TABLE IF NOT EXISTS public.product_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_per_kg NUMERIC,
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- shipment_stage_definitions
CREATE TABLE IF NOT EXISTS public.shipment_stage_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_number INTEGER NOT NULL,
  stage_name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- shipment_stages
CREATE TABLE IF NOT EXISTS public.shipment_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  stage_number INTEGER NOT NULL,
  status public.shipment_stage_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (order_id, stage_number)
);

-- ============================================================================
-- 3. NEW COLUMNS ON EXISTING TABLES
-- ============================================================================

-- orders: current_shipment_stage
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS current_shipment_stage INTEGER;

-- orders: deleted_at (soft delete)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- orders: drop legacy logistics_stage column if it still exists
ALTER TABLE public.orders DROP COLUMN IF EXISTS logistics_stage;

-- products: allow_size_selection
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS allow_size_selection BOOLEAN NOT NULL DEFAULT true;

-- order_items: option support
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS option_id UUID;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS option_name TEXT;

-- cart_items: option support
ALTER TABLE public.cart_items ADD COLUMN IF NOT EXISTS option_id UUID;

-- ============================================================================
-- 4. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_orders_current_stage ON public.orders (current_shipment_stage);
CREATE INDEX IF NOT EXISTS idx_product_options_product_id ON public.product_options (product_id);
CREATE INDEX IF NOT EXISTS idx_shipment_stages_order_id ON public.shipment_stages (order_id);
CREATE INDEX IF NOT EXISTS idx_shipment_stages_order_stage ON public.shipment_stages (order_id, stage_number);

-- Unique constraints (IF NOT EXISTS not supported for unique indexes pre-PG15,
-- but CREATE TABLE already includes the UNIQUE constraint above)
CREATE UNIQUE INDEX IF NOT EXISTS shipment_stage_definitions_stage_number_unique
  ON public.shipment_stage_definitions (stage_number);

-- ============================================================================
-- 5. ENABLE RLS ON NEW TABLES
-- ============================================================================

ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_stage_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_stages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. RLS POLICIES
-- ============================================================================

-- -- product_options --------------------------------------------------------

CREATE POLICY "Anyone can view product options"
  ON public.product_options FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert product options"
  ON public.product_options FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product options"
  ON public.product_options FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product options"
  ON public.product_options FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- -- shipment_stage_definitions ---------------------------------------------

CREATE POLICY "Anyone can view stage definitions"
  ON public.shipment_stage_definitions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can view stage definitions"
  ON public.shipment_stage_definitions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage stage definitions"
  ON public.shipment_stage_definitions FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- -- shipment_stages --------------------------------------------------------

CREATE POLICY "Users can view stages for their own orders"
  ON public.shipment_stages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = shipment_stages.order_id AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can view their own shipment stages"
  ON public.shipment_stages FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = shipment_stages.order_id AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all shipment stages"
  ON public.shipment_stages FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert shipment stages"
  ON public.shipment_stages FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update shipment stages"
  ON public.shipment_stages FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete shipment stages"
  ON public.shipment_stages FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- -- orders (new/changed policies) ------------------------------------------

-- Drop the old policy from migration 9 that no longer exists in live DB
DROP POLICY IF EXISTS "Users can update their own verifying orders" ON public.orders;
-- Drop the older pending version too
DROP POLICY IF EXISTS "Users can update their own pending orders" ON public.orders;

CREATE POLICY "Users can upload receipt on verifying orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'verifying')
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can delete orders"
  ON public.orders FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Prevent order deletion"
  ON public.orders FOR DELETE
  USING (false);

-- ============================================================================
-- 7. FUNCTIONS
-- ============================================================================

-- get_product_variant_price (3-arg version, with option_id)
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
  weight DECIMAL(3,2);
BEGIN
  -- Use option's price_per_kg if an option is specified, else fall back to product
  IF p_option_id IS NOT NULL THEN
    SELECT price_per_kg INTO base_price
    FROM public.product_options
    WHERE id = p_option_id;
  END IF;

  IF base_price IS NULL THEN
    SELECT price_per_kg INTO base_price
    FROM public.products
    WHERE id = p_product_id AND is_available = true;
  END IF;

  IF base_price IS NULL THEN
    RAISE EXCEPTION 'Product % not found or unavailable', p_product_id;
  END IF;

  weight := CASE p_variant
    WHEN '100g' THEN 0.1
    WHEN '200g' THEN 0.2
    WHEN '300g' THEN 0.3
    ELSE NULL
  END;

  IF weight IS NULL THEN
    RAISE EXCEPTION 'Invalid variant: %. Must be 100g, 200g, or 300g', p_variant;
  END IF;

  RETURN ROUND(base_price * weight, 2);
END;
$$;

-- validate_order_item_price trigger function
CREATE OR REPLACE FUNCTION public.validate_order_item_price()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  correct_price DECIMAL(10,2);
  correct_subtotal DECIMAL(10,2);
BEGIN
  correct_price := public.get_product_variant_price(NEW.product_id, NEW.variant, NEW.option_id);
  correct_subtotal := ROUND(correct_price * NEW.quantity, 2);

  IF ABS(NEW.unit_price - correct_price) > 0.01 THEN
    RAISE EXCEPTION 'Price manipulation detected for product %. Expected %, got %',
      NEW.product_name, correct_price, NEW.unit_price;
  END IF;

  IF ABS(NEW.subtotal - correct_subtotal) > 0.01 THEN
    RAISE EXCEPTION 'Subtotal manipulation detected. Expected %, got %',
      correct_subtotal, NEW.subtotal;
  END IF;

  NEW.unit_price := correct_price;
  NEW.subtotal := correct_subtotal;

  RETURN NEW;
END;
$$;

-- validate_order_total trigger function
CREATE OR REPLACE FUNCTION public.validate_order_total()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  calculated_total DECIMAL(10,2);
  items_count INTEGER;
BEGIN
  SELECT COALESCE(SUM(subtotal), 0), COUNT(*)
  INTO calculated_total, items_count
  FROM public.order_items
  WHERE order_id = NEW.id;

  -- Skip validation if no items yet (order just created)
  IF items_count = 0 THEN
    RETURN NEW;
  END IF;

  IF ABS(NEW.total_amount - calculated_total) > 0.01 THEN
    RAISE EXCEPTION 'Order total manipulation detected. Calculated %, submitted %',
      calculated_total, NEW.total_amount;
  END IF;

  NEW.total_amount := calculated_total;
  RETURN NEW;
END;
$$;

-- restrict_order_user_updates trigger function
CREATE OR REPLACE FUNCTION public.restrict_order_user_updates()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.total_amount IS DISTINCT FROM OLD.total_amount
    OR NEW.delivery_address IS DISTINCT FROM OLD.delivery_address
    OR NEW.contact_name IS DISTINCT FROM OLD.contact_name
    OR NEW.contact_phone IS DISTINCT FROM OLD.contact_phone
    OR NEW.reference_number IS DISTINCT FROM OLD.reference_number
    OR NEW.user_id IS DISTINCT FROM OLD.user_id
    OR NEW.expected_delivery_date IS DISTINCT FROM OLD.expected_delivery_date
    OR NEW.status IS DISTINCT FROM OLD.status
  THEN
    RAISE EXCEPTION 'You can only update your payment receipt';
  END IF;

  RETURN NEW;
END;
$$;

-- auto_initialize_shipment_tracking trigger function
CREATE OR REPLACE FUNCTION public.auto_initialize_shipment_tracking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When order moves to 'confirmed' status, initialize shipment tracking
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    -- Only initialize if stages don't already exist
    IF NOT EXISTS (
      SELECT 1 FROM public.shipment_stages WHERE order_id = NEW.id
    ) THEN
      PERFORM public.initialize_shipment_stages(NEW.id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- initialize_shipment_stages callable function
CREATE OR REPLACE FUNCTION public.initialize_shipment_stages(p_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can initialize shipment stages';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = p_order_id AND status = 'confirmed'
  ) THEN
    RAISE EXCEPTION 'Order not found or not in confirmed status';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.shipment_stages WHERE order_id = p_order_id
  ) THEN
    RETURN;
  END IF;

  INSERT INTO public.shipment_stages (order_id, stage_number, status)
  SELECT p_order_id, stage_number, 'pending'
  FROM public.shipment_stage_definitions
  ORDER BY stage_number;

  UPDATE public.orders
  SET current_shipment_stage = 1
  WHERE id = p_order_id;
END;
$$;

-- update_order_current_stage trigger function
CREATE OR REPLACE FUNCTION public.update_order_current_stage()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.orders
  SET current_shipment_stage = (
    SELECT COALESCE(MAX(stage_number), 1)
    FROM public.shipment_stages
    WHERE order_id = NEW.order_id
      AND (status = 'completed' OR status = 'in_progress')
  )
  WHERE id = NEW.order_id;

  RETURN NEW;
END;
$$;

-- set_product_options_updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_product_options_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- 8. TRIGGERS
-- ============================================================================

-- order_items: price validation
DROP TRIGGER IF EXISTS validate_order_item_price_trigger ON public.order_items;
CREATE TRIGGER validate_order_item_price_trigger
  BEFORE INSERT OR UPDATE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.validate_order_item_price();

-- orders: total validation
DROP TRIGGER IF EXISTS validate_order_total_trigger ON public.orders;
CREATE TRIGGER validate_order_total_trigger
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.validate_order_total();

-- orders: restrict user updates
DROP TRIGGER IF EXISTS restrict_order_updates ON public.orders;
CREATE TRIGGER restrict_order_updates
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.restrict_order_user_updates();

-- orders: auto-init shipment on confirm
DROP TRIGGER IF EXISTS auto_init_shipment_on_confirm ON public.orders;
CREATE TRIGGER auto_init_shipment_on_confirm
  AFTER INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.auto_initialize_shipment_tracking();

-- shipment_stages: sync current stage to order
DROP TRIGGER IF EXISTS sync_order_current_stage ON public.shipment_stages;
CREATE TRIGGER sync_order_current_stage
  AFTER INSERT OR UPDATE ON public.shipment_stages
  FOR EACH ROW EXECUTE FUNCTION public.update_order_current_stage();

-- shipment_stages: updated_at
DROP TRIGGER IF EXISTS update_shipment_stages_updated_at ON public.shipment_stages;
CREATE TRIGGER update_shipment_stages_updated_at
  BEFORE UPDATE ON public.shipment_stages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- shipment_stage_definitions: updated_at
DROP TRIGGER IF EXISTS update_shipment_stage_definitions_updated_at ON public.shipment_stage_definitions;
CREATE TRIGGER update_shipment_stage_definitions_updated_at
  BEFORE UPDATE ON public.shipment_stage_definitions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- product_options: updated_at
DROP TRIGGER IF EXISTS trg_product_options_updated_at ON public.product_options;
CREATE TRIGGER trg_product_options_updated_at
  BEFORE UPDATE ON public.product_options
  FOR EACH ROW EXECUTE FUNCTION public.set_product_options_updated_at();
