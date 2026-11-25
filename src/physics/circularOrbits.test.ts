import { describe, expect, it } from 'vitest'
import {
  CIRCULAR_TOLERANCE, EARTH_GM, EARTH_RADIUS, centripetalAcceleration, circularSpeed, escapeSpeed,
  gravitationalAcceleration, launchOrbit, orbitalPeriod,
} from './circularOrbits'

const R = EARTH_RADIUS
const launch = (radius: number, speedFactor: number) => launchOrbit({ gm: EARTH_GM, planetRadius: R, radius, speedFactor }, radius * 6, 2000)

/** Independent check: integrate Newton's law of gravitation with RK4 from the same launch. */
function integrate(r0: number, f: number, steps = 200_000) {
  const v0 = f * Math.sqrt(EARTH_GM / r0)
  let s = [r0, 0, 0, v0]
  const deriv = ([x, y, vx, vy]: number[]) => { const r3 = Math.hypot(x!, y!) ** 3; return [vx!, vy!, -EARTH_GM * x! / r3, -EARTH_GM * y! / r3] }
  const T = orbitalPeriod(EARTH_GM, r0 / (2 - f * f))
  const h = (1.5 * T) / steps
  let rMin = Infinity, rMax = 0, returnTime: number | null = null
  for (let i = 0; i < steps; i += 1) {
    const add = (a: number[], b: number[], k: number) => a.map((v, j) => v + k * b[j]!)
    const k1 = deriv(s), k2 = deriv(add(s, k1, h / 2)), k3 = deriv(add(s, k2, h / 2)), k4 = deriv(add(s, k3, h))
    const prevY = s[1]!
    s = s.map((v, j) => v + (h / 6) * (k1[j]! + 2 * k2[j]! + 2 * k3[j]! + k4[j]!))
    const r = Math.hypot(s[0]!, s[1]!)
    rMin = Math.min(rMin, r); rMax = Math.max(rMax, r)
    if (returnTime === null && i > 10 && prevY < 0 && s[1]! >= 0 && s[0]! > 0) returnTime = (i + 1) * h
  }
  return { rMin, rMax, period: returnTime }
}

describe('circular motion', () => {
  it('needs a centripetal acceleration v²/r, which gravity supplies exactly at the circular speed', () => {
    expect(centripetalAcceleration(20, 50)).toBe(8)
    for (const r of [1.1 * R, 2 * R, 6.6 * R]) {
      expect(centripetalAcceleration(circularSpeed(EARTH_GM, r), r)).toBeCloseTo(gravitationalAcceleration(EARTH_GM, r), 10)
    }
    expect(gravitationalAcceleration(EARTH_GM, R)).toBeCloseTo(9.82, 2)
  })

  it('matches real orbits: the ISS and a geostationary satellite', () => {
    const iss = R + 400e3
    expect(circularSpeed(EARTH_GM, iss) / 1000).toBeCloseTo(7.67, 2)
    expect(orbitalPeriod(EARTH_GM, iss) / 60).toBeCloseTo(92.4, 0)
    expect(orbitalPeriod(EARTH_GM, 42_164e3) / 3600).toBeCloseTo(23.93, 2) // one sidereal day
  })

  it('obeys Kepler’s third law and the √2 escape speed', () => {
    expect(orbitalPeriod(EARTH_GM, 4 * R) / orbitalPeriod(EARTH_GM, 2 * R)).toBeCloseTo(2 ** 1.5, 10)
    expect(escapeSpeed(EARTH_GM, 2 * R) / circularSpeed(EARTH_GM, 2 * R)).toBeCloseTo(Math.SQRT2, 12)
  })
})

describe('launching an orbit', () => {
  it('gives a circle at exactly the circular speed', () => {
    const orbit = launch(2 * R, 1)
    expect(orbit.outcome).toBe('circle')
    for (const p of orbit.points) expect(Math.hypot(p.x, p.y) / (2 * R)).toBeCloseTo(1, 10)
    expect(orbit.period).toBeCloseTo(orbitalPeriod(EARTH_GM, 2 * R), 6)
    expect(launch(2 * R, 1 + CIRCULAR_TOLERANCE / 2).outcome).toBe('circle')
  })

  it('gives an ellipse below and above circular speed, with the launch point farthest or closest', () => {
    const slow = launch(3 * R, 0.9)
    expect(slow.outcome).toBe('ellipse')
    expect(slow.maxRadius).toBeCloseTo(3 * R, 3)
    expect(slow.minRadius).toBeLessThan(3 * R)
    const fast = launch(2 * R, 1.2)
    expect(fast.outcome).toBe('ellipse')
    expect(fast.minRadius).toBeCloseTo(2 * R, 3)
    expect(fast.maxRadius).toBeGreaterThan(2 * R)
    expect(fast.energy).toBeLessThan(0)
  })

  it('agrees with a direct numerical integration of Newton’s law', () => {
    for (const [r0, f] of [[2 * R, 1.2], [3 * R, 0.85], [1.5 * R, 1.05]] as const) {
      const exact = launch(r0, f)
      const numeric = integrate(r0, f)
      expect(numeric.rMin / exact.minRadius, `${f} min`).toBeCloseTo(1, 4)
      expect(numeric.rMax / exact.maxRadius, `${f} max`).toBeCloseTo(1, 4)
      expect(numeric.period! / exact.period!, `${f} period`).toBeCloseTo(1, 3)
    }
  })

  it('escapes at √2 times circular speed and above, with zero or positive energy', () => {
    expect(launch(2 * R, 1.4).outcome).toBe('ellipse')
    const escape = launch(2 * R, 1.42)
    expect(escape.outcome).toBe('escape')
    expect(escape.energy).toBeGreaterThan(0)
    expect(escape.period).toBeNull()
    expect(escape.maxRadius).toBe(Infinity)
  })

  it('ends the path at the surface when the ellipse dips inside the planet', () => {
    const orbit = launch(1.5 * R, 0.7)
    expect(orbit.outcome).toBe('crash')
    expect(orbit.period).toBeNull()
    const last = orbit.points.at(-1)!
    expect(Math.hypot(last.x, last.y) / R).toBeCloseTo(1, 6)
  })

  it('rejects launches from inside the planet or at zero speed', () => {
    expect(() => launch(0.5 * R, 1)).toThrow(RangeError)
    expect(() => launch(2 * R, 0)).toThrow(RangeError)
  })
})
