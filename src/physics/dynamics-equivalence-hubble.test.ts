import { describe, expect, it } from 'vitest'
import { apparentWeightPerMass, hoveringAccelerationFactor, hoveringProperAcceleration } from './equivalence'
import { G, SOLAR_MASS, schwarzschildRadius, staticClockRate } from './gravity'
import { hubbleDistance, hubbleVelocity } from './observationalCosmology'
import { relativisticMomentum, relativisticVelocityAddition, stickyCollisionWithIdenticalAtRest } from './relativisticDynamics'
import { SPEED_OF_LIGHT } from './relativity'

describe('special-relativistic dynamics', () => {
  it('reduces to the classical sum at low speeds and never exceeds c', () => {
    expect(relativisticVelocityAddition(3, 4)).toBeCloseTo(7, 12)
    expect(relativisticVelocityAddition(0.5 * SPEED_OF_LIGHT, 0.5 * SPEED_OF_LIGHT) / SPEED_OF_LIGHT).toBeCloseTo(0.8, 12)
    expect(relativisticVelocityAddition(0.9 * SPEED_OF_LIGHT, 0.9 * SPEED_OF_LIGHT)).toBeLessThan(SPEED_OF_LIGHT)
    expect(relativisticVelocityAddition(0.5 * SPEED_OF_LIGHT, -0.5 * SPEED_OF_LIGHT)).toBe(0)
  })

  it('computes relativistic momentum with the correct low-speed limit and sign', () => {
    expect(relativisticMomentum(2, 0)).toBe(0)
    expect(relativisticMomentum(2, 3)).toBeCloseTo(6, 8)
    expect(relativisticMomentum(1, 0.6 * SPEED_OF_LIGHT) / SPEED_OF_LIGHT).toBeCloseTo(0.75, 12)
    expect(relativisticMomentum(1, -0.6 * SPEED_OF_LIGHT)).toBeLessThan(0)
  })

  it('rejects non-physical inputs', () => {
    expect(() => relativisticVelocityAddition(SPEED_OF_LIGHT, 0)).toThrow(RangeError)
    expect(() => relativisticMomentum(0, 1)).toThrow(RangeError)
    expect(() => relativisticMomentum(1, SPEED_OF_LIGHT)).toThrow(RangeError)
  })
})

describe('equivalence principle local lift model', () => {
  it('predicts ordinary support at rest and weightlessness in free fall', () => {
    expect(apparentWeightPerMass(9.8, 0)).toBe(9.8)
    expect(apparentWeightPerMass(9.8, 4.9)).toBe(4.9)
    expect(apparentWeightPerMass(9.8, 9.8)).toBe(0)
  })

  it('rejects accelerations outside the stated model', () => {
    expect(() => apparentWeightPerMass(9.8, 10)).toThrow(RangeError)
  })
})

describe('observational Hubble-law helpers', () => {
  it('maps the nearby-galaxy Hubble diagram and inverts it', () => {
    expect(hubbleVelocity(70, 80)).toBe(5600)
    expect(hubbleDistance(70, 5600)).toBe(80)
    expect(hubbleVelocity(70, 0)).toBe(0)
  })

  it('rejects invalid Hubble parameters and distances', () => {
    expect(() => hubbleVelocity(0, 10)).toThrow(RangeError)
    expect(() => hubbleDistance(70, -1)).toThrow(RangeError)
  })
})

describe('hovering versus free fall near a Schwarzschild mass', () => {
  const mass = 10 * SOLAR_MASS
  const rs = schwarzschildRadius(mass)

  it('equals c² times the gradient of the static clock rate', () => {
    for (const k of [1.5, 3.2, 8, 12, 100]) {
      const r = k * rs
      const h = r * 1e-6
      const gradient = (staticClockRate(mass, r + h) - staticClockRate(mass, r - h)) / (2 * h)
      expect(hoveringProperAcceleration(mass, r) / (SPEED_OF_LIGHT ** 2 * gradient)).toBeCloseTo(1, 6)
    }
  })

  it('tends to the Newtonian pull far away and grows without limit at the horizon', () => {
    expect(hoveringAccelerationFactor(1e6)).toBeCloseTo(1, 5)
    expect(hoveringAccelerationFactor(8)).toBeCloseTo(1 / Math.sqrt(7 / 8), 12)
    expect(hoveringAccelerationFactor(1.0001)).toBeGreaterThan(99)
    const r = 8 * rs
    expect(hoveringProperAcceleration(mass, r) / ((G * mass) / r ** 2)).toBeCloseTo(hoveringAccelerationFactor(8), 12)
  })

  it('refuses to hover at or inside the horizon', () => {
    expect(() => hoveringAccelerationFactor(1)).toThrow(RangeError)
    expect(() => hoveringProperAcceleration(mass, rs)).toThrow(RangeError)
  })
})

describe('relativistic sticky collision', () => {
  it('conserves γmv and energy, and reduces to the Newtonian result at low speed', () => {
    const { speed, massRatio } = stickyCollisionWithIdenticalAtRest(0.8)
    expect(speed).toBeCloseTo(0.5, 12)
    expect(massRatio).toBeCloseTo(Math.sqrt(16 / 3), 12)
    // Momentum: γmv before equals γ_f M v_f after (units of mc).
    const before = relativisticMomentum(1, 0.8 * SPEED_OF_LIGHT) / SPEED_OF_LIGHT
    const after = relativisticMomentum(massRatio, speed * SPEED_OF_LIGHT) / SPEED_OF_LIGHT
    expect(after).toBeCloseTo(before, 12)
    const slow = stickyCollisionWithIdenticalAtRest(1e-4)
    expect(slow.speed / 5e-5).toBeCloseTo(1, 6)
    expect(slow.massRatio).toBeCloseTo(2, 6)
  })
})
