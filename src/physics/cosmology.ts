/**
 * Expanding universes: the Friedmann–Lemaître–Robertson–Walker (FLRW) models.
 *
 * Units: time in Gyr (billions of years), distances in Gly (billions of
 * light-years). Then c = 1 Gly/Gyr, so a recession speed in Gly/Gyr is
 * directly a fraction of the speed of light. The Hubble constant is given in
 * the astronomers' unit km/s/Mpc and converted.
 *
 * The scale factor a(t) has a = 1 today. Every distance between galaxies that
 * are not bound together scales as d(t) = a(t) d₀.
 */

/** 1 km/s/Mpc expressed in 1/Gyr. */
export const KM_S_MPC_PER_GYR = (3.15576e16 /* s per Gyr */ / 3.0856775814913673e19) /* km per Mpc */
/** Temperature of the cosmic microwave background today (K). */
export const CMB_TEMPERATURE_TODAY = 2.7255

export interface Cosmology {
  readonly id: 'our' | 'matter' | 'radiation' | 'lambda'
  readonly name: string
  /** Hubble constant today (km/s/Mpc). */
  readonly h0: number
  /** Density parameters today: radiation, matter, dark energy (Λ). Curvature Ω_k = 1 − their sum. */
  readonly omegaR: number
  readonly omegaM: number
  readonly omegaL: number
}

const H0_PLANCK = 67.66
const OMEGA_R_PLANCK = 9.2e-5
const OMEGA_M_PLANCK = 0.3111

export const COSMOLOGIES: readonly Cosmology[] = [
  // Planck 2018 (flat ΛCDM).
  { id: 'our', name: 'Our universe (ΛCDM, Planck 2018)', h0: H0_PLANCK, omegaR: OMEGA_R_PLANCK, omegaM: OMEGA_M_PLANCK, omegaL: 1 - OMEGA_M_PLANCK - OMEGA_R_PLANCK },
  { id: 'matter', name: 'Matter only', h0: H0_PLANCK, omegaR: 0, omegaM: 1, omegaL: 0 },
  { id: 'radiation', name: 'Radiation only', h0: H0_PLANCK, omegaR: 1, omegaM: 0, omegaL: 0 },
  { id: 'lambda', name: 'Dark energy only (de Sitter)', h0: H0_PLANCK, omegaR: 0, omegaM: 0, omegaL: 1 },
]

/** H₀ in 1/Gyr. */
export function hubbleRateToday(c: Cosmology): number {
  return c.h0 * KM_S_MPC_PER_GYR
}

/** E(a) = H(a)/H₀ from the Friedmann equation. */
export function expansionFactor(c: Cosmology, a: number): number {
  const omegaK = 1 - c.omegaR - c.omegaM - c.omegaL
  return Math.sqrt(c.omegaR / a ** 4 + c.omegaM / a ** 3 + omegaK / a ** 2 + c.omegaL)
}

/** Hubble rate H(a) in 1/Gyr. */
export function hubbleRate(c: Cosmology, a: number): number {
  return hubbleRateToday(c) * expansionFactor(c, a)
}

/** Convert a rate in 1/Gyr to km/s/Mpc. */
export function toKmSMpc(ratePerGyr: number): number {
  return ratePerGyr / KM_S_MPC_PER_GYR
}

/**
 * Deceleration parameter q = −a ä / ȧ². Positive: the expansion is slowing;
 * negative: it is speeding up.
 */
export function deceleration(c: Cosmology, a: number): number {
  const e2 = expansionFactor(c, a) ** 2
  return (c.omegaR / a ** 4 + c.omegaM / (2 * a ** 3) - c.omegaL) / e2
}

/** Scale factor at which a flat matter + Λ universe switches from slowing to speeding up. */
export function accelerationOnset(c: Cosmology): number | null {
  if (c.omegaL <= 0 || c.omegaM <= 0) return null
  return (c.omegaM / (2 * c.omegaL)) ** (1 / 3)
}

/** Cosmological redshift of light emitted when the scale factor was a and received today. */
export function redshift(a: number): number {
  return 1 / a - 1
}

/** Background radiation temperature when the scale factor was a (K). */
export function cmbTemperature(a: number): number {
  return CMB_TEMPERATURE_TODAY / a
}

/**
 * Recession speed (fraction of c) of a galaxy whose distance today is d₀ (Gly),
 * at the moment the scale factor is a: v = H d = H(a) · a · d₀.
 */
export function recessionSpeed(c: Cosmology, a: number, d0: number): number {
  return hubbleRate(c, a) * a * d0
}

const A_MIN = 1e-8
const A_MAX = 60
const STEPS = 8000

/** A tabulated solution a(t) of the Friedmann equation. */
export interface Expansion {
  readonly cosmology: Cosmology
  /** True if a → 0 at a finite time in the past (a Big Bang). */
  readonly hasBigBang: boolean
  /**
   * The time coordinate used: time since the Big Bang if there was one,
   * otherwise time relative to today. Today is at `tToday`.
   */
  readonly tToday: number
  readonly tMin: number
  readonly tMax: number
  scaleFactorAt(t: number): number
  timeAt(a: number): number
}

/**
 * Integrate dt = d(ln a) / H(a) on a fine grid in ln a and tabulate t(a).
 * The integrand is smooth in ln a for all four models, including near a = 0,
 * so the trapezoid rule on 8 000 steps is accurate to better than 10⁻⁶.
 */
export function solveExpansion(c: Cosmology, futureGyr = 30): Expansion {
  const xMin = Math.log(A_MIN)
  const xMax = Math.log(A_MAX)
  const dx = (xMax - xMin) / STEPS
  const xs = new Float64Array(STEPS + 1)
  const ts = new Float64Array(STEPS + 1)
  const integrand = (x: number) => 1 / hubbleRate(c, Math.exp(x))
  xs[0] = xMin
  ts[0] = 0
  for (let i = 1; i <= STEPS; i++) {
    const x0 = xMin + (i - 1) * dx
    xs[i] = x0 + dx
    ts[i] = (ts[i - 1] as number) + 0.5 * dx * (integrand(x0) + integrand(x0 + dx))
  }

  const hasBigBang = c.omegaM > 0 || c.omegaR > 0
  // With a Big Bang, the time before A_MIN is negligible (< 10⁻¹⁰ Gyr here), so
  // the table's t is time since the Big Bang. Without one, measure from today.
  const offset = hasBigBang ? 0 : -interpolate(xs, ts, 0)
  for (let i = 0; i <= STEPS; i++) ts[i] = (ts[i] as number) + offset

  const tToday = interpolate(xs, ts, 0)
  const tMin = hasBigBang ? 0 : -20
  const tMax = Math.min(tToday + futureGyr, ts[STEPS] as number)

  return {
    cosmology: c,
    hasBigBang,
    tToday,
    tMin,
    tMax,
    scaleFactorAt(t: number): number {
      if (hasBigBang && t <= 0) return 0
      return Math.exp(interpolate(ts, xs, t))
    },
    timeAt(a: number): number {
      if (a <= 0) return hasBigBang ? 0 : -Infinity
      return interpolate(xs, ts, Math.log(a))
    },
  }
}

/** Linear interpolation of y(x) in a table with increasing xs. */
function interpolate(xs: Float64Array, ys: Float64Array, x: number): number {
  const n = xs.length
  if (x <= (xs[0] as number)) return ys[0] as number
  if (x >= (xs[n - 1] as number)) return ys[n - 1] as number
  let lo = 0
  let hi = n - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if ((xs[mid] as number) <= x) lo = mid
    else hi = mid
  }
  const x0 = xs[lo] as number
  const x1 = xs[hi] as number
  const f = (x - x0) / (x1 - x0)
  return (ys[lo] as number) * (1 - f) + (ys[hi] as number) * f
}
