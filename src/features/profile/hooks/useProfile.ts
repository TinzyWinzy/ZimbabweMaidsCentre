import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { EmployerProfile } from '@/types/user'
import { useAuthStore } from '@/stores/authStore'

export function useProfile(uid: string | undefined) {
  const queryClient = useQueryClient()
  const { isDemo } = useAuthStore()

  const profileQuery = useQuery({
    queryKey: ['profile', uid],
    queryFn: async () => {
      if (!uid) return null
      if (isDemo) {
        const response = await fetch(`/api/test/profile?uid=${encodeURIComponent(uid)}&role=employer`)
        if (!response.ok) throw new Error('Failed to load local test profile')
        return await response.json() as EmployerProfile | null
      }
      const docRef = doc(db, 'employerProfiles', uid)
      const snapshot = await getDoc(docRef)
      if (!snapshot.exists()) return null
      return { id: snapshot.id, ...snapshot.data() } as unknown as EmployerProfile
    },
    enabled: !!uid,
  })

  const updateProfile = useMutation({
    mutationFn: async (data: Partial<EmployerProfile>) => {
      if (!uid) throw new Error('No user ID')
      if (isDemo) {
        const response = await fetch(`/api/test/profile?uid=${encodeURIComponent(uid)}&role=employer`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!response.ok) throw new Error('Failed to update local test profile')
        return
      }
      const docRef = doc(db, 'employerProfiles', uid)
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', uid] })
    },
  })

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    updateProfile,
  }
}
