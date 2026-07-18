import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'

interface JobFormProps {
  onSuccess?: () => void
}

export function JobForm({ onSuccess }: JobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createJob } = useJobs()
  const { userData } = useAuthStore()
  const { showToast } = useUIStore()

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data: any) => {
    if (!userData) return
    setIsSubmitting(true)
    try {
      await createJob.mutateAsync({
        employerId: userData.uid,
        title: data.title,
        description: data.description,
        workerType: data.workerType,
        location: { city: data.city, suburb: data.suburb },
        salaryRange: { min: Number(data.salaryMin), max: Number(data.salaryMax), currency: data.currency },
        requirements: {},
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      showToast('Job posted successfully!', 'success')
      onSuccess?.()
    } catch (err: any) {
      showToast(err.message || 'Failed to post job', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post a Job</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Job Title</label>
            <Input {...register('title', { required: true, minLength: 5 })} placeholder="Experienced nanny needed" />
            {errors.title && <p className="text-xs text-destructive">Title is required (min 5 characters)</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...register('description', { required: true, minLength: 20 })}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              placeholder="Describe the role, responsibilities, and requirements..."
            />
            {errors.description && <p className="text-xs text-destructive">Description is required (min 20 characters)</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Worker Type</label>
            <select {...register('workerType', { required: true })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
              <option value="">Select type...</option>
              <option value="maid">Maid</option>
              <option value="nanny">Nanny</option>
              <option value="chef">Chef</option>
              <option value="caregiver">Caregiver</option>
              <option value="cleaner">Cleaner</option>
              <option value="gardener">Gardener</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input {...register('city', { required: true })} placeholder="Harare" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Suburb</label>
              <Input {...register('suburb', { required: true })} placeholder="Borrowdale" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Salary</label>
              <Input type="number" {...register('salaryMin', { required: true })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Salary</label>
              <Input type="number" {...register('salaryMax', { required: true })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <select {...register('currency')} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                <option value="USD">USD</option>
                <option value="ZWL">ZWL</option>
              </select>
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
