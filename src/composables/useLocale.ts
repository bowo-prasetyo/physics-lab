import { locale, LOCALE_OPTIONS, setLocale, t, type Locale } from '@/i18n'

/** Access the application-wide language preference and translation function. */
export function useLocale() {
  return {
    locale,
    locales: LOCALE_OPTIONS,
    setLocale: (value: Locale) => setLocale(value),
    t,
  }
}
