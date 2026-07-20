import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import { useWorkerProfile } from '@/features/profile/hooks/useWorkerProfile'
import { useAuthStore } from '@/stores/authStore'
import { Briefcase, Shield, User, Star, ArrowRight, CheckCircle2, Clock, XCircle, MapPin } from 'lucide-react'

const VERIFICATION_STEPS = [
  { key: 'kyc', label: 'Identity (KYC)', desc: 'National ID or passport' },
  { key: 'backgroundCheck', label: 'Background Check', desc: 'Police clearance' },
  { key: 'referenceCheck', label: 'References', desc: 'Former employer letters' },
] as const

function VerificationRing({ step, total }: { step: number; total: number }) {
  const r = 28
  const circumference = 2 * Math.PI * r
  const pct = total === 0 ? 0 : step / total
  const offset = circumference - pct * circumference
  const color = pct === 1 ? '#10b981' : pct >= 0.5 ? '#f59e0b' : '#6b7280'
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#f0fdf4" strokeWidth="5" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
        {step}/{total}
      </span>
    </div>
  )
}

export function WorkerDashboard() {
  const { userData } = useAuthStore()
  const { jobs } = useJobs({ status: 'active' })
  const { profile } = useWorkerProfile(userData?.uid)

  const stepStatuses = profile
    ? [
        profile.verificationStatus.kyc,
        profile.verificationStatus.backgroundCheck,
        profile.verificationStatus.referenceCheck,
      ]
    : ['pending', 'pending', 'pending']

  const approvedCount = stepStatuses.filter((s) => s === 'approved').length
  const isFullyVerified = approvedCount === 3

  const statusIcon = (s: string) => {
    if (s === 'approved') return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    if (s === 'rejected') return <XCircle className="h-4 w-4 text-red-400" />
    return <Clock className="h-4 w-4 text-gray-300" />
  }

  const statusLabel = (s: string) => {
    if (s === 'approved') return <span className="text-xs text-emerald-600 font-medium">Approved</span>
    if (s === 'rejected') return <span className="text-xs text-red-500 font-medium">Rejected</span>
    return <span className="text-xs text-gray-400">Pending</span>
  }

  return (
    <div className="space-y-7">
      {/* Page header */}
      <div className="border-b border-[#dfe6df] pb-7">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#4d8d3a]">Worker workspace</p>
        <h1 className="font-display text-3xl font-semibold tracking-[-0.035em] text-[#173129] md:text-[42px]">
          {userData?.displayName?.split(' ')[0]
            ? `Welcome, ${userData.displayName.split(' ')[0]}`
            : 'Your Dashboard'}
        </h1>
        <p className="mt-2 text-sm text-[#66766e]">Build a trusted profile, complete verification and discover suitable work.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Verification panel — the most important thing for a worker */}
        <div className="overflow-hidden rounded-xl border border-[#dfe6df] bg-white lg:col-span-2">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f0e7]">
                <Shield className="h-4 w-4 text-[#4d8d3a]" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-sm">Verification Progress</h2>
                <p className="text-xs text-gray-500">Complete all three to be listed</p>
              </div>
            </div>
            <VerificationRing step={approvedCount} total={3} />
          </div>

          <div className="divide-y divide-gray-50">
            {VERIFICATION_STEPS.map((step, i) => {
              const status = stepStatuses[i] || 'pending'
              return (
                <div key={step.key} className="flex items-center gap-4 px-6 py-4">
                  {statusIcon(status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{step.label}</p>
                    <p className="text-xs text-gray-400">{step.desc}</p>
                  </div>
                  {statusLabel(status)}
                </div>
              )
            })}
          </div>

          <div className="px-6 py-4 bg-gray-50/60">
            {isFullyVerified ? (
              <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Your profile is fully verified and visible to employers.
              </div>
            ) : (
              <Link to="/verification">
                <Button size="sm" className="btn-primary rounded-xl h-9 px-5">
                  <Shield className="mr-2 h-3.5 w-3.5" /> Upload Documents
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="overflow-hidden rounded-xl border border-[#dfe6df] bg-white">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-2">
            {[
              { to: '/profile', label: 'Update Profile', icon: User, desc: 'Skills, location, bio' },
              { to: '/verification', label: 'Upload Documents', icon: Shield, desc: 'ID, references, certificates' },
              { to: '/jobs', label: 'Browse Jobs', icon: Briefcase, desc: `${jobs.length} open listings` },
            ].map((action) => (
              <Link key={action.to} to={action.to} className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50/60 border border-transparent hover:border-emerald-100 transition-all duration-200 group">
                  <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                    <action.icon className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{action.label}</p>
                    <p className="text-xs text-gray-400">{action.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>

          {/* Profile score */}
          <div className="mx-4 mb-4 rounded-lg bg-[#173129] p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 fill-white text-white" />
              <span className="text-sm font-semibold">Profile Strength</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {profile ? '85%' : '0%'}
            </div>
            <p className="text-xs text-emerald-100">
              {profile ? 'Almost there — verify documents to reach 100%' : 'Complete your profile to get noticed'}
            </p>
          </div>
        </div>
      </div>

      {/* Recent opportunities */}
      <div className="overflow-hidden rounded-xl border border-[#dfe6df] bg-white">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Open Opportunities</h2>
          <Link to="/jobs" className="text-sm text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1 transition-colors">
            Browse all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {jobs.length === 0 ? (
          <div className="py-12 text-center px-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 mb-4">
              <Briefcase className="h-7 w-7 text-emerald-600" />
            </div>
            <p className="font-medium text-gray-900 mb-1">No listings right now</p>
            <p className="text-sm text-gray-500">New opportunities are posted daily. Complete your profile to get matched first.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {jobs.slice(0, 5).map((job) => (
              <Link key={job.id} to="/jobs" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/60 transition-colors group">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-gray-900">{job.title}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {job.location.suburb} · ${job.salaryRange.min}–${job.salaryRange.max}/mo
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0 ml-4" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
