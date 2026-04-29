'use client'

import { useState } from 'react'

const notifications = [
  { id: 'n1', type: 'INFO', unread: true, title: 'Pak Budi memberi nilai baik pada arsip Anda', date: 'Hari ini, 09:12' },
  { id: 'n2', type: 'SISTEM', unread: true, title: 'Catatan Penilaian Fisika XI-B Belum Tuntas', date: 'Hari ini, 07:30' },
  { id: 'n3', type: 'KOMUNITAS', unread: true, title: 'Materi Bahasa Indonesia Kelas XII Telah Tersedia', date: 'Kemarin, 14:00' },
  { id: 'n4', type: 'SISTEM', unread: false, title: 'Pembaruan Fitur: Naskah Otomatis Resmi Dirilis', date: '16 Okt 2026, 08:00' },
  { id: 'n5', type: 'LAPORAN', unread: false, title: 'Ringkasan Unduhan Dokumen Anda (12 Unduhan)', date: '15 Okt 2026, 17:35' },
]

export default function NotifikasiPage() {
  const [items, setItems] = useState(notifications)
  const unreadCount = items.filter(n => n.unread).length

  function markRead(id: string) {
    setItems(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
  }

  function markAllRead() {
    setItems(prev => prev.map(n => ({ ...n, unread: false })))
  }

  return (
    <div className="flex flex-col gap-6 text-black max-w-4xl pb-20">
      
      {/* Header Administratif */}
      <div className="bg-white border border-slate-400 p-6 shadow-sm flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-black mb-1 uppercase">Papan Pengumuman & Peringatan Sistem</h1>
            <p className="text-base font-medium text-slate-800">Cek status laporan terbaru, surat edaran, dan peringatan teknis dari sistem.</p>
         </div>
      </div>

      <div className="bg-white border border-slate-400 shadow-sm">
         <div className="bg-slate-200 border-b border-slate-400 px-6 py-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-black uppercase tracking-widest text-slate-800">
               DAFTAR PENGUMUMAN ({unreadCount} BELUM DIBACA)
            </h2>
            {unreadCount > 0 && (
               <button onClick={markAllRead} className="bg-black text-white px-4 py-2 text-xs font-bold uppercase transition-colors hover:bg-slate-800">
                  KLIK TANDAI SEMUA SUDAH DIBACA
               </button>
            )}
         </div>

         <div className="p-0">
            {items.length === 0 ? (
               <div className="p-10 text-center text-lg font-bold uppercase border-b border-slate-400">
                  TIDAK ADA PENGUMUMAN BARU.
               </div>
            ) : (
               <table className="w-full text-left border-collapse">
                  <tbody>
                     {items.map((notif, index) => (
                        <tr key={notif.id} className={`border-b border-slate-300 hover:bg-slate-50 cursor-pointer ${notif.unread ? 'bg-yellow-50' : ''}`} onClick={() => markRead(notif.id)}>
                           <td className="p-4 w-12 text-center text-sm font-bold border-r border-slate-300 align-middle">
                              {index + 1}
                           </td>
                           <td className="p-4 w-32 border-r border-slate-300 align-middle">
                              <span className={`px-2 py-1 text-xs font-bold uppercase border ${notif.type === 'SISTEM' ? 'bg-red-100 text-red-900 border-red-800' : 'bg-slate-100 text-slate-900 border-slate-800'}`}>
                                 {notif.type}
                              </span>
                           </td>
                           <td className={`p-4 align-middle text-sm ${notif.unread ? 'font-extrabold text-black' : 'font-bold text-slate-700'}`}>
                              {notif.title}
                           </td>
                           <td className="p-4 w-40 text-center font-bold text-sm border-l border-slate-300 align-middle">
                              {notif.date}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
         </div>
         
         <div className="bg-slate-100 p-4 border-t border-slate-400 text-center">
            <a href="/dashboard/profil" className="text-sm font-bold text-black uppercase underline hover:bg-slate-200 px-4 py-2">
               MENU PENGATURAN PREFERENSI NOTIFIKASI
            </a>
         </div>
      </div>
    </div>
  )
}
