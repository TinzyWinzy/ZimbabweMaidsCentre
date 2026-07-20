import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'

describe('utils', () => {
  describe('formatCurrency', () => {
    it('formats USD currency correctly', () => {
      const result = formatCurrency(1000, 'USD')
      expect(result).toContain('1,000')
    })

    it('formats ZWL currency correctly', () => {
      const result = formatCurrency(500, 'ZWL')
      expect(result).toContain('500')
    })
  })

  describe('formatDate', () => {
    it('formats a date string', () => {
      const result = formatDate('2024-06-15')
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })
  })

  describe('getInitials', () => {
    it('returns initials from a full name', () => {
      expect(getInitials('John Doe')).toBe('JD')
    })

    it('handles single name', () => {
      expect(getInitials('John')).toBe('J')
    })

    it('handles multiple spaces', () => {
      expect(getInitials('John Michael Doe')).toBe('JM')
    })
  })
})
