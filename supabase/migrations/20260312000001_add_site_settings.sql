-- Site-wide settings editable by admins
CREATE TABLE IF NOT EXISTS public.site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Seed defaults
INSERT INTO public.site_settings (key, value) VALUES
  ('contact_phone', '+251 911 000 000'),
  ('contact_email', 'orders@nordicseafood.et')
ON CONFLICT (key) DO NOTHING;

-- RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));
