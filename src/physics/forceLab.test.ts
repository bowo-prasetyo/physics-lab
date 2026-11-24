import { describe, expect, it } from 'vitest'
import { calculateForceLab } from './forceLab'

const base = {
  scenario: 'horizontal' as const,
  mass: 5,
  appliedForce: 20,
  frictionCoefficient: 0.2,
  inclineAngle: 0,
  duration: 2,
}

describe('calculateForceLab', () => {
  it('balances vertical forces on a horizontal surface', () => {
    const result = calculateForceLab(base)
    expect(result.normalForce).toBeCloseTo(49.05)
    expect(result.weight).toBeCloseTo(49.05)
    expect(result.forces.reduce((sum, force) => sum + force.y, 0)).toBeCloseTo(0)
  })

  it('subtracts kinetic friction from the applied force', () => {
    const result = calculateForceLab(base)
    expect(result.frictionForce).toBeCloseTo(9.81)
    expect(result.netForce).toBeCloseTo(10.19)
    expect(result.acceleration).toBeCloseTo(2.038)
    expect(result.velocity).toBeCloseTo(4.076)
    expect(result.displacement).toBeCloseTo(4.076)
  })

  it('resolves weight and normal force on an incline', () => {
    const result = calculateForceLab({
      ...base, scenario: 'incline', inclineAngle: 30, appliedForce: 0,
    })
    expect(result.normalForce).toBeCloseTo(5 * 9.81 * Math.cos(Math.PI / 6))
    expect(result.netForce).toBeLessThan(0)
    expect(result.forces.reduce((sum, force) => sum + force.x, 0)).toBeCloseTo(result.netForce)
  })

  it('uses no friction when the tendency to slide is zero', () => {
    const result = calculateForceLab({ ...base, appliedForce: 0 })
    expect(result.frictionForce).toBe(0)
    expect(result.netForce).toBe(0)
  })

  it('rejects invalid physical parameters', () => {
    expect(() => calculateForceLab({ ...base, mass: 0 })).toThrow(RangeError)
    expect(() => calculateForceLab({ ...base, frictionCoefficient: -0.1 })).toThrow(RangeError)
    expect(() => calculateForceLab({ ...base, duration: -1 })).toThrow(RangeError)
    expect(() => calculateForceLab({ ...base, inclineAngle: 90, scenario: 'incline' })).toThrow(RangeError)
  })
})
