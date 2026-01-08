-- Add whatsapp_number column to profiles table
ALTER TABLE public.profiles ADD COLUMN whatsapp_number TEXT;

-- Update the handle_new_user function to include whatsapp_number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone_number, whatsapp_number, primary_address, account_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'phone_number', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'whatsapp_number', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'primary_address', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'account_type')::account_type, 'individual')
  );
  
  -- Auto-assign client role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$function$;