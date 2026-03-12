-- Add note (admin-internal) and reject_reason columns to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS reject_reason TEXT;

-- Prevent non-admin users from modifying admin-only fields
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
    OR NEW.note IS DISTINCT FROM OLD.note
    OR NEW.reject_reason IS DISTINCT FROM OLD.reject_reason
  THEN
    RAISE EXCEPTION 'You can only update your payment receipt';
  END IF;

  RETURN NEW;
END;
$$;
