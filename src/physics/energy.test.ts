import { describe, expect, it } from 'vitest'
import { applyWorkEnergyTheorem, circularOrbitSpecificEnergy, gravitationalPotentialEnergy, kineticEnergy, mechanicalEnergy, universalGravitationalPotentialEnergy, workByConstantForce } from './energy'

describe('work and mechanical energy', () => {
  it('computes kinetic and gravitational potential energy in SI units', () => {
    expect(kineticEnergy(10, 3)).toBe(45)
    expect(gravitationalPotentialEnergy(2, 5)).toBeCloseTo(98.1, 12)
    expect(mechanicalEnergy(2, 3, 5)).toBeCloseTo(107.1, 12)
  })
  it('uses the force component along displacement for signed work', () => {
    expect(workByConstantForce(40, 5)).toBe(200)
    expect(workByConstantForce(10, 4, 180)).toBeCloseTo(-40, 12)
    expect(workByConstantForce(10, 4, 90)).toBeCloseTo(0, 12)
  })
  it('checks the work–energy theorem including negative friction work', () => {
    const result = applyWorkEnergyTheorem(10, 2, [workByConstantForce(50, 4), workByConstantForce(10, 4, 180)])
    expect(result).toEqual({ initialKineticEnergy: 20, netWork: 160, finalKineticEnergy: 180, finalSpeed: 6 })
  })
  it('rejects a work total that would require negative final kinetic energy', () => {
    expect(() => applyWorkEnergyTheorem(2, 1, [-2])).toThrow(RangeError)
  })
  it('uses zero gravitational potential at infinity for Newtonian gravity', () => {
    const u = universalGravitationalPotentialEnergy(1000, 5.972e24, 6.77e6)
    expect(u).toBeLessThan(0)
    expect(circularOrbitSpecificEnergy(5.972e24, 6.77e6)).toBeCloseTo(u / 1000 / 2, 7)
  })
  it('rejects non-physical inputs', () => {
    expect(() => kineticEnergy(0, 2)).toThrow(RangeError)
    expect(() => gravitationalPotentialEnergy(1, 2, -1)).toThrow(RangeError)
    expect(() => universalGravitationalPotentialEnergy(1, 2, 0)).toThrow(RangeError)
    expect(() => circularOrbitSpecificEnergy(1, -2)).toThrow(RangeError)
  })
})
