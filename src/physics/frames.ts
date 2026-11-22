/**
 * Reference frames in Galilean (Newtonian) physics.
 *
 * A Galilean boost to an observer moving with constant velocity u along x:
 *
 *   t' = t
 *   x' = x − u·t
 *
 * This is an excellent approximation when every speed involved is far below
 * the speed of light. It is *not* exact: the correct transformation is the
 * Lorentz transformation, in which t' also depends on x (relativity of
 * simultaneity). Experiments that use this module must say so.
 */

/** A point in space and time: "something happens at position x at time t". */
export interface Event1D {
  readonly t: number
  readonly x: number
}

/** Coordinates of an event as recorded by an observer moving at velocity u. */
export function galileanBoost(event: Event1D, u: number): Event1D {
  return { t: event.t, x: event.x - u * event.t }
}

/** Galilean velocity subtraction: velocity v measured by an observer moving at u. */
export function relativeVelocity(v: number, u: number): number {
  return v - u
}
