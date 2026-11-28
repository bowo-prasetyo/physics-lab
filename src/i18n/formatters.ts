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

/**
 * A number with a fixed count of decimals, in the active language's format
 * (0.93 in English, 0,93 in Indonesian). Use it for every number a learner
 * reads; keep Number.toFixed for SVG coordinates and TeX.
 */
export function fixed(value: number, digits: number): string {
  return formatNumber(value, { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

function separators(): { decimal: string; group: string } {
  const parts = new Intl.NumberFormat(getIntlLocale()).formatToParts(12345.6)
  return { decimal: parts.find((p) => p.type === 'decimal')?.value ?? '.', group: parts.find((p) => p.type === 'group')?.value ?? ',' }
}

/**
 * Rewrite the numbers in an English-formatted string (decimal point, comma
 * thousands) for the active language, e.g. "83.4 ns" → "83,4 ns" in Indonesian.
 * For helpers that build whole strings, such as "6.96 × 10⁻¹⁰" or "1,234 km".
 */
export function localizeNumerals(text: string): string {
  const { decimal, group } = separators()
  if (decimal === '.' && group === ',') return text
  return text.replace(/\d[\d,]*(?:\.\d+)?/g, (n) => n.replace(/[.,]/g, (c) => (c === '.' ? decimal : group)))
}

/** A coordinate pair or list, separated so that decimal commas stay unambiguous: (0.5, 2) or (0,5; 2). */
export function coordinates(...values: string[]): string {
  return `(${values.join(separators().decimal === ',' ? '; ' : ', ')})`
}
