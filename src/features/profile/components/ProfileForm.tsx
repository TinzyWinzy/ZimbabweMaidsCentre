import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card>
      <CardHeader>
        <CardTitle>{isWorker ? 'Worker Profile' : 'Employer Profile'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input {...register('fullName', { required: true })} />
            {errors.fullName && <p className="text-xs text-destructive">Full name is required</p>}
          </div>

          {isWorker && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select {...register('gender')}>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </Select>
            </div>
          )}

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

          {isWorker && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Skills (comma-separated)</label>
                <Input {...register('skills')} placeholder="Cooking, Cleaning, Childcare" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Experience</label>
                <Input type="number" {...register('experienceYears')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <textarea
                  {...register('bio')}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                />
              </div>
            </>
          )}

          {!isWorker && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Household Size</label>
              <Input type="number" {...register('householdSize')} />
            </div>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
