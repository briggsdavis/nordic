-- Admin-editable bank details and public company documents.
-- Copy/paste this file into the Lovable/Supabase SQL editor.

INSERT INTO public.site_settings (key, value)
VALUES
  ('bank_account_holder', 'Nordic Seafood Imports'),
  ('bank_account_number', '1000693338623'),
  ('bank_name', 'Commercial Bank of Ethiopia'),
  ('document_management_system_url', ''),
  ('document_free_sale_url', ''),
  ('document_certificate_of_competence_url', '')
ON CONFLICT (key) DO NOTHING;

DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-documents', 'site-documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view site documents" ON storage.objects;
CREATE POLICY "Public can view site documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-documents');

DROP POLICY IF EXISTS "Admins can upload site documents" ON storage.objects;
CREATE POLICY "Admins can upload site documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'site-documents'
    AND public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Admins can update site documents" ON storage.objects;
CREATE POLICY "Admins can update site documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'site-documents'
    AND public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    bucket_id = 'site-documents'
    AND public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Admins can delete site documents" ON storage.objects;
CREATE POLICY "Admins can delete site documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'site-documents'
    AND public.has_role(auth.uid(), 'admin')
  );
