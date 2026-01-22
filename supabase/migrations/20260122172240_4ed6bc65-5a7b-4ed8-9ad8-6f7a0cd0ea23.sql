-- Remove 'placed' from order_status enum

-- Step 1: Drop the RLS policy FIRST (it references status column)
DROP POLICY IF EXISTS "Users can update their own placed orders" ON public.orders;

-- Step 2: Create new enum without 'placed'
CREATE TYPE public.order_status_new AS ENUM (
  'verifying',
  'rejected',
  'confirmed',
  'shipped',
  'delivered',
  'completed',
  'cancelled'
);

-- Step 3: Migrate any 'placed' orders to 'verifying'
UPDATE public.orders SET status = 'verifying' WHERE status = 'placed';

-- Step 4: Drop the existing default before type change
ALTER TABLE public.orders ALTER COLUMN status DROP DEFAULT;

-- Step 5: Swap column to new enum
ALTER TABLE public.orders
  ALTER COLUMN status TYPE public.order_status_new
  USING status::text::public.order_status_new;

-- Step 6: Drop old enum, rename new one
DROP TYPE public.order_status;
ALTER TYPE public.order_status_new RENAME TO order_status;

-- Step 7: Set new default
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'verifying';

-- Step 8: Recreate RLS policy with new status value
CREATE POLICY "Users can update their own verifying orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id AND status = 'verifying');