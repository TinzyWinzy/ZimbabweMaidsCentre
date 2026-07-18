import { useQuery } from '@tanstack/react-query'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Briefcase, FileCheck, DollarSign } from 'lucide-react'

export function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersSnap, jobsSnap, verificationsSnap, paymentsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'jobs')),
        getDocs(collection(db, 'verifications')),
        getDocs(collection(db, 'payments')),
      ])

      return {
        totalUsers: usersSnap.size,
        activeJobs: jobsSnap.docs.filter((d) => d.data().status === 'active').length,
        pendingVerifications: verificationsSnap.docs.filter((d) => d.data().status === 'pending').length,
        totalRevenue: paymentsSnap.docs
          .filter((d) => d.data().status === 'success')
          .reduce((sum, d) => sum + (d.data().amount || 0), 0),
      }
    },
  })

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users },
    { title: 'Active Jobs', value: stats?.activeJobs || 0, icon: Briefcase },
    { title: 'Pending Verifications', value: stats?.pendingVerifications || 0, icon: FileCheck },
    { title: 'Revenue (USD)', value: `$${stats?.totalRevenue || 0}`, icon: DollarSign },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
