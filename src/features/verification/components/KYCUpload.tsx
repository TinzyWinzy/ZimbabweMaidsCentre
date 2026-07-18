import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card>
      <CardHeader>
        <CardTitle>Verification Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        {documentTypes.map(({ type, label }) => {
          const status = getStatusForType(type)
          const isUploading = uploading === type
          return (
            <div key={type} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{status}</p>
              </div>
              <Button
                size="sm"
                variant={status === 'approved' ? 'ghost' : 'outline'}
                disabled={status === 'approved' || isUploading}
                onClick={() => handleUpload(type)}
              >
                {isUploading ? 'Uploading...' : status === 'approved' ? 'Verified' : 'Upload'}
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
