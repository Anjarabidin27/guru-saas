'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Sparkles, FileText, CheckSquare, User } from 'lucide-react'

const items = [
  { href: '/dashboard',           icon: Home, label: 'Beranda' },
  { href: '/dashboard/ai-studio',  icon: Sparkles, label: 'AI Studio' },
  { href: '/dashboard/bank-soal', icon: FileText, label: 'Bank Soal' },
  { href: '/dashboard/penilaian', icon: CheckSquare, label: 'Penilaian' },
  { href: '/dashboard/profil',    icon: User, label: 'Profil' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="lg:hidden fixed bottom-1 left-3 right-3 z-40 bg-slate-950 border border-slate-800 pb-safe rounded-[24px] shadow-2xl overflow-hidden">
      <div className="flex justify-around items-center px-2 py-3">
        {items.map(item => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex flex-col items-center gap-1.5 px-3 py-1 rounded-2xl transition-all no-tap min-w-[52px]',
                isActive ? 'text-white' : 'text-slate-500'
              )}
            >
              <div className={cn(
                "p-2.5 rounded-xl transition-all",
                isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-110" : ""
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <span className={cn(
                'text-[10px] font-black uppercase tracking-widest mt-1',
                isActive ? 'text-white' : 'text-slate-500'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
