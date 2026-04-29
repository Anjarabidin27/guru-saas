'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Save, Scan, UploadCloud, Loader2, Sparkles, Wand2, Brain, Zap, Image as ImageIcon, BookOpen, Layers, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DAFTAR_MAPEL, DAFTAR_KELAS } from '@/lib/constants'
import { createSoal, updateSoal, uploadSoalImage, aiExtractSoalFromImage } from '@/lib/actions/soal'

interface SoalModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: any 
}

const HURUF = ['A', 'B', 'C', 'D', 'E'] as const

export default function SoalModal({ isOpen, onClose, onSuccess, initialData }: SoalModalProps) {
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

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData })
      if (initialData.gambar_url) setImagePreview(initialData.gambar_url)
    } else {
      setForm({
        mapel: '', kelas: '', bab: '', level_kognitif: 'MOTS',
        jenis_soal: 'pilihan_ganda', teks_soal: '',
        pilihan_a: '', pilihan_b: '', pilihan_c: '', pilihan_d: '', pilihan_e: '',
        kunci_jawaban: '', pembahasan: '', is_public: false, gambar_url: ''
      })
      setImagePreview(null)
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  function update(field: string, val: any) {
    setForm(f => ({ ...f, [field]: val }))
    setError('')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) return setError('Maksimal 5MB.')
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
      setError(`Gagal memindai: ${err.message}`)
    } finally {
      setScanLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.mapel || !form.kelas || !form.teks_soal.trim()) {
      return setError('Silakan lengkapi Mapel, Kelas, dan Pertanyaan.')
    }

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

    const { id, created_at, updated_at, ...cleanPayload } = form as any
    
    let result
    if (id) {
      result = await updateSoal(id, { ...cleanPayload, gambar_url: finalGambarUrl })
    } else {
      result = await createSoal({ ...cleanPayload, gambar_url: finalGambarUrl })
    }
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      onSuccess()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Modal Header */}
        <header className="h-20 px-10 border-b border-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Sparkles size={20} />
             </div>
             <div>
                <h2 className="text-sm font-bold text-slate-800">Editor Instrumen</h2>
                <p className="text-[11px] text-slate-400 font-medium">Buat aset digital untuk bank soal Anda</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 hover:bg-slate-50 text-slate-400 rounded-full flex items-center justify-center transition-all"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden lg:flex-row flex-col">
          {/* Left Sidebar: Metdata & AI Tools */}
          <aside className="w-full lg:w-[340px] bg-slate-50/50 border-r-2 border-slate-100 overflow-y-auto p-10 space-y-10 custom-scrollbar shrink-0">
            
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-slate-900">
                 <Layers size={18} strokeWidth={2.5} />
                 <span className="text-[12px] font-black uppercase tracking-[0.2em]">KONFIGURASI</span>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-800 ml-1 uppercase tracking-widest">Mata Pelajaran</label>
                  <select 
                    value={form.mapel} onChange={e => update('mapel', e.target.value)}
                    className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-black text-black focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all shadow-sm"
                  >
                    <option value="">Pilih Mapel...</option>
                    {DAFTAR_MAPEL.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-800 ml-1 uppercase tracking-widest">Unit/Kelas</label>
                    <select 
                      value={form.kelas} onChange={e => update('kelas', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-black text-black outline-none transition-all shadow-sm"
                    >
                      <option value="">Pilih</option>
                      {DAFTAR_KELAS.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-800 ml-1 uppercase tracking-widest">Kesulitan</label>
                    <select 
                      value={form.level_kognitif} onChange={e => update('level_kognitif', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-black text-black outline-none transition-all shadow-sm"
                    >
                      <option value="LOTS">LOTS</option>
                      <option value="MOTS">MOTS</option>
                      <option value="HOTS">HOTS</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex bg-slate-200 p-1.5 rounded-2xl gap-1.5">
                     {['pilihan_ganda', 'essay'].map(t => (
                       <button 
                        key={t} type="button"
                        onClick={() => update('jenis_soal', t)}
                        className={cn(
                          "flex-1 py-3 text-[11px] font-black rounded-xl transition-all uppercase tracking-widest",
                          form.jenis_soal === t ? "bg-white text-indigo-700 shadow-md" : "text-slate-600 hover:text-slate-900"
                        )}
                       >
                         {t === 'pilihan_ganda' ? 'PG' : 'ESSAY'}
                       </button>
                     ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Scanning Section */}
            <div className="pt-10 border-t-2 border-slate-100 space-y-6">
              <div className="flex items-center gap-3 text-slate-900">
                 <Scan size={18} strokeWidth={2.5} />
                 <span className="text-[12px] font-black uppercase tracking-[0.2em]">INPUT MEDIA</span>
              </div>
              
              {imagePreview ? (
                <div className="relative rounded-[2rem] border-2 border-slate-200 aspect-video bg-white overflow-hidden group shadow-inner">
                  <img src={imagePreview} className="w-full h-full object-contain p-4" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button onClick={() => setImagePreview(null)} className="w-12 h-12 bg-white text-rose-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all">
                      <X size={24} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-[2rem] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-indigo-700 hover:border-indigo-600 hover:bg-slate-50 transition-all bg-white shadow-sm group"
                >
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                     <UploadCloud size={32} strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Pilih Gambar</span>
                </button>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />

              {imagePreview && (
                <button 
                  onClick={handleScanImage} disabled={scanLoading}
                  className="w-full py-5 bg-black text-white rounded-[1.5rem] font-black text-xs flex items-center justify-center gap-3 shadow-xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em]"
                >
                  {scanLoading ? <Loader2 size={18} className="animate-spin" /> : <Scan size={18} strokeWidth={2.5} />}
                  <span>Scan via AI</span>
                </button>
              )}
            </div>
          </aside>

          {/* Main Content Area: Editor Panel */}
          <main className="flex-1 overflow-y-auto p-12 space-y-12 bg-white custom-scrollbar">
             {error && (
                <div className="p-5 bg-rose-600 text-white rounded-2xl font-black text-sm flex items-center justify-between shadow-xl shadow-rose-100 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-3"><Info size={20} strokeWidth={2.5} /> {error}</div>
                  <X className="cursor-pointer" size={20} strokeWidth={2.5} onClick={() => setError('')} />
                </div>
             )}

             <div className="space-y-6">
               <div className="flex items-center justify-between px-1 border-l-4 border-indigo-600 pl-6 py-1">
                  <div>
                    <label className="text-[13px] font-black text-black uppercase tracking-[0.2em]">Narasi Pertanyaan</label>
                    <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Mendukung Formula KaTeX ($...$)</p>
                  </div>
                  <button className="flex items-center gap-2 text-[11px] font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all px-4 py-2.5 rounded-xl uppercase tracking-widest"><Wand2 size={14} strokeWidth={2.5} /> Sempurnakan</button>
               </div>
               <textarea 
                value={form.teks_soal} onChange={e => update('teks_soal', e.target.value)}
                placeholder="Tuliskan pertanyaan di sini..."
                className="w-full min-h-[220px] border-2 border-slate-200 rounded-[2.5rem] p-10 text-2xl font-black text-black placeholder:text-slate-300 outline-none focus:border-indigo-600 focus:bg-slate-50 transition-all resize-none leading-tight shadow-inner"
               />
             </div>

             {form.jenis_soal === 'pilihan_ganda' ? (
                <div className="space-y-8 pt-6 border-t-2 border-slate-100">
                   <div className="flex items-center gap-3 px-1 text-black">
                      <Layers size={20} strokeWidth={2.5} />
                      <span className="text-[13px] font-black uppercase tracking-[0.2em]">Opsi Jawaban (Pilih Kunci)</span>
                   </div>
                   <div className="grid grid-cols-1 gap-5">
                      {HURUF.map(huruf => {
                        const key = `pilihan_${huruf.toLowerCase()}` as keyof typeof form
                        const isKunci = form.kunci_jawaban === huruf
                        return (
                          <div key={huruf} className={cn(
                            "flex items-center gap-6 p-5 rounded-[2rem] border-2 transition-all",
                            isKunci ? "bg-white border-black shadow-xl ring-4 ring-indigo-500/5" : "bg-slate-50/50 border-slate-100 hover:border-slate-300 hover:bg-white"
                          )}>
                             <button 
                              onClick={() => update('kunci_jawaban', huruf)}
                              className={cn(
                                "w-12 h-12 rounded-[1.2rem] flex items-center justify-center font-black text-base transition-all border-2",
                                isKunci ? "bg-indigo-600 border-indigo-700 text-white shadow-lg" : "bg-white border-slate-200 text-slate-900 shadow-sm"
                              )}
                             >
                               {huruf}
                             </button>
                             <input 
                              value={String(form[key] ?? '')} onChange={e => update(key, e.target.value)}
                              placeholder={`Konten pilihan ${huruf}...`}
                              className={cn(
                                "flex-1 bg-transparent border-none text-lg font-black outline-none placeholder:text-slate-300",
                                isKunci ? "text-black" : "text-slate-700"
                              )}
                             />
                             {isKunci && <div className="bg-indigo-600 p-2 rounded-full text-white shadow-lg"><Zap size={16} fill="currentColor" /></div>}
                          </div>
                        )
                      })}
                   </div>
                </div>
             ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-1 text-slate-400">
                    <BookOpen size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Rubrik Penilaian</span>
                  </div>
                  <textarea 
                    value={form.pembahasan} onChange={e => update('pembahasan', e.target.value)}
                    placeholder="Masukkan kunci jawaban atau langkah penilaian..."
                    className="w-full min-h-[140px] border border-slate-100 rounded-[2rem] p-8 text-sm font-medium text-slate-600 bg-slate-50 outline-none focus:bg-white focus:border-indigo-100 transition-all"
                  />
                </div>
             )}
          </main>
        </div>

        {/* Modal Footer */}
        <footer className="h-24 px-12 border-t border-slate-50 flex items-center justify-between bg-white shrink-0">
           <p className="text-[11px] text-slate-400 font-medium">Input akan tersimpan otomatis ke Cloud Workspace Anda</p>
           <div className="flex items-center gap-4">
              <button onClick={onClose} className="px-6 py-3 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Batal</button>
              <button 
                onClick={handleSubmit} disabled={loading}
                className="h-14 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-bold text-sm shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                <span>Simpan Instrumen</span>
              </button>
           </div>
        </footer>

      </div>
    </div>
  )
}
