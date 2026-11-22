import { describe, expect, it } from 'vitest'
import {
  gamma,
  inertialClockAt,
  intervalSquared,
  lorentzBoost,
  properTimeTicks,
  rapidity,
  simultaneousTimeAt,
  velocityInFrame,
} from './index'

describe('Lorentz boost (c = 1)', () => {
  it('the textbook case: at 0.8c the ship event (10 s, 8 ls) is (6 s, 0) for the ship', () => {
    const e = lorentzBoost({ t: 10, x: 8 }, 0.8)
    expect(e.t).toBeCloseTo(6, 12)
    expect(e.x).toBeCloseTo(0, 12)
  })

  it('boosting by β and then by −β returns the original event', () => {
    const e = { t: 3.7, x: -1.2 }
    const back = lorentzBoost(lorentzBoost(e, 0.63), -0.63)
    expect(back.t).toBeCloseTo(e.t, 12)
    expect(back.x).toBeCloseTo(e.x, 12)
  })

  it('the interval s² = t² − x² is the same for every observer', () => {
    const events = [{ t: 10, x: 8 }, { t: 2, x: -5 }, { t: 4, x: 4 }, { t: -1, x: 0.3 }]
    for (const e of events) {
      for (const beta of [-0.95, -0.3, 0.1, 0.8, 0.99]) {
        expect(intervalSquared(lorentzBoost(e, beta))).toBeCloseTo(intervalSquared(e), 9)
      }
    }
  })

  it('a light ray stays a light ray (s² = 0) after any boost', () => {
    const ray = lorentzBoost({ t: 5, x: 5 }, 0.7)
    expect(ray.t).toBeCloseTo(ray.x, 12)
  })
})

describe('velocities', () => {
  it('transforms velocities relativistically', () => {
    expect(velocityInFrame(0.8, 0.8)).toBe(0) // the ship is at rest in its own frame
    expect(velocityInFrame(0, 0.8)).toBeCloseTo(-0.8, 12) // Earth moves backwards for the ship
    expect(velocityInFrame(0.5, -0.5)).toBeCloseTo(0.8, 12) // not 1.0, as Galilean addition would give
  })

  it('light moves at c for every observer', () => {
    for (const u of [-0.9, 0, 0.5, 0.99]) {
      expect(velocityInFrame(1, u)).toBeCloseTo(1, 12)
      expect(velocityInFrame(-1, u)).toBeCloseTo(-1, 12)
    }
  })

  it('rapidities add where velocities do not', () => {
    const combined = velocityInFrame(0.6, -0.5) // 0.6c seen from a frame moving at −0.5c
    expect(rapidity(combined)).toBeCloseTo(rapidity(0.6) + rapidity(0.5), 12)
  })

  it('rejects speeds at or above c', () => {
    expect(() => velocityInFrame(0.5, 1)).toThrow(RangeError)
    expect(() => velocityInFrame(1.2, 0)).toThrow(RangeError)
    expect(() => rapidity(1)).toThrow(RangeError)
  })
})

describe('clocks', () => {
  it('at 0.8c the ship clock reads 6 s when the Earth clock reads 10 s (Earth frame)', () => {
    expect(gamma(0.8)).toBeCloseTo(5 / 3, 12)
    const ship = inertialClockAt(0.8, 10)
    expect(ship.x).toBeCloseTo(8, 12)
    expect(ship.tau).toBeCloseTo(6, 12)
  })

  it('time dilation is reciprocal: in the ship frame, Earth’s clock is the slow one', () => {
    const earthInShipFrame = inertialClockAt(velocityInFrame(0, 0.8), 10)
    expect(earthInShipFrame.tau).toBeCloseTo(6, 12)
  })

  it('a clock’s reading equals the interval from the start event (proper time is invariant)', () => {
    const ship = inertialClockAt(0.8, 10)
    expect(Math.sqrt(intervalSquared(ship))).toBeCloseTo(ship.tau, 12)
  })

  it('proper-time ticks are spaced γ apart in coordinate time', () => {
    const ticks = properTimeTicks(0.8, 10)
    expect(ticks.map((k) => k.tau)).toEqual([0, 1, 2, 3, 4, 5, 6])
    expect(ticks[3]?.t).toBeCloseTo(5, 12)
    expect(ticks[3]?.x).toBeCloseTo(4, 12)
    expect(properTimeTicks(0, 3).map((k) => k.t)).toEqual([0, 1, 2, 3])
  })
})

describe('relativity of simultaneity', () => {
  it('the ship’s "now" at ship time 6 s meets Earth’s worldline at Earth time 3.6 s', () => {
    // Earth frame, t = 10: the ship is at (10, 8) and reads 6 s.
    const tEarth = simultaneousTimeAt(0.8, { t: 10, x: 8 }, 0)
    expect(tEarth).toBeCloseTo(3.6, 12) // = 10 / γ²
    // Cross-check: in the ship frame that Earth event has t' = 6, the ship's own reading.
    expect(lorentzBoost({ t: tEarth, x: 0 }, 0.8).t).toBeCloseTo(6, 12)
  })

  it('an observer at rest has a flat line of simultaneity', () => {
    expect(simultaneousTimeAt(0, { t: 4, x: 0 }, 7)).toBe(4)
  })
})
