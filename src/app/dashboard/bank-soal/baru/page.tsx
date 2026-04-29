'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { DAFTAR_MAPEL, DAFTAR_KELAS } from '@/lib/constants'
import { createSoal, uploadSoalImage, aiExtractSoalFromImage } from '@/lib/actions/soal'
import { Loader2, Image as ImageIcon, X, UploadCloud, Info, Sparkles, Wand2, ChevronLeft, Save, Scan, Zap, BookOpen, Brain, MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

const HURUF = ['A', 'B', 'C', 'D', 'E'] as const

export default function BuatSoalPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    mapel: '',
    kelas: '',
    bab: '',
    level_kognitif: 'MOTS',
    jenis_soal: 'pilihan_ganda',
    teks_soal: '',
    pilihan_a: '', pilihan_b: '', pilihan_c: '', pilihan_d: '', pilihan_e: '',
    kunci_jawaban: '',
    pembahasan: '',
    is_public: false,
    gambar_url: ''
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [scanLoading, setScanLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function update(field: string, val: any) {
    setForm(f => ({ ...f, [field]: val }))
    setError('')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) return setError('Maksimal 2MB.')
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleScanImage = async () => {
    if (!imagePreview) return
    setScanLoading(true)
    setError('')
    try {
      const response = await aiExtractSoalFromImage(imagePreview)
      if (response.error) throw new Error(response.error)
      if (response.data) {
        const d = response.data
        setForm(f => ({
          ...f,
          teks_soal: d.pertanyaan || f.teks_soal,
          pilihan_a: d.opsi?.A || f.pilihan_a,
          pilihan_b: d.opsi?.B || f.pilihan_b,
          pilihan_c: d.opsi?.C || f.pilihan_c,
          pilihan_d: d.opsi?.D || f.pilihan_d,
          pilihan_e: d.opsi?.E || f.pilihan_e,
          kunci_jawaban: d.jawaban || f.kunci_jawaban,
          pembahasan: d.penjelasan || f.pembahasan,
          jenis_soal: d.opsi?.A ? 'pilihan_ganda' : 'essay'
        }))
      }
    } catch (err: any) {
      setError(`Gagal pindai: ${err.message}`)
    } finally {
      setScanLoading(false)
    }
  }

  async function handleSubmit() {
    if (!form.mapel || !form.kelas || !form.teks_soal.trim()) return setError('Lengkapi data wajib (Mapel, Kelas, Soal).')

    setLoading(true)
    let finalGambarUrl = form.gambar_url

    if (imageFile) {
      const formData = new FormData()
      formData.append('file', imageFile)
      const uploadRes = await uploadSoalImage(formData)
      if (uploadRes.error) {
         setLoading(false)
         return setError(`Upload gagal: ${uploadRes.error}`)
      }
      finalGambarUrl = uploadRes.publicUrl || ''
    }

    const result = await createSoal({ ...form, gambar_url: finalGambarUrl })
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/dashboard/bank-soal'), 1000)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in zoom-in-95">
        <div className="w-24 h-24 bg-black flex items-center justify-center border-4 border-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
           <Save size={40} strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-black text-black uppercase tracking-tighter">INSTRUMEN TERSIMPAN</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white -mx-8 -mt-10 overflow-hidden flex flex-col font-sans">
      
      {/* 1. TEGAS TOOLBAR - PURE BLACK/WHITE */}
      <header className="h-24 border-b-4 border-black bg-white flex items-center justify-between px-12 shrink-0 sticky top-0 z-30">
         <div className="flex items-center gap-8">
            <button onClick={() => router.back()} className="w-12 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none">
               <ChevronLeft size={28} strokeWidth={3} />
            </button>
            <div className="flex flex-col">
               <h1 className="text-xl font-black text-black uppercase tracking-tighter">EDITOR INSTRUMEN PUSTAKA</h1>
               <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mt-1">Status: Konfigurasi Draft</p>
            </div>
         </div>

         <div className="flex items-center gap-6">
            <button
               onClick={handleSubmit}
               disabled={loading}
               className="h-14 px-10 bg-black text-white font-black text-xs uppercase tracking-[0.3em] shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] hover:bg-zinc-800 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center gap-3"
            >
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} strokeWidth={3} />}
               TERBITKAN KE PUSTAKA
            </button>
         </div>
      </header>

      {/* 2. INDUSTRIAL GRID LAYOUT */}
      <div className="flex-1 flex overflow-hidden lg:flex-row flex-col">
         
         {/* LEFT: FORM SETTINGS (HIGH CONTRAST) */}
         <aside className="w-full lg:w-[400px] bg-zinc-50 border-r-4 border-black overflow-y-auto px-10 py-12 space-y-12 custom-scrollbar shrink-0">
            
            <div className="space-y-8">
               <div className="flex items-center gap-3">
                  <div className="h-6 w-2 bg-black" />
                  <label className="text-[11px] font-black text-black uppercase tracking-[0.4em]">PARAMETER WAJIB</label>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">UNIT MATA PELAJARAN</label>
                     <select
                        value={form.mapel}
                        onChange={e => update('mapel', e.target.value)}
                        className="w-full px-6 py-4 border-2 border-black bg-white text-sm font-black text-black appearance-none focus:bg-zinc-100 transition-all outline-none"
                     >
                        <option value="">Pilih Mata Pelajaran...</option>
                        {DAFTAR_MAPEL.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                     </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">KELAS / UNIT</label>
                        <select
                           value={form.kelas}
                           onChange={e => update('kelas', e.target.value)}
                           className="w-full px-6 py-4 border-2 border-black bg-white text-sm font-black text-black"
                        >
                           <option value="">UNIT</option>
                           {DAFTAR_KELAS.map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">PEDAGOGI</label>
                        <select
                           value={form.level_kognitif}
                           onChange={e => update('level_kognitif', e.target.value)}
                           className="w-full px-6 py-4 border-2 border-black bg-white text-sm font-black text-black"
                        >
                           <option value="LOTS">LOTS</option>
                           <option value="MOTS">MOTS</option>
                           <option value="HOTS">HOTS</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">BENTUK INSTRUMEN</label>
                     <div className="grid grid-cols-2 gap-px bg-black border-2 border-black">
                        {['pilihan_ganda', 'essay'].map((t) => (
                           <button
                              key={t} type="button"
                              onClick={() => update('jenis_soal', t)}
                              className={cn(
                                 "py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                                 form.jenis_soal === t ? "bg-black text-white" : "bg-white text-black hover:bg-zinc-100"
                              )}
                           >
                              {t.split('_')[0]}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-8 pt-12 border-t-4 border-black">
               <div className="flex items-center gap-3">
                  <div className="h-6 w-2 bg-red-600" />
                  <label className="text-[11px] font-black text-black uppercase tracking-[0.4em]">MANAJEMEN MEDIA</label>
               </div>
               
               {imagePreview ? (
                  <div className="relative aspect-video border-4 border-black overflow-hidden bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                     <img src={imagePreview} className="w-full h-full object-contain p-4" />
                     <button type="button" onClick={() => setImagePreview(null)} className="absolute top-0 right-0 w-12 h-12 bg-black text-white flex items-center justify-center hover:bg-red-600 transition-colors border-l-2 border-b-2 border-black"><X size={24} strokeWidth={3}/></button>
                  </div>
               ) : (
                  <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="w-full aspect-video border-4 border-dashed border-zinc-300 flex flex-col items-center justify-center gap-4 text-zinc-300 hover:text-black hover:border-black transition-all bg-white"
                  >
                     <UploadCloud size={32} strokeWidth={3} />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em]">UNGGAH LAMPIRAN</span>
                  </button>
               )}
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
               
               {imagePreview && (
                  <button 
                     onClick={handleScanImage} disabled={scanLoading}
                     className="w-full py-5 bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-3"
                  >
                     {scanLoading ? <Loader2 size={18} className="animate-spin" /> : <Scan size={18} strokeWidth={3} />}
                     EKSTRAKSI TEKS (OCR)
                  </button>
               )}
            </div>
         </aside>

         {/* RIGHT: EDITOR (TEGAS & LINEAR) */}
         <main className="flex-1 overflow-y-auto px-16 py-14 space-y-16 bg-white custom-scrollbar">
            
            {error && (
               <div className="p-6 bg-red-600 text-white font-black text-sm uppercase tracking-widest flex items-center justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  {error} <X className="cursor-pointer" size={20} strokeWidth={3} onClick={() => setError('')} />
               </div>
            )}

            <div className="space-y-6">
               <div className="flex items-center justify-between border-b-2 border-black pb-4">
                  <label className="text-[11px] font-black text-black uppercase tracking-[0.4em]">REDAKSI BUTIR INSTRUMEN</label>
                  <button className="flex items-center gap-2 text-[10px] font-black text-red-600 hover:underline uppercase tracking-widest"><Wand2 size={16} /> Optimasi AI</button>
               </div>
               <textarea
                  value={form.teks_soal}
                  onChange={e => update('teks_soal', e.target.value)}
                  placeholder="KETIKKAN PERTANYAAN DI SINI..."
                  className="w-full min-h-[220px] bg-zinc-50 border-4 border-black p-10 text-3xl font-black text-black placeholder:text-zinc-200 outline-none focus:bg-white transition-all resize-none shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]"
               />
            </div>

            {form.jenis_soal === 'pilihan_ganda' ? (
               <div className="space-y-6">
                  <label className="text-[11px] font-black text-black uppercase tracking-[0.4em] border-b-2 border-black pb-4 block">KONFIGURASI OPSI JAWABAN</label>
                  <div className="grid grid-cols-1 gap-6">
                     {HURUF.map(huruf => {
                        const key = `pilihan_${huruf.toLowerCase()}` as keyof typeof form
                        const isKunci = form.kunci_jawaban === huruf
                        return (
                           <div key={huruf} className={cn(
                              "flex items-center gap-8 p-6 border-4 transition-all",
                              isKunci ? "bg-black border-black shadow-[10px_10px_0px_0px_rgba(220,38,38,1)]" : "bg-white border-black hover:bg-zinc-50"
                           )}>
                              <button 
                                 type="button"
                                 onClick={() => update('kunci_jawaban', huruf)}
                                 className={cn(
                                    "w-14 h-14 border-2 flex items-center justify-center font-black text-xl transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                                    isKunci ? "bg-red-600 border-black text-white" : "bg-white border-black text-black hover:bg-zinc-100"
                                 )}
                              >
                                 {huruf}
                              </button>
                              <input 
                                 value={String(form[key] ?? '')}
                                 onChange={e => update(key, e.target.value)}
                                 placeholder={`NARASI PILIHAN ${huruf}...`}
                                 className={cn(
                                    "flex-1 bg-transparent border-none text-lg font-black outline-none placeholder:text-zinc-300",
                                    isKunci ? "text-white" : "text-black"
                                 )}
                              />
                              {isKunci && <div className="h-4 w-4 bg-red-600 rotate-45" />}
                           </div>
                        )
                     })}
                  </div>
               </div>
            ) : (
               <div className="space-y-6">
                  <label className="text-[11px] font-black text-black uppercase tracking-[0.4em] border-b-2 border-black pb-4 block">RUBRIK PENILAIAN / KUNCI URAIAN</label>
                  <textarea 
                     className="w-full min-h-[160px] bg-zinc-50 border-4 border-black p-10 text-lg font-black text-black outline-none shadow-inner"
                     placeholder="DATA KUNCI JAWABAN..."
                     value={form.kunci_jawaban}
                     onChange={e => update('kunci_jawaban', e.target.value)}
                  />
               </div>
            )}

            {/* AI ANALYTICS UNIT */}
            <div className="p-12 bg-black border-4 border-black text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)] relative overflow-hidden">
               <div className="absolute -top-10 -right-10 opacity-10"><Brain size={250} strokeWidth={1}/></div>
               <div className="relative space-y-10">
                  <div className="flex items-center gap-4">
                     <div className="h-8 w-2 bg-red-600" />
                     <h4 className="text-sm font-black uppercase tracking-[0.4em]">ANALISIS & PEMBAHASAN INSTRUMEN</h4>
                  </div>
                  <textarea 
                     className="w-full min-h-[120px] bg-zinc-900 border-2 border-zinc-800 p-8 text-base font-black text-zinc-300 outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
                     placeholder="NARASI PEMBAHASAN AKADEMIK..."
                     value={form.pembahasan}
                     onChange={e => update('pembahasan', e.target.value)}
                  />
                  <div className="flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                     <Zap size={14} className="text-red-600" /> DATA INI AKAN DIGUNAKAN UNTUK UMPAN BALIK SISWA SECARA OTOMATIS.
                  </div>
               </div>
            </div>
         </main>
      </div>
    </div>
  )
}
