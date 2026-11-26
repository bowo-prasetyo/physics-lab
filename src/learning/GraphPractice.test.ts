// @vitest-environment jsdom
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it } from 'vitest'
import { setLocale, type Locale } from '@/i18n'
import { getLearningPath } from './learning-content'
import GraphPractice from './GraphPractice.vue'

async function render(locale: Locale, step = '/space/space-vs-time'): Promise<string> {
  setLocale(locale)
  const path = getLearningPath(locale)
  const exercise = path.chapters.flatMap((c) => c.steps).find((s) => s.path === step)!.graphs[0]!
  const app = createSSRApp({ render: () => h(GraphPractice, { exercise, questions: exercise.questions, ui: path.ui, seed: 7, levelTag: () => null }) })
  return renderToString(app)
}

describe('graph practice', () => {
  afterEach(() => setLocale('en'))

  it('draws the graph with the experiments’ component and lists its corner points', async () => {
    const html = await render('en')
    expect(html).toContain('Graph of position x against time t.')
    expect(html).toContain('Corner points of the graph')
    const cells = [...html.matchAll(/<td[^>]*>([^<]*)<\/td>/g)].map((m) => m[1]).slice(-8)
    expect(cells).toEqual(['0', '2', '4', '6', '0', '4', '4', '0']) // corner points: times, then positions
    expect(html).toContain('What is the object’s velocity from 0 s to 2 s?')
  })

  it('is fully translated, including the graph’s accessible description', async () => {
    for (const locale of ['id', 'ja'] as const) {
      const html = await render(locale)
      const label = html.match(/role="img" aria-label="([^"]*)"/)![1]!
      expect(label, locale).not.toMatch(/\b(against|Graph|current run)\b/)
    }
    expect(await render('id')).toContain('Membaca grafik posisi–waktu')
    expect(await render('ja')).toContain('位置–時間グラフを読み取る')
  })

  it('draws model curves on labelled scales, with a table of values from the engine', async () => {
    const html = await render('en', '/time/pendulum')
    expect(html).toContain('Read a period–length graph')
    expect(html).toContain('aria-label="Graph of Period (s) against Length (m)."')
    for (const tick of ['0.5', '1.5', '2.5']) expect(html).toMatch(new RegExp(`class="tick[^"]*"[^>]*>${tick.replace('.', '\\.')}<`))
    expect(html).toContain('Values on the curve')
    expect(html).toMatch(/<td[^>]*>1\.42<\/td>/) // T(0.5 m)
    expect(html).toMatch(/<td[^>]*>2\.84<\/td>/) // T(2 m)
  })

  it('translates model-curve graphs completely, including their accessible description', async () => {
    for (const [locale, label] of [['id', 'Grafik Percepatan (m/s²) terhadap Gaya resultan (N).'], ['ja', '合力 (N) に対する 加速度 (m/s²) のグラフ。']] as const) {
      const html = await render(locale, '/mechanics/force-lab')
      expect(html).toContain(`aria-label="${label}"`)
      expect(html).not.toMatch(/\b(against|versus|Values on the curve)\b/)
    }
  })

  it('never shows values in its reading guide, which would answer the questions (all graphs, every language)', async () => {
    for (const locale of ['en', 'id', 'ja'] as const) {
      for (const step of ['/space/space-vs-time', '/mechanics/force-lab', '/mechanics/projectile', '/time/pendulum']) {
        const html = await render(locale, step)
        const start = html.lastIndexOf('<aside', html.indexOf('class="interpretation-guide"'))
        const guide = html.slice(start, html.indexOf('</aside>', start))
        expect(guide.length, `${locale} ${step}`).toBeGreaterThan(0)
        expect(guide.replace(/<[^>]*>/g, ''), `${locale} ${step}`).not.toMatch(/\d/)
      }
    }
  })
})
