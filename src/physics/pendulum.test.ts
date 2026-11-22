import { describe, expect, it } from 'vitest'
import {
  advancePendulum,
  agm,
  exactPeriod,
  pendulumEnergy,
  rk4PendulumStep,
  secondsPendulumLength,
  smallAnglePeriod,
  verletStep,
  type PendulumState,
} from './index'

const g = 9.81
const deg = (d: number) => (d * Math.PI) / 180
const release = (amplitudeDeg: number): PendulumState => ({ t: 0, theta: deg(amplitudeDeg), omega: 0 })

/** Period measured from the simulation: time between two upward zero crossings. */
function simulatedPeriod(length: number, gravity: number, amplitudeDeg: number): number {
  const T = exactPeriod(length, gravity, deg(amplitudeDeg))
  const { crossings } = advancePendulum(release(amplitudeDeg), length, gravity, 2.5 * T, 2e-4)
  return (crossings[1] as number) - (crossings[0] as number)
}

describe('formulas', () => {
  it('T₀ = 2π√(L/g): a 1 m pendulum on Earth takes about 2 s', () => {
    expect(smallAnglePeriod(1, g)).toBeCloseTo(2.006, 3)
  })

  it('the seconds pendulum (≈ 0.994 m) has a period of exactly 2 s', () => {
    expect(secondsPendulumLength(g)).toBeCloseTo(0.994, 3)
    expect(smallAnglePeriod(secondsPendulumLength(g), g)).toBeCloseTo(2, 12)
  })

  it('AGM is correct on a known value', () => {
    expect(agm(1, Math.SQRT1_2)).toBeCloseTo(0.8472130847939790, 14) // Gauss's constant relation
  })

  it('a 90° swing takes 18.0% longer than a small one; small swings match T₀', () => {
    expect(exactPeriod(1, g, deg(90)) / smallAnglePeriod(1, g)).toBeCloseTo(1.18034, 4)
    expect(exactPeriod(1, g, deg(1)) / smallAnglePeriod(1, g)).toBeCloseTo(1, 4)
  })

  it('matches the series 1 + θ₀²/16 + 11θ₀⁴/3072 for moderate amplitudes', () => {
    const a = deg(30)
    expect(exactPeriod(1, g, a) / smallAnglePeriod(1, g)).toBeCloseTo(1 + a ** 2 / 16 + (11 * a ** 4) / 3072, 4)
  })

  it('four times the length doubles the period; the Moon makes it √6 times longer', () => {
    expect(smallAnglePeriod(4, g) / smallAnglePeriod(1, g)).toBeCloseTo(2, 12)
    expect(smallAnglePeriod(1, 1.62) / smallAnglePeriod(1, g)).toBeCloseTo(Math.sqrt(g / 1.62), 12)
  })
})

describe('simulation', () => {
  it('measures the exact period at small and large amplitudes', () => {
    for (const amp of [5, 45, 90, 150]) {
      expect(simulatedPeriod(1, g, amp) / exactPeriod(1, g, deg(amp))).toBeCloseTo(1, 4)
    }
  })

  it('Störmer–Verlet keeps its energy error bounded; RK4’s grows steadily', () => {
    // With h = 10 ms, RK4 starts far more accurate, but its error keeps growing,
    // while Verlet's oscillates at a fixed size for ever. Over long runs that is what matters for a clock.
    const L = 1
    const h = 0.01
    let v = release(60)
    let r = release(60)
    const e0 = pendulumEnergy(v, L, g)
    const err = (s: PendulumState) => Math.abs(pendulumEnergy(s, L, g) - e0) / e0
    let verletEarly = 0
    let verletLate = 0
    let rk4Early = 0
    for (let i = 1; i <= 200_000; i++) {
      v = verletStep(v, L, g, h)
      r = rk4PendulumStep(r, L, g, h)
      if (i <= 2000) verletEarly = Math.max(verletEarly, err(v))
      else verletLate = Math.max(verletLate, err(v))
      if (i === 2000) rk4Early = err(r)
    }
    expect(verletLate / verletEarly).toBeLessThan(1.01) // bounded: no growth over 100× longer
    expect(err(r) / rk4Early).toBeGreaterThan(50) // drifts: roughly proportional to time
  })

  it('advances by exactly the requested time', () => {
    const { state } = advancePendulum(release(20), 1, g, 1.2345)
    expect(state.t).toBeCloseTo(1.2345, 12)
  })

  it('rejects amplitudes of 180° or more', () => {
    expect(() => exactPeriod(1, g, Math.PI)).toThrow(RangeError)
  })
})
