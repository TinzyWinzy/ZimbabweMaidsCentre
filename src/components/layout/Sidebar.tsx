import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import {
  LayoutDashboard,
  Briefcase,
  UserCheck,
  FileText,
  CreditCard,
  Shield,
  X,
  LifeBuoy,
  CalendarDays,
  UsersRound,
  ClipboardList,
} from 'lucide-react'

const employerLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'My Jobs', icon: Briefcase },
  { to: '/jobs/new', label: 'Post a Job', icon: FileText },
  { to: '/matches', label: 'Matches', icon: UserCheck },
  { to: '/payments', label: 'Payments', icon: CreditCard },
]

const workerLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { to: '/profile', label: 'My Profile', icon: UserCheck },
  { to: '/verification', label: 'Verification', icon: Shield },
  { to: '/matches', label: 'Matches', icon: UserCheck },
  { to: '/payments', label: 'Payments', icon: CreditCard },
]

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
  { to: '/admin/workers', label: 'Worker Roster', icon: UsersRound },
  { to: '/admin/applicants', label: 'Applicants', icon: ClipboardList },
  { to: '/admin/verifications', label: 'Verifications', icon: Shield },
]

export function Sidebar() {
  const { userData } = useAuthStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const location = useLocation()

  const links = userData?.role === 'admin'
    ? adminLinks
    : userData?.role === 'employer'
      ? employerLinks
      : workerLinks

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={cn(
          'fixed left-0 top-[72px] z-30 h-[calc(100vh-72px)] w-[272px] transition-all duration-300 ease-out',
          'border-r border-[#dfe6df] bg-[#fbfcf9]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-sm font-semibold text-gray-900">Menu</span>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="px-4 py-6">
          <div className="mb-5 px-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#819087] mb-2">
              {userData?.role === 'admin' ? 'Administration' : userData?.role === 'employer' ? 'Employer' : 'Worker'}
            </p>
            <div className="h-px bg-[#e3e9e3]" />
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              const isActive = location.pathname === link.to || location.pathname.startsWith(link.to + '/')
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => {
                    if (window.innerWidth < 1024) toggleSidebar()
                  }}
                  className={cn(
                    'relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors duration-200 group',
                    isActive
                      ? 'bg-[#e8f0e7] text-[#173129]'
                      : 'text-[#617069] hover:bg-[#f0f3ee] hover:text-[#173129]'
                  )}
                >
                  {isActive && <span className="absolute inset-y-2 -left-4 w-0.5 rounded-r bg-[#4d8d3a]" />}
                  <link.icon className={`h-[18px] w-[18px] transition-colors ${isActive ? 'text-[#4d8d3a]' : 'text-[#87938c] group-hover:text-[#4d8d3a]'}`} />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="rounded-xl border border-[#dfe6df] bg-white p-4">
            <LifeBuoy className="mb-3 h-5 w-5 text-[#4d8d3a]" />
            <p className="text-sm font-semibold text-[#173129]">Need a hand?</p>
            <p className="mt-1 text-xs leading-5 text-[#718078]">Our placement team can help with your account.</p>
            <a href="tel:+263785458828" className="mt-3 inline-block text-xs font-semibold text-[#4d8d3a] hover:text-[#173129]">+263 785 458 828</a>
          </div>
        </div>
      </aside>
    </>
  )
}
