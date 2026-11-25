// @vitest-environment jsdom
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it } from 'vitest'
import { setLocale, type Locale } from '@/i18n'
import { getLearningPath } from './learning-content'
import GraphPractice from './GraphPractice.vue'

async function render(locale: Locale): Promise<string> {
  setLocale(locale)
  const path = getLearningPath(locale)
  const exercise = path.chapters[0]!.steps.find((s) => s.path === '/space/space-vs-time')!.graphs[0]!
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
})
