import { SPEED_OF_LIGHT } from './relativity'

/**
 * One-dimensional special-relativistic velocity addition.
 * u and v are signed velocities measured in collinear inertial frames.
 * The result remains subluminal for every valid pair of inputs.
 */
export function relativisticVelocityAddition(u: number, v: number, c = SPEED_OF_LIGHT): number {
  if (!(Number.isFinite(c) && c > 0)) throw new RangeError('c must be finite and positive')
  if (!(Number.isFinite(u) && Math.abs(u) < c)) throw new RangeError('|u| must be below c')
  if (!(Number.isFinite(v) && Math.abs(v) < c)) throw new RangeError('|v| must be below c')
  return (u + v) / (1 + (u * v) / (c * c))
}

/** Relativistic momentum p = γmv for a particle of positive rest mass. */
export function relativisticMomentum(mass: number, velocity: number, c = SPEED_OF_LIGHT): number {
  if (!(Number.isFinite(mass) && mass > 0)) throw new RangeError('mass must be finite and positive')
  if (!(Number.isFinite(c) && c > 0)) throw new RangeError('c must be finite and positive')
  if (!(Number.isFinite(velocity) && Math.abs(velocity) < c)) throw new RangeError('|velocity| must be below c')
  const beta = velocity / c
  return (mass * velocity) / Math.sqrt(1 - beta * beta)
}
