import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

export function JobList() {
  const { userData } = useAuthStore()
  const isEmployer = userData?.role === 'employer'
  const { jobs, isLoading } = useJobs(
    isEmployer ? { employerId: userData?.uid } : { status: 'active' }
  )

  if (isLoading) return <LoadingSpinner className="mx-auto mt-8" />

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No jobs found. {isEmployer ? 'Post your first job!' : 'Check back later for new opportunities.'}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        {isEmployer ? 'My Job Listings' : 'Available Jobs'}
      </h2>
      {jobs.map((job) => (
        <Card key={job.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{job.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {job.location.suburb}, {job.location.city}
                </p>
              </div>
              <Badge>{job.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <span>Salary: {formatCurrency(job.salaryRange.min, job.salaryRange.currency)} - {formatCurrency(job.salaryRange.max, job.salaryRange.currency)}</span>
              <span>Type: {job.workerType}</span>
              <span>Posted: {formatDate(job.createdAt)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
