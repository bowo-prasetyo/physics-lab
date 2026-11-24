/** Predict–observe–explain prompts for the projectile experiment (see experiments/prediction.ts). */

import type { Prediction } from '@/experiments/prediction'
import type { Throw } from './useProjectile'

const done = (throws: readonly Throw[]) => throws.filter((t) => t.completed)
/** Throws from the ground without air resistance. */
const ideal = (throws: readonly Throw[]) => done(throws).filter((t) => !t.drag && t.height === 0)
const vx = (t: Throw) => t.speed * Math.cos((t.angle * Math.PI) / 180)

/** 45°, plus a lower and a higher angle, at the same speed on the same world, from the ground, without air. */
export function observedBestAngle(throws: readonly Throw[]): boolean {
  return ideal(throws).some(
    (a) =>
      a.angle === 45 &&
      ideal(throws).some((b) => b.angle < 45 && b.speed === a.speed && b.planet === a.planet) &&
      ideal(throws).some((c) => c.angle > 45 && c.speed === a.speed && c.planet === a.planet),
  )
}

export function bestAngleHint(throws: readonly Throw[]): string | null {
  if (observedBestAngle(throws)) return null
  const runs = ideal(throws)
  if (done(throws).length > 0 && runs.length === 0) return 'Use launch height 0 and switch air resistance off for this question.'
  if (runs.length === 0) return null
  const missing = [
    runs.some((r) => r.angle === 45) ? null : 'exactly 45°',
    runs.some((r) => r.angle < 45) ? null : 'an angle below 45°',
    runs.some((r) => r.angle > 45) ? null : 'an angle above 45°',
  ].filter(Boolean)
  return missing.length
    ? `Keep the same speed and also launch at ${missing.join(' and ')}.`
    : 'Keep the speed the same for all three launches (45°, lower, higher).'
}

/** Thrown horizontally with a dropped ball alongside, from at least 5 m, without air. */
export function observedDrop(throws: readonly Throw[]): boolean {
  return done(throws).some((t) => t.angle === 0 && t.companion && t.height >= 5 && !t.drag && t.speed > 0)
}

export function dropHint(throws: readonly Throw[]): string | null {
  if (observedDrop(throws)) return null
  const d = done(throws)
  if (d.length === 0) return null
  if (!d.some((t) => t.companion)) return 'Tick “Also drop a ball” so a second ball falls from the same height at the same moment.'
  return 'Set the angle to 0° (a horizontal throw), the height to at least 5 m, air resistance off, and launch.'
}

/** The same throw from the ground, without air, on the Earth and on the Moon. */
export function observedMoon(throws: readonly Throw[]): boolean {
  const runs = ideal(throws)
  return runs.some((m) => m.planet === 'moon' && runs.some((e) => e.planet === 'earth' && e.speed === m.speed && e.angle === m.angle && m.angle > 0))
}

export function moonHint(throws: readonly Throw[]): string | null {
  if (observedMoon(throws)) return null
  const runs = ideal(throws)
  if (runs.some((r) => r.planet === 'moon')) return 'Now make exactly the same throw (same speed and angle) on the Earth.'
  if (runs.some((r) => r.planet === 'earth')) return 'Now switch to the Moon and repeat the same throw (same speed and angle).'
  return null
}

/** Watched from a train moving at the ball's horizontal speed. */
export function observedTrain(throws: readonly Throw[]): boolean {
  return done(throws).some((t) => t.frame === 'train' && t.angle >= 10 && t.angle <= 80 && Math.abs(t.trainSpeed - vx(t)) <= 0.5)
}

export function trainHint(throws: readonly Throw[]): string | null {
  if (observedTrain(throws)) return null
  const train = done(throws).filter((t) => t.frame === 'train')
  if (train.length > 0) return 'Press “Match the ball” so the train moves at exactly the ball’s horizontal speed, then launch again.'
  if (done(throws).length > 0) return 'Choose “Seen from: a moving train”, press “Match the ball”, then launch.'
  return null
}

/** A fast baseball on Earth with air: 45° and a slightly lower angle (37–43°) at the same speed, from the ground. */
export function observedDragAngle(throws: readonly Throw[]): boolean {
  const runs = done(throws).filter((t) => t.drag && t.planet === 'earth' && t.height === 0 && t.speed >= 30)
  return runs.some((a) => a.angle === 45 && runs.some((b) => b.speed === a.speed && b.angle >= 37 && b.angle <= 43))
}

export function dragAngleHint(throws: readonly Throw[]): string | null {
  if (observedDragAngle(throws)) return null
  const runs = done(throws).filter((t) => t.drag && t.planet === 'earth')
  if (runs.length === 0) return done(throws).length > 0 ? 'On the Earth, switch air resistance on and use a speed of at least 30 m/s.' : null
  if (runs.some((r) => r.speed < 30 || r.height > 0)) return 'Use at least 30 m/s from height 0, so air resistance really matters.'
  return 'Launch at 45° and at 40°, at the same speed, and compare the ranges.'
}

export const PREDICTIONS: readonly Prediction<Throw>[] = [
  {
    id: 'best-angle',
    minLevel: 'beginner',
    question: 'Without air resistance, which launch angle throws a ball furthest across flat ground?',
    task: 'With height 0 and air resistance off, launch at 45°, at a lower angle and at a higher angle, all at the same speed.',
    options: [
      { id: '30', label: '30°' },
      { id: '45', label: '45°' },
      { id: '60', label: '60°' },
      { id: '90', label: 'Straight up (90°)' },
    ],
    correct: '45',
    explanation:
      'The range is R = v² sin(2θ)/g, largest when 2θ = 90°, so θ = 45°. A lower angle gives more horizontal speed but less time in the air; ' +
      'a higher angle, more time but less horizontal speed. Angles the same distance either side of 45° (say 30° and 60°) land at the same place.',
    observed: observedBestAngle,
    hint: bestAngleHint,
  },
  {
    id: 'drop',
    minLevel: 'beginner',
    question: 'A ball is thrown horizontally off a wall at the same moment as an identical ball is simply dropped from the same height. Which lands first?',
    task: 'Set the angle to 0°, the height to 5 m or more, air resistance off, tick “Also drop a ball”, and launch.',
    options: [
      { id: 'thrown', label: 'The thrown ball' },
      { id: 'dropped', label: 'The dropped ball' },
      { id: 'together', label: 'They land at the same moment' },
      { id: 'depends', label: 'It depends on how hard it is thrown' },
    ],
    correct: 'together',
    explanation:
      'Horizontal and vertical motion are independent. Both balls start with zero vertical speed and fall under the same gravity, so they ' +
      'are always at the same height: the thrown one simply moves sideways at the same time. Galileo was the first to explain this clearly.',
    observed: observedDrop,
    hint: dropHint,
  },
  {
    id: 'moon',
    minLevel: 'intermediate',
    question: 'An astronaut makes the same throw on the Moon, where gravity is about 1/6 of the Earth’s. How much further does the ball go?',
    task: 'Without air and from height 0, make the same throw (same speed and angle) on the Earth and on the Moon.',
    options: [
      { id: 'same', label: 'The same distance' },
      { id: 'root', label: 'About 2.5 times as far (√6)' },
      { id: 'six', label: 'About 6 times as far' },
      { id: 'thirty-six', label: 'About 36 times as far' },
    ],
    correct: 'six',
    explanation:
      'The range is R = v² sin(2θ)/g, inversely proportional to g. With g_Moon ≈ g_Earth/6, the ball stays in the air 6 times as long ' +
      'and goes 6 times as far (6.06 times, with 9.81 and 1.62 m/s²). It also rises 6 times as high.',
    observed: observedMoon,
    hint: moonHint,
  },
  {
    id: 'train',
    minLevel: 'intermediate',
    question:
      'Someone on a train moving alongside at exactly the ball’s horizontal speed watches the throw. What path do they see the ball follow?',
    task: 'Choose “Seen from: a moving train”, press “Match the ball”, and launch at an angle between 10° and 80°.',
    options: [
      { id: 'parabola', label: 'The same parabola as seen from the ground' },
      { id: 'vertical', label: 'Straight up and straight back down' },
      { id: 'line', label: 'A straight sloping line' },
      { id: 'circle', label: 'A circle' },
    ],
    correct: 'vertical',
    explanation:
      'For the train, the ball has no horizontal speed (x′ = x − ut with u = v_x), so it goes straight up and down, like a ball tossed ' +
      'inside the train. The shape of a path depends on the observer, but the acceleration (g, straight down) and Newton’s laws are the same ' +
      'for both. This is Galilean relativity, the idea that “Space versus time”, “Different clocks” and “Space and time versus spacetime” develop further.',
    observed: observedTrain,
    hint: trainHint,
  },
  {
    id: 'drag-angle',
    minLevel: 'advanced',
    question: 'With air resistance, a fast baseball (at least 30 m/s). Is 45° still the angle that throws furthest?',
    task: 'On the Earth with air resistance on, from height 0 at 30 m/s or more, launch at 45° and at 40°, and compare the ranges.',
    options: [
      { id: 'yes', label: 'Yes, 45° is always best' },
      { id: 'lower', label: 'No: the best angle is lower than 45°' },
      { id: 'higher', label: 'No: the best angle is higher than 45°' },
      { id: 'no-effect', label: 'Air resistance does not affect the range' },
    ],
    correct: 'lower',
    explanation:
      'Drag robs the ball of speed throughout the flight, and the longer it stays up the more it loses. A flatter, quicker flight wastes less, ' +
      'so the best angle drops below 45°: for this baseball, about 42° at 30 m/s and 41° at 40 m/s, lower still at higher speeds (real batted ' +
      'balls also spin, which changes this further). The path becomes lopsided too: launched at 45°, it comes down at nearly 60°. There is no ' +
      'formula for this; the computer integrates Newton’s law step by step.',
    observed: observedDragAngle,
    hint: dragAngleHint,
  },
]
