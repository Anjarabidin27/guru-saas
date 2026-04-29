import type { ReactNode } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'

// Dashboard Layout - Main Entry
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar — Desktop */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col lg:ml-[260px] overflow-x-hidden relative">
        {/* Mobile top header */}
        <MobileHeader />

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-7 pb-24 lg:pb-8 w-full">
          {children}
        </main>
      </div>

      {/* Bottom nav — Mobile */}
      <BottomNav />
    </div>
  )
}
