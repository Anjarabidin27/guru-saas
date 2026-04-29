'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Loader2, Save, Printer, Download, ChevronLeft, AlertCircle, FileText, Check, Sparkles } from 'lucide-react'
import { aiGenerateQuestions, saveGeneratedSoal } from '@/lib/actions/ai-studio'
import { cn } from '@/lib/utils'

interface ResultDisplayProps {
  identityData: any
  configData: any
  onBack: () => void
}

export default function ResultDisplay({ identityData, configData, onBack }: ResultDisplayProps) {
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<any[]>([])
  const [savedIds, setSavedIds] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    handleGenerate()
  }, [])

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const result = await aiGenerateQuestions({ 
        topik: configData.topik, 
        jumlahPG: configData.jumlahPG, 
        jumlahEssay: configData.jumlahEssay,
        tingkat: configData.tingkat,
        formatOpsi: configData.formatOpsi,
        model: configData.model 
      })
      setQuestions(result)
    } catch (e: any) {
      setError(e.message || 'Terjadi kesalahan sistem saat memproses AI.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveSingle(q: any, idx: number) {
    try {
      await saveGeneratedSoal({
        pertanyaan: q.pertanyaan,
        opsi: q.opsi,
        jawaban: q.jawaban,
        topik: configData.topik,
        tingkat: configData.tingkat,
        jenis_soal: q.jenis_soal
      })
      setSavedIds(prev => [...prev, idx])
    } catch (e: any) {
      alert(`Gagal menyimpan: ${e.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6 afu">
        <div className="relative">
           <div className="w-20 h-20 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles size={28} className="animate-pulse text-brand-600" />
           </div>
        </div>
        <div className="text-center space-y-2">
           <h3 className="text-xl font-black text-slate-900 tracking-tight">Meramu Naskah Soal Terbaik...</h3>
           <p className="text-sm text-slate-500 font-medium">Kecerdasan Buatan sedang menyusun butir soal sesuai materi Anda.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-20 text-center space-y-6 afu">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto"><AlertCircle size={32} /></div>
        <h3 className="text-lg font-black text-slate-900">Proses AI Terhenti</h3>
        <p className="text-sm font-bold text-slate-500 max-w-sm mx-auto">{error}</p>
        <button onClick={onBack} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs">KEMBALI & PERBAIKI</button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto afu pb-32">
      
      {/* Floating Action Strip - Balanced & Clear */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800 shadow-2xl sticky top-6 z-30 mx-4">
         <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-900/20">
               <Check size={18} strokeWidth={3} />
            </div>
            <div>
               <p className="text-xs font-black text-white leading-none uppercase tracking-widest">{questions.length} Butir Soal Terbentuk</p>
               <p className="text-[11px] text-slate-400 font-bold mt-1">Siap untuk dicetak dan digunakan di kelas</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white transition-all text-xs font-bold" title="Ekspor PDF">
               <Download size={18} /> <span className="hidden md:inline">PDF</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white transition-all text-xs font-bold" title="Cetak">
               <Printer size={18} /> <span className="hidden md:inline">Cetak</span>
            </button>
            <div className="w-px h-6 bg-slate-700 mx-1" />
            <button className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-brand-900/10">SIMPAN KE BANK SOAL</button>
         </div>
      </div>

      {/* Readable Exam Sheet */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
         
         {/* Kop Surat Formal & Jelas */}
         <div className="p-8 border-b-4 border-double border-slate-900 flex items-center gap-10">
            <div className="w-24 h-24 bg-white border-2 border-slate-100 rounded-lg flex items-center justify-center p-1 shrink-0">
               {identityData.logoSekolah ? <img src={identityData.logoSekolah} alt="Logo" className="w-full h-full object-contain" /> : <FileText size={40} className="text-slate-200" />}
            </div>
            <div className="flex-1 text-center pr-24 leading-snug">
               <h1 className="text-lg md:text-xl font-black uppercase tracking-tight text-slate-900">{identityData.namaSekolah || 'NAMA SEKOLAH ANDA'}</h1>
               <h2 className="text-base md:text-lg font-black text-slate-800 uppercase mt-1 tracking-wide">{identityData.judulPaket || 'NASKAH UJIAN SMAS'}</h2>
               <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 px-4 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                 <p className="text-xs font-black text-slate-700 uppercase tracking-tight">Mata Pelajaran: <span className="text-brand-600">{identityData.mapel}</span></p>
                 <span className="text-slate-300 hidden md:inline">|</span>
                 <p className="text-xs font-black text-slate-700 uppercase tracking-tight">Kelas: <span className="text-brand-600">{identityData.kelas}</span></p>
                 <span className="text-slate-300 hidden md:inline">|</span>
                 <p className="text-xs font-black text-slate-700 uppercase tracking-tight">Semester: <span className="text-brand-600">{identityData.semester}</span></p>
               </div>
            </div>
         </div>

         {/* Question List - Optimized for High Readability */}
         <div className="p-10 space-y-10">
            {questions.map((q, idx) => (
               <div key={idx} className="group relative">
                  <div className="flex items-start gap-5">
                     {/* Numbering - Large & Clear */}
                     <span className="text-lg font-black text-slate-900 mt-0.5 w-8">{idx + 1}.</span>
                     
                     <div className="flex-1 space-y-5">
                        {/* Question Text - Standard Base Size */}
                        <div className="flex justify-between items-start gap-6">
                           <p className="text-base md:text-lg font-extrabold text-slate-900 leading-relaxed flex-1">
                              {q.pertanyaan}
                           </p>
                           {/* Action Sidebar for each question */}
                           <button 
                             onClick={() => handleSaveSingle(q, idx)}
                             disabled={savedIds.includes(idx)}
                             className={cn(
                               "shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all shadow-sm border",
                               savedIds.includes(idx) 
                                 ? "text-green-600 bg-green-50 border-green-100" 
                                 : "text-brand-600 bg-brand-50 border-brand-100 hover:bg-brand-100"
                             )}
                           >
                             {savedIds.includes(idx) ? <><CheckCircle2 size={14} /> Tersimpan</> : <><Save size={14} /> Simpan</>}
                           </button>
                        </div>
                        
                        {/* Options - Spaced out and legible */}
                        {q.jenis_soal === 'pilihan_ganda' && q.opsi && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 pl-2">
                              {Object.entries(q.opsi).map(([key, val]) => (
                                 <div key={key} className="flex items-start gap-4 hover:bg-slate-50 p-1.5 rounded-lg transition-colors cursor-default">
                                    <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 shrink-0">{key}</span>
                                    <span className="text-sm md:text-base text-slate-700 font-bold leading-snug">{val as string}</span>
                                 </div>
                              ))}
                           </div>
                        )}

                        {/* Answer Key Block - High Contrast */}
                        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
                           <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kunci Jawaban:</span>
                              <span className="text-sm font-black text-green-400">{q.jawaban}</span>
                           </div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-xl">
                              Tipe: {q.jenis_soal?.replace('_', ' ')}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Large Back Link */}
      <div className="text-center pt-8">
         <button onClick={onBack} className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-all flex items-center justify-center gap-2 mx-auto shadow-sm">
            <ChevronLeft size={18} /> Kembali & Edit Parameter
         </button>
      </div>

    </div>
  )
}
