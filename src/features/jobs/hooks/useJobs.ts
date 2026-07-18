import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc, type QueryConstraint } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { JobListing } from '@/types/job'

export function useJobs(filters?: { status?: string; employerId?: string }) {
  const queryClient = useQueryClient()

  const jobsQuery = useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const constraints: QueryConstraint[] = []
      if (filters?.status) constraints.push(where('status', '==', filters.status))
      if (filters?.employerId) constraints.push(where('employerId', '==', filters.employerId))
      constraints.push(orderBy('createdAt', 'desc'))

      const q = query(collection(db, 'jobs'), ...constraints)
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as JobListing))
    },
  })

  const createJob = useMutation({
    mutationFn: async (data: Omit<JobListing, 'id' | 'createdAt'>) => {
      const docRef = await addDoc(collection(db, 'jobs'), {
        ...data,
        createdAt: new Date(),
      })
      return docRef.id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })

  const updateJobStatus = useMutation({
    mutationFn: async ({ jobId, status }: { jobId: string; status: string }) => {
      await updateDoc(doc(db, 'jobs', jobId), { status })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })

  return {
    jobs: jobsQuery.data || [],
    isLoading: jobsQuery.isLoading,
    createJob,
    updateJobStatus,
  }
}
