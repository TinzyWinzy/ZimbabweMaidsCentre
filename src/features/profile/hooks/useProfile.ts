import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { EmployerProfile } from '@/types/user'

export function useProfile(uid: string | undefined) {
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: ['profile', uid],
    queryFn: async () => {
      if (!uid) return null
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
