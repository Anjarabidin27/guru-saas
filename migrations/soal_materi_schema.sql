-- Tabel Bank Soal (Questions Bank)
CREATE TABLE IF NOT EXISTS public.soal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guru_id UUID REFERENCES public.profiles(id) NOT NULL,
    mapel VARCHAR(100) NOT NULL,
    topik TEXT NOT NULL,
    pertanyaan TEXT NOT NULL,
    opsi_a TEXT,
    opsi_b TEXT,
    opsi_c TEXT,
    opsi_d TEXT,
    opsi_e TEXT,
    jawaban_benar CHAR(1), -- 'A', 'B', 'C', 'D', 'E'
    tingkat_kesulitan VARCHAR(20) DEFAULT 'sedang' CHECK (tingkat_kesulitan IN ('mudah', 'sedang', 'sulit')),
    tipe_soal VARCHAR(20) DEFAULT 'pilgan', -- 'pilgan', 'essai'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Materi / Modul Ajar (Instructional Materials)
CREATE TABLE IF NOT EXISTS public.materi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guru_id UUID REFERENCES public.profiles(id) NOT NULL,
    judul TEXT NOT NULL,
    deskripsi TEXT,
    mapel VARCHAR(100) NOT NULL,
    file_path TEXT, -- Path ke Supabase Storage
    file_type VARCHAR(50), -- 'pdf', 'ppt', 'docx'
    isi_ekstraksi TEXT, -- Teks hasil ekstraksi untuk konteks AI
    is_shared BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Settings
ALTER TABLE public.soal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materi ENABLE ROW LEVEL SECURITY;

-- Guru hanya bisa mengelola datanya sendiri
CREATE POLICY "Guru kelola soal sendiri" ON public.soal
    FOR ALL USING (guru_id = auth.uid());

CREATE POLICY "Guru kelola materi sendiri" ON public.materi
    FOR ALL USING (guru_id = auth.uid());

-- Triggers untuk updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_soal_modtime BEFORE UPDATE ON public.soal FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_materi_modtime BEFORE UPDATE ON public.materi FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
