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

  it('builds a complete clock-comparison sentence in every locale and direction', async () => {
    const { localizeGravityClockComparison } = await import('./gravity-clocks-math')
    expect(localizeGravityClockComparison('0.25 s', true, 'en')).toBe('Clock B runs 0.25 s faster than clock A, and both observers agree.')
    expect(localizeGravityClockComparison('0,25 dtk', false, 'id')).toBe('Jam B berjalan 0,25 dtk lebih lambat daripada jam A, dan kedua pengamat sepakat.')
    expect(localizeGravityClockComparison('0.25 秒', true, 'ja')).toBe('時計 B は時計 A より 0.25 秒速く進み、両方の観測者が同じ結論になります。')
  })

  it('translates Schwarzschild, weak-field, GPS, and ADM terminology', () => {
    expect(localizeGravityClocksMathText('Schwarzschild radius', 'id')).toBe('Jari-jari Schwarzschild')
    expect(localizeGravityClocksMathText('The Schwarzschild metric', 'ja')).toBe('シュワルツシルト計量')
    expect(localizeGravityClocksMathText('GPS: two effects with opposite signs', 'id')).toContain('berlawanan')
    expect(localizeGravityClocksMathText('The lapse is the clock rate', 'ja')).toContain('ラプス関数')
  })
})
