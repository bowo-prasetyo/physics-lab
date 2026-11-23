// @vitest-environment jsdom
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createSSRApp, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import App from '@/App.vue'
import { router } from '@/router'
import { setLocale, SUPPORTED_LOCALES, type Locale } from './index'

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/teachers', name: 'teachers' },
  { path: '/mechanics/newtonian', name: 'newtonian' },
  { path: '/space/space-vs-time', name: 'space-vs-time' },
  { path: '/relativity/moving-clocks', name: 'moving-clocks' },
  { path: '/relativity/two-perspectives', name: 'two-perspectives' },
  { path: '/gravity/clock-rates', name: 'gravity-clocks' },
  { path: '/cosmology/evolving-space', name: 'evolving-space' },
  { path: '/mechanics/projectile', name: 'projectile' },
  { path: '/time/pendulum', name: 'pendulum' },
  { path: '/space/displacement-3d', name: 'displacement-3d' },
] as const

const INTENTIONALLY_SHARED_COPY = new Set(['English', 'Bahasa Indonesia', 'Physica', 'MIT License'])

const REVIEWED_ATTRIBUTES = [
  'aria-label',
  'aria-description',
  'aria-valuetext',
  'alt',
  'title',
  'placeholder',
] as const

type CopyRecord = {
  route: string
  locale: Locale
  kind: 'visible-text' | 'accessibility-attribute'
  attribute?: string
  text: string
}

function normalize(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function isEnglishLike(value: string): boolean {
  if (INTENTIONALLY_SHARED_COPY.has(value)) return false
  const words = value.match(/[A-Za-z]{3,}/g) ?? []
  if (words.length === 0 || value.length < 5) return false
  if (/^https?:\/\//i.test(value)) return false
  if (/^[A-Z\d\s._:+\/()–—-]+$/.test(value)) return false
  return true
}

/** Collect rendered copy, including labels that are not visible as text nodes. */
function collectRenderedCopy(markup: string, route: string, locale: Locale): CopyRecord[] {
  const container = document.createElement('div')
  container.innerHTML = markup
  const records: CopyRecord[] = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)

  while (walker.nextNode()) {
    const node = walker.currentNode
    const parent = node.parentElement
    if (!parent || parent.closest('script, style, pre, code, svg, math')) continue
    const text = normalize(node.textContent ?? '')
    if (isEnglishLike(text)) records.push({ route, locale, kind: 'visible-text', text })
  }

  for (const element of Array.from(container.querySelectorAll<HTMLElement>('*'))) {
    if (element.closest('script, style, pre, code, svg, math')) continue
    for (const attribute of REVIEWED_ATTRIBUTES) {
      const raw = element.getAttribute(attribute)
      if (!raw) continue
      const text = normalize(raw)
      if (isEnglishLike(text)) {
        records.push({ route, locale, kind: 'accessibility-attribute', attribute, text })
      }
    }
  }

  return records
}

function candidateKey(record: Pick<CopyRecord, 'kind' | 'attribute' | 'text'>): string {
  return [record.kind, record.attribute ?? '', record.text].join('::')
}

describe('runtime localization audit', () => {
  it('renders every application route in every supported locale and reports unchanged English copy', async () => {
    document.body.innerHTML = ''
    window.matchMedia ??= ((media: string) => ({
      matches: false,
      media,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    })) as typeof window.matchMedia
    const root = document.createElement('div')
    document.body.append(root)

    const app = createSSRApp(App)
    app.use(router)
    await router.isReady()

    const snapshots = new Map<string, CopyRecord[]>()
    let renderedPages = 0

    try {
      for (const route of ROUTES) {
        await router.push(route.path)
        await nextTick()

        for (const locale of SUPPORTED_LOCALES) {
          setLocale(locale)
          await nextTick()
          const markup = await renderToString(app)
          expect(markup.length, `Expected rendered markup for ${route.name} (${locale})`).toBeGreaterThan(0)
          snapshots.set(`${route.name}:${locale}`, collectRenderedCopy(markup, route.name, locale))
          renderedPages += 1
        }
      }
    } finally {
      app.unmount()
      setLocale('en')
      root.remove()
    }

    const candidates: Array<{
      route: string
      locale: Exclude<Locale, 'en'>
      kind: CopyRecord['kind']
      attribute?: string
      text: string
    }> = []

    for (const route of ROUTES) {
      const english = snapshots.get(`${route.name}:en`) ?? []
      const englishKeys = new Set(english.map(candidateKey))

      for (const locale of ['id', 'ja'] as const) {
        const localized = snapshots.get(`${route.name}:${locale}`) ?? []
        const seen = new Set<string>()

        for (const record of localized) {
          const key = candidateKey(record)
          if (!englishKeys.has(key) || seen.has(key)) continue
          seen.add(key)
          candidates.push({
            route: route.name,
            locale,
            kind: record.kind,
            ...(record.attribute ? { attribute: record.attribute } : {}),
            text: record.text,
          })
        }
      }
    }

    const report = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      scope: 'Rendered Vue application copy and selected accessibility attributes across all registered routes and supported locales.',
      locales: [...SUPPORTED_LOCALES],
      routes: ROUTES.map(({ path, name }) => ({ path, name })),
      summary: {
        renderedPages,
        routeCount: ROUTES.length,
        localeCount: SUPPORTED_LOCALES.length,
        unchangedEnglishCandidates: candidates.length,
        routesWithCandidates: new Set(candidates.map((item) => item.route)).size,
      },
      interpretation: 'Candidates are review leads, not confirmed translation defects. Shared scientific terms, proper nouns, formulas, and intentionally identical labels may appear. Review each item in context.',
      limitations: [
        'The audit renders the initial route state; it does not exhaustively trigger every control, animation, prediction, or query-string state.',
        'Text drawn directly into Canvas or WebGL surfaces is not represented in the DOM and requires a separate visual review.',
        'Only visible text nodes and selected accessibility attributes are compared; remote content and browser-native UI are outside the scan.',
      ],
      candidates,
    }

    const outputDir = resolve(process.cwd(), 'artifacts')
    await mkdir(outputDir, { recursive: true })
    await writeFile(resolve(outputDir, 'localization-runtime-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8')

    const lines = [
      '# Runtime localization audit',
      '',
      `Generated: ${report.generatedAt}`,
      '',
      '## Summary',
      '',
      `- Routes rendered: ${report.summary.routeCount}`,
      `- Locales checked: ${report.summary.localeCount}`,
      `- Route/locale renders: ${report.summary.renderedPages}`,
      `- Unchanged-English candidates: ${report.summary.unchangedEnglishCandidates}`,
      `- Routes containing candidates: ${report.summary.routesWithCandidates}`,
      '',
      '> Candidates are review leads, not confirmed translation defects. Shared scientific terms, proper nouns, formulas, and intentionally identical labels may appear.',
      '',
      '## Candidates',
      '',
    ]

    if (candidates.length === 0) lines.push('No unchanged-English candidates were found.')
    for (const candidate of candidates) {
      const detail = candidate.attribute ? ` (${candidate.attribute})` : ''
      lines.push(`- **${candidate.route} / ${candidate.locale}** — ${candidate.kind}${detail}: ${candidate.text}`)
    }
    lines.push('', '## Limitations', '', ...report.limitations.map((item) => `- ${item}`))
    await writeFile(resolve(outputDir, 'localization-runtime-audit.md'), `${lines.join('\n')}\n`, 'utf8')

    console.info('Runtime localization audit: ' + renderedPages + ' route/locale renders; ' + candidates.length + ' unchanged-English candidates across ' + report.summary.routesWithCandidates + ' routes.')
    expect(renderedPages).toBe(ROUTES.length * SUPPORTED_LOCALES.length)
  }, 120_000)
})
