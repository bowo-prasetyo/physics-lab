import { describe, expect, it } from 'vitest'
import { applyWorkEnergyTheorem, gravitationalPotentialEnergy, kineticEnergy, workByConstantForce, workOnForceLabBlock } from './energy'
import { calculateForceLab, type ForceLabInput } from './forceLab'
import { EARTH_GM, EARTH_RADIUS, launchOrbit, orbitEnergyAt } from './circularOrbits'

const trial = (input: Partial<ForceLabInput>): ForceLabInput => ({
  scenario: 'horizontal', mass: 5, appliedForce: 30, staticFrictionCoefficient: 0.4, kineticFrictionCoefficient: 0.2, inclineAngle: 0, duration: 2, ...input,
})

describe('work and mechanical energy', () => {
  it('computes kinetic and gravitational potential energy in SI units', () => {
    expect(kineticEnergy(10, 3)).toBe(45)
    expect(gravitationalPotentialEnergy(2, 5)).toBeCloseTo(98.1, 12)
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
  it('rejects a work total that would require negative final kinetic energy, and non-physical inputs', () => {
    expect(() => applyWorkEnergyTheorem(2, 1, [-2])).toThrow(RangeError)
    expect(() => kineticEnergy(0, 2)).toThrow(RangeError)
    expect(() => gravitationalPotentialEnergy(1, 2, -1)).toThrow(RangeError)
  })
})

describe('work on the Force Lab block', () => {
  it('gives net work equal to the kinetic energy gained, with friction doing negative work', () => {
    const input = trial({})
    const result = calculateForceLab(input)
    const work = workOnForceLabBlock(result, input.mass)
    expect(result.frictionRegime).toBe('kinetic')
    expect(work.friction).toBeLessThan(0)
    expect(work.applied).toBeGreaterThan(0)
    expect(work.normal).toBe(0)
    expect(work.net).toBeCloseTo(work.finalKineticEnergy, 9)
    expect(work.applied).toBeCloseTo(30 * result.displacement, 9)
  })

  it('accounts for gravity on an incline as minus the change in potential energy', () => {
    const input = trial({ scenario: 'incline', inclineAngle: 30, appliedForce: 0, staticFrictionCoefficient: 0.2, kineticFrictionCoefficient: 0.1 })
    const result = calculateForceLab(input)
    const work = workOnForceLabBlock(result, input.mass)
    expect(result.displacement).toBeLessThan(0) // slides down the slope
    const heightChange = result.displacement * Math.sin(Math.PI / 6)
    expect(work.gravity).toBeCloseTo(-gravitationalPotentialEnergy(input.mass, heightChange), 9)
    expect(work.gravity).toBeGreaterThan(0)
    expect(work.friction).toBeLessThan(0)
    expect(work.net).toBeCloseTo(work.finalKineticEnergy, 9)
  })

  it('does no work when static friction holds the block at rest', () => {
    const input = trial({ appliedForce: 10 })
    const work = workOnForceLabBlock(calculateForceLab(input), input.mass)
    expect([work.applied, work.friction, work.gravity, work.net, work.finalKineticEnergy].every((w) => Math.abs(w) < 1e-12)).toBe(true)
  })
})

describe('energy along an orbit', () => {
  it('splits a constant total into kinetic and potential energy, trading them round an ellipse', () => {
    const r0 = 2 * EARTH_RADIUS
    const orbit = launchOrbit({ gm: EARTH_GM, planetRadius: EARTH_RADIUS, radius: r0, speedFactor: 1.2 })
    const closest = orbitEnergyAt(EARTH_GM, orbit.minRadius, orbit.energy)
    const farthest = orbitEnergyAt(EARTH_GM, orbit.maxRadius, orbit.energy)
    expect(closest.total).toBe(farthest.total)
    expect(closest.kinetic).toBeGreaterThan(farthest.kinetic)
    expect(closest.potential).toBeLessThan(farthest.potential)
    expect(closest.kinetic).toBeCloseTo(orbit.speed ** 2 / 2, 3) // launched at the closest point
    expect(closest.kinetic + closest.potential).toBeCloseTo(orbit.energy, 6)
  })
  it('gives a circular orbit a total of minus its kinetic energy, and rejects radii the orbit never reaches', () => {
    const r = 6.77e6
    const circle = launchOrbit({ gm: EARTH_GM, planetRadius: EARTH_RADIUS, radius: r, speedFactor: 1 })
    const e = orbitEnergyAt(EARTH_GM, r, circle.energy)
    expect(e.total).toBeCloseTo(-e.kinetic, 6)
    expect(e.potential).toBeCloseTo(2 * e.total, 6)
    expect(() => orbitEnergyAt(EARTH_GM, 3 * r, circle.energy)).toThrow(RangeError)
  })
})
