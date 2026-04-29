'use client'

import { useState, useEffect } from 'react'
import { getBroadcasts, createBroadcast, toggleBroadcast } from '@/lib/actions/admin_infra'
import { Megaphone, Plus, BellRing, Target, Clock, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminNotifikasiPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({ judul: '', pesan: '', tipe: 'info', target_role: 'all' })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const res = await getBroadcasts()
    if (!res.error) setData(res.data)
    setLoading(false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const res = await createBroadcast(form)
    if (res.error) alert(res.error)
    else {
      setIsModalOpen(false)
      setForm({ judul: '', pesan: '', tipe: 'info', target_role: 'all' })
      load()
    }
  }

  async function handleToggle(id: string, current: boolean) {
    const res = await toggleBroadcast(id, !current)
    if (res.error) alert(res.error)
    else load()
  }

  if (loading) return <div className="flex justify-center p-20"><div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"/></div>

  return (
    <div className="animate-fade-up max-w-[1400px] mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-none uppercase">Broadcast_Service</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
             <Megaphone className="w-3.5 h-3.5" />
             Push Global Announcements to Institution Dashboards
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          Queue_New_Broadcast
        </button>
      </div>

      <div className="grid gap-4">
        {data.length === 0 ? (
           <div className="bg-slate-50 border border-slate-200 border-dashed rounded-lg p-20 text-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Broadcast_Queue_is_Empty</p>
           </div>
        ) : (
          data.map(item => (
            <div key={item.id} className={cn(
               "bg-white border rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-sm transition-all",
               item.is_active ? "border-slate-200" : "border-slate-100 opacity-60"
            )}>
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                     <span className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest",
                        item.tipe === 'info' ? "bg-blue-50 text-blue-700 border-blue-200" :
                        item.tipe === 'warning' ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-emerald-50 text-emerald-700 border-emerald-200"
                     )}>
                        {item.tipe}
                     </span>
                     <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">{item.judul}</h3>
                  </div>
                  <p className="text-[12px] text-slate-500 font-medium mb-3 max-w-2xl line-clamp-2">
                     {item.pesan}
                  </p>
                  <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                     <div className="flex items-center gap-1.5"><Target className="w-3 h-3" /> Target: {item.target_role}</div>
                     <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Timestamp: {new Date(item.created_at).toLocaleString()}</div>
                  </div>
               </div>

               <div className="flex items-center gap-3 pr-4 border-l border-slate-100 pl-6 h-full">
                  <div className="flex flex-col gap-1 items-end mr-4">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Broadcast_Status</span>
                     <button 
                        onClick={() => handleToggle(item.id, item.is_active)}
                        className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all", item.is_active ? "text-emerald-600" : "text-slate-400")}
                     >
                        {item.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5 text-slate-300" />}
                        {item.is_active ? 'ACTIVE' : 'MUTED'}
                     </button>
                  </div>
                  <button className="p-2 border border-slate-100 text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 rounded transition-all">
                     <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: BROADCAST CONFIGURATION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-lg p-8 w-full max-w-sm shadow-2xl">
            <h2 className="text-[16px] font-black text-slate-900 uppercase tracking-tight mb-8">Configure_New_Broadcast</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Subject_Header</label>
                <input required type="text"
                  value={form.judul} onChange={e => setForm({...form, judul: e.target.value})}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-[12px] font-bold rounded px-4 py-2 outline-none focus:border-slate-900 transition-all"
                  placeholder="EX: SYSTEM MAINTENANCE SCHEDULE"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Core_Message_Payload</label>
                <textarea required
                  value={form.pesan} onChange={e => setForm({...form, pesan: e.target.value})}
                  rows={4}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-[12px] font-bold rounded px-4 py-2 outline-none focus:border-slate-900 transition-all resize-none"
                  placeholder="Insert broadcast message here..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Broadcast_Type</label>
                  <select 
                    value={form.tipe} onChange={e => setForm({...form, tipe: e.target.value as any})}
                    className="bg-slate-50 border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded px-3 py-2 outline-none focus:border-slate-900 transition-all"
                  >
                    <option value="info">INFO_STREAM</option>
                    <option value="warning">CRITICAL_ALERT</option>
                    <option value="success">DEPLOY_NOTIFY</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Audience_Route</label>
                  <select 
                    value={form.target_role} onChange={e => setForm({...form, target_role: e.target.value as any})}
                    className="bg-slate-50 border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded px-3 py-2 outline-none focus:border-slate-900 transition-all"
                  >
                    <option value="all">ALL_USERS</option>
                    <option value="admin_sekolah">ADMINS_ONLY</option>
                    <option value="guru">TEACHERS_ONLY</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest py-3 rounded hover:bg-slate-50 transition-all">Abort</button>
                <button type="submit" className="flex-1 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest py-3 rounded hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2">
                   <BellRing className="w-3.5 h-3.5" /> Launch_Push
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
