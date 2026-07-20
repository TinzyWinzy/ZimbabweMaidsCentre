import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { ArrowRight } from 'lucide-react'

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
    <div className="glass-panel-strong rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h2 className="font-semibold text-gray-900 text-sm">Job Details</h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Job Title</label>
            <Input {...register('title', { required: true, minLength: 5 })} placeholder="e.g. Experienced nanny needed" className="h-11 rounded-xl" />
            {errors.title && <p className="text-xs text-red-500">Title is required (min 5 characters)</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description', { required: true, minLength: 20 })}
              className="flex min-h-[110px] w-full rounded-xl border border-gray-200/80 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
              placeholder="Describe the role, responsibilities, and requirements..."
            />
            {errors.description && <p className="text-xs text-red-500">Description is required (min 20 characters)</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Worker Type</label>
            <select {...register('workerType', { required: true })} className="flex h-11 w-full rounded-xl border border-gray-200/80 bg-white px-4 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10">
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
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">City</label>
              <Input {...register('city', { required: true })} placeholder="Harare" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Suburb</label>
              <Input {...register('suburb', { required: true })} placeholder="Borrowdale" className="h-11 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Min Salary</label>
              <Input type="number" {...register('salaryMin', { required: true })} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Max Salary</label>
              <Input type="number" {...register('salaryMax', { required: true })} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Currency</label>
              <select {...register('currency')} className="flex h-11 w-full rounded-xl border border-gray-200/80 bg-white px-4 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10">
                <option value="USD">USD</option>
                <option value="ZWL">ZWL</option>
              </select>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 mt-6">
            <Button type="submit" disabled={isSubmitting} className="h-11 px-8 rounded-xl btn-primary-glow">
              {isSubmitting ? 'Posting...' : 'Post Job'}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
