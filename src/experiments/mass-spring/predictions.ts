import type { Prediction } from '@/experiments/prediction'
import { period } from '@/physics/massSpring'

export interface SpringRun {
  readonly k: number
  readonly mass: number
  readonly amplitude: number
  readonly period: number
}

const close = (a: number, b: number, rel = 1e-6) => Math.abs(a - b) <= rel * Math.max(1, Math.abs(a), Math.abs(b))

export function observedAmplitudeIndependence(runs: readonly SpringRun[]): boolean {
  return runs.some((a) =>
    runs.some(
      (b) =>
        a !== b &&
        close(a.k, b.k) &&
        close(a.mass, b.mass) &&
        !close(a.amplitude, b.amplitude) &&
        close(a.period, b.period, 1e-4),
    ),
  )
}

export function observedMassEffect(runs: readonly SpringRun[]): boolean {
  return runs.some((a) =>
    runs.some(
      (b) =>
        a !== b &&
        close(a.k, b.k) &&
        close(a.amplitude, b.amplitude) &&
        !close(a.mass, b.mass) &&
        !close(a.period, b.period, 1e-4),
    ),
  )
}

export function observedStiffnessEffect(runs: readonly SpringRun[]): boolean {
  return runs.some((a) =>
    runs.some(
      (b) =>
        a !== b &&
        close(a.mass, b.mass) &&
        close(a.amplitude, b.amplitude) &&
        !close(a.k, b.k) &&
        !close(a.period, b.period, 1e-4),
    ),
  )
}

export const PREDICTIONS: readonly Prediction<SpringRun>[] = [
  {
    id: 'amplitude',
    minLevel: 'beginner',
    question: 'You pull the mass farther from equilibrium (larger amplitude) and release it from rest. What happens to the period?',
    task: 'Keep mass and spring constant fixed. Run two trials with clearly different amplitudes and compare the periods.',
    options: [
      { id: 'longer', label: 'The period becomes longer' },
      { id: 'shorter', label: 'The period becomes shorter' },
      { id: 'same', label: 'The period stays the same' },
    ],
    correct: 'same',
    explanation:
      'For an ideal Hookean spring the period depends only on mass and stiffness: T = 2π√(m/k). Amplitude cancels out of the equation of motion. (Real springs and large amplitudes can break this idealisation.)',
    observed: observedAmplitudeIndependence,
    hint: (runs) =>
      observedAmplitudeIndependence(runs)
        ? null
        : 'Keep m and k the same, change only the starting displacement, then compare the two periods.',
  },
  {
    id: 'mass',
    minLevel: 'beginner',
    question: 'You replace the mass with one that is four times heavier, keeping the same spring. What happens to the period?',
    task: 'Keep k and amplitude fixed. Run trials with two different masses and compare the periods.',
    options: [
      { id: 'double', label: 'The period doubles' },
      { id: 'half', label: 'The period halves' },
      { id: 'same', label: 'The period stays the same' },
      { id: 'quadruple', label: 'The period becomes four times longer' },
    ],
    correct: 'double',
    explanation: 'T = 2π√(m/k). Multiplying m by 4 multiplies √m by 2, so the period doubles.',
    observed: observedMassEffect,
    hint: (runs) =>
      observedMassEffect(runs) ? null : 'Keep the spring and the amplitude the same; change only the mass.',
  },
  {
    id: 'stiffness',
    minLevel: 'intermediate',
    question: 'You use a stiffer spring (larger k) with the same mass. What happens to the period?',
    task: 'Keep mass and amplitude fixed. Compare periods for two different spring constants.',
    options: [
      { id: 'longer', label: 'The period becomes longer' },
      { id: 'shorter', label: 'The period becomes shorter' },
      { id: 'same', label: 'The period stays the same' },
    ],
    correct: 'shorter',
    explanation: 'A larger k means a stronger restoring force for the same displacement, a higher natural frequency, and therefore a shorter period: T ∝ 1/√k.',
    observed: observedStiffnessEffect,
    hint: (runs) =>
      observedStiffnessEffect(runs) ? null : 'Keep m and amplitude fixed; change only the spring constant k.',
  },
]

/** Helper used by the experiment page when recording a run. */
export function makeRun(k: number, mass: number, amplitude: number): SpringRun {
  return { k, mass, amplitude, period: period(k, mass) }
}
