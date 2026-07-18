import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useVerification } from '@/features/verification/hooks/useVerification'
import { useUIStore } from '@/stores/uiStore'
import type { VerificationRecord } from '@/types/verification'

export function AdminVerificationQueue() {
  const [selectedVerification, setSelectedVerification] = useState<VerificationRecord | null>(null)
  const [notes, setNotes] = useState('')
  const { updateVerificationStatus } = useVerification(undefined)
  const { showToast } = useUIStore()

  const { data: pendingVerifications, isLoading } = useQuery({
    queryKey: ['admin-verifications'],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, 'verifications'))
      return snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() } as VerificationRecord))
        .filter((v) => v.status === 'pending')
    },
  })

  const handleApprove = async (id: string) => {
    try {
      await updateVerificationStatus.mutateAsync({ verificationId: id, status: 'approved', notes })
      showToast('Document approved', 'success')
      setSelectedVerification(null)
      setNotes('')
    } catch (err: any) {
      showToast(err.message || 'Failed to approve', 'error')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await updateVerificationStatus.mutateAsync({ verificationId: id, status: 'rejected', notes })
      showToast('Document rejected', 'success')
      setSelectedVerification(null)
      setNotes('')
    } catch (err: any) {
      showToast(err.message || 'Failed to reject', 'error')
    }
  }

  if (isLoading) return <div className="p-4 text-center text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Verification Queue</h2>
      {(!pendingVerifications || pendingVerifications.length === 0) ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No pending verifications
          </CardContent>
        </Card>
      ) : (
        pendingVerifications.map((v) => (
          <Card key={v.id}>
            <CardHeader>
              <CardTitle className="text-sm capitalize">{v.type} Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Worker ID: {v.workerId}</p>
              <div className="mt-2 flex gap-2">
                {v.documents.map((docUrl, i) => (
                  <a key={i} href={docUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    View Document {i + 1}
                  </a>
                ))}
              </div>
              {selectedVerification?.id === v.id ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    placeholder="Review notes..."
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove(v.id)}>Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(v.id)}>Reject</Button>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedVerification(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="outline" className="mt-2" onClick={() => setSelectedVerification(v)}>
                  Review
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
