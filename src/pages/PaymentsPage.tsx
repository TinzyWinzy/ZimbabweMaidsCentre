import { useAuthStore } from '@/stores/authStore'
import { usePayments } from '@/features/payments/hooks/usePayments'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CreditCard, CheckCircle2, XCircle, Clock, ArrowDownLeft } from 'lucide-react'

type PaymentStatus = 'success' | 'failed' | 'pending'

const STATUS_CONFIG: Record<PaymentStatus, { icon: React.ReactNode; pill: string; label: string }> = {
  success: {
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    pill: 'bg-emerald-50 text-emerald-700',
    label: 'Success',
  },
  failed: {
    icon: <XCircle className="h-4 w-4 text-red-400" />,
    pill: 'bg-red-50 text-red-700',
    label: 'Failed',
  },
  pending: {
    icon: <Clock className="h-4 w-4 text-amber-400" />,
    pill: 'bg-amber-50 text-amber-700',
    label: 'Pending',
  },
}

export function PaymentsPage() {
  const { userData } = useAuthStore()
  const { payments, isLoading } = usePayments(userData?.uid)

  const totalPaid = payments
    .filter((p: any) => p.status === 'success')
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)

  const currency = payments[0]?.currency || 'USD'

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Page header */}
      <div className="pb-6 border-b border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">Billing</p>
        <h1 className="page-title text-3xl md:text-4xl">Payment History</h1>
        <p className="text-gray-500 mt-1.5 text-sm">A record of all placement fee transactions on your account.</p>
      </div>

      {/* Summary strip */}
      {!isLoading && payments.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Total Paid',
              value: formatCurrency(totalPaid, currency),
              icon: CreditCard,
              gradient: 'from-emerald-500 to-green-400',
            },
            {
              label: 'Transactions',
              value: payments.length,
              icon: ArrowDownLeft,
              gradient: 'from-blue-500 to-cyan-400',
            },
            {
              label: 'Successful',
              value: payments.filter((p: any) => p.status === 'success').length,
              icon: CheckCircle2,
              gradient: 'from-emerald-500 to-teal-400',
            },
          ].map((s) => (
            <div key={s.label} className="stat-card group">
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm font-medium text-gray-500">{s.label}</p>
                <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${s.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 tabular-nums">{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Transactions */}
      {isLoading ? (
        <div className="glass-panel-strong rounded-2xl overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
              <div className="skeleton h-9 w-9 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3.5 w-32 rounded" />
                <div className="skeleton h-3 w-20 rounded" />
              </div>
              <div className="skeleton h-3.5 w-16 rounded" />
            </div>
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="glass-panel-strong rounded-2xl py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 mb-4">
            <CreditCard className="h-8 w-8 text-emerald-600" />
          </div>
          <p className="font-medium text-gray-900 mb-1">No payments yet</p>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            When you unlock a worker's contact details, your payment will appear here.
          </p>
        </div>
      ) : (
        <div className="glass-panel-strong rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Transactions</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {payments.map((payment: any) => {
              const s = STATUS_CONFIG[payment.status as PaymentStatus] ?? STATUS_CONFIG.pending
              return (
                <div key={payment.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {payment.type?.replace(/_/g, ' ') || 'Placement fee'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {payment.method?.toUpperCase() || 'EcoCash'} · {payment.createdAt ? formatDate(payment.createdAt) : '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.pill}`}>
                      {s.icon}
                      {s.label}
                    </span>
                    <span className="font-semibold text-gray-900 text-sm tabular-nums">
                      {formatCurrency(payment.amount, payment.currency)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentsPage
