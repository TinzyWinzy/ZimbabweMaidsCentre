import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useVerification } from '@/features/verification/hooks/useVerification'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import type { VerificationType } from '@/types'

const documentTypes: { type: VerificationType; label: string }[] = [
  { type: 'kyc', label: 'National ID / Passport' },
  { type: 'background', label: 'Background Check' },
  { type: 'reference', label: 'Reference Letter' },
  { type: 'training', label: 'Training Certificate' },
]

export function KYCUpload() {
  const { userData } = useAuthStore()
  const { uploadDocument, verifications } = useVerification(userData?.uid)
  const { showToast } = useUIStore()
  const [uploading, setUploading] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeType, setActiveType] = useState<VerificationType | null>(null)

  const handleUpload = async (type: VerificationType) => {
    fileInputRef.current?.click()
    setActiveType(type)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !activeType) return
    setUploading(activeType)
    try {
      await uploadDocument.mutateAsync({ file, type: activeType })
      showToast(`${activeType.toUpperCase()} document uploaded`, 'success')
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error')
    } finally {
      setUploading(null)
      setActiveType(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const getStatusForType = (type: VerificationType) => {
    const v = verifications.find((v) => v.type === type)
    return v?.status || 'not_submitted'
  }

  return (
    <div className="glass-panel-strong rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Required Documents</h2>
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          Secure Upload
        </span>
      </div>
      <div className="p-6 space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {documentTypes.map(({ type, label }) => {
            const status = getStatusForType(type)
            const isUploading = uploading === type
            return (
              <div key={type} className="flex flex-col p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-emerald-200 hover:shadow-md transition-all duration-200">
                <div className="mb-4 flex-1">
                  <p className="font-medium text-gray-900 mb-1">{label}</p>
                  <p className="text-xs text-gray-500 capitalize">{status.replace('_', ' ')}</p>
                </div>
                <Button
                  className={`w-full rounded-lg h-9 ${
                    status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                  variant={status === 'approved' ? 'ghost' : 'outline'}
                  disabled={status === 'approved' || isUploading}
                  onClick={() => handleUpload(type)}
                >
                  {isUploading ? 'Uploading...' : status === 'approved' ? 'Verified' : 'Upload File'}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
