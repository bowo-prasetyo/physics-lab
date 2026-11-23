import type { Locale } from './locales'

const localeTags: Record<Locale, string> = {
  en: 'en-US',
  id: 'id-ID',
  ja: 'ja-JP',
}

/** Locale-aware wording for the moving observer's simultaneity readout. */
export function localizeMovingClocksSimultaneityLabel(other: string, home: string, locale: Locale): string {
  if (locale === 'id') return `Waktu “sekarang” ${other} bertemu dengan jam ${home} pada`
  if (locale === 'ja') return `${other}の「現在」が${home}の時計と一致する時刻は`
  return `The ${other}’s “now” meets the ${home} clock at`
}

/** Translate the frame name used in the spacetime diagram's live annotations. */
export function localizeMovingClocksFrameName(frame: 'earth' | 'ship', locale: Locale): string {
  if (locale === 'id') return frame === 'earth' ? 'Bumi' : 'kapal'
  if (locale === 'ja') return frame === 'earth' ? '地球' : '宇宙船'
  return frame === 'earth' ? 'the Earth' : 'the ship'
}

/** Build the changing simultaneity annotation as a complete localized phrase. */
export function localizeMovingClocksNowLabel(other: 'Earth' | 'ship', locale: Locale): string {
  if (locale === 'id') return other === 'Earth' ? 'Waktu “sekarang” Bumi' : 'Waktu “sekarang” kapal'
  if (locale === 'ja') return other === 'Earth' ? '地球の「現在」' : '宇宙船の「現在」'
  return `The ${other}’s “now”`
}

/** Build the clock-intersection annotation with locale-aware number formatting. */
export function localizeMovingClocksMeetingLabel(home: 'Earth' | 'ship', time: number, locale: Locale): string {
  const formatted = new Intl.NumberFormat(localeTags[locale], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(time)
  if (locale === 'id') return `Jam ${home === 'Earth' ? 'Bumi' : 'kapal'}: ${formatted} dtk`
  if (locale === 'ja') return `${home === 'Earth' ? '地球' : '宇宙船'}の時計：${formatted} 秒`
  return `${home} clock ${formatted} s`
}
