import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Match } from '@/types/match'
import { useAuthStore } from '@/stores/authStore'

export function useMatches(userId: string | undefined, role: 'employer' | 'worker' | undefined) {
  const { isDemo } = useAuthStore()
  const matchesQuery = useQuery({
    queryKey: ['matches', userId, role],
    queryFn: () => {
      if (!userId || !role) return []
      const path = isDemo ? `/test/matches?uid=${encodeURIComponent(userId)}&role=${role}` : '/matches'
      return api<Match[]>(path)
    },
    enabled: !!userId && !!role,
  })
  return { matches: matchesQuery.data || [], isLoading: matchesQuery.isLoading }
}
