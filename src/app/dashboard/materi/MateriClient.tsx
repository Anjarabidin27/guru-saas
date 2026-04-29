'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Download, Trash2, Presentation, Loader2, Folder, ChevronRight, Home, FileText, MoreVertical, Plus, Filter, Grid, List as ListIcon, HardDrive, Share2, Clock, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { deleteMateriAction } from '@/lib/actions/materi'
import { generateMateriPPT } from '@/lib/services/ppt-factory'

interface Materi {
  id: string
  guru_id: string
  judul: string
  deskripsi: string
  mapel: string
  kelas?: string // Optional for backward compatibility
  file_path: string
  file_type: string
  isi_ekstraksi: string | null
  is_shared: boolean
  created_at: string
}

export default function MateriClient({ initialMateri, profile }: { initialMateri: Materi[], profile: any }) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentFolder, setCurrentFolder] = useState<string | null>(null) // Level 1: Kelas
  const [currentSubject, setCurrentSubject] = useState<string | null>(null) // Level 2: Mapel
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState<string | null>(null)

  // Derived classification
  const materiWithClasses = useMemo(() => {
    return initialMateri.map(m => ({
      ...m,
      kelas: m.kelas || 'Umum' // Default categorization
    }))
  }, [initialMateri])

  // Get unique classes
  const classes = useMemo(() => Array.from(new Set(materiWithClasses.map(m => m.kelas))), [materiWithClasses])
  
  // Filter logic based on hierarchy
  const visibleItems = useMemo(() => {
    let filtered = materiWithClasses
    if (search) {
      return filtered.filter(m => m.judul.toLowerCase().includes(search.toLowerCase()))
    }
    if (currentFolder) {
      filtered = filtered.filter(m => m.kelas === currentFolder)
    }
    if (currentSubject) {
      filtered = filtered.filter(m => m.mapel === currentSubject)
    }
    return filtered
  }, [materiWithClasses, currentFolder, currentSubject, search])

  // Get subjects within current class
  const availableSubjects = useMemo(() => {
    if (!currentFolder) return []
    const classItems = materiWithClasses.filter(m => m.kelas === currentFolder)
    return Array.from(new Set(classItems.map(m => m.mapel)))
  }, [materiWithClasses, currentFolder])

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm('Hapus materi secara permanen?')) return
    setDeletingId(id)
    try {
      await deleteMateriAction(id, filePath)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setDeletingId(null)
    }
  }

  const handleExportPPT = async (materi: Materi) => {
    if (!materi.isi_ekstraksi) return alert('Peringkasan AI belum selesai.')
    setIsExporting(materi.id)
    try {
      const ppt = await generateMateriPPT(
        { judul: materi.judul, mapel: materi.mapel, isi_ekstraksi: materi.isi_ekstraksi },
        profile?.sekolah?.nama || 'Wiyata Nusantara'
      )
      await ppt.writeFile({ fileName: `PPT_${materi.judul}.pptx` })
    } catch (e: any) {
      alert(e.message)
    } finally {
      setIsExporting(null)
    }
  }

  const resetNav = () => {
    setCurrentFolder(null)
    setCurrentSubject(null)
    setSearch('')
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 -mt-10 pt-10">
      
      {/* DRIVE HEADER & NAVIGATION */}
      <div className="max-w-[1440px] mx-auto w-full px-4 lg:px-10 mb-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-2 text-slate-400">
                  <HardDrive size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Wiyata Drive</span>
               </div>
               <nav className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 no-scrollbar">
                  <button onClick={resetNav} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-black transition-all", !currentFolder ? "bg-brand-600 text-white" : "text-slate-500 hover:bg-slate-100")}>
                     <Home size={16} /> Beranda
                  </button>
                  {currentFolder && (
                     <>
                        <ChevronRight size={14} className="text-slate-300 shrink-0" />
                        <button onClick={() => setCurrentSubject(null)} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-black transition-all", currentFolder && !currentSubject ? "bg-brand-600 text-white" : "text-slate-500 hover:bg-slate-100")}>
                           <Folder size={16} /> {currentFolder}
                        </button>
                     </>
                  )}
                  {currentSubject && (
                     <>
                        <ChevronRight size={14} className="text-slate-300 shrink-0" />
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-black bg-brand-600 text-white">
                           <FileText size={16} /> {currentSubject}
                        </button>
                     </>
                  )}
               </nav>
            </div>

            <div className="flex items-center gap-4">
               <div className="relative group flex-1 md:w-64">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                  <input 
                     placeholder="Cari materi..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-brand-50 focus:border-brand-600 transition-all"
                  />
               </div>
               <Link href="/dashboard/materi/upload" className="bg-slate-900 hover:bg-brand-600 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 shadow-xl shadow-slate-200">
                  <Plus size={18} /> <span className="hidden sm:inline">Upload Baru</span>
               </Link>
            </div>
         </div>
      </div>

      {/* MAIN DRIVE CANVAS */}
      <main className="max-w-[1440px] mx-auto w-full px-4 lg:px-10 pb-20">
         
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">
               {search ? 'Hasil Pencarian' : !currentFolder ? 'Daftar Kelas' : currentSubject ? `File di ${currentSubject}` : `Mata Pelajaran di ${currentFolder}`}
            </h3>
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
               <button onClick={() => setViewMode('grid')} className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-slate-100 text-brand-600" : "text-slate-400 hover:text-slate-600")}><Grid size={18}/></button>
               <button onClick={() => setViewMode('list')} className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-slate-100 text-brand-600" : "text-slate-400 hover:text-slate-600")}><ListIcon size={18}/></button>
            </div>
         </div>

         {/* CONDITION 1: ROOT - SHOW CLASSES */}
         {!currentFolder && !search && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
               {classes.map(cls => (
                  <button 
                     key={cls}
                     onClick={() => setCurrentFolder(cls)}
                     className="group flex flex-col p-6 bg-white border border-slate-200 rounded-3xl hover:border-brand-600 hover:shadow-xl hover:shadow-brand-50 transition-all text-left"
                  >
                     <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Folder size={32} fill="currentColor" fillOpacity={0.2} />
                     </div>
                     <p className="text-base font-black text-slate-800 mb-1">{cls}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{materiWithClasses.filter(m => m.kelas === cls).length} Materi</p>
                  </button>
               ))}
            </div>
         )}

         {/* CONDITION 2: INSIDE CLASS - SHOW SUBJECTS */}
         {currentFolder && !currentSubject && !search && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
               {availableSubjects.map(subj => (
                  <button 
                     key={subj}
                     onClick={() => setCurrentSubject(subj)}
                     className="group flex flex-col p-6 bg-white border border-slate-200 rounded-3xl hover:border-brand-600 hover:shadow-xl hover:shadow-brand-50 transition-all text-left animate-in fade-in slide-in-from-bottom-4"
                  >
                     <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Folder size={32} fill="currentColor" fillOpacity={0.2} />
                     </div>
                     <p className="text-base font-black text-slate-800 mb-1 truncate w-full">{subj}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {materiWithClasses.filter(m => m.kelas === currentFolder && m.mapel === subj).length} File
                     </p>
                  </button>
               ))}
               {availableSubjects.length === 0 && (
                  <div className="col-span-full py-20 text-center text-slate-400 italic">Belum ada mata pelajaran.</div>
               )}
            </div>
         )}

         {/* CONDITION 3: FILES (Either Search results or deep folder) */}
         {(currentSubject || search) && (
            <>
               {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in">
                     {visibleItems.map(m => (
                        <div key={m.id} className="group relative bg-white border border-slate-200 rounded-3xl p-6 hover:border-brand-600 hover:shadow-xl transition-all flex flex-col h-full">
                           <div className="flex items-start justify-between mb-6">
                              <div className={cn(
                                 "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                                 m.file_type === 'pdf' ? "bg-red-500" : m.file_type?.includes('doc') ? "bg-blue-600" : "bg-orange-500"
                              )}>
                                 <FileText size={24} />
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => handleDelete(m.id, m.file_path)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                 <button className="p-2 text-slate-300 hover:text-brand-600 transition-colors"><MoreVertical size={16}/></button>
                              </div>
                           </div>
                           <div className="flex-1">
                              <h4 className="text-sm font-black text-slate-800 mb-2 line-clamp-2 leading-tight">{m.judul}</h4>
                              <div className="flex flex-wrap gap-2 mt-4">
                                 <span className="text-[9px] font-black uppercase px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">{m.file_type}</span>
                                 <span className="text-[9px] font-black uppercase px-2 py-1 bg-brand-50 text-brand-600 rounded-lg">{m.mapel}</span>
                              </div>
                           </div>
                           <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                              <p className="text-[10px] font-bold text-slate-300 uppercase">{new Date(m.created_at).toLocaleDateString('id-ID')}</p>
                              <div className="flex gap-2">
                                 {m.isi_ekstraksi && (
                                    <button 
                                       onClick={() => handleExportPPT(m)}
                                       className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                                       title="Buat Slide PPT"
                                    >
                                       {isExporting === m.id ? <Loader2 size={14} className="animate-spin" /> : <Presentation size={14} />}
                                    </button>
                                 )}
                                 <button className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all shadow-sm">
                                    <Download size={14} />
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-in fade-in">
                     <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                           <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <th className="px-6 py-4">Nama File</th>
                              <th className="px-6 py-4">Informasi</th>
                              <th className="px-6 py-4">Tanggal</th>
                              <th className="px-6 py-4 text-right">Aksi</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {visibleItems.map(m => (
                              <tr key={m.id} className="hover:bg-slate-50 transition-colors group">
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                       <div className={cn(
                                          "w-10 h-10 rounded-xl flex items-center justify-center text-white",
                                          m.file_type === 'pdf' ? "bg-red-500" : m.file_type?.includes('doc') ? "bg-blue-600" : "bg-orange-500"
                                       )}>
                                          <FileText size={18} />
                                       </div>
                                       <div>
                                          <p className="text-sm font-black text-slate-800">{m.judul}</p>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{m.file_type} • {(Math.random() + 1).toFixed(1)} MB</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-brand-50 text-brand-600 rounded-lg">{m.mapel}</span>
                                 </td>
                                 <td className="px-6 py-4">
                                    <p className="text-xs font-bold text-slate-500">{new Date(m.created_at).toLocaleDateString('id-ID')}</p>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       {m.isi_ekstraksi && (
                                          <button onClick={() => handleExportPPT(m)} className="p-2 hover:bg-teal-50 text-teal-600 rounded-lg transition-colors"><Presentation size={16}/></button>
                                       )}
                                       <button className="p-2 hover:bg-brand-50 text-brand-600 rounded-lg transition-colors"><Download size={16}/></button>
                                       <button onClick={() => handleDelete(m.id, m.file_path)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}
            </>
         )}

         {/* EMPTY STATE */}
         {initialMateri.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-center">
               <div className="w-24 h-24 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-6">
                  <Plus size={48} />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2">Drive Belum Terisi</h3>
               <p className="text-sm font-bold text-slate-400 max-w-sm mb-8">Mulailah dengan mengunggah materi pertama Anda untuk dikelola dan diolah AI.</p>
               <Link href="/dashboard/materi/upload" className="bg-slate-900 hover:bg-brand-600 text-white px-12 py-4 rounded-[2rem] font-black transition-all shadow-2xl">
                  Upload Materi Sekarang
               </Link>
            </div>
         )}
      </main>

      {/* QUICK STATS FOOTER (Simulated) */}
      <div className="fixed bottom-10 right-10 flex gap-4 pointer-events-none">
         <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 pointer-events-auto">
            <div className="w-10 h-10 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><HardDrive size={20}/></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Penyimpanan</p>
               <p className="text-sm font-black text-slate-800 italic">2.4 GB / 10 GB</p>
            </div>
         </div>
      </div>
    </div>
  )
}
