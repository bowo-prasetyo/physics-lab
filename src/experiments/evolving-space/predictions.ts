/** Predict–observe–explain prompts for “Evolving space” (see experiments/prediction.ts). */

import type { Prediction } from '@/experiments/prediction'
import { accelerationOnset, recessionSpeed, solveExpansion } from '@/physics'
import { A_BREAKDOWN, CENTRE_GALAXY, cosmologyById, type ModelId, type SpaceRecord } from './useEvolvingSpace'

// Each model's solution never changes, so solve it once.
const solved = new Map<ModelId, ReturnType<typeof solveExpansion>>()
export function expansionOf(id: ModelId) {
  let e = solved.get(id)
  if (!e) solved.set(id, (e = solveExpansion(cosmologyById(id))))
  return e
}

const our = cosmologyById('our')
const ourExpansion = expansionOf('our')
/** Time (since the Big Bang) when our universe started speeding up. */
export const OUR_ACCELERATION_TIME = ourExpansion.timeAt(accelerationOnset(our) as number)

const span = (r: { tStart: number; tEnd: number }) => Math.abs(r.tEnd - r.tStart)

/** The shared prediction type passes a list; “Evolving space” keeps one combined record. */
const merged = (records: readonly SpaceRecord[]): SpaceRecord => ({
  runs: records.flatMap((r) => r.runs),
  snapshots: records.flatMap((r) => r.snapshots),
  hubbleCounts: records.flatMap((r) => r.hubbleCounts ?? []),
})

/** Looked at a Hubble diagram of at least 16 galaxies. */
export function observedHubbleDiagram(record: SpaceRecord): boolean {
  return (record.hubbleCounts ?? []).some((n) => n >= 16)
}

export function hubbleDiagramHint(record: SpaceRecord): string | null {
  if (observedHubbleDiagram(record)) return null
  if ((record.hubbleCounts ?? []).length > 0) return 'Observe more galaxies: at least 16.'
  return null
}

/** Fitted H₀ with 8 galaxies or fewer, and with all 32. */
export function observedEstimateSettles(record: SpaceRecord): boolean {
  const counts = record.hubbleCounts ?? []
  return counts.some((n) => n <= 8) && counts.some((n) => n >= 32)
}

export function estimateHint(record: SpaceRecord): string | null {
  if (observedEstimateSettles(record)) return null
  const counts = record.hubbleCounts ?? []
  if (counts.some((n) => n >= 32)) return 'Press “Start again”, observe 8 galaxies and read the estimate, then observe all 32 again.'
  if (counts.length > 0) return 'Keep observing until the diagram holds all 32 galaxies, then compare the estimates.'
  return null
}

/** Ran the model for at least 2 Gyr after making another galaxy "home". */
export function observedNoCentre(record: SpaceRecord): boolean {
  return record.runs.some((r) => r.home !== CENTRE_GALAXY && span(r) >= 2)
}

export function noCentreHint(record: SpaceRecord): string | null {
  if (observedNoCentre(record)) return null
  if (record.runs.some((r) => r.home !== CENTRE_GALAXY)) return 'Run the model for longer (at least 2 billion years) to see the motion.'
  if (record.runs.length > 0) return 'Click a galaxy near the edge to make it “home”, then run the model again.'
  return null
}

/** Ran forwards or backwards through at least 5 Gyr. */
export function observedBound(record: SpaceRecord): boolean {
  return record.runs.some((r) => span(r) >= 5)
}

/** Looked at a galaxy receding faster than light. */
export function observedFasterThanLight(record: SpaceRecord): boolean {
  return record.snapshots.some((s) => {
    const a = expansionOf(s.model).scaleFactorAt(s.t)
    return a > 1e-6 && recessionSpeed(cosmologyById(s.model), a, s.target) >= 1
  })
}

export function fasterThanLightHint(record: SpaceRecord): string | null {
  if (observedFasterThanLight(record)) return null
  if (record.snapshots.length > 0) return 'Increase the distant galaxy’s distance (try 20 billion light-years) and watch its speed.'
  return null
}

/** Went back to the Big Bang in our universe. */
export function observedAge(record: SpaceRecord): boolean {
  return record.snapshots.some((s) => s.model === 'our' && s.t <= 0.5)
}

export function ageHint(record: SpaceRecord): string | null {
  if (observedAge(record)) return null
  if (record.snapshots.some((s) => s.model !== 'our')) return 'Choose “Our universe”, then press “Big Bang” or run it backwards to the start.'
  if (record.snapshots.length > 0) return 'Run our universe backwards all the way to the start (or press “Big Bang”) and read the time.'
  return null
}

/** Ran our universe through the moment it began speeding up. */
export function observedAccelerationOnset(record: SpaceRecord): boolean {
  return record.runs.some(
    (r) => r.model === 'our' && Math.min(r.tStart, r.tEnd) < OUR_ACCELERATION_TIME && Math.max(r.tStart, r.tEnd) > OUR_ACCELERATION_TIME,
  )
}

export function accelerationHint(record: SpaceRecord): string | null {
  if (observedAccelerationOnset(record)) return null
  if (record.runs.some((r) => r.model === 'our')) return 'Run our universe through the middle of its history (from about 4 to 12 billion years) and watch “Expansion is…”.'
  if (record.runs.length > 0) return 'Choose “Our universe” and run it from early times to today.'
  return null
}

/** Looked at a model with a Big Bang at a scale factor below the point where its readouts stop (a < 10⁻⁶). */
export function observedBreakdown(record: SpaceRecord): boolean {
  return record.snapshots.some((s) => expansionOf(s.model).hasBigBang && expansionOf(s.model).scaleFactorAt(s.t) < A_BREAKDOWN)
}

export function breakdownHint(record: SpaceRecord): string | null {
  if (observedBreakdown(record)) return null
  if (record.snapshots.length > 0) return 'Press “Big Bang” (or run a universe all the way back) and read the readouts.'
  return null
}

export const PREDICTIONS: readonly Prediction<SpaceRecord>[] = [
  {
    id: 'centre',
    minLevel: 'beginner',
    question: 'Astronomers see distant galaxies moving away from us in every direction. Where is the centre of the expansion?',
    task: 'Click a galaxy near the edge to make it “home”, then run the model for at least 2 billion years. Watch the arrows.',
    options: [
      { id: 'us', label: 'Our own galaxy' },
      { id: 'far', label: 'A special point somewhere far away' },
      { id: 'none', label: 'There is no centre: every galaxy sees the others moving away' },
      { id: 'edge', label: 'At the edge of the universe' },
    ],
    correct: 'none',
    explanation:
      'From any comoving galaxy, the large-scale pattern is the same: other unbound comoving galaxies have increasing proper distances, ' +
      'with recession rate proportional to distance. The scale factor a(t) describes this change in the spacetime geometry; it is not a ' +
      'material space-stuff carrying galaxies apart. The Big Bang was not an explosion from a point into pre-existing empty space.',
    observed: (r) => observedNoCentre(merged(r)),
    hint: (r) => noCentreHint(merged(r)),
  },
  {
    id: 'bound',
    minLevel: 'beginner',
    question: 'As space expands, do galaxies themselves (and the Earth, and you) expand too?',
    task: 'Run the model forwards or backwards through at least 5 billion years. Compare the size of the galaxies with the gaps between them.',
    options: [
      { id: 'all', label: 'Yes: everything grows with the universe' },
      { id: 'bound', label: 'No: things held together by gravity or other forces keep their size' },
      { id: 'galaxies', label: 'Galaxies grow, but planets do not' },
      { id: 'shrink', label: 'They shrink as the gaps grow' },
    ],
    correct: 'bound',
    explanation:
      'The FLRW scale factor describes the changing proper distances between comoving objects on cosmological scales; it does not make ' +
      'bound objects expand. A galaxy is held together by gravity, an atom by electromagnetic interactions, and these systems are not ' +
      'simply carried along by the Hubble flow. The Milky Way, Solar System and you do not grow with the cosmic scale factor. Even our ' +
      'neighbour, the Andromeda galaxy, is approaching us.',
    observed: (r) => observedBound(merged(r)),
  },
  {
    id: 'hubble-diagram',
    minLevel: 'beginner',
    question: 'Astronomers measure the distance and the redshift of many nearby galaxies, and plot each galaxy’s recession speed against its distance. What do the points look like?',
    task: 'Under “Hubble diagram”, observe at least 16 nearby galaxies and look at the pattern.',
    options: [
      { id: 'scatter-line', label: 'They scatter around a straight line through the origin' },
      { id: 'exact-line', label: 'They lie exactly on a straight line' },
      { id: 'no-pattern', label: 'No clear pattern: galaxies move in all sorts of ways' },
      { id: 'level-off', label: 'A curve that levels off, because farther galaxies cannot recede any faster' },
    ],
    correct: 'scatter-line',
    explanation:
      'On average, speed grows in proportion to distance, v ≈ H₀d, the pattern that uniform expansion gives every observer. The points scatter because each galaxy also moves through space, pulled by its neighbours (a few hundred km/s), and because distances are hard to measure (here about 10 %). The trend only stands out with many galaxies: Hubble’s 1929 diagram had 24, and scattered far more. These galaxies are illustrative, generated from the model with realistic scatter, not a real catalogue.',
    observed: (r) => observedHubbleDiagram(merged(r)),
    hint: (r) => hubbleDiagramHint(merged(r)),
  },
  {
    id: 'faster',
    minLevel: 'intermediate',
    question: 'Nothing can travel through space faster than light. Can a distant galaxy recede from us faster than light?',
    task: 'In our universe today, increase the distant galaxy’s distance until its recession speed reaches c.',
    options: [
      { id: 'never', label: 'No, never' },
      { id: 'yes', label: 'Yes, if it is far enough away, without breaking relativity' },
      { id: 'past', label: 'Only in the distant past' },
      { id: 'engines', label: 'Only if the galaxy is itself moving fast' },
    ],
    correct: 'yes',
    explanation:
      'The FLRW recession rate v = H d can exceed c beyond the Hubble distance c/H (about 14.5 billion light-years today). This is the ' +
      'rate of change of proper distance between widely separated comoving observers, not a local velocity measured as one galaxy passes ' +
      'the other. Locally, each observer still measures nearby light at c. We can nevertheless see some galaxies whose present recession ' +
      'rate exceeds c, using light they emitted long ago.',
    observed: (r) => observedFasterThanLight(merged(r)),
    hint: (r) => fasterThanLightHint(merged(r)),
  },
  {
    id: 'estimate',
    minLevel: 'intermediate',
    question: 'You estimate H₀ from the slope of the best straight line through your galaxies. As you add more galaxies, your estimate…',
    task: 'Read the estimate with 8 galaxies, then keep observing until all 32 are in the diagram, and compare the estimates and their uncertainties.',
    options: [
      { id: 'settles', label: 'Settles closer to the model’s value, with a smaller uncertainty' },
      { id: 'exact', label: 'Is right from the start: any two galaxies fix the line' },
      { id: 'grows', label: 'Keeps rising, because farther galaxies recede faster' },
    ],
    correct: 'settles',
    explanation:
      'Each galaxy’s scatter pulls the line a little; with more galaxies the pulls average out, and the uncertainty shrinks roughly as 1/√N: four times as many galaxies, half the uncertainty. Here 8 galaxies give about 73.5 ± 2.4 km/s/Mpc, more than two uncertainties from the model’s 67.7, and 32 give about 68.4 ± 1.2. Farther galaxies are faster, but in proportion, so the slope does not grow. Real measurements use thousands of galaxies and still disagree: about 67 km/s/Mpc from the early universe and about 73 from nearby supernovae, an unresolved “Hubble tension”.',
    observed: (r) => observedEstimateSettles(merged(r)),
    hint: (r) => estimateHint(merged(r)),
  },
  {
    id: 'age',
    minLevel: 'advanced',
    question:
      'The simple estimate of the age of our universe is 1/H₀ ≈ 14.5 billion years. What does the Friedmann equation give, including matter and dark energy?',
    task: 'Choose “Our universe” and go back to the Big Bang. Read the time today, measured from there.',
    options: [
      { id: 'same', label: 'Exactly 1/H₀: 14.5 billion years' },
      { id: 'planck', label: 'About 13.8 billion years' },
      { id: 'matter', label: 'About 9.6 billion years (2/3 of 1/H₀)' },
      { id: 'infinite', label: 'Infinitely old' },
    ],
    correct: 'planck',
    explanation:
      't₀ = ∫ da / (a H(a)) ≈ 13.8 billion years. Matter slowed the expansion (so it used to be faster, making the universe younger than ' +
      '1/H₀) and dark energy has since sped it up; the two nearly cancel. A matter-only universe would be only 9.6 billion years old, ' +
      'younger than the oldest stars, which was one early hint that something like dark energy was needed.',
    observed: (r) => observedAge(merged(r)),
    hint: (r) => ageHint(merged(r)),
  },
  {
    id: 'acceleration',
    minLevel: 'advanced',
    question: 'In our universe, when did the expansion switch from slowing down to speeding up?',
    task: 'Run our universe through the middle of its history and watch the “Expansion is…” readout and the deceleration q.',
    options: [
      { id: 'always', label: 'It has always been speeding up' },
      { id: 'six', label: 'About 6 billion years ago' },
      { id: 'never', label: 'It has not: it is still slowing down' },
      { id: 'start', label: 'Right at the Big Bang' },
    ],
    correct: 'six',
    explanation:
      'Radiation, matter and dark energy determine the switch. For this model, q = 0 gives Ωᵣ + (Ωₘ/2)a − ΩΛa⁴ = 0; including radiation, ' +
      'a ≈ 0.609, redshift z ≈ 0.642, about 6.14 billion years ago. If radiation is neglected, this reduces to ρ_matter = 2ρ_Λ. ' +
      'The acceleration was discovered in 1998 from distant supernovae, and earned the 2011 ' +
      'Nobel Prize in Physics.',
    observed: (r) => observedAccelerationOnset(merged(r)),
    hint: (r) => accelerationHint(merged(r)),
  },
  {
    id: 'breakdown',
    minLevel: 'advanced',
    question: 'Run a universe backwards towards the Big Bang, where the scale factor a approaches 0. What does the model tell you about that moment?',
    task: 'Press “Big Bang” (or run a universe all the way back) and read the readouts.',
    options: [
      { id: 'breaks', label: 'Nothing reliable: the model stops being trustworthy before a reaches 0' },
      { id: 'point', label: 'That all the matter started at a single point in empty space' },
      { id: 'before', label: 'What came before it: a contracting universe that bounced' },
    ],
    correct: 'breaks',
    explanation:
      'As a approaches 0 the model’s density and temperature grow without limit, and its readouts stop: here at a = 10⁻⁶, earlier than the model formally ends. Classical general relativity predicts its own failure there; quantum effects of gravity should matter long before a = 0. The Big Bang in the model is not an explosion from a point into empty space: the model describes all of space being denser everywhere at once, and it says nothing about what, if anything, came before. Bounces and other beginnings are proposals, not results of this model.',
    observed: (r) => observedBreakdown(merged(r)),
    hint: (r) => breakdownHint(merged(r)),
  },
]
