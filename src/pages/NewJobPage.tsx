import { useNavigate } from 'react-router-dom'
import { JobForm } from '@/features/jobs/components/JobForm'

export function NewJobPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="pb-6 border-b border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">Posting</p>
        <h1 className="page-title text-3xl md:text-4xl">Post a New Job</h1>
        <p className="text-gray-500 mt-1.5 text-sm">
          Create a detailed listing to find the right domestic professional for your home.
        </p>
      </div>
      <JobForm onSuccess={() => navigate('/jobs')} />
    </div>
  )
}

export default NewJobPage
