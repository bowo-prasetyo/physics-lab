import { describe, expect, it } from 'vitest'
import { localizeGravityClocksMathText, GRAVITY_CLOCKS_MATH_TRANSLATION_KEYS } from './gravity-clocks-math'

describe('Gravity Clocks mathematics localization', () => {
  it('preserves the English source copy', () => {
    for (const key of GRAVITY_CLOCKS_MATH_TRANSLATION_KEYS) {
      expect(localizeGravityClocksMathText(key, 'en')).toBe(key)
    }
  })

  it('provides non-empty Indonesian and Japanese translations for every entry', () => {
    expect(GRAVITY_CLOCKS_MATH_TRANSLATION_KEYS.length).toBeGreaterThan(30)
    for (const key of GRAVITY_CLOCKS_MATH_TRANSLATION_KEYS) {
      for (const locale of ['id', 'ja'] as const) {
        const translated = localizeGravityClocksMathText(key, locale)
        expect(translated.trim(), `${locale}: ${key}`).not.toBe('')
        expect(translated, `${locale}: ${key}`).not.toBe(key)
      }
    }
  })

  it('translates Schwarzschild, weak-field, GPS, and ADM terminology', () => {
    expect(localizeGravityClocksMathText('Schwarzschild radius', 'id')).toBe('Jari-jari Schwarzschild')
    expect(localizeGravityClocksMathText('The Schwarzschild metric', 'ja')).toBe('シュワルツシルト計量')
    expect(localizeGravityClocksMathText('GPS: two effects with opposite signs', 'id')).toContain('berlawanan')
    expect(localizeGravityClocksMathText('The lapse is the clock rate', 'ja')).toContain('ラプス関数')
  })
})
