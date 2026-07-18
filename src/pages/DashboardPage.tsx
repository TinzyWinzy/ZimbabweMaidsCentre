import { useAuthStore } from '@/stores/authStore'
import { EmployerDashboard } from '@/features/dashboard/components/EmployerDashboard'
import { WorkerDashboard } from '@/features/dashboard/components/WorkerDashboard'
import { AdminDashboard } from '@/features/admin/components/AdminDashboard'

export function DashboardPage() {
  const { userData } = useAuthStore()

  if (userData?.role === 'admin') return <AdminDashboard />
  if (userData?.role === 'employer') return <EmployerDashboard />
  return <WorkerDashboard />
}
