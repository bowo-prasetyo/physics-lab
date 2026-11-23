import type { Locale } from './locales'

/** Locale-aware wording for the moving observer's simultaneity readout. */
export function localizeMovingClocksSimultaneityLabel(other: string, home: string, locale: Locale): string {
  if (locale === 'id') return `Waktu “sekarang” ${other} bertemu dengan jam ${home} pada`
  if (locale === 'ja') return `${other}の「現在」が${home}の時計と一致する時刻は`
  return `The ${other}’s “now” meets the ${home} clock at`
}
