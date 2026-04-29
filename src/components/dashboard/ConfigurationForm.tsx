'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Brain, Zap, Cpu, BarChart3, ChevronLeft, ChevronRight, Sparkles, FileText, Upload, Search, BookOpen, GraduationCap, FileCheck, Loader2, Folder, ChevronDown, Check, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getMateriByGuru } from '@/lib/actions/materi'
import { getSoalByGuru } from '@/lib/actions/soal'
import mammoth from 'mammoth'

interface ConfigurationFormProps {
  onNext: (data: any) => void
  onBack: () => void
  initialData?: any
}

export default function ConfigurationForm({ onNext, onBack, initialData }: ConfigurationFormProps) {
  const [formData, setFormData] = useState({
    model: initialData?.model || 'gemini-2.0-flash',
    topik: initialData?.topik || '',
    sourceType: initialData?.sourceType || 'ai-murni', // ai-murni, materi, bank, upload
    sourceContent: initialData?.sourceContent || '',
    sourceId: initialData?.sourceId || null,
    jumlahPG: initialData?.jumlahPG || 10,
    jumlahEssay: initialData?.jumlahEssay || 0,
    formatOpsi: initialData?.formatOpsi || 'A-D',
    tingkat: initialData?.tingkat || 'sedang',
  })

  const [materiList, setMateriList] = useState<any[]>([])
  const [bankList, setBankList] = useState<any[]>([])
  const [loadingAssets, setLoadingAssets] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [materiNav, setMateriNav] = useState({ kelas: null as string | null, mapel: null as string | null })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchAssets()
  }, [])

  async function fetchAssets() {
    setLoadingAssets(true)
    try {
      const [materi, soal] = await Promise.all([getMateriByGuru(), getSoalByGuru()])
      setMateriList(materi || [])
      setBankList(soal || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingAssets(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setExtracting(true)
    try {
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        setFormData(prev => ({ ...prev, sourceContent: result.value, sourceType: 'upload', topik: prev.topik || file.name.replace(/\.[^/.]+$/, "") }))
      } else {
        setFormData(prev => ({ 
          ...prev, 
          sourceContent: `File: ${file.name}`, 
          sourceType: 'upload',
          topik: prev.topik || file.name.replace(/\.[^/.]+$/, "")
        }))
      }
    } catch (err) {
      alert('Gagal membaca file.')
    } finally {
      setExtracting(false)
    }
  }

  const totalSoal = formData.jumlahPG + formData.jumlahEssay

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.topik.trim()) {
      alert('PERINGATAN: Tuliskan topik utama atau pilih materi referensi terlebih dahulu.')
      return
    }
    if (totalSoal === 0) {
      alert('Pilih setidaknya 1 jumlah soal untuk digenerate.')
      return
    }
    onNext(formData)
  }

  // Materi Explorer Logic
  const uniqueClasses = useMemo(() => Array.from(new Set(materiList.map(m => m.kelas || 'Umum'))).sort(), [materiList])
  const filteredMateri = useMemo(() => {
    let list = materiList
    if (materiNav.kelas) list = list.filter(m => (m.kelas || 'Umum') === materiNav.kelas)
    if (materiNav.mapel) list = list.filter(m => m.mapel === materiNav.mapel)
    if (searchQuery) list = list.filter(m => m.judul.toLowerCase().includes(searchQuery.toLowerCase()))
    return list
  }, [materiList, materiNav, searchQuery])

  const availableMapels = useMemo(() => {
    if (!materiNav.kelas) return []
    const inClass = materiList.filter(m => (m.kelas || 'Umum') === materiNav.kelas)
    return Array.from(new Set(inClass.map(m => m.mapel))).sort()
  }, [materiList, materiNav])

  return (
    <form onSubmit={handleSubmit} className="space-y-10 w-full animate-in fade-in duration-700">
      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx,.txt,.pptx" onChange={handleFileUpload} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         
         {/* LEFT: SOURCE SELECTION (The main logic) */}
         <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[3rem] p-8 lg:p-12 shadow-sm">
               
               <div className="flex items-center gap-6 mb-12">
                  <div className="w-14 h-14 bg-brand-600 text-white rounded-3xl flex items-center justify-center font-black text-xl shadow-xl shadow-brand-100">1</div>
                  <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">Tentukan Topik & Referensi</h3>
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Dari mana AI harus mengambil materi?</p>
                  </div>
               </div>

               {/* SOURCE TYPE TABS */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                  {[
                     { id: 'ai-murni', name: 'Topik Bebas', icon: Sparkles, desc: 'AI Pintar' },
                     { id: 'materi', name: 'Dari Materi', icon: BookOpen, desc: 'Draft Saya' },
                     { id: 'bank', name: 'Bank Soal', icon: GraduationCap, desc: 'Arsip' },
                     { id: 'upload', name: 'Unggah Baru', icon: Upload, desc: 'PDF/Word' }
                  ].map(tab => (
                     <button
                        key={tab.id} type="button"
                        onClick={() => {
                           setFormData(prev => ({ ...prev, sourceType: tab.id, sourceId: null, sourceContent: '' }))
                           setSearchQuery('')
                        }}
                        className={cn(
                           "flex flex-col items-center gap-2 p-5 rounded-3xl border-2 transition-all group",
                           formData.sourceType === tab.id 
                              ? "bg-slate-900 border-slate-900 text-white shadow-2xl scale-105" 
                              : "bg-white border-slate-100 text-slate-500 hover:border-brand-200 hover:bg-slate-50"
                        )}
                     >
                        <tab.icon size={24} className={cn("transition-colors", formData.sourceType === tab.id ? "text-brand-400" : "group-hover:text-brand-600")} />
                        <span className="text-xs font-black">{tab.name}</span>
                        <span className={cn("text-[9px] font-bold uppercase opacity-60", formData.sourceType === tab.id ? "text-slate-300" : "text-slate-400")}>{tab.desc}</span>
                     </button>
                  ))}
               </div>

               {/* TAB CONTENTS */}
               <div className="bg-slate-50/50 rounded-[2.5rem] p-6 lg:p-8 border border-slate-100 min-h-[360px] flex flex-col">
                  
                  {/* Topic Input (Always show first or contextual) */}
                  <div className="mb-6">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-3 block">Topik Utama Pengerjaan</label>
                     <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-600 transition-colors" size={20} />
                        <input 
                           name="topik" value={formData.topik} onChange={(e) => setFormData(p => ({...p, topik: e.target.value}))}
                           placeholder="Contoh: Peristiwa Rengasdengklok, Integral Parsial, atau Biologi Sel..."
                           className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-3xl text-sm font-black text-slate-900 outline-none focus:ring-4 focus:ring-brand-50 focus:border-brand-600 transition-all shadow-sm"
                        />
                     </div>
                  </div>

                  <div className="flex-1">
                     {formData.sourceType === 'ai-murni' && (
                        <div className="flex flex-col items-center justify-center h-full text-center py-10">
                           <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-xl text-brand-600 mb-6 animate-pulse border border-brand-50"><Zap size={40} /></div>
                           <h4 className="text-lg font-black text-slate-800">Mode Kecerdasan Penuh</h4>
                           <p className="text-sm font-medium text-slate-500 max-w-sm mt-2 leading-relaxed">Cukup jelaskan topiknya, AI akan menyusun soal secara luas berdasarkan standar kurikulum nasional.</p>
                        </div>
                     )}

                     {formData.sourceType === 'materi' && (
                        <div className="space-y-4">
                           {/* Mini Folder Navigation */}
                           <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                              <button type="button" onClick={() => setMateriNav({ kelas: null, mapel: null })} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap", !materiNav.kelas ? "bg-slate-900 text-white" : "bg-white text-slate-500 border border-slate-200")}>Semua Kelas</button>
                              {uniqueClasses.map(cls => (
                                 <button key={cls} type="button" onClick={() => setMateriNav({ kelas: cls, mapel: null })} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap", materiNav.kelas === cls ? "bg-brand-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200")}>{cls}</button>
                              ))}
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                              {loadingAssets ? <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4"><Loader2 className="animate-spin text-brand-600" size={32} /><p className="text-xs font-black text-slate-400">MEMUAT DRIVE...</p></div> : (
                                 filteredMateri.map(m => (
                                    <button 
                                       key={m.id} type="button" 
                                       onClick={() => setFormData(prev => ({ ...prev, sourceId: m.id, sourceContent: m.judul, topik: prev.topik || m.judul }))}
                                       className={cn(
                                          "flex items-start gap-4 p-4 rounded-3xl border-2 transition-all text-left group relative",
                                          formData.sourceId === m.id ? "border-brand-600 bg-white shadow-xl" : "bg-white border-transparent hover:border-slate-200"
                                       )}
                                    >
                                       <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", formData.sourceId === m.id ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-400")}>
                                          <FileText size={18} />
                                       </div>
                                       <div className="flex-1 overflow-hidden">
                                          <p className="text-[11px] font-black text-slate-800 line-clamp-1">{m.judul}</p>
                                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{m.mapel} / {m.kelas || 'Umum'}</p>
                                       </div>
                                       {formData.sourceId === m.id && <div className="absolute top-4 right-4 w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-lg"><Check size={12} strokeWidth={4} /></div>}
                                    </button>
                                 ))
                              )}
                              {filteredMateri.length === 0 && !loadingAssets && <div className="col-span-full py-12 text-center text-slate-400 italic">Tidak ada materi di folder ini.</div>}
                           </div>
                        </div>
                     )}

                     {formData.sourceType === 'bank' && (
                        <div className="space-y-4">
                           <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                              {bankList.map(b => (
                                 <button 
                                    key={b.id} type="button" 
                                    onClick={() => setFormData(p => ({ ...p, sourceId: b.id, sourceContent: b.teks_soal, topik: p.topik || b.mapel }))}
                                    className={cn(
                                       "flex items-center gap-4 p-4 rounded-3xl border-2 transition-all text-left relative",
                                       formData.sourceId === b.id ? "border-brand-600 bg-white shadow-xl" : "bg-white border-transparent hover:border-slate-200"
                                    )}
                                 >
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", formData.sourceId === b.id ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-400")}>
                                       <GraduationCap size={18} />
                                    </div>
                                    <div className="flex-1 truncate">
                                       <p className="text-[11px] font-black text-slate-800 truncate">{b.teks_soal}</p>
                                       <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{b.mapel} Kelas {b.kelas}</p>
                                    </div>
                                    {formData.sourceId === b.id && <Check size={18} className="text-brand-600 ml-4" strokeWidth={3} />}
                                 </button>
                              ))}
                           </div>
                        </div>
                     )}

                     {formData.sourceType === 'upload' && (
                        <div className="h-full flex flex-col items-center justify-center">
                           {extracting ? (
                              <div className="flex flex-col items-center py-10 space-y-4 animate-pulse">
                                 <Loader2 className="animate-spin text-brand-600" size={48} />
                                 <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Memasukkan Data ke Sistem...</p>
                              </div>
                           ) : formData.sourceContent && !formData.sourceId ? (
                              <div className="p-8 bg-white border border-brand-100 rounded-[2.5rem] flex items-center gap-6 animate-in zoom-in-95 shadow-2xl w-full border-b-8 border-b-brand-600">
                                 <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-3xl flex items-center justify-center shadow-sm shrink-0"><FileCheck size={40} /></div>
                                 <div className="flex-1">
                                    <h4 className="text-lg font-black text-slate-900 leading-none">Berkas Terbaca Sempurna</h4>
                                    <p className="text-sm font-bold text-slate-400 mt-2">AI akan menganalisis isi file untuk membuat butir soal yang relevan.</p>
                                    <button type="button" onClick={() => setFormData(p => ({...p, sourceId: null, sourceContent: '', sourceType: 'ai-murni'}))} className="mt-4 text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline flex items-center gap-1"><X size={10}/> Batalkan Berkas</button>
                                 </div>
                              </div>
                           ) : (
                              <div 
                                 onClick={() => fileInputRef.current?.click()}
                                 className="w-full flex flex-col items-center justify-center py-16 text-center cursor-pointer hover:bg-white rounded-[3rem] transition-all group border-2 border-dashed border-slate-200 hover:border-brand-600 bg-slate-50/50 shadow-inner"
                              >
                                 <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl text-slate-200 group-hover:text-brand-600 mb-6 border border-slate-100 group-hover:scale-110 transition-all"><Upload size={40} /></div>
                                 <h4 className="text-lg font-black text-slate-800">Unggah Bahan Ajar Baru</h4>
                                 <p className="text-xs font-bold text-slate-400 max-w-xs mx-auto mt-2 leading-relaxed italic">Salin teks dari PDF, Word, atau PPT Anda secara otomatis.</p>
                              </div>
                           )}
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT: COMPOSITION & SUMMARIES */}
         <div className="lg:col-span-4 space-y-6">
            
            {/* Step 2 Header */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black shadow-lg">2</div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Setelan Naskah</h3>
               </div>

               <div className="space-y-8">
                  {/* Model Picker */}
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mesin Pemroses</label>
                     <div className="grid grid-cols-1 gap-2">
                        {[
                           { id: 'gemini-2.0-flash', name: 'Gemini 2.0', icon: Zap, color: 'text-amber-500' },
                           { id: 'gpt-4o', name: 'GPT-4o Premium', icon: Brain, color: 'text-green-500' }
                        ].map(m => (
                           <button 
                              key={m.id} type="button" 
                              onClick={() => setFormData(p => ({...p, model: m.id}))}
                              className={cn(
                                 "flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left",
                                 formData.model === m.id ? "border-slate-900 bg-slate-900 text-white shadow-xl" : "border-slate-50 bg-slate-50 text-slate-600 hover:bg-white"
                              )}
                           >
                              <m.icon size={18} className={formData.model === m.id ? "text-brand-400" : m.color} />
                              <span className="text-[11px] font-black">{m.name}</span>
                              {formData.model === m.id && <Check size={14} className="ml-auto text-brand-400" />}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Level Kesulitan</label>
                     <div className="flex p-1 bg-slate-100 rounded-2xl">
                        {['mudah', 'sedang', 'sulit'].map(lv => (
                           <button 
                              key={lv} type="button"
                              onClick={() => setFormData(p => ({...p, tingkat: lv}))}
                              className={cn(
                                 "flex-1 py-3 px-1 rounded-xl text-[10px] font-black uppercase transition-all tracking-tighter",
                                 formData.tingkat === lv ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                              )}
                           >
                              {lv === 'mudah' ? 'Dasar' : lv === 'sedang' ? 'Menengah' : 'HOTS'}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Quantity Sliders */}
                  <div className="space-y-10 pt-4">
                     <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pilihan Ganda</label>
                           <span className="text-lg font-black text-brand-600 bg-brand-50 px-4 py-1 rounded-xl shadow-sm border border-brand-100">{formData.jumlahPG}</span>
                        </div>
                        <input type="range" min="0" max="30" value={formData.jumlahPG} onChange={e => setFormData(p => ({...p, jumlahPG: parseInt(e.target.value)}))} className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-brand-600" />
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uraian / Essay</label>
                           <span className="text-lg font-black text-brand-600 bg-brand-50 px-4 py-1 rounded-xl shadow-sm border border-brand-100">{formData.jumlahEssay}</span>
                        </div>
                        <input type="range" min="0" max="15" value={formData.jumlahEssay} onChange={e => setFormData(p => ({...p, jumlahEssay: parseInt(e.target.value)}))} className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-brand-600" />
                     </div>
                  </div>
               </div>
            </div>

            {/* ACTION CENTER */}
            <div className="bg-brand-600 rounded-[2.5rem] p-8 text-white shadow-2xl flex flex-col items-center gap-6 text-center shadow-brand-100 ring-8 ring-brand-50">
               <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-lg"><Sparkles size={32} /></div>
               <div className="space-y-1">
                  <p className="text-xl font-black italic">Siap untuk Beraksi?</p>
                  <p className="text-xs font-bold text-brand-100 uppercase tracking-widest">Generate {totalSoal} butir naskah sekarang</p>
               </div>
               <button 
                  type="submit"
                  disabled={!formData.topik || totalSoal === 0}
                  className={cn(
                     "w-full py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-2xl",
                     !formData.topik || totalSoal === 0 
                        ? "bg-brand-400/50 text-white/50 cursor-not-allowed border-2 border-transparent" 
                        : "bg-white text-slate-900 hover:scale-105 active:scale-95 group"
                  )}
               >
                  Mulai Generate <ChevronRight size={22} className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>

            <button type="button" onClick={onBack} className="w-full text-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
               Batal & Kembali ke Beranda
            </button>
         </div>
      </div>
    </form>
  )
}
