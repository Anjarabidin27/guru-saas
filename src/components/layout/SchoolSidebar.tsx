'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard/school',         icon: '🏫', label: 'Dashboard Sekolah' },
  { href: '/dashboard/school/guru',    icon: '👩‍🏫', label: 'Data Guru' },
  { href: '/dashboard/school/laporan', icon: '📊', label: 'Laporan Sekolah' },
  { href: '/dashboard/school/storage', icon: '☁️', label: 'Penggunaan Storage' },
  { href: '/dashboard/school/langganan', icon: '💳', label: 'Paket & Langganan' },
  { href: '/dashboard/school/pengaturan', icon: '⚙️', label: 'Pengaturan Sekolah' },
]

export default function SchoolSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-slate-100 z-40">
      {/* Brand + Role Badge */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-2xl">📚</span>
          <span className="font-extrabold text-slate-900 tracking-tight">
            Wiyata<span className="text-blue-600">Guru</span>
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black px-2.5 py-1 rounded-full">
          🏫 ADMIN SEKOLAH
        </div>
      </div>

      {/* School Info Banner */}
      <div className="mx-3 mt-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3">
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Sekolah Aktif</p>
        <p className="text-sm font-bold text-slate-900 mt-0.5 leading-tight">SMA Negeri 1 Contoh</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
            Freemium
          </span>
          <Link href="/dashboard/school/langganan" className="text-[10px] text-blue-600 font-bold hover:underline">
            Upgrade →
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = item.href === '/dashboard/school'
            ? pathname === '/dashboard/school'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                isActive
                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <span className="text-lg w-6 text-center">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Role Switcher */}
      <div className="border-t border-slate-100 px-3 py-3">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 mb-1.5">
          Ganti Tampilan
        </p>
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-blue-50 hover:text-blue-700 transition-all"
        >
          <span className="text-lg w-6 text-center">👤</span>
          Lihat sebagai Guru
        </Link>
      </div>

      {/* User + Logout */}
      <div className="border-t border-slate-100 p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          KS
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">Kepala Sekolah</p>
          <p className="text-xs text-slate-400 truncate">Admin Sekolah</p>
        </div>
        <button onClick={handleLogout}
          className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-1.5 transition-all"
          title="Keluar">
          <span className="text-base">⏻</span>
        </button>
      </div>
    </aside>
  )
}
