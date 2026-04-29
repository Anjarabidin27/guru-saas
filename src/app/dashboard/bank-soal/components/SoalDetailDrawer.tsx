'use client'

import { X, Sparkles, CheckCircle2, Download, Edit3, Info, Eye, Clock, Hash, BookOpen, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

interface Soal {
  id: string
  teks_soal: string
  mapel: string
  kelas: string
  jenis_soal: string
  level_kognitif: string
  pilihan_a?: string
  pilihan_b?: string
  pilihan_c?: string
  pilihan_d?: string
  pilihan_e?: string
  kunci_jawaban?: string
  pembahasan?: string
  created_at: string
}

interface SoalDetailDrawerProps {
  soal: Soal | null
  onClose: () => void
  onEdit: (id: string) => void
}

export default function SoalDetailDrawer({ soal, onClose, onEdit }: SoalDetailDrawerProps) {
  if (!soal) return null

  const renderMath = (text: string, isBlock = false) => {
    if (!text.includes('$')) return <span className="leading-relaxed whitespace-pre-wrap">{text}</span>
    return isBlock ? <BlockMath math={text.replaceAll('$', '')} /> : <InlineMath math={text.replaceAll('$', '')} />
  }

  return (
    <div className="absolute inset-y-0 right-0 w-full lg:w-[600px] bg-white border-l border-slate-950 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
      
      {/* Header - Industrial Style */}
      <div className="h-[72px] px-8 flex items-center justify-between border-b border-slate-200 bg-slate-950 text-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-white">
            <Eye size={18} strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] leading-none text-white/50 mb-1">Inspector</h2>
            <p className="text-sm font-black uppercase tracking-tight leading-none">Dokumen Properti</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 hover:bg-white/10 text-white/40 hover:text-white rounded transition-all flex items-center justify-center"
        >
          <X size={20} strokeWidth={3} />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        
        {/* Document ID / Type */}
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">UID Dokumen</span>
              <span className="text-[11px] font-bold text-slate-900 font-mono leading-none tracking-tighter">{soal.id}</span>
           </div>
           <div className="px-3 py-1 bg-black text-white rounded text-[9px] font-black uppercase tracking-widest">
              Type: {soal.jenis_soal}
           </div>
        </div>

        <div className="p-10 space-y-12">
          {/* Question Content */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-slate-950 border-b border-slate-100 pb-4">
              <Layers size={16} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Payload Konten</span>
            </div>

            <div className="text-xl font-black text-slate-900 leading-snug uppercase tracking-tight py-4">
              {renderMath(soal.teks_soal, true)}
            </div>

            {/* Options Matrix */}
            {soal.jenis_soal === 'pilihan_ganda' && (
              <div className="grid grid-cols-1 gap-4 pt-4">
                {['A', 'B', 'C', 'D', 'E'].map(huruf => {
                  const key = `pilihan_${huruf.toLowerCase()}` as keyof Soal
                  const content = soal[key]
                  const isKunci = soal.kunci_jawaban === huruf
                  if (!content) return null
                  return (
                    <div key={huruf} className={cn(
                      "p-5 rounded-lg border-2 transition-all flex items-start gap-4",
                      isKunci ? "bg-blue-50 border-blue-600 ring-4 ring-blue-600/5 shadow-md" : "bg-white border-slate-100 hover:border-slate-300"
                    )}>
                      <div className={cn(
                        "w-8 h-8 rounded flex items-center justify-center text-xs font-black shrink-0 transition-all border-2",
                        isKunci ? "bg-blue-600 border-blue-600 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                      )}>{huruf}</div>
                      <div className={cn("text-[13px] pt-1.5 font-bold leading-tight uppercase tracking-tight", isKunci ? "text-blue-950" : "text-slate-700")}>
                        {renderMath(content as string)}
                      </div>
                      {isKunci && <CheckCircle2 className="ml-auto text-blue-600" size={20} strokeWidth={3} />}
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Classification Specs */}
          <section className="pt-10 border-t border-slate-200 grid grid-cols-2 gap-px bg-slate-200">
             <div className="bg-white p-6 flex flex-col gap-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kategori</span>
                <span className="text-[12px] font-black text-slate-950 uppercase">{soal.mapel}</span>
             </div>
             <div className="bg-white p-6 flex flex-col gap-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tingkat</span>
                <span className="text-[12px] font-black text-slate-950 uppercase">KLS {soal.kelas}</span>
             </div>
             <div className="bg-white p-6 flex flex-col gap-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kognitif</span>
                <span className="text-[12px] font-black text-blue-600 uppercase">{soal.level_kognitif}</span>
             </div>
             <div className="bg-white p-6 flex flex-col gap-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sinkronisasi</span>
                <span className="text-[12px] font-black text-slate-950 uppercase">{new Date(soal.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
             </div>
          </section>

          {/* Technical Discussion Area */}
          {soal.pembahasan && (
            <section className="p-8 bg-slate-950 rounded-lg relative overflow-hidden">
               <div className="relative space-y-6">
                  <div className="flex items-center gap-3 text-white">
                     <Info size={16} strokeWidth={3} />
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Academic Log // Analysis</h4>
                  </div>
                  <div className="text-[13px] font-bold text-white/70 leading-relaxed uppercase tracking-tight italic">
                    {renderMath(soal.pembahasan)}
                  </div>
               </div>
            </section>
          )}
        </div>
      </div>

      {/* Footer Interface */}
      <div className="px-8 py-6 border-t border-slate-200 bg-white grid grid-cols-2 gap-4 shrink-0">
        <button 
          onClick={() => onEdit(soal.id)}
          className="flex items-center justify-center gap-3 bg-slate-950 hover:bg-black text-white h-12 rounded-lg font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 transition-all active:scale-95 border-b-4 border-slate-800"
        >
          <Edit3 size={14} strokeWidth={3} />
          <span>Edit Instrumen</span>
        </button>
        <button 
          className="flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 h-12 rounded-lg font-black text-xs uppercase tracking-widest transition-all shadow-sm border-b-4 border-slate-100"
        >
          <Download size={14} strokeWidth={3} />
          <span>Export PDF</span>
        </button>
      </div>
    </div>
  )
}
