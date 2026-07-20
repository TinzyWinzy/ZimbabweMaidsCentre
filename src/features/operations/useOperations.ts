import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AdminWorker, Applicant, ApplicantStage } from '@/types/operations'

export function useAdminWorkers() {
  const client = useQueryClient()
  const query = useQuery({ queryKey: ['admin-workers'], queryFn: () => api<AdminWorker[]>('/admin/workers') })
  const create = useMutation({
    mutationFn: (worker: Record<string, unknown>) => api('/admin/workers', { method: 'POST', body: JSON.stringify(worker) }),
    onSuccess: () => client.invalidateQueries({ queryKey: ['admin-workers'] }),
  })
  const update = useMutation({
    mutationFn: (worker: Record<string, unknown>) => api('/admin/workers', { method: 'PATCH', body: JSON.stringify(worker) }),
    onSuccess: () => Promise.all([
      client.invalidateQueries({ queryKey: ['admin-workers'] }),
      client.invalidateQueries({ queryKey: ['public-workers'] }),
    ]),
  })
  const importRows = useMutation({
    mutationFn: (rows: Record<string, unknown>[]) => api<{ imported: number; failed: number; results: { row: number; email: string; status: string; error?: string }[] }>('/admin/workers/import', { method: 'POST', body: JSON.stringify({ rows }) }),
    onSuccess: () => client.invalidateQueries({ queryKey: ['admin-workers'] }),
  })
  const invite = useMutation({
    mutationFn: (workerId: string) => api<{ activationToken: string; expiresAt: string }>(`/admin/workers/${workerId}/invite`, { method: 'POST' }),
  })
  return { workers: query.data || [], isLoading: query.isLoading, create, update, importRows, invite }
}

export function useApplicants() {
  const client = useQueryClient()
  const query = useQuery({ queryKey: ['applicants'], queryFn: () => api<Applicant[]>('/admin/applicants') })
  const create = useMutation({
    mutationFn: (applicant: Record<string, unknown>) => api('/admin/applicants', { method: 'POST', body: JSON.stringify(applicant) }),
    onSuccess: () => client.invalidateQueries({ queryKey: ['applicants'] }),
  })
  const updateStage = useMutation({
    mutationFn: (data: { applicantId: string; stage: ApplicantStage; notes?: string; interviewAt?: string }) => api('/admin/applicants', { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => client.invalidateQueries({ queryKey: ['applicants'] }),
  })
  const convert = useMutation({
    mutationFn: (id: string) => api<{ workerId: string }>(`/admin/applicants/${id}/convert`, { method: 'POST' }),
    onSuccess: () => Promise.all([
      client.invalidateQueries({ queryKey: ['applicants'] }),
      client.invalidateQueries({ queryKey: ['admin-workers'] }),
    ]),
  })
  return { applicants: query.data || [], isLoading: query.isLoading, create, updateStage, convert }
}
