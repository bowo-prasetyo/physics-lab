// @vitest-environment jsdom
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import type { LocationQuery } from 'vue-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { IMPLEMENTED_EXPERIMENTS } from '@/modules'
import { router } from '@/router'
import { setLocale, type Locale } from '@/i18n'
import { useLevel } from '@/composables/useLevel'

/**
 * Numbers a page writes come in three kinds (CLAUDE.md, "Translation"): display
 * text follows the learner's language, link parameters are plain data, and
 * TeX keeps English digits.
 *
 * Share links: every experiment keeps its setup in the URL so a teacher can
 * send it. A link must read back to the same setup in every language. Numbers
 * in a link are data, not display text: 8848, never 8,848 or 8.848, which the
 * page cannot read back. A display formatter in a `write` once lost every
 * clock height of 1 000 m or more in "Gravity and clock rates".
 */
// jsdom lacks these browser APIs; the pages only use them for layout and scrolling.
window.matchMedia ??= ((query: string) => ({ matches: false, media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false })) as typeof window.matchMedia
window.scrollTo = (() => {}) as typeof window.scrollTo

type Sync = { write: () => Record<string, string>; read: (query: LocationQuery) => void }
let captured: Sync | null = null
vi.mock('@/composables/useQuerySync', async (original) => ({
  ...(await original<typeof import('@/composables/useQuerySync')>()),
  useQuerySync: (options: Sync) => {
    captured = options
  },
}))

/** A link value is a plain word (level, scenario, body…) or a plain JavaScript number. */
const PLAIN = /^(?:[a-z][a-z-]*|-?\d+(?:\.\d+)?(?:e[-+]?\d+)?)$/i
const LOCALES: Locale[] = ['en', 'id', 'ja']

async function render(path: string): Promise<string> {
  captured = null
  await router.push(path)
  await router.isReady()
  const record = router.currentRoute.value.matched.at(-1)
  const component = record?.components?.default
  const resolved = typeof component === 'function' ? ((await (component as () => Promise<{ default: unknown }>)()).default) : component
  const app = createSSRApp({ render: () => h(resolved as never) })
  app.use(router)
  return renderToString(app)
}

async function syncFor(path: string): Promise<Sync> {
  await render(path)
  if (!captured) throw new Error(`${path} does not keep its setup in the URL`)
  return captured
}

afterEach(() => {
  setLocale('en')
  useLevel().value = 'beginner'
})

describe('share links read back to the same setup in every language', () => {
  it.each(IMPLEMENTED_EXPERIMENTS.map((e) => e.path))('%s', async (path) => {
    const sync = await syncFor(path)
    for (const locale of LOCALES) {
      setLocale(locale)
      const query = sync.write()
      for (const [key, value] of Object.entries(query)) expect(value, `${path} ${locale} ${key}`).toMatch(PLAIN)
      sync.read(query)
      expect(sync.write(), `${path} ${locale}: write → read → write`).toEqual(query)
    }
  })
})

describe('maths keeps English digits in every language', () => {
  it.each(IMPLEMENTED_EXPERIMENTS.map((e) => e.path))('%s', async (path) => {
    setLocale('id')
    useLevel().value = 'advanced'
    const html = await render(path)
    const tex = [...html.matchAll(/<annotation encoding="application\/x-tex">([\s\S]*?)<\/annotation>/g)].map((m) => m[1] ?? '')
    // A decimal comma between digits; TeX's own {,} thousands separator and "1, \cos" argument lists do not match.
    expect(tex.filter((t) => /\d,\d/.test(t)), path).toEqual([])
  })
})
