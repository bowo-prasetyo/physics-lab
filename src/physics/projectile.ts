/**
 * Projectile motion near a planet's surface, with optional quadratic air drag.
 * SI units; y is height above the ground, x horizontal distance.
 *
 * Without drag the motion has an exact solution, and the two directions are
 * independent: x(t) = x₀ + v₀ cos θ · t, y(t) = h + v₀ sin θ · t − ½ g t².
 *
 * With drag, a = −g ŷ − k |v| v (k = ρ C_d A / 2m), the directions are coupled
 * and there is no closed form, so the motion is integrated numerically with
 * the classical fourth-order Runge–Kutta method (RK4). Drag removes energy, so
 * a symplectic integrator (which preserves energy-like quantities) has no
 * advantage here; RK4's high accuracy does.
 */

import { EARTH_SURFACE_GRAVITY } from './gravity'

export interface LaunchParams {
  /** Launch speed (m/s). */
  readonly speed: number
  /** Launch angle above the horizontal (degrees). */
  readonly angleDeg: number
  /** Launch height above the ground (m). */
  readonly height: number
  /** Gravitational acceleration (m/s²). */
  readonly g: number
  /** Drag constant k = ρ C_d A / (2m) (1/m); 0 for no air. */
  readonly k: number
}

export interface ProjectileState {
  readonly t: number
  readonly x: number
  readonly y: number
  readonly vx: number
  readonly vy: number
}

export interface Planet {
  readonly id: 'earth' | 'moon' | 'mars' | 'jupiter'
  readonly name: string
  /** Surface gravity (m/s²). */
  readonly g: number
  /** Air density near the surface (kg/m³); 0 if there is no atmosphere. */
  readonly airDensity: number
}

export const PLANETS: readonly Planet[] = [
  { id: 'earth', name: 'Earth', g: EARTH_SURFACE_GRAVITY, airDensity: 1.225 },
  { id: 'moon', name: 'Moon', g: 1.62, airDensity: 0 },
  { id: 'mars', name: 'Mars', g: 3.71, airDensity: 0.02 },
  // Jupiter has no solid surface; values are for its cloud tops, where the pressure is about 1 bar.
  { id: 'jupiter', name: 'Jupiter (cloud tops)', g: 24.79, airDensity: 0.16 },
]

/** A regulation baseball: mass 0.145 kg, diameter 7.4 cm, drag coefficient about 0.35. */
export const BASEBALL = { mass: 0.145, diameter: 0.074, dragCoefficient: 0.35 } as const

/** Drag constant k = ρ C_d A / (2m) for a ball in air of the given density (1/m). */
export function dragConstant(airDensity: number, ball: { mass: number; diameter: number; dragCoefficient: number } = BASEBALL): number {
  const area = Math.PI * (ball.diameter / 2) ** 2
  return (airDensity * ball.dragCoefficient * area) / (2 * ball.mass)
}

/** Speed at which drag balances gravity, √(g/k) (m/s). */
export function terminalSpeed(g: number, k: number): number {
  return k > 0 ? Math.sqrt(g / k) : Infinity
}

export function launchState(p: LaunchParams): ProjectileState {
  const theta = (p.angleDeg * Math.PI) / 180
  return { t: 0, x: 0, y: p.height, vx: p.speed * Math.cos(theta), vy: p.speed * Math.sin(theta) }
}

/** Exact position and velocity without drag. */
export function exactState(p: LaunchParams, t: number): ProjectileState {
  const s = launchState(p)
  return { t, x: s.vx * t, y: s.y + s.vy * t - 0.5 * p.g * t * t, vx: s.vx, vy: s.vy - p.g * t }
}

/** Exact time to land without drag: positive root of h + v_y t − ½ g t² = 0. */
export function exactFlightTime(p: LaunchParams): number {
  const { vy, y } = launchState(p)
  return (vy + Math.sqrt(vy * vy + 2 * p.g * y)) / p.g
}

export function exactRange(p: LaunchParams): number {
  return launchState(p).vx * exactFlightTime(p)
}

export function exactMaxHeight(p: LaunchParams): number {
  const { vy, y } = launchState(p)
  return vy > 0 ? y + (vy * vy) / (2 * p.g) : y
}

/** Kinetic plus gravitational potential energy per kilogram (J/kg). */
export function specificEnergy(s: ProjectileState, g: number): number {
  return 0.5 * (s.vx * s.vx + s.vy * s.vy) + g * s.y
}

type Derivative = readonly [number, number, number, number]

function derivative(s: { vx: number; vy: number }, g: number, k: number): Derivative {
  const speed = Math.hypot(s.vx, s.vy)
  return [s.vx, s.vy, -k * speed * s.vx, -g - k * speed * s.vy]
}

/** One classical RK4 step of length dt. */
export function rk4Step(s: ProjectileState, g: number, k: number, dt: number): ProjectileState {
  const at = (base: ProjectileState, d: Derivative, h: number) => ({
    vx: base.vx + d[2] * h,
    vy: base.vy + d[3] * h,
  })
  const k1 = derivative(s, g, k)
  const k2 = derivative(at(s, k1, dt / 2), g, k)
  const k3 = derivative(at(s, k2, dt / 2), g, k)
  const k4 = derivative(at(s, k3, dt), g, k)
  const w = (i: 0 | 1 | 2 | 3) => (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) / 6
  return { t: s.t + dt, x: s.x + w(0) * dt, y: s.y + w(1) * dt, vx: s.vx + w(2) * dt, vy: s.vy + w(3) * dt }
}

/**
 * The whole flight, sampled every dt seconds, ending exactly on the ground
 * (y = 0), which is found by bisecting the final step.
 */
export function simulateFlight(p: LaunchParams, dt = 0.005, maxTime = 600): ProjectileState[] {
  let s = launchState(p)
  const states: ProjectileState[] = [s]
  if (s.y <= 0 && s.vy <= 0) return states
  while (s.t < maxTime) {
    const next = rk4Step(s, p.g, p.k, dt)
    if (next.y < 0) {
      let lo = 0
      let hi = dt
      for (let i = 0; i < 60; i++) {
        const mid = (lo + hi) / 2
        if (rk4Step(s, p.g, p.k, mid).y > 0) lo = mid
        else hi = mid
      }
      const landed = rk4Step(s, p.g, p.k, hi)
      states.push({ ...landed, y: 0 })
      return states
    }
    states.push(next)
    s = next
  }
  return states
}

/** Horizontal distance travelled before landing. */
export function simulatedRange(p: LaunchParams, dt = 0.005): number {
  const states = simulateFlight(p, dt)
  return (states[states.length - 1] as ProjectileState).x
}

/** Launch angle (degrees) giving the greatest range, by golden-section search. */
export function optimalAngle(p: Omit<LaunchParams, 'angleDeg'>, dt = 0.005): number {
  const range = (angleDeg: number) => simulatedRange({ ...p, angleDeg }, dt)
  const phi = (Math.sqrt(5) - 1) / 2
  let a = 0.5
  let b = 89.5
  let c = b - phi * (b - a)
  let d = a + phi * (b - a)
  let fc = range(c)
  let fd = range(d)
  while (b - a > 0.05) {
    if (fc > fd) {
      b = d
      d = c
      fd = fc
      c = b - phi * (b - a)
      fc = range(c)
    } else {
      a = c
      c = d
      fc = fd
      d = a + phi * (b - a)
      fd = range(d)
    }
  }
  return (a + b) / 2
}

/** Interpolated state at time t from a sampled flight (clamped to the flight). */
export function stateAtTime(flight: readonly ProjectileState[], t: number): ProjectileState {
  const first = flight[0] as ProjectileState
  const last = flight[flight.length - 1] as ProjectileState
  if (t <= first.t) return first
  if (t >= last.t) return last
  let lo = 0
  let hi = flight.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if ((flight[mid] as ProjectileState).t <= t) lo = mid
    else hi = mid
  }
  const a = flight[lo] as ProjectileState
  const b = flight[hi] as ProjectileState
  const f = (t - a.t) / (b.t - a.t)
  const mix = (u: number, v: number) => u + (v - u) * f
  return { t, x: mix(a.x, b.x), y: mix(a.y, b.y), vx: mix(a.vx, b.vx), vy: mix(a.vy, b.vy) }
}
