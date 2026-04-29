-- Tabel Notifikasi / Broadcast (Global Announcement)
CREATE TABLE IF NOT EXISTS public.notifikasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT NOT NULL,
    pesan TEXT NOT NULL,
    tipe VARCHAR(20) DEFAULT 'info' CHECK (tipe IN ('info', 'warning', 'success', 'error')),
    target_role VARCHAR(20) DEFAULT 'all', -- 'all', 'admin_sekolah', 'guru'
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE -- Jika pengumuman ingin otomatis hilang
);

-- RLS untuk Notifikasi
ALTER TABLE public.notifikasi ENABLE ROW LEVEL SECURITY;

-- Semua user yang login bisa melihat notifikasi yang aktif
CREATE POLICY "Semua user bisa melihat notifikasi aktif" ON public.notifikasi
    FOR SELECT USING (is_active = true);

-- Hanya Super Admin yang bisa mengelola notifikasi
CREATE POLICY "Hanya Super Admin bisa kelola notifikasi" ON public.notifikasi
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Tabel Audit Log (Administrative Tracking)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    aksi TEXT NOT NULL, -- Contoh: 'UPDATE_LICENSE', 'DELETE_SCHOOL', 'BROADCAST_SENT'
    detail JSONB, -- Simpan data before/after
    entitas_tipe VARCHAR(50), -- 'sekolah', 'pengguna', 'notifikasi'
    entitas_id TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS untuk Audit Log
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Hanya Super Admin yang bisa melihat log (Read Only)
CREATE POLICY "Hanya Super Admin bisa baca Audit Log" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );
