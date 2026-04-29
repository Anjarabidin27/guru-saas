import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getGreeting, cn } from '@/lib/utils'
import { FileText, FileSpreadsheet, Presentation, User, School, BookOpen, PenTool } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [soalRes, materiRes, profileRes] = await Promise.all([
    supabase.from('soal').select('id', { count: 'exact', head: true }).eq('guru_id', user?.id ?? ''),
    supabase.from('materi').select('id', { count: 'exact', head: true }).eq('guru_id', user?.id ?? ''),
    supabase.from('profiles').select('nama_lengkap, mapel_utama, sekolah:sekolah_id(nama)').eq('id', user?.id ?? '').single(),
  ])

  const totalSoal = soalRes.count ?? 0
  const totalMateri = materiRes.count ?? 0
  const profile = profileRes.data
  const namaGuru = profile?.nama_lengkap ?? user?.email ?? 'Guru'
  const namaSekolah = (profile?.sekolah as any)?.nama ?? 'Belum terhubung ke institusi'

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-6 relative">
      
      {/* Subtle Background Pattern - Official Parang Watermark */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none -z-10"
        style={{ 
          backgroundImage: 'url(/batik_parang.png)', 
          backgroundSize: '400px',
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Header Adiwiyata - Formal & Compact */}
      <div className="bg-[#004c8c] border-b-[6px] border-amber-400 p-6 relative overflow-hidden group rounded-t-2xl shadow-none">
        {/* Subtle Overlay Batik for Header */}
        <div 
          className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay transition-opacity group-hover:opacity-[0.1]"
          style={{ 
            backgroundImage: 'url(/batik_parang.png)', 
            backgroundSize: '240px'
          }}
        />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
             <div className="p-2 bg-white rounded-xl flex-shrink-0 border-2 border-amber-400 shadow-none">
                <img src="/tutwuri.svg" alt="Tut Wuri Handayani" className="w-8 h-8" />
             </div>
             <div>
                <h1 className="text-2xl font-black text-white tracking-tight leading-none mb-2 uppercase">
                  {getGreeting()}, <span className="text-amber-400">{namaGuru}</span>
                </h1>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                   <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em]">Sistem Informasi Pendidik Terpadu</p>
                </div>
             </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-xs font-black text-white/80">
            <span className="flex items-center gap-2.5 bg-black/20 px-4 py-2.5 rounded-lg border border-white/10">
               <School className="w-4 h-4 text-amber-400" /> {namaSekolah}
            </span>
            <span className="flex items-center gap-2.5 bg-black/20 px-4 py-2.5 rounded-lg border border-white/10">
               <BookOpen className="w-4 h-4 text-amber-400" /> {profile?.mapel_utama || 'Tandai Mapel Utama'}
            </span>
          </div>
        </div>
      </div>

      {/* Statistik Operasional - Clean Flat Design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Indeks Soal', val: totalSoal, color: 'text-[#004c8c]', sub: 'Dokumen Terverifikasi' },
           { label: 'Arsip Materi', val: totalMateri, color: 'text-[#004c8c]', sub: 'Bahan Ajar Digital' },
           { label: 'Standardisasi', val: 'ST-NASIONAL', color: 'text-amber-600', sub: 'PDF, DOCX, PPTX' },
           { label: 'Integritas', val: 'AMAN', color: 'text-emerald-600', sub: 'Proteksi Data Guru' },
         ].map((stat, i) => (
            <div key={i} className="bg-white border-2 border-slate-200 p-6 hover:border-[#004c8c] transition-colors relative group">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{stat.label}</p>
               <p className={cn("font-black mt-3 leading-none", typeof stat.val === 'number' ? 'text-4xl' : 'text-lg', stat.color)}>
                  {stat.val}
               </p>
               <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.sub}</p>
               </div>
            </div>
         ))}
      </div>

      {/* Konsul & Bursa - Professional Block */}
      <div className="bg-white border-2 border-slate-200 mt-4 overflow-hidden shadow-none">
         <div className="bg-[#004c8c] border-b-2 border-amber-400 px-8 py-3 flex items-center justify-between">
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Pusat Komando Instruksional</h2>
            <div className="flex gap-1.5 opacity-30">
               <div className="w-1.5 h-1.5 rounded-full bg-white" />
               <div className="w-1.5 h-1.5 rounded-full bg-white" />
               <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
         </div>
         
         <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Action 1 */}
            <div className="border border-slate-200 p-8 hover:bg-slate-50 transition-all flex flex-col justify-between group">
               <div>
                  <div className="flex items-center gap-5 mb-6">
                     <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 group-hover:bg-[#004c8c] transition-colors">
                        <FileText className="w-7 h-7 text-[#004c8c] group-hover:text-white" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Manajemen Soal</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cetak & Distribusi</p>
                     </div>
                  </div>
                  <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed">
                     Akses direktori bank soal pribadi Anda. Sistem memfasilitasi pembuatan naskah ujian otomatis lengkap dengan <strong>KOP Sekolah Resmi</strong> dalam format PDF dan Word.
                  </p>
               </div>
               <Link href="/dashboard/bank-soal" className="block text-center w-full bg-[#004c8c] text-white font-black text-sm py-4 px-6 hover:bg-[#003a6d] transition-all uppercase tracking-[0.2em]">
                  Proses Bank Soal ↗
               </Link>
            </div>

            {/* Action 2 */}
            <div className="border border-slate-200 p-8 hover:bg-slate-50 transition-all flex flex-col justify-between group">
               <div>
                  <div className="flex items-center gap-5 mb-6">
                     <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 group-hover:bg-[#004c8c] transition-colors">
                        <Presentation className="w-7 h-7 text-[#004c8c] group-hover:text-white" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Gudang Materi</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Learning Center</p>
                     </div>
                  </div>
                  <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed">
                     Pusat penyimpanan bahan ajar lintas media. Transformasikan dokumen naratif Anda menjadi <strong>Slide Presentasi (PPT)</strong> secara instan untuk efisiensi mengajar pagi ini.
                  </p>
               </div>
               <Link href="/dashboard/materi" className="block text-center w-full bg-[#004c8c] text-white font-black text-sm py-4 px-6 hover:bg-[#003a6d] transition-all uppercase tracking-[0.2em]">
                  Buka Gudang Materi ↗
               </Link>
            </div>

         </div>
         
         <div className="bg-slate-100 border-t border-slate-200 px-8 py-3 text-center">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">WIYATAGURU — PENJAGA NYALA API PENGETAHUAN</span>
         </div>
      </div>

    </div>
  )
}
