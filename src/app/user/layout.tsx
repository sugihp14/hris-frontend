'use client'
import AppNavbar from '@/components/hris/AppNavBar'
import { Sidebar } from '@/components/hris/Sidebar'
import { Protected } from '@/components/Protected'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Protected>
      <div className="w-full min-h-screen bg-neutral-50">
        <AppNavbar />
        <div className="mx-auto  grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[288px_minmax(0,1fr)]">
          <Sidebar />
          <main className='w-autogrid-cols-[repeat(auto-fit,minmax(320px,1fr))] '>{children}</main>
        </div>
      </div>
    </Protected>
  )
}
