import { AdminVerificationQueue } from '@/features/admin/components/VerificationQueue'

export function AdminVerificationsPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="pb-6 border-b border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">Administration</p>
        <h1 className="page-title text-3xl md:text-4xl">Verification Queue</h1>
        <p className="text-gray-500 mt-1.5 text-sm">
          Review and approve worker identity documents and certifications.
        </p>
      </div>
      <AdminVerificationQueue />
    </div>
  )
}

export default AdminVerificationsPage
