import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { FileText, Upload, Plus, Search, Filter, HardDrive, Database, Globe, Share2 } from 'lucide-react'
import MateriClient from './MateriClient'
import { cn } from '@/lib/utils'

export default async function MateriPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [materiRes, profileRes] = await Promise.all([
    supabase.from('materi').select('*', { count: 'exact' }).eq('guru_id', user?.id ?? '').order('created_at', { ascending: false }),
    supabase.from('profiles').select('nama_lengkap, sekolah:sekolah_id(nama)').eq('id', user?.id ?? '').single()
  ])

  const materiList = materiRes.data
  const count = materiRes.count
  const profile = profileRes.data

  // Kalkulasi Stats Sederhana
  const totalFiles = count ?? 0
  const extractedCount = materiList?.filter(m => m.isi_ekstraksi).length ?? 0

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header - High Density Industrial */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded shadow-sm">Digital Repository</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Bank Modul Ajar</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">RUANG_MATERI.V1</h1>
          <p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-tight">Katalog Modul, RPP, dan Bahan Ajar Digital Bapak/Ibu</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard/materi/upload" className="bg-slate-950 text-white font-black text-[10px] px-8 py-3.5 rounded-xl transition-all shadow-xl hover:scale-105 uppercase tracking-[0.2em] flex items-center gap-2 border border-slate-800">
             <Upload className="w-4 h-4" /> Upload Materi Baru
          </Link>
        </div>
      </div>

      {/* Industrial Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <Database className="w-4 h-4 text-emerald-600" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inventory</span>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{totalFiles}</p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Total File Dokumentasi</p>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Visibility</span>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{materiList?.filter(m => m.is_shared).length ?? 0}</p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Materi Terpublikasi</p>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <Plus className="w-4 h-4 text-purple-600" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AI Readiness</span>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{extractedCount}</p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">File Siap Konteks AI</p>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <HardDrive className="w-4 h-4 text-slate-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Storage</span>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">0.05 <span className="text-xs">GB</span></p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Kapasitas Terpakai</p>
         </div>
      </div>

      {/* Main Grid & Filtering Logic (Client Component) */}
      <MateriClient 
        initialMateri={materiList ?? []} 
        profile={profile}
      />

      {/* RAG Information Banner */}
      <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="flex gap-5 items-start">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md shrink-0">
                <FileText className="w-6 h-6 text-emerald-600" />
             </div>
             <div>
                <h3 className="text-lg font-black text-slate-900 italic tracking-tight">Otomasi Konteks AI (RAG)</h3>
                <p className="text-sm text-slate-500 font-medium max-w-xl leading-relaxed mt-1">
                   Semua file yang Bapak/Ibu upload akan otomatis dipelajari oleh AI. Saaat membuat soal di 
                   <span className="font-black text-slate-900"> AI Studio</span>, AI akan mengambil data dari materi ini agar soal yang dihasilkan akurat dan sesuai kurikulum Bapak/Ibu.
                </p>
             </div>
          </div>
          <button className="bg-slate-950 text-white font-black text-[10px] px-8 py-3.5 rounded-xl uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-colors">
             Pelajari Sistem RAG
          </button>
      </div>
    </div>
  )
}
