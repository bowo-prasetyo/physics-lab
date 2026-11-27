import { G, schwarzschildRadius } from './gravity'

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

/**
 * Proper acceleration of an observer hovering at fixed radius r outside a
 * Schwarzschild mass (m/s²): GM / (r² √(1 − r_s/r)). This is what an
 * accelerometer on a hovering spacecraft reads; one on a freely falling
 * spacecraft, on any orbit, reads zero. It follows from the static clock rate
 * α = √(1 − r_s/r) as a = c² dα/dr, and grows without limit at the horizon.
 */
export function hoveringProperAcceleration(mass: number, r: number): number {
  if (!(Number.isFinite(mass) && mass > 0)) throw new RangeError('mass must be finite and positive')
  const x = schwarzschildRadius(mass) / r
  if (!(Number.isFinite(r) && x > 0 && x < 1)) throw new RangeError('a craft can hover only outside the horizon')
  return (G * mass) / (r * r * Math.sqrt(1 - x))
}

/**
 * The hovering reading as a multiple of the Newtonian pull GM/r², for a radius
 * given in Schwarzschild radii: 1/√(1 − r_s/r). It tends to 1 far from the mass.
 */
export function hoveringAccelerationFactor(radiusInSchwarzschildRadii: number): number {
  const r = radiusInSchwarzschildRadii
  if (!(Number.isFinite(r) && r > 1)) throw new RangeError('a craft can hover only outside the horizon (r > r_s)')
  return 1 / Math.sqrt(1 - 1 / r)
}
