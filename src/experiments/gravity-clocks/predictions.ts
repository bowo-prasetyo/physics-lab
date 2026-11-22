/** Predict–observe–explain prompts for Experiment C (see experiments/prediction.ts). */

import type { Prediction } from '@/experiments/prediction'
import { schwarzschildRadius } from '@/physics'
import { bodyById, type GravityRun } from './useGravityClocks'

/** Far-away days a run needs before it counts as an observation. */
export const MIN_DAYS = 1

const longEnough = (run: GravityRun) => run.tEnd >= MIN_DAYS
const clockRuns = (runs: readonly GravityRun[]) => runs.filter((r) => r.mode === 'clocks')
const gpsRuns = (runs: readonly GravityRun[]) => runs.filter((r) => r.mode === 'gps')

/** Two Earth clocks at least 1 km apart in height, run for a day or more. */
export function observedMountain(runs: readonly GravityRun[]): boolean {
  return clockRuns(runs).some((r) => r.body === 'earth' && Math.abs(r.altitudeB - r.altitudeA) >= 1000 && longEnough(r))
}

export function mountainHint(runs: readonly GravityRun[]): string | null {
  if (observedMountain(runs)) return null
  const earth = clockRuns(runs).filter((r) => r.body === 'earth' && r.tEnd > 0)
  if (earth.some((r) => !longEnough(r))) return 'Let the clocks run for at least one day of time-lapse.'
  if (earth.length > 0) return 'Put one clock at sea level and the other on Everest (use the buttons), then run the clocks.'
  if (runs.some((r) => r.tEnd > 0)) return 'Choose the Earth, put clock A at sea level and clock B on Everest, then run the clocks.'
  return null
}

export function observedGps(runs: readonly GravityRun[]): boolean {
  return gpsRuns(runs).some(longEnough)
}

export function gpsHint(runs: readonly GravityRun[]): string | null {
  if (observedGps(runs)) return null
  if (gpsRuns(runs).some((r) => r.tEnd > 0)) return 'Let it run for at least one day.'
  if (runs.some((r) => r.tEnd > 0)) return 'Switch to “GPS satellite” at the top of the experiment, then start the clocks.'
  return null
}

export function observedUncorrectedGps(runs: readonly GravityRun[]): boolean {
  return gpsRuns(runs).some((r) => !r.correction && longEnough(r))
}

export function uncorrectedGpsHint(runs: readonly GravityRun[]): string | null {
  if (observedUncorrectedGps(runs)) return null
  if (gpsRuns(runs).some((r) => r.correction && r.tEnd > 0)) return 'The correction was on. Switch it off and run for at least one day.'
  if (runs.some((r) => r.tEnd > 0)) return 'Switch to “GPS satellite”, turn the relativity correction off, and run for at least one day.'
  return null
}

/** A clock within 0.01 r_s of a black hole's horizon, run for a day or more. */
export function observedNearHorizon(runs: readonly GravityRun[]): boolean {
  const rs = schwarzschildRadius(bodyById('black-hole').mass)
  return clockRuns(runs).some((r) => r.body === 'black-hole' && Math.min(r.altitudeA, r.altitudeB) <= 0.0100001 * rs && longEnough(r))
}

export function nearHorizonHint(runs: readonly GravityRun[]): string | null {
  if (observedNearHorizon(runs)) return null
  if (clockRuns(runs).some((r) => r.body === 'black-hole' && r.tEnd > 0)) return 'Move clock A closer: 0.01 r_s above the horizon or less (use the buttons).'
  if (runs.some((r) => r.tEnd > 0)) return 'Choose the black hole, put clock A at 0.01 r_s or closer to the horizon, and run the clocks.'
  return null
}

/** Any two static clocks at different heights, run for a day or more (the signal readouts are shown at Advanced). */
export function observedSignals(runs: readonly GravityRun[]): boolean {
  return clockRuns(runs).some((r) => r.altitudeA !== r.altitudeB && longEnough(r))
}

export const PREDICTIONS: readonly Prediction<GravityRun>[] = [
  {
    id: 'mountain',
    minLevel: 'beginner',
    question: 'One clock sits at sea level, an identical one on top of Mount Everest, 8.8 km higher. After a while, which has counted more time?',
    task: 'With the Earth selected, put clock A at sea level and clock B on Everest, then run the clocks for at least one day.',
    options: [
      { id: 'sea', label: 'The sea-level clock' },
      { id: 'everest', label: 'The clock on Everest' },
      { id: 'same', label: 'Neither: they stay in step' },
      { id: 'depends', label: 'It depends on who is looking' },
    ],
    correct: 'everest',
    explanation:
      'Clocks deeper in a gravitational field run slower. On Everest the clock gains about 83 nanoseconds per day on sea level: about ' +
      '2 milliseconds over a lifetime. Everything up there runs at the same faster rate, including heartbeats and chemistry, so nobody ' +
      'feels it. Only comparing clocks reveals it.',
    observed: observedMountain,
    hint: mountainHint,
  },
  {
    id: 'gps',
    minLevel: 'beginner',
    question: 'GPS satellites orbit 20 200 km up at about 3.9 km/s. Compared with clocks on the ground, their clocks…',
    task: 'Switch to “GPS satellite” and run the clocks for at least one day.',
    options: [
      { id: 'fast', label: 'Run fast, by about 38 microseconds per day' },
      { id: 'slow', label: 'Run slow, because they move so fast' },
      { id: 'same', label: 'Tick at exactly the same rate' },
      { id: 'second', label: 'Run fast, by about 1 second per day' },
    ],
    correct: 'fast',
    explanation:
      'Two effects compete. Being higher up, in weaker gravity, makes the satellite clock gain about 45.7 μs per day. Its orbital speed ' +
      'makes it lose about 7.2 μs per day (the time dilation of Experiment B). Gravity wins: a net gain of about 38.5 μs per day.',
    observed: observedGps,
    hint: gpsHint,
  },
  {
    id: 'uncorrected',
    minLevel: 'intermediate',
    question: 'GPS works out your position from how long signals take to arrive. If engineers ignored relativity, how fast would positions drift?',
    task: 'In “GPS satellite”, switch the relativity correction off and run for at least one day.',
    options: [
      { id: 'metre', label: 'About 1 metre per day' },
      { id: 'km', label: 'About 10 kilometres per day' },
      { id: 'mm', label: 'About 1 millimetre per day' },
      { id: 'none', label: 'Not at all: the effect is far too small' },
    ],
    correct: 'km',
    explanation:
      'Light travels about 300 m in a microsecond, so a clock error of 38.5 μs per day becomes a ranging error of about 11.5 km per day. ' +
      'In practice, the satellite clocks are set before launch to tick at 10.22999999543 MHz instead of 10.23 MHz, so that once in orbit ' +
      'they run at the right rate as seen from the ground.',
    observed: observedUncorrectedGps,
    hint: uncorrectedGpsHint,
  },
  {
    id: 'horizon',
    minLevel: 'advanced',
    question: 'A clock is lowered slowly towards a black hole’s event horizon. Compared with a far-away clock, what happens to its rate as it gets very close?',
    task: 'Choose the black hole, put clock A at 0.01 r_s above the horizon or closer, and run the clocks.',
    options: [
      { id: 'zero', label: 'It approaches zero' },
      { id: 'half', label: 'It drops to one half, then stays there' },
      { id: 'backwards', label: 'It runs backwards' },
      { id: 'faster', label: 'It speeds up' },
    ],
    correct: 'zero',
    explanation:
      'A clock held at rest at radius r runs at √(1 − r_s/r) of the far-away rate, which tends to zero at the horizon. Its signals reach ' +
      'far-away observers ever more redshifted. This does not mean time stops for the clock: a clock that falls in freely ticks normally ' +
      'and crosses the horizon in a finite time on its own dial. “Time stops at the horizon” describes a comparison with distant clocks.',
    observed: observedNearHorizon,
    hint: nearHorizonHint,
  },
  {
    id: 'agree',
    minLevel: 'advanced',
    question:
      'In Experiment B, each moving observer found the other’s clock slow. Here, do the observers at the lower and upper clocks agree about which clock is slow?',
    task: 'Run any two clocks at different heights for at least one day, and compare the “signals received” readouts.',
    options: [
      { id: 'agree', label: 'Yes: both find the lower clock slow' },
      { id: 'mutual', label: 'No: each finds the other’s clock slow' },
      { id: 'unknowable', label: 'Neither can tell' },
      { id: 'frame', label: 'It depends on the frame of reference' },
    ],
    correct: 'agree',
    explanation:
      'They agree. Ticks sent upwards arrive slowed (redshifted) and ticks sent downwards arrive sped up (blueshifted), by exactly inverse ' +
      'factors, so the upper observer sees the lower clock run slow and the lower observer sees the upper clock run fast. Unlike two ' +
      'clocks in uniform relative motion, the situation is not symmetric: one clock really is deeper in the gravitational well.',
    observed: observedSignals,
  },
]
