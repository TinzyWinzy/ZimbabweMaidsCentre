import type { PaymentMethod, PaymentStatus, PaymentType } from './index'

export interface Payment {
  id: string
  userId: string
  type: PaymentType
  amount: number
  currency: 'USD' | 'ZWL'
  matchId?: string
  method: PaymentMethod
  status: PaymentStatus
  gatewayReference: string | null
  createdAt: Date
  updatedAt: Date
}
