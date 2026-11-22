/**
 * Positions, displacements and coordinate systems in three-dimensional
 * Euclidean space.
 *
 * A coordinate system is a choice: where the origin is, and which way the
 * axes point. Changing it changes every coordinate, but not the distances
 * between points. Those are properties of space itself, which is what makes
 * them physical.
 */

import { add, dot, norm, scale, sub, vec3, type Vec3 } from './vector'

/** Total length of a path through the given points (m). */
export function pathLength(points: readonly Vec3[]): number {
  let total = 0
  for (let i = 1; i < points.length; i++) total += norm(sub(points[i] as Vec3, points[i - 1] as Vec3))
  return total
}

/** Displacement from the first point of a path to the last. */
export function netDisplacement(points: readonly Vec3[]): Vec3 {
  if (points.length === 0) return vec3()
  return sub(points[points.length - 1] as Vec3, points[0] as Vec3)
}

/**
 * A second coordinate system: its origin (given in the first system's
 * coordinates) and its orientation, a turn by `yawDeg` about the z-axis
 * followed by a tilt by `pitchDeg` about the turned x-axis.
 */
export interface CoordinateFrame {
  readonly origin: Vec3
  readonly yawDeg: number
  readonly pitchDeg: number
}

export const STANDARD_FRAME: CoordinateFrame = { origin: vec3(), yawDeg: 0, pitchDeg: 0 }

/** The new frame's unit axes, written in the original coordinates. They are orthonormal. */
export function frameAxes(f: CoordinateFrame): [Vec3, Vec3, Vec3] {
  const yaw = (f.yawDeg * Math.PI) / 180
  const pitch = (f.pitchDeg * Math.PI) / 180
  const [cy, sy, cp, sp] = [Math.cos(yaw), Math.sin(yaw), Math.cos(pitch), Math.sin(pitch)]
  // R = Rz(yaw) · Rx(pitch); its columns are the new axes.
  return [vec3(cy, sy, 0), vec3(-sy * cp, cy * cp, sp), vec3(sy * sp, -cy * sp, cp)]
}

/** Components of a vector (such as a displacement) along the new frame's axes. Origins play no part. */
export function vectorInFrame(v: Vec3, f: CoordinateFrame): Vec3 {
  const [ex, ey, ez] = frameAxes(f)
  return vec3(dot(v, ex), dot(v, ey), dot(v, ez))
}

/** Coordinates of a point in the new frame: r′ = Rᵀ (r − origin). */
export function pointInFrame(p: Vec3, f: CoordinateFrame): Vec3 {
  return vectorInFrame(sub(p, f.origin), f)
}

/** Back from the new frame's coordinates to the original ones. */
export function pointFromFrame(q: Vec3, f: CoordinateFrame): Vec3 {
  const [ex, ey, ez] = frameAxes(f)
  return add(f.origin, add(scale(ex, q.x), add(scale(ey, q.y), scale(ez, q.z))))
}

/** Unit vector in the direction of v, or null for the zero vector. */
export function unit(v: Vec3): Vec3 | null {
  const n = norm(v)
  return n > 0 ? scale(v, 1 / n) : null
}

/** Angles (degrees) between a vector and the x, y and z axes; their cosines are the components of the unit vector. */
export function directionAngles(v: Vec3): [number, number, number] | null {
  const u = unit(v)
  if (!u) return null
  const deg = (c: number) => (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI
  return [deg(u.x), deg(u.y), deg(u.z)]
}
