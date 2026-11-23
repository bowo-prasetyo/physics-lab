import { describe, expect, it } from 'vitest'
import { localizeSpaceVsTimeMathText, SPACE_VS_TIME_MATH_TRANSLATION_KEYS } from './space-vs-time-math'

describe('Space vs Time mathematics localization', () => {
  it('preserves the English source copy', () => {
    for (const key of SPACE_VS_TIME_MATH_TRANSLATION_KEYS) {
      expect(localizeSpaceVsTimeMathText(key, 'en')).toBe(key)
    }
  })

  it('provides non-empty Indonesian and Japanese copy for every catalogue entry', () => {
    expect(SPACE_VS_TIME_MATH_TRANSLATION_KEYS.length).toBeGreaterThan(45)
    for (const key of SPACE_VS_TIME_MATH_TRANSLATION_KEYS) {
      for (const locale of ['id', 'ja'] as const) {
        const translated = localizeSpaceVsTimeMathText(key, locale)
        expect(translated.trim(), `${locale}: ${key}`).not.toBe('')
        expect(translated, `${locale}: ${key}`).not.toBe(key)
      }
    }
  })

  it('translates core physics terminology', () => {
    expect(localizeSpaceVsTimeMathText('worldline', 'id')).toBe('garis dunia')
    expect(localizeSpaceVsTimeMathText('worldline', 'ja')).toBe('世界線')
    expect(localizeSpaceVsTimeMathText('Displacement and distance', 'id')).toBe('Perpindahan dan jarak tempuh')
  })
})
