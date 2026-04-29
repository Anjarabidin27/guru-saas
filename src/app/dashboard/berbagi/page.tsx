'use client'

import { cn } from '@/lib/utils'
import { Search, Star, Download, Sparkles, Filter, ChevronRight, Bookmark } from 'lucide-react'

const sharedItems = [
  {
    id: '1', type: 'Soal Ujian', guru: 'Sari Rahayu, M.Pd.', mapel: 'Matematika Terapan', kelas: 'XII',
    title: 'Mastering Eksponen & Logaritma—Paket Intensif UTBK',
    desc: 'Berisi 45 soal HOTS dengan analisis langkah penyelesaian lengkap bergambar.',
    rating: 4.9, reviews: 324, downloads: '1.2k',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=sari&backgroundColor=e2e8f0',
    coverGrad: 'from-blue-500 to-cyan-400',
    tags: ['UTBK', 'HOTS', 'Matematika']
  },
  {
    id: '2', type: 'Modul Interaktif', guru: 'Budi Santoso, S.Si.', mapel: 'Fisika Kuantum', kelas: 'XI',
    title: 'Visualisasi Gerak Parabola Murni: Animasi & Lembar Kerja',
    desc: 'Slide presentasi interaktif dengan simulasi kinetik yang siap dipresentasikan.',
    rating: 4.7, reviews: 128, downloads: '840',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=budi&backgroundColor=e2e8f0',
    coverGrad: 'from-orange-500 to-rose-500',
    tags: ['Animasi', 'SlideDeck', 'Fisika']
  },
  {
    id: '3', type: 'Rencana Belajar', guru: 'Anita Wijaya, S.S.', mapel: 'Sastra Nusantara', kelas: 'X',
    title: 'RPP Kurikulum Merdeka: Kajian Puisi Kontemporer',
    desc: 'Pedoman mengajar komplit dengan rubrik penilaian berbasis proyek kreatif.',
    rating: 4.8, reviews: 290, downloads: '2.5k',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=anita&backgroundColor=e2e8f0',
    coverGrad: 'from-violet-500 to-fuchsia-500',
    tags: ['K-Merdeka', 'RPP', 'Sastra']
  },
  {
    id: '4', type: 'Lembar Ujian', guru: 'Dedi Kusuma, B.Ed.', mapel: 'Kecerdasan Buatan', kelas: 'XII',
    title: 'Instrumen Penilaian Akhir Bahasa Pemrograman Python',
    desc: 'Paket koding dasar untuk siswa SMA dilengkapi dengan dataset mini.',
    rating: 4.6, reviews: 85, downloads: '342',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=dedi&backgroundColor=e2e8f0',
    coverGrad: 'from-emerald-400 to-teal-500',
    tags: ['Informatika', 'Python', 'A/B Test']
  },
]

const categories = ['Semua Kategori', 'Modul Ajar', 'Bank Soal Terverifikasi', 'Rencana Pembelajaran (RPP)', 'Media Interaktif', 'Buku Digital']

export default function KomunitasBerbagiPremium() {
  return (
    <div className="flex flex-col gap-6 text-slate-900 pb-20 max-w-7xl mx-auto py-2">
      
      {/* Decorative Official Watermark - Parang Continuity */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{ 
          backgroundImage: 'url(/batik_parang.png)', 
          backgroundSize: '300px'
        }}
      />

      {/* Header Pusat Arsip - Berwibawa & Fungsional */}
      <div className="bg-[#004c8c] border-b-[6px] border-amber-400 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden group shadow-none">
        {/* Subtle Overlay Batik for Header */}
        <div 
          className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay transition-opacity group-hover:opacity-[0.1]"
          style={{ 
            backgroundImage: 'url(/batik_parang.png)', 
            backgroundSize: '220px'
          }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#004c8c] border-2 border-amber-400 shadow-none">
                <Search className="w-5 h-5" />
             </div>
             <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">Bursa Literasi Nusantara</h1>
          </div>
          <p className="text-white/70 text-sm font-bold uppercase tracking-widest">
             Akses Terpusat Naskah & Modul Pendidik Terverifikasi Nasional.
          </p>
        </div>
        
        {/* Formal Global Search Integration */}
        <div className="relative flex-1 max-w-lg group/search">
           <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/search:text-amber-400 transition-colors" />
           <input 
              type="text" 
              placeholder="Cari kurikulum, kode soal, atau materi..."
              className="w-full bg-black/20 border-2 border-white/20 text-white pl-14 pr-6 py-4 text-base font-black placeholder:text-white/30 placeholder:font-bold outline-none focus:border-amber-400 focus:bg-black/30 transition-all shadow-none"
           />
        </div>

        <button className="bg-white text-[#004c8c] font-black px-8 py-4 border-2 border-amber-400 hover:bg-amber-400 hover:text-white transition-all text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-none active:scale-95">
          <Download className="w-5 h-5" />
          Unggah Dokumen
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full px-0">
         {/* National Category Index */}
         <div className="flex items-center justify-between mb-6 bg-slate-100 p-3 border-l-4 border-[#004c8c]">
            <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-hide">
               <span className="text-[10px] font-black text-[#004c8c] uppercase tracking-[0.3em] whitespace-nowrap pl-2">Klasifikasi:</span>
               {categories.map((cat, i) => (
                  <button key={i} className={cn(
                     "whitespace-nowrap px-6 py-2.5 font-black text-xs transition-all duration-300 border-2",
                     i === 0 
                        ? "bg-[#004c8c] text-white border-[#004c8c]" 
                        : "bg-white text-slate-500 border-slate-200 hover:border-[#004c8c] hover:text-[#004c8c]"
                  )}>
                     {cat}
                  </button>
               ))}
            </div>
         </div>
         {/* Grid Cards (Glassmorphic + Vibrant) */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sharedItems.map(item => (
               <div key={item.id} className="group relative bg-white border border-slate-200 rounded-[2rem] p-3 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col hover:-translate-y-1">
                  
                  {/* Card Image Banner */}
                  <div className={cn("relative w-full h-40 rounded-[1.5rem] p-5 flex flex-col justify-between overflow-hidden bg-gradient-to-br", item.coverGrad)}>
                     {/* Glass Overlay Top */}
                     <div className="flex justify-between items-start relative z-10">
                        <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                           {item.type}
                        </span>
                        <button className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-slate-900 text-white transition-colors">
                           <Bookmark className="w-4 h-4" />
                        </button>
                     </div>
                     <div className="relative z-10 flex items-center gap-2 overflow-hidden">
                        {item.tags.map(tag => (
                           <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-white/80 bg-black/20 px-2 py-1 rounded-md backdrop-blur-sm border border-white/10">
                              #{tag}
                           </span>
                        ))}
                     </div>
                     {/* Decorative background circle */}
                     <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col">
                     <div className="flex items-center gap-3 -mt-8 relative z-20 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-md border border-slate-100">
                           <div className="w-full h-full rounded-xl bg-slate-100 overflow-hidden">
                              <img src={item.avatar} alt={item.guru} className="w-full h-full object-cover" />
                           </div>
                        </div>
                        <div className="pt-4">
                           <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-none mb-1">{item.guru}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.mapel}</p>
                        </div>
                     </div>

                     <h3 className="text-lg font-extrabold text-slate-900 leading-snug mb-2 line-clamp-2">
                        {item.title}
                     </h3>
                     <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6 line-clamp-2">
                        {item.desc}
                     </p>

                     <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex gap-4">
                           <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-black text-slate-900">{item.rating}</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <Download className="w-4 h-4 text-emerald-500" />
                              <span className="text-sm font-black text-slate-900">{item.downloads}</span>
                           </div>
                        </div>

                        <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all shadow-sm">
                           <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                     </div>
                  </div>

               </div>
            ))}
         </div>
      </div>
    </div>
  )
}
