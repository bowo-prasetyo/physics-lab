/**
 * Special relativity in one space dimension.
 *
 * Units: c = 1. Times are in seconds, distances in light-seconds (the distance
 * light travels in one second, about 300 000 km), and velocities are fractions
 * of the speed of light (β = v/c). In these units light moves along lines at
 * 45° on a spacetime diagram, and formulas lose their factors of c.
 */

import type { Event1D } from './frames'
import { lorentzFactor } from './relativity'

export const ORIGIN: Event1D = { t: 0, x: 0 }

/** γ for a velocity given as a fraction of c. */
export function gamma(beta: number): number {
  return lorentzFactor(beta, 1)
}

/**
 * Lorentz boost: coordinates of an event for an observer moving at velocity
 * β along x, whose origin coincides with ours.
 *
 *   t' = γ (t − β x),   x' = γ (x − β t)
 */
export function lorentzBoost(event: Event1D, beta: number): Event1D {
  const g = gamma(beta)
  return { t: g * (event.t - beta * event.x), x: g * (event.x - beta * event.t) }
}

/**
 * Squared spacetime interval between two events, s² = Δt² − Δx² (c = 1).
 * Positive for timelike separation, zero along a light ray. Every inertial
 * observer computes the same value.
 */
export function intervalSquared(a: Event1D, b: Event1D = ORIGIN): number {
  const dt = a.t - b.t
  const dx = a.x - b.x
  return dt * dt - dx * dx
}

/**
 * Relativistic velocity transformation: velocity w (measured in our frame) as
 * measured by an observer moving at u.
 *
 *   w' = (w − u) / (1 − w u)
 *
 * Light stays at ±1 for every observer.
 */
export function velocityInFrame(w: number, u: number): number {
  if (!(Math.abs(u) < 1)) throw new RangeError('observer speed must be below c')
  if (!(Math.abs(w) <= 1)) throw new RangeError('speed cannot exceed c')
  return (w - u) / (1 - w * u)
}

/** Rapidity φ = artanh β. Rapidities of successive boosts simply add. */
export function rapidity(beta: number): number {
  if (!(Math.abs(beta) < 1)) throw new RangeError('|β| must be below 1')
  return Math.atanh(beta)
}

/** Where an inertial clock is, and what it reads, at coordinate time t. */
export interface ClockReading {
  readonly t: number
  readonly x: number
  /** Proper time: what the clock itself shows (s). */
  readonly tau: number
}

/**
 * An inertial clock moving at velocity w that passes x = 0 at t = 0, reading
 * 0 at that moment. At coordinate time t it is at x = w t and reads τ = t / γ.
 */
export function inertialClockAt(w: number, t: number): ClockReading {
  return { t, x: w * t, tau: t / gamma(w) }
}

/**
 * Events where an inertial clock (as above) shows a whole multiple of `step`
 * seconds, up to coordinate time `maxT`. Drawn as tick marks on a worldline.
 */
export function properTimeTicks(w: number, maxT: number, step = 1): (Event1D & { tau: number })[] {
  const g = gamma(w)
  const ticks: (Event1D & { tau: number })[] = []
  for (let k = 0; k * step * g <= maxT + 1e-12; k++) {
    const tau = k * step
    ticks.push({ t: g * tau, x: w * g * tau, tau })
  }
  return ticks
}

/**
 * Line of simultaneity of an observer moving at velocity w who is at `event`:
 * every event that observer considers to happen "at the same time". Returns
 * the coordinate time on that line at position x:
 *
 *   t(x) = t_event + w (x − x_event)
 *
 * For w ≠ 0 the line is tilted: observers in relative motion disagree about
 * which distant events are happening "now".
 */
export function simultaneousTimeAt(w: number, event: Event1D, x: number): number {
  return event.t + w * (x - event.x)
}

/**
 * The same Lorentz boost written in spacetime form: a hyperbolic rotation of
 * the 4-vector (ct, x) by the rapidity φ = artanh β,
 *
 *   ct' = ct cosh φ − x sinh φ,   x' = x cosh φ − ct sinh φ.
 *
 * Numerically identical to `lorentzBoost`, but computed from the geometry
 * rather than from γ and β, so the two descriptions can be checked against
 * each other.
 */
export function boostByRapidity(event: Event1D, phi: number): Event1D {
  const ch = Math.cosh(phi)
  const sh = Math.sinh(phi)
  return { t: event.t * ch - event.x * sh, x: event.x * ch - event.t * sh }
}
