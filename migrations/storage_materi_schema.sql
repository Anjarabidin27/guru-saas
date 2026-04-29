-- Buat Storage Bucket "materi"
INSERT INTO storage.buckets (id, name, public) 
VALUES ('materi', 'materi', true)
ON CONFLICT (id) DO NOTHING;

-- Hapus policy lama jika ada agar tidak bentrok
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow user to update own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow user to delete own files" ON storage.objects;

-- 1. Izinkan User Login (Guru) untuk Mengunggah File ke bucket materi
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK ( bucket_id = 'materi' );

-- 2. Izinkan Publik (Siswa/Aplikasi) Membaca/Mendownload File
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT TO public
USING ( bucket_id = 'materi' );

-- 3. Izinkan Guru Memperbarui Filenya Sendiri
CREATE POLICY "Allow user to update own files"
ON storage.objects FOR UPDATE TO authenticated
USING ( bucket_id = 'materi' AND auth.uid() = owner );

-- 4. Izinkan Guru Menghapus Filenya Sendiri
CREATE POLICY "Allow user to delete own files"
ON storage.objects FOR DELETE TO authenticated
USING ( bucket_id = 'materi' AND auth.uid() = owner );
