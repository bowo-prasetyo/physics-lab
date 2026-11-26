/**
 * Energy view of a block sliding on a straight inclined plane.
 *
 * Force Lab already treats free-body diagrams, normal force and static/kinetic
 * friction on an incline. This module focuses on the work–energy side:
 *
 *   ΔK = W_net = −ΔU_g − W_friction
 *
 * For a frictionless plane the speed at the bottom depends only on the vertical
 * drop (and is independent of the angle). With kinetic friction the work done
 * against friction reduces the final kinetic energy.
 *
 * Assumptions: constant angle, constant kinetic friction coefficient after
 * motion starts, no air resistance, point-like or rigid block that does not
 * rotate, and motion constrained to the plane.
 */

export interface InclineResult {
  /** Vertical drop from start to bottom (m). */
  readonly height: number
  /** Distance along the plane (m). */
  readonly distance: number
  /** Acceleration along the plane (m/s²). Positive down the plane. */
  readonly acceleration: number
  /** Speed at the bottom when released from rest (m/s). Null if it does not slide. */
  readonly speedAtBottom: number | null
  /** Kinetic energy at the bottom (J). Null if it does not slide. */
  readonly kineticAtBottom: number | null
  /** Work done by kinetic friction over the whole distance (J, ≤ 0). */
  readonly workByFriction: number
  /** Whether static friction is enough to keep the block at rest. */
  readonly staysAtRest: boolean
}

/**
 * Result of releasing a block of mass m from rest at the top of a plane of
 * length L at angle θ (radians from horizontal), with kinetic friction μ_k
 * and static friction μ_s.
 */
export function inclineFromRest(
  mass: number,
  length: number,
  angle: number,
  muKinetic: number,
  muStatic: number,
  g = 9.81,
): InclineResult {
  validatePositive(mass, 'Mass')
  validatePositive(length, 'Length')
  if (!Number.isFinite(angle) || angle < 0 || angle >= Math.PI / 2) {
    throw new RangeError('Angle must be in [0, π/2).')
  }
  if (!Number.isFinite(muKinetic) || muKinetic < 0) {
    throw new RangeError('Kinetic friction coefficient must be finite and non-negative.')
  }
  if (!Number.isFinite(muStatic) || muStatic < 0) {
    throw new RangeError('Static friction coefficient must be finite and non-negative.')
  }
  if (!Number.isFinite(g) || g <= 0) throw new RangeError('g must be positive and finite.')

  const height = length * Math.sin(angle)
  const N = mass * g * Math.cos(angle)
  const componentDown = mass * g * Math.sin(angle)
  const maxStatic = muStatic * N
  const staysAtRest = componentDown <= maxStatic + 1e-12

  if (staysAtRest) {
    return {
      height,
      distance: length,
      acceleration: 0,
      speedAtBottom: null,
      kineticAtBottom: null,
      workByFriction: 0,
      staysAtRest: true,
    }
  }

  const friction = muKinetic * N
  const netForce = componentDown - friction
  const acceleration = netForce / mass
  // v² = u² + 2 a s, u = 0
  const speedAtBottom = acceleration > 0 ? Math.sqrt(2 * acceleration * length) : 0
  const kineticAtBottom = 0.5 * mass * speedAtBottom * speedAtBottom
  const workByFriction = -friction * length

  return {
    height,
    distance: length,
    acceleration,
    speedAtBottom,
    kineticAtBottom,
    workByFriction,
    staysAtRest: false,
  }
}

/** Gravitational PE relative to the bottom of the plane. */
export function gravitationalPotential(mass: number, height: number, g = 9.81): number {
  validatePositive(mass, 'Mass')
  if (!Number.isFinite(height)) throw new RangeError('Height must be finite.')
  return mass * g * height
}

function validatePositive(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be finite and greater than zero.`)
  }
}
