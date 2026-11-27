// @vitest-environment jsdom
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it } from 'vitest'
import ConceptBridge from '@/components/ConceptBridge.vue'
import { setLocale } from './index'
import { BRIDGE_EQUATIONS, CONCEPT_BRIDGE_EXPERIMENTS, getConceptBridge } from './concept-bridges'
import { SUPPORTED_LOCALES } from './locales'
import type { Level } from '@/levels'

const render = (experimentId: string, level: Level) =>
  renderToString(createSSRApp({ render: () => h(ConceptBridge, { experimentId, level }) }))

describe('concept bridges', () => {
  afterEach(() => setLocale('en'))

  it('provides complete, localized explanations and an equation for every bridge', () => {
    expect(CONCEPT_BRIDGE_EXPERIMENTS.length).toBeGreaterThanOrEqual(8)
    expect(Object.keys(BRIDGE_EQUATIONS).sort()).toEqual([...CONCEPT_BRIDGE_EXPERIMENTS].sort())
    for (const experimentId of CONCEPT_BRIDGE_EXPERIMENTS) {
      for (const locale of SUPPORTED_LOCALES) {
        const copy = getConceptBridge(experimentId, locale)
        expect(copy, `${experimentId} should have ${locale} copy`).not.toBeNull()
        for (const [key, value] of Object.entries(copy ?? {})) {
          expect(value.trim(), `${experimentId}.${locale}.${key}`).not.toBe('')
        }
      }
    }
  })

  it('returns no primer for experiments without a dedicated concept bridge', () => {
    expect(getConceptBridge('unknown-experiment', 'en')).toBeNull()
  })

  it('typesets each equation, and shows it only from the level at which the page introduces it', async () => {
    const beginner = await render('geodesic-motion', 'beginner')
    expect(beginner).not.toContain('katex')
    expect(beginner).toContain(getConceptBridge('geodesic-motion', 'en')!.misconceptionTitle) // the rest of the bridge stays
    expect(await render('geodesic-motion', 'advanced')).toContain('katex')
    expect(await render('force-lab', 'beginner')).toContain('katex')
    expect(await render('length-contraction', 'beginner')).not.toContain('katex')
    expect(await render('length-contraction', 'intermediate')).toContain('katex')
  })
})
