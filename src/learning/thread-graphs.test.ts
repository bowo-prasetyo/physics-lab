// @vitest-environment jsdom
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it } from 'vitest'
import { setLocale, type Locale } from '@/i18n'
import { getLearningPath } from './learning-content'
import GraphPractice from './GraphPractice.vue'

const cases = [
  ['/relativity/two-perspectives', 'velocity-addition'],
  ['/relativity/two-perspectives', 'relativistic-momentum'],
  ['/gravity/geodesic-motion', 'equivalence-lift'],
  ['/cosmology/evolving-space', 'hubble-diagram'],
] as const

async function render(locale: Locale, step: string, graphId: string): Promise<string> {
  setLocale(locale)
  const path = getLearningPath(locale)
  const exercise = path.chapters.flatMap((c) => c.steps).find((s) => s.path === step)?.graphs.find((g) => g.id === graphId)
  if (!exercise) throw new Error(`Missing graph ${graphId} on ${step}`)
  const app = createSSRApp({ render: () => h(GraphPractice, { exercise, questions: exercise.questions, ui: path.ui, seed: 19, levelTag: () => null }) })
  return renderToString(app)
}

describe('graph exercises for Modules 4–6', () => {
  afterEach(() => setLocale('en'))

  it.each(cases)('renders %s / %s in all supported locales', async (step, graphId) => {
    const titles: Record<Locale, string> = {
      en: ({ 'velocity-addition': 'Read a relativistic velocity-addition graph', 'relativistic-momentum': 'Read a relativistic momentum graph', 'equivalence-lift': 'Read an accelerating-lift graph', 'hubble-diagram': 'Read an idealised Hubble-law graph' } as Record<string, string>)[graphId]!,
      id: ({ 'velocity-addition': 'Membaca grafik penjumlahan kecepatan relativistik', 'relativistic-momentum': 'Membaca grafik momentum relativistik', 'equivalence-lift': 'Membaca grafik lift yang dipercepat', 'hubble-diagram': 'Membaca grafik hukum Hubble yang diidealkan' } as Record<string, string>)[graphId]!,
      ja: ({ 'velocity-addition': '相対論的速度合成のグラフを読む', 'relativistic-momentum': '相対論的運動量のグラフを読む', 'equivalence-lift': '加速するエレベーターのグラフを読む', 'hubble-diagram': '理想化したハッブル則のグラフを読む' } as Record<string, string>)[graphId]!,
    }
    for (const locale of ['en', 'id', 'ja'] as const) {
      const html = await render(locale, step, graphId)
      expect(html).toContain(titles[locale])
      expect(html).toContain('class="value-table"')
      expect(html).toContain('class="interpretation-guide"')
      const checkLabel: Record<Locale, string> = { en: 'Check answer', id: 'Periksa jawaban', ja: '回答を確認' }
      expect(html).toContain(checkLabel[locale])
    }
  })
})

describe('graph questions are read from the curve, not looked up', () => {
  // The x-value each reading question asks about must not be a row of the accessible value table.
  const asked: readonly (readonly [graph: string, x: number])[] = [
    ['velocity-addition', 0.5],
    ['relativistic-momentum', 0.6],
    ['equivalence-lift', 9.8],
    ['hubble-diagram', 80],
  ]
  it.each(asked)('%s does not tabulate x = %s', async (graph, x) => {
    const { GRAPHS } = await import('./learning-content')
    const g = GRAPHS[graph]!
    expect(g.kind).toBe('function')
    if (g.kind === 'function') expect(g.table).not.toContain(x)
  })
})
