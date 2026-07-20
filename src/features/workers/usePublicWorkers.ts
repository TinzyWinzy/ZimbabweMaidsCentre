import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { PublicWorker } from '@/types/worker-directory'

export function usePublicWorkers() {
  return useQuery({
    queryKey: ['public-workers'],
    queryFn: () => api<PublicWorker[]>('/public/workers'),
  })
}

export function usePublicWorker(id: string | undefined) {
  return useQuery({
    queryKey: ['public-worker', id],
    queryFn: () => api<PublicWorker>(`/public/workers/${id}`),
    enabled: !!id,
  })
}
