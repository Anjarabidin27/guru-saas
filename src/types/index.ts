// =============================================
// TYPES — Definisi semua tipe data aplikasi
// Gunakan ini di seluruh project untuk konsistensi
// =============================================

// ---- AUTH & USER ----
export type UserRole = 'super_admin' | 'admin_sekolah' | 'guru'

export type SubscriptionTier =
  | 'gratis'
  | 'guru_pro'
  | 'guru_premium'
  | 'sekolah_basic'
  | 'sekolah_pro'
  | 'sekolah_enterprise'

export interface User {
  id: string
  email: string
  nama_lengkap: string
  nip?: string
  foto_profil?: string
  role: UserRole
  sekolah_id?: string
  mapel_utama?: string
  subscription_tier: SubscriptionTier
  created_at: string
  updated_at: string
}

// ---- SEKOLAH ----
export interface Sekolah {
  id: string
  nama_sekolah: string
  alamat?: string
  kota?: string
  provinsi?: string
  kode_sekolah?: string
  subscription_tier: SubscriptionTier
  subscription_expires_at?: string
  max_guru: number
  created_at: string
}

// ---- SOAL ----
export type JenisSoal = 'pilihan_ganda' | 'uraian' | 'benar_salah'
export type LevelSoal = 'LOTS' | 'MOTS' | 'HOTS'
export type MapelType =
  | 'Matematika' | 'Fisika' | 'Kimia' | 'Biologi'
  | 'Bahasa Indonesia' | 'Bahasa Inggris' | 'Sejarah'
  | 'Geografi' | 'Ekonomi' | 'Sosiologi' | 'PAI'
  | 'PKN' | 'Seni Budaya' | 'PJOK' | 'Informatika' | 'Lainnya'

export type KelasType = 'X' | 'XI' | 'XII' | 'VII' | 'VIII' | 'IX'

export interface Soal {
  id: string
  guru_id: string
  sekolah_id: string
  mapel: MapelType
  kelas: KelasType
  jenis_soal: JenisSoal
  level: LevelSoal
  pertanyaan: string
  pilihan_jawaban?: string[] // untuk pilihan ganda: ["A. ...", "B. ...", ...]
  kunci_jawaban: string
  pembahasan?: string
  is_publik: boolean
  tags?: string[]
  created_at: string
  updated_at: string
  // Relations
  guru?: Pick<User, 'nama_lengkap' | 'foto_profil'>
}

// ---- MATERI ----
export type TipeFile = 'PDF' | 'PPT' | 'DOC' | 'VIDEO' | 'LINK'

export interface Materi {
  id: string
  guru_id: string
  sekolah_id: string
  judul: string
  mapel: MapelType
  kelas: KelasType
  tipe_file: TipeFile
  file_path?: string
  file_url?: string
  link_url?: string
  deskripsi?: string
  thumbnail_emoji?: string
  download_count: number
  is_publik: boolean
  created_at: string
  updated_at: string
  // Relations
  guru?: Pick<User, 'nama_lengkap' | 'foto_profil'>
}

// ---- PENILAIAN ----
export type StatusPenilaian = 'draft' | 'aktif' | 'selesai' | 'diarsipkan'

export interface Penilaian {
  id: string
  guru_id: string
  sekolah_id: string
  nama_ujian: string
  kelas: KelasType
  mapel: MapelType
  status: StatusPenilaian
  tanggal_ujian?: string
  total_siswa: number
  nilai_kkm: number
  created_at: string
  updated_at: string
  // Relations
  nilai_siswa?: NilaiSiswa[]
  _count?: { nilai_siswa: number }
}

export interface NilaiSiswa {
  id: string
  penilaian_id: string
  nama_siswa: string
  nis?: string
  nilai: number
  catatan?: string
  created_at: string
}

// ---- BERBAGI ----
export interface BerbagiRating {
  id: string
  soal_id?: string
  materi_id?: string
  penilai_id: string
  rating: 1 | 2 | 3 | 4 | 5
  komentar?: string
  created_at: string
  penilai?: Pick<User, 'nama_lengkap' | 'foto_profil'>
}

// ---- NOTIFIKASI ----
export type TipeNotifikasi =
  | 'berbagi_soal'
  | 'pengingat_nilai'
  | 'rating_bintang'
  | 'sistem'
  | 'welcome'

export interface Notifikasi {
  id: string
  user_id: string
  judul: string
  pesan: string
  tipe: TipeNotifikasi
  is_read: boolean
  link?: string
  created_at: string
}

// ---- SUBSCRIPTION ----
export interface SubscriptionPlan {
  id: SubscriptionTier
  nama: string
  harga_bulanan: number
  harga_tahunan: number
  max_guru: number
  max_soal: number
  storage_gb: number
  fitur: string[]
  is_popular?: boolean
}

// ---- FILTER & PAGINATION ----
export interface FilterSoal {
  mapel?: MapelType
  kelas?: KelasType
  level?: LevelSoal
  jenis_soal?: JenisSoal
  search?: string
  is_publik?: boolean
}

export interface FilterMateri {
  mapel?: MapelType
  kelas?: KelasType
  tipe_file?: TipeFile
  search?: string
  is_publik?: boolean
}

export interface PaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  error?: string
}

// ---- DASHBOARD STATS ----
export interface DashboardStats {
  total_soal: number
  total_materi: number
  penilaian_aktif: number
  soal_dibagikan: number
  persentase_lulus?: number
}
