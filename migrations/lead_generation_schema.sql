-- Add sekolah_nama_raw for Lead Generation / Lobbying data
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sekolah_nama_raw TEXT;

-- Update the existing view or ensure the columns are accessible for future audit
COMMENT ON COLUMN public.profiles.sekolah_nama_raw IS 'Nama instansi/sekolah yang diinput manual oleh guru saat pendaftaran (untuk kebutuhan lead generation/lobbying).';
