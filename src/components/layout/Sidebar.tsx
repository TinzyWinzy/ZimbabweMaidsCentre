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
  { to: '/payments', label: 'Payments', icon: CreditCard },
]

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/verifications', label: 'Verifications', icon: Shield },
  { to: '/admin/users', label: 'Users', icon: UserCheck },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
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
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={toggleSidebar} />
      )}
      <aside
        className={cn(
          'fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-white transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-sm font-semibold">Menu</span>
          <button onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 p-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar()
              }}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                location.pathname === link.to
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
