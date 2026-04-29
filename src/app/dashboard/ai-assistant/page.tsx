'use client'

import { useState, useRef, useEffect } from 'react'
import { askAiAssistant } from '@/lib/actions/ai-assistant'
import { AIModel } from '@/lib/services/ai'

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'OPERASIONAL: MESIN KONSULTASI PEDAGOGIK AKTIF.\nSilakan masukkan instruksi pemrosesan materi pengajaran atau kurikulum ke dalam terminal input di bawah.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState<AIModel>('gemini-1.5-flash')
  
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function handleSend() {
    if (!input.trim() || loading) return
    
    const userMsg = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const history = messages.slice(1) // exclude greeting
      const answer = await askAiAssistant({
        message: userMsg,
        history: history,
        model: model
      })
      setMessages(prev => [...prev, { role: 'assistant', content: answer || 'KESALAHAN: MESIN TIDAK DAPAT MEMROSES PERMINTAAN.' }])
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `KESALAHAN FATAL: ${e.message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl text-black pb-10">
      
      {/* Header Panel Administrator */}
      <div className="bg-white border border-slate-400 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
         <div>
            <h1 className="text-2xl font-bold text-black mb-1 uppercase">Terminal Konsultasi Pedagogik (AI)</h1>
            <p className="text-base font-medium text-slate-800">Sistem Pakar Otomatis untuk Bantuan Penyusunan Kurikulum dan Analisis Akademik.</p>
         </div>
         <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-800 uppercase mb-1">GANTI MESIN PEMROSESAN (OTAK AI):</label>
            <select 
               value={model} 
               onChange={(e) => setModel(e.target.value as AIModel)}
               className="border border-slate-400 p-2 text-sm font-bold text-black outline-none bg-white font-mono uppercase w-64"
            >
               <option value="gemini-1.5-flash">MESIN GOOGLE: GEMINI 1.5</option>
               <option value="gpt-4o">MESIN OPENAI: GPT-4O</option>
               <option value="claude-3-5-sonnet">MESIN ANTHROPIC: CLAUDE 3.5</option>
            </select>
         </div>
      </div>

      {/* Terminal History */}
      <div className="flex-1 bg-white border border-slate-400 shadow-sm flex flex-col overflow-hidden">
         <div className="bg-slate-200 border-b border-slate-400 px-6 py-2">
            <h2 className="text-xs font-bold text-black uppercase tracking-widest leading-none">Log Riwayat Analisis</h2>
         </div>
         
         <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 font-mono text-sm leading-relaxed">
            {messages.map((m, idx) => (
               <div key={idx} className={`p-4 border ${m.role === 'user' ? 'bg-blue-50 border-blue-900 mx-auto w-full md:w-3/4 ml-auto text-right' : 'bg-slate-50 border-slate-400 w-full md:w-5/6 mr-auto text-left whitespace-pre-wrap'}`}>
                  <div className={`text-xs font-bold uppercase mb-2 ${m.role === 'user' ? 'text-blue-900' : 'text-slate-800'}`}>
                     [{m.role === 'user' ? 'INPUT TENAGA PENDIDIK' : `KELUARAN MESIN (${model.split('-')[0]})`}]
                  </div>
                  <div className="font-medium text-black">
                     {m.content}
                  </div>
               </div>
            ))}
            
            {loading && (
               <div className="p-4 border bg-yellow-50 border-yellow-800 w-full md:w-5/6 mr-auto text-left">
                  <div className="text-xs font-bold uppercase mb-2 text-yellow-900">
                     [STATUS MESIN]
                  </div>
                  <div className="font-bold text-black uppercase blink">
                     Memproses Data... Harap Tunggu.
                  </div>
               </div>
            )}
         </div>
         
         {/* Input Command Area */}
         <div className="border-t border-slate-400 bg-slate-100 p-4">
            <div className="flex gap-4">
               <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                     }
                  }}
                  placeholder="KETIK INSTRUKSI ATAU PERTANYAAN DI SINI... (TEKAN ENTER UNTUK MENGIRIM)"
                  disabled={loading}
                  rows={3}
                  className="flex-1 bg-white border border-slate-400 p-3 text-sm font-mono font-bold text-black outline-none focus:border-blue-900 disabled:bg-slate-200 resize-none uppercase"
               />
               <button 
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="bg-black text-white font-bold px-8 text-sm uppercase hover:bg-slate-800 transition-colors disabled:bg-slate-400 border border-black h-full flex items-center justify-center min-h-[5rem]"
               >
                  EKSEKUSI <br/> PERINTAH
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}
