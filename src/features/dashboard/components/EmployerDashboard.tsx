import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import { useAuthStore } from '@/stores/authStore'
import { Briefcase, Plus, Eye, TrendingUp, CheckCircle, MapPin, ArrowRight } from 'lucide-react'

export function EmployerDashboard() {
  const { userData } = useAuthStore()
  const { jobs } = useJobs({ employerId: userData?.uid })

  const activeJobs = jobs.filter((j) => j.status === 'active')
  const filledJobs = jobs.filter((j) => j.status === 'filled')

  const stats = [
    {
      label: 'Active Listings',
      value: activeJobs.length,
      icon: Briefcase,
      sub: activeJobs.length === 1 ? '1 job live' : `${activeJobs.length} jobs live`,
    },
    {
      label: 'Total Posted',
      value: jobs.length,
      icon: TrendingUp,
      sub: `${filledJobs.length} filled`,
    },
    {
      label: 'Filled Positions',
      value: filledJobs.length,
      icon: CheckCircle,
      sub: filledJobs.length > 0 ? 'Great placement record' : 'Keep going',
    },
  ]

  return (
    <div className="space-y-7">
      {/* Page header */}
      <div className="flex flex-col gap-5 border-b border-[#dfe6df] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#4d8d3a]">Employer workspace</p>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.035em] text-[#173129] md:text-[42px]">
            {userData?.displayName?.split(' ')[0]
              ? `Good morning, ${userData.displayName.split(' ')[0]}`
              : 'Your Dashboard'}
          </h1>
          <p className="mt-2 text-sm text-[#66766e]">Manage your search, review activity and move towards a confident placement.</p>
        </div>
        <Link to="/jobs/new">
          <Button className="h-11 shrink-0 rounded-lg bg-[#173129] px-6 text-white shadow-none hover:bg-[#294b40]">
            <Plus className="mr-2 h-4 w-4" /> Post a Job
          </Button>
        </Link>
      </div>

      {/* KPI strip */}
      <div className="grid overflow-hidden rounded-xl border border-[#dfe6df] bg-white sm:grid-cols-3 sm:divide-x sm:divide-[#e4e9e3]">
        {stats.map((stat) => (
          <div key={stat.label} className="border-b border-[#e4e9e3] p-5 last:border-0 sm:border-b-0 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#75847c]">{stat.label}</p>
              <stat.icon className="h-4 w-4 text-[#4d8d3a]" />
            </div>
            <div className="font-display text-4xl font-semibold text-[#173129] tabular-nums">{stat.value}</div>
            <p className="mt-1 text-xs text-[#7b8981]">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Job listings */}
      <div className="overflow-hidden rounded-xl border border-[#dfe6df] bg-white">
        <div className="flex items-center justify-between border-b border-[#e4e9e3] px-5 py-5 sm:px-6">
          <div><h2 className="font-semibold text-[#173129]">Recent job listings</h2><p className="mt-0.5 text-xs text-[#7b8981]">Your latest placement searches</p></div>
          <Link to="/jobs" className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="py-16 text-center px-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 mb-4">
              <Briefcase className="h-8 w-8 text-emerald-600" />
            </div>
            <p className="font-medium text-gray-900 mb-1">No listings yet</p>
            <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">Post your first job to start receiving applications from verified workers.</p>
            <Link to="/jobs/new">
              <Button variant="outline" className="rounded-xl border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50">
                <Plus className="mr-2 h-4 w-4" /> Post Your First Job
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {jobs.slice(0, 6).map((job) => (
              <div key={job.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/60 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{job.title}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    {job.location.suburb}, {job.location.city}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    job.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : job.status === 'filled'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {job.status === 'active' ? 'Live' : job.status === 'filled' ? 'Filled' : job.status}
                  </span>
                  <Link to="/jobs">
                    <button className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200">
                      <Eye className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
