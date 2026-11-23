import type { Prediction } from '@/experiments/prediction'

export interface ForceRun {
  readonly force: number
  readonly mass: number
  readonly acceleration: number
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
]
