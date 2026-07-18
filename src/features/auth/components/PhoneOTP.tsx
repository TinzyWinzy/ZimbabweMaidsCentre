import { useState, useRef } from 'react'
import { RecaptchaVerifier } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useUIStore } from '@/stores/uiStore'
import { useNavigate } from 'react-router-dom'

export function PhoneOTP() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const { sendOTP, verifyOTP } = useAuth()
  const { showToast } = useUIStore()
  const navigate = useNavigate()

  const setupRecaptcha = () => {
    if (!recaptchaRef.current) return null
    return new RecaptchaVerifier(auth, recaptchaRef.current, {
      size: 'invisible',
    })
  }

  const handleSendOTP = async () => {
    setIsSubmitting(true)
    try {
      const verifier = setupRecaptcha()
      if (!verifier) throw new Error('Recaptcha not available')
      await sendOTP(phone, verifier)
      setStep('otp')
      showToast('OTP sent to your phone', 'success')
    } catch (err: any) {
      showToast(err.message || 'Failed to send OTP', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOTP = async () => {
    setIsSubmitting(true)
    try {
      await verifyOTP(otp)
      showToast('Phone verified!', 'success')
      navigate('/dashboard')
    } catch (err: any) {
      showToast(err.message || 'Invalid OTP', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Phone Verification</CardTitle>
        <CardDescription>Verify your phone number to get started</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div ref={recaptchaRef} />
        {step === 'phone' ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+263 7X XXX XXXX"
              />
            </div>
            <Button onClick={handleSendOTP} className="w-full" disabled={isSubmitting || !phone}>
              {isSubmitting ? 'Sending...' : 'Send OTP'}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter OTP</label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
              />
            </div>
            <Button onClick={handleVerifyOTP} className="w-full" disabled={isSubmitting || otp.length < 6}>
              {isSubmitting ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
