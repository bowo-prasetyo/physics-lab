/**
 * Closed-form kinematics.
 *
 * These are exact analytic solutions, so experiments that use them have no
 * numerical-integration error. Units are SI throughout (metres, seconds).
 */

import { add, scale, type Vec3 } from './vector'

/** Uniform motion in one dimension: x(t) = x₀ + v·t. */
export function uniformPosition(x0: number, v: number, t: number): number {
  return x0 + v * t
}

/** Uniform motion in three dimensions: r(t) = r₀ + v·t. */
export function uniformPosition3(r0: Vec3, v: Vec3, t: number): Vec3 {
  return add(r0, scale(v, t))
}

/** Constant acceleration in one dimension: x(t) = x₀ + v₀·t + ½·a·t². */
export function constantAccelerationPosition(x0: number, v0: number, a: number, t: number): number {
  return x0 + v0 * t + 0.5 * a * t * t
}

/**
 * Time at which uniform motion starting at x0 with velocity v reaches the
 * position `target`, or `null` if it never does at a time t ≥ 0.
 */
export function timeToReach(x0: number, v: number, target: number): number | null {
  if (v === 0) return x0 === target ? 0 : null
  const t = (target - x0) / v
  return t >= 0 ? t : null
}
