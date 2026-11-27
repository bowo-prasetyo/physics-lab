/**
 * Local equivalence-principle model for a lift accelerating vertically.
 * Downward acceleration is positive here. The scale's reading per unit mass
 * is the support acceleration, g - a; in free fall (a = g) it is zero.
 * This is a local, uniform-field approximation, not a global GR solution.
 */
export function apparentWeightPerMass(gravity: number, downwardAcceleration: number): number {
  if (!(Number.isFinite(gravity) && gravity > 0)) throw new RangeError('gravity must be finite and positive')
  if (!(Number.isFinite(downwardAcceleration) && downwardAcceleration >= 0 && downwardAcceleration <= gravity)) {
    throw new RangeError('downward acceleration must be between zero and gravity')
  }
  return gravity - downwardAcceleration
}
