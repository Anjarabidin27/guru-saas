import { type SubscriptionPlan } from '@/types'

/** Semua paket subscription yang tersedia */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'gratis',
    nama: 'Gratis',
    harga_bulanan: 0,
    harga_tahunan: 0,
    max_guru: 1,
    max_soal: 50,
    storage_gb: 0.5,
    fitur: [
      '50 soal',
      '500MB penyimpanan',
      'Bank soal dasar',
      'Upload materi (terbatas)',
    ],
  },
  {
    id: 'guru_pro',
    nama: 'Guru Pro',
    harga_bulanan: 49000,
    harga_tahunan: 490000,
    max_guru: 1,
    max_soal: -1, // unlimited
    storage_gb: 5,
    fitur: [
      'Soal tidak terbatas',
      '5GB penyimpanan',
      'Generate paket soal',
      'Export PDF soal & nilai',
      'Berbagi soal ke komunitas',
      'Laporan & analitik',
    ],
  },
  {
    id: 'guru_premium',
    nama: 'Guru Premium',
    harga_bulanan: 89000,
    harga_tahunan: 890000,
    max_guru: 1,
    max_soal: -1,
    storage_gb: 20,
    is_popular: true,
    fitur: [
      'Semua fitur Guru Pro',
      '20GB penyimpanan',
      'AI bantu buat soal ✨',
      'AI bantu buat materi ✨',
      'Analitik soal detail',
      'Prioritas support',
    ],
  },
  {
    id: 'sekolah_basic',
    nama: 'Sekolah Basic',
    harga_bulanan: 299000,
    harga_tahunan: 2990000,
    max_guru: 20,
    max_soal: 5000,
    storage_gb: 10,
    fitur: [
      '20 akun guru',
      '5.000 soal',
      '10GB penyimpanan bersama',
      'Admin panel sekolah',
      'Laporan per kelas',
      'Export PDF massal',
    ],
  },
  {
    id: 'sekolah_pro',
    nama: 'Sekolah Pro',
    harga_bulanan: 599000,
    harga_tahunan: 5990000,
    max_guru: -1,
    max_soal: -1,
    storage_gb: 50,
    is_popular: true,
    fitur: [
      'Guru tidak terbatas',
      'Soal tidak terbatas',
      '50GB penyimpanan',
      'AI bantu buat soal & materi ✨',
      'Analitik sekolah menyeluruh',
      'Dedicated support',
    ],
  },
  {
    id: 'sekolah_enterprise',
    nama: 'Enterprise',
    harga_bulanan: 0, // custom
    harga_tahunan: 0,
    max_guru: -1,
    max_soal: -1,
    storage_gb: -1,
    fitur: [
      'Semua fitur Sekolah Pro',
      'Storage tidak terbatas',
      'White-label (nama sekolah)',
      'Integrasi DAPODIK',
      'SLA 99.9% uptime',
      'Onboarding & training',
    ],
  },
]

/** Konstanta daftar mata pelajaran */
export const DAFTAR_MAPEL = [
  'Matematika', 'Fisika', 'Kimia', 'Biologi',
  'Bahasa Indonesia', 'Bahasa Inggris', 'Sejarah',
  'Geografi', 'Ekonomi', 'Sosiologi', 'PAI',
  'PKN', 'Seni Budaya', 'PJOK', 'Informatika', 'Lainnya',
] as const

/** Konstanta daftar kelas */
export const DAFTAR_KELAS = ['X', 'XI', 'XII', 'VII', 'VIII', 'IX'] as const

/** Level soal dengan label */
export const LEVEL_SOAL = {
  LOTS: { label: 'LOTS — Mudah', color: 'text-green-600 bg-green-50', emoji: '😊' },
  MOTS: { label: 'MOTS — Sedang', color: 'text-orange-600 bg-orange-50', emoji: '🤔' },
  HOTS: { label: 'HOTS — Sulit', color: 'text-red-600 bg-red-50', emoji: '🔥' },
} as const

/** Jenis soal dengan label */
export const JENIS_SOAL = {
  pilihan_ganda: { label: 'Pilihan Ganda', emoji: '🔘' },
  uraian: { label: 'Uraian / Essay', emoji: '📋' },
  benar_salah: { label: 'Benar / Salah', emoji: '✓✗' },
} as const

/** Tipe file materi */
export const TIPE_FILE = {
  PDF:   { label: 'PDF', emoji: '📄', accept: '.pdf' },
  PPT:   { label: 'PowerPoint', emoji: '📊', accept: '.ppt,.pptx' },
  DOC:   { label: 'Word', emoji: '📝', accept: '.doc,.docx' },
  VIDEO: { label: 'Video', emoji: '🎥', accept: '.mp4,.mov' },
  LINK:  { label: 'Link Eksternal', emoji: '🔗', accept: '' },
} as const

/** Warna untuk setiap mapel (konsisten) */
export const WARNA_MAPEL: Record<string, string> = {
  'Matematika':       'bg-blue-100 text-blue-700',
  'Fisika':           'bg-orange-100 text-orange-700',
  'Kimia':            'bg-purple-100 text-purple-700',
  'Biologi':          'bg-green-100 text-green-700',
  'Bahasa Indonesia': 'bg-red-100 text-red-700',
  'Bahasa Inggris':   'bg-cyan-100 text-cyan-700',
  'Sejarah':          'bg-amber-100 text-amber-700',
  'Geografi':         'bg-teal-100 text-teal-700',
  'Ekonomi':          'bg-emerald-100 text-emerald-700',
  'Sosiologi':        'bg-pink-100 text-pink-700',
  'PAI':              'bg-lime-100 text-lime-700',
  'PKN':              'bg-indigo-100 text-indigo-700',
  'default':          'bg-gray-100 text-gray-700',
}
