import { useNavigate } from 'react-router-dom'
import { JobForm } from '@/features/jobs/components/JobForm'

export function NewJobPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-2xl">
      <JobForm onSuccess={() => navigate('/jobs')} />
    </div>
  )
}
