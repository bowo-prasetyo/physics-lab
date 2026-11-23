import { ref, watch } from 'vue'
import { DEFAULT_LOCALE, detectLocale, isLocale, type Locale } from './locales'
import { translate, type MessageKey } from './messages'

const STORAGE_KEY = 'physica-locale'

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // Storage can be unavailable in private browsing or restricted environments.
  }

  return detectLocale(window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language])
}

export const locale = ref<Locale>(readInitialLocale())

watch(locale, (nextLocale) => {
  if (typeof document !== 'undefined') document.documentElement.lang = nextLocale

  try {
    window.localStorage.setItem(STORAGE_KEY, nextLocale)
  } catch {
    // The selected language remains active for this session.
  }
}, { immediate: true })

export function setLocale(nextLocale: Locale): void {
  locale.value = nextLocale
}

export function t(key: MessageKey): string {
  return translate(locale.value, key)
}

export { DEFAULT_LOCALE, LOCALE_OPTIONS, SUPPORTED_LOCALES, isLocale } from './locales'
export type { Locale } from './locales'
export type { MessageKey } from './messages'
