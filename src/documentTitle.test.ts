// @vitest-environment jsdom
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { router } from '@/router'
import { setLocale, SUPPORTED_LOCALES } from '@/i18n'
import { getLocalizedModules } from '@/i18n/home-catalog'
import { documentTitle } from './documentTitle'

const pages = router.getRoutes().filter((r) => r.components && !r.path.includes(':'))

describe('document titles', () => {
  it('gives every page a title in every language, translated where the English is not shared', () => {
    for (const route of pages) {
      const english = documentTitle(route.path, route.name, 'en')
      expect(english, route.path).toMatch(/Physica$/)
      for (const locale of SUPPORTED_LOCALES) {
        const title = documentTitle(route.path, route.name, locale)
        expect(title.trim(), `${route.path} ${locale}`).not.toBe('')
        if (locale !== 'en' && route.path !== '/') expect(title, `${route.path} ${locale}`).not.toBe(english)
      }
    }
  })

  it('uses the localized catalogue title for every experiment', () => {
    for (const locale of SUPPORTED_LOCALES) {
      for (const experiment of getLocalizedModules(locale).flatMap((m) => m.experiments)) {
        if (experiment.path) expect(documentTitle(experiment.path, undefined, locale)).toBe(`${experiment.title} · Physica`)
      }
    }
  })

  it('follows navigation and language changes', async () => {
    setLocale('en')
    await router.push('/learning')
    expect(document.title).toBe('Learning path · Physica')
    setLocale('ja')
    await nextTick()
    expect(document.title).toBe('学習ルート · Physica')
    await router.push('/time/pendulum')
    expect(document.title).toBe(documentTitle('/time/pendulum', 'pendulum', 'ja'))
    setLocale('en')
  })
})
