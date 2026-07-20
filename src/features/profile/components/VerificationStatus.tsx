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
    <div className="glass-panel-strong rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 text-sm">Verification Status</h2>
      </div>
      <div className="p-4 space-y-3">
        {items.map((item) => {
          const config = statusConfig[item.status]
          return (
            <div key={item.label} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${config.color}`}>
                {config.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
