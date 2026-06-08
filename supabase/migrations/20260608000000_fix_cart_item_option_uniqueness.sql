-- Cart entries are unique by product, size variant, and flavor option.
-- The original cart constraint predated product_options and only used
-- (user_id, product_id, variant), which prevents adding two flavors in the
-- same size to the same cart.

ALTER TABLE public.cart_items
  DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_variant_key;

DROP INDEX IF EXISTS public.cart_items_user_id_product_id_variant_key;
DROP INDEX IF EXISTS public.cart_items_unique_standard_option;
DROP INDEX IF EXISTS public.cart_items_unique_product_option;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'cart_items_option_id_fkey'
      AND conrelid = 'public.cart_items'::regclass
  ) THEN
    ALTER TABLE public.cart_items
      ADD CONSTRAINT cart_items_option_id_fkey
      FOREIGN KEY (option_id)
      REFERENCES public.product_options(id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE UNIQUE INDEX cart_items_unique_standard_option
  ON public.cart_items (user_id, product_id, variant)
  WHERE option_id IS NULL;

CREATE UNIQUE INDEX cart_items_unique_product_option
  ON public.cart_items (user_id, product_id, variant, option_id)
  WHERE option_id IS NOT NULL;
