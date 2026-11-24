/**
 * Two-dimensional free-body model for the Force Lab.
 *
 * Coordinates are local to the surface: +x is up the slope (or right on a
 * horizontal surface), +y is perpendicular and away from the surface.
 * The block starts from rest. Static friction balances the tangential force
 * tendency up to its maximum; once that limit is exceeded, kinetic friction
 * acts opposite the impending direction of motion.
 *
 * This is a translational model with a constant applied force parallel to the
 * surface. It does not model the transient during breakaway or changing speed
 * dependent friction.
 */
export type ForceLabScenario = 'horizontal' | 'incline'
export type ForceLabFrictionRegime = 'static' | 'kinetic'

export interface ForceLabInput {
  readonly scenario: ForceLabScenario
  readonly mass: number
  readonly appliedForce: number
  readonly staticFrictionCoefficient: number
  readonly kineticFrictionCoefficient: number
  readonly inclineAngle: number
  readonly duration: number
  readonly gravity?: number
}

export interface ForceVector {
  readonly id: 'applied' | 'friction' | 'normal' | 'weight-parallel' | 'weight-normal'
  readonly x: number
  readonly y: number
}

export interface ForceLabResult {
  readonly normalForce: number
  /** Magnitude of the friction force (N). */
  readonly frictionForce: number
  readonly maximumStaticFriction: number
  readonly frictionRegime: ForceLabFrictionRegime
  readonly weight: number
  readonly netForce: number
  readonly acceleration: number
  readonly velocity: number
  readonly displacement: number
  readonly forces: readonly ForceVector[]
  readonly angle: number
}

function finite(value: number, label: string): void {
  if (!Number.isFinite(value)) throw new RangeError(`${label} must be finite.`)
}

/** Resolve forces and constant-acceleration motion for one trial from rest. */
export function calculateForceLab(input: ForceLabInput): ForceLabResult {
  finite(input.mass, 'Mass')
  finite(input.appliedForce, 'Applied force')
  finite(input.staticFrictionCoefficient, 'Static friction coefficient')
  finite(input.kineticFrictionCoefficient, 'Kinetic friction coefficient')
  finite(input.inclineAngle, 'Incline angle')
  finite(input.duration, 'Duration')
  const gravity = input.gravity ?? 9.81
  finite(gravity, 'Gravitational acceleration')

  if (input.mass <= 0) throw new RangeError('Mass must be greater than zero.')
  if (input.staticFrictionCoefficient < 0 || input.kineticFrictionCoefficient < 0) {
    throw new RangeError('Friction coefficients cannot be negative.')
  }
  if (input.kineticFrictionCoefficient > input.staticFrictionCoefficient + 1e-12) {
    // Otherwise kinetic friction could exceed the force that broke static
    // friction and drive a block that starts from rest backwards.
    throw new RangeError('The kinetic friction coefficient cannot exceed the static coefficient.')
  }
  if (input.duration < 0) throw new RangeError('Duration cannot be negative.')
  if (gravity <= 0) throw new RangeError('Gravitational acceleration must be greater than zero.')
  if (input.scenario !== 'horizontal' && input.scenario !== 'incline') {
    throw new RangeError('Unknown Force Lab scenario.')
  }
  if (input.scenario === 'horizontal' && input.inclineAngle !== 0) {
    throw new RangeError('A horizontal surface must have a zero incline angle.')
  }
  if (input.inclineAngle < 0 || input.inclineAngle >= 80) {
    throw new RangeError('Incline angle must be between 0° and 80°.')
  }

  const angle = input.scenario === 'incline' ? input.inclineAngle * Math.PI / 180 : 0
  const weight = input.mass * gravity
  const normalForce = weight * Math.cos(angle)
  const weightParallel = weight * Math.sin(angle)
  // Positive tendency means the block would begin moving up the surface.
  const tendency = input.appliedForce - weightParallel
  const maximumStaticFriction = input.staticFrictionCoefficient * normalForce
  const remainsAtRest = Math.abs(tendency) <= maximumStaticFriction + 1e-10
  const frictionRegime: ForceLabFrictionRegime = remainsAtRest ? 'static' : 'kinetic'

  // Friction's signed component in the +x direction opposes the tendency.
  // Static friction takes exactly the value needed for equilibrium; kinetic
  // friction has the constant magnitude mu_k * N after breakaway.
  const frictionAlongSurface = remainsAtRest
    ? -tendency
    : -Math.sign(tendency) * input.kineticFrictionCoefficient * normalForce
  const frictionForce = Math.abs(frictionAlongSurface)
  const netForce = tendency + frictionAlongSurface
  const acceleration = netForce / input.mass
  const velocity = acceleration * input.duration
  const displacement = 0.5 * acceleration * input.duration ** 2

  const forces: ForceVector[] = [
    { id: 'applied', x: input.appliedForce, y: 0 },
    { id: 'friction', x: frictionAlongSurface, y: 0 },
    { id: 'normal', x: 0, y: normalForce },
    { id: 'weight-parallel', x: -weightParallel, y: 0 },
    { id: 'weight-normal', x: 0, y: -normalForce },
  ]

  return {
    normalForce,
    frictionForce,
    maximumStaticFriction,
    frictionRegime,
    weight,
    netForce,
    acceleration,
    velocity,
    displacement,
    forces,
    angle: angle * 180 / Math.PI,
  }
}
