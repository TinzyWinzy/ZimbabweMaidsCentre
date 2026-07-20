import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserData } from '@/types'

interface AuthUser {
  uid: string
  email?: string | null
  displayName?: string | null
}

interface AuthState {
  user: AuthUser | null
  userData: UserData | null
  isAuthenticated: boolean
  isAdmin: boolean
  isEmployer: boolean
  isWorker: boolean
  isDemo: boolean
  setUser: (user: AuthUser | null, userData: UserData | null) => void
  demoLogin: (userData: UserData) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      userData: null,
      isAuthenticated: false,
      isAdmin: false,
      isEmployer: false,
      isWorker: false,
      isDemo: false,
      setUser: (user, userData) => set({
        user,
        userData,
        isAuthenticated: !!user,
        isAdmin: userData?.role === 'admin',
        isEmployer: userData?.role === 'employer',
        isWorker: userData?.role === 'worker',
        isDemo: false,
      }),
      demoLogin: (userData) => set({
        user: { uid: userData.uid, email: userData.email, displayName: userData.displayName },
        userData,
        isAuthenticated: true,
        isAdmin: userData.role === 'admin',
        isEmployer: userData.role === 'employer',
        isWorker: userData.role === 'worker',
        isDemo: true,
      }),
      logout: () => set({
        user: null,
        userData: null,
        isAuthenticated: false,
        isAdmin: false,
        isEmployer: false,
        isWorker: false,
        isDemo: false,
      }),
    }),
    {
      name: 'zimmaids-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
