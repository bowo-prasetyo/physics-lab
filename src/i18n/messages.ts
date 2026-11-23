import type { Locale } from './locales'

export const messages = {
  en: {
    'app.brand.homeLabel': 'Physica home',
    'app.navigation.main': 'Main navigation',
    'app.navigation.forTeachers': 'For teachers',
    'app.footer.tagline': 'Open-source physics experiments for students',
    'app.language.label': 'Language',
    'app.theme.label': 'Theme',
    'app.theme.system': 'System',
    'app.theme.light': 'Light',
    'app.theme.dark': 'Dark',
  },
  id: {
    'app.brand.homeLabel': 'Beranda Physica',
    'app.navigation.main': 'Navigasi utama',
    'app.navigation.forTeachers': 'Untuk pengajar',
    'app.footer.tagline': 'Eksperimen fisika sumber terbuka untuk pelajar',
    'app.language.label': 'Bahasa',
    'app.theme.label': 'Tema',
    'app.theme.system': 'Sistem',
    'app.theme.light': 'Terang',
    'app.theme.dark': 'Gelap',
  },
  ja: {
    'app.brand.homeLabel': 'Physica ホーム',
    'app.navigation.main': 'メインナビゲーション',
    'app.navigation.forTeachers': '教員向け',
    'app.footer.tagline': '学生向けのオープンソース物理実験',
    'app.language.label': '言語',
    'app.theme.label': 'テーマ',
    'app.theme.system': 'システム設定',
    'app.theme.light': 'ライト',
    'app.theme.dark': 'ダーク',
  },
} as const

export type MessageKey = keyof (typeof messages)['en']

export function translate(locale: Locale, key: MessageKey): string {
  return messages[locale][key] ?? messages.en[key]
}
