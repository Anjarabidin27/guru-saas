-- Tabel Header Penilaian (Ujian/Tugas)
CREATE TABLE IF NOT EXISTS public.penilaian (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guru_id UUID REFERENCES auth.users(id) NOT NULL,
    sekolah_id UUID REFERENCES public.sekolah(id) ON DELETE SET NULL,
    nama_penilaian VARCHAR(255) NOT NULL,
    mapel VARCHAR(50) NOT NULL,
    kelas VARCHAR(20) NOT NULL,
    kkm DECIMAL(5,2) DEFAULT 75.00,
    status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('draft', 'aktif', 'selesai', 'diarsipkan')),
    tanggal_ujian DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Detail Nilai Siswa
CREATE TABLE IF NOT EXISTS public.skor_siswa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    penilaian_id UUID REFERENCES public.penilaian(id) ON DELETE CASCADE NOT NULL,
    nama_siswa VARCHAR(100) NOT NULL,
    nis VARCHAR(30),
    skor DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Atur keamanan RLS (Row Level Security)
ALTER TABLE public.penilaian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skor_siswa ENABLE ROW LEVEL SECURITY;

-- Guru hanya bisa melihat dan memanipulasi penilaian buatannya sendiri
CREATE POLICY "Guru kelola penilaian sendiri" ON public.penilaian
    FOR ALL USING (guru_id = auth.uid());

-- Guru hanya bisa melihat dan memanipulasi nilai anak didiknya di ujian buatannya sendiri
CREATE POLICY "Guru kelola skor siswa sendiri" ON public.skor_siswa
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.penilaian p 
            WHERE p.id = public.skor_siswa.penilaian_id AND p.guru_id = auth.uid()
        )
    );
