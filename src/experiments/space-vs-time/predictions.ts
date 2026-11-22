/**
 * Predict–observe–explain prompts for Experiment A.
 *
 * Each prediction has an `observed` test: a pure function over the runs the
 * student has performed that decides whether they have actually carried out
 * the experiment that answers the question. The explanation is revealed only
 * then, so students compare their prediction with what they saw rather than
 * with what they were told.
 */

import { positionAtTime, type RunRecord } from '@/physics'
import type { Level } from '@/levels'
import type { ExperimentRun } from './runs'

export interface PredictionOption {
  readonly id: string
  readonly label: string
}

export interface Prediction {
  readonly id: string
  /** Lowest level at which the prompt is shown. */
  readonly minLevel: Level
  readonly question: string
  /** What the student must do in the experiment to test the prediction. */
  readonly task: string
  readonly options: readonly PredictionOption[]
  readonly correct: string
  /** Shown after the observation, whatever the student predicted. */
  readonly explanation: string
  readonly observed: (runs: readonly ExperimentRun[]) => boolean
  /**
   * Optional nudge for a near-miss: given the runs so far, explain what to do
   * differently when the student is trying but has not yet made the
   * observation. Returns null when there is nothing to say.
   */
  readonly hint?: (runs: readonly ExperimentRun[]) => string | null
}

/** Minimum clock time a run needs before it counts as an observation (s). */
export const MIN_OBSERVATION_TIME = 3

/**
 * Velocity of the run's opening segment, if that segment lasted at least
 * MIN_OBSERVATION_TIME. What happens later (the student moving the slider, or
 * the object reaching the end of the track) does not undo what was already
 * observed on the graph.
 */
export function openingVelocity(run: RunRecord): number | null {
  const [first, second] = run.segments
  if (!first) return null
  const end = second ? second.tStart : run.tEnd
  return end - first.tStart >= MIN_OBSERVATION_TIME ? first.v : null
}

/** A run that stayed at rest for at least MIN_OBSERVATION_TIME. */
export function observedRest(runs: readonly RunRecord[]): boolean {
  return runs.some((run) => openingVelocity(run) === 0)
}

/** Two runs whose opening velocities (each held long enough to see a slope) differ by a factor of 2. */
export function observedDoubling(runs: readonly RunRecord[]): boolean {
  const velocities = runs.map(openingVelocity).filter((v): v is number => v !== null && v !== 0)
  return velocities.some((a) => velocities.some((b) => Math.abs(b - 2 * a) < 1e-9))
}

/** A run in which the object reversed direction and the distance exceeded |Δx| noticeably. */
export function observedReversal(runs: readonly RunRecord[]): boolean {
  return runs.some((run) => {
    const hasForward = run.segments.some((s) => s.v > 0)
    const hasBackward = run.segments.some((s) => s.v < 0)
    const displacement = positionAtTime(run.segments, run.tEnd) - run.x0
    return hasForward && hasBackward && run.distance - Math.abs(displacement) >= 1
  })
}

/**
 * Near-miss for the reversal question: the student moved forwards in one run
 * and backwards in another (pressing Reset in between) instead of reversing
 * within a single run. Each of those runs went one way only, so in each the
 * distance equals |Δx| and the point of the question cannot show up.
 */
export function reversalHint(runs: readonly RunRecord[]): string | null {
  if (observedReversal(runs)) return null
  const movedForward = runs.some((run) => run.segments.some((s) => s.v > 0))
  const movedBackward = runs.some((run) => run.segments.some((s) => s.v < 0))
  if (!movedForward || !movedBackward) return null
  return (
    'You moved forwards and backwards in separate runs. Each of those runs went one way only, so in each one the ' +
    'distance equals |Δx|. Displacement and distance describe a single journey: press Start at +2 m/s, then, ' +
    'while the clock is still running, drag the velocity slider to −2 m/s. Do not press Reset in between.'
  )
}

/** The object stayed at rest (for long enough) while the second observer moved. */
export function observedRestFromMovingFrame(runs: readonly ExperimentRun[]): boolean {
  return runs.some((run) => openingVelocity(run) === 0 && run.u !== 0)
}

/** Near-misses for the moving-observer question: only one of the two settings was right. */
export function movingFrameHint(runs: readonly ExperimentRun[]): string | null {
  if (observedRestFromMovingFrame(runs)) return null
  if (runs.some((run) => openingVelocity(run) === 0)) {
    return (
      'The object was at rest, but so was the observer (u = 0), so both saw the same flat line. ' +
      'Press Reset, set the observer velocity to +2 m/s, then start the clock with v = 0.'
    )
  }
  if (runs.some((run) => run.u !== 0 && run.tEnd >= MIN_OBSERVATION_TIME)) {
    return 'The observer was moving, but so was the object. Press Reset, click "Set v = 0", keep u = +2 m/s and start the clock.'
  }
  return null
}

export const PREDICTIONS: readonly Prediction[] = [
  {
    id: 'rest',
    minLevel: 'beginner',
    question: 'You set the velocity to zero and start the clock. What will the position–time graph look like?',
    task: 'Set v = 0 and let the clock run for at least 3 seconds.',
    options: [
      { id: 'flat', label: 'A horizontal line: the position stays the same while time keeps going' },
      { id: 'dot', label: 'A single dot: nothing changes, so time stands still' },
      { id: 'vertical', label: 'A vertical line' },
      { id: 'rising', label: 'A line sloping upwards' },
    ],
    correct: 'flat',
    explanation:
      'The object did not move, yet the clock kept running: the graph extends to the right (time) but not up or down (position). ' +
      'Stopping motion through space does not stop the clock. In x(t) = x₀ + v·t, setting v = 0 leaves x = x₀ for every value of t.',
    observed: observedRest,
  },
  {
    id: 'double',
    minLevel: 'beginner',
    question: 'You run the experiment twice: once at some speed, then at double that speed. What happens to the line on the graph?',
    task: 'Do two runs, e.g. one at 1 m/s and one at 2 m/s, each held at that velocity for at least 3 seconds.',
    options: [
      { id: 'steeper', label: 'It becomes twice as steep' },
      { id: 'shifted', label: 'It moves up but keeps the same steepness' },
      { id: 'same', label: 'It looks the same, only it ends sooner' },
      { id: 'shallower', label: 'It becomes half as steep' },
    ],
    correct: 'steeper',
    explanation:
      'The steepness (slope) of a position–time graph is the velocity: slope = Δx / Δt = v. ' +
      'Doubling v doubles how far the object moves in each second, so the line rises twice as fast. ' +
      'Changing x₀ instead would shift the line up or down without changing its slope.',
    observed: observedDoubling,
  },
  {
    id: 'reverse',
    minLevel: 'intermediate',
    question:
      'In a single run, start at x₀ = 0 and move at +2 m/s for 3 s, then, without stopping the clock, drag the velocity slider to −2 m/s for another 3 s. What are the displacement Δx and the distance travelled?',
    task: 'Start the clock at +2 m/s. After about 3 s, while the clock is still running, drag the velocity slider to −2 m/s and let it run another 3 s. Do not press Reset in between.',
    options: [
      { id: 'zero-twelve', label: 'Δx = 0 m, distance = 12 m' },
      { id: 'both-twelve', label: 'Δx = 12 m, distance = 12 m' },
      { id: 'both-zero', label: 'Δx = 0 m, distance = 0 m' },
      { id: 'twelve-zero', label: 'Δx = 12 m, distance = 0 m' },
    ],
    correct: 'zero-twelve',
    explanation:
      'Displacement only compares where you end with where you started: Δx = ∫v dt, and the forward and backward parts cancel. ' +
      'Distance is the length of the path, s = ∫|v| dt, and it never decreases. They agree only when the motion never reverses.',
    observed: observedReversal,
    hint: reversalHint,
  },
  {
    id: 'moving-observer',
    minLevel: 'advanced',
    question:
      'The object is at rest on the track (v = 0). A second observer moves along the track at u = +2 m/s. ' +
      'In the observer’s own coordinates x′, what does the object’s position–time graph look like?',
    task: 'Press Reset, set the starting position to x₀ = +6 m (so the line stays on the graph longer), v = 0 and the observer velocity u = +2 m/s. Let the clock run for at least 3 seconds and watch the orange dashed line.',
    options: [
      { id: 'flat', label: 'A horizontal line: the object is at rest, so it is at rest for everyone' },
      { id: 'down', label: 'A line sloping downwards, with slope −2 m/s' },
      { id: 'up', label: 'A line sloping upwards, with slope +2 m/s' },
      { id: 'undefined', label: 'No line: a moving observer cannot assign the object a position' },
    ],
    correct: 'down',
    explanation:
      'The observer labels every event with x′ = x − u·t. With x = x₀ fixed, x′ = x₀ − u·t, a straight line with slope ' +
      'v′ = v − u = −u (−2 m/s for u = +2 m/s): to the observer, the object slides backwards past them. Both descriptions are ' +
      'correct, and Galilean physics picks neither as the true one, so "at rest" describes the object relative to a frame, not ' +
      'the object alone. Notice what both observers still agree on: the time coordinate, t′ = t. In Module 4 even that fails.',
    observed: observedRestFromMovingFrame,
    hint: movingFrameHint,
  },
]
