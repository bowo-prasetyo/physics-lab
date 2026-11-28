import type { Prediction } from '@/experiments/prediction'

export interface ForceRun {
  readonly force: number
  readonly mass: number
  readonly acceleration: number
  /** Elapsed time of the trial (s) and the displacement from rest it produced (m). */
  readonly time: number
  readonly displacement: number
}

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9

export function observedMassComparison(runs: readonly ForceRun[]): boolean {
  return runs.some((a) => runs.some((b) =>
    a !== b && close(a.force, b.force) && !close(a.mass, b.mass) && !close(a.acceleration, b.acceleration),
  ))
}

export function observedForceComparison(runs: readonly ForceRun[]): boolean {
  return runs.some((a) => runs.some((b) =>
    a !== b && close(a.mass, b.mass) && !close(a.force, b.force) && !close(a.acceleration, b.acceleration),
  ))
}

/** Two trials with different forces and different masses but the same force-to-mass ratio. */
export function observedEqualRatio(runs: readonly ForceRun[]): boolean {
  return runs.some((a) => runs.some((b) =>
    a !== b && !close(a.force, b.force) && !close(a.mass, b.mass) && close(a.force / a.mass, b.force / b.mass),
  ))
}

/** Two trials with the same force and mass, one lasting exactly twice as long as the other. */
export function observedDoubledTime(runs: readonly ForceRun[]): boolean {
  return runs.some((a) => runs.some((b) =>
    a !== b && close(a.force, b.force) && close(a.mass, b.mass) && close(b.time, 2 * a.time),
  ))
}

/** Near-miss: both force and mass were changed, but not by the same factor. */
function equalRatioHint(runs: readonly ForceRun[]): string | null {
  if (observedEqualRatio(runs)) return null
  const triedBoth = runs.some((a) => runs.some((b) => a !== b && !close(a.force, b.force) && !close(a.mass, b.mass)))
  return triedBoth
    ? 'You changed both the force and the mass, but not by the same factor. Try 20 N on 2 kg, then 40 N on 4 kg.'
    : 'Change both the net force and the mass by the same factor, for example 20 N on 2 kg and then 40 N on 4 kg.'
}

/** Near-miss: the times differed, but not by a factor of two, or the force or mass changed too. */
function doubledTimeHint(runs: readonly ForceRun[]): string | null {
  if (observedDoubledTime(runs)) return null
  const triedTimes = runs.some((a) => runs.some((b) => a !== b && close(a.force, b.force) && close(a.mass, b.mass) && !close(a.time, b.time)))
  return triedTimes
    ? 'Your two times are not in the ratio 1 : 2. Keep the force and mass, and use 2 s and 4 s (or 1 s and 2 s).'
    : 'Keep the force and the mass fixed, and run once with an elapsed time of 2 s and once with 4 s.'
}

export const PREDICTIONS: readonly Prediction<ForceRun>[] = [
  {
    id: 'mass',
    minLevel: 'beginner',
    question: 'You push two carts with the same net force. One cart has twice the mass. What happens to its acceleration?',
    task: 'Run the model twice with the same force and two different masses. Compare the measured accelerations.',
    options: [
      { id: 'same', label: 'Both accelerate equally' },
      { id: 'half', label: 'The heavier cart accelerates half as much' },
      { id: 'double', label: 'The heavier cart accelerates twice as much' },
    ],
    correct: 'half',
    explanation: 'Newton’s second law is a = F_net/m. At the same net force, doubling the mass halves the acceleration. Mass measures resistance to a change in motion.',
    observed: observedMassComparison,
    hint: (runs) => observedMassComparison(runs) ? null : 'Keep the net force unchanged, then compare a light and a heavier cart.',
  },
  {
    id: 'force',
    minLevel: 'beginner',
    question: 'You double the net force on the same cart. What happens to its acceleration?',
    task: 'Keep mass fixed, then run the model at two different net forces and compare the accelerations.',
    options: [
      { id: 'same', label: 'It stays the same' },
      { id: 'half', label: 'It halves' },
      { id: 'double', label: 'It doubles' },
    ],
    correct: 'double',
    explanation: 'For a fixed mass, acceleration is directly proportional to net force: doubling the net force doubles the acceleration.',
    observed: observedForceComparison,
    hint: (runs) => observedForceComparison(runs) ? null : 'Keep the mass unchanged, then compare two different net forces.',
  },
  {
    id: 'ratio',
    minLevel: 'intermediate',
    question: 'Cart A, 2 kg, is pushed with a net force of 20 N. Cart B, 4 kg, is pushed with 40 N. Which cart has the larger acceleration?',
    task: 'Run one trial at 20 N with 2 kg and another at 40 N with 4 kg, then compare the accelerations.',
    options: [
      { id: 'b', label: 'Cart B, because it is pushed twice as hard' },
      { id: 'a', label: 'Cart A, because it is lighter' },
      { id: 'same', label: 'Neither: both accelerate equally' },
    ],
    correct: 'same',
    explanation: 'Acceleration depends on the ratio F_net/m, not on the force or the mass alone. Both carts have 10 N per kilogram, so both accelerate at 10 m/s². Doubling the force and doubling the mass cancel exactly.',
    observed: observedEqualRatio,
    hint: equalRatioHint,
  },
  {
    id: 'time-squared',
    minLevel: 'advanced',
    question: 'A cart starts from rest under a constant net force. After 2 s it has moved a certain distance. With the same force and mass, how far has it moved after 4 s?',
    task: 'Keep the force and mass fixed. Run once with an elapsed time of 2 s and once with 4 s, then compare the two displacements in the trial table.',
    options: [
      { id: 'double', label: 'Twice as far, because it moves for twice as long' },
      { id: 'between', label: 'More than twice as far, but less than four times' },
      { id: 'four', label: 'Four times as far' },
    ],
    correct: 'four',
    explanation: 'From rest at constant acceleration, Δx = ½at². Doubling t multiplies Δx by 2² = 4: the cart moves for twice as long and its average speed, at/2, is also twice as large. Distance grows in proportion to time only when the speed is constant.',
    observed: observedDoubledTime,
    hint: doubledTimeHint,
  },
]
