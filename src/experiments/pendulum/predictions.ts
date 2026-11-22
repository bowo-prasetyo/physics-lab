/** Predict–observe–explain prompts for the pendulum-clock experiment (see experiments/prediction.ts). */

import type { Prediction } from '@/experiments/prediction'
import type { PeriodMeasurement } from './usePendulum'

const close = (a: number, b: number, tolerance: number) => Math.abs(a - b) <= tolerance * Math.abs(b)
const small = (m: PeriodMeasurement) => m.amplitude <= 20

/** Periods measured at two lengths in the ratio 4 : 1, small swings, same world. */
export function observedLength(ms: readonly PeriodMeasurement[]): boolean {
  return ms.filter(small).some((a) => ms.filter(small).some((b) => b.planet === a.planet && close(b.length, 4 * a.length, 0.03)))
}

export function lengthHint(ms: readonly PeriodMeasurement[]): string | null {
  if (observedLength(ms)) return null
  if (ms.length === 0) return null
  if (!ms.some(small)) return 'Use a small swing (20° or less) for this question.'
  return 'Measure a period, then make the string exactly four times longer (for example 0.5 m and 2.0 m) and measure again.'
}

/** The same length and world with two masses differing by at least a factor of 5. */
export function observedMass(ms: readonly PeriodMeasurement[]): boolean {
  return ms.some((a) => ms.some((b) => b.planet === a.planet && b.length === a.length && b.amplitude === a.amplitude && b.mass >= 5 * a.mass))
}

export function massHint(ms: readonly PeriodMeasurement[]): string | null {
  if (observedMass(ms)) return null
  if (ms.length === 0) return null
  return 'Keep the length and swing the same, and measure with a light bob (say 0.5 kg) and a heavy one (5 kg or more).'
}

/** The same length measured on the Earth and on the Moon. */
export function observedMoon(ms: readonly PeriodMeasurement[]): boolean {
  return ms.some((m) => m.planet === 'moon' && ms.some((e) => e.planet === 'earth' && e.length === m.length))
}

export function moonHint(ms: readonly PeriodMeasurement[]): string | null {
  if (observedMoon(ms)) return null
  if (ms.some((m) => m.planet === 'moon')) return 'Now measure the same pendulum (same length) on the Earth.'
  if (ms.some((m) => m.planet === 'earth')) return 'Now take the same pendulum to the Moon and measure its period there.'
  return null
}

/** The same pendulum swung through a wide (≥ 80°) and a narrow (≤ 10°) amplitude. */
export function observedAmplitude(ms: readonly PeriodMeasurement[]): boolean {
  return ms.some((w) => w.amplitude >= 80 && ms.some((n) => n.amplitude <= 10 && n.length === w.length && n.planet === w.planet))
}

export function amplitudeHint(ms: readonly PeriodMeasurement[]): string | null {
  if (observedAmplitude(ms)) return null
  if (ms.some((m) => m.amplitude >= 80)) return 'Now measure the same pendulum with a small swing (10° or less).'
  if (ms.some((m) => m.amplitude <= 10)) return 'Now release the same pendulum from 90° and measure again.'
  return null
}

export const PREDICTIONS: readonly Prediction<PeriodMeasurement>[] = [
  {
    id: 'length',
    minLevel: 'beginner',
    question: 'You make a pendulum’s string four times longer. The time for one complete swing (there and back)…',
    task: 'With a small swing (20° or less), measure the period at one length, then at four times that length (for example 0.5 m and 2.0 m).',
    options: [
      { id: 'same', label: 'Stays the same' },
      { id: 'double', label: 'Doubles' },
      { id: 'four', label: 'Becomes four times as long' },
      { id: 'half', label: 'Halves' },
    ],
    correct: 'double',
    explanation:
      'For small swings the period is T = 2π√(L/g), so four times the length gives √4 = 2 times the period. A pendulum about 1 m long ' +
      'swings once each way per second, which is why grandfather clocks are tall.',
    observed: observedLength,
    hint: lengthHint,
  },
  {
    id: 'mass',
    minLevel: 'beginner',
    question: 'You replace the bob with one ten times heavier, on the same string. The period…',
    task: 'Keeping the length and the swing the same, measure the period with a light bob, then with one at least five times heavier.',
    options: [
      { id: 'shorter', label: 'Gets shorter: the heavier bob falls faster' },
      { id: 'same', label: 'Stays the same' },
      { id: 'longer', label: 'Gets longer: the heavier bob is harder to move' },
      { id: 'stops', label: 'The heavy bob barely swings' },
    ],
    correct: 'same',
    explanation:
      'A heavier bob is pulled harder by gravity, but it is also harder to speed up, by exactly the same factor, so the mass cancels. It is the ' +
      'same reason a heavy and a light ball, dropped together, land together. Einstein made this equality of “heavy” and “inert” mass the ' +
      'starting point of general relativity (the equivalence principle).',
    observed: observedMass,
    hint: massHint,
  },
  {
    id: 'moon',
    minLevel: 'intermediate',
    question: 'A pendulum clock that keeps perfect time on the Earth is taken to the Moon, where gravity is about 1/6 as strong. The clock…',
    task: 'Measure the period of the same pendulum (same length) on the Earth and on the Moon, and watch the two clocks.',
    options: [
      { id: 'slow', label: 'Runs about 2.5 times too slow' },
      { id: 'six', label: 'Runs 6 times too slow' },
      { id: 'same', label: 'Still keeps perfect time' },
      { id: 'fast', label: 'Runs too fast' },
    ],
    correct: 'slow',
    explanation:
      'T = 2π√(L/g) grows as 1/√g, and √(9.81/1.62) ≈ 2.46. Each swing takes 2.46 times longer, so the clock counts 2.46 times too few ' +
      'seconds and loses about 14 hours a day. In 1672 Jean Richer found that his pendulum clock lost about 2.5 minutes a day near the ' +
      'equator, an early clue that gravity is weaker there than in Paris.',
    observed: observedMoon,
    hint: moonHint,
  },
  {
    id: 'time-itself',
    minLevel: 'intermediate',
    question: 'So on the Moon, does time itself pass more slowly?',
    task: 'Measure the same pendulum on the Earth and on the Moon, and compare the pendulum clock with the atomic clock.',
    options: [
      { id: 'yes', label: 'Yes: the slow pendulum clock proves it' },
      { id: 'no', label: 'No: the pendulum depends on gravity; atomic clocks on the Moon actually run very slightly fast' },
      { id: 'unknown', label: 'There is no way to tell' },
      { id: 'pendulums', label: 'Only for pendulums: time is different for each kind of clock' },
    ],
    correct: 'no',
    explanation:
      'A pendulum measures gravity as much as time: its rhythm depends on g. Atomic clocks, which define the second, do not work that way. ' +
      'Compared side by side, they show the Moon’s time running very slightly fast, by about 56 microseconds a day, because of the weaker ' +
      'gravity there (Experiment C). “Time” is best thought of as what all good clocks agree on when they are together; a clock that ' +
      'disagrees is measuring something else as well.',
    observed: observedMoon,
    hint: moonHint,
  },
  {
    id: 'amplitude',
    minLevel: 'advanced',
    question: 'Galileo believed a pendulum’s period does not depend on how wide it swings. Released from 90° instead of 5°, the period is…',
    task: 'Measure the same pendulum released from 90° (or more) and from 10° or less.',
    options: [
      { id: 'same', label: 'The same' },
      { id: 'longer', label: 'About 18% longer' },
      { id: 'shorter', label: 'About 18% shorter' },
      { id: 'double', label: 'About twice as long' },
    ],
    correct: 'longer',
    explanation:
      'The restoring force is proportional to sin θ, not θ, so a wide swing is “softer” and slower. The exact period is ' +
      'T = T₀ / AGM(1, cos(θ₀/2)), which is 1.180 T₀ at 90°. Clockmakers keep the swing small and constant, and Huygens even designed ' +
      'cycloid-shaped cheeks that make the period exactly independent of the amplitude.',
    observed: observedAmplitude,
    hint: amplitudeHint,
  },
]
