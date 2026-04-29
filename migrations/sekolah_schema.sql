-- Tabel Sekolah (School Entity)
CREATE TABLE IF NOT EXISTS public.sekolah (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    alamat TEXT,
    kota TEXT,
    kode_sekolah VARCHAR(10) UNIQUE NOT NULL, -- Kode PIN untuk join guru
    status_langganan VARCHAR(20) DEFAULT 'free' CHECK (status_langganan IN ('free', 'pro', 'enterprise')),
    kuota_guru INT DEFAULT 5, -- Batas maksimal guru yang bisa bergabung
    admin_id UUID REFERENCES public.profiles(id), -- Kepala Sekolah / Admin Utama institusi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Atur keamanan RLS
ALTER TABLE public.sekolah ENABLE ROW LEVEL SECURITY;

-- Semua orang auth bisa melihat sekolah (saat signup untuk lookup berdasarkan kode)
CREATE POLICY "Semua auth user bisa melihat sekolah" ON public.sekolah
    FOR SELECT USING (auth.role() = 'authenticated');

-- Hanya Super Admin yang bisa menambah, mengubah, atau menghapus sekolah (secara global)
CREATE POLICY "Hanya Super Admin yang bisa Modifikasi Global" ON public.sekolah
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Admin Sekolah hanya bisa mengubah sekolahnya sendiri
CREATE POLICY "Admin Sekolah update organisasinya sendiri" ON public.sekolah
    FOR UPDATE USING (
        admin_id = auth.uid()
    );

-- Modifikasi tabel Profiles agar terhubung ke sekolah
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sekolah_id UUID REFERENCES public.sekolah(id) ON DELETE SET NULL;
