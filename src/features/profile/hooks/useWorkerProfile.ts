import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { WorkerProfile } from '@/types/user'
import { useAuthStore } from '@/stores/authStore'

export function useWorkerProfile(uid: string | undefined) {
  const queryClient = useQueryClient()
  const { isDemo } = useAuthStore()
  const path = isDemo ? `/test/profile?uid=${encodeURIComponent(uid || '')}&role=worker` : '/profile'
  const profileQuery = useQuery({
    queryKey: ['workerProfile', uid],
    queryFn: () => uid ? api<WorkerProfile | null>(path) : null,
    enabled: !!uid,
  })
  const updateProfile = useMutation({
    mutationFn: (data: Partial<WorkerProfile>) => api(path, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workerProfile', uid] }),
  })
  return { profile: profileQuery.data, isLoading: profileQuery.isLoading, updateProfile }
}
export function canViewContact(viewerRole: string, viewerId: string, workerId: string, profile: WorkerProfile, matchData?: { placementFeePaid: boolean }) {
  return viewerRole === 'admin' || viewerRole === 'verifier' || viewerId === workerId || !!matchData?.placementFeePaid || profile.contactVisible === true
}
