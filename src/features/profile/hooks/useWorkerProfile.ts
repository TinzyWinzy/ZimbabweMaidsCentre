import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { WorkerProfile } from '@/types/user'

export function useWorkerProfile(uid: string | undefined) {
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: ['workerProfile', uid],
    queryFn: async () => {
      if (!uid) return null
      const docRef = doc(db, 'workerProfiles', uid)
      const snapshot = await getDoc(docRef)
      if (!snapshot.exists()) return null
      return { id: snapshot.id, ...snapshot.data() } as unknown as WorkerProfile
    },
    enabled: !!uid,
  })

  const updateProfile = useMutation({
    mutationFn: async (data: Partial<WorkerProfile>) => {
      if (!uid) throw new Error('No user ID')
      const docRef = doc(db, 'workerProfiles', uid)
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile', uid] })
    },
  })

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    updateProfile,
  }
}

export function canViewContact(
  viewerRole: string,
  viewerId: string,
  workerId: string,
  profile: WorkerProfile,
  matchData?: { placementFeePaid: boolean }
): boolean {
  if (viewerRole === 'admin' || viewerRole === 'verifier') return true
  if (viewerId === workerId) return true
  if (matchData?.placementFeePaid) return true
  return profile.contactVisible === true
}
