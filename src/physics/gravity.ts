/**
 * Gravitational time dilation outside a spherical, non-rotating mass
 * (the Schwarzschild solution of general relativity). SI units.
 *
 * Near the Earth the effects are tiny (a clock is slowed by about 7 parts in
 * 10¹⁰), so every rate here is computed as a *deficit*, 1 − dτ/dt, using
 *
 *   1 − √(1 − x) = x / (1 + √(1 − x)),
 *
 * which keeps full precision. Subtracting rates of order 1 directly would
 * lose differences such as the 4 × 10⁻¹⁷ between clocks 33 cm apart.
 */

import { SPEED_OF_LIGHT } from './relativity'

/** Newtonian constant of gravitation (m³ kg⁻¹ s⁻²), CODATA 2018. */
export const G = 6.6743e-11
/** Gravitational acceleration at the Earth's surface used throughout Physica's near-surface models (m/s²). */
export const EARTH_SURFACE_GRAVITY = 9.81
export const SECONDS_PER_DAY = 86_400
/** Solar mass (kg): (1.98847 ± 0.00007) × 10³⁰, from the IAU 2015 nominal GM☉ and CODATA 2018 G. */
export const SOLAR_MASS = 1.98847e30

const C2 = SPEED_OF_LIGHT * SPEED_OF_LIGHT

export interface Body {
  readonly id: 'earth' | 'sun' | 'white-dwarf' | 'neutron-star' | 'black-hole'
  readonly name: string
  /** Mass (kg). */
  readonly mass: number
  /** Surface radius (m). For a black hole, the horizon radius. */
  readonly radius: number
  /** False for a black hole: clocks may sit anywhere outside the horizon. */
  readonly hasSurface: boolean
}

/**
 * Earth: mass (5.9722 ± 0.0006) × 10²⁴ kg (IAU 2009 system of astronomical constants), mean radius 6371 km (IUGG).
 * Sun: nominal radius 6.957 × 10⁸ m (IAU 2015 Resolution B3). Sirius B: 1.018 solar masses, 0.0084 solar radii (Bond et al. 2017, ApJ 840, 70). A typical 1.4-solar-mass, 12 km neutron star; an illustrative black hole.
 */
export const BODIES: readonly Body[] = [
  { id: 'earth', name: 'Earth', mass: 5.9722e24, radius: 6.371e6, hasSurface: true },
  { id: 'sun', name: 'Sun', mass: SOLAR_MASS, radius: 6.957e8, hasSurface: true },
  { id: 'white-dwarf', name: 'White dwarf (Sirius B)', mass: 1.018 * SOLAR_MASS, radius: 5.84e6, hasSurface: true },
  { id: 'neutron-star', name: 'Neutron star', mass: 1.4 * SOLAR_MASS, radius: 1.2e4, hasSurface: true },
  { id: 'black-hole', name: 'Black hole (10 solar masses)', mass: 10 * SOLAR_MASS, radius: schwarzschildRadius(10 * SOLAR_MASS), hasSurface: false },
]

/** Schwarzschild radius r_s = 2GM/c² (m): the horizon radius if all the mass were inside it. */
export function schwarzschildRadius(mass: number): number {
  return (2 * G * mass) / C2
}

/** Surface gravity g = GM/R² (m/s²). */
export function surfaceGravity(mass: number, radius: number): number {
  return (G * mass) / (radius * radius)
}

/** 1 − √(1 − x), computed without cancellation. */
function oneMinusSqrtOneMinus(x: number): number {
  return x / (1 + Math.sqrt(1 - x))
}

/**
 * How much slower a clock held at rest at radius r runs than a clock far
 * away: 1 − dτ/dt with dτ/dt = √(1 − r_s/r). Valid only outside the horizon
 * (and outside the body, which the caller must ensure).
 */
export function staticClockDeficit(mass: number, r: number): number {
  const x = schwarzschildRadius(mass) / r
  if (!(x < 1)) throw new RangeError('a clock cannot be held at rest at or inside the horizon')
  return oneMinusSqrtOneMinus(x)
}

/** Rate of a static clock relative to a far-away clock, dτ/dt = √(1 − r_s/r). */
export function staticClockRate(mass: number, r: number): number {
  return 1 - staticClockDeficit(mass, r)
}

/**
 * Deficit of a clock on a circular orbit (free fall) at radius r:
 * dτ/dt = √(1 − 3GM/(rc²)). This exact Schwarzschild result includes both the
 * gravitational effect and the effect of the orbital speed. Requires r above
 * the photon sphere, r > 1.5 r_s.
 */
export function orbitingClockDeficit(mass: number, r: number): number {
  const x = (1.5 * schwarzschildRadius(mass)) / r
  if (!(x < 1)) throw new RangeError('no circular orbit at or inside the photon sphere')
  return oneMinusSqrtOneMinus(x)
}

/** Speed of a circular orbit, √(GM/r) (m/s), as measured by a static observer at infinity in the weak-field limit. */
export function circularOrbitSpeed(mass: number, r: number): number {
  return Math.sqrt((G * mass) / r)
}

/**
 * Fractional rate of clock B relative to clock A, rate_B / rate_A − 1, from
 * their deficits. Positive when B runs faster.
 */
export function relativeRate(deficitA: number, deficitB: number): number {
  return (deficitA - deficitB) / (1 - deficitA)
}

/**
 * Light sent between static observers: received frequency ÷ emitted
 * frequency, minus 1. Positive (blueshift) when the light falls inwards.
 * Both observers agree on these numbers.
 */
export function gravitationalFrequencyShift(mass: number, rEmit: number, rReceive: number): number {
  return relativeRate(staticClockDeficit(mass, rReceive), staticClockDeficit(mass, rEmit))
}

/** Near-surface approximation of the fractional rate difference for a height h: g h / c². */
export function weakFieldShift(g: number, h: number): number {
  return (g * h) / C2
}

/**
 * Radial distance between r1 < r2 measured with rulers held at rest:
 * ∫ dr / √(1 − r_s/r) = [√(r(r − r_s)) + r_s ln(√r + √(r − r_s))] from r1 to r2.
 * It is larger than r2 − r1: space around the mass is curved.
 */
export function properRadialDistance(mass: number, r1: number, r2: number): number {
  const rs = schwarzschildRadius(mass)
  if (!(r1 >= rs && r2 >= r1)) throw new RangeError('need r_s ≤ r1 ≤ r2')
  const F = (r: number) => Math.sqrt(r * (r - rs)) + rs * Math.log(Math.sqrt(r) + Math.sqrt(r - rs))
  return F(r2) - F(r1)
}

/** Breakdown of a GPS satellite clock's rate relative to a clock on the ground. */
export interface GpsBreakdown {
  /** From being higher up (weaker gravity): makes the satellite clock faster. */
  readonly gravity: number
  /** From the orbital speed: makes the satellite clock slower. */
  readonly velocity: number
  /** Total fractional rate difference, satellite relative to ground. */
  readonly net: number
}

/** Typical GPS orbit radius (m): about 20 200 km above the surface. */
/** GPS orbital radius (m): semi-major axis of about 26 560 km (GPS interface specification IS-GPS-200). */
export const GPS_ORBIT_RADIUS = 2.656e7

/**
 * GPS satellite clock versus a ground clock, both compared with far-away time.
 * The ground clock is treated as static on a non-rotating Earth; Earth's rotation
 * changes the totals by less than 1%.
 */
export function gpsBreakdown(mass: number, groundRadius: number, orbitRadius = GPS_ORBIT_RADIUS): GpsBreakdown {
  const ground = staticClockDeficit(mass, groundRadius)
  const staticAtOrbit = staticClockDeficit(mass, orbitRadius)
  const orbiting = orbitingClockDeficit(mass, orbitRadius)
  const gravity = relativeRate(ground, staticAtOrbit)
  const net = relativeRate(ground, orbiting)
  return { gravity, velocity: net - gravity, net }
}
