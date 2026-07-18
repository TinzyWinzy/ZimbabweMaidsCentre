import type { VerificationItemStatus, VerificationType } from './index'

export interface VerificationRecord {
  id: string
  workerId: string
  type: VerificationType
  status: VerificationItemStatus
  documents: string[]
  reviewerNotes: string
  reviewedBy: string | null
  createdAt: Date
  reviewedAt: Date | null
}
