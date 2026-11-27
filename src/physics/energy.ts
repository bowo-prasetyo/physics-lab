/**
 * Work and mechanical energy for Newtonian mechanics (SI units).
 * Work is signed; potential energy is defined relative to an explicit zero.
 *
 * The Force Lab uses workOnForceLabBlock to show the work done by each force
 * and the block's kinetic energy; Circular motion and orbits uses
 * orbitEnergyAt (in circularOrbits.ts) for kinetic and potential energy along
 * an orbit.
 */
import type { ForceLabResult } from './forceLab'
import { EARTH_SURFACE_GRAVITY } from './gravity'

function finite(name: string, value: number): void {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`)
}
export function kineticEnergy(mass: number, speed: number): number {
  finite('mass', mass); finite('speed', speed)
  if (mass <= 0) throw new RangeError('Mass must be greater than zero')
  return 0.5 * mass * speed ** 2
}
/** Work by a constant force over a straight displacement; angle is in degrees. */
export function workByConstantForce(force: number, displacement: number, angleDeg = 0): number {
  finite('force', force); finite('displacement', displacement); finite('angleDeg', angleDeg)
  return force * displacement * Math.cos(angleDeg * Math.PI / 180)
}
/** Near a planet's surface, with height measured from the chosen zero level. */
export function gravitationalPotentialEnergy(mass: number, height: number, g = EARTH_SURFACE_GRAVITY): number {
  finite('mass', mass); finite('height', height); finite('g', g)
  if (mass <= 0 || g < 0) throw new RangeError('Mass must be positive and g cannot be negative')
  return mass * g * height
}
export interface WorkEnergyResult {
  readonly initialKineticEnergy: number
  readonly netWork: number
  readonly finalKineticEnergy: number
  readonly finalSpeed: number
}
/** Work–energy theorem: Kf = Ki + ΣW. The final direction is not determined. */
export function applyWorkEnergyTheorem(mass: number, initialSpeed: number, works: readonly number[]): WorkEnergyResult {
  const initialKineticEnergy = kineticEnergy(mass, initialSpeed)
  for (const work of works) finite('work', work)
  const netWork = works.reduce((sum, work) => sum + work, 0)
  const rawFinal = initialKineticEnergy + netWork
  const roundoff = 1e-12 * Math.max(1, initialKineticEnergy, Math.abs(netWork))
  if (rawFinal < -roundoff) throw new RangeError('The stated work would require negative final kinetic energy')
  const finalKineticEnergy = Math.max(0, rawFinal)
  return { initialKineticEnergy, netWork, finalKineticEnergy, finalSpeed: Math.sqrt(2 * finalKineticEnergy / mass) }
}

/** The work done by each force on the Force Lab block during one trial (J). */
export interface ForceLabWork {
  readonly applied: number
  readonly friction: number
  /** Work by the weight's component along the slope: −(change in gravitational potential energy). */
  readonly gravity: number
  /** The normal force is perpendicular to the motion, so it does no work. */
  readonly normal: number
  readonly net: number
  /** Kinetic energy at the end of the trial. The block starts from rest, so this is also the change. */
  readonly finalKineticEnergy: number
}

/**
 * Work by each force over the block's displacement in one Force Lab trial.
 * The forces are constant and parallel to the surface, so each does work
 * F·d along it, and the net work equals the final kinetic energy (from rest).
 */
export function workOnForceLabBlock(result: ForceLabResult, mass: number): ForceLabWork {
  const along = (id: string) => result.forces.find((f) => f.id === id)?.x ?? 0
  const d = result.displacement
  const applied = along('applied') * d
  const friction = along('friction') * d
  const gravity = along('weight-parallel') * d
  return {
    applied, friction, gravity, normal: 0,
    net: applied + friction + gravity,
    finalKineticEnergy: kineticEnergy(mass, result.velocity),
  }
}
