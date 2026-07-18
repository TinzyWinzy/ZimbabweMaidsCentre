import { useAuthStore } from '@/stores/authStore'
import { usePayments } from '@/features/payments/hooks/usePayments'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'

export function PaymentsPage() {
  const { userData } = useAuthStore()
  const { payments, isLoading } = usePayments(userData?.uid)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Payment History</h1>
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : payments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No payments yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm capitalize">
                    {payment.type.replace('_', ' ')}
                  </CardTitle>
                  <span className="text-sm font-bold">
                    {formatCurrency(payment.amount, payment.currency)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{payment.method.toUpperCase()}</span>
                  <span>{formatDate(payment.createdAt)}</span>
                  <span className={payment.status === 'success' ? 'text-green-600' : payment.status === 'failed' ? 'text-red-600' : 'text-yellow-600'}>
                    {payment.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
