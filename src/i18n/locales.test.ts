import { describe, expect, it } from 'vitest'
import { DEFAULT_LOCALE, detectLocale, isLocale, SUPPORTED_LOCALES } from './locales'
import { messages, translate } from './messages'
import { getLocalizedModules } from './home-catalog'

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

  it('keeps the same interface message keys in every locale', () => {
    const englishKeys = Object.keys(messages.en).sort()
    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(messages[locale]).sort()).toEqual(englishKeys)
      expect(Object.values(messages[locale]).every(Boolean)).toBe(true)
    }
  })

  it('returns the selected locale message', () => {
    expect(translate('id', 'app.navigation.forTeachers')).toBe('Untuk pengajar')
    expect(translate('ja', 'app.navigation.forTeachers')).toBe('教員向け')
  })

  it('provides a localized catalogue for all six modules and nine experiments', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const modules = getLocalizedModules(locale)
      expect(modules).toHaveLength(6)
      expect(modules.reduce((count, module) => count + module.experiments.length, 0)).toBe(9)
      expect(modules.every(module => module.title.length > 0 && module.audience.length > 0)).toBe(true)
    }
  })
})
