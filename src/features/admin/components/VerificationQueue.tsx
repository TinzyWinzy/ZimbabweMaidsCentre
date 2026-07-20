import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useVerification } from '@/features/verification/hooks/useVerification'
import { useUIStore } from '@/stores/uiStore'
import { FileCheck, Shield, Clock, ExternalLink } from 'lucide-react'
import type { VerificationRecord } from '@/types/verification'

export function AdminVerificationQueue() {
  const [selectedVerification, setSelectedVerification] = useState<VerificationRecord | null>(null)
  const [notes, setNotes] = useState('')
  const { updateVerificationStatus, verifications, isLoading } = useVerification(undefined)
  const { showToast } = useUIStore()
  const pendingVerifications = verifications.filter((v) => v.status === 'pending')

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

  if (isLoading) {
    return (
      <div className="glass-panel-strong rounded-2xl overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
            <div className="skeleton h-9 w-9 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3.5 w-32 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
            <div className="skeleton h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (!pendingVerifications || pendingVerifications.length === 0) {
    return (
      <div className="glass-panel-strong rounded-2xl py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 mb-4">
          <Shield className="h-8 w-8 text-emerald-600" />
        </div>
        <p className="font-medium text-gray-900 mb-1">All clear</p>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">No pending verifications. New submissions will appear here.</p>
      </div>
    )
  }

  return (
    <div className="glass-panel-strong rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-600" />
          <h2 className="font-semibold text-gray-900 text-sm">
            Pending Review ({pendingVerifications.length})
          </h2>
        </div>
      </div>
      <div className="divide-y divide-gray-50">
        {pendingVerifications.map((v) => (
          <div key={v.id} className="px-6 py-5 hover:bg-gray-50/60 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <h3 className="font-semibold text-gray-900 text-sm capitalize">{v.type} Verification</h3>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">Worker ID: {v.workerId}</p>
              </div>
              <span className="shrink-0 rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-xs font-medium">
                Pending
              </span>
            </div>

            {v.documents.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {v.documents.map((docUrl, i) => (
                  <a
                    key={i}
                    href={docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Doc {i + 1}
                  </a>
                ))}
              </div>
            )}

            {selectedVerification?.id === v.id ? (
              <div className="mt-4 space-y-3 pt-4 border-t border-gray-100">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="flex min-h-[70px] w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                  placeholder="Add review notes..."
                />
                <div className="flex gap-2">
                  <Button size="sm" className="rounded-lg h-9 px-5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md" onClick={() => handleApprove(v.id)}>
                    Approve
                  </Button>
                  <Button size="sm" className="rounded-lg h-9 px-5 bg-red-500 hover:bg-red-600 text-white shadow-md" onClick={() => handleReject(v.id)}>
                    Reject
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-lg h-9 px-5 border-gray-200" onClick={() => setSelectedVerification(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <Button size="sm" variant="outline" className="rounded-lg h-9 px-5 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-700" onClick={() => setSelectedVerification(v)}>
                  Review
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
