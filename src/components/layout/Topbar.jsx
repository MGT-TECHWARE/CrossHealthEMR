import { Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useSidebarStore } from '@/stores/sidebarStore'
import RoleBadge from '@/components/auth/RoleBadge'

export default function Topbar() {
  const { user, role } = useAuth()
  const openMobile = useSidebarStore((s) => s.openMobile)

  const displayName = user?.user_metadata?.first_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
    : user?.email || 'User'

  return (
    <header className="flex h-14 sm:h-16 items-center justify-between border-b border-border/60 bg-white px-4 sm:px-6">
      {/* Mobile hamburger */}
      <button
        onClick={openMobile}
        className="md:hidden flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium font-sans text-foreground/70">
          {displayName}
        </span>
        {role && <RoleBadge role={role} />}
      </div>
    </header>
  )
}
