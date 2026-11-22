import { describe, expect, it } from 'vitest'
import {
  COSMOLOGIES,
  accelerationOnset,
  cmbTemperature,
  deceleration,
  hubbleRate,
  hubbleRateToday,
  recessionSpeed,
  redshift,
  solveExpansion,
  toKmSMpc,
  type Cosmology,
} from './index'

const model = (id: Cosmology['id']) => COSMOLOGIES.find((c) => c.id === id) as Cosmology
const our = model('our')
const H0 = hubbleRateToday(our) // 1/Gyr

describe('units', () => {
  it('H₀ = 67.66 km/s/Mpc is 0.0692 per Gyr: a Hubble time of 14.45 Gyr', () => {
    expect(H0).toBeCloseTo(0.0692, 4)
    expect(1 / H0).toBeCloseTo(14.45, 2)
    expect(toKmSMpc(hubbleRate(our, 1))).toBeCloseTo(67.66, 8)
  })
})

describe('Friedmann solutions match the exact ones', () => {
  it('radiation only: a ∝ t^½, age 1/(2H₀)', () => {
    const e = solveExpansion(model('radiation'))
    expect(e.tToday).toBeCloseTo(1 / (2 * H0), 4)
    expect(e.scaleFactorAt(e.tToday / 4)).toBeCloseTo(0.5, 4)
  })

  it('matter only: a ∝ t^⅔, age 2/(3H₀) = 9.6 Gyr', () => {
    const e = solveExpansion(model('matter'))
    expect(e.tToday).toBeCloseTo(2 / (3 * H0), 4)
    expect(e.tToday).toBeCloseTo(9.63, 2)
    expect(e.scaleFactorAt(e.tToday / 8)).toBeCloseTo(0.25, 4)
  })

  it('dark energy only: a = e^{H₀ (t − t_today)}, no Big Bang', () => {
    const e = solveExpansion(model('lambda'))
    expect(e.hasBigBang).toBe(false)
    expect(e.tToday).toBeCloseTo(0, 6)
    expect(e.scaleFactorAt(10)).toBeCloseTo(Math.exp(10 * H0), 4)
    expect(e.scaleFactorAt(-10)).toBeCloseTo(Math.exp(-10 * H0), 5)
  })

  it('flat matter + Λ (no radiation) matches the arcsinh solution', () => {
    const c: Cosmology = { id: 'our', name: 'test', h0: 67.66, omegaR: 0, omegaM: 0.3, omegaL: 0.7 }
    const e = solveExpansion(c)
    const hl = hubbleRateToday(c) * Math.sqrt(0.7)
    const exact = (a: number) => (2 / (3 * hl)) * Math.asinh(Math.sqrt(0.7 / 0.3) * a ** 1.5)
    for (const a of [0.1, 0.5, 1, 2]) expect(e.timeAt(a)).toBeCloseTo(exact(a), 4)
  })

  it('a(t) and t(a) are inverses', () => {
    const e = solveExpansion(our)
    for (const a of [0.001, 0.2, 1, 3]) expect(e.scaleFactorAt(e.timeAt(a))).toBeCloseTo(a, 5)
  })
})

describe('our universe', () => {
  const e = solveExpansion(our)

  it('is 13.8 billion years old', () => {
    expect(e.tToday).toBeCloseTo(13.79, 1)
  })

  it('is speeding up today (q₀ ≈ −0.53) after slowing down earlier', () => {
    expect(deceleration(our, 1)).toBeCloseTo(-0.533, 2)
    expect(deceleration(our, 0.3)).toBeGreaterThan(0)
  })

  it('switched from slowing to speeding up at a ≈ 0.61 (z ≈ 0.64), about 6 billion years ago', () => {
    const a = accelerationOnset(our) as number
    expect(a).toBeCloseTo(0.61, 2)
    expect(redshift(a)).toBeCloseTo(0.64, 1)
    expect(Math.abs(deceleration(our, a))).toBeLessThan(1e-3) // radiation makes it not exactly 0
    expect(e.tToday - e.timeAt(a)).toBeCloseTo(6.1, 0)
  })

  it('galaxies beyond the Hubble distance c/H₀ ≈ 14.5 Gly recede faster than light today', () => {
    expect(recessionSpeed(our, 1, 14)).toBeLessThan(1)
    expect(recessionSpeed(our, 1, 15)).toBeGreaterThan(1)
  })

  it('the background radiation was about 3000 K when a was 1/1100', () => {
    expect(cmbTemperature(1 / 1100)).toBeCloseTo(3000, -2)
  })

  it('models without matter or Λ have no acceleration onset', () => {
    expect(accelerationOnset(model('matter'))).toBeNull()
  })
})
