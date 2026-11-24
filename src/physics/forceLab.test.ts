import { describe, expect, it } from 'vitest'
import { calculateForceLab } from './forceLab'

const base = {
  scenario: 'horizontal' as const,
  mass: 5,
  appliedForce: 20,
  staticFrictionCoefficient: 0.4,
  kineticFrictionCoefficient: 0.2,
  inclineAngle: 0,
  duration: 2,
}

describe('calculateForceLab friction regimes', () => {
  it('balances vertical forces on a horizontal surface', () => {
    const result = calculateForceLab(base)
    expect(result.normalForce).toBeCloseTo(49.05)
    expect(result.weight).toBeCloseTo(49.05)
    expect(result.forces.reduce((sum, force) => sum + force.y, 0)).toBeCloseTo(0)
  })

  it('uses only the friction needed below the static limit', () => {
    const result = calculateForceLab({ ...base, appliedForce: 5 })
    expect(result.frictionRegime).toBe('static')
    expect(result.maximumStaticFriction).toBeCloseTo(19.62)
    expect(result.frictionForce).toBeCloseTo(5)
    expect(result.netForce).toBeCloseTo(0)
    expect(result.acceleration).toBeCloseTo(0)
  })

  it('remains at rest at the static-friction threshold', () => {
    const result = calculateForceLab({ ...base, appliedForce: 19.62 })
    expect(result.frictionRegime).toBe('static')
    expect(result.frictionForce).toBeCloseTo(19.62)
    expect(result.netForce).toBeCloseTo(0)
  })

  it('switches to kinetic friction when the static limit is exceeded', () => {
    const result = calculateForceLab({ ...base, appliedForce: 25 })
    expect(result.frictionRegime).toBe('kinetic')
    expect(result.frictionForce).toBeCloseTo(9.81)
    expect(result.netForce).toBeCloseTo(15.19)
    expect(result.acceleration).toBeCloseTo(3.038)
    expect(result.velocity).toBeCloseTo(6.076)
    expect(result.displacement).toBeCloseTo(6.076)
  })

  it('uses the correct friction direction when gravity drives motion downhill', () => {
    const result = calculateForceLab({
      ...base, scenario: 'incline', inclineAngle: 30, appliedForce: 0,
    })
    expect(result.frictionRegime).toBe('kinetic')
    expect(result.forces.find((force) => force.id === 'friction')?.x).toBeGreaterThan(0)
    expect(result.netForce).toBeLessThan(0)
  })

  it('balances a sub-limit downhill tendency with static friction', () => {
    const result = calculateForceLab({
      ...base, scenario: 'incline', inclineAngle: 10, appliedForce: 0,
      staticFrictionCoefficient: 0.3,
    })
    expect(result.frictionRegime).toBe('static')
    expect(result.frictionForce).toBeCloseTo(5 * 9.81 * Math.sin(Math.PI / 18))
    expect(result.netForce).toBeCloseTo(0)
  })

  it('uses no friction when the tangential force tendency is zero', () => {
    const result = calculateForceLab({ ...base, appliedForce: 0 })
    expect(result.frictionRegime).toBe('static')
    expect(result.frictionForce).toBe(0)
    expect(result.netForce).toBe(0)
  })

  it('resolves the critical incline angle from the static coefficient', () => {
    const criticalAngle = Math.atan(base.staticFrictionCoefficient) * 180 / Math.PI
    const below = calculateForceLab({
      ...base, scenario: 'incline', inclineAngle: criticalAngle - 0.1, appliedForce: 0,
    })
    const above = calculateForceLab({
      ...base, scenario: 'incline', inclineAngle: criticalAngle + 0.1, appliedForce: 0,
    })
    expect(below.frictionRegime).toBe('static')
    expect(above.frictionRegime).toBe('kinetic')
  })

  it('rejects invalid physical parameters', () => {
    expect(() => calculateForceLab({ ...base, mass: 0 })).toThrow(RangeError)
    expect(() => calculateForceLab({ ...base, staticFrictionCoefficient: -0.1 })).toThrow(RangeError)
    expect(() => calculateForceLab({ ...base, kineticFrictionCoefficient: -0.1 })).toThrow(RangeError)
    // mu_k > mu_s would let kinetic friction push a block from rest backwards.
    expect(() => calculateForceLab({ ...base, staticFrictionCoefficient: 0.4, kineticFrictionCoefficient: 0.8 })).toThrow(RangeError)
    expect(() => calculateForceLab({ ...base, duration: -1 })).toThrow(RangeError)
    expect(() => calculateForceLab({ ...base, inclineAngle: 90, scenario: 'incline' })).toThrow(RangeError)
  })
})
