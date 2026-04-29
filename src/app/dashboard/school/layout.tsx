import type { ReactNode } from 'react'
import SchoolSidebar from '@/components/layout/SchoolSidebar'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNav from '@/components/layout/BottomNav'

export default function SchoolAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <SchoolSidebar />
      <div className="flex-1 flex flex-col lg:ml-[260px]">
        <MobileHeader />
        <main className="flex-1 p-4 lg:p-7 pb-24 lg:pb-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
