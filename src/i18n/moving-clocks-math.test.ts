import { describe, expect, it } from 'vitest'
import { localizeMovingClocksMathText, MOVING_CLOCKS_MATH_TRANSLATION_KEYS } from './moving-clocks-math'

describe('Moving Clocks mathematics localization', () => {
  it('preserves the English source copy', () => {
    for (const key of MOVING_CLOCKS_MATH_TRANSLATION_KEYS) {
      expect(localizeMovingClocksMathText(key, 'en')).toBe(key)
    }
  })

  it('provides non-empty Indonesian and Japanese copy for every catalogue entry', () => {
    expect(MOVING_CLOCKS_MATH_TRANSLATION_KEYS.length).toBeGreaterThan(50)
    for (const key of MOVING_CLOCKS_MATH_TRANSLATION_KEYS) {
      for (const locale of ['id', 'ja'] as const) {
        const translated = localizeMovingClocksMathText(key, locale)
        expect(translated.trim(), `${locale}: ${key}`).not.toBe('')
        expect(translated, `${locale}: ${key}`).not.toBe(key)
      }
    }
  })

  it('translates terminology and the dynamic speed-table label', () => {
    expect(localizeMovingClocksMathText('worldline', 'id')).toBe('garis dunia')
    expect(localizeMovingClocksMathText('worldline', 'ja')).toBe('世界線')
    expect(localizeMovingClocksMathText('Airliner (250 m/s)', 'id')).toContain('Pesawat')
    expect(localizeMovingClocksMathText('Airliner (250 m/s)', 'ja')).toContain('旅客機')
  })
})
