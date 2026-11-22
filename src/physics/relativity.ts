/**
 * Special-relativity helpers. Used so far only to quantify how good the
 * Galilean approximation is at everyday speeds; Module 4 builds on them.
 */

/** Speed of light in vacuum (m/s), exact by definition of the metre. */
export const SPEED_OF_LIGHT = 299_792_458

/** Lorentz factor γ = 1 / √(1 − v²/c²). Requires |v| < c. */
export function lorentzFactor(v: number, c = SPEED_OF_LIGHT): number {
  const beta = v / c
  if (!(Math.abs(beta) < 1)) throw new RangeError('|v| must be below the speed of light')
  return 1 / Math.sqrt(1 - beta * beta)
}

/**
 * γ − 1, computed without catastrophic cancellation:
 *
 *   γ − 1 = β² / (√(1 − β²) · (1 + √(1 − β²)))
 *
 * At everyday speeds γ is so close to 1 that `lorentzFactor(v) - 1` evaluates
 * to exactly 0 in double precision; this form stays accurate (≈ β²/2).
 */
export function lorentzFactorMinusOne(v: number, c = SPEED_OF_LIGHT): number {
  const beta = v / c
  if (!(Math.abs(beta) < 1)) throw new RangeError('|v| must be below the speed of light')
  const root = Math.sqrt(1 - beta * beta)
  return (beta * beta) / (root * (1 + root))
}
