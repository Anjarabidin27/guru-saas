'use client'
import Link from 'next/link'

export default function MobileHeader() {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-100 px-4 h-14 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xl">📚</span>
        <span className="font-extrabold text-slate-900 tracking-tight">
          Wiyata<span className="text-blue-600">Guru</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/dashboard/notifikasi" className="relative p-2 rounded-xl hover:bg-slate-50">
          <span className="text-xl">🔔</span>
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
        </Link>
        <Link href="/dashboard/profil" className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
          GU
        </Link>
      </div>
    </header>
  )
}
