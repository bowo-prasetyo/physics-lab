import { locale, type Locale } from '@/i18n'

const intlLocales: Record<Locale, string> = {
  en: 'en-US',
  id: 'id-ID',
  ja: 'ja-JP',
}

/** Format display numbers using the active language's regional conventions. */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(intlLocales[locale.value], options).format(value)
}

/** Format dates using the active language's regional conventions. */
export function formatDate(value: Date | number, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(intlLocales[locale.value], options).format(value)
}

/** Expose the resolved BCP 47 tag for APIs that need locale-aware formatting. */
export function getIntlLocale(): string {
  return intlLocales[locale.value]
}
