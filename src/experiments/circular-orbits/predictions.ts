import type { Prediction } from '@/experiments/prediction'
import type { OrbitOutcome } from '@/physics'

/** One launch: its settings and what happened. */
export interface LaunchRun {
  /** Launch distance from the centre, in Earth radii. */
  readonly radius: number
  /** Launch speed as a multiple of the circular speed. */
  readonly speedFactor: number
  readonly outcome: OrbitOutcome
  /** Period (s) of a bound orbit that does not crash, otherwise null. */
  readonly period: number | null
}

const circular = (r: LaunchRun) => r.outcome === 'circle'

export function observedCircle(runs: readonly LaunchRun[]): boolean {
  return runs.some(circular)
}

/** A bound orbit launched clearly faster than circular speed. */
export function observedFasterEllipse(runs: readonly LaunchRun[]): boolean {
  return runs.some((r) => r.outcome === 'ellipse' && r.speedFactor >= 1.02)
}

/** Two circular orbits whose radii differ by a factor of at least 1.5. */
export function observedKepler(runs: readonly LaunchRun[]): boolean {
  return runs.some((a) => circular(a) && runs.some((b) => circular(b) && b.radius >= 1.5 * a.radius))
}

/** An escape, and a bound orbit launched at least 1.2 times circular speed, to bracket the threshold. */
export function observedEscape(runs: readonly LaunchRun[]): boolean {
  return runs.some((r) => r.outcome === 'escape') && runs.some((r) => r.outcome === 'ellipse' && r.speedFactor >= 1.2)
}

export const PREDICTIONS: readonly Prediction<LaunchRun>[] = [
  {
    id: 'direction',
    minLevel: 'beginner',
    question: 'A satellite moves round the Earth in a circle at constant speed. Which way does the net force on it point?',
    task: 'Set the launch speed to exactly 1.00 × circular speed, launch, and look at the force arrow on the satellite.',
    options: [
      { id: 'centre', label: 'Towards the centre of the circle' },
      { id: 'forward', label: 'Forwards, along its motion' },
      { id: 'outward', label: 'Outwards, away from the centre' },
      { id: 'none', label: 'There is no net force: its speed is constant' },
    ],
    correct: 'centre',
    explanation:
      'The speed stays the same but the direction of motion keeps turning, so the velocity changes and the satellite accelerates. That acceleration, v²/r, points to the centre, and so must the net force: m v²/r. For a satellite, gravity is that force. Nothing pushes it forwards; it keeps moving because nothing stops it.',
    observed: observedCircle,
    hint: (runs) => (runs.length > 0 && !observedCircle(runs) ? 'Set the launch speed to exactly 1.00 × circular speed and launch again.' : null),
  },
  {
    id: 'faster',
    minLevel: 'beginner',
    question: 'Now launch the satellite from the same place, a little faster than circular speed. What path does it follow?',
    task: 'Launch at between 1.05 and 1.35 × circular speed and compare the path with the circle.',
    options: [
      { id: 'ellipse', label: 'An ellipse that swings out farther on the opposite side, then returns to the launch point' },
      { id: 'bigger', label: 'A bigger circle' },
      { id: 'escape', label: 'It flies off into space' },
      { id: 'spiral', label: 'A spiral that keeps getting wider' },
    ],
    correct: 'ellipse',
    explanation:
      'Gravity can no longer bend the faster path round a circle, so the satellite climbs. As it climbs it slows, gravity wins back, and it falls back to the launch point, which is now the closest point of an ellipse. Launched slower than circular speed, the launch point is instead the farthest point. Either way the orbit closes and repeats exactly: in Newtonian gravity, bound orbits are closed ellipses.',
    observed: observedFasterEllipse,
    hint: (runs) => {
      if (observedFasterEllipse(runs)) return null
      if (runs.some((r) => r.outcome === 'escape')) return 'That launch was fast enough to escape. Try between 1.05 and 1.35 × circular speed.'
      if (runs.length > 0) return 'Launch faster than circular speed, between 1.05 and 1.35 ×.'
      return null
    },
  },
  {
    id: 'kepler',
    minLevel: 'intermediate',
    question: 'You move a circular orbit from 2 Earth radii out to 4 Earth radii. Its period…',
    task: 'Run two circular orbits (1.00 × circular speed) whose radii differ by a factor of at least 1.5, and compare their periods.',
    options: [
      { id: 'cube', label: 'Grows by about 2.8 times' },
      { id: 'double', label: 'Doubles' },
      { id: 'same', label: 'Stays the same' },
      { id: 'half', label: 'Halves, because gravity is weaker' },
    ],
    correct: 'cube',
    explanation:
      'The path is twice as long, and the circular speed √(GM/r) is lower by √2, so the period T = 2πr/v grows by 2 × √2 ≈ 2.8. In general T² ∝ r³: Kepler’s third law, which Kepler found from planetary data and Newton explained with gravity and circular motion.',
    observed: observedKepler,
    hint: (runs) => (observedCircle(runs) && !observedKepler(runs) ? 'Keep 1.00 × circular speed and change the radius by a factor of at least 1.5.' : null),
  },
  {
    id: 'escape',
    minLevel: 'advanced',
    question: 'How fast must the satellite be launched, compared with the circular speed at that height, so that it never comes back?',
    task: 'Find the threshold: run one orbit at 1.2 × circular speed or more that still returns, and one launch that escapes.',
    options: [
      { id: 'root2', label: '√2 ≈ 1.41 times circular speed' },
      { id: 'two', label: 'Twice circular speed' },
      { id: 'any', label: 'Any speed above circular speed' },
      { id: 'never', label: 'It always comes back eventually' },
    ],
    correct: 'root2',
    explanation:
      'A satellite escapes when its kinetic energy can pay for the climb out of the gravitational well: ½v² − GM/r ≥ 0, so v ≥ √(2GM/r) = √2 · v_c. At exactly √2 the path is a parabola; faster, a hyperbola. Escape speed depends only on where you start, not on the direction (if the path clears the planet).',
    observed: observedEscape,
    hint: (runs) => {
      if (observedEscape(runs)) return null
      if (runs.some((r) => r.outcome === 'escape')) return 'Now find a launch at 1.2 × circular speed or more that still comes back.'
      if (runs.some((r) => r.outcome === 'ellipse' && r.speedFactor >= 1.2)) return 'Keep increasing the launch speed until the satellite escapes.'
      return null
    },
  },
]
