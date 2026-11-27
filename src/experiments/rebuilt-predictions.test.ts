import { describe, expect, it } from 'vitest'
import { LEVELS } from '@/levels'
import type { Prediction } from '@/experiments/prediction'
import { calculateForceLab, type ForceLabInput } from '@/physics/forceLab'
import { calculateLengthContraction, calculateMomentumCollision, workOnForceLabBlock } from '@/physics'
import * as force from './force-lab/predictions'
import * as length from './length-contraction/predictions'
import * as momentum from './momentum-collisions/predictions'
import * as geodesic from './geodesic-motion/predictions'
import { calculateGeodesic, integrationFor, nearCircularShift, newtonianReference, periapsisShiftPerOrbit } from './geodesic-motion/geodesic'

function checkBank<Run>(bank: readonly Prediction<Run>[]) {
  for (const level of LEVELS) expect(bank.some((p) => p.minLevel === level.id), `a question for ${level.id}`).toBe(true)
  expect(new Set(bank.map((p) => p.id)).size).toBe(bank.length)
  for (const p of bank) expect(p.options.map((o) => o.id)).toContain(p.correct)
}

// Each trial is built from the physics engine, so the tests exercise the same numbers the learner sees.
function trial(over: Partial<ForceLabInput>): force.ForceTrial {
  const input: ForceLabInput = { scenario: 'horizontal', mass: 5, appliedForce: 30, staticFrictionCoefficient: 0.4, kineticFrictionCoefficient: 0.2, inclineAngle: 0, duration: 2, ...over }
  const r = calculateForceLab(input)
  return { ...input, frictionRegime: r.frictionRegime, frictionForce: r.frictionForce, normalForce: r.normalForce, netForce: r.netForce, acceleration: r.acceleration, displacement: r.displacement, frictionWork: workOnForceLabBlock(r, input.mass).friction }
}

describe('Force Lab predictions', () => {
  it('has a question for every level', () => checkBank(force.PREDICTIONS))

  it('a 10 N push on a 5 kg block is held by 10 N of static friction', () => {
    const held = trial({ appliedForce: 10 })
    expect(held.frictionRegime).toBe('static')
    expect(held.frictionForce).toBeCloseTo(10, 10)
    expect(force.observedHeldAtRest([held])).toBe(true)
    expect(force.observedHeldAtRest([trial({})])).toBe(false)
  })

  it('friction work is observed only when the block actually slides on the level floor', () => {
    expect(force.observedFrictionWork([trial({ appliedForce: 10 })])).toBe(false) // held at rest: no work
    const sliding = trial({})
    expect(sliding.frictionWork).toBeLessThan(0)
    expect(force.observedFrictionWork([sliding])).toBe(true)
    expect(force.observedFrictionWork([trial({ scenario: 'incline', inclineAngle: 30, appliedForce: 0, staticFrictionCoefficient: 0.2, kineticFrictionCoefficient: 0.1 })])).toBe(false)
    const card = force.PREDICTIONS.find((p) => p.id === 'friction-work')!
    expect(card.hint!([trial({ appliedForce: 10 })])).toContain('stayed at rest')
  })

  it('breakaway needs a held and a sliding trial on the same block and surface', () => {
    const held = trial({ appliedForce: 10 })
    const sliding = trial({ appliedForce: 30 })
    expect(sliding.frictionForce).toBeLessThan(sliding.staticFrictionCoefficient * sliding.normalForce)
    expect(force.observedBreakaway([held, sliding])).toBe(true)
    expect(force.observedBreakaway([held, trial({ appliedForce: 30, mass: 2 })])).toBe(false)
    expect(force.PREDICTIONS.find((p) => p.id === 'breakaway')?.hint?.([held])).toMatch(/increase only the push/)
  })

  it('the normal force on a 30° incline is mg cos θ', () => {
    const t = trial({ scenario: 'incline', inclineAngle: 30, appliedForce: 0 })
    expect(t.normalForce).toBeCloseTo(5 * 9.81 * Math.cos(Math.PI / 6), 10)
    expect(force.observedInclineNormal([t])).toBe(true)
    expect(force.observedInclineNormal([trial({ scenario: 'incline', inclineAngle: 5 })])).toBe(false)
  })

  it('the angle at which sliding starts does not depend on mass', () => {
    for (const angle of [20, 21, 22, 25]) {
      const light = trial({ scenario: 'incline', inclineAngle: angle, appliedForce: 0, mass: 1 })
      const heavy = trial({ scenario: 'incline', inclineAngle: angle, appliedForce: 0, mass: 20 })
      expect(light.frictionRegime).toBe(heavy.frictionRegime)
      expect(light.frictionRegime).toBe(Math.tan(angle * Math.PI / 180) > 0.4 ? 'kinetic' : 'static')
      expect(light.acceleration).toBeCloseTo(heavy.acceleration, 10)
      expect(force.observedMassIndependence([light, heavy])).toBe(true)
    }
    expect(force.observedMassIndependence([trial({ scenario: 'incline', inclineAngle: 20, appliedForce: 5, mass: 1 }), trial({ scenario: 'incline', inclineAngle: 20, appliedForce: 5, mass: 2 })])).toBe(false)
  })
})

describe('Length Contraction predictions', () => {
  const measure = (beta: number, properLength = 10): length.LengthMeasurement => ({ beta, properLength, measuredLength: calculateLengthContraction(properLength, beta).measuredLength })

  it('has a question for every level', () => checkBank(length.PREDICTIONS))

  it('the numbers in the questions match the model', () => {
    expect(measure(0.8).measuredLength).toBeCloseTo(6, 10)
    expect(measure(0).measuredLength).toBe(10)
    const ratio = (10 - measure(0.8).measuredLength) / (10 - measure(0.4).measuredLength)
    expect(ratio).toBeGreaterThan(4.5)
    expect(ratio).toBeLessThan(5)
    // The front event is earlier in the ship frame: Δt′ = −vL₀/c² < 0.
    expect(calculateLengthContraction(10, 0.8).frontEventTimeInRestFrame).toBeLessThan(0)
  })

  it('observations need the right measurements', () => {
    expect(length.observedFastMeasurement([measure(0.2)])).toBe(false)
    expect(length.observedFastMeasurement([measure(0.6)])).toBe(true)
    expect(length.observedAtRest([measure(0)])).toBe(true)
    expect(length.observedDoubledSpeed([measure(0.4), measure(0.8)])).toBe(true)
    expect(length.observedDoubledSpeed([measure(0.4, 10), measure(0.8, 12)])).toBe(false)
    expect(length.PREDICTIONS.find((p) => p.id === 'doubling')?.hint?.([measure(0.4)])).toMatch(/0\.80c/)
  })
})

describe('Momentum predictions', () => {
  const run = (mass1: number, mass2: number, velocity1: number, velocity2: number, restitution: number): momentum.CollisionRun => {
    const r = calculateMomentumCollision({ mass1, mass2, velocity1, velocity2, restitution })
    return { mass1, mass2, velocity1, velocity2, restitution, velocity1After: r.velocity1After, velocity2After: r.velocity2After }
  }

  it('has a question for every level', () => checkBank(momentum.PREDICTIONS))

  it('the answers match the collision model', () => {
    const swap = run(2, 2, 4, 0, 1)
    expect(swap.velocity1After).toBeCloseTo(0, 10)
    expect(swap.velocity2After).toBeCloseTo(4, 10)
    const stick = run(2, 2, 4, 0, 0)
    expect(stick.velocity1After).toBeCloseTo(2, 10)
    expect(stick.velocity2After).toBeCloseTo(2, 10)
    const partly = calculateMomentumCollision({ mass1: 2, mass2: 3, velocity1: 4, velocity2: -1, restitution: 0.5 })
    expect(partly.momentumAfter).toBeCloseTo(partly.momentumBefore, 10)
    expect(partly.kineticEnergyLost).toBeGreaterThan(0)
    expect(run(10, 1, 4, 0, 1).velocity2After).toBeCloseTo(80 / 11, 10)
  })

  it('observations need the right collisions', () => {
    expect(momentum.observedElasticSwap([run(2, 2, 4, 0, 1)])).toBe(true)
    expect(momentum.observedElasticSwap([run(2, 3, 4, 0, 1)])).toBe(false)
    expect(momentum.observedStickTogether([run(3, 3, 2, 0, 0)])).toBe(true)
    expect(momentum.observedPartlyElastic([run(2, 2, 4, 0, 0.5)])).toBe(true)
    expect(momentum.observedPartlyElastic([run(2, 2, 4, 0, 1)])).toBe(false)
    expect(momentum.observedHeavyOnLight([run(10, 1, 4, 0, 1)])).toBe(true)
    expect(momentum.observedHeavyOnLight([run(4, 1, 4, 0, 1)])).toBe(false)
  })
})

describe('Geodesic Motion predictions', () => {
  const orbit = (radius: number, angular: number, radialVelocity = 0): geodesic.OrbitRun => {
    const relativistic = calculateGeodesic({ initialRadius: radius, angularMomentumFactor: angular, radialVelocity, ...integrationFor(radius) })
    return { radius, angular, radialVelocity, captured: relativistic.captured, periapses: relativistic.periapses, shiftPerOrbit: relativistic.captured ? null : periapsisShiftPerOrbit(relativistic) }
  }

  it('has a question for every level', () => checkBank(geodesic.PREDICTIONS))

  it('measures a periapsis shift close to the near-circular formula, and none for Newtonian gravity', () => {
    for (const r of [8, 12]) {
      const shift = orbit(r, 0.995).shiftPerOrbit
      expect(shift).not.toBeNull()
      expect(Math.abs((shift as number) - nearCircularShift(r)) / nearCircularShift(r)).toBeLessThan(0.05)
      const newton = newtonianReference({ initialRadius: r, angularMomentumFactor: 0.995, radialVelocity: 0, ...integrationFor(r) })
      expect(Math.abs(periapsisShiftPerOrbit(newton) ?? 0)).toBeLessThan(0.05)
    }
  })

  it('the shift shrinks with distance and matches the numbers in the questions', () => {
    expect(nearCircularShift(5)).toBeCloseTo(209.2, 0)
    expect(nearCircularShift(12)).toBeCloseTo(55.7, 0)
    expect((orbit(5, 0.985).shiftPerOrbit as number)).toBeGreaterThan(orbit(12, 0.985).shiftPerOrbit as number)
    // Weak-field estimate 3π r_s/r for Mercury, about 2 × 10⁷ r_s from the Sun: about 0.1 arcseconds.
    const arcsec = (3 * Math.PI / 2e7) * (180 / Math.PI) * 3600
    expect(arcsec).toBeGreaterThan(0.08)
    expect(arcsec).toBeLessThan(0.12)
  })

  it('observations need the right orbits', () => {
    expect(geodesic.observedPerturbedOrbit([orbit(8, 0.985)])).toBe(true)
    expect(geodesic.observedPerturbedOrbit([orbit(3.2, 0.985)])).toBe(false) // captured
    expect(geodesic.observedCircularOrbit([orbit(8, 1)])).toBe(true)
    expect(geodesic.observedDistanceTrend([orbit(5, 0.985), orbit(12, 0.985)])).toBe(true)
    expect(geodesic.observedDistanceTrend([orbit(8, 0.985), orbit(9, 0.985)])).toBe(false)
    expect(geodesic.observedWeakField([orbit(10, 0.995)])).toBe(true)
    expect(geodesic.observedWeakField([orbit(8, 0.995)])).toBe(false)
  })
})
