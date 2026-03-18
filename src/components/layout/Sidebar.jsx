import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Dumbbell,
  Shield,
  Settings,
  LogOut,
  Stethoscope,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Activity,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useSidebarStore } from '@/stores/sidebarStore'
import { clsx } from 'clsx'

const ptLinks = [
  { to: '/pt/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pt/schedule', label: 'Schedule', icon: Calendar },
  { to: '/pt/live-session', label: 'Live Session', icon: Stethoscope },
  { to: '/pt/patients', label: 'Patients', icon: Users },
  { to: '/pt/exercises', label: 'Exercise Library', icon: Dumbbell },
  { to: '/pt/tracking', label: 'Tracking', icon: Activity },
  { to: '/pt/settings', label: 'Settings', icon: Settings },
]

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/schedule', label: 'All Schedules', icon: Calendar },
  { to: '/admin/live-session', label: 'Live Session', icon: Stethoscope },
  { to: '/admin/patients', label: 'Patients', icon: Users },
  { to: '/admin/exercises', label: 'Exercise Library', icon: Dumbbell },
  { to: '/admin/tracking', label: 'Tracking', icon: Activity },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

function NavItem({ to, label, icon: Icon, collapsed }) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        clsx(
          'flex items-center rounded-lg text-sm font-medium font-sans transition-all duration-200',
          collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-foreground/60 hover:bg-secondary hover:text-foreground'
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  )
}

export default function Sidebar() {
  const { role, logout } = useAuth()
  const { isCollapsed, toggle } = useSidebarStore()

  const links = role === 'admin' ? adminLinks : ptLinks

  return (
    <aside
      className={clsx(
        'flex h-full flex-col border-r border-border/60 bg-white transition-all duration-300',
        isCollapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      {/* Logo + toggle */}
      <div className={clsx(
        'flex h-16 items-center border-b border-border/60',
        isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
      )}>
        {!isCollapsed && (
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold text-primary">Cross</span>
            <span className="text-xl font-bold text-foreground">Health</span>
          </div>
        )}
        <button
          onClick={toggle}
          className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={clsx('flex-1 space-y-1 py-4', isCollapsed ? 'px-2' : 'px-3')}>
        {links.map((link) => (
          <NavItem key={link.to} {...link} collapsed={isCollapsed} />
        ))}
      </nav>

      {/* Logout */}
      <div className={clsx('border-t border-border/60', isCollapsed ? 'p-2' : 'p-3')}>
        <button
          onClick={logout}
          title={isCollapsed ? 'Logout' : undefined}
          className={clsx(
            'flex w-full items-center rounded-lg text-sm font-medium font-sans text-foreground/60 transition-all duration-200 hover:bg-secondary hover:text-foreground',
            isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export function MobileSidebar() {
  const { role, logout } = useAuth()
  const { isMobileOpen, closeMobile } = useSidebarStore()

  const links = role === 'admin' ? adminLinks : ptLinks

  if (!isMobileOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        onClick={closeMobile}
      />

      {/* Drawer */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-xl md:hidden">
        <div className="flex h-16 items-center justify-between border-b border-border/60 px-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold text-primary">Cross</span>
            <span className="text-xl font-bold text-foreground">Health</span>
          </div>
          <button
            onClick={closeMobile}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeMobile}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-sans transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/60 hover:bg-secondary hover:text-foreground'
                )
              }
            >
              <link.icon className="h-5 w-5 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border/60 p-3">
          <button
            onClick={() => { logout(); closeMobile() }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-sans text-foreground/60 hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
