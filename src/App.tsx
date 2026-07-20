import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { lazy } from 'react'
import { useAuthStore } from '@/stores/authStore'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const JobsPage = lazy(() => import('@/pages/JobsPage'))
const NewJobPage = lazy(() => import('@/pages/NewJobPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const VerificationPage = lazy(() => import('@/pages/VerificationPage'))
const PaymentsPage = lazy(() => import('@/pages/PaymentsPage'))
const AdminVerificationsPage = lazy(() => import('@/pages/AdminVerificationsPage'))
const LandingPage = lazy(() => import('@/pages/LandingPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ServicesPage = lazy(() => import('@/pages/ServicesPage'))
const MatchesPage = lazy(() => import('@/pages/MatchesPage'))
const ProfessionalsPage = lazy(() => import('@/pages/ProfessionalsPage'))
const ProfessionalProfilePage = lazy(() => import('@/pages/ProfessionalProfilePage'))
const BookingPage = lazy(() => import('@/pages/BookingPage'))
const BookingConfirmationPage = lazy(() => import('@/pages/BookingConfirmationPage'))
const AdminBookingsPage = lazy(() => import('@/pages/AdminBookingsPage'))
const AdminWorkersPage = lazy(() => import('@/pages/AdminWorkersPage'))
const AdminApplicantsPage = lazy(() => import('@/pages/AdminApplicantsPage'))
const ApplyPage = lazy(() => import('@/pages/ApplyPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
    </div>
  )
}

function AppLayout() {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()
  const publicFullPages = ['/', '/about', '/services', '/login', '/register', '/professionals', '/booking-confirmed', '/apply']
  const isPublicFull = publicFullPages.includes(location.pathname) ||
    location.pathname.startsWith('/professionals/') ||
    location.pathname.startsWith('/book/')

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />
      {isAuthenticated && <Sidebar />}
      <main className={isAuthenticated ? 'min-h-screen bg-[#f5f7f3] pt-[72px] lg:pl-[272px]' : ''}>
        {isPublicFull ? (
          <Outlet />
        ) : (
          <div className="mx-auto max-w-[1360px] px-4 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
            <Outlet />
          </div>
        )}
      </main>
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
              <Route path="/" element={
                <Suspense fallback={<LoadingFallback />}>
                  <LandingPage />
                </Suspense>
              } />
              <Route path="/login" element={
                <Suspense fallback={<LoadingFallback />}>
                  <LoginPage />
                </Suspense>
              } />
              <Route path="/register" element={
                <Suspense fallback={<LoadingFallback />}>
                  <RegisterPage />
                </Suspense>
              } />
              <Route path="/about" element={
                <Suspense fallback={<LoadingFallback />}>
                  <AboutPage />
                </Suspense>
              } />
              <Route path="/services" element={
                <Suspense fallback={<LoadingFallback />}>
                  <ServicesPage />
                </Suspense>
              } />
              <Route path="/professionals" element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProfessionalsPage />
                </Suspense>
              } />
              <Route path="/professionals/:id" element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProfessionalProfilePage />
                </Suspense>
              } />
              <Route path="/book/:id" element={
                <Suspense fallback={<LoadingFallback />}>
                  <BookingPage />
                </Suspense>
              } />
              <Route path="/booking-confirmed" element={
                <Suspense fallback={<LoadingFallback />}>
                  <BookingConfirmationPage />
                </Suspense>
              } />
              <Route path="/apply" element={
                <Suspense fallback={<LoadingFallback />}>
                  <ApplyPage />
                </Suspense>
              } />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <DashboardPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <JobsPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs/new"
                element={
                  <ProtectedRoute roles={['employer']}>
                    <Suspense fallback={<LoadingFallback />}>
                      <NewJobPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <ProfilePage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/verification"
                element={
                  <ProtectedRoute roles={['worker']}>
                    <Suspense fallback={<LoadingFallback />}>
                      <VerificationPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/matches"
                element={
                  <ProtectedRoute roles={['employer', 'worker']}>
                    <Suspense fallback={<LoadingFallback />}>
                      <MatchesPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <PaymentsPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/verifications"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminVerificationsPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <Suspense fallback={<LoadingFallback />}>
                      <AdminBookingsPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/workers" element={
                <ProtectedRoute roles={['admin']}>
                  <Suspense fallback={<LoadingFallback />}><AdminWorkersPage /></Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin/applicants" element={
                <ProtectedRoute roles={['admin']}>
                  <Suspense fallback={<LoadingFallback />}><AdminApplicantsPage /></Suspense>
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
