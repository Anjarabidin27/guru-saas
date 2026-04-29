-- Table for dynamic landing page content management
CREATE TABLE IF NOT EXISTS public.site_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Settings
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Everyone can read the config (Public/Unauth)
CREATE POLICY "Public Read Access" ON public.site_config
    FOR SELECT USING (true);

-- Only Super Admin can modify config
CREATE POLICY "Super Admin Manage Config" ON public.site_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Default Content Seeds (Hero, Pain Points, Security, etc.)
INSERT INTO public.site_config (key, value) VALUES
('hero_title', 'Revolusi Administrasi Guru di Era Digital'),
('hero_subtitle', 'Satu platform cerdas untuk manajemen bank soal, materi ajar, dan penilaian otomatis. Biarkan teknologi mengurus berkas, Bapak & Ibu fokus menginspirasi siswa.'),
('hero_cta_primary', 'Mulai Sekarang — Gratis'),
('hero_cta_secondary', 'Pelajari Fitur'),
('security_title', 'Keamanan Data Tingkat Tinggi'),
('security_desc', 'Seluruh data ujian dan materi Anda terlindungi dengan enkripsi end-to-end.'),
('cta_banner_title', 'Siap Mengefisiensikan Pengajaran Anda?'),
('cta_banner_subtitle', 'Bergabunglah dengan ribuan guru di seluruh Indonesia yang telah beralih ke cara cerdas mengelola kelas.')
ON CONFLICT (key) DO NOTHING;
