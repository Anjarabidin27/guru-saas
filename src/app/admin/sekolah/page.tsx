'use client'

import { useState, useEffect } from 'react'
import { getDaftarSekolah, createSekolah, updateLanggananSekolah, hapusSekolah } from '@/lib/actions/sekolah'
import { cn } from '@/lib/utils'
import { School, Search, Plus, MapPin, Key, Users, Trash2, ArrowUpRight, ShieldCheck, Globe } from 'lucide-react'

type Sekolah = {
  id: string
  nama: string
  kota: string
  alamat: string | null
  kode_sekolah: string
  status_langganan: 'free' | 'pro' | 'enterprise'
  kuota_guru: number
  created_at: string
  guru_count: number
  admin: { nama_lengkap: string | null } | null
}

export default function AdminSekolahPage() {
  const [data, setData] = useState<Sekolah[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalForm, setModalForm] = useState({ nama: '', kota: '', status_langganan: 'free' as any, kuota_guru: 5 })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const res = await getDaftarSekolah()
    if (res.error) setError(res.error)
    else setData(res.data as Sekolah[])
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const res = await createSekolah(modalForm)
    if (res.error) {
       setError(res.error)
       return
    }
    setIsModalOpen(false)
    loadData()
  }

  async function handleUpdateLangganan(id: string, status: string, kuota: number) {
    const res = await updateLanggananSekolah(id, { status_langganan: status, kuota_guru: kuota })
    if (res.error) alert(res.error)
    else loadData()
  }

  async function handleDelete(id: string) {
    if (!confirm('CONFIRMATION_REQUIRED: Permanent deletion of institution. Proceed?')) return
    const res = await hapusSekolah(id)
    if (res.error) alert(res.error)
    else loadData()
  }

  const filtered = data.filter(s => 
    s.nama.toLowerCase().includes(search.toLowerCase()) ||
    s.kota.toLowerCase().includes(search.toLowerCase()) ||
    s.kode_sekolah.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex justify-center p-20"><div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"/></div>

  return (
    <div className="animate-fade-up max-w-[1400px] mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-none uppercase">Institution_Registry</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
             <School className="w-3 h-3" />
             Manage B2B Institutions & License Quotas
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input 
               type="text" 
               placeholder="SEARCH_BY_NAME_OR_ID..." 
               value={search}
               onChange={e => setSearch(e.target.value)}
               className="bg-white border border-slate-200 rounded px-10 py-2 text-[11px] font-black uppercase tracking-widest text-slate-900 outline-none focus:border-slate-900 transition-all w-[300px]"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Establish_New
          </button>
        </div>
      </div>

      {error ? (
         <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
           <Globe className="w-4 h-4" /> ERROR_LOG: {error}
         </div>
      ) : null}

      <div className="grid gap-4">
        {filtered.map(s => (
          <div key={s.id} className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col lg:flex-row gap-8 lg:items-center justify-between hover:border-slate-300 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1.5">
                <h3 className="text-[15px] font-black text-slate-900 tracking-tight uppercase">{s.nama}</h3>
                <span className={cn(
                  "text-[9px] uppercase font-black tracking-[0.2em] px-2 py-0.5 rounded border",
                  s.status_langganan === 'free' ? 'bg-slate-50 text-slate-400 border-slate-200' : 
                  s.status_langganan === 'pro' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                  'bg-indigo-50 text-indigo-700 border-indigo-200'
                )}>
                  {s.status_langganan}
                </span>
                <span className="text-[10px] font-mono text-slate-300">#{s.id.substring(0,6).toUpperCase()}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
                 <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">{s.kota || 'N/A'}</span>
                 </div>
                 <div className="flex items-center gap-1.5 text-slate-500">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">Admin: {s.admin?.nama_lengkap || 'UNASSIGNED'}</span>
                 </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded flex items-center gap-3">
                   <div className="p-1 px-2 bg-slate-200 text-[10px] font-black rounded text-slate-600 uppercase tracking-widest">Join_Key</div>
                   <p className="text-sm font-mono font-black text-slate-900 tracking-widest">{s.kode_sekolah}</p>
                </div>
                <div className="flex items-center gap-2 px-3">
                   <Users className="w-3.5 h-3.5 text-slate-300" />
                   <div className="flex items-end gap-1">
                     <span className={cn("text-sm font-black", s.guru_count >= s.kuota_guru ? "text-red-600" : "text-slate-900")}>{s.guru_count}</span>
                     <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tighter">/ {s.kuota_guru} SLOTS</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-l border-slate-100 pl-8 h-full">
               <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">License_Control</label>
                  <div className="flex items-center gap-1.5">
                    <select 
                       value={s.status_langganan}
                       onChange={e => handleUpdateLangganan(s.id, e.target.value, s.kuota_guru)}
                       className="bg-slate-50 border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded px-2 py-1.5 outline-none focus:border-slate-900 transition-all"
                    >
                      <option value="free">FREE_TIER</option>
                      <option value="pro">PRO_LICENSE</option>
                      <option value="enterprise">ENTERPRISE_B2B</option>
                    </select>
                    <select 
                       value={s.kuota_guru}
                       onChange={e => handleUpdateLangganan(s.id, s.status_langganan, parseInt(e.target.value))}
                       className="bg-slate-50 border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded px-2 py-1.5 outline-none focus:border-slate-900 transition-all"
                    >
                      <option value={5}>5 UNIT</option>
                      <option value={20}>20 UNIT</option>
                      <option value={50}>50 UNIT</option>
                      <option value={999}>MAX_LOAD</option>
                    </select>
                  </div>
               </div>
               <div className="flex gap-1.5 self-end">
                  <button onClick={() => handleDelete(s.id)} className="p-2 border border-slate-100 text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 rounded transition-all">
                     <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 border border-slate-100 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded transition-all">
                     <ArrowUpRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-lg p-12 text-center">
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Zero_Records_Found</p>
        </div>
      )}

      {/* MODAL: ESTABLISH NEW INSTITUTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-lg p-8 w-full max-w-sm shadow-2xl">
            <h2 className="text-[16px] font-black text-slate-900 uppercase tracking-tight mb-8">Establish_New_Institution</h2>
            <form onSubmit={handleAdd} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">institution_name_official</label>
                <input required type="text"
                  value={modalForm.nama} onChange={e => setModalForm({...modalForm, nama: e.target.value})}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-[12px] font-bold rounded px-4 py-2 outline-none focus:border-slate-900 transition-all"
                  placeholder="EX: SMAN 1 JAKARTA"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">regional_city_assignment</label>
                <input required type="text"
                  value={modalForm.kota} onChange={e => setModalForm({...modalForm, kota: e.target.value})}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-[12px] font-bold rounded px-4 py-2 outline-none focus:border-slate-900 transition-all"
                  placeholder="EX: JAKARTA SELATAN"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Initial_Tier</label>
                  <select 
                    value={modalForm.status_langganan} onChange={e => setModalForm({...modalForm, status_langganan: e.target.value as any})}
                    className="bg-slate-50 border border-slate-200 text-slate-900 text-[11px] font-black uppercase tracking-widest rounded px-3 py-2 outline-none focus:border-slate-900 transition-all"
                  >
                    <option value="free">FREE</option>
                    <option value="pro">PRO</option>
                    <option value="enterprise">B2B</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Seat_Cap</label>
                  <select 
                    value={modalForm.kuota_guru} onChange={e => setModalForm({...modalForm, kuota_guru: parseInt(e.target.value)})}
                    className="bg-slate-50 border border-slate-200 text-slate-900 text-[11px] font-black uppercase tracking-widest rounded px-3 py-2 outline-none focus:border-slate-900 transition-all"
                  >
                    <option value={5}>5 UNITS</option>
                    <option value={20}>20 UNITS</option>
                    <option value={50}>50 UNITS</option>
                    <option value={999}>MAX_CAP</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest py-3 rounded hover:bg-slate-50 transition-all">Abort</button>
                <button type="submit" className="flex-1 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest py-3 rounded hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">Commit_New</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
