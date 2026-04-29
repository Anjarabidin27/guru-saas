'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { 
  Home, 
  Sparkles, 
  BookOpen, 
  FileText, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Bell, 
  User, 
  School, 
  ShieldAlert, 
  Power,
  Zap
} from 'lucide-react'

const navItems = [
  { href: '/dashboard',           icon: Home, label: 'Beranda' },
  { href: '/dashboard/ai-studio',  icon: Sparkles, label: 'AI Studio' },
  { href: '/dashboard/bank-soal', icon: FileText, label: 'Bank Soal' },
  { href: '/dashboard/materi',    icon: BookOpen, label: 'Ruang Materi' },
  { href: '/dashboard/penilaian', icon: CheckSquare, label: 'Buku Nilai' },
  { href: '/dashboard/berbagi',   icon: Users, label: 'Komunitas' },
  { href: '/dashboard/laporan',   icon: BarChart3, label: 'Laporan Mutu' },
  { href: '/dashboard/ai-assistant', icon: Sparkles, label: 'Konsul AI' },
]

const bottomItems = [
  { href: '/dashboard/notifikasi', icon: Bell, label: 'Notifikasi' },
  { href: '/dashboard/profil',     icon: User, label: 'Profil Saya' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { initials, displayName, sekolahNama, tier, profile, loading } = useUser()
  const isAdmin = profile?.role === 'super_admin'

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] bg-[#004c8c] border-r border-[#003a6d] z-40 overflow-hidden shadow-none">
      
      {/* Official Parang Batik Overlay - Deep National Identity */}
      <div 
        className="absolute inset-0 opacity-[0.12] pointer-events-none mix-blend-overlay"
        style={{ 
          backgroundImage: 'url(/batik_parang.png)', 
          backgroundSize: '320px',
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Brand - Wiyata Nusantara Style */}
      <div className="flex items-center gap-4 px-6 py-8 border-b border-white/10 relative z-10 bg-black/5">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1.5 border-2 border-amber-400">
           <img src="/tutwuri.svg" alt="Tut Wuri Handayani Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-white tracking-tighter text-2xl leading-none">
            Wiyata<span className="text-amber-400 font-black">Guru</span>
          </span>
          <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em] mt-1.5 leading-none">Abdi Penuntun Bangsa</p>
        </div>
      </div>

      {/* Nav - Clean, No Shadow, Authoritative */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto relative z-10 scrollbar-hide">
        
        {/* SUPER ADMIN CABINET - Restricted Access */}
        {isAdmin && (
          <div className="mb-8">
            <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.4em] px-4 mb-4">Kabinet Super Admin</p>
            <div className="flex flex-col gap-1">
              <Link href="/dashboard/super-admin" className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-black text-white bg-red-600/20 hover:bg-red-600/30 transition-all border-l-4 border-red-500">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                Dashboard Utama
              </Link>
              <Link href="/dashboard/school" className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-black text-white/70 hover:bg-white/5 hover:text-white transition-all">
                <School className="w-4 h-4 text-white/40" />
                Manajemen Sekolah
              </Link>
              <Link href="/dashboard/audit" className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-black text-white/70 hover:bg-white/5 hover:text-white transition-all">
                <BarChart3 className="w-4 h-4 text-white/40" />
                Log Aktivitas
              </Link>
            </div>
            <div className="my-6 border-t border-white/10 mx-4" />
          </div>
        )}

        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] px-4 mb-4">INSTRUMEN KERJA</p>
        {navItems.map(item => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-4 px-4 py-3 rounded-lg text-base font-black transition-all duration-300 group',
                isActive
                  ? 'bg-amber-400 text-[#004c8c] border-l-4 border-white shadow-none'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-[#004c8c]" : "text-white/40 group-hover:text-amber-400")} />
              {item.label}
            </Link>
          )
        })}

        <div className="my-6 border-t border-white/10 mx-4" />
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] px-4 mb-4">MANAJEMEN AKUN</p>

        {bottomItems.map(item => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-4 px-4 py-3 rounded-lg text-base font-black transition-all duration-300 group',
                isActive ? 'bg-white/10 text-white border-l-2 border-amber-400' : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-amber-400" : "text-white/40 group-hover:text-amber-400")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Identity Footer */}
      <div className="border-t border-white/10 p-5 flex items-center gap-4 bg-black/20 relative z-10">
        <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#004c8c] text-sm font-black flex-shrink-0 shadow-none border-2 border-amber-400">
          {loading ? '…' : initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white truncate leading-none mb-1.5 uppercase tracking-wide">
            {loading ? 'Memuat...' : displayName}
          </p>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
             <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{isAdmin ? 'SUPER ADMIN' : tier}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="text-white/40 hover:text-red-400 hover:bg-white/10 rounded-lg p-2.5 transition-all"
          title="Keluar Sistem">
          <Power className="w-4 h-4" />
        </button>
      </div>
    </aside>
  )
}
