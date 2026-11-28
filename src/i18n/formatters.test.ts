import { afterEach, describe, expect, it } from 'vitest'
import { coordinates, fixed, formatNumber, getIntlLocale, localizeNumerals } from './formatters'
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

describe('numbers a learner reads', () => {
  it('fixed() keeps a set number of decimals in the active language', () => {
    expect(fixed(0.9286, 3)).toBe('0.929')
    setLocale('id')
    expect(fixed(0.9286, 3)).toBe('0,929')
    expect(fixed(2, 2)).toBe('2,00')
  })

  it('localizeNumerals() rewrites the numbers inside a formatted string, and nothing else', () => {
    expect(localizeNumerals('6.96 × 10⁻¹⁰, 1,234 km')).toBe('6.96 × 10⁻¹⁰, 1,234 km')
    setLocale('id')
    expect(localizeNumerals('6.96 × 10⁻¹⁰')).toBe('6,96 × 10⁻¹⁰')
    expect(localizeNumerals('+83.4 ns')).toBe('+83,4 ns')
    expect(localizeNumerals('1,234 km')).toBe('1.234 km')
    expect(localizeNumerals('Clock A, then B.')).toBe('Clock A, then B.')
    setLocale('ja')
    expect(localizeNumerals('83.4 ns')).toBe('83.4 ns')
  })

  it('coordinates() keeps decimal commas unambiguous', () => {
    expect(coordinates('0.50', '2.00')).toBe('(0.50, 2.00)')
    setLocale('id')
    expect(coordinates('0,50', '2,00')).toBe('(0,50; 2,00)')
  })
})
