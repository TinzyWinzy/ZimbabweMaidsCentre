import { useQuery } from '@tanstack/react-query'
import { Users, Briefcase, FileCheck, DollarSign, ArrowRight, Database, KeyRound, ListChecks } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'

export function AdminDashboard() {
  const { isDemo } = useAuthStore()
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      return api<{ totalUsers: number; activeJobs: number; pendingVerifications: number; totalRevenue: number }>(
        isDemo ? '/test/stats' : '/stats'
      )
    },
  })

  const statCards = [
    { title: 'Registered users', value: stats?.totalUsers || 0, icon: Users, href: '/dashboard', detail: 'Across all account types' },
    { title: 'Active jobs', value: stats?.activeJobs || 0, icon: Briefcase, href: '/jobs', detail: 'Currently visible to workers' },
    { title: 'Awaiting review', value: stats?.pendingVerifications || 0, icon: FileCheck, href: '/admin/verifications', detail: 'Verification submissions' },
    { title: 'Revenue recorded', value: `$${stats?.totalRevenue || 0}`, icon: DollarSign, href: '/payments', detail: 'Successful payments (USD)' },
  ]

  return (
    <div className="space-y-7">
      <div className="border-b border-[#dfe6df] pb-7">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#4d8d3a]">Administration</p>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.035em] text-[#173129] md:text-[42px]">Platform overview</h1>
          <p className="mt-2 text-sm text-[#66766e]">Monitor marketplace activity and resolve the work that needs attention.</p>
        </div>
      </div>

      <div className="grid overflow-hidden rounded-xl border border-[#dfe6df] bg-white sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.href} className="group block border-b border-r border-[#e4e9e3] p-5 last:border-r-0 hover:bg-[#f8faf6] sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#75847c]">{stat.title}</span>
              <stat.icon className="h-4 w-4 text-[#4d8d3a]" />
            </div>
            <div className="font-display text-4xl font-semibold text-[#173129]">{stat.value}</div>
            <div className="mt-2 flex items-center justify-between text-xs text-[#7b8981]">
              <span>{stat.detail}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="overflow-hidden rounded-xl border border-[#dfe6df] bg-white">
          <div className="border-b border-[#e4e9e3] px-6 py-5">
            <h2 className="font-semibold text-[#173129]">Operations queue</h2>
            <p className="mt-0.5 text-xs text-[#7b8981]">Review the areas that keep the marketplace moving</p>
          </div>
          <div className="divide-y divide-[#e8ece7]">
            {[
              { to: '/admin/verifications', label: 'Review verifications', desc: `${stats?.pendingVerifications || 0} submissions waiting`, icon: FileCheck },
              { to: '/jobs', label: 'Inspect active jobs', desc: `${stats?.activeJobs || 0} listings currently live`, icon: Briefcase },
              { to: '/payments', label: 'Reconcile payments', desc: `$${stats?.totalRevenue || 0} successful revenue recorded`, icon: DollarSign },
            ].map((action) => (
              <Link key={action.to} to={action.to} className="group flex items-center gap-4 px-6 py-5 hover:bg-[#f8faf6]">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8f0e7]"><action.icon className="h-4 w-4 text-[#4d8d3a]" /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-[#253b33]">{action.label}</span><span className="mt-0.5 block text-xs text-[#7b8981]">{action.desc}</span></span>
                <ArrowRight className="h-4 w-4 text-[#9aa59f] transition-transform group-hover:translate-x-0.5 group-hover:text-[#4d8d3a]" />
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#dfe6df] bg-[#173129] p-6 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9fc594]">System status</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">Core services</h2>
          <div className="mt-6 divide-y divide-white/10">
            {[
              { label: 'Database', status: 'Connected', icon: Database, color: 'bg-[#8bc573]' },
              { label: 'Authentication', status: 'Connected', icon: KeyRound, color: 'bg-[#8bc573]' },
              { label: 'Verification queue', status: `${stats?.pendingVerifications || 0} pending`, icon: ListChecks, color: stats?.pendingVerifications ? 'bg-amber-300' : 'bg-[#8bc573]' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 py-4 first:pt-0">
                <item.icon className="h-4 w-4 text-white/60" />
                <span className="flex-1 text-sm text-white/80">{item.label}</span>
                <span className="flex items-center gap-2 text-xs font-medium text-white">
                  <span className={`h-1.5 w-1.5 rounded-full ${item.color}`} />
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
