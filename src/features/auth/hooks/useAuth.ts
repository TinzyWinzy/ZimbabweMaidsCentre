import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import type { UserData, UserRole } from '@/types'

type ApiUser = Omit<UserData, 'createdAt' | 'updatedAt'> & {
  createdAt?: string
  updatedAt?: string
}
function normalizeUser(user: ApiUser): UserData {
  return {
    ...user,
    createdAt: new Date(user.createdAt || Date.now()),
    updatedAt: new Date(user.updatedAt || Date.now()),
  }
}
export function useAuth() {
  const [loading, setLoading] = useState(true)
  const { setUser, logout: clearStore } = useAuthStore()

  const applyUser = useCallback((raw: ApiUser) => {
    const userData = normalizeUser(raw)
    setUser({ uid: userData.uid, email: userData.email, displayName: userData.displayName }, userData)
    return userData
  }, [setUser])

  useEffect(() => {
    if (useAuthStore.getState().isDemo) {
      setLoading(false)
      return
    }
    api<{ user: ApiUser | null }>('/auth/session')
      .then(({ user }) => user ? applyUser(user) : clearStore())
      .catch(() => clearStore())
      .finally(() => setLoading(false))
  }, [applyUser, clearStore])

  const registerWithEmail = async (email: string, password: string, role: UserRole, name: string) => {
    const user = await api<ApiUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role, name }),
    })
    applyUser(user)
    return user
  }

  const loginWithEmail = async (email: string, password: string) => {
    const user = await api<ApiUser>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    applyUser(user)
    return user
  }

  const loginWithGoogle = async (_role: UserRole) => {
    throw new Error('Google sign-in will be enabled after the email launch flow is live')
  }

  const logout = async () => {
    if (!useAuthStore.getState().isDemo) {
      await api('/auth/logout', { method: 'POST' })
    }
    clearStore()
  }

  return {
    user: useAuthStore((state) => state.user),
    loading,
    sendOTP: async () => { throw new Error('Phone sign-in is not enabled yet') },
    verifyOTP: async () => { throw new Error('Phone sign-in is not enabled yet') },
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
  }
}
