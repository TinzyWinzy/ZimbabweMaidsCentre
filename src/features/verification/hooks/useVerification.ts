import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import type { VerificationRecord } from '@/types/verification'
import type { VerificationType } from '@/types'

export function useVerification(workerId: string | undefined) {
  const queryClient = useQueryClient()

  const verificationQuery = useQuery({
    queryKey: ['verifications', workerId],
    queryFn: async () => {
      if (!workerId) return []
      const q = query(collection(db, 'verifications'), where('workerId', '==', workerId))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as VerificationRecord))
    },
    enabled: !!workerId,
  })

  const uploadDocument = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: VerificationType }) => {
      if (!workerId) throw new Error('No worker ID')
      const storageRef = ref(storage, `verifications/${workerId}/${type}/${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)

      await addDoc(collection(db, 'verifications'), {
        workerId,
        type,
        status: 'pending',
        documents: [url],
        reviewerNotes: '',
        reviewedBy: null,
        createdAt: new Date(),
        reviewedAt: null,
      })

      return url
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications', workerId] })
    },
  })

  const updateVerificationStatus = useMutation({
    mutationFn: async ({ verificationId, status, notes }: { verificationId: string; status: 'approved' | 'rejected'; notes?: string }) => {
      await updateDoc(doc(db, 'verifications', verificationId), {
        status,
        reviewerNotes: notes || '',
        reviewedAt: new Date(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications'] })
    },
  })

  return {
    verifications: verificationQuery.data || [],
    isLoading: verificationQuery.isLoading,
    uploadDocument,
    updateVerificationStatus,
  }
}
