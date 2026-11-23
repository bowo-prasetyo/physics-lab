export const DEFAULT_LOCALE = 'en' as const

export const SUPPORTED_LOCALES = ['en', 'id', 'ja'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_OPTIONS: ReadonlyArray<{ value: Locale; label: string; nativeLabel: string }> = [
  { value: 'en', label: 'English', nativeLabel: 'English' },
  { value: 'id', label: 'Indonesian', nativeLabel: 'Bahasa Indonesia' },
  { value: 'ja', label: 'Japanese', nativeLabel: '日本語' },
]

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && SUPPORTED_LOCALES.some((locale) => locale === value)
}

/** Resolve browser language preferences to one of the locales shipped by Physica. */
export function detectLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const normalized = language.toLowerCase()
    if (normalized === 'id' || normalized.startsWith('id-')) return 'id'
    if (normalized === 'ja' || normalized.startsWith('ja-')) return 'ja'
    if (normalized === 'en' || normalized.startsWith('en-')) return 'en'
  }
  return DEFAULT_LOCALE
}
