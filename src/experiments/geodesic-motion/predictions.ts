import type { Prediction } from '@/experiments/prediction'

/** One integrated orbit: its starting conditions and what the relativistic path did. */
export interface OrbitRun {
  /** Initial radius in Schwarzschild radii. */
  readonly radius: number
  /** Angular momentum as a multiple of the circular-orbit value. */
  readonly angular: number
  readonly radialVelocity: number
  readonly captured: boolean
  readonly periapses: number
  /** Mean periapsis advance per orbit in degrees, or null with fewer than two periapses. */
  readonly shiftPerOrbit: number | null
}

const isCircularStart = (r: OrbitRun) => r.angular === 1 && r.radialVelocity === 0
/** A bound, non-circular orbit whose precession could be measured. */
const measured = (r: OrbitRun) => !r.captured && !isCircularStart(r) && r.shiftPerOrbit !== null

export function observedPerturbedOrbit(runs: readonly OrbitRun[]): boolean {
  return runs.some(measured)
}

export function observedCircularOrbit(runs: readonly OrbitRun[]): boolean {
  return runs.some((r) => isCircularStart(r) && !r.captured)
}

/** Two measured orbits whose starting radii differ by at least 3 r_s. */
export function observedDistanceTrend(runs: readonly OrbitRun[]): boolean {
  return runs.some((a) => measured(a) && runs.some((b) => measured(b) && Math.abs(a.radius - b.radius) >= 3))
}

/** A nearly circular measured orbit far from the mass. */
export function observedWeakField(runs: readonly OrbitRun[]): boolean {
  return runs.some((r) => measured(r) && r.radius >= 10 && Math.abs(r.angular - 1) <= 0.01 && r.radialVelocity === 0)
}

export const PREDICTIONS: readonly Prediction<OrbitRun>[] = [
  {
    id: 'perturbed',
    minLevel: 'beginner',
    question: 'A spacecraft orbits a black hole at 8 rₛ, but with a little less angular momentum than a circular orbit needs. What does its path look like after several orbits?',
    task: 'Start at 8 rₛ or more with an angular momentum slightly different from 1 × L circular, run the experiment, and compare the two paths.',
    options: [
      { id: 'circle', label: 'A circle' },
      { id: 'ellipse', label: 'The same closed ellipse, traced again and again' },
      { id: 'precess', label: 'An ellipse whose closest point moves round a little each orbit' },
      { id: 'spiral', label: 'A spiral into the black hole' },
    ],
    correct: 'precess',
    explanation:
      'In Newtonian gravity the orbit is a closed ellipse that repeats exactly (the dashed path). In Schwarzschild spacetime the closest point, the periapsis, advances each orbit, so the path traces a rosette. Mercury’s orbit around the Sun does the same, very slowly; explaining that was one of the first successes of general relativity.',
    observed: observedPerturbedOrbit,
    hint: (runs) => {
      if (observedPerturbedOrbit(runs)) return null
      if (runs.some((r) => r.captured)) return 'That orbit was captured. Start farther out, at 8 rₛ or more.'
      if (runs.length > 0) return 'Change the angular momentum slightly away from 1 × L circular and run again.'
      return null
    },
  },
  {
    id: 'circular',
    minLevel: 'beginner',
    question: 'Now give the spacecraft exactly the angular momentum of a circular orbit, with no inward or outward speed. What path does it follow?',
    task: 'Set the angular momentum to 1.000 × L circular and the radial velocity to 0, then run the experiment.',
    options: [
      { id: 'circle', label: 'A circle' },
      { id: 'precess', label: 'A slowly turning ellipse' },
      { id: 'spiral', label: 'A spiral into the black hole' },
    ],
    correct: 'circle',
    explanation:
      'Circular orbits still exist in Schwarzschild spacetime: with exactly the right angular momentum and no radial motion, the radius never changes, so there is no periapsis to move. Precession only shows up when the orbit is not perfectly circular. Below 3 rₛ even circular orbits become unstable, and the smallest push sends the spacecraft in.',
    observed: observedCircularOrbit,
    hint: (runs) => (runs.length > 0 && !observedCircularOrbit(runs) ? 'Set the angular momentum to exactly 1.000 and the radial velocity to exactly 0.' : null),
  },
  {
    id: 'distance',
    minLevel: 'intermediate',
    question: 'You move a slightly elliptical orbit farther from the black hole, from 5 rₛ to 12 rₛ. The periapsis shift per orbit…',
    task: 'Keep the angular momentum and radial velocity the same, and measure the shift per orbit at two starting radii at least 3 rₛ apart.',
    options: [
      { id: 'grows', label: 'Grows' },
      { id: 'shrinks', label: 'Shrinks' },
      { id: 'same', label: 'Stays the same' },
      { id: 'reverses', label: 'Reverses direction' },
    ],
    correct: 'shrinks',
    explanation:
      'The relativistic term −3L²/(2r⁴) in the radial equation falls off faster than the Newtonian −1/(2r²), so the farther out the orbit, the closer it is to a closed Newtonian ellipse. For nearly circular orbits the shift is about 360°·(1/√(1 − 3rₛ/r) − 1): roughly 210° per orbit at 5 rₛ but 56° at 12 rₛ. This is the Newtonian limit.',
    observed: observedDistanceTrend,
    hint: (runs) => {
      if (observedDistanceTrend(runs)) return null
      if (runs.some(measured)) return 'Now change only the starting radius, by at least 3 rₛ, and run again.'
      return null
    },
  },
  {
    id: 'mercury',
    minLevel: 'advanced',
    question: 'Far from the mass, the shift per orbit is about 3π rₛ/r radians. Mercury orbits about 2 × 10⁷ rₛ from the Sun. Its periapsis shift per orbit is roughly…',
    task: 'Check the weak-field estimate first: run a nearly circular orbit (angular momentum within 0.01 of 1, no radial velocity) at 10 rₛ or more, and compare the measured shift with the estimate.',
    options: [
      { id: 'arcsec', label: 'About 0.1 arcseconds' },
      { id: 'degree', label: 'About 1 degree' },
      { id: 'radian', label: 'About 0.5 radians' },
      { id: 'zero', label: 'Exactly zero: the Sun’s gravity is too weak for relativity' },
    ],
    correct: 'arcsec',
    explanation:
      '3π/(2 × 10⁷) ≈ 5 × 10⁻⁷ rad ≈ 0.1″ per orbit. Over a century Mercury completes about 415 orbits, giving 43″ per century: the anomaly that Newtonian gravity could not explain and that Einstein calculated in 1915. The same formula gives about 45° at 12 rₛ; there the exact near-circular result, about 56°, is already noticeably larger.',
    observed: observedWeakField,
    hint: (runs) => (runs.some(measured) && !observedWeakField(runs) ? 'Use a starting radius of 10 rₛ or more, an angular momentum within 0.01 of 1 and no radial velocity.' : null),
  },
]
