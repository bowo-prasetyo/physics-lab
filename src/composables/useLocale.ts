import { computed } from 'vue'
import { locale, LOCALE_OPTIONS, setLocale, t, type Locale } from '@/i18n'

/** Access the application-wide language preference and translation function. */
export function useLocale() {
  const selectedLocale = computed({
    get: () => locale.value,
    set: (value: Locale) => setLocale(value),
  })

  return {
    locale: selectedLocale,
    locales: LOCALE_OPTIONS,
    setLocale,
    t,
  }
}
