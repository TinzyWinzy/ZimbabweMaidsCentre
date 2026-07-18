import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import { useAuthStore } from '@/stores/authStore'
import { Briefcase, Plus, Eye } from 'lucide-react'

export function EmployerDashboard() {
  const { userData } = useAuthStore()
  const { jobs } = useJobs({ employerId: userData?.uid })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employer Dashboard</h1>
        <Link to="/jobs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Post a Job
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{jobs.filter((j) => j.status === 'active').length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs Posted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Filled Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.filter((j) => j.status === 'filled').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Job Listings</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>You haven't posted any jobs yet.</p>
              <Link to="/jobs/new">
                <Button variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Post Your First Job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job) => (
                <div key={job.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.location.suburb}, {job.location.city}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {job.status}
                    </span>
                    <Link to={`/jobs`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
