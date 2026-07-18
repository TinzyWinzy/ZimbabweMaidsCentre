import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { VerificationItemStatus } from '@/types'

interface VerificationStatusProps {
  items: {
    label: string
    status: VerificationItemStatus
  }[]
}

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
  rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
}

export function VerificationStatusBadge({ items }: VerificationStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Verification Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item) => {
            const config = statusConfig[item.status]
            return (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm">{item.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}>
                  {config.label}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
