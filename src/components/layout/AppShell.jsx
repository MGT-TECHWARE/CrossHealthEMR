import { useAuthStore } from '@/stores/authStore'
import Sidebar, { MobileSidebar } from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export default function AppShell({ children }) {
  const user = useAuthStore((s) => s.user)

  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      <MobileSidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
