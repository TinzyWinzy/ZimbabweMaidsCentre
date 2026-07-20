export interface PublicWorker {
  id: string
  fullName: string
  location: { city: string; suburb: string }
  skills: string[]
  experienceYears: number
  expectedSalary: { min: number; max: number; currency: string }
  availability: { type?: string; days?: string[]; startDate?: string }
  languages: string[]
  bio: string
  photoURL: string
  category: string
  workTypes: string[]
  isPublished: boolean
  verificationStatus: Record<string, string>
  rating: number
  reviewCount: number
}

export interface BookingRequest {
  clientRequestId: string
  workerId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  city: string
  suburb: string
  workType: string
  startDate: string
  scheduleNotes: string
  requirements: string
}
