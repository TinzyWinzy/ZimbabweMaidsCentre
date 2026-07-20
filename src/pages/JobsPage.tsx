import { JobList } from '@/features/jobs/components/JobList'
import { useAuthStore } from '@/stores/authStore'

export function JobsPage() {
  const { userData } = useAuthStore()
  const isEmployer = userData?.role === 'employer'

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-6 border-b border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">Jobs</p>
        <h1 className="page-title text-3xl md:text-4xl">
          {isEmployer ? 'My Job Listings' : 'Available Jobs'}
        </h1>
        <p className="text-gray-500 mt-1.5 text-sm">
          {isEmployer
            ? 'Manage your job postings and track applications.'
            : 'Browse open opportunities from verified employers.'}
        </p>
      </div>
      <JobList />
    </div>
  )
}

export default JobsPage
