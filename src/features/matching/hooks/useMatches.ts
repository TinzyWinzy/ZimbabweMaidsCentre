import { useQuery } from '@tanstack/react-query'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Match } from '@/types/match'

export function useMatches(userId: string | undefined, role: 'employer' | 'worker' | undefined) {
  const matchesQuery = useQuery({
    queryKey: ['matches', userId, role],
    queryFn: async () => {
      if (!userId || !role) return []
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
