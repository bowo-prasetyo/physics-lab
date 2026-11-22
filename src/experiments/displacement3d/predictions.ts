/** Predict–observe–explain prompts for the 3D displacement experiment (see experiments/prediction.ts). */

import type { Prediction } from '@/experiments/prediction'
import { norm } from '@/physics'
import type { JourneySnapshot } from './useDisplacement3D'

const shifted = (s: JourneySnapshot) => norm(s.frame.origin) > 0
const turned = (s: JourneySnapshot) => s.frame.yawDeg !== 0 || s.frame.pitchDeg !== 0

/** A journey of at least three moves that ends where it started. */
export function observedRoundTrip(ss: readonly JourneySnapshot[]): boolean {
  return ss.some((s) => s.moves >= 3 && norm(s.displacement) < 1e-9 && s.distance > 0)
}

export function roundTripHint(ss: readonly JourneySnapshot[]): string | null {
  if (observedRoundTrip(ss) || ss.length === 0) return null
  return 'Make at least three moves and come back to where you started (or load “Round trip”).'
}

/** Displacement components 3, 4 and 12 (in any order and direction). */
export function observedDiagonal(ss: readonly JourneySnapshot[]): boolean {
  return ss.some((s) => {
    const c = [s.displacement.x, s.displacement.y, s.displacement.z].map(Math.abs).sort((a, b) => a - b)
    return Math.abs((c[0] as number) - 3) < 1e-9 && Math.abs((c[1] as number) - 4) < 1e-9 && Math.abs((c[2] as number) - 12) < 1e-9
  })
}

export function diagonalHint(ss: readonly JourneySnapshot[]): string | null {
  if (observedDiagonal(ss) || ss.length === 0) return null
  return 'From the start, move 3 m along x, 4 m along y and 12 m along z (or load “3, 4, 12 diagonal”).'
}

/** Looked at a non-zero displacement with the origin moved. */
export function observedShift(ss: readonly JourneySnapshot[]): boolean {
  return ss.some((s) => shifted(s) && norm(s.displacement) > 0)
}

export function shiftHint(ss: readonly JourneySnapshot[]): string | null {
  if (observedShift(ss) || ss.length === 0) return null
  if (ss.some(shifted)) return 'Make a journey (so the displacement is not zero) while the origin is moved.'
  return 'Make a journey, then move the second coordinate system’s origin with the sliders.'
}

/** Looked at a non-zero displacement with the axes turned. */
export function observedRotation(ss: readonly JourneySnapshot[]): boolean {
  return ss.some((s) => turned(s) && norm(s.displacement) > 0)
}

export function rotationHint(ss: readonly JourneySnapshot[]): string | null {
  if (observedRotation(ss) || ss.length === 0) return null
  if (ss.some(turned)) return 'Make a journey (so the displacement is not zero) while the axes are turned.'
  return 'Make a journey, then turn the second coordinate system’s axes and compare the two sets of numbers.'
}

/** A journey of two or more moves whose distance clearly exceeds the size of its displacement. */
export function observedTriangle(ss: readonly JourneySnapshot[]): boolean {
  return ss.some((s) => s.moves >= 2 && s.distance - norm(s.displacement) > 0.5)
}

export const PREDICTIONS: readonly Prediction<JourneySnapshot>[] = [
  {
    id: 'round-trip',
    minLevel: 'beginner',
    question: 'A drone flies 3 m east, 4 m north and 2 m up, then straight back to where it took off. What is its displacement?',
    task: 'Make a journey of at least three moves that returns to its start (or load “Round trip”), and read the displacement.',
    options: [
      { id: 'zero', label: 'Zero' },
      { id: 'nine', label: '9 m' },
      { id: 'eighteen', label: 'About 14.4 m (the whole flight)' },
      { id: 'five', label: '5.4 m' },
    ],
    correct: 'zero',
    explanation:
      'Displacement only compares where you end with where you started, and the drone ends where it began, so its displacement is zero. ' +
      'The distance it flew is not zero: 3 + 4 + 2 m out and √29 ≈ 5.4 m back, about 14.4 m. Distance is the length of the path; displacement ' +
      'is the straight arrow from start to finish.',
    observed: observedRoundTrip,
    hint: roundTripHint,
  },
  {
    id: 'diagonal',
    minLevel: 'beginner',
    question: 'You move 3 m along x, then 4 m along y, then 12 m along z. How far is the end from the start, in a straight line?',
    task: 'Make exactly that journey (or load “3, 4, 12 diagonal”) and read the size of the displacement.',
    options: [
      { id: 'nineteen', label: '19 m' },
      { id: 'thirteen', label: '13 m' },
      { id: 'twelve', label: '12 m' },
      { id: 'seventeen', label: 'About 17 m' },
    ],
    correct: 'thirteen',
    explanation:
      'Pythagoras works in three dimensions too: |Δr| = √(3² + 4² + 12²) = √169 = 13 m. You can see it in two steps: across the floor ' +
      '√(3² + 4²) = 5 m, then up, √(5² + 12²) = 13 m. The 19 m is the distance travelled along the edges.',
    observed: observedDiagonal,
    hint: diagonalHint,
  },
  {
    id: 'shift',
    minLevel: 'intermediate',
    question: 'You move the origin of the coordinate system somewhere else. What happens to the object’s displacement?',
    task: 'Make a journey, then move the second coordinate system’s origin and compare the two sets of numbers.',
    options: [
      { id: 'unchanged', label: 'It stays exactly the same' },
      { id: 'shifted', label: 'It changes by the amount the origin moved' },
      { id: 'zero', label: 'It becomes zero' },
      { id: 'grows', label: 'It gets longer' },
    ],
    correct: 'unchanged',
    explanation:
      'Moving the origin changes every position, by the same amount, but a displacement is a difference of two positions, so the shift ' +
      'cancels: Δr′ = (r_end − O) − (r_start − O) = Δr. Where you put the origin is a choice; how far and which way something moved is not.',
    observed: observedShift,
    hint: shiftHint,
  },
  {
    id: 'rotation',
    minLevel: 'intermediate',
    question: 'You turn the coordinate axes by 30°. Which of these stays the same?',
    task: 'Make a journey, then turn the second coordinate system’s axes and compare the two sets of numbers.',
    options: [
      { id: 'x', label: 'The x-component of the displacement' },
      { id: 'length', label: 'The length of the displacement, |Δr|' },
      { id: 'all', label: 'All three components' },
      { id: 'none', label: 'Nothing: everything changes' },
    ],
    correct: 'length',
    explanation:
      'Turning the axes reshuffles the components (Δx′, Δy′, Δz′ all change), but the arrow itself is untouched, so its length is the same: ' +
      'Δx′² + Δy′² + Δz′² = Δx² + Δy² + Δz². Quantities that every coordinate system agrees on are called invariants. Experiments B and E ' +
      'meet a spacetime version of the same idea: the interval.',
    observed: observedRotation,
    hint: rotationHint,
  },
  {
    id: 'triangle',
    minLevel: 'advanced',
    question: 'Can the distance you travel ever be shorter than the size of your displacement?',
    task: 'Make journeys of two or more moves that do not lie along one straight line, and compare the distance with |Δr|.',
    options: [
      { id: 'shortcut', label: 'Yes, if you take a shortcut' },
      { id: 'never', label: 'No, never: the straight line is the shortest path' },
      { id: 'curved', label: 'Only if the path is curved' },
      { id: 'three-d', label: 'Only in three dimensions' },
    ],
    correct: 'never',
    explanation:
      'The triangle inequality, |Δr₁ + Δr₂| ≤ |Δr₁| + |Δr₂|, says the straight line is the shortest route between two points in Euclidean ' +
      'space, so distance ≥ |displacement|, with equality only for a straight journey. Spacetime turns this upside down: there, the ' +
      'straight worldline between two events has the longest proper time. That reversed inequality is why the travelling twin comes home ' +
      'younger.',
    observed: observedTriangle,
  },
]
