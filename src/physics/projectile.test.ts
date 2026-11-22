import { describe, expect, it } from 'vitest'
import {
  PLANETS,
  dragConstant,
  exactFlightTime,
  exactMaxHeight,
  exactRange,
  exactState,
  galileanBoost,
  optimalAngle,
  simulateFlight,
  simulatedRange,
  specificEnergy,
  stateAtTime,
  terminalSpeed,
  type LaunchParams,
  type ProjectileState,
} from './index'

const earth = PLANETS.find((p) => p.id === 'earth')!
const moon = PLANETS.find((p) => p.id === 'moon')!
const kEarth = dragConstant(earth.airDensity)
const base: LaunchParams = { speed: 20, angleDeg: 45, height: 0, g: earth.g, k: 0 }
const last = (f: ProjectileState[]) => f[f.length - 1] as ProjectileState

describe('without air: exact formulas', () => {
  it('45° at 20 m/s on Earth: range v²/g = 40.8 m, height v²/4g = 10.2 m', () => {
    expect(exactRange(base)).toBeCloseTo((20 * 20) / earth.g, 10)
    expect(exactMaxHeight(base)).toBeCloseTo((20 * 20) / (4 * earth.g), 10)
  })

  it('complementary angles (30° and 60°) give the same range from the ground', () => {
    expect(exactRange({ ...base, angleDeg: 30 })).toBeCloseTo(exactRange({ ...base, angleDeg: 60 }), 10)
  })

  it('the Moon multiplies the range by g_Earth / g_Moon ≈ 6.06', () => {
    expect(exactRange({ ...base, g: moon.g }) / exactRange(base)).toBeCloseTo(earth.g / moon.g, 10)
  })

  it('a ball thrown horizontally lands at the same moment as one dropped from the same height', () => {
    const thrown = exactFlightTime({ ...base, angleDeg: 0, height: 20 })
    const dropped = exactFlightTime({ ...base, speed: 0, angleDeg: 0, height: 20 })
    expect(thrown).toBeCloseTo(dropped, 12)
    expect(dropped).toBeCloseTo(Math.sqrt((2 * 20) / earth.g), 12)
  })

  it('seen from a frame moving with the horizontal velocity, the ball goes straight up and down', () => {
    const vx = 20 * Math.cos(Math.PI / 4)
    for (const t of [0.5, 1, 2]) expect(galileanBoost(exactState(base, t), vx).x).toBeCloseTo(0, 10)
  })
})

describe('RK4 integration', () => {
  it('reproduces the exact solution when there is no drag', () => {
    const flight = simulateFlight({ ...base, angleDeg: 35, height: 12 })
    expect(last(flight).x).toBeCloseTo(exactRange({ ...base, angleDeg: 35, height: 12 }), 6)
    expect(last(flight).t).toBeCloseTo(exactFlightTime({ ...base, angleDeg: 35, height: 12 }), 6)
    expect(last(flight).y).toBe(0)
  })

  it('conserves energy without drag', () => {
    const flight = simulateFlight({ ...base, height: 5 })
    const e0 = specificEnergy(flight[0] as ProjectileState, earth.g)
    for (const s of flight) expect(specificEnergy(s, earth.g)).toBeCloseTo(e0, 8)
  })

  it('is fourth order: halving the step cuts the error by about 16', () => {
    const p = { ...base, speed: 40, k: kEarth }
    const reference = simulatedRange(p, 0.0005)
    const e1 = Math.abs(simulatedRange(p, 0.08) - reference)
    const e2 = Math.abs(simulatedRange(p, 0.04) - reference)
    expect(e1 / e2).toBeGreaterThan(10)
    expect(e1 / e2).toBeLessThan(25)
  })

  it('with drag, energy only ever decreases', () => {
    const flight = simulateFlight({ ...base, speed: 40, k: kEarth })
    for (let i = 1; i < flight.length; i++) {
      expect(specificEnergy(flight[i] as ProjectileState, earth.g)).toBeLessThan(specificEnergy(flight[i - 1] as ProjectileState, earth.g) + 1e-9)
    }
  })

  it('a dropped baseball approaches its terminal speed √(g/k) ≈ 40 m/s', () => {
    const vt = terminalSpeed(earth.g, kEarth)
    expect(vt).toBeGreaterThan(35)
    expect(vt).toBeLessThan(45)
    const flight = simulateFlight({ speed: 0, angleDeg: 0, height: 2000, g: earth.g, k: kEarth })
    expect(-last(flight).vy / vt).toBeCloseTo(1, 3)
  })
})

describe('best launch angle', () => {
  it('is 45° without air', () => {
    expect(optimalAngle({ speed: 20, height: 0, g: earth.g, k: 0 })).toBeCloseTo(45, 0)
  })

  it('is lower than 45° for a fast baseball in air (about 41° at 40 m/s), and 40° beats 45°', () => {
    const best = optimalAngle({ speed: 40, height: 0, g: earth.g, k: kEarth })
    expect(best).toBeCloseTo(40.9, 0)
    const range = (angleDeg: number) => simulatedRange({ speed: 40, angleDeg, height: 0, g: earth.g, k: kEarth })
    expect(range(40)).toBeGreaterThan(range(45))
  })

  it('is lower than 45° when launched from a height, even without air', () => {
    expect(optimalAngle({ speed: 10, height: 20, g: earth.g, k: 0 })).toBeLessThan(40)
  })
})

describe('with drag, the directions are coupled', () => {
  it('a ball thrown sideways lands later than one dropped from the same height', () => {
    const thrown = last(simulateFlight({ speed: 40, angleDeg: 0, height: 20, g: earth.g, k: kEarth })).t
    const dropped = last(simulateFlight({ speed: 0, angleDeg: 0, height: 20, g: earth.g, k: kEarth })).t
    expect(thrown).toBeGreaterThan(dropped)
  })
})

describe('sampling', () => {
  it('interpolates states between samples and clamps to the flight', () => {
    const flight = simulateFlight(base)
    expect(stateAtTime(flight, 1).x).toBeCloseTo(exactState(base, 1).x, 6)
    expect(stateAtTime(flight, 1e6)).toEqual(last(flight))
  })
})
