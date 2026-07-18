import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { Toast } from '@/components/ui/toast'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { JobsPage } from '@/pages/JobsPage'
import { NewJobPage } from '@/pages/NewJobPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { VerificationPage } from '@/pages/VerificationPage'
import { PaymentsPage } from '@/pages/PaymentsPage'
import { AdminVerificationsPage } from '@/pages/AdminVerificationsPage'
import { useAuthStore } from '@/stores/authStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function AppLayout() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {isAuthenticated && <Sidebar />}
      <main className={isAuthenticated ? 'lg:pl-64' : ''}>
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <JobsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs/new"
                element={
                  <ProtectedRoute roles={['employer']}>
                    <NewJobPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/verification"
                element={
                  <ProtectedRoute roles={['worker']}>
                    <VerificationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute>
                    <PaymentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/verifications"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminVerificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
