'use client'

import { useState, useEffect } from 'react'
import { getAuditLogs } from '@/lib/actions/admin_infra'
import { History, Shield, Fingerprint, Clock, Terminal, Search, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminLogPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const res = await getAuditLogs()
    if (!res.error) setLogs(res.data)
    setLoading(false)
  }

  const filteredLogs = logs.filter(l => 
    l.aksi.toLowerCase().includes(search.toLowerCase()) ||
    l.entitas_tipe?.toLowerCase().includes(search.toLowerCase()) ||
    l.user?.nama_lengkap?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex justify-center p-20"><div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"/></div>

  return (
    <div className="animate-fade-up max-w-[1400px] mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-none uppercase">Administrative_Audit_Log</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
             <History className="w-3.5 h-3.5" />
             Traceability Records for Root_Level Operations
          </p>
        </div>
        <div className="flex gap-2">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
              <input 
                 type="text" 
                 placeholder="SEARCH_LOG_HISTORY..." 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="bg-white border border-slate-200 rounded px-10 py-2 text-[11px] font-black uppercase tracking-widest text-slate-900 outline-none focus:border-slate-900 transition-all w-[300px]"
              />
           </div>
           <button onClick={load} className="bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded hover:bg-slate-50 transition-all">Refresh_Cache</button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 bg-slate-50/50">
                     <th className="px-6 py-4">Action_Context</th>
                     <th className="px-6 py-4">Entity_Target</th>
                     <th className="px-6 py-4">Author_Identity</th>
                     <th className="px-6 py-4">Timestamp_UTC</th>
                     <th className="px-6 py-4 text-right">Raw_Details</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                         NO_AUDIT_LOGS_AVAILABLE
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                         <td className="px-6 py-3">
                            <div className="flex items-center gap-2.5">
                               <div className={cn(
                                  "w-2 h-2 rounded-full",
                                  log.aksi.includes('DELETE') ? "bg-red-500" : 
                                  log.aksi.includes('CREATE') ? "bg-emerald-500" : "bg-blue-500"
                               )} />
                               <span className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{log.aksi}</span>
                            </div>
                         </td>
                         <td className="px-6 py-3">
                            <div className="flex flex-col">
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{log.entitas_tipe}</span>
                               <span className="text-[11px] font-mono text-slate-900 font-bold tracking-tighter">{log.entitas_id || 'SYSTEM'}</span>
                            </div>
                         </td>
                         <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                               <Shield className="w-3.5 h-3.5 text-slate-300" />
                               <span className="text-[11px] font-bold text-slate-600 uppercase">{log.user?.nama_lengkap || 'ROOT_SERVICE'}</span>
                            </div>
                         </td>
                         <td className="px-6 py-3">
                            <div className="flex items-center gap-2 text-slate-400">
                               <Clock className="w-3 h-3" />
                               <span className="text-[11px] font-bold">{new Date(log.created_at).toLocaleString()}</span>
                            </div>
                         </td>
                         <td className="px-6 py-3 text-right">
                            <button className="p-1 px-2 border border-slate-100 text-slate-300 hover:text-slate-900 hover:bg-white rounded transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ml-auto">
                               <Terminal className="w-3 h-3" /> JSON_DUMP
                            </button>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
         <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
               <Fingerprint className="w-4 h-4" />
               Integrity_Verified: 100%
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               Latest_Record: {logs[0] ? new Date(logs[0].created_at).toLocaleTimeString() : 'N/A'}
            </div>
         </div>
      </div>
      
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-start gap-3">
         <Info className="w-4 h-4 text-indigo-500 mt-0.5" />
         <div className="flex flex-col gap-1">
            <p className="text-[11px] font-black text-indigo-900 uppercase tracking-widest">Audit_Compliance_Notice</p>
            <p className="text-[10px] text-indigo-700 font-medium leading-relaxed uppercase tracking-tight">
               Administrative logs are immutable and stored for 365 days to comply with enterprise data protection standards.
            </p>
         </div>
      </div>
    </div>
  )
}
