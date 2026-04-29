-- 1. Modify table to support MULTIPLE templates
-- Jika tabel sudah ada, jalankan perintah ALTER ini:
-- ALTER TABLE public.exam_identities DROP CONSTRAINT IF EXISTS exam_identities_guru_id_key;
-- ALTER TABLE public.exam_identities ADD COLUMN IF NOT EXISTS template_name TEXT DEFAULT 'Utama';

CREATE TABLE IF NOT EXISTS public.exam_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guru_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    template_name TEXT DEFAULT 'Utama',
    nama_guru TEXT,
    nama_sekolah TEXT,
    logo_url TEXT,
    jenjang VARCHAR(50),
    fase VARCHAR(50),
    kelas VARCHAR(50),
    mapel_default TEXT,
    tahun_ajaran VARCHAR(20),
    semester VARCHAR(10),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.exam_identities ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
DROP POLICY IF EXISTS "Users can manage their own exam identity" ON public.exam_identities;
CREATE POLICY "Users can manage their own exam identity" 
ON public.exam_identities
FOR ALL USING (auth.uid() = guru_id);
