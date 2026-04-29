import { Bell, Activity, ChevronRight } from 'lucide-react'

export default function AdminTopbar() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 h-12 flex items-center justify-between">
      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
        <span>HQ_CENTRAL</span>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-900 font-black">CORE_DASHBOARD</span>
        <span className="ml-4 text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono">v1.0-STABLE</span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* System Health Indicators */}
        <div className="hidden md:flex items-center gap-3 pr-4 border-r border-slate-100">
           <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Server_Up</span>
           </div>
           <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">LAT: 24ms</span>
           </div>
        </div>

        {/* Notifications & Alert */}
        <button className="relative text-slate-400 hover:text-slate-900 transition-all p-1.5 rounded-md hover:bg-slate-100">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
      </div>
    </header>
  )
}
