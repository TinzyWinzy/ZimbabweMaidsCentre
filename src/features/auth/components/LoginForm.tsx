import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useUIStore } from '@/stores/uiStore'
import type { UserRole } from '@/types'
import type { UserData } from '@/types'
import { useAuthStore } from '@/stores/authStore'
import { logoUrl } from '@/lib/brand'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [googleRole, setGoogleRole] = useState<UserRole>('worker')
  const { loginWithEmail, loginWithGoogle } = useAuth()
  const { showToast } = useUIStore()
  const navigate = useNavigate()
  const { demoLogin } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (email.toLowerCase().endsWith('@test.com')) {
        const response = await fetch('/api/test/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.toLowerCase(), password }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Test login failed')
        demoLogin({
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        } as UserData)
      } else {
        await loginWithEmail(email, password)
      }
      showToast('Welcome back!', 'success')
      navigate('/dashboard')
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      await loginWithGoogle(googleRole)
      showToast('Welcome!', 'success')
      navigate('/dashboard')
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        showToast(err.message || 'Google sign-in failed', 'error')
      }
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <aside className="auth-story" aria-label="Zimbabwe Maids Centre">
        <img src="/images/domesticplacement.jpg" alt="A domestic professional working in a carefully kept home" />
        <div className="auth-story-overlay" />
        <div className="auth-story-copy">
          <p className="auth-eyebrow">Welcome back</p>
          <h1 className="font-display">Trusted help starts with a thoughtful match.</h1>
          <p>Access verified profiles, manage your placements, and continue your search with confidence.</p>
        </div>
      </aside>

      <div className="auth-form-panel">
      <Card className="w-full max-w-md border-0 bg-transparent shadow-none animate-slide-up">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-4">
            <img src={logoUrl} alt="" className="h-12 w-12 rounded-full ring-2 ring-emerald-500/30" />
          </div>
          <CardTitle className="font-display text-4xl font-semibold text-center text-[#173129]">Welcome back</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Sign in to your Zimbabwe Maids Centre account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Google sign-in */}
          <div className="space-y-3">
            <div className="flex gap-2 mb-3 justify-center">
              <span className="text-sm font-medium text-gray-600">I am a...</span>
              <div className="flex gap-2">
                {(['worker', 'employer'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setGoogleRole(role)}
                    className={`text-sm px-4 py-1.5 rounded-full border transition-all duration-200 ${
                      googleRole === role
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-900/20'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700'
                    }`}
                  >
                    {role === 'worker' ? 'Worker' : 'Employer'}
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-xl border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-gray-500">or sign in with email</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 rounded-xl pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 btn-primary-glow rounded-xl" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export default LoginForm
