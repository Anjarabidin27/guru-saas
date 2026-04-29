import type { ReactNode } from 'next'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col lg:ml-[260px]">
        <AdminTopbar />
        <main className="flex-1 p-5 lg:p-7">{children}</main>
      </div>
    </div>
  )
}
