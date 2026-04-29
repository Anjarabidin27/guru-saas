'use client'

import { Edit3, Copy, Trash2, Star, FileText, ChevronRight, Folder } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Soal {
  id: string
  teks_soal: string
  mapel: string
  kelas: string
  jenis_soal: string
  level_kognitif: string
  created_at: string
  is_favorite?: boolean
  bab?: string
}

interface SoalListTableProps {
  folders: any[]
  soalList: Soal[]
  selectedId?: string
  onSelect: (soal: Soal) => void
  onFolderClick: (folder: any) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onToggleFavorite: (id: string, status: boolean) => void
  onEdit: (id: string) => void
}

export default function SoalListTable({
  folders, soalList, selectedId, onSelect, onFolderClick,
  onDelete, onDuplicate, onToggleFavorite, onEdit
}: SoalListTableProps) {
  
  const isEmpty = folders.length === 0 && soalList.length === 0

  if (isEmpty) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 space-y-6 text-slate-300 bg-white">
        <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200">
          <Folder size={40} strokeWidth={1} className="text-slate-300" />
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Workspace Kosong</p>
          <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-widest max-w-[200px] leading-relaxed">
            Belum ada instrumen yang ditemukan di folder ini.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto scrollbar-hide bg-[#f8fafc] w-full">
      <div className="min-w-[800px]">
        <table className="w-full text-left border-separate border-spacing-0 px-6 pt-4">
          <thead className="sticky top-0 bg-[#f8fafc] z-10">
            <tr>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-200">IDENTITAS ITEM</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-200 hidden md:table-cell">TAKSONOMI</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-200 hidden sm:table-cell text-center">TIMESTAMP</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-200 text-right">KOMANDO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* FOLDERS */}
            {folders.map((folder, idx) => (
              <tr 
                key={`folder-${idx}`}
                onClick={() => onFolderClick(folder)}
                className="group cursor-pointer hover:bg-white transition-all duration-150"
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-md flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <Folder size={16} strokeWidth={2.5} fill="currentColor" className="opacity-40" />
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-none">
                        {folder.name}
                      </p>
                      <p className="text-[10px] text-blue-600 font-bold mt-1.5 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                        <span className="w-1 h-1 bg-blue-600 rounded-full" />
                        {folder.count} Dokumen Terdeteksi
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5 hidden md:table-cell">
                   <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-black text-slate-600 uppercase tracking-widest">
                     DIR // {folder.type}
                   </div>
                </td>
                <td className="px-4 py-2.5 hidden sm:table-cell text-center">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">-- : --</span>
                </td>
                <td className="px-4 py-2.5 text-right">
                   <div className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center ml-auto group-hover:bg-slate-950 group-hover:border-slate-950 group-hover:text-white transition-all">
                      <ChevronRight size={14} strokeWidth={4} />
                   </div>
                </td>
              </tr>
            ))}

            {/* ACTUAL SOAL ITEMS */}
            {soalList.map((s) => (
              <tr 
                key={s.id}
                onClick={() => onSelect(s)}
                className={cn(
                  "group cursor-pointer transition-all duration-150 relative",
                  selectedId === s.id ? "bg-white ring-1 ring-inset ring-slate-950 z-[1]" : "hover:bg-white hover:ring-1 hover:ring-inset hover:ring-slate-200"
                )}
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-all border",
                      selectedId === s.id 
                        ? "bg-slate-950 border-slate-950 text-white shadow-md shadow-slate-950/20" 
                        : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-400 group-hover:text-slate-500"
                    )}>
                      <FileText size={16} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <p className={cn(
                        "text-[13px] font-black transition-colors uppercase tracking-tight leading-tight truncate max-w-[600px]",
                        selectedId === s.id ? "text-slate-950" : "text-slate-700"
                      )}>
                        {s.teks_soal.replaceAll('$', '')}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                          {s.bab || 'MODUL UMUM'}
                        </p>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest leading-none">
                           {s.level_kognitif}
                        </p>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-2.5 hidden md:table-cell">
                  <div className="flex flex-col gap-1.5">
                    <div className="inline-flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                        {s.mapel}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                        TINGKAT {s.kelas}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-2.5 hidden sm:table-cell text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[11px] font-black text-slate-900 uppercase">
                        {new Date(s.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">
                        {new Date(s.created_at).getFullYear()}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onToggleFavorite(s.id, !!s.is_favorite) }}
                      className={cn(
                        "p-1.5 rounded-md transition-all border",
                        s.is_favorite ? "bg-amber-400 border-amber-400 text-white shadow-sm" : "bg-white border-slate-200 text-slate-400 hover:border-amber-400 hover:text-amber-500"
                      )}
                    >
                      <Star size={14} fill={s.is_favorite ? "currentColor" : "none"} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDuplicate(s.id) }}
                      className="p-1.5 bg-white text-slate-500 border border-slate-200 hover:border-slate-950 hover:text-slate-950 rounded-md transition-all shadow-sm"
                    >
                      <Copy size={14} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit(s.id) }}
                      className="p-1.5 bg-white text-slate-500 border border-slate-200 hover:border-slate-950 hover:text-slate-950 rounded-md transition-all shadow-sm"
                    >
                      <Edit3 size={14} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(s.id) }}
                      className="p-1.5 bg-white text-rose-400 border border-slate-200 hover:border-rose-600 hover:text-rose-600 rounded-md transition-all shadow-sm"
                    >
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
