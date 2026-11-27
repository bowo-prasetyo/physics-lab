/** Predict–observe–explain prompts for “Space and time versus spacetime” (see experiments/prediction.ts). */

import type { Prediction } from '@/experiments/prediction'
import type { Scenario } from '@/physics'
import type { Observation } from './useTwoPerspectives'
import { SCENARIO_INFO } from './content'

/** The fastest speed that still counts as "everyday" in question 2. */
export const LOW_SPEED_LIMIT = 0.05
/** The slowest speed at which the relativistic effects are unmistakable. */
export const HIGH_SPEED = 0.5

const measuredIn = (runs: readonly Observation[], scenario: Scenario) => runs.filter((o) => o.scenario === scenario)

export function observedFastHeadlight(runs: readonly Observation[]): boolean {
  return measuredIn(runs, 'light').some((o) => o.beta >= HIGH_SPEED)
}

export function fastHeadlightHint(runs: readonly Observation[]): string | null {
  if (observedFastHeadlight(runs)) return null
  if (measuredIn(runs, 'light').length > 0) return `Set the ship speed to at least ${HIGH_SPEED.toFixed(2)}c and make the measurement again.`
  if (runs.length > 0) return 'Choose the “Headlight” scenario, then make the measurement.'
  return null
}

export function observedEverydayClock(runs: readonly Observation[]): boolean {
  return measuredIn(runs, 'clock').some((o) => o.beta > 0 && o.beta <= LOW_SPEED_LIMIT)
}

export function everydayClockHint(runs: readonly Observation[]): string | null {
  if (observedEverydayClock(runs)) return null
  const clock = measuredIn(runs, 'clock')
  if (clock.some((o) => o.beta === 0)) return 'At exactly 0 nothing moves, so there is nothing to compare. Try 0.01c.'
  if (clock.length > 0) return `That speed is too high to be “everyday”. Lower it to ${LOW_SPEED_LIMIT.toFixed(2)}c or less (but above 0), e.g. 0.01c.`
  if (runs.length > 0) return 'Choose the “Moving clock” scenario, set a low speed such as 0.01c, and make the measurement.'
  return null
}

export function observedFlashes(runs: readonly Observation[]): boolean {
  return measuredIn(runs, 'flashes').some((o) => o.beta >= 0.3)
}

export function flashesHint(runs: readonly Observation[]): string | null {
  if (observedFlashes(runs)) return null
  if (measuredIn(runs, 'flashes').length > 0) return 'The effect is small at low speed. Set at least 0.30c and measure again.'
  if (runs.length > 0) return 'Choose the “Two flashes” scenario, then make the measurement.'
  return null
}

/** The three situations the equivalence question compares. */
const CORE_SCENARIOS = ['light', 'flashes', 'clock'] as const

const scenariosMeasuredFast = (runs: readonly Observation[]) =>
  new Set(runs.filter((o) => o.beta >= HIGH_SPEED).map((o) => o.scenario))

export function observedAllScenarios(runs: readonly Observation[]): boolean {
  const done = scenariosMeasuredFast(runs)
  return CORE_SCENARIOS.every((s) => done.has(s))
}

/** The ship speed for the probe question; the slider moves in steps of 0.01. */
export const PROBE_SHIP_SPEED = 0.8

export function observedFastProbe(runs: readonly Observation[]): boolean {
  return measuredIn(runs, 'probe').some((o) => o.beta >= PROBE_SHIP_SPEED - 1e-9)
}

export function fastProbeHint(runs: readonly Observation[]): string | null {
  if (observedFastProbe(runs)) return null
  if (measuredIn(runs, 'probe').length > 0) return 'Set the ship speed to 0.80c or more and make the measurement again.'
  if (runs.length > 0) return 'Choose the “Probe” situation, then make the measurement.'
  return null
}

/** Momentum measured at a moderate speed and at one at least twice as high. */
export function observedMomentumGrowth(runs: readonly Observation[]): boolean {
  const momentum = measuredIn(runs, 'momentum')
  return momentum.some((o) => o.beta > 0 && o.beta <= 0.45 + 1e-9) && momentum.some((o) => o.beta >= 0.9 - 1e-9)
}

export function momentumGrowthHint(runs: readonly Observation[]): string | null {
  if (observedMomentumGrowth(runs)) return null
  const momentum = measuredIn(runs, 'momentum')
  if (momentum.some((o) => o.beta >= 0.9 - 1e-9)) return 'Now measure the momentum at 0.45c or below (but above 0).'
  if (momentum.length > 0) return 'Now measure the momentum at 0.90c or above.'
  if (runs.length > 0) return 'Choose the “Momentum” situation, then measure at 0.45c and at 0.90c.'
  return null
}

export function allScenariosHint(runs: readonly Observation[]): string | null {
  if (observedAllScenarios(runs)) return null
  const done = scenariosMeasuredFast(runs)
  if (done.size === 0) return null
  const missing = (['light', 'flashes', 'clock'] as const).filter((s) => !done.has(s)).map((s) => `“${SCENARIO_INFO[s].tab}”`)
  return `Still to measure at ${HIGH_SPEED.toFixed(2)}c or more: ${missing.join(' and ')}.`
}

export const PREDICTIONS: readonly Prediction<Observation>[] = [
  {
    id: 'headlight',
    minLevel: 'beginner',
    question: 'A spaceship moving at 0.50c switches on its headlight, pointing forward. How fast does someone on the Earth measure the light to be travelling?',
    task: 'Choose “Headlight”, set the ship speed to 0.50c or more, and press “Make the measurement”.',
    options: [
      { id: 'sum', label: '1.50c: the ship’s speed adds to the light’s' },
      { id: 'c', label: '1.00c: exactly the speed of light' },
      { id: 'half', label: '0.50c' },
      { id: 'bit-more', label: 'A little more than 1.00c' },
    ],
    correct: 'c',
    explanation:
      'Every measurement gives c, however fast the source moves. The Galilean description, in which velocities simply add, predicts 1.50c ' +
      'and fails. Both relativistic descriptions predict c, for different-looking reasons: with separate space and time, velocities ' +
      'combine as (u + v)/(1 + uv/c²); in spacetime, light’s worldline has zero interval, and every observer agrees on that.',
    observed: observedFastHeadlight,
    hint: fastHeadlightHint,
  },
  {
    id: 'probe',
    minLevel: 'beginner',
    question: 'A spaceship moving at 0.80c launches a probe forward at 0.50c relative to the ship. How fast does someone on the Earth measure the probe to be moving?',
    task: 'Choose “Probe”, set the ship speed to 0.80c or more, and press “Make the measurement”.',
    options: [
      { id: 'sum', label: '1.30c: the two speeds add' },
      { id: 'capped', label: 'Exactly 1.00c: the sum would pass c, so it is held at c' },
      { id: 'between', label: 'About 0.93c: faster than the ship, but slower than light' },
    ],
    correct: 'between',
    explanation:
      'Velocities do not simply add. Measured from the Earth, w = (u + v)/(1 + uv/c²) = (0.5 + 0.8)/(1 + 0.4) ≈ 0.93c: faster than the ship, slower than light. No combination of speeds below c ever gives c, so nothing needs to “hold” the probe at c. In spacetime language, rapidities add: artanh w = artanh u + artanh v. At everyday speeds uv/c² is tiny and the ordinary sum is an excellent approximation. The headlight is the limiting case u = c, which gives exactly c.',
    observed: observedFastProbe,
    hint: fastProbeHint,
  },
  {
    id: 'everyday',
    minLevel: 'beginner',
    question:
      'At 0.01c (3 000 km/s, still far faster than any rocket), how big is the difference between the Galilean and the relativistic predictions for the moving clock?',
    task: 'Choose “Moving clock”, set a low speed such as 0.01c (above 0 and at most 0.05c), make the measurement, and compare the three predictions.',
    options: [
      { id: 'tiny', label: 'Tiny: about 0.005%' },
      { id: 'one', label: 'About 1%' },
      { id: 'ten', label: 'About 10%' },
      { id: 'total', label: 'They are completely different' },
    ],
    correct: 'tiny',
    explanation:
      'The relativistic clock is slow by a fraction 1 − 1/γ ≈ v²/2c², which is 0.00005 (0.005%) at 0.01c and far smaller at everyday speeds. ' +
      'That is why Newtonian physics works so well in daily life: the Galilean description is the low-speed limit of the relativistic ones. ' +
      'Light is the exception. Try the headlight at 0.01c: Galilean addition is already 1% wrong, and it is wrong for light at every speed.',
    observed: observedEverydayClock,
    hint: everydayClockHint,
  },
  {
    id: 'simultaneity',
    minLevel: 'intermediate',
    question:
      'Two lightning bolts strike at the same moment in the Earth frame, 10 light-seconds apart. A ship flies past at 0.60c, heading towards the front bolt. For the ship, which bolt strikes first?',
    task: 'Choose “Two flashes”, set 0.30c or more, and make the measurement.',
    options: [
      { id: 'same', label: 'Neither: they are still simultaneous' },
      { id: 'front', label: 'The front bolt (the one the ship is heading towards)' },
      { id: 'rear', label: 'The rear bolt' },
      { id: 'position', label: 'It depends on where the ship is when they strike' },
    ],
    correct: 'front',
    explanation:
      'For the ship, the front flash comes earlier by γvΔx/c², which is 7.5 s at 0.60c. Simultaneity is relative. The Galilean description, ' +
      'with one absolute time, says the flashes are simultaneous for everyone. The ship’s position does not matter: this is not about the ' +
      'time light takes to reach the ship, but about which distant events the ship’s synchronised clocks call simultaneous.',
    observed: observedFlashes,
    hint: flashesHint,
  },
  {
    id: 'momentum',
    minLevel: 'intermediate',
    question: 'The ship’s speed doubles, from 0.45c to 0.90c. Its momentum, measured from the Earth…',
    task: 'Choose “Momentum” and make the measurement at 0.45c or below, and at 0.90c or above.',
    options: [
      { id: 'doubles', label: 'Doubles, as p = mv says' },
      { id: 'more', label: 'More than doubles' },
      { id: 'less', label: 'Less than doubles, because the speed is limited by c' },
    ],
    correct: 'more',
    explanation:
      'Momentum is p = γmv. Doubling the speed from 0.45c to 0.90c multiplies it about four times, from 0.50 mc to 2.06 mc, because γ grows from 1.12 to 2.29. As v approaches c, γ grows without limit, so momentum does too, although the speed can never reach c: pushing a particle harder in an accelerator adds momentum and energy, but hardly any speed. At low speeds γ ≈ 1 and p ≈ mv, the momentum conserved in everyday collisions; γmv is the quantity conserved at every speed.',
    observed: observedMomentumGrowth,
    hint: momentumGrowthHint,
  },
  {
    id: 'equivalence',
    minLevel: 'advanced',
    question:
      'Is there any measurement for which the “space + time, Lorentz-related” description and the “spacetime” description predict different results?',
    task: `Make the measurement in the “Headlight”, “Two flashes” and “Moving clock” situations at ${HIGH_SPEED.toFixed(2)}c or more, and compare those two columns.`,
    options: [
      { id: 'fast', label: 'Yes, at speeds close to c' },
      { id: 'simultaneity', label: 'Yes, for simultaneity, which only spacetime can describe' },
      { id: 'none', label: 'No: they are two formulations of the same theory' },
      { id: 'dimension', label: 'Yes: spacetime predicts a fourth dimension we could detect' },
    ],
    correct: 'none',
    explanation:
      'They always agree, and must: the Lorentz transformation is exactly the hyperbolic rotation Λ(φ) that preserves the metric η. Any ' +
      'measurable prediction can be computed either from coordinates in a chosen frame or from invariants, and the results coincide. The ' +
      'descriptions differ in what they present as basic (separate space and time linked by a transformation, or a single geometry), not in ' +
      'what they predict. Whether either one tells us what reality is “really” like is a question of interpretation (section 4).',
    observed: observedAllScenarios,
    hint: allScenariosHint,
  },
]
