import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, User, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useUIStore } from '@/stores/uiStore'
import { logoUrl } from '@/lib/brand'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Find Staff', href: '/professionals' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'How It Works', href: '/#how-it-works' },
]

const publicPagePaths = ['/', '/about', '/services', '/professionals', '/booking-confirmed', '/apply']

export function Navbar() {
  const { isAuthenticated, userData } = useAuthStore()
  const { toggleSidebar } = useUIStore()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isPublicFull = publicPagePaths.includes(location.pathname) ||
    location.pathname.startsWith('/professionals/') ||
    location.pathname.startsWith('/book/')

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const showSolid = true

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showSolid
          ? 'nav-glass'
          : 'nav-glass-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-700 hover:text-emerald-700 transition-colors p-1.5 rounded-lg hover:bg-emerald-50"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <Link to="/" className="group flex items-center gap-3">
            <img
              src={logoUrl}
              alt="Zimbabwe Maids Centre"
              className="h-9 w-9 rounded-full object-cover ring-1 ring-[#78b83c]/50 transition-opacity duration-300 group-hover:opacity-80"
            />
            <span className={`font-display text-lg font-semibold tracking-[-0.02em] transition-colors duration-300 ${
              showSolid ? 'text-[#173129]' : 'text-white'
            }`}>
              Zimbabwe Maids Centre
            </span>
          </Link>
        </div>

        {/* Desktop nav links (public) */}
        {!isAuthenticated && isPublicFull && (
          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`border-b px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  showSolid
                    ? 'border-transparent text-[#5b6e66] hover:border-[#78b83c] hover:text-[#173129]'
                    : 'border-transparent text-white/80 hover:border-white/50 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className={`hidden sm:flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
                  showSolid
                    ? 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <User className="h-4 w-4" />
                {userData?.displayName || 'Profile'}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className={`rounded-lg transition-all duration-200 ${
                  showSolid
                    ? 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-sm font-medium rounded-lg transition-all duration-200 ${
                    showSolid
                      ? 'text-[#173129] hover:text-[#43892d]'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className={`h-9 px-5 text-sm font-semibold transition-colors duration-200 ${
                    showSolid
                      ? 'bg-[#173129] text-white hover:bg-[#294b40]'
                      : 'bg-[#f8f4ea] text-[#173129] hover:bg-white'
                  }`}
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}

          {/* Mobile menu toggle (public pages) */}
          {!isAuthenticated && isPublicFull && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-1.5 rounded-lg transition-colors ${
                showSolid ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && !isAuthenticated && isPublicFull && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md shadow-lg animate-slide-up">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <hr className="my-2 border-gray-100" />
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
