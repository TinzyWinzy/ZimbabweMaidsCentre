import { Link, useNavigate } from 'react-router-dom'
import { LogOut, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function Navbar() {
  const { isAuthenticated, userData } = useAuthStore()
  const { toggleSidebar } = useUIStore()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button onClick={toggleSidebar} className="lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.jpg" alt="ZimMaids" className="h-8 w-8 rounded-full" />
            <span className="text-lg font-bold text-primary-800">ZimMaids</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <User className="h-4 w-4" />
                {userData?.displayName || 'Profile'}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
