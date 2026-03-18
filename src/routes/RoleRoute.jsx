import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import Spinner from '@/components/ui/Spinner'

export default function RoleRoute({ allowedRole }) {
  const role = useAuthStore((s) => s.role)
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)

  // User exists but role is still being fetched — wait, don't redirect
  if (isLoading || (user && !role)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!role) {
    return <Navigate to="/login" replace />
  }

  if (role !== allowedRole) {
    const redirect = role === 'admin' ? '/admin/dashboard' : '/pt/dashboard'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}
