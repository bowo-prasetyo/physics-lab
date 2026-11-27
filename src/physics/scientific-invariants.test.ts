import { describe, expect, it } from 'vitest'
import {
  COSMOLOGIES,
  accelerationOnset,
  cmbTemperature,
  deceleration,
  expansionFactor,
  fitHubbleConstant,
  illustrativeHubbleSample,
  recessionSpeed,
  redshift,
  solveExpansion,
  type Cosmology,
} from './index'

describe('scientific-domain validation', () => {
  it('rejects non-physical scale factors instead of returning NaN or infinity', () => {
    for (const a of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() => expansionFactor(COSMOLOGIES[0]!, a)).toThrow(RangeError)
      expect(() => redshift(a)).toThrow(RangeError)
      expect(() => cmbTemperature(a)).toThrow(RangeError)
    }
  })

  it('rejects invalid cosmological parameters before integration', () => {
    const invalid: Cosmology = { ...COSMOLOGIES[0]!, h0: 0 }
    const negativeDensity: Cosmology = { ...COSMOLOGIES[0]!, omegaM: -0.1 }
    expect(() => expansionFactor(invalid, 1)).toThrow(RangeError)
    expect(() => deceleration(negativeDensity, 1)).toThrow(RangeError)
    expect(() => solveExpansion(invalid)).toThrow(RangeError)
    expect(() => accelerationOnset(negativeDensity)).toThrow(RangeError)
  })

  it('rejects invalid distance and future-time inputs', () => {
    expect(() => recessionSpeed(COSMOLOGIES[0]!, 1, -1)).toThrow(RangeError)
    expect(() => solveExpansion(COSMOLOGIES[0]!, -1)).toThrow(RangeError)
  })

  it('keeps the reference FLRW model unchanged at the present epoch', () => {
    const model = COSMOLOGIES[0]!
    expect(expansionFactor(model, 1)).toBeCloseTo(1, 12)
    expect(recessionSpeed(model, 1, 1)).toBeCloseTo(model.h0 * 0.001022712165, 8)
  })
})

describe('Hubble-diagram data validation and interpretation', () => {
  it('rejects malformed synthetic-sample parameters', () => {
    const valid = { h0: 67.66 }
    expect(() => illustrativeHubbleSample(8, { ...valid, seed: 1.5 })).toThrow(RangeError)
    expect(() => illustrativeHubbleSample(8, { ...valid, peculiarSpeed: -1 })).toThrow(RangeError)
    expect(() => illustrativeHubbleSample(8, { ...valid, distanceError: 1 })).toThrow(RangeError)
    expect(() => illustrativeHubbleSample(8, { ...valid, minDistance: 120, maxDistance: 10 })).toThrow(RangeError)
  })

  it('rejects non-finite or non-positive distances and non-finite speeds in a fit', () => {
    expect(() => fitHubbleConstant([{ distance: 0, speed: 1 }, { distance: 2, speed: 2 }])).toThrow(RangeError)
    expect(() => fitHubbleConstant([{ distance: Number.NaN, speed: 1 }, { distance: 2, speed: 2 }])).toThrow(RangeError)
    expect(() => fitHubbleConstant([{ distance: 1, speed: Number.POSITIVE_INFINITY }, { distance: 2, speed: 2 }])).toThrow(RangeError)
  })

  it('allows negative observed recession velocities from peculiar motion', () => {
    const fit = fitHubbleConstant([{ distance: 1, speed: -20 }, { distance: 2, speed: 100 }])
    expect(Number.isFinite(fit.h0)).toBe(true)
    expect(Number.isFinite(fit.standardError)).toBe(true)
  })

  it('documents and preserves the ordinary least-squares result for exact data', () => {
    const fit = fitHubbleConstant([{ distance: 10, speed: 700 }, { distance: 20, speed: 1400 }])
    expect(fit.h0).toBe(70)
    expect(fit.standardError).toBe(0)
  })
})
