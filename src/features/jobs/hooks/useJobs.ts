import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { JobListing } from '@/types/job'
import { useAuthStore } from '@/stores/authStore'

export function useJobs(filters?: { status?: string; employerId?: string }) {
  const queryClient = useQueryClient()
  const { isDemo, userData } = useAuthStore()
  const base = isDemo ? '/test/jobs' : '/jobs'

  const jobsQuery = useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      if (isDemo) {
        const params = new URLSearchParams({ uid: userData?.uid || '', role: userData?.role || 'worker' })
        return api<JobListing[]>(`${base}?${params}`)
      }
      return api<JobListing[]>(base)
    },
  })

  const createJob = useMutation({
    mutationFn: async (data: Omit<JobListing, 'id' | 'createdAt'>) => {
      const result = await api<{ id?: string } | JobListing>(base, { method: 'POST', body: JSON.stringify(data) })
      return 'id' in result ? result.id : undefined
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })

  const updateJobStatus = useMutation({
    mutationFn: async ({ jobId, status }: { jobId: string; status: string }) =>
      api(`/jobs/${jobId}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  })

  return { jobs: jobsQuery.data || [], isLoading: jobsQuery.isLoading, createJob, updateJobStatus }
}
