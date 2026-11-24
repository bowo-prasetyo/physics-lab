import type { Prediction } from '@/experiments/prediction'

/** One completed collision run. */
export interface CollisionRun {
  readonly mass1: number
  readonly mass2: number
  readonly velocity1: number
  readonly velocity2: number
  readonly restitution: number
  readonly velocity1After: number
  readonly velocity2After: number
}

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9
const equalMassesTargetAtRest = (r: CollisionRun) => close(r.mass1, r.mass2) && close(r.velocity2, 0) && r.velocity1 > 0

/** Equal carts, the second at rest, an elastic collision. */
export function observedElasticSwap(runs: readonly CollisionRun[]): boolean {
  return runs.some((r) => equalMassesTargetAtRest(r) && close(r.restitution, 1))
}

/** Equal carts, the second at rest, a perfectly inelastic collision. */
export function observedStickTogether(runs: readonly CollisionRun[]): boolean {
  return runs.some((r) => equalMassesTargetAtRest(r) && close(r.restitution, 0))
}

/** A partly elastic collision (0 < e < 1). */
export function observedPartlyElastic(runs: readonly CollisionRun[]): boolean {
  return runs.some((r) => r.restitution > 0 && r.restitution < 1)
}

/** A heavy cart (at least five times the mass) hitting a light cart at rest, elastically. */
export function observedHeavyOnLight(runs: readonly CollisionRun[]): boolean {
  return runs.some((r) => r.mass1 >= 5 * r.mass2 && close(r.velocity2, 0) && r.velocity1 > 0 && close(r.restitution, 1))
}

export const PREDICTIONS: readonly Prediction<CollisionRun>[] = [
  {
    id: 'swap',
    minLevel: 'beginner',
    question: 'Cart 1 rolls at 4 m/s into an identical cart 2 at rest. The collision is elastic (e = 1). What happens next?',
    task: 'Give both carts the same mass, cart 2 a velocity of 0 and cart 1 a positive velocity. Set e = 1, run the collision and read the final velocities.',
    options: [
      { id: 'swap', label: 'Cart 1 stops and cart 2 moves off at 4 m/s' },
      { id: 'share', label: 'Both carts move on together at 2 m/s' },
      { id: 'bounce', label: 'Cart 1 bounces back at 4 m/s' },
      { id: 'both-move', label: 'Both carts move forward, cart 2 a little faster' },
    ],
    correct: 'swap',
    explanation:
      'Momentum must stay 8 kg·m/s, and in an elastic collision the kinetic energy must stay too. With equal masses, the only way to keep both is for the carts to swap velocities: cart 1 stops and cart 2 leaves at 4 m/s. You may have seen the same thing with billiard balls or a Newton’s cradle.',
    observed: observedElasticSwap,
    hint: (runs) => (runs.length > 0 && !observedElasticSwap(runs) ? 'Use equal masses, cart 2 at rest and e = 1.' : null),
  },
  {
    id: 'stick',
    minLevel: 'beginner',
    question: 'The same two carts now stick together when they collide (e = 0). How fast do they move afterwards?',
    task: 'Keep equal masses with cart 2 at rest, set e = 0 and run the collision.',
    options: [
      { id: 'same', label: 'At cart 1’s original speed' },
      { id: 'half', label: 'At half of cart 1’s original speed' },
      { id: 'stop', label: 'They stop' },
      { id: 'quarter', label: 'At a quarter of cart 1’s original speed' },
    ],
    correct: 'half',
    explanation:
      'Momentum is still conserved: m·u = 2m·v, so the pair moves at half of cart 1’s speed. Kinetic energy is not conserved here. Half of it is converted to heat, sound and deformation of the carts. Momentum conservation tells you the final speed, but not how much energy survives the impact.',
    observed: observedStickTogether,
    hint: (runs) => (runs.length > 0 && !observedStickTogether(runs) ? 'Use equal masses, cart 2 at rest and e = 0.' : null),
  },
  {
    id: 'conserved',
    minLevel: 'intermediate',
    question: 'In a collision with e = 0.5, which quantity is the same before and after the impact?',
    task: 'Choose a coefficient of restitution between 0 and 1, run a collision and compare momentum and kinetic energy before and after.',
    options: [
      { id: 'momentum', label: 'Total momentum only' },
      { id: 'energy', label: 'Total kinetic energy only' },
      { id: 'both', label: 'Both momentum and kinetic energy' },
      { id: 'neither', label: 'Neither' },
    ],
    correct: 'momentum',
    explanation:
      'During the impact the carts push on each other with equal and opposite forces for the same time, so their impulses cancel and the total momentum is unchanged, whatever e is. Kinetic energy is conserved only when e = 1. For 0 < e < 1 part of it becomes internal energy, and the loss is ΔK = ½μ(1 − e²)(u₁ − u₂)².',
    observed: observedPartlyElastic,
    hint: (runs) => (runs.length > 0 && !observedPartlyElastic(runs) ? 'Choose e between 0 and 1, for example 0.5, and run again.' : null),
  },
  {
    id: 'heavy-light',
    minLevel: 'advanced',
    question: 'A 10 kg cart moving at 4 m/s hits a 1 kg cart at rest, elastically. The light cart’s speed afterwards is closest to…',
    task: 'Make cart 1 at least five times as heavy as cart 2, put cart 2 at rest, set e = 1 and run the collision.',
    options: [
      { id: 'same', label: '4 m/s, the heavy cart’s speed' },
      { id: 'double', label: '7.3 m/s, nearly twice the heavy cart’s speed' },
      { id: 'small', label: '0.4 m/s' },
      { id: 'forty', label: '40 m/s, carrying all of the momentum' },
    ],
    correct: 'double',
    explanation:
      'In the centre-of-mass frame an elastic collision simply reverses each velocity. The centre of mass moves at 40/11 ≈ 3.6 m/s, so the light cart approaches it at −3.6 m/s and leaves at +3.6 m/s relative to it: 7.3 m/s in the lab, v₂ = 2m₁u₁/(m₁ + m₂). As m₁/m₂ grows, the light cart approaches twice the heavy cart’s speed. Spacecraft use the same idea in a gravitational slingshot around a planet.',
    observed: observedHeavyOnLight,
    hint: (runs) => (runs.length > 0 && !observedHeavyOnLight(runs) ? 'Make cart 1 at least five times heavier than cart 2, with cart 2 at rest and e = 1.' : null),
  },
]
