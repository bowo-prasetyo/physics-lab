import { describe, expect, it } from 'vitest'
import {
  localizeTwoPerspectivesMathText,
  TWO_PERSPECTIVES_MATH_TRANSLATION_KEYS,
} from './two-perspectives-math'

describe('Two Perspectives mathematics localization', () => {
  it('preserves the English source copy', () => {
    for (const key of TWO_PERSPECTIVES_MATH_TRANSLATION_KEYS) {
      expect(localizeTwoPerspectivesMathText(key, 'en')).toBe(key)
    }
  })

  it('provides non-empty Indonesian and Japanese translations for every entry', () => {
    expect(TWO_PERSPECTIVES_MATH_TRANSLATION_KEYS.length).toBeGreaterThan(35)
    for (const key of TWO_PERSPECTIVES_MATH_TRANSLATION_KEYS) {
      for (const locale of ['id', 'ja'] as const) {
        const translated = localizeTwoPerspectivesMathText(key, locale)
        expect(translated.trim(), `${locale}: ${key}`).not.toBe('')
        expect(translated, `${locale}: ${key}`).not.toBe(key)
      }
    }
  })

  it('translates key relativity and ADM terminology', () => {
    expect(localizeTwoPerspectivesMathText('Simultaneity', 'id')).toBe('Keserentakan')
    expect(localizeTwoPerspectivesMathText('and', 'ja')).toBe('と')
    expect(localizeTwoPerspectivesMathText('Spacetime', 'ja')).toBe('時空')
    expect(localizeTwoPerspectivesMathText('Looking ahead: the 3 + 1 split in general relativity', 'id')).toContain('relativitas umum')
  })
})
