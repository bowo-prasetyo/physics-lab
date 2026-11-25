import { getLocalizedModules } from '@/i18n/home-catalog'
import type { Locale } from '@/i18n/locales'
import { translate, type MessageKey } from '@/i18n/messages'

const BRAND = 'Physica'

/** Pages that are not experiments, by route name. */
const PAGE_TITLE_KEYS: Readonly<Record<string, MessageKey>> = {
  learning: 'page.title.learning',
  teachers: 'page.title.teachers',
  'assessment-pilot': 'page.title.assessmentPilot',
}

/**
 * The browser-tab title for a route in one language. Experiment pages use
 * their title from the localized catalogue, so the tab always matches the
 * home page and the learning path; other pages use a translated message.
 */
export function documentTitle(path: string, routeName: unknown, locale: Locale): string {
  for (const module of getLocalizedModules(locale)) {
    const experiment = module.experiments.find((e) => e.path === path)
    if (experiment) return `${experiment.title} · ${BRAND}`
  }
  const key = typeof routeName === 'string' ? PAGE_TITLE_KEYS[routeName] : undefined
  return key ? `${translate(locale, key)} · ${BRAND}` : BRAND
}
