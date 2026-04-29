-- 1. Buat fungsi helper untuk cek Super Admin (Security Definer)
-- Fungsi ini berjalan dengan hak akses sistem (bypass RLS) untuk menghindari rekursi
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT (role = 'super_admin')
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Hapus kebijakan lama yang bermasalah (Rekursif)
DROP POLICY IF EXISTS "Super Admin can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Hanya Super Admin yang bisa Modifikasi Global" ON public.sekolah;
DROP POLICY IF EXISTS "Super Admin Manage Config" ON public.site_config;

-- 3. Terapkan kebijakan baru yang AMAN (Menggunakan fungsi is_super_admin)

-- Kebijakan untuk TABEL PROFILES
CREATE POLICY "Super Admin manage all profiles" ON public.profiles
    FOR ALL USING (is_super_admin());

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Kebijakan untuk TABEL SEKOLAH
CREATE POLICY "Super Admin global manage sekolah" ON public.sekolah
    FOR ALL USING (is_super_admin());

-- Kebijakan untuk TABEL SITE_CONFIG
CREATE POLICY "Super Admin manage site config" ON public.site_config
    FOR ALL USING (is_super_admin());
