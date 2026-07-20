import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from '@/lib/firebase'
import type { Payment } from '@/types/payment'
import { useAuthStore } from '@/stores/authStore'

export function usePayments(userId: string | undefined) {
  const queryClient = useQueryClient()
  const { isDemo } = useAuthStore()

  const paymentsQuery = useQuery({
    queryKey: ['payments', userId],
    queryFn: async () => {
      if (!userId) return []
      if (isDemo) {
        const response = await fetch(`/api/test/payments?uid=${encodeURIComponent(userId)}`)
        if (!response.ok) throw new Error('Failed to load local test payments')
        return await response.json() as Payment[]
      }
      const q = query(
        collection(db, 'payments'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Payment))
    },
    enabled: !!userId,
  })

  const initiatePayment = useMutation({
    mutationFn: async (data: {
      userId: string
      type: 'placement_fee' | 'connection_fee' | 'retainer'
      amount: number
      currency: 'USD' | 'ZWL'
      method: 'paynow' | 'ecocash'
      matchId?: string
      phoneNumber?: string
    }) => {
      const fn = httpsCallable(functions, 'initiatePayment')
      const result = await fn(data)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })

  return {
    payments: paymentsQuery.data || [],
    isLoading: paymentsQuery.isLoading,
    initiatePayment,
  }
}
