import { describe, expect, it } from 'vitest'
import { EVOLVING_SPACE_MATH_TRANSLATION_KEYS, localizeEvolvingSpaceMathText } from './evolving-space-math'

describe('Evolving Space mathematics localization', () => {
  it('preserves English source copy', () => {
    for (const key of EVOLVING_SPACE_MATH_TRANSLATION_KEYS) {
      expect(localizeEvolvingSpaceMathText(key, 'en')).toBe(key)
    }
  })

  it('provides Indonesian and Japanese translations for every entry', () => {
    expect(EVOLVING_SPACE_MATH_TRANSLATION_KEYS.length).toBeGreaterThan(40)
    for (const key of EVOLVING_SPACE_MATH_TRANSLATION_KEYS) {
      for (const locale of ['id', 'ja'] as const) {
        const translated = localizeEvolvingSpaceMathText(key, locale)
        expect(translated.trim(), `${locale}: ${key}`).not.toBe('')
        expect(translated, `${locale}: ${key}`).not.toBe(key)
      }
    }
  })

  it('covers cosmology concepts and interpretive explanations', () => {
    expect(localizeEvolvingSpaceMathText('The Friedmann equation', 'id')).toBe('Persamaan Friedmann')
    expect(localizeEvolvingSpaceMathText('The FLRW metric: space evolving in time', 'ja')).toContain('FLRW計量')
    expect(localizeEvolvingSpaceMathText('problem of time', 'ja')).toBe('時間の問題')
  })
})
