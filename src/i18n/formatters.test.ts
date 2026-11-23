import { afterEach, describe, expect, it } from 'vitest'
import { formatNumber, getIntlLocale } from './formatters'
import { setLocale } from './index'

afterEach(() => setLocale('en'))

describe('locale-aware formatters', () => {
  it('uses the active locale for number formatting', () => {
    setLocale('id')
    expect(getIntlLocale()).toBe('id-ID')
    expect(formatNumber(1234.5)).toBe('1.234,5')
  })

  it('formats Japanese numbers using Japanese regional conventions', () => {
    setLocale('ja')
    expect(getIntlLocale()).toBe('ja-JP')
    expect(formatNumber(1234.5)).toBe('1,234.5')
    expect(formatNumber(3.71, { maximumFractionDigits: 2 })).toBe('3.71')
  })

  it('localizes decimal separators in experiment measurements', () => {
    setLocale('id')
    expect(formatNumber(3.71, { maximumFractionDigits: 2 })).toBe('3,71')
    expect(formatNumber(5, { minimumFractionDigits: 1, maximumFractionDigits: 1 })).toBe('5,0')
  })
})
