'use client'

import { Search, Plus, Filter, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DAFTAR_MAPEL, DAFTAR_KELAS } from '@/lib/constants'

interface SoalFilterBarProps {
  search: string
  setSearch: (val: string) => void
  filterMapel: string[]
  setFilterMapel: (val: string[]) => void
  filterKelas: string[]
  setFilterKelas: (val: string[]) => void
  onAddClick: () => void
  onGenerateClick: () => void
}

export default function SoalFilterBar({
  search, setSearch,
  filterMapel, setFilterMapel,
  filterKelas, setFilterKelas,
  onAddClick,
  onGenerateClick
}: SoalFilterBarProps) {
  
  const toggleMapel = (m: string) => {
    if (filterMapel.includes(m)) setFilterMapel(filterMapel.filter(x => x !== m))
    else setFilterMapel([...filterMapel, m])
  }

  const toggleKelas = (k: string) => {
    if (filterKelas.includes(k)) setFilterKelas(filterKelas.filter(x => x !== k))
    else setFilterKelas([...filterKelas, k])
  }

  const activeFiltersCount = filterMapel.length + filterKelas.length

  return (
    <header className="bg-white border-b border-slate-200 shrink-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Primary Actions Row */}
      <div className="flex items-center justify-between px-6 py-3 gap-6">
        
        {/* Authoritative Search Area */}
        <div className="relative group flex-1 max-w-3xl">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors pointer-events-none">
            <Search size={18} strokeWidth={2.5} />
          </div>
          <input 
            placeholder="Cari instrumen, soal, atau materi pembelajaran..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-slate-400 transition-all shadow-sm"
          />
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onGenerateClick}
            className="group flex items-center gap-2 bg-white hover:bg-amber-50 text-amber-600 px-4 py-2 rounded-lg font-black text-xs border border-amber-200 shadow-sm transition-all active:scale-95 uppercase tracking-widest"
          >
            <Zap size={16} fill="currentColor" className="group-hover:scale-110 transition-transform" />
            <span>Gen AI Studio</span>
          </button>
          
          <button 
            onClick={onAddClick}
            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg font-black text-xs border border-slate-900 shadow-sm hover:shadow-md transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Instrumen Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Matrix Tray */}
      <div className="flex items-center gap-4 px-6 py-2 bg-slate-50/80 border-t border-slate-200 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 text-slate-500 shrink-0 border-r border-slate-200 pr-4">
          <Filter size={14} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap">Filter Workspace</span>
          {activeFiltersCount > 0 && (
            <span className="bg-slate-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {activeFiltersCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap">
          {/* Mapel Filters */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-md shadow-sm">
             <button 
                onClick={() => setFilterMapel([])}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[11px] font-bold transition-all uppercase tracking-tight",
                  filterMapel.length === 0 ? "bg-white border border-slate-200 text-slate-900 shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                )}
              >Semua Mapel</button>
              {DAFTAR_MAPEL.map(m => (
                <button 
                  key={m}
                  onClick={() => toggleMapel(m)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-[11px] font-bold transition-all uppercase tracking-tight",
                    filterMapel.includes(m) ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >{m}</button>
              ))}
          </div>

          <div className="w-[1px] h-4 bg-slate-200 mx-2" />

          {/* Kelas Filters */}
          <div className="flex items-center gap-1 p-1 bg-slate-50/50 border border-slate-200/50 rounded-lg shadow-sm">
             <button 
                onClick={() => setFilterKelas([])}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[11px] font-bold transition-all uppercase tracking-tight",
                  filterKelas.length === 0 ? "bg-white border border-slate-200 text-slate-900 shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                )}
              >Semua Tingkatan</button>
              {DAFTAR_KELAS.map(k => (
                <button 
                  key={k}
                  onClick={() => toggleKelas(k)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-[11px] font-bold transition-all uppercase tracking-tight",
                    filterKelas.includes(k) ? "bg-emerald-600 text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >Kelas {k}</button>
              ))}
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button 
            onClick={() => { setFilterMapel([]); setFilterKelas([]); }}
            className="ml-auto text-[9px] font-black text-rose-600 uppercase tracking-widest hover:underline decoration-2"
          >
            Reset Filter
          </button>
        )}
      </div>
    </header>
  )
}
