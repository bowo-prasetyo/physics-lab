/**
 * Two-dimensional free-body model for the Force Lab.
 *
 * Coordinates are local to the surface: +x is up the slope (or right on a
 * horizontal surface), +y is perpendicular and away from the surface.
 * The body is already sliding, so friction is kinetic. Static friction,
 * rotation, ropes/pulleys and deformation are intentionally out of scope.
 */
export type ForceLabScenario = 'horizontal' | 'incline'

export interface ForceLabInput {
  readonly scenario: ForceLabScenario
  readonly mass: number
  readonly appliedForce: number
  readonly frictionCoefficient: number
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
  readonly frictionForce: number
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

/** Resolve the forces and constant-acceleration motion for one trial. */
export function calculateForceLab(input: ForceLabInput): ForceLabResult {
  finite(input.mass, 'Mass')
  finite(input.appliedForce, 'Applied force')
  finite(input.frictionCoefficient, 'Friction coefficient')
  finite(input.inclineAngle, 'Incline angle')
  finite(input.duration, 'Duration')
  const gravity = input.gravity ?? 9.81
  finite(gravity, 'Gravitational acceleration')

  if (input.mass <= 0) throw new RangeError('Mass must be greater than zero.')
  if (input.frictionCoefficient < 0) throw new RangeError('Friction coefficient cannot be negative.')
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
  // The positive direction is up the surface. Kinetic friction opposes the
  // direction in which the applied force and gravity would move the body.
  const tendency = input.appliedForce - weightParallel
  const frictionForce = Math.abs(tendency) < 1e-12
    ? 0
    : Math.sign(tendency) * input.frictionCoefficient * normalForce
  const netForce = tendency - frictionForce
  const acceleration = netForce / input.mass
  const velocity = acceleration * input.duration
  const displacement = 0.5 * acceleration * input.duration ** 2

  const forces: ForceVector[] = [
    { id: 'applied', x: input.appliedForce, y: 0 },
    { id: 'friction', x: -frictionForce, y: 0 },
    { id: 'normal', x: 0, y: normalForce },
    { id: 'weight-parallel', x: -weightParallel, y: 0 },
    { id: 'weight-normal', x: 0, y: -normalForce },
  ]

  return {
    normalForce,
    frictionForce: Math.abs(frictionForce),
    weight,
    netForce,
    acceleration,
    velocity,
    displacement,
    forces,
    angle: angle * 180 / Math.PI,
  }
}
