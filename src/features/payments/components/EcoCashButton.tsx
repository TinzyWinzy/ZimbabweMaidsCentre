import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePayments } from '@/features/payments/hooks/usePayments'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'

interface EcoCashButtonProps {
  amount: number
  currency: 'USD' | 'ZWL'
  type: 'placement_fee' | 'connection_fee' | 'retainer'
  matchId?: string
}

export function EcoCashButton({ amount, currency, type, matchId }: EcoCashButtonProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { userData } = useAuthStore()
  const { initiatePayment } = usePayments(userData?.uid)
  const { showToast } = useUIStore()

  const handleEcoCash = async () => {
    if (!userData || !phoneNumber) return
    setIsSubmitting(true)
    try {
      await initiatePayment.mutateAsync({
        userId: userData.uid,
        type,
        amount,
        currency,
        method: 'ecocash',
        matchId,
        phoneNumber,
      })
      showToast('Check your phone for EcoCash prompt', 'success')
    } catch (err: any) {
      showToast(err.message || 'Payment failed', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-2">
      <Input
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="EcoCash number (e.g., 0771XXXXXX)"
      />
      <Button onClick={handleEcoCash} disabled={isSubmitting || !phoneNumber} variant="outline" className="w-full">
        {isSubmitting ? 'Processing...' : `Pay $${amount} via EcoCash`}
      </Button>
    </div>
  )
}
