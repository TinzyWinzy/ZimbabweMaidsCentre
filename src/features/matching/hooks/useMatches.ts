import { useQuery } from '@tanstack/react-query'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Match } from '@/types/match'
import { useAuthStore } from '@/stores/authStore'

export function useMatches(userId: string | undefined, role: 'employer' | 'worker' | undefined) {
  const { isDemo } = useAuthStore()
  const matchesQuery = useQuery({
    queryKey: ['matches', userId, role],
    queryFn: async () => {
      if (!userId || !role) return []
      if (isDemo) {
        const response = await fetch(`/api/test/matches?uid=${encodeURIComponent(userId)}&role=${role}`)
        if (!response.ok) throw new Error('Failed to load local test matches')
        return await response.json() as Match[]
      }
      const field = role === 'employer' ? 'employerId' : 'workerId'
      const q = query(
        collection(db, 'matches'),
        where(field, '==', userId),
        orderBy('score', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Match))
    },
    enabled: !!userId && !!role,
  })

  return {
    matches: matchesQuery.data || [],
    isLoading: matchesQuery.isLoading,
  }
}
