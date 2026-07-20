import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Payment } from '@/types/payment'
import { useAuthStore } from '@/stores/authStore'

export function usePayments(userId: string | undefined) {
  const queryClient = useQueryClient()
  const { isDemo } = useAuthStore()
  const path = isDemo ? `/test/payments?uid=${encodeURIComponent(userId || '')}` : '/payments'
  const paymentsQuery = useQuery({
    queryKey: ['payments', userId],
    queryFn: () => userId ? api<Payment[]>(path) : [],
    enabled: !!userId,
  })
  const initiatePayment = useMutation({
    mutationFn: (data: {
      userId: string; type: 'placement_fee' | 'connection_fee' | 'retainer'; amount: number;
      currency: 'USD' | 'ZWL'; method: 'paynow' | 'ecocash'; matchId?: string; phoneNumber?: string
    }) => api<Record<string, unknown>>('/payments', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
  })
  return { payments: paymentsQuery.data || [], isLoading: paymentsQuery.isLoading, initiatePayment }
}
