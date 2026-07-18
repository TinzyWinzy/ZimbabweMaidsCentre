import type { MatchStatus } from './index'

export interface Match {
  id: string
  jobId: string
  workerId: string
  score: number
  reasons: string[]
  status: MatchStatus
  placementFeePaid: boolean
  connectionFeePaid: boolean
  rank: number
  createdAt: Date
  confirmedAt?: Date
}
