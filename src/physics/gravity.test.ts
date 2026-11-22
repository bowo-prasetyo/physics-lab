import { describe, expect, it } from 'vitest'
import {
  BODIES,
  SECONDS_PER_DAY,
  SPEED_OF_LIGHT,
  circularOrbitSpeed,
  gpsBreakdown,
  gravitationalFrequencyShift,
  properRadialDistance,
  relativeRate,
  schwarzschildRadius,
  staticClockDeficit,
  staticClockRate,
  surfaceGravity,
  weakFieldShift,
  type Body,
} from './index'

const body = (id: Body['id']) => BODIES.find((b) => b.id === id) as Body
const earth = body('earth')
const g = surfaceGravity(earth.mass, earth.radius)
const heightShift = (h: number) =>
  relativeRate(staticClockDeficit(earth.mass, earth.radius), staticClockDeficit(earth.mass, earth.radius + h))

describe('Schwarzschild radius', () => {
  it('is about 9 mm for the Earth and 3 km for the Sun', () => {
    expect(schwarzschildRadius(earth.mass)).toBeCloseTo(8.87e-3, 4)
    expect(schwarzschildRadius(body('sun').mass) / 1000).toBeCloseTo(2.95, 2)
  })

  it('every body with a surface is larger than its Schwarzschild radius', () => {
    for (const b of BODIES.filter((b) => b.hasSurface)) expect(b.radius).toBeGreaterThan(schwarzschildRadius(b.mass))
  })
})

describe('static clocks', () => {
  it('a clock on the Earth’s surface runs slow by about 7 parts in 10¹⁰', () => {
    expect(staticClockDeficit(earth.mass, earth.radius)).toBeCloseTo(6.96e-10, 11)
  })

  it('the stable deficit matches 1 − √(1 − r_s/r) where the naive form is accurate', () => {
    const m = body('neutron-star').mass
    const r = 2 * schwarzschildRadius(m)
    expect(staticClockDeficit(m, r)).toBeCloseTo(1 - Math.sqrt(0.5), 12)
    expect(staticClockRate(m, r)).toBeCloseTo(Math.sqrt(0.5), 12)
  })

  it('Pound–Rebka: 22.5 m of height gives a shift of 2.46 × 10⁻¹⁵', () => {
    expect(heightShift(22.5) / 2.46e-15).toBeCloseTo(1, 2)
    expect(heightShift(22.5) / weakFieldShift(g, 22.5)).toBeCloseTo(1, 4)
  })

  it('optical clocks 33 cm apart differ by 3.6 × 10⁻¹⁷, resolved without rounding loss', () => {
    expect(heightShift(0.33) / weakFieldShift(g, 0.33)).toBeCloseTo(1, 4)
    expect(heightShift(0.33)).toBeCloseTo(3.6e-17, 18)
  })

  it('Mount Everest gains about 83 ns per day on sea level', () => {
    expect(heightShift(8848) * SECONDS_PER_DAY * 1e9).toBeCloseTo(83.4, 0)
  })

  it('the rate goes to zero at the horizon, and clocks cannot be held at or inside it', () => {
    const bh = body('black-hole')
    const rs = schwarzschildRadius(bh.mass)
    expect(staticClockRate(bh.mass, rs * (1 + 1e-6))).toBeLessThan(1.1e-3)
    expect(() => staticClockDeficit(bh.mass, rs)).toThrow(RangeError)
  })
})

describe('light signals between static clocks', () => {
  it('both observers agree: light going up is redshifted, coming down blueshifted, by inverse factors', () => {
    const m = body('neutron-star').mass
    const [low, high] = [1.3e4, 3e4]
    const up = gravitationalFrequencyShift(m, low, high)
    const down = gravitationalFrequencyShift(m, high, low)
    expect(up).toBeLessThan(0)
    expect(down).toBeGreaterThan(0)
    expect((1 + up) * (1 + down)).toBeCloseTo(1, 12)
  })
})

describe('GPS', () => {
  const gps = gpsBreakdown(earth.mass, earth.radius)
  const perDay = (x: number) => x * SECONDS_PER_DAY * 1e6

  it('gravity makes the satellite clock gain about 45.7 μs per day', () => {
    expect(perDay(gps.gravity)).toBeCloseTo(45.7, 0)
  })

  it('orbital speed makes it lose about 7.2 μs per day', () => {
    expect(perDay(gps.velocity)).toBeCloseTo(-7.2, 0)
  })

  it('net: about +38.5 μs per day, which is about 11.5 km of light travel', () => {
    expect(perDay(gps.net)).toBeCloseTo(38.5, 0)
    expect((gps.net * SECONDS_PER_DAY * SPEED_OF_LIGHT) / 1000).toBeCloseTo(11.5, 0)
  })

  it('the orbital speed is about 3.9 km/s', () => {
    expect(circularOrbitSpeed(earth.mass, 2.656e7) / 1000).toBeCloseTo(3.87, 2)
  })
})

describe('curved space: proper radial distance', () => {
  it('reduces to r2 − r1 for a negligible mass', () => {
    expect(properRadialDistance(1, 1e3, 2e3)).toBeCloseTo(1e3, 9)
  })

  it('exceeds r2 − r1 near a black hole, matching a numerical integral', () => {
    const m = body('black-hole').mass
    const rs = schwarzschildRadius(m)
    const [r1, r2] = [1.01 * rs, 2 * rs]
    // Midpoint rule with the substitution r = rs + u², which removes the 1/√ singularity.
    const n = 20000
    const [u1, u2] = [Math.sqrt(r1 - rs), Math.sqrt(r2 - rs)]
    let sum = 0
    for (let i = 0; i < n; i++) {
      const u = u1 + ((i + 0.5) * (u2 - u1)) / n
      const r = rs + u * u
      sum += (2 * u) / Math.sqrt(1 - rs / r)
    }
    const numeric = (sum * (u2 - u1)) / n
    const exact = properRadialDistance(m, r1, r2)
    expect(exact / numeric).toBeCloseTo(1, 6)
    expect(exact).toBeGreaterThan(r2 - r1)
  })
})
