'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Sparkles, 
  Loader2, 
  ArrowLeft, 
  CheckCircle2, 
  Settings2, 
  BrainCircuit, 
  Factory, 
  Wand2,
  Trash2,
  Plus,
  Save,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DAFTAR_MAPEL } from '@/lib/constants'
import { aiGenerateQuestions } from '@/lib/actions/ai-studio'
import { bulkCreateSoal, SoalPayload } from '@/lib/actions/soal'

// KaTeX Support
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

export default function AIFactoryPage() {
  const router = useRouter()
  
  // State Input
  const [mapel, setMapel] = useState('')
  const [kelas, setKelas] = useState('')
  const [topik, setTopik] = useState('')
  const [bab, setBab] = useState('')
  const [jumlah, setJumlah] = useState(5)
  const [tingkat, setTingkat] = useState<'mudah' | 'sedang' | 'sulit' | 'campuran'>('sedang')
  const [jenisSoal, setJenisSoal] = useState<'pilihan_ganda' | 'essay'>('pilihan_ganda')

  // State Eksekusi
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [generatedItems, setGeneratedItems] = useState<any[]>([])
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set())

  // Helper Render Teks (Math Support)
  const RenderText = ({ text }: { text: string }) => {
    if (!text) return null
    const blocks = text.split(/(\$\$.*?\$\$)/g)
    return (
      <div className="math-container">
        {blocks.map((block, i) => {
          if (block.startsWith('$$') && block.endsWith('$$')) {
            return <BlockMath key={i} math={block.slice(2, -2)} />
          }
          const inlines = block.split(/(\$.*?\$)/g)
          return (
            <span key={i}>
              {inlines.map((part, j) => {
                if (part.startsWith('$') && part.endsWith('$')) {
                  return <InlineMath key={j} math={part.slice(1, -1)} />
                }
                return <span key={j}>{part}</span>
              })}
            </span>
          )
        })}
      </div>
    )
  }

  async function handleGenerate() {
    if (!mapel || !topik) {
       setError('Peringatan: Harap tentukan Mata Pelajaran dan Topik Materi.')
       return
    }

    setIsGenerating(true)
    setError('')
    setGeneratedItems([])
    setSelectedIndices(new Set())

    try {
      const fullTopik = bab ? `${mapel} Kelas ${kelas} - Bab ${bab}: ${topik}` : `${mapel} Kelas ${kelas}: ${topik}`
      const result = await aiGenerateQuestions({
        topik: fullTopik,
        jumlah,
        tingkat,
        jenisSoal,
        formatOpsi: 'A-E'
      })

      if (result && Array.isArray(result)) {
        setGeneratedItems(result)
        // Auto select all
        setSelectedIndices(new Set(result.map((_, i) => i)))
      } else {
        throw new Error('Format respon AI tidak valid.')
      }
    } catch (e: any) {
      setError(e.message || 'Terjadi kesalahan sistem saat menghubungi AI.')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleSaveSelected() {
    if (selectedIndices.size === 0) return
    setIsSaving(true)

    const payloads: SoalPayload[] = generatedItems
      .filter((_, i) => selectedIndices.has(i))
      .map(q => ({
        mapel,
        kelas,
        bab,
        teks_soal: q.pertanyaan,
        jenis_soal: jenisSoal,
        level_kognitif: tingkat.toUpperCase() === 'CAMPURAN' ? 'MOTS' : tingkat.toUpperCase(),
        pilihan_a: q.opsi?.A || '',
        pilihan_b: q.opsi?.B || '',
        pilihan_c: q.opsi?.C || '',
        pilihan_d: q.opsi?.D || '',
        pilihan_e: q.opsi?.E || '',
        kunci_jawaban: q.jawaban,
        pembahasan: q.penjelasan || '',
        is_public: false,
        tags: [topik]
      }))

    const res = await bulkCreateSoal(payloads)
    if (res.success) {
      router.push('/dashboard/bank-soal')
    } else {
      setError(res.error || 'Gagal menyimpan data ke database.')
      setIsSaving(false)
    }
  }

  const toggleSelect = (idx: number) => {
    const next = new Set(selectedIndices)
    if (next.has(idx)) next.delete(idx)
    else next.add(idx)
    setSelectedIndices(next)
  }

  return (
    <div className="max-w-6xl flex flex-col gap-8 pb-40">
      
      {/* Header - Wiyata Modern */}
      <div className="bg-white border-2 border-slate-200 overflow-hidden">
         <div className="bg-[#004c8c] border-b-2 border-amber-400 px-8 py-3 flex items-center gap-2">
            <Factory className="w-4 h-4 text-amber-400" />
            <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Laboratorium Produksi Masal Soal (AI Factory)</p>
         </div>
         <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-[#004c8c] flex items-center justify-center border-4 border-slate-100">
                  <BrainCircuit className="w-8 h-8 text-white" />
               </div>
               <div>
                  <h1 className="text-4xl font-black text-black uppercase tracking-tighter">Pabrik Soal AI</h1>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Hasilkan Puluhan Instrumen Soal Dalam Hitungan Detik</p>
               </div>
            </div>
            <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-black transition-all bg-slate-50 px-4 py-2 border border-slate-200 uppercase">
               <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
         </div>
      </div>

      {error && (
         <div className="bg-red-50 border-2 border-red-600 p-6 text-red-700 font-black flex items-center gap-4 animate-shake">
            <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center shrink-0">!</div>
            <p className="text-lg uppercase italic">{error}</p>
         </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Configuration Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-white border-2 border-slate-200 p-8 shadow-[8px_8px_0px_#e2e8f0]">
              <div className="flex items-center gap-2 mb-6 border-b-2 border-slate-100 pb-4">
                 <Settings2 className="w-5 h-5 text-[#004c8c]" />
                 <h2 className="text-lg font-black text-black uppercase tracking-tighter">Konfigurasi Produksi</h2>
              </div>

              <div className="space-y-5">
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mata Pelajaran</label>
                    <select value={mapel} onChange={e => setMapel(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 p-3 font-bold outline-none focus:border-[#004c8c]">
                       <option value="">Pilih Mapel</option>
                       {DAFTAR_MAPEL.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tingkat Kelas</label>
                       <select value={kelas} onChange={e => setKelas(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 p-3 font-bold outline-none focus:border-[#004c8c]">
                          <option value="">Kelas</option>
                          {[7, 8, 9, 10, 11, 12].map(k => <option key={k} value={String(k)}>{k}</option>)}
                       </select>
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jumlah Soal</label>
                       <select value={jumlah} onChange={e => setJumlah(Number(e.target.value))} className="w-full bg-slate-50 border-2 border-slate-200 p-3 font-bold outline-none focus:border-[#004c8c]">
                          {[5, 10, 15, 20].map(v => <option key={v} value={v}>{v} Butir</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bab / Materi</label>
                    <input type="text" value={bab} onChange={e => setBab(e.target.value)} placeholder="Misal: Eksponensial" className="w-full bg-slate-50 border-2 border-slate-200 p-3 font-bold outline-none focus:border-[#004c8c]" />
                 </div>

                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Topik Spesifik</label>
                    <textarea value={topik} onChange={e => setTopik(e.target.value)} placeholder="Contoh: Perkalian pangkat yang sama..." rows={3} className="w-full bg-slate-50 border-2 border-slate-200 p-3 font-bold outline-none focus:border-[#004c8c] resize-none" />
                 </div>

                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tingkat Kesulitan</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['mudah', 'sedang', 'sulit', 'campuran'].map(t => (
                          <button key={t} onClick={() => setTingkat(t as any)} className={cn("px-3 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all", tingkat === t ? "bg-[#004c8c] border-[#004c8c] text-white" : "bg-white border-slate-200 text-slate-400 hover:border-[#004c8c]")}>
                             {t}
                          </button>
                       ))}
                    </div>
                 </div>

                 <button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="w-full group relative bg-black text-white p-5 font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:bg-[#004c8c]"
                 >
                    <div className="flex items-center justify-center gap-3">
                       {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6 text-amber-400" />}
                       <span className="text-lg">{isGenerating ? 'Mesin Bekerja...' : 'Ciptakan Soal'}</span>
                    </div>
                 </button>
              </div>
           </div>
           
           <div className="bg-amber-50 border-2 border-amber-500 p-6">
              <div className="flex gap-4">
                 <Wand2 className="w-6 h-6 text-amber-600 shrink-0" />
                 <div>
                    <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">Tips AI Factory</h4>
                    <p className="text-[10px] text-amber-700 font-bold leading-relaxed italic">
                       Semakin spesifik topik yang Anda tulis, semakin akurat AI membuat soalnya. 20 soal adalah limit optimal untuk performa terbaik.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Results Panel */}
        <div className="lg:col-span-8">
           {!isGenerating && generatedItems.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 h-[600px] flex flex-col items-center justify-center text-center p-10">
                 <Factory className="w-20 h-20 text-slate-100 mb-6" />
                 <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tighter">Pabrik Belum Beroperasi</h3>
                 <p className="text-slate-400 font-medium">Tentukan konfigurasi di panel kiri untuk mulai memproduksi soal.</p>
              </div>
           ) : isGenerating ? (
              <div className="bg-white border-2 border-slate-200 h-[600px] flex flex-col items-center justify-center text-center p-10">
                 <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-8 border-t-[#004c8c] border-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <BrainCircuit className="w-12 h-12 text-[#004c8c] animate-pulse" />
                    </div>
                 </div>
                 <h3 className="text-3xl font-black text-black uppercase tracking-tighter mb-2">Meramu Instrumen Soal...</h3>
                 <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest max-w-sm mx-auto">AI sedang menganalisis kurikulum dan merancang butir soal sesuai parameter Anda.</p>
              </div>
           ) : (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="bg-white border-2 border-[#004c8c] p-6 flex items-center justify-between sticky top-0 z-20 shadow-lg">
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                          <p className="text-xl font-black text-black uppercase tracking-tighter">{generatedItems.length} Soal Tercipta</p>
                       </div>
                       <div className="h-4 w-px bg-slate-200"></div>
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selectedIndices.size} Soal Terpilih</p>
                    </div>
                    <button 
                       onClick={handleSaveSelected} 
                       disabled={selectedIndices.size === 0 || isSaving}
                       className="bg-[#004c8c] text-white px-8 py-3 font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all disabled:opacity-50 shadow-[4px_4px_0px_#fbbf24]"
                    >
                       {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                       {isSaving ? 'Menyimpan...' : 'Simpan Semua Terpilih'}
                    </button>
                 </div>

                 <div className="space-y-4">
                    {generatedItems.map((q, idx) => {
                       const isSelected = selectedIndices.has(idx)
                       return (
                          <div key={idx} className={cn("bg-white border-2 transition-all p-6 group", isSelected ? "border-[#004c8c]" : "border-slate-200")}>
                             <div className="flex gap-6">
                                <button 
                                   onClick={() => toggleSelect(idx)}
                                   className={cn("w-8 h-8 shrink-0 flex items-center justify-center border-2 transition-all", isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-transparent")}
                                >
                                   <Check className="w-5 h-5" />
                                </button>

                                <div className="flex-1">
                                   <div className="flex items-center justify-between mb-2">
                                      <p className="text-[10px] font-black text-[#004c8c] uppercase tracking-widest">Butir Soal #{idx + 1}</p>
                                      <span className="text-[9px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 uppercase">Draft</span>
                                   </div>

                                   <div className="text-lg font-black text-black leading-relaxed mb-6">
                                      <RenderText text={q.pertanyaan} />
                                   </div>

                                   {q.opsi ? (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                         {Object.entries(q.opsi).map(([key, val]: any) => (
                                            <div key={key} className={cn("p-3 border text-sm flex gap-3", q.jawaban === key ? "bg-green-50 border-green-200 text-green-900 font-bold" : "bg-slate-50 border-slate-100 text-slate-600")}>
                                               <span className="opacity-50">{key}.</span>
                                               <RenderText text={val} />
                                            </div>
                                         ))}
                                      </div>
                                   ) : (
                                      <div className="mb-6 p-4 bg-slate-50 border border-dashed text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tipe Soal Essay / Uraian</div>
                                   )}

                                   <div className="bg-slate-50 border border-slate-100 p-4">
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                         <Info className="w-3 h-3" /> Penjelasan Teknis
                                      </p>
                                      <p className="text-xs text-slate-600 font-bold italic leading-relaxed">{q.penjelasan}</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                       )
                    })}
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  )
}
