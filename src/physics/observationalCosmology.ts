/** Low-redshift Hubble law: recession speed ≈ H₀ × proper distance. */
export function hubbleVelocity(h0KmPerSecondPerMpc: number, distanceMpc: number): number {
  if (!(Number.isFinite(h0KmPerSecondPerMpc) && h0KmPerSecondPerMpc > 0)) throw new RangeError('H₀ must be finite and positive')
  if (!(Number.isFinite(distanceMpc) && distanceMpc >= 0)) throw new RangeError('distance must be finite and non-negative')
  return h0KmPerSecondPerMpc * distanceMpc
}

/** Invert the low-redshift Hubble law to estimate distance in megaparsecs. */
export function hubbleDistance(h0KmPerSecondPerMpc: number, recessionSpeedKmPerSecond: number): number {
  if (!(Number.isFinite(h0KmPerSecondPerMpc) && h0KmPerSecondPerMpc > 0)) throw new RangeError('H₀ must be finite and positive')
  if (!(Number.isFinite(recessionSpeedKmPerSecond) && recessionSpeedKmPerSecond >= 0)) throw new RangeError('recession speed must be finite and non-negative')
  return recessionSpeedKmPerSecond / h0KmPerSecondPerMpc
}

/** One galaxy in a Hubble diagram: measured distance (Mpc) and recession speed cz (km/s). */
/** The seed of the sample shown in “Evolving space”. */
export const HUBBLE_SAMPLE_SEED = 44

export interface HubblePoint {
  readonly distance: number
  readonly speed: number
}

export interface HubbleSampleOptions {
  /** The H₀ the sample is drawn from (km/s/Mpc). */
  readonly h0: number
  readonly seed?: number
  /** Spread of the galaxies' own motions through space (km/s). */
  readonly peculiarSpeed?: number
  /** Fractional uncertainty of each measured distance. */
  readonly distanceError?: number
  readonly minDistance?: number
  readonly maxDistance?: number
}

/** A small seeded generator (mulberry32), so a sample is the same on every run. */
function seeded(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * An illustrative sample of nearby galaxies, not a real catalogue: true
 * distances spread uniformly, speeds from the low-redshift Hubble law plus each
 * galaxy's own (peculiar) motion, and distances measured with a fractional
 * error. Both scatters are Gaussian, at typical sizes (300 km/s, 10 %). The
 * first n galaxies of a longer sample are the same as a sample of n, so adding
 * galaxies extends the data set rather than replacing it.
 */
export function illustrativeHubbleSample(count: number, options: HubbleSampleOptions): HubblePoint[] {
  const { h0, seed = 1929, peculiarSpeed = 300, distanceError = 0.1, minDistance = 10, maxDistance = 120 } = options
  if (!(Number.isInteger(count) && count >= 0)) throw new RangeError('count must be a non-negative integer')
  if (!(Number.isFinite(h0) && h0 > 0)) throw new RangeError('H₀ must be finite and positive')
  const random = seeded(seed)
  const gaussian = () => Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random())
  return Array.from({ length: count }, () => {
    const trueDistance = minDistance + (maxDistance - minDistance) * random()
    const speed = h0 * trueDistance + peculiarSpeed * gaussian()
    const distance = trueDistance * (1 + distanceError * gaussian())
    return { distance, speed }
  })
}

/**
 * Least-squares fit of v = H₀ d through the origin: Ĥ₀ = Σ v d / Σ d², with
 * standard error √(s² / Σ d²), where s² is the residual variance (n − 1 degrees
 * of freedom). Needs at least two galaxies. Errors in the measured distances
 * bias the slope low by about their fractional variance (1 % for 10 % errors),
 * small compared with the uncertainty of a sample of a few dozen galaxies.
 */
export function fitHubbleConstant(points: readonly HubblePoint[]): { readonly h0: number; readonly standardError: number } {
  if (points.length < 2) throw new RangeError('a fit needs at least two galaxies')
  const sdd = points.reduce((sum, p) => sum + p.distance * p.distance, 0)
  const h0 = points.reduce((sum, p) => sum + p.speed * p.distance, 0) / sdd
  const residual = points.reduce((sum, p) => sum + (p.speed - h0 * p.distance) ** 2, 0) / (points.length - 1)
  return { h0, standardError: Math.sqrt(residual / sdd) }
}
