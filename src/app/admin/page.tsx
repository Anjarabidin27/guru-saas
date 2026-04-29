import { cn } from '@/lib/utils'
import { 
  Building2, 
  Users, 
  CreditCard, 
  MessageSquare, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  ExternalLink,
  ShieldCheck,
  Zap,
  Target,
  Trophy
} from 'lucide-react'
import { getAnalyticsData, getLobbyingLeads } from '@/lib/actions/admin'

export default async function AdminDashboard() {
  const [analytics, leads] = await Promise.all([
    getAnalyticsData(),
    getLobbyingLeads()
  ])

  const stats = [
    { label: 'Instansi Aktif', value: analytics.metrics?.schools || 0, grow: '+12%', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Pendidik', value: analytics.metrics?.users || 0, grow: '+18%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Revenue (MTD)', value: 'Rp 45.2M', grow: '+8%', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Potensi Leads', value: (leads.data as any[])?.length || 0, grow: 'NEW', icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto animate-fade-up">
      {/* Header - Ultra Compact */}
      <div className="flex justify-between items-end pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-none uppercase">System_Master_Console</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live_Operation_Monitoring
          </p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase px-3 py-1.5 rounded hover:bg-slate-50 transition-colors">Generate Report</button>
           <button className="bg-slate-900 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded hover:bg-black transition-colors">Emergency Halt</button>
        </div>
      </div>

      {/* Stats Grid - High Density */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white border border-slate-200 p-4 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-all group">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                <span className={cn(
                  "text-[10px] font-black flex items-center gap-0.5 px-1.5 py-0.5 rounded",
                  s.grow.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-100'
                )}>
                  {s.grow.startsWith('+') ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                  {s.grow}
                </span>
              </div>
              <div className="flex items-center justify-between">
                 <div className="text-2xl font-black text-slate-900 tracking-tighter">{s.value}</div>
                 <Icon className={cn("w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity", s.color)} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Recent Registrations - Dense Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Recent_User_Activity</h2>
            <button className="text-[10px] text-blue-600 font-black uppercase hover:underline">Auditing Registry</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">
                  <th className="px-4 py-3">User_Profile</th>
                  <th className="px-4 py-3">Assigned_Role</th>
                  <th className="px-4 py-3">Register_Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(analytics.recentUsers as any[])?.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="text-[13px] font-bold text-slate-900">{u.nama_lengkap || 'GURU_ANONYMOUS'}</div>
                      <div className="text-[9px] font-mono text-slate-400 mt-0.5 uppercase tracking-tighter">ROLE: {u.role}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest",
                        u.role === 'super_admin' ? 'border-red-200 bg-red-50 text-red-700' :
                        u.role === 'admin_sekolah' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' :
                        'border-slate-200 bg-slate-50 text-slate-600'
                      )}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-500 font-bold uppercase">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                       <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-[10px] font-black text-slate-600 hover:text-blue-600 p-1 border border-slate-200 rounded hover:bg-white transition-all">
                             <ExternalLink className="w-3 h-3" />
                          </button>
                          <button className="text-[10px] font-black text-slate-600 hover:text-slate-900 p-1 border border-slate-200 rounded hover:bg-white">
                             <MoreVertical className="w-3 h-3" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LOBBYING LEADS WIDGET - THE "GOLD" DATA */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
             <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-amber-50/50">
               <h2 className="text-[11px] font-black text-amber-900 uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-3.5 h-3.5" /> High_Potential_Leads
               </h2>
               <span className="text-[9px] font-black bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded tracking-widest uppercase">B2B_Target</span>
             </div>
             <div className="p-0">
                {(leads.data as any[])?.length === 0 ? (
                  <div className="p-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">No_Organic_Leads_Detected</div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {(leads.data as any[])?.map((lead, idx) => (
                       <div key={lead.nama} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                             <div className={cn(
                               "w-6 h-6 rounded flex items-center justify-center text-[10px] font-black",
                               idx === 0 ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                             )}>
                                {idx === 0 ? <Trophy className="w-3 h-3" /> : idx + 1}
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[12px] font-bold text-slate-900 tracking-tight line-clamp-1">{lead.nama}</span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{lead.count} Organic Teachers</span>
                             </div>
                          </div>
                          <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                             Start_Lobby
                          </button>
                       </div>
                    ))}
                  </div>
                )}
             </div>
             <div className="p-4 bg-slate-50 border-t border-slate-100">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                   Data dikumpulkan dari input manual guru saat registrasi mandiri. Sekolah di atas memiliki adopsi organik tertinggi.
                </p>
             </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-5 text-white flex flex-col gap-4 shadow-xl">
             <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Master_Action</span>
             </div>
             <div className="font-bold text-[13px] leading-tight tracking-tight uppercase">Broadcast Global Announcement</div>
             <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">Pesan sistem untuk guru & admin sekolah.</p>
             <button className="bg-white text-slate-900 font-black text-[10px] py-2.5 rounded hover:bg-slate-100 transition-all tracking-widest uppercase mt-2">
               Execute Broadcast
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
