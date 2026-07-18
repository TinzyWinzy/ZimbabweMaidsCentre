export type UserRole = 'employer' | 'worker' | 'admin' | 'verifier'

export interface UserData {
  uid: string
  email: string | null
  phoneNumber: string | null
  displayName: string | null
  photoURL: string | null
  role: UserRole
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export type JobStatus = 'draft' | 'active' | 'filled' | 'expired'
export type MatchStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded'
export type PaymentMethod = 'paynow' | 'ecocash'
export type PaymentType = 'placement_fee' | 'connection_fee' | 'retainer' | 'refund'
export type VerificationType = 'kyc' | 'background' | 'reference' | 'training'
export type VerificationItemStatus = 'pending' | 'approved' | 'rejected'
export type OverallVerificationStatus = 'pending' | 'verified' | 'fully_verified'
