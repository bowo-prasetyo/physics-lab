/** Predict–observe–explain prompts for Experiment B (see experiments/prediction.ts). */

import type { Prediction } from '@/experiments/prediction'
import { DURATION, type ClockRun } from './useMovingClocks'

/** Minimum clock time a run needs before it counts as an observation (s). */
export const MIN_OBSERVATION_TIME = 3
/** Speeds below this make the effects too small to notice on the diagram. */
export const MIN_NOTICEABLE_BETA = 0.5

const near = (a: number, b: number) => Math.abs(a - b) < 1e-6
const longEnough = (run: ClockRun) => run.tEnd >= MIN_OBSERVATION_TIME

/** A full Earth-frame run at 0.80c: the Earth clock reached 10 s. */
export function observedTextbookDilation(runs: readonly ClockRun[]): boolean {
  return runs.some((run) => run.frame === 'earth' && near(run.beta, 0.8) && run.tEnd >= DURATION)
}

export function textbookDilationHint(runs: readonly ClockRun[]): string | null {
  if (observedTextbookDilation(runs)) return null
  if (runs.some((run) => run.frame === 'earth' && run.tEnd >= DURATION)) {
    return 'You completed a run, but not at 0.80c. Set the ship speed to exactly 0.80c and run the clock to 10 s.'
  }
  if (runs.some((run) => run.frame === 'ship' && run.tEnd > 0)) {
    return 'This question is about the Earth’s point of view. Switch “Seen from” to Earth, set 0.80c and run the clock to 10 s.'
  }
  return null
}

/** A run seen from the ship's frame at a speed where the effect is clear. */
export function observedShipFrame(runs: readonly ClockRun[]): boolean {
  return runs.some((run) => run.frame === 'ship' && run.beta >= MIN_NOTICEABLE_BETA && longEnough(run))
}

export function shipFrameHint(runs: readonly ClockRun[]): string | null {
  if (observedShipFrame(runs)) return null
  if (runs.some((run) => run.frame === 'ship' && longEnough(run))) {
    return `At low speeds the difference is hard to see. Set the ship speed to at least ${MIN_NOTICEABLE_BETA.toFixed(2)}c and run again.`
  }
  if (runs.some((run) => run.frame === 'earth' && run.tEnd > 0)) {
    return 'So far you have watched from the Earth. Switch “Seen from” to the ship, then start the clock.'
  }
  return null
}

/** The same speed (above zero) seen from both frames, each long enough. */
export function observedBothFrames(runs: readonly ClockRun[]): boolean {
  const done = runs.filter((run) => run.beta > 0 && longEnough(run))
  return done.some((a) => a.frame === 'earth' && done.some((b) => b.frame === 'ship' && near(a.beta, b.beta)))
}

export function bothFramesHint(runs: readonly ClockRun[]): string | null {
  if (observedBothFrames(runs)) return null
  const done = runs.filter((run) => run.beta > 0 && longEnough(run))
  const earth = done.some((run) => run.frame === 'earth')
  const ship = done.some((run) => run.frame === 'ship')
  if (earth && ship) return 'You have runs from both frames, but at different speeds. Keep the speed the same and run once from each frame.'
  if (earth) return 'Now switch “Seen from” to the ship and run again at the same speed. Compare s² with the ship clock’s reading.'
  if (ship) return 'Now switch “Seen from” to the Earth and run again at the same speed. Compare s² with the ship clock’s reading.'
  return null
}

export const PREDICTIONS: readonly Prediction<ClockRun>[] = [
  {
    id: 'dilation',
    minLevel: 'beginner',
    question:
      'A spaceship passes the Earth at 0.80c (80% of the speed of light). Both clocks read 0 s as it passes. ' +
      'Seen from the Earth, what does the ship’s clock read when the Earth clock reads 10 s?',
    task: 'With “Seen from: Earth” and the ship speed at 0.80c, run the clock to 10 s.',
    options: [
      { id: 'same', label: '10 s: time is the same everywhere' },
      { id: 'six', label: '6 s: the moving clock runs slow' },
      { id: 'more', label: 'About 16.7 s: the moving clock runs fast' },
      { id: 'zero', label: '0 s: moving clocks stop' },
    ],
    correct: 'six',
    explanation:
      'At 0.80c the Lorentz factor is γ = 1/√(1 − 0.80²) = 1.667, so the ship clock advances 10 s / 1.667 = 6.00 s while the Earth clock ' +
      'advances 10 s. On the diagram, the ship’s tick marks are spread further apart in Earth time than the Earth’s. ' +
      'This is time dilation, and it has been measured many times, for example with fast-moving muons and atomic clocks on aircraft.',
    observed: observedTextbookDilation,
    hint: textbookDilationHint,
  },
  {
    id: 'own-clock',
    minLevel: 'beginner',
    question: 'Now take the astronaut’s point of view. For the astronaut, how does the ship’s own clock tick?',
    task: 'Switch “Seen from” to the ship, keep a speed of at least 0.50c, and run the clock for at least 3 seconds.',
    options: [
      { id: 'normal', label: 'Normally: one second per second' },
      { id: 'slow', label: 'Slowly, because the ship is moving fast' },
      { id: 'stopped', label: 'It stops' },
      { id: 'fast', label: 'Faster than normal' },
    ],
    correct: 'normal',
    explanation:
      'In its own frame the ship is at rest, so its clock simply ticks one second per second, and the astronaut’s heartbeat, ' +
      'thoughts and ageing all keep pace with it. Nobody ever feels their own time slow down. Time dilation is a comparison ' +
      'between clocks that are moving relative to each other.',
    observed: observedShipFrame,
    hint: shipFrameHint,
  },
  {
    id: 'reciprocal',
    minLevel: 'intermediate',
    question: 'Still in the ship’s frame: which clock runs slow?',
    task: 'Switch “Seen from” to the ship, keep a speed of at least 0.50c, and run the clock for at least 3 seconds. Compare the two clocks.',
    options: [
      { id: 'earth', label: 'The Earth clock: for the ship, the Earth is the one moving' },
      { id: 'ship', label: 'The ship clock, the same as from the Earth' },
      { id: 'neither', label: 'Neither: from the ship both clocks agree' },
      { id: 'both', label: 'Both clocks slow down' },
    ],
    correct: 'earth',
    explanation:
      'Time dilation is symmetric. In the ship’s frame the Earth moves at −β, so the Earth clock is the slow one, by the same factor γ. ' +
      'Both observers are right because they disagree about which events happen “now”: tilted lines of simultaneity on the ' +
      'diagram show that each observer’s “now” meets the other clock at a different reading. The contradiction only appears if you ' +
      'assume a single universal “now”.',
    observed: observedShipFrame,
    hint: shipFrameHint,
  },
  {
    id: 'invariant',
    minLevel: 'advanced',
    question:
      'Consider one event: “the ship clock reads τ”. The two frames give it different coordinates (t, x). Which quantity do both frames agree on?',
    task: 'Run at the same speed once from each frame (at least 3 s each). Compare the ship event’s t, x and s² = t² − x² in the readouts.',
    options: [
      { id: 't', label: 'Its time coordinate t' },
      { id: 'x', label: 'Its position x' },
      { id: 'interval', label: 'The interval s² = t² − x² (with c = 1), which equals τ²' },
      { id: 'none', label: 'Nothing: all its coordinates depend on the frame' },
    ],
    correct: 'interval',
    explanation:
      'The coordinates t and x change under a Lorentz boost, but the interval s² = c²t² − x² from the passing event does not. ' +
      'For the ship’s own worldline it equals τ², so the proper time is a geometric property of the worldline, the same for everyone. ' +
      'That is the core idea of spacetime: separate space and time coordinates depend on the observer, while the interval does not.',
    observed: observedBothFrames,
    hint: bothFramesHint,
  },
]
