import { describe, expect, it } from 'vitest'
import { LEVELS } from '@/levels'
import {
  PREDICTIONS,
  amplitudeHint,
  lengthHint,
  massHint,
  moonHint,
  observedAmplitude,
  observedLength,
  observedMass,
  observedMoon,
} from './predictions'
import type { PeriodMeasurement } from './usePendulum'

const m = (over: Partial<PeriodMeasurement>): PeriodMeasurement => ({ length: 0.5, mass: 1, amplitude: 10, planet: 'earth', period: 1.42, ...over })

describe('observation tests', () => {
  it('length: small swings at lengths in the ratio 4 : 1 on one world', () => {
    expect(observedLength([m({ length: 0.5 }), m({ length: 2 })])).toBe(true)
    expect(observedLength([m({ length: 0.5 }), m({ length: 1.5 })])).toBe(false)
    expect(observedLength([m({ length: 0.5 }), m({ length: 2, amplitude: 60 })])).toBe(false)
    expect(observedLength([m({ length: 0.5 }), m({ length: 2, planet: 'moon' })])).toBe(false)
    expect(lengthHint([m({ amplitude: 60 })])).toMatch(/small swing/)
  })

  it('mass: same pendulum, masses differing by 5× or more', () => {
    expect(observedMass([m({ mass: 0.5 }), m({ mass: 5 })])).toBe(true)
    expect(observedMass([m({ mass: 1 }), m({ mass: 2 })])).toBe(false)
    expect(observedMass([m({ mass: 0.5 }), m({ mass: 5, length: 1 })])).toBe(false)
    expect(massHint([m({})])).toMatch(/heavy one/)
  })

  it('moon: the same length on the Earth and on the Moon', () => {
    expect(observedMoon([m({ planet: 'moon' }), m({})])).toBe(true)
    expect(observedMoon([m({ planet: 'moon' }), m({ length: 1 })])).toBe(false)
    expect(moonHint([m({})])).toMatch(/to the Moon/)
  })

  it('amplitude: a wide (≥ 80°) and a narrow (≤ 10°) swing of the same pendulum', () => {
    expect(observedAmplitude([m({ amplitude: 90 }), m({ amplitude: 5 })])).toBe(true)
    expect(observedAmplitude([m({ amplitude: 60 }), m({ amplitude: 5 })])).toBe(false)
    expect(amplitudeHint([m({ amplitude: 5 })])).toMatch(/90°/)
  })

  it('every level adds at least one prediction, ids are unique, answers exist', () => {
    for (const level of LEVELS) expect(PREDICTIONS.some((p) => p.minLevel === level.id)).toBe(true)
    expect(new Set(PREDICTIONS.map((p) => p.id)).size).toBe(PREDICTIONS.length)
    for (const p of PREDICTIONS) expect(p.options.map((o) => o.id)).toContain(p.correct)
  })
})
