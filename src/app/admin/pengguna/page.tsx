'use client'

import { useState, useEffect } from 'react'
import { getAllUsers, updateUserRole } from '@/lib/actions/admin'
import { cn } from '@/lib/utils'
import { Users, Search, MoreHorizontal, Shield, UserCog, Mail, Filter, CreditCard, Star } from 'lucide-react'

type Profile = {
  id: string
  nama_lengkap: string | null
  role: string
  status_langganan: 'free' | 'pro'
  mapel_utama: string | null
  created_at: string
  sekolah: { nama: string; status_langganan: string } | null
  sekolah_nama_raw: string | null
}

export default function AdminPenggunaPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    const res = await getAllUsers()
    if (res.error) {
      setError(res.error)
    } else if (res.users) {
      setUsers(res.users as Profile[])
    }
    setLoading(false)
  }

  async function handleUpdate(userId: string, updates: Partial<Profile>) {
    // Optimistic
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u))
    const res = await updateUserRole(userId, updates)
    if (res.error) {
       alert(`AUTH_EXCEPTION: ${res.error}`)
       loadUsers()
    }
  }

  const filteredUsers = users.filter(u => 
    (u.nama_lengkap?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (u.role?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (u.sekolah?.nama?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (u.sekolah_nama_raw?.toLowerCase() || '').includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="animate-fade-up max-w-[1400px] mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-none uppercase">Identity_Registry</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
             <Users className="w-3 h-3" />
             Human Resource & Hybrid Access Control Management
          </p>
        </div>
        <div className="flex gap-2">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
              <input 
                 type="text" 
                 placeholder="SEARCH_BY_IDENTITY..." 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="bg-white border border-slate-200 rounded px-10 py-2 text-[11px] font-black uppercase tracking-widest text-slate-900 outline-none focus:border-slate-900 transition-all w-[300px]"
              />
           </div>
           <button className="bg-white border border-slate-200 p-2 rounded hover:bg-slate-50 transition-all text-slate-500">
              <Filter className="w-3.5 h-3.5" />
           </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded text-[11px] font-black uppercase tracking-widest flex items-center gap-2 animate-shake">
          <Shield className="w-4 h-4" /> SECURITY_EXCEPTION: {error}
        </div>
      ) : null}

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 bg-slate-50/50">
                <th className="px-6 py-4">Credential_Object</th>
                <th className="px-6 py-4">Institution_Unit</th>
                <th className="px-6 py-4">Access_Level</th>
                <th className="px-6 py-4">Personal_License (B2C)</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                    {search ? 'NO_MATCHING_IDENTITY_FOUND' : 'IDENTITY_SET_EMPTY'}
                  </td>
                </tr>
              ) : null}
              {filteredUsers.map(user => {
                const isSchoolPro = user.sekolah?.status_langganan === 'pro' || user.sekolah?.status_langganan === 'enterprise'
                const isPersonalPro = user.status_langganan === 'pro'
                
                return (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-[9px] uppercase flex-shrink-0 text-slate-500 group-hover:bg-slate-900 group-hover:text-white transition-all">
                          {user.nama_lengkap ? user.nama_lengkap.substring(0, 2) : 'AN'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                             <p className="text-[13px] font-bold text-slate-900 tracking-tight">{user.nama_lengkap || 'UNKNOWN_IDENTITY'}</p>
                             { (isSchoolPro || isPersonalPro) && <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> }
                          </div>
                          <p className="text-[9px] font-mono text-slate-400 mt-0.5 uppercase tracking-tighter">ID: {user.id.substring(0, 12).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col">
                        {user.sekolah ? (
                          <>
                            <span className="text-[11px] text-slate-900 font-bold uppercase tracking-tight">
                              {user.sekolah.nama}
                            </span>
                            {isSchoolPro && (
                              <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Covered_by_Institution</span>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tight italic">
                              {user.sekolah_nama_raw || 'NOT_SPECIFIED'}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[8px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-100 px-1 rounded w-fit mt-0.5">
                              Lobbying_Lead
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="relative inline-block">
                        <select 
                          value={user.role} 
                          onChange={(e) => handleUpdate(user.id, { role: e.target.value })}
                          className={cn(
                            "text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest cursor-pointer appearance-none pr-6 outline-none",
                            user.role === 'super_admin' ? "bg-red-50 border-red-100 text-red-600" :
                            user.role === 'admin_sekolah' ? "bg-indigo-50 border-indigo-100 text-indigo-700" :
                            "bg-blue-50 border-blue-100 text-blue-700"
                          )}
                        >
                          <option value="guru">GURU_LVL</option>
                          <option value="admin_sekolah">INST_ADMIN</option>
                          <option value="super_admin">ROOT_SA</option>
                        </select>
                        <UserCog className="w-2.5 h-2.5 absolute right-2 top-1/2 -translate-y-1/2 text-current pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-3">
                       <div className="flex items-center gap-2">
                          <select 
                             value={user.status_langganan} 
                             onChange={(e) => handleUpdate(user.id, { status_langganan: e.target.value as any })}
                             className={cn(
                               "text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest cursor-pointer appearance-none pr-6 outline-none",
                               user.status_langganan === 'pro' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-400"
                             )}
                          >
                             <option value="free">FREE_TIER</option>
                             <option value="pro">PERSONAL_PRO</option>
                          </select>
                          <CreditCard className={cn("w-3.5 h-3.5", user.status_langganan === 'pro' ? "text-emerald-500" : "text-slate-200")} />
                       </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                       <div className="flex justify-end gap-2">
                          <button className="p-1.5 border border-slate-100 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded transition-all">
                             <Mail className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 border border-slate-100 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded transition-all">
                             <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                       </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <span>Active_Record_Count: {filteredUsers.length}</span>
          <div className="flex gap-2">
             <button className="px-2 py-0.5 border border-slate-200 rounded bg-white hover:bg-slate-100 disabled:opacity-30" disabled>PREV</button>
             <button className="px-2 py-0.5 border border-slate-200 rounded bg-white hover:bg-slate-100 disabled:opacity-30" disabled>NEXT</button>
          </div>
        </div>
      </div>
    </div>
  )
}
