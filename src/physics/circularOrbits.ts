/**
 * Circular motion and Newtonian orbits.
 *
 * Any object moving in a circle of radius r at constant speed v accelerates
 * towards the centre at a = v²/r, so it needs a net force m v²/r pointing
 * inwards. For a satellite that force is gravity, GM m/r². Setting the two
 * equal gives the circular-orbit speed v_c = √(GM/r).
 *
 * The experiment launches a satellite horizontally (perpendicular to the line
 * to the planet's centre) at radius r₀ with speed f·v_c. Newton's laws give
 * the path exactly, so no numerical integration is needed: it is the conic
 *
 *   r(θ) = r₀ f² / (1 + (f² − 1) cos θ),
 *
 * with θ measured from the launch point. f = 1 is a circle; 0 < f < √2 an
 * ellipse (the launch point is the farthest point when f < 1 and the closest
 * when f > 1); f ≥ √2 an escape path (parabola at √2, hyperbola above).
 *
 * Assumptions: point-like satellite, spherical planet much heavier than the
 * satellite (it does not move), Newtonian gravity, no air and no other bodies.
 * This is the Newtonian reference that the Geodesic Motion Lab compares with
 * Schwarzschild geodesics.
 */

import { G } from './gravity'

/** The planet used by the experiment: the Earth. */
export const EARTH_GM = 3.986004418e14
export const EARTH_RADIUS = 6.371e6

/** Acceleration needed to move in a circle of radius r at speed v: v²/r (m/s²). */
export function centripetalAcceleration(speed: number, radius: number): number {
  return (speed * speed) / radius
}

/** Gravitational acceleration GM/r² at distance r (m/s²). */
export function gravitationalAcceleration(gm: number, radius: number): number {
  return gm / (radius * radius)
}

/** Circular-orbit speed √(GM/r) (m/s). */
export function circularSpeed(gm: number, radius: number): number {
  return Math.sqrt(gm / radius)
}

/** Escape speed √(2GM/r) (m/s): √2 times the circular speed at the same radius. */
export function escapeSpeed(gm: number, radius: number): number {
  return Math.sqrt((2 * gm) / radius)
}

/** Period of an orbit with semi-major axis a: 2π√(a³/GM) (s). For a circle, a = r. */
export function orbitalPeriod(gm: number, semiMajorAxis: number): number {
  return 2 * Math.PI * Math.sqrt(semiMajorAxis ** 3 / gm)
}

/** GM for a body of mass M (m³/s²). */
export function gravitationalParameter(mass: number): number {
  return G * mass
}

export type OrbitOutcome = 'circle' | 'ellipse' | 'escape' | 'crash'

export interface OrbitLaunch {
  /** GM of the planet (m³/s²). */
  readonly gm: number
  /** Planet radius (m): the path ends if it reaches the surface. */
  readonly planetRadius: number
  /** Launch distance from the planet's centre (m). */
  readonly radius: number
  /** Launch speed as a multiple of the circular speed at that radius. */
  readonly speedFactor: number
}

export interface OrbitPoint {
  readonly x: number
  readonly y: number
}

export interface OrbitResult {
  readonly outcome: OrbitOutcome
  /** Launch speed (m/s). */
  readonly speed: number
  readonly circularSpeed: number
  /** Eccentricity |f² − 1|. */
  readonly eccentricity: number
  /** Closest distance from the centre (m); for a crash, the planet radius. */
  readonly minRadius: number
  /** Farthest distance (m), or Infinity on an escape path. */
  readonly maxRadius: number
  /** Semi-major axis (m) of a bound orbit, otherwise null. */
  readonly semiMajorAxis: number | null
  /** Period (s) of a bound orbit that does not crash, otherwise null. */
  readonly period: number | null
  /** Specific orbital energy v²/2 − GM/r (J/kg): negative when bound. */
  readonly energy: number
  /** Path points in metres, launch point first at (r₀, 0), moving towards +y. */
  readonly points: readonly OrbitPoint[]
}

/** Tolerance on f within which a launch counts as circular. */
export const CIRCULAR_TOLERANCE = 0.005

/**
 * The exact Newtonian path of a horizontal launch. `viewRadius` limits how far
 * an escape path is drawn; `samples` sets the number of points on the path.
 */
export function launchOrbit(launch: OrbitLaunch, viewRadius = launch.radius * 4, samples = 360): OrbitResult {
  const { gm, planetRadius, radius: r0, speedFactor: f } = launch
  if (!(r0 > planetRadius)) throw new RangeError('launch radius must be above the surface')
  if (!(f > 0)) throw new RangeError('speed factor must be positive')
  const vc = circularSpeed(gm, r0)
  const speed = f * vc
  const f2 = f * f
  const eccentricity = Math.abs(f2 - 1)
  const energy = (speed * speed) / 2 - gm / r0
  const p = r0 * f2 // semi-latus rectum
  const radiusAt = (theta: number) => p / (1 + (f2 - 1) * Math.cos(theta))

  const bound = f2 < 2
  const circle = Math.abs(f - 1) <= CIRCULAR_TOLERANCE
  const semiMajorAxis = bound ? r0 / (2 - f2) : null
  const minRadius = f < 1 ? p / (2 - f2) : r0
  const maxRadius = !bound ? Infinity : f < 1 ? r0 : p / (2 - f2)
  const crashes = minRadius < planetRadius

  const points: OrbitPoint[] = []
  // Bound orbits close after one turn; escape paths stop at the edge of the view.
  const thetaMax = bound ? 2 * Math.PI : Math.acos(Math.max(-1, -1 / (f2 - 1))) // asymptote direction
  for (let i = 0; i <= samples; i += 1) {
    const theta = (thetaMax * i) / samples
    const r = radiusAt(theta)
    if (!(r > 0) || r > viewRadius) break
    if (r < planetRadius) {
      points.push(surfacePoint(theta, r, planetRadius, points.at(-1), p, f2))
      break
    }
    points.push({ x: r * Math.cos(theta), y: r * Math.sin(theta) })
  }

  return {
    outcome: crashes ? 'crash' : !bound ? 'escape' : circle ? 'circle' : 'ellipse',
    speed,
    circularSpeed: vc,
    eccentricity,
    minRadius: crashes ? planetRadius : minRadius,
    maxRadius,
    semiMajorAxis,
    period: bound && !crashes ? orbitalPeriod(gm, semiMajorAxis as number) : null,
    energy,
    points,
  }
}

/** The point where a falling path meets the surface, found by bisection on θ. */
function surfacePoint(theta: number, r: number, planetRadius: number, previous: OrbitPoint | undefined, p: number, f2: number): OrbitPoint {
  if (!previous) return { x: r * Math.cos(theta), y: r * Math.sin(theta) }
  let lo = Math.atan2(previous.y, previous.x)
  if (lo < 0) lo += 2 * Math.PI
  let hi = theta
  for (let i = 0; i < 40; i += 1) {
    const mid = (lo + hi) / 2
    if (p / (1 + (f2 - 1) * Math.cos(mid)) > planetRadius) lo = mid
    else hi = mid
  }
  return { x: planetRadius * Math.cos(hi), y: planetRadius * Math.sin(hi) }
}
