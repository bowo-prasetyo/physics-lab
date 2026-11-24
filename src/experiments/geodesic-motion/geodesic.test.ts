import { describe, expect, it } from 'vitest'
import { calculateGeodesic, circularGeodesicAngularMomentum, newtonianReference } from './geodesic'

describe('Schwarzschild geodesic model', () => {
  it('uses the circular-orbit angular momentum in geometric units', () => {
    expect(circularGeodesicAngularMomentum(4)).toBeCloseTo(4 / Math.sqrt(5), 12)
  })
  it('rejects radii at or inside the photon sphere', () => {
    expect(() => calculateGeodesic({ initialRadius: 1.5, angularMomentumFactor: 1, radialVelocity: 0 })).toThrow(RangeError)
  })
  it('keeps an ideal circular orbit at constant radius', () => {
    const run = calculateGeodesic({ initialRadius: 5, angularMomentumFactor: 1, radialVelocity: 0, steps: 1600 })
    expect(run.points.length).toBeGreaterThan(1000)
    expect(Math.max(...run.points.map(p => p.radius)) - Math.min(...run.points.map(p => p.radius))).toBeLessThan(1e-8)
  })
  it('shows relativistic perihelion precession for a perturbed bound orbit', () => {
    const settings = { initialRadius: 8, angularMomentumFactor: 0.985, radialVelocity: 0, steps: 6000 }
    const relativistic = calculateGeodesic(settings)
    const newtonian = newtonianReference(settings)
    expect(relativistic.points.length).toBeGreaterThan(100)
    expect(relativistic.periapses).toBeGreaterThan(1)
    expect(newtonian.periapses).toBeGreaterThan(1)
    expect(relativistic.points.at(-1)!.x).not.toBeCloseTo(newtonian.points.at(-1)!.x, 1)
  })
  it('returns finite points outside the horizon for a short integration', () => {
    const run = calculateGeodesic({ initialRadius: 6, angularMomentumFactor: 1, radialVelocity: 0.01, steps: 100 })
    expect(run.points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y))).toBe(true)
  })
})
