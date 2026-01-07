-- Step 2: Migrate existing orders to unified status
UPDATE public.orders
SET status = 'awaiting_payment'::order_status
WHERE status = 'pending' AND payment_status = 'pending';

UPDATE public.orders
SET status = 'payment_review'::order_status
WHERE status = 'pending' AND payment_status = 'uploaded';

UPDATE public.orders
SET status = 'payment_rejected'::order_status
WHERE status = 'pending' AND payment_status = 'rejected';

UPDATE public.orders
SET status = 'processing'::order_status
WHERE (status = 'payment_verified' OR (status = 'pending' AND payment_status = 'verified'));

-- Step 3: Drop the payment_status column
ALTER TABLE public.orders DROP COLUMN IF EXISTS payment_status;

-- Step 4: Drop the payment_status enum type
DROP TYPE IF EXISTS payment_status;