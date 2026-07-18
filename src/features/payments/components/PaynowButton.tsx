import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { usePayments } from '@/features/payments/hooks/usePayments'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'

interface PaynowButtonProps {
  amount: number
  currency: 'USD' | 'ZWL'
  type: 'placement_fee' | 'connection_fee' | 'retainer'
  matchId?: string
  label?: string
}

export function PaynowButton({ amount, currency, type, matchId, label }: PaynowButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { userData } = useAuthStore()
  const { initiatePayment } = usePayments(userData?.uid)
  const { showToast } = useUIStore()

  const handlePaynow = async () => {
    if (!userData) return
    setIsSubmitting(true)
    try {
      const result: any = await initiatePayment.mutateAsync({
        userId: userData.uid,
        type,
        amount,
        currency,
        method: 'paynow',
        matchId,
      })
      if (result.redirectUrl) {
        window.open(result.redirectUrl, '_blank')
      }
      showToast('Payment initiated via Paynow', 'success')
    } catch (err: any) {
      showToast(err.message || 'Payment failed', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button onClick={handlePaynow} disabled={isSubmitting} variant="outline" className="w-full">
      {isSubmitting ? 'Processing...' : label || `Pay $${amount} via Paynow`}
    </Button>
  )
}
