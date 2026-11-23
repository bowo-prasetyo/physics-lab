import { describe, expect, it } from 'vitest'
import { getExperimentSupportCopy, localizeExperimentSupport } from './experiment-support'

const experimentIds = [
  'space-vs-time',
  'displacement-3d',
  'pendulum',
  'newtonian',
  'projectile',
  'moving-clocks',
  'two-perspectives',
  'gravity-clock-rates',
  'evolving-space',
] as const

const fields = ['focus', 'prompt', 'action', 'reflect'] as const

describe('experiment support localization', () => {
  it('provides complete Indonesian and Japanese guidance for all nine experiments', () => {
    for (const experimentId of experimentIds) {
      for (const locale of ['id', 'ja'] as const) {
        const copy = getExperimentSupportCopy(experimentId, locale)
        expect(copy, `missing ${locale} support copy for ${experimentId}`).toBeDefined()
        for (const field of fields) {
          expect(copy?.[field].trim().length, `${experimentId} ${locale} ${field}`).toBeGreaterThan(20)
        }
      }
    }
  })

  it('uses the supplied English source text unchanged', () => {
    const source = 'Compare clock rates in the stated static Schwarzschild setting.'
    expect(localizeExperimentSupport('gravity-clock-rates', 'focus', source, 'en')).toBe(source)
  })

  it('falls back safely for an unknown experiment or missing locale entry', () => {
    const fallback = 'Original source guidance'
    expect(localizeExperimentSupport('unknown-experiment', 'focus', fallback, 'id')).toBe(fallback)
  })

  it('returns localized prose for each guidance section', () => {
    expect(localizeExperimentSupport('pendulum', 'prompt', 'English prompt', 'id')).toContain('massa')
    expect(localizeExperimentSupport('evolving-space', 'action', 'English action', 'ja')).toContain('宇宙論モデル')
  })
})
