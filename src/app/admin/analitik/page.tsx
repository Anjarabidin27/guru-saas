'use client'

import { useState, useEffect } from 'react'
import { getAnalyticsData } from '@/lib/actions/admin'
import { Users, Building2, FileText, ClipboardCheck, ArrowUpRight, BarChart as ChartIcon, Monitor, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

type Metrics = { users: number; schools: number; soal: number; penilaian: number }
type RecentUser = { nama_lengkap: string | null; role: string; created_at: string }

export default function AdminAnalitikPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      const res = await getAnalyticsData()
      if (res.error) {
        setError(res.error)
      } else {
        setMetrics(res.metrics as Metrics)
        setRecentUsers(res.recentUsers as RecentUser[])
      }
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg text-[11px] font-black uppercase tracking-widest">
        CRITICAL_ERROR: {error}
      </div>
    )
  }

  return (
    <div className="animate-fade-up max-w-[1400px] mx-auto flex flex-col gap-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-none uppercase">Analytical_Data_Engine</h1>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
           <Globe className="w-3 h-3" />
           Platform Performance Agreggation
        </p>
      </div>

      {/* METRIC CARDS - HIGH DENSITY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="System Users" value={metrics?.users} icon={Users} trend="+4.5%" />
        <MetricCard title="Linked Schools" value={metrics?.schools} icon={Building2} trend="+12" />
        <MetricCard title="Question Bank" value={metrics?.soal} icon={FileText} trend="+1.2k" />
        <MetricCard title="Active Assessment" value={metrics?.penilaian} icon={ClipboardCheck} trend="Live" />
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* CHART ENGINE MOCKUP (Left — 8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-6 flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-10">
             <div>
                <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-1">Activity_Heatmap_30D</h2>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                   <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> API Requests</span>
                   <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-200" /> Cached</span>
                </div>
             </div>
             <div className="flex gap-2">
                <button className="px-2 py-1 text-[9px] font-black text-slate-900 bg-slate-100 rounded border border-slate-200">24H</button>
                <button className="px-2 py-1 text-[9px] font-black text-white bg-slate-900 rounded border border-slate-900">30D</button>
             </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-1.5 h-48 border-b border-slate-100 pb-2">
            {[40, 20, 60, 45, 80, 55, 90, 70, 30, 85, 100, 65, 50, 75, 40, 20, 60, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="w-full relative group h-full flex items-end justify-center">
                <div 
                  className="w-full bg-slate-100 hover:bg-slate-900 transition-all cursor-crosshair rounded-t-[1px]"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-[9px] uppercase font-black text-slate-400 tracking-widest">
            <span>Period_Start</span>
            <span>Mid_Cycle</span>
            <span>Current_Index</span>
          </div>
        </div>

        {/* REGISTRY LOGS (Right — 4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Latest_Registries</h2>
              <Monitor className="w-3.5 h-3.5 text-slate-300" />
           </div>
           <div className="flex flex-col gap-2">
             {recentUsers.length === 0 ? (
               <p className="text-[10px] text-slate-400 uppercase font-bold text-center py-10">Empty_Registry_Set</p>
             ) : (
               recentUsers.map((u, i) => (
                 <div key={i} className="flex items-center gap-3 p-2 bg-slate-50/50 rounded border border-slate-100 hover:bg-white transition-all group">
                   <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-[9px] uppercase flex-shrink-0 text-slate-500 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-800 transition-all">
                     {u.nama_lengkap ? u.nama_lengkap.substring(0, 2) : 'AN'}
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-[11px] font-bold text-slate-900 truncate tracking-tight">{u.nama_lengkap || 'Unknown_Identity'}</p>
                     <p className="text-[9px] uppercase font-black text-slate-400 truncate tracking-widest mt-0.5">{u.role}</p>
                   </div>
                   <ArrowUpRight className="w-2.5 h-2.5 text-slate-300 group-hover:text-slate-900 transition-colors" />
                 </div>
               ))
             )}
           </div>
           <button className="w-full mt-6 py-2 border border-slate-200 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 rounded">
              Launch Full Audit
           </button>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, trend }: { title: string, value: number | undefined, icon: any, trend: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-all">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">{title}</h3>
        <Icon className="w-3.5 h-3.5 text-slate-400" />
      </div>
      <div className="flex items-end justify-between">
         <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value !== undefined ? value.toLocaleString() : '0'}</p>
         <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">{trend}</span>
      </div>
    </div>
  )
}
