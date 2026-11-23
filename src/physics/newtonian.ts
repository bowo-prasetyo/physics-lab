/**
 * Newton's second law for a one-dimensional body under a constant net force.
 *
 * This deliberately simple model assumes an inertial frame, constant mass,
 * constant net force, and motion along one axis. Friction and other forces
 * must be included in the net force by the caller.
 */

export function accelerationFromNetForce(netForce: number, mass: number): number {
  if (!Number.isFinite(netForce)) throw new RangeError('Net force must be finite.')
  if (!Number.isFinite(mass) || mass <= 0) throw new RangeError('Mass must be finite and greater than zero.')
  return netForce / mass
}

/** Velocity after time t when the body starts from rest. */
export function velocityFromRest(netForce: number, mass: number, time: number): number {
  validateTime(time)
  return accelerationFromNetForce(netForce, mass) * time
}

/** Displacement after time t when the body starts from rest. */
export function displacementFromRest(netForce: number, mass: number, time: number): number {
  validateTime(time)
  return 0.5 * accelerationFromNetForce(netForce, mass) * time * time
}

function validateTime(time: number): void {
  if (!Number.isFinite(time) || time < 0) throw new RangeError('Time must be finite and non-negative.')
}
