import { describe, expect, it } from 'vitest'
import { DESCRIPTIONS, predict } from '@/physics'
import { LEVELS } from '@/levels'
import {
  PREDICTIONS,
  allScenariosHint,
  everydayClockHint,
  fastHeadlightHint,
  observedAllScenarios,
  observedEverydayClock,
  observedFastHeadlight,
  observedFlashes,
  observedFastProbe,
  observedMomentumGrowth,
  momentumGrowthHint,
} from './predictions'
import { derivation, SCENARIO_INFO } from './content'
import { measuredValue, type Observation } from './useTwoPerspectives'

const obs = (scenario: Observation['scenario'], beta: number): Observation => ({ scenario, beta })

describe('measurement', () => {
  it('nature agrees with relativity: c for the headlight, 6 s for the clock at 0.80c', () => {
    expect(measuredValue('light', 0.5)).toBeCloseTo(1, 12)
    expect(measuredValue('clock', 0.8)).toBeCloseTo(6, 12)
  })
})

describe('prediction observation tests', () => {
  it('headlight needs a measurement at 0.50c or more', () => {
    expect(observedFastHeadlight([obs('light', 0.5)])).toBe(true)
    expect(observedFastHeadlight([obs('light', 0.3)])).toBe(false)
    expect(observedFastHeadlight([obs('clock', 0.9)])).toBe(false)
    expect(fastHeadlightHint([obs('light', 0.3)])).toMatch(/at least 0\.50c/)
    expect(fastHeadlightHint([obs('clock', 0.9)])).toMatch(/Headlight/)
  })

  it('the everyday question needs a moving clock at a low but non-zero speed', () => {
    expect(observedEverydayClock([obs('clock', 0.01)])).toBe(true)
    expect(observedEverydayClock([obs('clock', 0.05)])).toBe(true)
    expect(observedEverydayClock([obs('clock', 0)])).toBe(false)
    expect(observedEverydayClock([obs('clock', 0.5)])).toBe(false)
    expect(everydayClockHint([obs('clock', 0)])).toMatch(/nothing moves/)
    expect(everydayClockHint([obs('clock', 0.5)])).toMatch(/too high/)
  })

  it('flashes need 0.30c or more', () => {
    expect(observedFlashes([obs('flashes', 0.3)])).toBe(true)
    expect(observedFlashes([obs('flashes', 0.1)])).toBe(false)
  })

  it('equivalence needs all three scenarios at high speed, and the hint names what is missing', () => {
    expect(observedAllScenarios([obs('light', 0.6), obs('flashes', 0.6), obs('clock', 0.6)])).toBe(true)
    expect(observedAllScenarios([obs('light', 0.6), obs('flashes', 0.6), obs('clock', 0.1)])).toBe(false)
    expect(allScenariosHint([obs('light', 0.6)])).toMatch(/Two flashes.*Moving clock/)
  })

  it('equivalence still counts only the three original situations', () => {
    expect(observedAllScenarios([obs('light', 0.6), obs('probe', 0.6), obs('momentum', 0.6)])).toBe(false)
  })

  it('the probe needs a measurement at 0.80c or more', () => {
    expect(observedFastProbe([obs('probe', 0.8)])).toBe(true)
    expect(observedFastProbe([obs('probe', 0.79)])).toBe(false)
    expect(observedFastProbe([obs('light', 0.9)])).toBe(false)
    expect(measuredValue('probe', 0.8)).toBeCloseTo(0.929, 3)
  })

  it('momentum growth needs one measurement at 0.45c or below and one at 0.90c or above', () => {
    expect(observedMomentumGrowth([obs('momentum', 0.45), obs('momentum', 0.9)])).toBe(true)
    expect(observedMomentumGrowth([obs('momentum', 0.9)])).toBe(false)
    expect(observedMomentumGrowth([obs('momentum', 0), obs('momentum', 0.95)])).toBe(false)
    expect(momentumGrowthHint([obs('momentum', 0.9)])).toMatch(/0\.45c/)
    expect(measuredValue('momentum', 0.9) / measuredValue('momentum', 0.45)).toBeGreaterThan(4)
  })

  it('every level adds at least one prediction, ids are unique, answers exist', () => {
    for (const level of LEVELS) expect(PREDICTIONS.some((p) => p.minLevel === level.id)).toBe(true)
    expect(new Set(PREDICTIONS.map((p) => p.id)).size).toBe(PREDICTIONS.length)
    for (const p of PREDICTIONS) expect(p.options.map((o) => o.id)).toContain(p.correct)
  })
})

describe('derivations', () => {
  it('end with the same number the description predicts', () => {
    for (const scenario of ['light', 'flashes', 'clock', 'probe', 'momentum'] as const) {
      for (const d of DESCRIPTIONS) {
        const tex = derivation(scenario, d, 0.6)
        const digits = SCENARIO_INFO[scenario].digits
        expect(tex).toContain(predict(scenario, d, 0.6).toFixed(digits))
      }
    }
  })

  it('never print a negative zero', () => {
    expect(derivation('flashes', 'lorentz', 0)).not.toMatch(/-0\.000/)
  })
})
