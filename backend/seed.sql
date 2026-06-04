-- ============================================================
-- Kepemimpinan Platform — Seed Data
-- Run this in Supabase SQL Editor AFTER creating all tables
-- ============================================================

-- Seed categories
INSERT INTO public.categories (id, name, slug, description) VALUES
  (gen_random_uuid(), 'Artikel', 'artikel', 'Artikel dan tulisan seputar kepemimpinan'),
  (gen_random_uuid(), 'Slide', 'slide', 'Materi presentasi dan slide kepemimpinan'),
  (gen_random_uuid(), 'Kasus Studi', 'kasus-studi', 'Studi kasus nyata dari praktik kepemimpinan')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- ADMIN USER SETUP (Manual Step)
-- ============================================================
-- 1. Register a user via POST /api/auth/register with your desired email/password
-- 2. Then run the following query (replace the email):
--
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'admin@example.com'
-- );
-- ============================================================

-- RLS Policies (run after enabling RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_views ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own, admin reads all
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin read all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Files: public can read published files
CREATE POLICY "Public read published files" ON public.files
  FOR SELECT USING (is_published = true);

-- Auth users can upload
CREATE POLICY "Auth users upload files" ON public.files
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- Admin has full access to files
CREATE POLICY "Admin all files" ON public.files
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Categories: public can read
CREATE POLICY "Public read categories" ON public.categories
  FOR SELECT USING (true);

-- Admin can write categories
CREATE POLICY "Admin write categories" ON public.categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- File views: auth users can insert views
CREATE POLICY "Auth users insert views" ON public.file_views
  FOR INSERT WITH CHECK (auth.uid() = viewer_id);

CREATE POLICY "Admin read views" ON public.file_views
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
