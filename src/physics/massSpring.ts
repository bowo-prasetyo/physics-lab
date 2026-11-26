/**
 * Ideal horizontal mass–spring oscillator (Hooke's law, no damping).
 *
 *   m x'' = −k x
 *
 * The natural frequency is ω = √(k/m) and the period T = 2π/ω is independent
 * of amplitude. Released from rest at displacement A the motion is
 *
 *   x(t) = A cos(ωt)
 *   v(t) = −A ω sin(ωt)
 *
 * Mechanical energy is conserved:
 *
 *   E = ½ k A² = ½ m v² + ½ k x²
 *
 * This model is the simplest place in Physica where elastic potential energy
 * and the work done by a conservative force can be examined directly. Friction,
 * gravity along the motion, and non-Hookean springs are outside its scope.
 */

export interface MassSpringState {
  readonly t: number
  /** Displacement from equilibrium (m). */
  readonly x: number
  /** Velocity (m/s). */
  readonly v: number
}

export function angularFrequency(k: number, mass: number): number {
  validatePositive(k, 'Spring constant k')
  validatePositive(mass, 'Mass')
  return Math.sqrt(k / mass)
}

/** Period T = 2π √(m/k) (s). Independent of amplitude. */
export function period(k: number, mass: number): number {
  return (2 * Math.PI) / angularFrequency(k, mass)
}

/** Elastic potential energy U = ½ k x² (J). */
export function elasticPotential(k: number, x: number): number {
  validatePositive(k, 'Spring constant k')
  if (!Number.isFinite(x)) throw new RangeError('Displacement must be finite.')
  return 0.5 * k * x * x
}

/** Kinetic energy K = ½ m v² (J). */
export function kineticEnergy(mass: number, v: number): number {
  validatePositive(mass, 'Mass')
  if (!Number.isFinite(v)) throw new RangeError('Velocity must be finite.')
  return 0.5 * mass * v * v
}

/** Total mechanical energy for an ideal oscillator released from rest at amplitude A. */
export function totalEnergy(k: number, amplitude: number): number {
  return elasticPotential(k, amplitude)
}

/**
 * Exact state at time t for a mass released from rest at x = amplitude.
 * (Phase chosen so x(0) = A, v(0) = 0.)
 */
export function stateAtTime(
  k: number,
  mass: number,
  amplitude: number,
  t: number,
): MassSpringState {
  validateNonNegative(t, 'Time')
  if (!Number.isFinite(amplitude)) throw new RangeError('Amplitude must be finite.')
  const omega = angularFrequency(k, mass)
  return {
    t,
    x: amplitude * Math.cos(omega * t),
    v: -amplitude * omega * Math.sin(omega * t),
  }
}

/** Sample the analytic motion over [0, duration] at fixed steps. */
export function sampleMotion(
  k: number,
  mass: number,
  amplitude: number,
  duration: number,
  step = 0.01,
): readonly MassSpringState[] {
  validateNonNegative(duration, 'Duration')
  if (!(step > 0) || !Number.isFinite(step)) throw new RangeError('Step must be a positive finite number.')
  const states: MassSpringState[] = []
  for (let t = 0; t <= duration + 1e-12; t += step) {
    states.push(stateAtTime(k, mass, amplitude, Math.min(t, duration)))
  }
  return states
}

function validatePositive(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be finite and greater than zero.`)
  }
}

function validateNonNegative(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be finite and non-negative.`)
  }
}
