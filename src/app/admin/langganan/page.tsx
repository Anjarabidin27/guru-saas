'use client'

import { useState, useEffect } from 'react'
import { getDaftarSekolah } from '@/lib/actions/sekolah'
import { cn } from '@/lib/utils'
import { 
  CreditCard, 
  ShieldCheck, 
  Clock, 
  Building2, 
  Search, 
  ArrowUpRight, 
  Filter,
  Package,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

type Sekolah = {
  id: string
  nama: string
  kota: string
  status_langganan: 'free' | 'pro' | 'enterprise'
  kuota_guru: number
  created_at: string
  guru_count: number
}

export default function AdminLanggananPage() {
  const [data, setData] = useState<Sekolah[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const res = await getDaftarSekolah()
    if (!res.error) setData(res.data as Sekolah[])
    setLoading(false)
  }

  const filtered = data.filter(s => 
    s.nama.toLowerCase().includes(search.toLowerCase()) ||
    s.status_langganan.toLowerCase().includes(search.toLowerCase())
  )

  const stats = [
    { label: 'Total B2B Premium', value: data.filter(s => s.status_langganan !== 'free').length, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Trial Active', value: data.filter(s => s.status_langganan === 'free').length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Potential Upgrade', value: data.filter(s => s.guru_count >= s.kuota_guru - 1).length, icon: ArrowUpRight, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  if (loading) return (
     <div className="flex flex-col items-center justify-center p-20 animate-pulse">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing_License_Registry...</p>
     </div>
  )

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto animate-fade-up">
      {/* Header - Billing Matrix */}
      <div className="flex justify-between items-end pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-none uppercase">License_Registry_Hub</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5" /> Subscription_Management_Protocol
          </p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase px-4 py-2 rounded hover:bg-slate-50 transition-colors">Export Billing Data</button>
           <button className="bg-slate-900 text-white text-[10px] font-black uppercase px-4 py-2 rounded hover:bg-black transition-colors shadow-lg shadow-slate-900/20">Create Global Promo</button>
        </div>
      </div>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white border border-slate-200 p-4 rounded-lg flex items-center justify-between group hover:border-slate-400 transition-all">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                  <p className="text-2xl font-black text-slate-900">{s.value}</p>
               </div>
               <div className={cn("p-2.5 rounded-lg", s.bg)}>
                  <Icon className={cn("w-5 h-5", s.color)} />
               </div>
            </div>
          )
        })}
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
           <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Active_Subscription_Matrix</h2>
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="FILTER_BY_INSTITUTION..."
                className="bg-white border border-slate-200 rounded px-10 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-slate-900 transition-all w-[300px]"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                   <th className="px-6 py-4">Institution_Profile</th>
                   <th className="px-6 py-4">License_Tier</th>
                   <th className="px-6 py-4">Capacity_Usage</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4 text-right">Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center border border-slate-200">
                             <Building2 className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                             <p className="text-[13px] font-bold text-slate-900 uppercase">{s.nama}</p>
                             <p className="text-[10px] font-mono text-slate-400">ID: {s.id.substring(0,8).toUpperCase()}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-slate-300" />
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                            s.status_langganan === 'free' ? 'bg-slate-50 text-slate-400 border-slate-200' :
                            s.status_langganan === 'pro' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-indigo-50 text-indigo-700 border-indigo-200 font-black italic shadow-sm'
                          )}>
                             {s.status_langganan}
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col gap-1 w-32">
                          <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                             <span>Used</span>
                             <span>{Math.round((s.guru_count/s.kuota_guru)*100)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div 
                                className={cn(
                                   "h-full transition-all",
                                   (s.guru_count/s.kuota_guru) > 0.8 ? "bg-red-500" : "bg-blue-600"
                                )}
                                style={{ width: `${Math.min(100, (s.guru_count/s.kuota_guru)*100)}%` }}
                             />
                          </div>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{s.guru_count} / {s.kuota_guru} Seats Occupied</p>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       {s.status_langganan !== 'free' ? (
                          <div className="flex items-center gap-1.5 text-emerald-600">
                             <CheckCircle2 className="w-3.5 h-3.5" />
                             <span className="text-[10px] font-black uppercase">Active_Paying</span>
                          </div>
                       ) : (
                          <div className="flex items-center gap-1.5 text-slate-400">
                             <AlertCircle className="w-3.5 h-3.5" />
                             <span className="text-[10px] font-black uppercase tracking-tighter">Community_Edition</span>
                          </div>
                       )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-[10px] font-black text-blue-600 tracking-widest uppercase hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                          Adjust_License
                       </button>
                    </td>
                  </tr>
                ))}
             </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-20 text-center">
               <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">No_Subscription_Records</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
