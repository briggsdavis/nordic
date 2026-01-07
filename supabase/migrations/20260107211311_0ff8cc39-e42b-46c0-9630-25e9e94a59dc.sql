-- Step 1: Add new values to order_status enum
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'awaiting_payment';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'payment_review';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'payment_rejected';