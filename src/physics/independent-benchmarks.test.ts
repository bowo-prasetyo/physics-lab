import { describe, expect, it } from 'vitest'
import { circularSpeed, gamma, schwarzschildRadius, smallAnglePeriod, EARTH_GM, SOLAR_MASS } from './index'

/** Literal reference values, independent of the engine's own helper formulas. */
describe('independent scientific reference values', () => {
  it('matches the Lorentz factor at beta = 0.8', () => {
    expect(gamma(0.8)).toBeCloseTo(5 / 3, 12)
  })

  it('matches the solar Schwarzschild radius to the published kilometre scale', () => {
    expect(schwarzschildRadius(SOLAR_MASS) / 1000).toBeCloseTo(2.953, 2)
  })

  it('matches the circular speed at the ISS orbital radius', () => {
    expect(circularSpeed(EARTH_GM, 6.77e6) / 1000).toBeCloseTo(7.67, 2)
  })

  it('matches the small-angle one-metre Earth pendulum period', () => {
    expect(smallAnglePeriod(1, 9.81)).toBeCloseTo(2.006, 2)
  })
})
