import { describe, expect, it } from 'vitest'
import { calculateLengthContraction } from './lengthContraction'
import { SPEED_OF_LIGHT } from './relativity'

describe('calculateLengthContraction', () => {
  it('returns the proper length when relative speed is zero', () => {
    const result = calculateLengthContraction(12, 0)
    expect(result.gamma).toBe(1)
    expect(result.measuredLength).toBe(12)
    expect(result.contraction).toBe(0)
    expect(result.frontEventTimeInRestFrame).toBe(0)
  })

  it('contracts the measured length by 1/gamma', () => {
    const result = calculateLengthContraction(10, 0.8)
    expect(result.gamma).toBeCloseTo(5 / 3, 12)
    expect(result.measuredLength).toBeCloseTo(6, 12)
    expect(result.contraction).toBeCloseTo(4, 12)
  })

  it('makes Earth-simultaneous endpoint events non-simultaneous in the rod rest frame', () => {
    const result = calculateLengthContraction(10, 0.8)
    expect(result.frontEventTimeInRestFrame).toBeCloseTo(-8 / SPEED_OF_LIGHT, 16)
  })

  it('is symmetric in the sign of relative velocity for measured length', () => {
    const forward = calculateLengthContraction(7, 0.65)
    const reverse = calculateLengthContraction(7, -0.65)
    expect(reverse.measuredLength).toBeCloseTo(forward.measuredLength, 14)
    expect(reverse.frontEventTimeInRestFrame).toBeCloseTo(-forward.frontEventTimeInRestFrame, 14)
  })

  it.each([[0, 0], [-1, 0.5], [Number.NaN, 0.5], [10, 1], [10, -1], [10, Number.POSITIVE_INFINITY]])(
    'rejects invalid proper length or beta (%s, %s)', (length, beta) => {
      expect(() => calculateLengthContraction(length, beta)).toThrow(RangeError)
    },
  )
})
