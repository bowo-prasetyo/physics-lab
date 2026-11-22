/**
 * Minimal immutable 3-vector algebra for Euclidean space.
 *
 * Kept deliberately small: experiments only need the operations below, and a
 * tiny hand-written module is easier for students and contributors to read
 * than a general-purpose maths library.
 */

export interface Vec3 {
  readonly x: number
  readonly y: number
  readonly z: number
}

export const vec3 = (x = 0, y = 0, z = 0): Vec3 => ({ x, y, z })

export const ZERO: Vec3 = vec3()

export const add = (a: Vec3, b: Vec3): Vec3 => vec3(a.x + b.x, a.y + b.y, a.z + b.z)

export const sub = (a: Vec3, b: Vec3): Vec3 => vec3(a.x - b.x, a.y - b.y, a.z - b.z)

export const scale = (a: Vec3, k: number): Vec3 => vec3(a.x * k, a.y * k, a.z * k)

export const dot = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z

/** Euclidean length |a| = √(a·a). */
export const norm = (a: Vec3): number => Math.hypot(a.x, a.y, a.z)

/** Euclidean distance between two points. */
export const distance = (a: Vec3, b: Vec3): number => norm(sub(a, b))
