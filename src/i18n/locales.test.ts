import { describe, expect, it } from 'vitest'
import { DEFAULT_LOCALE, detectLocale, isLocale, SUPPORTED_LOCALES } from './locales'
import { messages, translate } from './messages'

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

  it('provides shell messages for every supported locale', () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(messages[locale]['app.language.label']).toBeTruthy()
      expect(messages[locale]['app.navigation.forTeachers']).toBeTruthy()
    }
  })

  it('returns the selected locale message', () => {
    expect(translate('id', 'app.navigation.forTeachers')).toBe('Untuk pengajar')
    expect(translate('ja', 'app.navigation.forTeachers')).toBe('教員向け')
  })
})
