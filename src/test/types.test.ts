import { describe, it, expect } from 'vitest'
import type { UserRole, JobStatus, MatchStatus, PaymentStatus, PaymentMethod, PaymentType, VerificationType, VerificationItemStatus, OverallVerificationStatus } from '@/types'

describe('type definitions', () => {
  it('has correct UserRole values', () => {
    const roles: UserRole[] = ['employer', 'worker', 'admin', 'verifier']
    expect(roles).toContain('employer')
    expect(roles).toContain('worker')
    expect(roles).toContain('admin')
    expect(roles).toContain('verifier')
  })

  it('has correct JobStatus values', () => {
    const statuses: JobStatus[] = ['draft', 'active', 'filled', 'expired']
    expect(statuses).toHaveLength(4)
  })

  it('has correct MatchStatus values', () => {
    const statuses: MatchStatus[] = ['pending', 'confirmed', 'completed', 'cancelled']
    expect(statuses).toHaveLength(4)
  })

  it('has correct PaymentStatus values', () => {
    const statuses: PaymentStatus[] = ['pending', 'success', 'failed', 'refunded']
    expect(statuses).toHaveLength(4)
  })

  it('has correct PaymentMethod values', () => {
    const methods: PaymentMethod[] = ['paynow', 'ecocash']
    expect(methods).toHaveLength(2)
  })

  it('has correct PaymentType values', () => {
    const types: PaymentType[] = ['placement_fee', 'connection_fee', 'retainer', 'refund']
    expect(types).toHaveLength(4)
  })

  it('has correct VerificationType values', () => {
    const types: VerificationType[] = ['kyc', 'background', 'reference', 'training']
    expect(types).toHaveLength(4)
  })

  it('has correct VerificationItemStatus values', () => {
    const statuses: VerificationItemStatus[] = ['pending', 'approved', 'rejected']
    expect(statuses).toHaveLength(3)
  })

  it('has correct OverallVerificationStatus values', () => {
    const statuses: OverallVerificationStatus[] = ['pending', 'verified', 'fully_verified']
    expect(statuses).toHaveLength(3)
  })
})
