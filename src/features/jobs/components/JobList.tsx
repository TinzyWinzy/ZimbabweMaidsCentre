import { Briefcase } from 'lucide-react'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  filled: 'bg-blue-50 text-blue-700',
  expired: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-50 text-red-700',
}

export function JobList() {
  const { userData } = useAuthStore()
  const isEmployer = userData?.role === 'employer'
  const { jobs, isLoading } = useJobs(
    isEmployer ? { employerId: userData?.uid } : { status: 'active' }
  )

  if (isLoading) return <LoadingSpinner className="mx-auto mt-8" />

  if (jobs.length === 0) {
    return (
      <div className="glass-panel-strong rounded-2xl py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 mb-4">
          <Briefcase className="h-8 w-8 text-emerald-600" />
        </div>
        <p className="font-medium text-gray-900 mb-1">
          {isEmployer ? 'No listings yet' : 'No jobs available'}
        </p>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          {isEmployer
            ? 'Post your first job to start receiving applications from verified workers.'
            : 'New opportunities are posted daily. Complete your profile to get matched first.'}
        </p>
      </div>
    )
  }

  return (
    <div className="glass-panel-strong rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="font-semibold text-gray-900 text-sm">
          {isEmployer ? 'Your Listings' : 'Open Positions'}
        </h2>
      </div>
      <div className="divide-y divide-gray-50">
        {jobs.map((job) => (
          <div key={job.id} className="px-6 py-5 hover:bg-gray-50/60 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {job.location.suburb}, {job.location.city}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[job.status] || 'bg-gray-100 text-gray-600'}`}>
                {job.status === 'active' ? 'Live' : job.status === 'filled' ? 'Filled' : job.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2 mt-3 leading-6">{job.description}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-xs text-gray-400">
              <span className="font-medium text-gray-600">{formatCurrency(job.salaryRange.min, job.salaryRange.currency)} – {formatCurrency(job.salaryRange.max, job.salaryRange.currency)}</span>
              <span className="capitalize">{job.workerType}</span>
              <span>{formatDate(job.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
