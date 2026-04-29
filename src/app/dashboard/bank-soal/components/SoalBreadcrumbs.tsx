'use client'

import { ChevronRight, Home, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SoalBreadcrumbsProps {
  path: string[]
  setPath: (path: string[]) => void
}

export default function SoalBreadcrumbs({ path, setPath }: SoalBreadcrumbsProps) {
  return (
    <nav className="px-6 py-2 flex items-center gap-2 bg-white border-b border-slate-200 shrink-0 select-none overflow-x-auto scrollbar-hide shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
      <button 
        onClick={() => setPath([])}
        className={cn(
          "flex items-center gap-2 text-[10px] font-bold transition-all hover:text-black shrink-0",
          path.length === 0 ? "text-slate-900 bg-slate-100 px-3 py-1.5 rounded-md" : "text-slate-400 hover:bg-slate-50 px-2 py-1.5 rounded-md"
        )}
      >
        <Home size={14} strokeWidth={2.5} />
        <span className="uppercase tracking-widest">Workspace Root</span>
      </button>

      {path.map((segment, index) => (
        <div key={index} className="flex items-center gap-2 shrink-0">
          <ChevronRight size={14} className="text-slate-300" strokeWidth={2.5} />
          <button 
            onClick={() => setPath(path.slice(0, index + 1))}
            className={cn(
              "text-[10px] font-bold transition-all hover:text-black px-3 py-1.5 rounded-md flex items-center gap-2 shrink-0",
              index === path.length - 1 ? "text-slate-950 bg-slate-100 ring-1 ring-inset ring-slate-200 shadow-sm" : "text-slate-400 hover:bg-slate-50"
            )}
          >
            {index < 2 && <FolderOpen size={14} className={cn(index === path.length -1 ? "text-slate-600" : "text-slate-300")} strokeWidth={2} />}
            <span className="uppercase tracking-widest whitespace-nowrap">{segment}</span>
          </button>
        </div>
      ))}
    </nav>
  )
}
