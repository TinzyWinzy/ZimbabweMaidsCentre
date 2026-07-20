import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { VerificationRecord } from '@/types/verification'
import type { VerificationType } from '@/types'
import { useAuthStore } from '@/stores/authStore'

export function useVerification(workerId: string | undefined) {
  const queryClient = useQueryClient()
  const isDemo = useAuthStore((state) => state.isDemo)
  const listPath = isDemo ? `/test/verifications${workerId ? `?uid=${encodeURIComponent(workerId)}` : ''}` : '/verifications'
  const verificationQuery = useQuery({
    queryKey: ['verifications', workerId],
    queryFn: () => api<VerificationRecord[]>(listPath),
    enabled: true,
  })
  const uploadDocument = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: VerificationType }) => {
      const path = isDemo ? '/test/verifications' : '/verifications'
      return api<{ id: string }>(path, {
        method: 'POST',
        body: JSON.stringify(isDemo
          ? { workerId, type, fileName: file.name }
          : { type, documents: [`pending-upload://${encodeURIComponent(file.name)}`] }),
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['verifications'] }),
  })
  const updateVerificationStatus = useMutation({
    mutationFn: ({ verificationId, status, notes }: { verificationId: string; status: 'approved' | 'rejected'; notes?: string }) =>
      api(isDemo ? '/test/verifications' : '/verifications', {
        method: 'PATCH', body: JSON.stringify({ verificationId, status, notes }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['verifications'] }),
  })
  return { verifications: verificationQuery.data || [], isLoading: verificationQuery.isLoading, uploadDocument, updateVerificationStatus }
}
