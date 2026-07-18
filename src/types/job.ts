import type { JobStatus } from './index'

export interface JobListing {
  id: string
  employerId: string
  title: string
  description: string
  workerType: string
  location: {
    city: string
    suburb: string
  }
  salaryRange: {
    min: number
    max: number
    currency: 'USD' | 'ZWL'
  }
  requirements: {
    skills?: string[]
    minExperience?: number
    type?: string
  }
  status: JobStatus
  createdAt: Date
  expiresAt: Date
}
