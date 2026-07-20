import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { EmployerProfile } from '@/types/user'
import { useAuthStore } from '@/stores/authStore'

export function useProfile(uid: string | undefined) {
  const queryClient = useQueryClient()
  const { isDemo } = useAuthStore()
  const path = isDemo ? `/test/profile?uid=${encodeURIComponent(uid || '')}&role=employer` : '/profile'
  const profileQuery = useQuery({
    queryKey: ['profile', uid],
    queryFn: () => uid ? api<EmployerProfile | null>(path) : null,
    enabled: !!uid,
  })
  const updateProfile = useMutation({
    mutationFn: (data: Partial<EmployerProfile>) => api(path, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', uid] }),
  })
  return { profile: profileQuery.data, isLoading: profileQuery.isLoading, updateProfile }
}
