'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, FileText, CheckCircle2, Loader2, Sparkles, Database, ChevronLeft, GraduationCap, BookOpen, Layers } from 'lucide-react'
import { uploadMateriAction } from '@/lib/actions/materi'
import { cn } from '@/lib/utils'
import { DAFTAR_KELAS, DAFTAR_MAPEL } from '@/lib/constants'

export default function UploadMateriPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [judul, setJudul] = useState('')
  const [mapel, setMapel] = useState('')
  const [kelas, setKelas] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleUpload() {
    if (!file || !judul || !mapel || !kelas) return alert('Lengkapi semua data termasuk Kelas dan Mata Pelajaran.')
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('judul', judul)
      formData.append('mapel', mapel)
      formData.append('kelas', kelas)

      await uploadMateriAction(formData)
      setSuccess(true)
      router.refresh()
      setTimeout(() => {
         router.push('/dashboard/materi')
      }, 1500)
    } catch (e: any) {
      alert(`Gagal unggah: ${e.message}`)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-32">
      
      {/* Premium Header */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm group">
               <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
               <h1 className="text-2xl font-black text-slate-900 tracking-tight">Upload Materi Baru</h1>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Simpan bahan ajar ke Wiyata Drive</p>
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Form Area */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
              <div className="space-y-8">
                 
                 {/* Step 1: File Selection */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-brand-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-brand-100">1</div>
                       <h3 className="text-base font-black text-slate-800">Pilih Berkas Materi</h3>
                    </div>
                    
                    <div className={cn(
                       "border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center justify-center text-center",
                       file ? "border-brand-600 bg-brand-50/30" : "border-slate-200 bg-slate-50/50 hover:border-brand-400"
                    )}>
                       {!file ? (
                          <>
                             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-300 mb-4 border border-slate-100"><Upload size={32} /></div>
                             <p className="text-sm font-black text-slate-700">Tarik file ke sini atau klik tombol di bawah</p>
                             <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-tight">PDF, Word, atau PowerPoint (Maks. 50MB)</p>
                             <input 
                                type="file" id="file-upload" className="hidden" 
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                accept=".pdf,.ppt,.pptx,.doc,.docx"
                             />
                             <label htmlFor="file-upload" className="mt-6 px-10 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-700 cursor-pointer hover:border-brand-600 hover:text-brand-600 transition-all shadow-sm">
                                Pilih File
                             </label>
                          </>
                       ) : (
                          <div className="animate-in zoom-in-95 duration-300">
                             <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl text-brand-600 mb-6 border border-brand-100 relative mx-auto">
                                <FileText size={40} />
                                <button 
                                   onClick={() => setFile(null)}
                                   className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                >
                                   <X size={16} />
                                </button>
                             </div>
                             <p className="text-lg font-black text-slate-800 break-all px-4">{file.name}</p>
                             <p className="text-xs font-bold text-slate-400 mt-2">{(file.size / 1024 / 1024).toFixed(2)} MB • Berkas Terpilih</p>
                          </div>
                       )}
                    </div>
                 </div>

                 {/* Step 2: Metadata */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-brand-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-brand-100">2</div>
                       <h3 className="text-base font-black text-slate-800">Detail & Klasifikasi</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Judul Dokumen Materi</label>
                          <div className="relative">
                             <input 
                                type="text" value={judul}
                                onChange={(e) => setJudul(e.target.value)}
                                placeholder="Contoh: Ekosistem Air Tawar - Pertemuan 1"
                                className="w-full pl-5 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-brand-50 focus:border-brand-600 transition-all"
                             />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Kelas</label>
                          <div className="relative">
                             <select 
                                value={kelas} 
                                onChange={(e) => setKelas(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-brand-50 focus:border-brand-600 transition-all appearance-none cursor-pointer"
                             >
                                <option value="">Pilih Kelas...</option>
                                {DAFTAR_KELAS.map(k => <option key={k} value={k}>{k}</option>)}
                                <option value="Umum">Materi Umum</option>
                             </select>
                             <Layers size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mata Pelajaran</label>
                          <div className="relative">
                             <select
                                value={mapel}
                                onChange={(e) => setMapel(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-brand-50 focus:border-brand-600 transition-all appearance-none cursor-pointer"
                             >
                                <option value="">Pilih Mapel...</option>
                                {DAFTAR_MAPEL.map(m => <option key={m} value={m}>{m}</option>)}
                                <option value="Lainnya">Lainnya...</option>
                             </select>
                             <BookOpen size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Success Alert */}
              {success && (
                 <div className="mt-10 p-6 bg-green-50 border border-green-100 rounded-3xl flex items-center gap-4 animate-in fade-in zoom-in-95">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><CheckCircle2 size={24} /></div>
                    <div>
                       <p className="text-sm font-black text-green-900">Materi Berhasil Diunggah!</p>
                       <p className="text-[11px] font-bold text-green-600 uppercase tracking-tight">Mengalihkan Anda ke Wiyata Drive...</p>
                    </div>
                 </div>
              )}

              {/* Execution Button */}
              <div className="mt-12">
                <button 
                  onClick={handleUpload}
                  disabled={loading || !file || success}
                  className={cn(
                    "w-full py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-2xl",
                    loading || !file || success 
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed" 
                      : "bg-slate-900 text-white hover:bg-brand-600 shadow-slate-200"
                  )}
                >
                   {loading ? <Loader2 size={22} className="animate-spin" /> : <Upload size={22} />}
                   {loading ? 'Sedang Memproses Dokumen...' : 'Simpan ke Wiyata Drive'}
                </button>
              </div>
           </div>
        </div>

        {/* Info & Help Column */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center text-brand-400 shadow-lg"><Sparkles size={20} /></div>
                 <h3 className="text-sm font-black uppercase tracking-widest">Kekuatan AI</h3>
              </div>
              <p className="text-sm font-bold text-slate-400 leading-relaxed mb-8">Setiap file yang Anda unggah akan diproses oleh AI untuk memberikan kemudahan bagi Anda:</p>
              <ul className="space-y-6">
                 {[
                    { icon: BookOpen, title: "Ekstraksi Materi", desc: "AI akan meringkas isi dokumen untuk referensi cepat." },
                    { icon: Sparkles, title: "Latihan Soal", desc: "AI dapat membuat soal ujian otomatis berdasarkan dokumen ini." },
                    { icon: Layers, title: "Konversi Slide", desc: "Dapat langsung diubah menjadi slide presentasi PPTX." }
                 ].map((item, i) => (
                    <li key={i} className="flex gap-4">
                       <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700"><item.icon size={16} className="text-brand-400" /></div>
                       <div>
                          <p className="text-xs font-black text-white">{item.title}</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-1">{item.desc}</p>
                       </div>
                    </li>
                 ))}
              </ul>
           </div>

           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Informasi Teknis</h4>
              <div className="space-y-3">
                 <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-xs font-bold text-slate-500">Maks. Ukuran</span>
                    <span className="text-xs font-black text-slate-800">50 MB</span>
                 </div>
                 <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-xs font-bold text-slate-500">Privasi</span>
                    <span className="text-xs font-black text-green-600">Terenkripsi</span>
                 </div>
                 <div className="flex items-center justify-between py-2">
                    <span className="text-xs font-bold text-slate-500">Akses</span>
                    <span className="text-xs font-black text-slate-800">Hanya Anda</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}
