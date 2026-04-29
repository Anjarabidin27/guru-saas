'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  BarChart3, 
  School, 
  Users, 
  Palette, 
  FileText, 
  CreditCard, 
  Wallet, 
  Gift, 
  Bell, 
  Settings, 
  History 
} from 'lucide-react'

const navGroups = [
  {
    title: 'Overview',
    items: [
      { href: '/admin',             icon: Home, label: 'Dashboard' },
      { href: '/admin/analitik',    icon: BarChart3, label: 'Analitik' },
    ],
  },
  {
    title: 'Manajemen',
    items: [
      { href: '/admin/sekolah',     icon: School, label: 'Sekolah', badge: '50' },
      { href: '/admin/pengguna',    icon: Users, label: 'Pengguna', badge: '1.2k' },
      { href: '/admin/settings',    icon: Palette, label: 'Landing Visual' },
      { href: '/admin/konten',      icon: FileText, label: 'Konten Pemasaran' },
    ],
  },
  {
    title: 'Keuangan',
    items: [
      { href: '/admin/langganan',   icon: CreditCard, label: 'Langganan' },
      { href: '/admin/pendapatan',  icon: Wallet, label: 'Pendapatan' },
      { href: '/admin/promosi',     icon: Gift, label: 'Promosi' },
    ],
  },
  {
    title: 'Sistem',
    items: [
      { href: '/admin/notifikasi',  icon: Bell, label: 'Broadcast' },
      { href: '/admin/settings',    icon: Settings, label: 'Konfigurasi' },
      { href: '/admin/log',         icon: History, label: 'Log Aktivitas' },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-slate-200 z-40">
      {/* Brand - Ultra Compact */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <img 
            src="/tutwuri.png" 
            alt="Logo" 
            className="w-6 h-6 grayscale opacity-80" 
          />
          <span className="font-bold text-slate-900 tracking-tight text-sm">
            Wiyata<span className="text-blue-600">Guru</span>
          </span>
        </Link>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest border border-slate-100 px-1.5 py-0.5 rounded">
          HQ
        </span>
      </div>

      {/* Navigation - Dense Spacing */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto flex flex-col gap-4">
        {navGroups.map(group => (
          <div key={group.title}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] px-3 mb-1.5">{group.title}</p>
            <div className="flex flex-col gap-0.5">
              {group.items.map(item => {
                const Icon = item.icon
                const isActive = item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href)
                
                return (
                  <Link key={item.href} href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all group',
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    <Icon className={cn(
                      "w-4 h-4",
                      isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-600"
                    )} strokeWidth={2.5} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                        isActive ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Session - Minimalist */}
      <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-white text-[10px] font-black">
            SA
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">Super_Admin</p>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">Root Level Access</p>
          </div>
        </div>
        <Link href="/" className="text-slate-400 hover:text-slate-900 p-1.5 border border-transparent hover:border-slate-200 rounded transition-all">
          <Home className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  )
}
