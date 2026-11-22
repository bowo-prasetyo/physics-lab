import { describe, expect, it } from 'vitest'
import {
  MotionRun,
  constantAccelerationPosition,
  distance,
  galileanBoost,
  graphVertices,
  norm,
  positionAtTime,
  relativeVelocity,
  timeToReach,
  uniformPosition,
  uniformPosition3,
  vec3,
  lorentzFactor,
  lorentzFactorMinusOne,
  SPEED_OF_LIGHT,
} from './index'

const track = { min: -10, max: 10 }

describe('vector algebra', () => {
  it('computes Euclidean length and distance', () => {
    expect(norm(vec3(3, 4, 12))).toBe(13)
    expect(distance(vec3(1, 1, 1), vec3(4, 5, 1))).toBe(5)
  })
})

describe('closed-form kinematics', () => {
  it('uniform motion: x(t) = x0 + v t', () => {
    expect(uniformPosition(2, 1.5, 4)).toBe(8)
    expect(uniformPosition(-3, -2, 2.5)).toBe(-8)
  })

  it('with zero velocity, position is constant for every t', () => {
    for (const t of [0, 1, 7.3, 1e6]) expect(uniformPosition(4.2, 0, t)).toBe(4.2)
  })

  it('3D uniform motion is component-wise', () => {
    expect(uniformPosition3(vec3(1, 2, 3), vec3(1, -1, 0.5), 2)).toEqual(vec3(3, 0, 4))
  })

  it('constant acceleration: free fall from rest falls ½ g t²', () => {
    expect(constantAccelerationPosition(0, 0, -9.81, 2)).toBeCloseTo(-19.62, 12)
  })

  it('timeToReach handles forward, backward and stationary motion', () => {
    expect(timeToReach(0, 2, 10)).toBe(5)
    expect(timeToReach(0, 2, -10)).toBeNull()
    expect(timeToReach(3, 0, 3)).toBe(0)
    expect(timeToReach(3, 0, 4)).toBeNull()
  })
})

describe('Galilean frames', () => {
  it('time is the same for every Galilean observer', () => {
    expect(galileanBoost({ t: 7, x: 3 }, 2.5).t).toBe(7)
  })

  it('an object moving at v is at rest for an observer moving at u = v', () => {
    const v = 1.5
    for (const t of [0, 2, 5, 10]) {
      expect(galileanBoost({ t, x: uniformPosition(-4, v, t) }, v).x).toBeCloseTo(-4, 12)
    }
    expect(relativeVelocity(v, v)).toBe(0)
  })

  it('an object at rest moves backwards for a moving observer', () => {
    expect(galileanBoost({ t: 4, x: 0 }, 2).x).toBe(-8)
    expect(relativeVelocity(0, 2)).toBe(-2)
  })
})

describe('MotionRun', () => {
  it('stationary object: clock advances, position does not change', () => {
    const run = new MotionRun({ x0: 3, v: 0, duration: 10, bounds: track })
    run.advance(4)
    expect(run.t).toBe(4)
    expect(run.x).toBe(3)
    expect(run.displacement).toBe(0)
    expect(run.distance).toBe(0)
  })

  it('result is independent of how the clock is stepped (exact, not integrated)', () => {
    const coarse = new MotionRun({ x0: -2, v: 1.3, duration: 10, bounds: track })
    const fine = new MotionRun({ x0: -2, v: 1.3, duration: 10, bounds: track })
    coarse.advance(5)
    for (let i = 0; i < 300; i++) fine.advance(5 / 300)
    expect(fine.t).toBeCloseTo(coarse.t, 10)
    expect(fine.x).toBeCloseTo(coarse.x, 10)
    expect(coarse.x).toBeCloseTo(4.5, 12)
  })

  it('clamps the clock to the run duration', () => {
    const run = new MotionRun({ x0: 0, v: 0.5, duration: 10, bounds: track })
    run.advance(25)
    expect(run.t).toBe(10)
    expect(run.finished).toBe(true)
    expect(run.x).toBe(5)
  })

  it('stops at the end of the track part-way through a step while time continues', () => {
    const run = new MotionRun({ x0: 4, v: 2, duration: 10, bounds: track })
    run.advance(5) // reaches x = 10 at t = 3, then rests for 2 s
    expect(run.t).toBe(5)
    expect(run.x).toBe(10)
    expect(run.v).toBe(0)
    expect(run.atBoundary).toBe(true)
    expect(run.distance).toBe(6)
    expect(run.segments).toEqual([
      { tStart: 0, xStart: 4, v: 2 },
      { tStart: 3, xStart: 10, v: 0 },
    ])
  })

  it('cannot be pushed off the track, but can move back onto it', () => {
    const run = new MotionRun({ x0: 10, v: 3, duration: 10, bounds: track })
    expect(run.v).toBe(0)
    run.setVelocity(-1)
    run.advance(2)
    expect(run.x).toBe(8)
  })

  it('reversing direction: displacement and distance differ', () => {
    const run = new MotionRun({ x0: 0, v: 2, duration: 10, bounds: track })
    run.advance(3)
    run.setVelocity(-2)
    run.advance(3)
    expect(run.x).toBeCloseTo(0, 12)
    expect(run.displacement).toBeCloseTo(0, 12)
    expect(run.distance).toBeCloseTo(12, 12)
  })

  it('changing velocity before time passes does not create empty segments', () => {
    const run = new MotionRun({ x0: 0, v: 1, duration: 10, bounds: track })
    run.setVelocity(2)
    run.setVelocity(3)
    expect(run.segments).toHaveLength(1)
    expect(run.segments[0]?.v).toBe(3)
  })

  it('records are snapshots that support exact position look-ups and graph vertices', () => {
    const run = new MotionRun({ x0: 1, v: 1, duration: 10, bounds: track })
    run.advance(2)
    run.setVelocity(0)
    run.advance(3)
    const record = run.toRecord()
    run.setVelocity(-1)
    run.advance(1)
    expect(record.tEnd).toBe(5)
    expect(record.segments).toHaveLength(2)
    expect(positionAtTime(record.segments, 1)).toBe(2)
    expect(positionAtTime(record.segments, 4)).toBe(3)
    expect(graphVertices(record)).toEqual([
      { t: 0, x: 1 },
      { t: 2, x: 3 },
      { t: 5, x: 3 },
    ])
  })

  it('rejects invalid configuration', () => {
    expect(() => new MotionRun({ x0: 0, v: 0, duration: 0, bounds: track })).toThrow()
    expect(() => new MotionRun({ x0: 0, v: 0, duration: 1, bounds: { min: 1, max: 1 } })).toThrow()
  })
})

describe('special relativity helpers', () => {
  it('γ = 5/3 at 0.8c (the textbook value)', () => {
    expect(lorentzFactor(0.8, 1)).toBeCloseTo(5 / 3, 12)
  })

  it('γ − 1 stays accurate at everyday speeds where the naive form is dominated by rounding', () => {
    const u = 3 // m/s
    const expected = (u * u) / (2 * SPEED_OF_LIGHT ** 2)
    // The naive form is dominated by rounding error (one unit in the last place of 1.0)…
    expect(Math.abs(lorentzFactor(u) - 1 - expected) / expected).toBeGreaterThan(1)
    // …while the stable form is accurate to ~12 significant figures.
    expect(lorentzFactorMinusOne(u) / expected).toBeCloseTo(1, 12)
    expect(lorentzFactorMinusOne(0.8, 1)).toBeCloseTo(2 / 3, 12)
  })

  it('rejects speeds at or above c', () => {
    expect(() => lorentzFactor(SPEED_OF_LIGHT)).toThrow(RangeError)
    expect(() => lorentzFactorMinusOne(-2, 1)).toThrow(RangeError)
  })
})
