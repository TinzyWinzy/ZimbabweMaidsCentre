import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserData } from '@/types'

interface AuthState {
  user: unknown | null
  userData: UserData | null
  isAuthenticated: boolean
  isAdmin: boolean
  isEmployer: boolean
  isWorker: boolean
  setUser: (user: unknown | null, userData: UserData | null) => void
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
      setUser: (user, userData) => set({
        user,
        userData,
        isAuthenticated: !!user,
        isAdmin: userData?.role === 'admin',
        isEmployer: userData?.role === 'employer',
        isWorker: userData?.role === 'worker',
      }),
      logout: () => set({
        user: null,
        userData: null,
        isAuthenticated: false,
        isAdmin: false,
        isEmployer: false,
        isWorker: false,
      }),
    }),
    {
      name: 'zimmaids-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
