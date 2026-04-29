'use client'

import { useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { updateUserRole, updateProfile } from '@/lib/actions/profile-actions'
import { 
  User, 
  ShieldAlert, 
  Settings, 
  Mail, 
  School, 
  ShieldCheck, 
  Loader2, 
  Terminal,
  Save,
  Bell,
  Lock
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ProfilPage() {
  const { user, profile, loading: userLoading, tier, sekolahNama } = useUser()
  const [editing, setEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [roleUpdating, setRoleUpdating] = useState(false)
  
  // Local state for editing
  const [editForm, setEditForm] = useState({
    nama_lengkap: '',
    mapel_utama: ''
  })

  const [notifEmail, setNotifEmail] = useState('AKTIF')
  const [notifPengingat, setNotifPengingat] = useState('AKTIF')

  const isAdmin = profile?.role === 'super_admin'

  async function handleSwitchRole(targetRole: 'super_admin' | 'guru') {
    setRoleUpdating(true)
    try {
      const res = await updateUserRole(targetRole)
      if (res.success) {
        window.location.reload()
      } else {
        alert(`Gagal mengubah akses: ${res.error}`)
        console.error('Role update error:', res.error)
      }
    } catch (e: any) {
      alert(`Sistem Error: ${e.message}`)
    } finally {
      setRoleUpdating(false)
    }
  }

  async function handleSaveProfile() {
    setUpdating(true)
    const res = await updateProfile({
      nama_lengkap: editForm.nama_lengkap || profile?.nama_lengkap || '',
      mapel_utama: editForm.mapel_utama || profile?.mapel_utama || ''
    })
    if (res.success) {
      setEditing(false)
    } else {
      alert('Gagal menyimpan profil: ' + res.error)
    }
    setUpdating(false)
  }

  if (userLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-black">
         <Loader2 className="w-10 h-10 animate-spin text-[#004c8c] mb-4" />
         <p className="font-black uppercase tracking-widest text-xs">Memuat Data Kepegawaian...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 text-black pb-40 max-w-5xl">
      
      {/* Header Administratif - Wiyata Style */}
      <div className="bg-white border-2 border-slate-200 overflow-hidden shadow-none relative">
         <div className="bg-[#004c8c] border-b-2 border-amber-400 px-8 py-3 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" />
            <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Arsip Data Induk Pegawai (Profil)</p>
         </div>
         <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-8">
               <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg ring-2 ring-slate-100 uppercase text-3xl font-black text-[#004c8c]">
                  {profile?.nama_lengkap?.[0] || user?.email?.[0] || 'G'}
               </div>
               <div>
                  <h1 className="text-4xl font-black text-black mb-1 uppercase tracking-tighter">
                     {profile?.nama_lengkap || 'Pendidik WiyataGuru'}
                  </h1>
                  <div className="flex items-center gap-3">
                     <span className={cn(
                        "px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2",
                        isAdmin ? "bg-red-600 border-red-700 text-white" : "bg-amber-400 border-amber-500 text-[#004c8c]"
                     )}>
                        {isAdmin ? 'Akses: Super Admin' : `Peran: ${profile?.role || 'Guru'}`}
                     </span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        #{user?.id.slice(0, 8)}
                     </span>
                  </div>
               </div>
            </div>
            <button
               onClick={() => {
                  setEditing(!editing) 
                  setEditForm({ nama_lengkap: profile?.nama_lengkap || '', mapel_utama: profile?.mapel_utama || '' })
               }}
               className="bg-white border-2 border-slate-200 font-black text-[#004c8c] px-6 py-3 hover:bg-slate-50 transition-all text-xs uppercase tracking-widest shadow-[4px_4px_0px_#e2e8f0]"
            >
               {editing ? 'Batalkan Ubahan' : 'Perbarui Profil'}
            </button>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         
         {/* Kiri: Identitas & Akun */}
         <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-white border-2 border-slate-200 p-8 shadow-none relative">
               <div className="absolute -top-4 left-6 bg-white px-4 border-2 border-slate-200">
                  <h2 className="text-xs font-black text-[#004c8c] uppercase tracking-widest">Identitas Tenaga Pendidik</h2>
               </div>
               
               <div className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 py-4 border-b border-slate-100">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
                     <div className="md:col-span-2">
                        {editing ? (
                           <input 
                              value={editForm.nama_lengkap} 
                              onChange={e => setEditForm({...editForm, nama_lengkap: e.target.value})}
                              className="w-full bg-slate-50 border-2 border-slate-200 p-3 font-bold text-black outline-none focus:border-[#004c8c]" 
                           />
                        ) : (
                           <p className="text-lg font-black text-black">{profile?.nama_lengkap || '-'}</p>
                        )}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 py-4 border-b border-slate-100">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mapel Utama</label>
                     <div className="md:col-span-2">
                         {editing ? (
                           <input 
                              value={editForm.mapel_utama} 
                              onChange={e => setEditForm({...editForm, mapel_utama: e.target.value})}
                              className="w-full bg-slate-50 border-2 border-slate-200 p-3 font-bold text-black outline-none focus:border-[#004c8c]" 
                           />
                        ) : (
                           <p className="text-lg font-black text-black">{profile?.mapel_utama || '-'}</p>
                        )}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 py-4 border-b border-slate-100">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Kerja (Sekolah)</label>
                     <p className="md:col-span-2 text-lg font-black text-[#004c8c] flex items-center gap-2">
                        <School className="w-5 h-5" />
                        {sekolahNama}
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 py-4 border-b border-slate-100">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Akun / Surel</label>
                     <p className="md:col-span-2 text-lg font-black text-slate-500 flex items-center gap-2 italic">
                        <Mail className="w-5 h-5" />
                        {user?.email}
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 py-4 bg-slate-50 px-4 -mx-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Lisensi</label>
                     <div className="md:col-span-2 flex items-center justify-between">
                        <p className="text-lg font-black text-emerald-700 uppercase">{tier === 'gratis' ? 'Edisi Bebas (Community)' : tier}</p>
                        <button className="text-[9px] font-black text-white bg-black px-3 py-1 uppercase tracking-widest hover:bg-[#004c8c]">Upgrade</button>
                     </div>
                  </div>
               </div>

               {editing && (
                  <div className="mt-8 flex justify-end">
                     <button 
                        onClick={handleSaveProfile}
                        disabled={updating}
                        className="bg-[#004c8c] text-white px-8 py-3 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all"
                     >
                        {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Selesaikan Pembaruan
                     </button>
                  </div>
               )}
            </div>

            {/* Mode Pengembang: Role Switcher */}
            <div className="bg-slate-900 border-2 border-amber-400 p-8 shadow-none relative">
               <div className="absolute -top-4 left-6 bg-amber-400 px-4 border-2 border-amber-500">
                  <h2 className="text-xs font-black text-black uppercase tracking-widest flex items-center gap-2">
                     <Terminal className="w-3 h-3" /> Mode Pengembang (Akses Cepat)
                  </h2>
               </div>
               <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
                  <div className="flex-1 text-center md:text-left">
                     <p className="text-amber-400 font-black text-base uppercase tracking-tighter mb-1">Simulasi Peran Akses</p>
                     <p className="text-white/50 text-xs font-medium">Bapak bisa berpindah peran secara instan untuk mengetes navigasi Super Admin.</p>
                  </div>
                  <div className="flex gap-4">
                     <button 
                        onClick={() => handleSwitchRole(isAdmin ? 'guru' : 'super_admin')}
                        disabled={roleUpdating}
                        className={cn(
                           "px-6 py-3 font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 border-2",
                           isAdmin 
                              ? "bg-white text-black border-white hover:bg-slate-200" 
                              : "bg-red-600 text-white border-red-700 shadow-[4px_4px_0px_#991b1b]"
                        )}
                     >
                        {roleUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : isAdmin ? <User className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                        {isAdmin ? 'Kembali Jadi Guru' : 'Aktifkan Super Admin'}
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Kanan: Sistem & Keamanan */}
         <div className="flex flex-col gap-8">
             <div className="bg-white border-2 border-slate-200 p-8 shadow-none relative">
               <div className="absolute -top-4 left-6 bg-white px-4 border-2 border-slate-200">
                  <h2 className="text-xs font-black text-[#004c8c] uppercase tracking-widest">Sistem Notifikasi</h2>
               </div>
               <div className="space-y-6 mt-4">
                  {[
                     { label: 'Rekapitulasi Email', val: notifEmail, set: setNotifEmail },
                     { label: 'Peringatan Jadwal', val: notifPengingat, set: setNotifPengingat }
                  ].map((item, i) => (
                     <div key={i} className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</label>
                        <select value={item.val} onChange={e => item.set(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 p-3 font-bold">
                           <option value="AKTIF">AKTIF</option>
                           <option value="NONAKTIF">NONAKTIF</option>
                        </select>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-white border-2 border-slate-200 p-8 shadow-none relative">
               <div className="absolute -top-4 left-6 bg-white px-4 border-2 border-slate-200">
                  <h2 className="text-xs font-black text-[#004c8c] uppercase tracking-widest">Kredensial Keamanan</h2>
               </div>
               <div className="space-y-6 mt-4">
                  <button className="w-full bg-slate-100 border-2 border-slate-200 p-4 font-black text-xs uppercase text-black hover:bg-white flex items-center justify-center gap-2">
                     <Lock className="w-4 h-4" /> Ganti Kata Sandi
                  </button>
                  <div className="border-t border-slate-100 pt-6">
                     <p className="text-[9px] font-black text-red-600 uppercase text-center mb-4 leading-relaxed">
                        Peringatan: Penghapusan Akun Akan Melenyapkan Seluruh Bank Soal Anda Secara Permanen.
                     </p>
                     <button className="w-full bg-red-50 border-2 border-red-600 p-4 font-black text-xs uppercase text-red-700 hover:bg-red-600 hover:text-white">
                        Hapus Akun Pegawai
                     </button>
                  </div>
               </div>
            </div>
         </div>
         
      </div>
    </div>
  )
}
