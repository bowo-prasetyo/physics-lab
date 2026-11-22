import { describe, expect, it } from 'vitest'
import {
  directionAngles,
  distance,
  dot,
  frameAxes,
  netDisplacement,
  norm,
  pathLength,
  pointFromFrame,
  pointInFrame,
  vec3,
  vectorInFrame,
  type CoordinateFrame,
  type Vec3,
} from './index'

/** Deterministic pseudo-random numbers, so failures are reproducible. */
function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647 - 0.5
  }
}
const rand = rng(42)
const randomVec = (r = 20): Vec3 => vec3(rand() * r, rand() * r, rand() * r)
const randomFrame = (): CoordinateFrame => ({ origin: randomVec(), yawDeg: rand() * 360, pitchDeg: rand() * 180 })

describe('paths', () => {
  it('a round trip has zero displacement but a non-zero distance', () => {
    const trip = [vec3(), vec3(3, 0, 0), vec3(3, 4, 0), vec3(3, 4, 2), vec3()]
    expect(norm(netDisplacement(trip))).toBe(0)
    expect(pathLength(trip)).toBeCloseTo(3 + 4 + 2 + Math.sqrt(29), 12)
  })

  it('3 along x, 4 along y and 12 along z: straight-line distance 13 (3D Pythagoras)', () => {
    const path = [vec3(), vec3(3, 0, 0), vec3(3, 4, 0), vec3(3, 4, 12)]
    expect(norm(netDisplacement(path))).toBe(13)
    expect(pathLength(path)).toBe(19)
  })

  it('triangle inequality: the distance travelled is never less than the displacement', () => {
    for (let i = 0; i < 200; i++) {
      const path = Array.from({ length: 2 + (i % 6) }, () => randomVec())
      expect(pathLength(path)).toBeGreaterThanOrEqual(norm(netDisplacement(path)) - 1e-9)
    }
  })
})

describe('changing coordinates', () => {
  it('the new axes are orthonormal for any orientation', () => {
    for (let i = 0; i < 50; i++) {
      const [ex, ey, ez] = frameAxes(randomFrame())
      for (const [a, b, expected] of [[ex, ex, 1], [ey, ey, 1], [ez, ez, 1], [ex, ey, 0], [ey, ez, 0], [ex, ez, 0]] as const) {
        expect(dot(a, b)).toBeCloseTo(expected, 12)
      }
    }
  })

  it('turning the axes by 90° about z: the point (1, 0, 0) becomes (0, −1, 0)', () => {
    const p = pointInFrame(vec3(1, 0, 0), { origin: vec3(), yawDeg: 90, pitchDeg: 0 })
    expect(p.x).toBeCloseTo(0, 12)
    expect(p.y).toBeCloseTo(-1, 12)
    expect(p.z).toBeCloseTo(0, 12)
  })

  it('moving the origin changes positions but not displacements', () => {
    const f: CoordinateFrame = { origin: vec3(5, -2, 3), yawDeg: 0, pitchDeg: 0 }
    const [a, b] = [vec3(1, 2, 3), vec3(4, 6, 3)]
    expect(pointInFrame(a, f)).toEqual(vec3(-4, 4, 0))
    const d = vectorInFrame(vec3(3, 4, 0), f)
    expect(d).toEqual(sub3(pointInFrame(b, f), pointInFrame(a, f)))
    expect(d).toEqual(vec3(3, 4, 0))
  })

  it('distances and lengths are the same in every frame, although components change', () => {
    for (let i = 0; i < 100; i++) {
      const f = randomFrame()
      const [a, b] = [randomVec(), randomVec()]
      expect(distance(pointInFrame(a, f), pointInFrame(b, f))).toBeCloseTo(distance(a, b), 9)
      const v = randomVec()
      expect(norm(vectorInFrame(v, f))).toBeCloseTo(norm(v), 9)
    }
    const turned = vectorInFrame(vec3(3, 4, 0), { origin: vec3(), yawDeg: 30, pitchDeg: 0 })
    expect(turned.x).not.toBeCloseTo(3, 3)
  })

  it('converting to a frame and back returns the original point', () => {
    for (let i = 0; i < 50; i++) {
      const f = randomFrame()
      const p = randomVec()
      const back = pointFromFrame(pointInFrame(p, f), f)
      expect(back.x).toBeCloseTo(p.x, 9)
      expect(back.y).toBeCloseTo(p.y, 9)
      expect(back.z).toBeCloseTo(p.z, 9)
    }
  })
})

describe('direction', () => {
  it('direction angles: along x is (0°, 90°, 90°); (1, 1, 1) makes 54.7° with each axis', () => {
    expect(directionAngles(vec3(5, 0, 0))).toEqual([0, 90, 90])
    for (const a of directionAngles(vec3(1, 1, 1)) ?? []) expect(a).toBeCloseTo(54.7356, 3)
    expect(directionAngles(vec3())).toBeNull()
  })
})

function sub3(a: Vec3, b: Vec3): Vec3 {
  return vec3(a.x - b.x, a.y - b.y, a.z - b.z)
}
