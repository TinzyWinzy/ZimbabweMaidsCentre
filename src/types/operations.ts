import type { PublicWorker } from './worker-directory'

export interface AdminWorker extends PublicWorker {
  email: string
  isVerified: boolean
  adminNotes: string
  phoneNumber: string
  whatsappNumber: string
  createdAt: string
  updatedAt: string
}

export type ApplicantStage = 'new' | 'screened' | 'interviewed' | 'training' | 'approved' | 'converted' | 'rejected'

export interface Applicant {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  whatsappNumber: string
  location: { city: string; suburb: string }
  category: string
  workTypes: string[]
  skills: string[]
  languages: string[]
  experienceYears: number
  expectedSalary: number
  bio: string
  source: string
  stage: ApplicantStage
  interviewAt: string | null
  notes: string
  convertedWorkerId: string | null
  createdAt: string
  updatedAt: string
}
