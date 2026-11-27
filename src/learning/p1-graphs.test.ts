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

describe('P1 graph interpretation exercises', () => {
  afterEach(() => setLocale('en'))

  it.each(cases)('renders %s / %s in all supported locales', async (step, graphId) => {
    const titles: Record<Locale, string> = {
      en: ({ 'velocity-addition': 'Read a relativistic velocity-addition graph', 'relativistic-momentum': 'Read a relativistic momentum graph', 'equivalence-lift': 'Read an accelerating-lift graph', 'hubble-diagram': 'Read a nearby-galaxy Hubble diagram' } as Record<string, string>)[graphId]!,
      id: ({ 'velocity-addition': 'Membaca grafik penjumlahan kecepatan relativistik', 'relativistic-momentum': 'Membaca grafik momentum relativistik', 'equivalence-lift': 'Membaca grafik lift yang dipercepat', 'hubble-diagram': 'Membaca diagram Hubble galaksi dekat' } as Record<string, string>)[graphId]!,
      ja: ({ 'velocity-addition': '相対論的速度合成グラフを読む', 'relativistic-momentum': '相対論的運動量グラフを読む', 'equivalence-lift': '加速するエレベーターのグラフを読む', 'hubble-diagram': '近傍銀河のハッブル図を読む' } as Record<string, string>)[graphId]!,
    }
    for (const locale of ['en', 'id', 'ja'] as const) {
      const html = await render(locale, step, graphId)
      expect(html).toContain(titles[locale])
      expect(html).toContain('class="value-table"')
      expect(html).toContain('class="interpretation-guide"')
      expect(html).toContain('Check answer')
      if (locale === 'id') expect(html).toContain('Periksa jawaban')
      if (locale === 'ja') expect(html).toContain('回答を確認')
    }
  })
})
