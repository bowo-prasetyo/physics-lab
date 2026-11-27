import { describe, expect, it } from 'vitest'
import {
  CLOCK_EARTH_TIME,
  DESCRIPTIONS,
  FLASH_HALF_SEPARATION,
  boostByRapidity,
  gamma,
  lorentzBoost,
  predict,
  rapidity,
  type Scenario,
} from './index'

const SCENARIOS: Scenario[] = ['light', 'flashes', 'clock', 'probe', 'momentum']
const SPEEDS = [0, 0.01, 0.1, 0.3, 0.5, 0.6, 0.8, 0.9, 0.99]

describe('boost as a hyperbolic rotation', () => {
  it('agrees with the Lorentz formula for any event and speed', () => {
    for (const beta of [-0.9, -0.2, 0.3, 0.8, 0.99]) {
      for (const e of [{ t: 3, x: 1 }, { t: -2, x: 7 }, { t: 0, x: 10 }]) {
        const a = lorentzBoost(e, beta)
        const b = boostByRapidity(e, rapidity(beta))
        expect(b.t).toBeCloseTo(a.t, 9)
        expect(b.x).toBeCloseTo(a.x, 9)
      }
    }
  })
})

describe('textbook values', () => {
  it('light: at 0.5c Galilean addition gives 1.5c; relativity gives exactly c', () => {
    expect(predict('light', 'galilean', 0.5)).toBeCloseTo(1.5, 12)
    expect(predict('light', 'lorentz', 0.5)).toBeCloseTo(1, 12)
    expect(predict('light', 'spacetime', 0.5)).toBeCloseTo(1, 12)
  })

  it('flashes: at 0.6c the front flash leads by 2γβL = 7.5 s; Galilean says 0', () => {
    expect(predict('flashes', 'galilean', 0.6)).toBe(0)
    expect(predict('flashes', 'lorentz', 0.6)).toBeCloseTo(2 * 1.25 * 0.6 * FLASH_HALF_SEPARATION, 12)
    expect(predict('flashes', 'spacetime', 0.6)).toBeCloseTo(7.5, 12)
  })

  it('clock: at 0.8c the ship reads 6 s when the Earth reads 10 s; Galilean says 10 s', () => {
    expect(predict('clock', 'galilean', 0.8)).toBe(CLOCK_EARTH_TIME)
    expect(predict('clock', 'lorentz', 0.8)).toBeCloseTo(6, 12)
    expect(predict('clock', 'spacetime', 0.8)).toBeCloseTo(6, 12)
  })
})

describe('the descriptions compared', () => {
  it('space + time (Lorentz) and spacetime agree on every prediction at every speed', () => {
    for (const scenario of SCENARIOS) {
      for (const beta of SPEEDS) {
        expect(predict(scenario, 'spacetime', beta)).toBeCloseTo(predict(scenario, 'lorentz', beta), 9)
      }
    }
  })

  it('all three agree when nothing moves', () => {
    for (const scenario of SCENARIOS) {
      const values = DESCRIPTIONS.map((d) => predict(scenario, d, 0))
      for (const v of values) expect(v).toBeCloseTo(values[0] as number, 12)
    }
  })

  it('for a moving clock, Galilean is off only at second order in β (≈ β²/2)', () => {
    const beta = 0.01
    const error = 1 - predict('clock', 'lorentz', beta) / predict('clock', 'galilean', beta)
    expect(error / ((beta * beta) / 2)).toBeCloseTo(1, 3)
    expect(1 - 1 / gamma(beta)).toBeCloseTo(error, 12)
  })

  it('for light, Galilean is off at first order in β: wrong at any speed', () => {
    const beta = 0.01
    const error = predict('light', 'galilean', beta) - predict('light', 'lorentz', beta)
    expect(error).toBeCloseTo(beta, 12)
  })

  it('Galilean disagrees clearly at high speed in every scenario', () => {
    for (const scenario of SCENARIOS) {
      const correct = predict(scenario, 'lorentz', 0.8)
      const relativeError = Math.abs(predict(scenario, 'galilean', 0.8) - correct) / Math.abs(correct)
      expect(relativeError).toBeGreaterThan(0.35) // light 80 %, clock 67 %, flashes 100 %, probe 40 %, momentum 40 %
    }
  })

  it('the probe: velocities combine as (u + v)/(1 + uv), never reaching c', () => {
    expect(predict('probe', 'lorentz', 0.8)).toBeCloseTo(1.3 / 1.4, 12)
    expect(predict('probe', 'galilean', 0.8)).toBeCloseTo(1.3, 12)
    for (const beta of [0, 0.5, 0.9, 0.99]) {
      const w = predict('probe', 'spacetime', beta)
      expect(w).toBeLessThan(1)
      expect(w).toBeCloseTo(Math.tanh(Math.atanh(0.5) + Math.atanh(beta)), 12)
    }
  })

  it('momentum: p = γmv, which more than quadruples when the speed doubles from 0.45c to 0.90c', () => {
    for (const beta of [0.1, 0.45, 0.9]) expect(predict('momentum', 'lorentz', beta)).toBeCloseTo(gamma(beta) * beta, 12)
    const ratio = predict('momentum', 'lorentz', 0.9) / predict('momentum', 'lorentz', 0.45)
    expect(ratio).toBeGreaterThan(4)
    expect(predict('momentum', 'galilean', 0.9) / predict('momentum', 'galilean', 0.45)).toBeCloseTo(2, 12)
  })
})
