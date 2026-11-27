import { describe, expect, it } from 'vitest'
import { apparentWeightPerMass } from './equivalence'
import { hubbleDistance, hubbleVelocity } from './observationalCosmology'
import { relativisticMomentum, relativisticVelocityAddition } from './relativisticDynamics'
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
