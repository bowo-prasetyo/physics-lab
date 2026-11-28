// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { IMPLEMENTED_EXPERIMENTS, MODULES } from '@/modules'
import { router } from '@/router'
import { SUPPORTED_LOCALES } from '@/i18n/locales'
import {
  applyWorkEnergyTheorem, calculateForceLab, calculateLengthContraction, calculateMomentumCollision, exactPeriod, exactRange, gamma,
  gpsBreakdown, intervalSquared, KM_S_MPC_PER_GYR, lorentzBoost, schwarzschildRadius, smallAnglePeriod,
  SOLAR_MASS, vec3, vectorInFrame, weakFieldShift, BODIES, SECONDS_PER_DAY, centripetalAcceleration, circularSpeed, EARTH_GM, EARTH_RADIUS, launchOrbit, workByConstantForce,
} from '@/physics'
import { BOUNDARY_EPSILON, PROBLEM_COPY, PROBLEM_SOURCES, RELATIVE_TOLERANCE, isNumericallyCorrect, isWithinTolerance, problemsFor } from './problem-bank'
import { getLearningPath } from './learning-content'

const answer = (id: string): number => {
  const problem = PROBLEM_SOURCES.find((p) => p.id === id)
  if (!problem) throw new Error(`No problem ${id}`)
  return problem.answer
}
/** The bank's answer agrees with the physics engine to well within the learner's tolerance. */
const agrees = (id: string, engine: number, within = RELATIVE_TOLERANCE / 2) =>
  expect(Math.abs(answer(id) - engine) / Math.abs(engine), id).toBeLessThan(within)

describe('problem coverage', () => {
  it('gives every experiment a Beginner problem', () => {
    for (const experiment of IMPLEMENTED_EXPERIMENTS) {
      expect(PROBLEM_SOURCES.some((p) => p.experiment === experiment.path && p.minLevel === 'beginner'), experiment.path).toBe(true)
    }
  })

  it('gives every module a problem at every level', () => {
    for (const module of MODULES) {
      const paths = new Set(module.experiments.map((e) => e.path))
      for (const level of ['beginner', 'intermediate', 'advanced'] as const) {
        expect(PROBLEM_SOURCES.some((p) => paths.has(p.experiment) && p.minLevel === level), `module ${module.number} ${level}`).toBe(true)
      }
    }
  })

  it('attaches every problem to an existing experiment, and shows them in its learning-path step', () => {
    const routes = new Set(router.getRoutes().map((r) => r.path))
    for (const p of PROBLEM_SOURCES) expect(routes.has(p.experiment), p.experiment).toBe(true)
    const shown = getLearningPath('en').chapters.flatMap((c) => c.steps.flatMap((s) => s.problems.map((p) => `${s.path} ${p.id}`)))
    expect(shown.sort()).toEqual(PROBLEM_SOURCES.map((p) => `${p.experiment} ${p.id}`).sort())
  })

  it('orders each step’s problems from Beginner to Advanced', () => {
    const order = { beginner: 0, intermediate: 1, advanced: 2 }
    for (const experiment of IMPLEMENTED_EXPERIMENTS) {
      const levels = problemsFor(experiment.path, 'en').map((p) => order[p.minLevel])
      expect(levels, experiment.path).toEqual([...levels].sort())
    }
  })

  it('redirects the retired Problem-Solving Lab route to the learning path', async () => {
    await router.push('/problem-solving')
    expect(router.currentRoute.value.path).toBe('/learning')
  })
})

describe('problem copy', () => {
  it('is complete in every language, with no stale entries', () => {
    const ids = PROBLEM_SOURCES.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(PROBLEM_COPY[locale]).sort(), locale).toEqual([...ids].sort())
      for (const id of ids) {
        const copy = PROBLEM_COPY[locale][id]!
        for (const text of [copy.title, copy.scenario, copy.given, copy.target, copy.unit, copy.formula, copy.hint]) {
          expect(text.trim(), `${locale} ${id}`).not.toBe('')
        }
        expect(copy.steps.length, `${locale} ${id}`).toBeGreaterThanOrEqual(3)
        expect(copy.steps.every((step) => step.trim() !== ''), `${locale} ${id}`).toBe(true)
        if (locale !== 'en') {
          expect(copy.scenario, `${locale} ${id}`).not.toBe(PROBLEM_COPY.en[id]!.scenario)
          expect(copy.hint, `${locale} ${id}`).not.toBe(PROBLEM_COPY.en[id]!.hint)
        }
      }
    }
  })
})

describe('answer checking', () => {
  it('accepts answers within 2% and rejects the rest', () => {
    const problem = { answer: 5 / 3 }
    expect(isNumericallyCorrect(problem, '1.6667')).toBe(true)
    expect(isNumericallyCorrect(problem, '1,67')).toBe(true)
    expect(isNumericallyCorrect(problem, '1.7')).toBe(true) // sensible rounding is right
    expect(isNumericallyCorrect(problem, ' 1.65 ')).toBe(true)
    expect(isNumericallyCorrect(problem, '1.6')).toBe(false) // 4% off
    expect(isNumericallyCorrect(problem, '2')).toBe(false)
    expect(isNumericallyCorrect(problem, '')).toBe(false)
    expect(isNumericallyCorrect(problem, 'not a number')).toBe(false)
  })

  it('scales the tolerance with the answer and respects its sign', () => {
    expect(isNumericallyCorrect({ answer: 6.6667 }, '6.7')).toBe(true)
    expect(isNumericallyCorrect({ answer: 35.35 }, '35')).toBe(true)
    expect(isNumericallyCorrect({ answer: 9.42 }, '9.4')).toBe(true)
    expect(isNumericallyCorrect({ answer: -2 }, '−2')).toBe(true)
    expect(isNumericallyCorrect({ answer: -2 }, '-2.0')).toBe(true)
    expect(isNumericallyCorrect({ answer: -2 }, '2')).toBe(false)
  })

  it('has a finite, non-zero answer for every problem', () => {
    for (const p of PROBLEM_SOURCES) {
      expect(Number.isFinite(p.answer), p.id).toBe(true)
      expect(p.answer, p.id).not.toBe(0)
    }
  })
})

describe('answers agree with the physics engine', () => {
  it('Module 1: displacement and changing axes', () => {
    agrees('displacement-3d', Math.hypot(1, 2, 2))
    agrees('axis-rotation', vectorInFrame(vec3(3, 4, 0), { origin: vec3(), yawDeg: 30, pitchDeg: 0 }).x)
  })

  it('Module 2: pendulum periods', () => {
    agrees('pendulum-period', smallAnglePeriod(1, 9.81))
    agrees('pendulum-moon', 2 * smallAnglePeriod(1, 1.62) / smallAnglePeriod(1, 9.81))
    // The first-order correction is the problem's model; the exact period stays within the learner's tolerance.
    const exactPercent = 100 * (exactPeriod(1, 9.81, Math.PI / 6) / smallAnglePeriod(1, 9.81) - 1)
    agrees('pendulum-amplitude', exactPercent, RELATIVE_TOLERANCE)
  })

  it('Module 3: forces, collisions and projectiles', () => {
    agrees('kinetic-friction-level', calculateForceLab({ scenario: 'horizontal', mass: 10, appliedForce: 30, staticFrictionCoefficient: 0.2, kineticFrictionCoefficient: 0.2, inclineAngle: 0, duration: 1, gravity: 9.8 }).acceleration)
    agrees('incline-slide', Math.abs(calculateForceLab({ scenario: 'incline', mass: 1, appliedForce: 0, staticFrictionCoefficient: 0.2, kineticFrictionCoefficient: 0.2, inclineAngle: 30, duration: 1, gravity: 9.8 }).acceleration))
    agrees('inelastic-collision', calculateMomentumCollision({ mass1: 2, mass2: 1, velocity1: 3, velocity2: -1, restitution: 0 }).velocity1After)
    agrees('elastic-rebound', calculateMomentumCollision({ mass1: 1, mass2: 3, velocity1: 4, velocity2: 0, restitution: 1 }).velocity1After)
    agrees('projectile-range', exactRange({ speed: 20, angleDeg: 30, height: 0, g: 9.8, k: 0 }))
    agrees('car-bend', centripetalAcceleration(20, 50))
    agrees('iss-speed', circularSpeed(EARTH_GM, 6.77e6) / 1000)
    agrees('projectile-horizontal', exactRange({ speed: 2, angleDeg: 0, height: 1.25, g: 9.8, k: 0 }))
  })

  it('Module 3: work and mechanical energy', () => {
    const cart = applyWorkEnergyTheorem(10, 2, [workByConstantForce(50, 4), workByConstantForce(10, 4, 180)])
    agrees('work-energy-speed', cart.finalSpeed)
    agrees('circular-orbit-energy', launchOrbit({ gm: 3.99e14, planetRadius: EARTH_RADIUS, radius: 6.77e6, speedFactor: 1 }).energy / 1e6)
  })

  it('Module 4: special relativity', () => {
    agrees('time-dilation', 4 * gamma(0.8))
    agrees('length-contraction', calculateLengthContraction(100, 0.6).measuredLength)
    agrees('interval-proper-time', Math.sqrt(intervalSquared({ t: 5, x: 3 })))
    agrees('lorentz-time', lorentzBoost({ t: 5, x: 3 }, 0.6).t)
    agrees('simultaneity-offset', Math.abs(lorentzBoost({ t: 0, x: 6 }, 0.8).t))
  })

  it('Module 5: clock rates and orbits', () => {
    const earth = BODIES.find((b) => b.id === 'earth')!
    const gps = gpsBreakdown(earth.mass, earth.radius)
    agrees('gps-net', gps.net * SECONDS_PER_DAY * 1e6)
    agrees('height-clock-gain', weakFieldShift(9.81, 1000) * SECONDS_PER_DAY * 1e9)
    agrees('sun-schwarzschild-radius', schwarzschildRadius(SOLAR_MASS) / 1000)
    expect(answer('mercury-precession')).toBeCloseTo(43, 0) // the measured anomaly, in arcseconds per century
  })

  it('Module 6: expansion', () => {
    agrees('hubble-time', 1 / (70 * KM_S_MPC_PER_GYR))
    agrees('matter-age', 2 / (3 * 70 * KM_S_MPC_PER_GYR))
  })
})


describe('numeric input hardening', () => {
  it('accepts decimal and scientific notation without accepting JavaScript numeric literals', () => {
    expect(isNumericallyCorrect({ answer: 1200 }, '1.2e3')).toBe(true)
    expect(isNumericallyCorrect({ answer: 0.5 }, '.5')).toBe(true)
    expect(isNumericallyCorrect({ answer: 5 }, '5.')).toBe(true)
    expect(isNumericallyCorrect({ answer: 1.67 }, '1,67')).toBe(true)
    expect(isNumericallyCorrect({ answer: -2 }, '−2')).toBe(true)
    for (const raw of ['0x10', '0b10', '0o10', 'Infinity', '-Infinity', 'NaN', '1,2,3', '.', '+', '1e']) {
      expect(isNumericallyCorrect({ answer: 16 }, raw), raw).toBe(false)
    }
  })

  it('rejects non-finite values and handles zero targets safely', () => {
    for (const raw of ['1e999', '-1e999']) {
      expect(isNumericallyCorrect({ answer: 1 }, raw), raw).toBe(false)
    }
    expect(isWithinTolerance(0, 0)).toBe(true)
    expect(isWithinTolerance(0, BOUNDARY_EPSILON / 2)).toBe(true)
    expect(isWithinTolerance(0, 1e-4)).toBe(false)
    expect(isWithinTolerance(Number.NaN, 1)).toBe(false)
    expect(isWithinTolerance(1, Number.POSITIVE_INFINITY)).toBe(false)
  })
})
