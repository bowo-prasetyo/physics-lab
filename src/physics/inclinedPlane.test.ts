import { describe, expect, it } from 'vitest'
import { gravitationalPotential, inclineFromRest } from './inclinedPlane'

describe('inclinedPlane', () => {
  const m = 2
  const L = 5
  const theta = Math.PI / 6 // 30°
  const g = 9.81

  it('frictionless: speed depends only on height', () => {
    const r = inclineFromRest(m, L, theta, 0, 0, g)
    expect(r.staysAtRest).toBe(false)
    expect(r.height).toBeCloseTo(L * 0.5, 12)
    // v = √(2 g h)
    expect(r.speedAtBottom).toBeCloseTo(Math.sqrt(2 * g * r.height), 10)
    expect(r.workByFriction).toBe(0)
  })

  it('same height, different angle: same frictionless speed', () => {
    const h = 2
    const L1 = h / Math.sin(Math.PI / 6)
    const L2 = h / Math.sin(Math.PI / 4)
    const r1 = inclineFromRest(1, L1, Math.PI / 6, 0, 0, g)
    const r2 = inclineFromRest(1, L2, Math.PI / 4, 0, 0, g)
    expect(r1.speedAtBottom).toBeCloseTo(r2.speedAtBottom!, 10)
  })

  it('static friction can hold the block', () => {
    // At 10°, μ_s = 0.3 is enough (tan 10° ≈ 0.176)
    const r = inclineFromRest(1, 3, (10 * Math.PI) / 180, 0.2, 0.3, g)
    expect(r.staysAtRest).toBe(true)
    expect(r.speedAtBottom).toBeNull()
  })

  it('kinetic friction reduces final kinetic energy', () => {
    const frictionless = inclineFromRest(m, L, theta, 0, 0, g)
    const withFriction = inclineFromRest(m, L, theta, 0.15, 0.15, g)
    expect(withFriction.kineticAtBottom!).toBeLessThan(frictionless.kineticAtBottom!)
    expect(withFriction.workByFriction).toBeLessThan(0)
  })

  it('energy balance: ΔU + W_friction = −ΔK (signs)', () => {
    const r = inclineFromRest(m, L, theta, 0.1, 0.1, g)
    const deltaU = -gravitationalPotential(m, r.height, g) // loss of PE
    const deltaK = r.kineticAtBottom!
    // Work–energy: ΔK = −ΔU_g + W_friction  (W_friction ≤ 0)
    expect(deltaK).toBeCloseTo(-deltaU + r.workByFriction, 8)
  })
})
