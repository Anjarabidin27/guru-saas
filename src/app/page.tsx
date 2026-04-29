import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteConfig } from '@/lib/actions/settings'

export const metadata: Metadata = {
  title: 'WiyataGuru Enterprise — Infrastruktur Digital Pendidikan',
  description: 'Platform manajemen data instruksional & penilaian bagi pendidik berskala institusi.',
}

// Fallback jika DB kosong
const FALLBACK = {
  branding_name: 'WiyataGuru',
  hero_title: 'Kembalikan Fokus Pada Pendidikan, Bukan Administrasi.',
  hero_subtitle: 'WiyataGuru membebaskan guru dari beban rekapitulasi data manual. Kelola bank soal, materi, dan hitung nilai kelas dalam satu ekosistem terpadu.',
  hero_image_url: '/indonesian_teacher_classroom_1776477599101.png',
  
  stats_guru: '1.2K+',
  stats_soal: '80K+',

  masalah_headline: 'Realitas Lapangan',
  masalah_title: 'Waktu Pendidik Tersita Untuk Administrasi.',
  masalah_1_title: 'File Soal Rawan Hilang & Berceceran',
  masalah_1_desc: 'Berapa kali Anda mencari dokumen Word berisi soal UTS tahun lalu di laptop atau grup WhatsApp yang kedaluwarsa?',
  masalah_2_title: 'Spreadsheet Nilai Yang Rumit',
  masalah_2_desc: 'Memindahkan nilai siswa satu per satu ke Excel, menghitung agregat KKM, dan menyusun laporan secara manual memakan waktu berhari-hari.',

  resolusi_headline: 'Resolusi WiyataGuru',
  resolusi_title: 'Sistem Otomatisasi Terpusat.',
  resolusi_item_1: 'Penyimpanan Soal Cloud Tanpa Batas',
  resolusi_item_2: 'Kategorisasi (HOTS/MOTS/LOTS) Instan',
  resolusi_item_3: 'Rekapitulasi KKM Real-time Automatis',
  resolusi_item_4: 'Sistem Pembagian Materi per Kelas',

  feature_1_img: '/indonesian_school_tech_1776477643917.png',
  feature_2_img: '/indonesian_students_collaboration_1776477620145.png',
  
  security_title: 'Sistem Aman ber-Standar Nasional.',
  security_desc: 'Kami menetapkan proteksi privasi setingkat perbankan. Seluruh basis data guru dan nilai siswa Anda diisolasi per instansi tanpa risiko kebocoran publik. Infrastruktur dioptimalkan untuk menyokong kurikulum Dinas Pendidikan Indonesia.',
  
  cta_title: 'Berhenti Menguras Waktu Anda.\nOtomatisasi Mulai Hari Ini.',
  cta_subtitle: 'Tinggalkan spreadsheet kuno, bergabung dengan ribuan pendidik moderen yang menyerahkan beban administrasi pada sistem kami.'
}

const LOGO_LOKAL = '/tutwuri.svg' // Menggunakan SVG lokal yang disediakan user

export default async function LandingPage() {
  const config = await getSiteConfig()
  const getVal = (key: keyof typeof FALLBACK) => config[key] || FALLBACK[key]

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden selection:bg-blue-900 selection:text-white">
      
      {/* ══════ ENTERPRISE NAVBAR ══════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <img src={LOGO_LOKAL} alt="Tut Wuri Handayani" className="w-9 h-9 object-contain drop-shadow-sm" />
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg leading-none">{getVal('branding_name')}</span>
                <span className="text-[9px] font-black text-blue-600 tracking-[0.2em] uppercase mt-[1px]">Infrastruktur Guru 🇮🇩</span>
              </div>
            </Link>
            <div className="hidden lg:block w-px h-6 bg-slate-200" />
            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <a href="#masalah" className="hover:text-slate-900 transition-colors">Resolusi</a>
              <a href="#fitur" className="hover:text-slate-900 transition-colors">Modul Sistem</a>
              <a href="#lisensi" className="hover:text-slate-900 transition-colors">Lisensi B2B</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2 border border-transparent hover:border-slate-200 rounded-md transition-all">
              PORTAL ADMIN
            </Link>
            <Link href="/register" className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-md hover:bg-blue-600 transition-all shadow-sm">
              GABUNG INSTANSI
            </Link>
          </div>
        </div>
      </header>

      {/* ══════ HERO COMMAND CENTER ══════ */}
      <section className="pt-28 pb-16 px-6 bg-batik-modern border-b border-slate-200 relative">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* L: Typografi Padat */}
            <div className="lg:col-span-6 pt-4 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 mb-6 shadow-sm">
                 <img src={LOGO_LOKAL} className="w-3 h-3 grayscale opacity-60" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.1em]">Sesuai Kurikulum Pendidikan Nasional</span>
              </div>
              <h1 className="text-5xl lg:text-[60px] font-black leading-[1.05] tracking-tighter text-slate-900 mb-6">
                {getVal('hero_title')}
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed font-medium mb-8 max-w-lg">
                {getVal('hero_subtitle')}
              </p>
              <div className="flex items-center gap-3">
                <Link href="/register" className="bg-blue-700 text-white text-xs font-black uppercase tracking-widest px-6 py-4 hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-2">
                  Aktifkan Ruang Kerja <span className="text-sm">→</span>
                </Link>
                <Link href="/login" className="bg-white border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-widest px-6 py-4 hover:bg-slate-50 transition-colors shadow-sm">
                  PORTAL GURU
                </Link>
              </div>
              
              {/* Metrik Batemen */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-slate-200 w-fit">
                <div>
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">{getVal('stats_guru')}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">Pendidik Terdaftar</div>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div>
                  <div className="text-3xl font-black text-blue-700 tracking-tighter">{getVal('stats_soal')}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">Butir Soal Aman</div>
                </div>
              </div>
            </div>

            {/* R: Mockup UI Super Padat / Bento Grid Hero */}
            <div className="lg:col-span-6 relative animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white border border-slate-200 shadow-2xl shadow-blue-900/10 rounded-sm p-2 flex flex-col gap-2 relative z-10">
                <div className="h-8 bg-slate-50 flex items-center px-4 gap-2 border-b border-slate-100 mb-2">
                   <div className="w-2 h-2 rounded-full bg-red-400" />
                   <div className="w-2 h-2 rounded-full bg-amber-400" />
                   <div className="w-2 h-2 rounded-full bg-emerald-400" />
                   <span className="ml-4 text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">SYS//DASHBOARD_LIVE</span>
                </div>
                
                {/* Image Inside Fake IDE Wrapper */}
                <div className="relative aspect-[4/3] w-full overflow-hidden border border-slate-100 bg-slate-100">
                   <img src={getVal('hero_image_url')} alt="Lingkungan Guru" className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 opacity-90" />
                   
                   {/* Overlay Metric Glass */}
                   <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 border border-white shadow-xl flex justify-between items-center">
                      <div>
                        <div className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Indikator Lulus</div>
                        <div className="text-xl font-black text-emerald-600">85% Siswa Kelas XII</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black">📈</div>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════ SOCIAL PROOF / LOGO BAR ══════ */}
      <div className="py-8 bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center gap-6">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap hidden md:block">Dipercaya Oleh :</span>
           <div className="flex-1 flex gap-12 items-center justify-start md:justify-around opacity-40 grayscale pointer-events-none overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <span className="font-bold text-lg tracking-tight whitespace-nowrap">SMA NEGERI 1 JAWABARAT</span>
              <span className="font-bold text-lg tracking-tight whitespace-nowrap">YAYASAN PENDIDIKAN</span>
              <span className="font-bold text-lg tracking-tight whitespace-nowrap">BINA NUSANTARA</span>
              <span className="font-bold text-lg tracking-tight whitespace-nowrap">PGRI PUSAT</span>
           </div>
        </div>
      </div>

      {/* ══════ PAIN POINTS VS RESOLUTIONS ══════ */}
      <section id="masalah" className="py-24 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">{getVal('masalah_headline')}</h2>
              <h3 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-8 leading-tight">{getVal('masalah_title')}</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black shrink-0">✕</div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{getVal('masalah_1_title')}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{getVal('masalah_1_desc')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black shrink-0">✕</div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{getVal('masalah_2_title')}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{getVal('masalah_2_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-enterprise-dark-grid p-10 border border-slate-800 relative shadow-2xl">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">{getVal('resolusi_headline')}</h2>
              <h3 className="text-3xl font-black text-white tracking-tighter mb-8">{getVal('resolusi_title')}</h3>
              
              <ul className="space-y-4">
                 <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</span>
                    {getVal('resolusi_item_1')}
                 </li>
                 <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</span>
                    {getVal('resolusi_item_2')}
                 </li>
                 <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</span>
                    {getVal('resolusi_item_3')}
                 </li>
                 <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</span>
                    {getVal('resolusi_item_4')}
                 </li>
              </ul>
              
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full" />
            </div>
        </div>
      </section>

      {/* ══════ BENTO GRID FEATURES ══════ */}
      <section id="fitur" className="py-24 px-6 bg-white">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 mb-12">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Arsitektur Modul</h2>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Kapabilitas Sistem Utama</h3>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-right max-w-xs mt-4 md:mt-0">
              Infrastruktur terintegrasi lintas fungsionalitas pendidik.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 auto-rows-[340px]">
             
             {/* Bento 1: Large Panel */}
              <div className="md:col-span-2 bg-slate-50 border border-slate-200 p-8 shadow-sm flex items-end relative overflow-hidden group hover:border-slate-300 transition-all">
                <img src={getVal('feature_1_img')} alt="Bank Soal" className="absolute top-0 right-0 w-3/4 h-full object-cover object-left opacity-80 group-hover:opacity-100 transition-opacity transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/40 to-transparent" />
                
                <div className="relative z-10 max-w-md">
                  <div className="text-[10px] px-2 py-1 bg-slate-900 text-white font-bold uppercase tracking-widest w-fit mb-4">MODUL 01</div>
                  <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tight uppercase">Bank Soal Terdistribusi</h4>
                  <p className="text-sm font-bold text-slate-900 leading-relaxed border-l-2 border-blue-600 pl-3">
                    Manajemen metadata soal meliputi tagging LOTS/HOTS, kompetensi dasar, hingga pengarsipan tak terbatas layaknya laci digital permanen.
                  </p>
                </div>
             </div>

             {/* Bento 2: Tall Vertical Panel */}
             <div className="bg-enterprise-dark-grid border border-slate-800 p-8 shadow-sm flex flex-col relative overflow-hidden group">
                {/* Data visualization background for clarity */}
                <img src="/indonesian_school_tech_1776477643917.png" alt="Data" className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[10%] group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent" />
                
                <div className="relative z-10">
                   <div className="text-[10px] px-2 py-1 bg-white text-slate-900 font-bold uppercase tracking-widest w-fit mb-4">MODUL 02</div>
                <h4 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">Penilaian Pintar</h4>
                <p className="text-sm font-bold text-slate-100 leading-relaxed mb-8 border-l-2 border-emerald-500 pl-3">
                  Pencatatan rekapitulasi nilai berbasis KKM. Hitung agregasi kelulusan & pergeseran rata-rata terjadi sedetik setelah input pertama.
                </p>
                {/* UI Element Mockup inside Box */}
                <div className="mt-auto bg-slate-800 border border-slate-700 p-4 font-mono text-[10px] text-emerald-400 shadow-inner">
                   &gt; SELECT AVG(skor) FROM nilai; <br/>
                   ... Analitik Proses <br/>
                   [LULUS] Ambang Batas Aman
                </div>
                 </div>
              </div>

             {/* Bento 3: Standard Box */}
              <div className="bg-white border border-slate-200 p-8 shadow-sm relative overflow-hidden flex flex-col justify-between group h-full">
                {/* Visual Graphic Background - Much Clearer */}
                <img src={getVal('feature_2_img')} alt="Materi Digital" className="absolute bottom-0 right-0 w-full h-full object-cover object-left-top opacity-60 group-hover:opacity-80 transition-opacity grayscale-[10%] transition-all" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/40 to-transparent pointer-events-none" />

                <div className="relative z-10">
                   <div className="text-[10px] px-2 py-1 bg-blue-600 text-white font-bold uppercase tracking-widest w-fit mb-4">MODUL 03</div>
                   <h4 className="text-xl font-black text-slate-900 mb-2 tracking-tight uppercase">Rak Materi Digital</h4>
                   <p className="text-sm font-bold text-slate-900 leading-relaxed border-l-2 border-blue-400 pl-3">
                     Unggah bahan ajar berbentuk Dokumen, Slide, atau Video secara terstruktur per kurikulum dan kelas mata pelajaran spesifik.
                   </p>
                </div>
                
                {/* File UI Mock */}
                <div className="relative z-10 mt-8 mb-4">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 text-[10px] font-bold text-slate-500 uppercase">
                    <span className="w-4 h-4 bg-red-100 text-red-500 flex items-center justify-center">P</span>
                    Modul_Sejarah_XII.pdf
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 text-[10px] font-bold text-slate-500 uppercase mt-1">
                    <span className="w-4 h-4 bg-orange-100 text-orange-500 flex items-center justify-center">S</span>
                    Presentasi_Bab_1.ppt
                  </div>
                </div>

                <div className="w-full h-1 bg-slate-100 overflow-hidden relative z-10"><div className="w-2/3 h-full bg-blue-600" /></div>
             </div>

             {/* Bento 4: Wide Strip with photo */}
              <div className="md:col-span-2 bg-slate-50 border border-slate-200 p-8 shadow-sm flex items-end relative overflow-hidden group hover:border-slate-300 transition-all">
                  {/* Real photo of students/school - Much Clearer */}
                  <img src={getVal('feature_2_img')} alt="Kolaborasi Siswa" className="absolute top-0 right-0 w-4/5 h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/60 to-transparent" />

                 <div className="relative z-10 max-w-sm">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-700 to-indigo-900" />
                   <div className="text-[10px] px-2 py-1 bg-indigo-800 text-white font-bold uppercase tracking-widest w-fit mb-4">MODUL 04</div>
                   <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tight uppercase">Integrasi Skala Institusi</h4>
                   <p className="text-sm font-bold text-slate-900 leading-relaxed border-l-2 border-indigo-600 pl-3">
                     Satu akun Admin Sekolah dapat memonitor ratusan guru, mengatur lisensi kolektif, dan mengakses laporan kinerja keseluruhan secara terpusat.
                   </p>
                 </div>
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-700 to-indigo-900" />
             </div>

          </div>
        </div>
      </section>

      {/* ══════ SECURITY & STANDARDIZATION ══════ */}
      <section className="py-20 px-6 bg-slate-900 text-white text-center">
         <div className="max-w-4xl mx-auto">
            <img src={LOGO_LOKAL} className="mx-auto w-16 h-16 grayscale opacity-80 mb-8" />
            <h3 className="text-3xl font-black tracking-tighter mb-4">{getVal('security_title')}</h3>
            <p className="text-sm font-medium text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              {getVal('security_desc')}
            </p>
            <div className="grid grid-cols-3 gap-6 border-t border-slate-800 pt-12">
               <div>
                 <div className="text-xl font-black text-emerald-400 mb-1">Enkripsi RLS</div>
                 <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Proteksi Data Silang</div>
               </div>
               <div>
                 <div className="text-xl font-black text-emerald-400 mb-1">Cloud Native</div>
                 <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Akses Kapan Pun</div>
               </div>
               <div>
                 <div className="text-xl font-black text-emerald-400 mb-1">Format Resmi</div>
                 <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Siap Export Laporan</div>
               </div>
            </div>
         </div>
      </section>

      {/* ══════ ENTERPRISE PRICING ══════ */}
      <section id="lisensi" className="py-24 px-6 bg-enterprise-grid">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between border-b border-slate-300 pb-6 mb-12">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-blue-700 mb-2">Lisensi Layanan B2B</h2>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Struktur Pembiayaan Instansi</h3>
            </div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest text-right max-w-xs mt-4 md:mt-0">
              Model SaaS berlangganan murni tanpa biaya instalasi selubung.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-0 border border-slate-300 shadow-sm bg-white">
            <PricingCard strict 
                title="Guru Individu Dasar" 
                price="Rp 0" 
                desc="Lisensi evaluasi independen bagi pendidik sebelum *deployment* utuh." 
                features={['50 Soal Alokasi', '500MB Batas Storage', 'Modul Penilaian Dasar']}
                cta="Gunakan Akun Dasar"
            />
            <div className="border-x border-slate-300 bg-slate-50 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-blue-700" />
               <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-[9px] font-black uppercase px-2 py-1 rounded-sm border border-blue-200">Rekomendasi</div>
               <PricingCard strict 
                   title="Lisensi Pendidik Pro" 
                   price="Rp 49rb" 
                   desc="Menghapus batas *limit* untuk produktivitas kelas tanpa hambatan operasional." 
                   features={['Soal Unlimited', '5GB Batas Storage', 'Export Raport Lanjut', 'Prioritas Render Server']}
                   cta="UPGRADE PRO AKTIF"
                   isPro
               />
            </div>
            <PricingCard strict 
                title="Lisensi Skala Sekolah" 
                price="Custom" 
                desc="Arsitektur tertutup dengan panel sentral untuk Yayasan dan Kepala Sekolah." 
                features={['Global Admin Dashboard', 'Manajemen Ratusan Guru', 'Kontrol Akses Instansi', 'Analitik Data Keseluruhan']}
                cta="KONSULTASI TIM SALES"
            />
          </div>
        </div>
      </section>

      {/* ══════ GIANT CTA SECTION ══════ */}
      <section className="py-24 px-6 bg-blue-700 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent pointer-events-none" />
         <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div>
               <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-6 leading-tight whitespace-pre-line">{getVal('cta_title')}</h2>
               <p className="text-sm font-medium text-blue-200 max-w-xl leading-relaxed">
                 {getVal('cta_subtitle')}
               </p>
            </div>
            <div className="flex flex-col gap-4 min-w-[280px]">
               <Link href="/register" className="bg-white text-blue-900 font-black text-sm uppercase tracking-widest px-8 py-5 text-center shadow-2xl hover:bg-slate-50 hover:scale-[1.02] transition-transform">
                  DAFTARKAN INSTITUSI ↗
               </Link>
               <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest text-center">Gratis, Langsung Otentikasi.</span>
            </div>
         </div>
      </section>

      {/* ══════ INDUSTRIAL FOOTER ══════ */}
      <footer className="bg-slate-900 py-16 px-6 text-slate-300">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-5 gap-10">
          
          <div className="col-span-2">
             <div className="flex items-center gap-3 mb-6">
                <img src={LOGO_LOKAL} alt="Logo" className="w-8 h-8 opacity-40 grayscale" />
                <span className="font-extrabold text-white tracking-widest uppercase text-xl">{getVal('branding_name')}</span>
             </div>
             <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-sm mb-6">
               Infrastruktur perangkat lunak B2B khusus pendidik dan instansi sekolah di Indonesia. Berfokus pada densitas data dan otomasi administratif.
             </p>
             <div className="text-[10px] font-mono text-slate-600">SYS_BUILD: ENTR-24</div>
          </div>
          
          <FooterNav title="Sistem Utama" links={['Basis Data Soal', 'Distribusi Materi', 'Mesin Rekapitulasi', 'Lisensi Institusi']} />
          <FooterNav title="Konektivitas" links={['Otentikasi Portal', 'Sinkronisasi Jaringan', 'Status Operasional', 'Bantuan Teknis']} />
          <FooterNav title="Korporat" links={['Klausul Privasi', 'SLA Layanan', 'Keamanan Transmisi', 'Hubungi Kami']} />
          
        </div>
        <div className="max-w-[1400px] mx-auto mt-16 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
           <p>© 2026 {getVal('branding_name')} SECURE SYSTEM.</p>
           <p>TUT WURI HANDAYANI — REPUBLIK INDONESIA</p>
        </div>
      </footer>

    </div>
  )
}

function PricingCard({ title, price, desc, features, cta, isPro }: any) {
    return (
        <div className="p-10 flex flex-col h-full hover:bg-slate-50/50 transition-colors">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{title}</h4>
            <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">{price}</span>
                {price !== 'Custom' && <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/BLN</span>}
            </div>
            <p className="text-xs font-semibold text-slate-500 mb-8 max-w-[200px] line-clamp-3 h-12 leading-relaxed">{desc}</p>
            
            <ul className="space-y-4 flex-1 mb-12 border-t border-slate-200 pt-6">
                {features.map((f: string) => (
                    <li key={f} className="flex items-center gap-3 text-xs font-bold text-slate-700 uppercase tracking-wide">
                        <span className={cn("w-1.5 h-1.5", isPro ? "bg-blue-600" : "bg-slate-300")} />
                        {f}
                    </li>
                ))}
            </ul>
            
            <Link href="/register" className={cn(
                "w-full py-4 text-[10px] font-black tracking-widest uppercase transition-all text-center block border",
                isPro ? "bg-blue-700 border-blue-700 text-white hover:bg-blue-800 shadow-xl shadow-blue-900/10" : "bg-transparent border-slate-300 text-slate-700 hover:bg-white"
            )}>
                {cta}
            </Link>
        </div>
    )
}

function FooterNav({ title, links }: { title: string, links: string[] }) {
  return (
    <div>
      <h5 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-[10px]">{title}</h5>
      <ul className="flex flex-col gap-3 text-xs font-semibold text-slate-500">
        {links.map((link, i) => (
          <li key={i}><a href="#" className="hover:text-blue-600 transition-colors">{link}</a></li>
        ))}
      </ul>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
