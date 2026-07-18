import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: UserRole[]
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, userData } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && userData && !roles.includes(userData.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
