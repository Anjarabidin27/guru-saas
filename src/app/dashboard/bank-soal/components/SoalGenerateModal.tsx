'use client'

import { useState } from 'react'
import { X, Sparkles, Loader2, Zap, Brain, Layers, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DAFTAR_MAPEL } from '@/lib/constants'
import { generateQuestions } from '@/lib/services/ai'
import { bulkCreateSoal } from '@/lib/actions/soal'

interface SoalGenerateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  profile: any
}

export default function SoalGenerateModal({ isOpen, onClose, onSuccess, profile }: SoalGenerateModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [form, setForm] = useState({
    mapel: '',
    topik: '',
    jumlah: 5,
    tingkat: 'campuran' as 'mudah' | 'sedang' | 'sulit' | 'campuran',
    jenisSoal: 'pilihan_ganda' as 'pilihan_ganda' | 'essay'
  })

  if (!isOpen) return null

  const handleGenerate = async () => {
    if (!form.mapel || !form.topik) {
      return setError('Silakan lengkapi Mata Pelajaran dan Topik/Materi.')
    }

    setLoading(true)
    setError('')

    try {
      // 1. Generate via AI
      const aiResponse = await generateQuestions({
        model: 'gemini-1.5-flash', // Default high speed
        mapel: form.mapel,
        topik: form.topik,
        jumlah: form.jumlah,
        tingkat: form.tingkat,
        jenisSoal: form.jenisSoal
      })

      if (!aiResponse.soal || !Array.isArray(aiResponse.soal)) {
        throw new Error('AI gagal menghasilkan daftar soal. Silakan coba lagi.')
      }

      // 2. Format for DB
      const payloads = aiResponse.soal.map((s: any) => ({
        mapel: form.mapel,
        kelas: '10', // Default or could be added to form
        teks_soal: s.pertanyaan,
        jenis_soal: form.jenisSoal,
        level_kognitif: form.tingkat === 'campuran' ? 'MOTS' : form.tingkat.toUpperCase(),
        pilihan_a: s.opsi?.A || '',
        pilihan_b: s.opsi?.B || '',
        pilihan_c: s.opsi?.C || '',
        pilihan_d: s.opsi?.D || '',
        pilihan_e: s.opsi?.E || '',
        kunci_jawaban: s.jawaban,
        pembahasan: s.penjelasan,
        is_public: false,
        bab: form.topik
      }))

      // 3. Bulk Insert
      const dbResult = await bulkCreateSoal(payloads)
      if (dbResult.error) throw new Error(dbResult.error)

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <header className="h-20 px-10 border-b-2 border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-11 h-11 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <Zap size={22} fill="currentColor" />
             </div>
             <div>
                <h2 className="text-base font-black text-black leading-none uppercase tracking-tight">AI Bulk Generator</h2>
                <p className="text-[11px] text-slate-700 font-bold mt-1 uppercase tracking-widest">Hasilkan naskah soal instan</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 hover:bg-slate-100 text-black rounded-full flex items-center justify-center transition-all"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </header>

        <div className="p-10 space-y-8">
           {error && (
              <div className="p-5 bg-rose-600 text-white rounded-2xl font-black text-sm flex items-center gap-3">
                 <Info size={20} strokeWidth={2.5} /> {error}
              </div>
           )}

           <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                 <label className="text-[11px] font-black text-black ml-1 uppercase tracking-widest">Pilih Mata Pelajaran</label>
                 <select 
                   value={form.mapel} onChange={e => setForm({...form, mapel: e.target.value})}
                   className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-black text-black focus:border-black outline-none transition-all"
                 >
                   <option value="">Pilih Mapel...</option>
                   {DAFTAR_MAPEL.map(m => <option key={m} value={m}>{m}</option>)}
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[11px] font-black text-black ml-1 uppercase tracking-widest">Topik atau Materi Spesifik</label>
                 <textarea 
                   value={form.topik} onChange={e => setForm({...form, topik: e.target.value})}
                   placeholder="Contoh: Energi Terbarukan, Persamaan Linear Dua Variabel, atau Struktur Sel Hewan..."
                   className="w-full h-32 px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-black text-black focus:border-black outline-none transition-all resize-none"
                 />
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[11px] font-black text-black ml-1 uppercase tracking-widest">Jumlah Soal</label>
                    <select 
                      value={form.jumlah} onChange={e => setForm({...form, jumlah: parseInt(e.target.value)})}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-black text-black focus:border-black outline-none transition-all"
                    >
                      {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n} Butir Soal</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[11px] font-black text-black ml-1 uppercase tracking-widest">Tingkat Kesulitan</label>
                    <select 
                      value={form.tingkat} onChange={e => setForm({...form, tingkat: e.target.value as any})}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-black text-black focus:border-black outline-none transition-all"
                    >
                      <option value="mudah">MUDAH (LOTS)</option>
                      <option value="sedang">SEDANG (MOTS)</option>
                      <option value="sulit">SULIT (HOTS)</option>
                      <option value="campuran">CAMPURAN</option>
                    </select>
                 </div>
              </div>
           </div>

           <div className="pt-6 border-t-2 border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3 text-indigo-600">
                 <Brain size={20} strokeWidth={2.5} />
                 <span className="text-[11px] font-black uppercase tracking-widest">Didukung oleh AI Gemini 1.5</span>
              </div>
              <button 
                onClick={handleGenerate} disabled={loading}
                className="h-14 px-10 bg-black hover:bg-slate-900 text-white rounded-[1.5rem] font-black text-xs shadow-xl shadow-slate-200 transition-all flex items-center gap-3 disabled:opacity-50 uppercase tracking-[0.2em]"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                <span>{loading ? 'MENYUSUN NASKAH...' : 'GENERATE SEKARANG'}</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}
