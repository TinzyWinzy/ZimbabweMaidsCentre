import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useUIStore } from '@/stores/uiStore'
import type { UserRole } from '@/types'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['employer', 'worker']),
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { registerWithEmail } = useAuth()
  const { showToast } = useUIStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'worker' },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true)
    try {
      await registerWithEmail(data.email, data.password, data.role as UserRole, data.name)
      showToast('Account created successfully!', 'success')
      navigate('/dashboard')
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Join Zimbabwe Maids Centre</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input {...register('name')} placeholder="John Doe" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" {...register('email')} placeholder="you@example.com" />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" {...register('password')} placeholder="••••••••" />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">I am a...</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="employer" {...register('role')} className="accent-primary" />
                <span>Employer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="worker" {...register('role')} className="accent-primary" />
                <span>Worker</span>
              </label>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </CardContent>
    </Card>
  )
}
