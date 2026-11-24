import { SPEED_OF_LIGHT } from './relativity'

export interface LengthContractionResult {
  readonly beta: number
  readonly gamma: number
  readonly properLength: number
  readonly measuredLength: number
  readonly contraction: number
  /** Ship-frame time difference between endpoint events simultaneous in the measuring frame. */
  readonly frontEventTimeInRestFrame: number
}

/**
 * Calculate the length measured for an inertially moving rod.
 * The rod has constant proper length and moves along its length at constant
 * velocity. The measuring-frame length is L0 / gamma. The endpoint positions
 * must be recorded simultaneously in the measuring frame.
 */
export function calculateLengthContraction(properLength: number, beta: number): LengthContractionResult {
  if (!Number.isFinite(properLength) || properLength <= 0) {
    throw new RangeError('properLength must be a finite positive number')
  }
  if (!Number.isFinite(beta) || Math.abs(beta) >= 1) {
    throw new RangeError('|beta| must be finite and below 1')
  }
  const gamma = 1 / Math.sqrt(1 - beta * beta)
  const measuredLength = properLength / gamma
  return {
    beta,
    gamma,
    properLength,
    measuredLength,
    contraction: properLength - measuredLength,
    // For endpoints at x = 0 and x = +L in the measuring frame at t = 0,
    // t' = gamma(t - vx/c²), so the front event has t' = -vL/c².
    frontEventTimeInRestFrame: -beta * properLength / SPEED_OF_LIGHT,
  }
}
