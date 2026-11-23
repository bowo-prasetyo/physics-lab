import { describe, expect, it } from 'vitest'
import { DEFAULT_LOCALE, detectLocale, isLocale } from './locales'
import { translate } from './messages'

describe('locale configuration', () => {
  it('recognizes only supported locale identifiers', () => {
    expect(isLocale('en')).toBe(true)
    expect(isLocale('id')).toBe(true)
    expect(isLocale('ja')).toBe(true)
    expect(isLocale('fr')).toBe(false)
    expect(isLocale(null)).toBe(false)
  })

  it('detects supported browser languages in preference order', () => {
    expect(detectLocale(['fr-FR', 'id-ID', 'ja-JP'])).toBe('id')
    expect(detectLocale(['ja-JP', 'en-US'])).toBe('ja')
    expect(detectLocale(['en-GB'])).toBe('en')
  })

  it('falls back to English when no browser language is supported', () => {
    expect(detectLocale(['fr-FR', 'de-DE'])).toBe(DEFAULT_LOCALE)
  })

  it('returns the English fallback for an incomplete translation catalog', () => {
    expect(translate('id', 'app.navigation.forTeachers')).toBe('Untuk pengajar')
  })
})
