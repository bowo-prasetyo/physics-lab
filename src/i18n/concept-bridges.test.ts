import { describe, expect, it } from 'vitest'
import { CONCEPT_BRIDGE_EXPERIMENTS, getConceptBridge } from './concept-bridges'
import { SUPPORTED_LOCALES } from './locales'

describe('concept bridges', () => {
  it('provides complete, localized explanations for every supported experiment', () => {
    expect(CONCEPT_BRIDGE_EXPERIMENTS.length).toBeGreaterThanOrEqual(8)
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
})
