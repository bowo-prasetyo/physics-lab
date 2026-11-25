// @vitest-environment jsdom
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it } from 'vitest'
import { setLocale, type Locale } from '@/i18n'
import GraphInterpretation from './GraphInterpretation.vue'

async function render(locale: Locale): Promise<string> {
  setLocale(locale)
  return renderToString(createSSRApp({ render: () => h(GraphInterpretation) }))
}

describe('cross-experiment graph interpretation', () => {
  afterEach(() => setLocale('en'))

  it('renders graph-reading practice for force, projectile and pendulum experiments', async () => {
    const html = await render('en')
    expect(html).toContain('Force Lab')
    expect(html).toContain('Projectile Lab')
    expect(html).toContain('Pendulum')
    expect(html.match(/<svg/g)).toHaveLength(3)
    expect(html).toContain('Acceleration is proportional to net force.')
  })

  it('localizes graph prompts, axes and misconception feedback in all supported languages', async () => {
    const cases = [
      ['id', 'Menafsirkan grafik dalam berbagai topik fisika', 'Gaya resultan (N)'],
      ['ja', '物理のさまざまなグラフを読み解く', '合力 (N)'],
    ] as const
    for (const [locale, title, axis] of cases) {
      const html = await render(locale)
      expect(html).toContain(title)
      expect(html).toContain(axis)
      expect(html).not.toContain('Interpret graphs across physics')
    }
  })
})
