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
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Page header */}
      <div className="pb-6 border-b border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">Trust & Safety</p>
        <h1 className="page-title text-3xl md:text-4xl">Verification</h1>
        <p className="text-gray-500 mt-1.5 text-sm">Submit your documents to become a verified worker on our platform.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          <KYCUpload />
        </div>
        <div className="md:col-span-4 space-y-6">
          {statusItems.length > 0 && <VerificationStatusBadge items={statusItems} />}

          <div className="glass-panel-strong rounded-2xl p-6 bg-gradient-to-br from-emerald-600 to-green-500 text-white">
            <h3 className="font-semibold mb-2 text-lg">Why verify?</h3>
            <ul className="space-y-3 text-sm text-emerald-50">
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5">1</div>
                <span>Verified profiles get 4x more employer messages</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5">2</div>
                <span>Access to premium job listings</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5">3</div>
                <span>Stand out in search results with a trust badge</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerificationPage
