import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import { useWorkerProfile } from '@/features/profile/hooks/useWorkerProfile'
import { useAuthStore } from '@/stores/authStore'
import { Briefcase, Shield, User } from 'lucide-react'

export function WorkerDashboard() {
  const { userData } = useAuthStore()
  const { jobs } = useJobs({ status: 'active' })
  const { profile } = useWorkerProfile(userData?.uid)

  const verifiedSteps = profile
    ? [profile.verificationStatus.kyc === 'approved',
       profile.verificationStatus.backgroundCheck === 'approved',
       profile.verificationStatus.referenceCheck === 'approved'].filter(Boolean).length
    : 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Worker Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{jobs.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{profile ? '80%' : '0%'}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{verifiedSteps}/3</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/profile" className="block">
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" /> Update Profile
              </Button>
            </Link>
            <Link to="/verification" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" /> Upload Documents
              </Button>
            </Link>
            <Link to="/jobs" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="mr-2 h-4 w-4" /> Browse Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No jobs available yet</p>
            ) : (
              <div className="space-y-2">
                {jobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="rounded-lg border p-2 text-sm">
                    <p className="font-medium">{job.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.location.suburb} | ${job.salaryRange.min}-${job.salaryRange.max}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
