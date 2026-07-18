import { useAuthStore } from '@/stores/authStore'
import { KYCUpload } from '@/features/verification/components/KYCUpload'
import { VerificationStatusBadge } from '@/features/profile/components/VerificationStatus'
import { useWorkerProfile } from '@/features/profile/hooks/useWorkerProfile'

export function VerificationPage() {
  const { userData } = useAuthStore()
  const { profile } = useWorkerProfile(userData?.uid)

  const statusItems = profile ? [
    { label: 'KYC / Identity', status: profile.verificationStatus.kyc },
    { label: 'Background Check', status: profile.verificationStatus.backgroundCheck },
    { label: 'Reference Check', status: profile.verificationStatus.referenceCheck },
    { label: 'Training', status: profile.verificationStatus.training },
  ] : []

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Verification</h1>
      {statusItems.length > 0 && <VerificationStatusBadge items={statusItems} />}
      <KYCUpload />
    </div>
  )
}
