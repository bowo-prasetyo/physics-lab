import type { Prediction } from '@/experiments/prediction'

export interface InclineRun {
  readonly mass: number
  readonly length: number
  readonly angleDeg: number
  readonly muK: number
  readonly muS: number
  readonly staysAtRest: boolean
  readonly speedAtBottom: number | null
  readonly kineticAtBottom: number | null
  readonly height: number
}

const close = (a: number, b: number, rel = 1e-4) =>
  Math.abs(a - b) <= rel * Math.max(1, Math.abs(a), Math.abs(b))

export function observedFrictionlessHeight(runs: readonly InclineRun[]): boolean {
  // Two frictionless runs (μ≈0) with same height but different angles → same speed
  const frictionless = runs.filter((r) => r.muK < 0.01 && !r.staysAtRest && r.speedAtBottom != null)
  return frictionless.some((a) =>
    frictionless.some(
      (b) =>
        a !== b &&
        close(a.height, b.height, 0.02) &&
        !close(a.angleDeg, b.angleDeg, 0.05) &&
        close(a.speedAtBottom!, b.speedAtBottom!, 0.02),
    ),
  )
}

export function observedFrictionSlows(runs: readonly InclineRun[]): boolean {
  return runs.some((a) =>
    runs.some(
      (b) =>
        a !== b &&
        close(a.mass, b.mass) &&
        close(a.length, b.length) &&
        close(a.angleDeg, b.angleDeg) &&
        a.muK < 0.02 &&
        b.muK > 0.05 &&
        !a.staysAtRest &&
        !b.staysAtRest &&
        a.speedAtBottom != null &&
        b.speedAtBottom != null &&
        b.speedAtBottom < a.speedAtBottom - 0.05,
    ),
  )
}

export const PREDICTIONS: readonly Prediction<InclineRun>[] = [
  {
    id: 'height-only',
    minLevel: 'beginner',
    question: 'On a frictionless incline, two blocks start from rest at the same height but travel different distances (different angles). Which reaches the bottom faster?',
    task: 'Set friction near zero. Run two trials with the same vertical height but different angles (adjust length if needed) and compare the speeds at the bottom.',
    options: [
      { id: 'steeper', label: 'The steeper (shorter) path is faster' },
      { id: 'gentler', label: 'The gentler (longer) path is faster' },
      { id: 'same', label: 'They arrive with the same speed' },
    ],
    correct: 'same',
    explanation:
      'With no friction the only force that does work is gravity. The change in kinetic energy equals the loss of gravitational potential energy, which depends only on the vertical drop. The angle affects the acceleration and the time, but not the final speed.',
    observed: observedFrictionlessHeight,
    hint: (runs) =>
      observedFrictionlessHeight(runs)
        ? null
        : 'Set μ_k ≈ 0. Choose two angles and adjust the length so the height h = L sin θ is the same, then compare the speeds.',
  },
  {
    id: 'friction-work',
    minLevel: 'intermediate',
    question: 'You add kinetic friction on the same incline. What happens to the speed at the bottom?',
    task: 'Keep mass, length and angle fixed. Compare a nearly frictionless run with one that has noticeable kinetic friction.',
    options: [
      { id: 'faster', label: 'The block is faster at the bottom' },
      { id: 'slower', label: 'The block is slower at the bottom' },
      { id: 'same', label: 'The speed is unchanged' },
    ],
    correct: 'slower',
    explanation:
      'Kinetic friction does negative work along the path. That energy is removed from the mechanical energy budget, so the kinetic energy (and therefore the speed) at the bottom is smaller than in the frictionless case.',
    observed: observedFrictionSlows,
    hint: (runs) =>
      observedFrictionSlows(runs)
        ? null
        : 'Keep geometry and mass fixed. Run once with μ_k near zero and once with a clearly larger μ_k.',
  },
]
