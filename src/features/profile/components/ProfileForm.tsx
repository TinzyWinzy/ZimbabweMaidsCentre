import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useAuthStore } from '@/stores/authStore'
import { useWorkerProfile } from '@/features/profile/hooks/useWorkerProfile'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { useUIStore } from '@/stores/uiStore'

export function ProfileForm() {
  const { userData } = useAuthStore()
  const isWorker = userData?.role === 'worker'
  const { updateProfile: updateWorker } = useWorkerProfile(userData?.uid)
  const { updateProfile: updateEmployer } = useProfile(userData?.uid)
  const { showToast } = useUIStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      if (isWorker) {
        await updateWorker.mutateAsync({
          fullName: data.fullName,
          gender: data.gender,
          location: { city: data.city, suburb: data.suburb },
          skills: data.skills?.split(',').map((s: string) => s.trim()) || [],
          experienceYears: Number(data.experienceYears),
          bio: data.bio,
        })
      } else {
        await updateEmployer.mutateAsync({
          fullName: data.fullName,
          location: { city: data.city, suburb: data.suburb },
          householdSize: Number(data.householdSize),
        })
      }
      showToast('Profile updated!', 'success')
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Page header */}
      <div className="pb-6 border-b border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">Account Settings</p>
        <h1 className="page-title text-3xl md:text-4xl">
          {isWorker ? 'Worker Profile' : 'Employer Profile'}
        </h1>
        <p className="text-gray-500 mt-1.5 text-sm">Manage your personal information and preferences.</p>
      </div>

      <div className="glass-panel-strong rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-semibold text-gray-900 text-sm">Personal Information</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <Input {...register('fullName', { required: true })} className="h-11 rounded-xl" placeholder="John Doe" />
              {errors.fullName && <p className="text-xs text-red-500">Full name is required</p>}
            </div>

            {isWorker && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <Select {...register('gender')} className="h-11 rounded-xl">
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </Select>
              </div>
            )}

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

            {isWorker && (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                  <Input {...register('skills')} placeholder="Cooking, Cleaning, Childcare" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Years of Experience</label>
                  <Input type="number" {...register('experienceYears')} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    {...register('bio')}
                    placeholder="Tell employers a bit about yourself..."
                    className="flex min-h-[100px] w-full rounded-xl border border-input bg-transparent px-3 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </>
            )}

            {!isWorker && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Household Size</label>
                <Input type="number" {...register('householdSize')} className="h-11 rounded-xl" />
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 mt-6">
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto h-11 px-8 rounded-xl btn-primary-glow">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
