import type { Prediction } from '@/experiments/prediction'

/** One recorded measurement of the moving spaceship in the Earth frame. */
export interface LengthMeasurement {
  /** Speed as a fraction of c. */
  readonly beta: number
  readonly properLength: number
  readonly measuredLength: number
}

const close = (a: number, b: number, tolerance = 0.005) => Math.abs(a - b) <= tolerance

/** A measurement at a clearly relativistic speed. */
export function observedFastMeasurement(runs: readonly LengthMeasurement[]): boolean {
  return runs.some((r) => r.beta >= 0.5)
}

/** A measurement with the ship at rest relative to Earth. */
export function observedAtRest(runs: readonly LengthMeasurement[]): boolean {
  return runs.some((r) => r.beta === 0)
}

/** The same ship measured at 0.4c and at 0.8c. */
export function observedDoubledSpeed(runs: readonly LengthMeasurement[]): boolean {
  return runs.some((slow) => close(slow.beta, 0.4) && runs.some((fast) => close(fast.beta, 0.8) && fast.properLength === slow.properLength))
}

export const PREDICTIONS: readonly Prediction<LengthMeasurement>[] = [
  {
    id: 'moving',
    minLevel: 'beginner',
    question: 'A spaceship 10 m long passes Earth at 0.8c. Earth observers record the positions of its front and rear at the same Earth time. What length do they measure?',
    task: 'Set the speed to 0.5c or more and run the measurement. Compare the measured length L with the proper length L₀.',
    options: [
      { id: 'same', label: 'The same 10 m' },
      { id: 'shorter', label: 'Shorter than 10 m' },
      { id: 'longer', label: 'Longer than 10 m' },
      { id: 'zero', label: 'Zero: it moves too fast to measure' },
    ],
    correct: 'shorter',
    explanation:
      'Earth observers measure L = L₀/γ: at 0.8c, γ = 1.667 and the 10 m ship measures 6 m. Nothing squeezes the ship. In its own rest frame it is still 10 m long, its proper length. The two frames disagree about which pair of endpoint events happened “at the same time”, so they disagree about the length.',
    observed: observedFastMeasurement,
    hint: (runs) => (runs.length > 0 && !observedFastMeasurement(runs) ? 'At low speeds the difference is tiny. Raise the speed to 0.5c or more and measure again.' : null),
  },
  {
    id: 'rest',
    minLevel: 'beginner',
    question: 'The same spaceship is parked next to Earth, at rest relative to the Earth observers. What length do they measure now?',
    task: 'Set the relative speed to 0 and run the measurement.',
    options: [
      { id: 'proper', label: 'Its proper length, 10 m' },
      { id: 'shorter', label: 'Still a little shorter than 10 m' },
      { id: 'longer', label: 'Longer than 10 m' },
    ],
    correct: 'proper',
    explanation:
      'With no relative motion, Earth and the ship share one frame and agree on what “at the same time” means, so Earth measures the proper length, 10 m. Length contraction is not a permanent change to the ship. It depends only on the relative speed between the object and whoever measures it.',
    observed: observedAtRest,
    hint: (runs) => (runs.length > 0 && !observedAtRest(runs) ? 'Move the speed slider all the way to 0 and measure again.' : null),
  },
  {
    id: 'doubling',
    minLevel: 'intermediate',
    question: 'The ship’s speed doubles from 0.4c to 0.8c. How does the amount by which it is shortened, L₀ − L, change?',
    task: 'Keep the proper length fixed. Measure at 0.40c and at 0.80c, then compare the length differences in the table.',
    options: [
      { id: 'double', label: 'It doubles, like the speed' },
      { id: 'five', label: 'It grows almost five times' },
      { id: 'same', label: 'It stays the same' },
      { id: 'half', label: 'It halves' },
    ],
    correct: 'five',
    explanation:
      'L = L₀√(1 − v²/c²) is far from linear in v. At 0.4c a 10 m ship is shortened by 0.83 m; at 0.8c by 4 m, almost five times as much. At low speeds L₀ − L ≈ L₀v²/(2c²) grows with the square of the speed, and close to c the shortening grows faster still. That is why the effect goes unnoticed at everyday speeds.',
    observed: observedDoubledSpeed,
    hint: (runs) => {
      if (observedDoubledSpeed(runs)) return null
      if (runs.some((r) => close(r.beta, 0.4))) return 'Now measure the same ship at 0.80c.'
      if (runs.some((r) => close(r.beta, 0.8))) return 'Now measure the same ship at 0.40c.'
      return null
    },
  },
  {
    id: 'simultaneity',
    minLevel: 'advanced',
    question: 'Earth records the rear and the front at the same Earth time. In the ship’s frame, are those two recording events simultaneous?',
    task: 'Run a measurement at any non-zero speed and read the endpoint timing difference in the ship frame.',
    options: [
      { id: 'yes', label: 'Yes: simultaneous events are simultaneous for everyone' },
      { id: 'front', label: 'No: the front is recorded first, by vL₀/c²' },
      { id: 'rear', label: 'No: the rear is recorded first, by vL₀/c²' },
    ],
    correct: 'front',
    explanation:
      'The Lorentz transformation gives Δt′ = γ(Δt − vΔx/c²) = −vL₀/c² for Δt = 0: in the ship frame the front is recorded first. From the ship’s point of view, Earth did not mark the two ends at the same time, so Earth’s result is not a length in the ship’s frame and need not equal L₀. Length contraction is the relativity of simultaneity applied to the two ends of an object.',
    observed: (runs) => runs.some((r) => r.beta > 0),
    hint: (runs) => (runs.length > 0 && runs.every((r) => r.beta === 0) ? 'At zero speed both frames agree. Choose a non-zero speed and measure again.' : null),
  },
]
