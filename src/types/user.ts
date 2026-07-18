import type { OverallVerificationStatus, VerificationItemStatus } from './index'

export interface EmployerProfile {
  uid: string
  fullName: string
  location: {
    city: string
    suburb: string
  }
  householdSize: number
  preferences: Record<string, unknown>
  verificationStatus: 'pending' | 'verified'
}

export interface WorkerProfile {
  uid: string
  fullName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  location: {
    city: string
    suburb: string
  }
  skills: string[]
  experienceYears: number
  expectedSalary: {
    min: number
    max: number
    currency: 'USD' | 'ZWL'
  }
  availability: {
    type: 'fulltime' | 'parttime' | 'livein' | 'liveout'
    days: string[]
    startDate: string
  }
  languages: string[]
  bio: string
  photoURL: string
  documents: {
    idCard: string
    certificates: string[]
    referenceLetters: string[]
  }
  verificationStatus: {
    kyc: VerificationItemStatus
    backgroundCheck: VerificationItemStatus
    referenceCheck: VerificationItemStatus
    training: VerificationItemStatus
    overall: OverallVerificationStatus
  }
  contactEncrypted: boolean
  phoneNumber: string
  whatsappNumber: string
  email: string
  contactVisible: boolean
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}
