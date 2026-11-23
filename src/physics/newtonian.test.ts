import { describe, expect, it } from 'vitest'
import { accelerationFromNetForce, displacementFromRest, velocityFromRest } from './newtonian'

describe('Newtonian constant-net-force model', () => {
  it('calculates acceleration from net force and mass', () => {
    expect(accelerationFromNetForce(20, 4)).toBe(5)
    expect(accelerationFromNetForce(-12, 3)).toBe(-4)
  })

  it('shows acceleration proportional to force at fixed mass', () => {
    expect(accelerationFromNetForce(40, 2)).toBe(2 * accelerationFromNetForce(20, 2))
  })

  it('shows acceleration inversely proportional to mass at fixed force', () => {
    expect(accelerationFromNetForce(20, 4)).toBe(accelerationFromNetForce(20, 2) / 2)
  })

  it('uses the constant-acceleration solution from rest', () => {
    expect(velocityFromRest(10, 2, 3)).toBe(15)
    expect(displacementFromRest(10, 2, 3)).toBe(22.5)
  })

  it('rejects invalid mass, force and time', () => {
    expect(() => accelerationFromNetForce(1, 0)).toThrow(RangeError)
    expect(() => accelerationFromNetForce(Number.NaN, 1)).toThrow(RangeError)
    expect(() => velocityFromRest(1, 1, -1)).toThrow(RangeError)
    expect(() => displacementFromRest(1, 1, Number.POSITIVE_INFINITY)).toThrow(RangeError)
  })
})
