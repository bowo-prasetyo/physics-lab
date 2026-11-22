import { describe, expect, it } from 'vitest'
import { LEVELS } from '@/levels'
import {
  PREDICTIONS,
  bestAngleHint,
  dragAngleHint,
  dropHint,
  moonHint,
  observedBestAngle,
  observedDragAngle,
  observedDrop,
  observedMoon,
  observedTrain,
  trainHint,
} from './predictions'
import type { Throw } from './useProjectile'

const throwOf = (over: Partial<Throw>): Throw => ({
  speed: 20,
  angle: 45,
  height: 0,
  planet: 'earth',
  drag: false,
  frame: 'ground',
  trainSpeed: 10,
  companion: false,
  completed: true,
  range: 40,
  flightTime: 3,
  ...over,
})

describe('observation tests', () => {
  it('best angle: 45°, lower and higher at the same speed', () => {
    const set = [throwOf({ angle: 45 }), throwOf({ angle: 30 }), throwOf({ angle: 60 })]
    expect(observedBestAngle(set)).toBe(true)
    expect(observedBestAngle([throwOf({ angle: 45 }), throwOf({ angle: 30 })])).toBe(false)
    expect(observedBestAngle([...set.slice(0, 2), throwOf({ angle: 60, speed: 25 })])).toBe(false)
    expect(observedBestAngle(set.map((t) => ({ ...t, completed: false })))).toBe(false)
    expect(bestAngleHint([throwOf({ angle: 45 }), throwOf({ angle: 30 })])).toMatch(/above 45°/)
    expect(bestAngleHint([throwOf({ drag: true })])).toMatch(/air resistance off/)
  })

  it('drop: horizontal throw with a dropped ball, from 5 m or more, no air', () => {
    expect(observedDrop([throwOf({ angle: 0, companion: true, height: 10 })])).toBe(true)
    expect(observedDrop([throwOf({ angle: 0, companion: true, height: 2 })])).toBe(false)
    expect(observedDrop([throwOf({ angle: 0, companion: true, height: 10, drag: true })])).toBe(false)
    expect(dropHint([throwOf({ angle: 0, height: 10 })])).toMatch(/Also drop a ball/)
  })

  it('moon: the same throw on the Earth and on the Moon', () => {
    expect(observedMoon([throwOf({ planet: 'moon' }), throwOf({ planet: 'earth' })])).toBe(true)
    expect(observedMoon([throwOf({ planet: 'moon' }), throwOf({ planet: 'earth', angle: 30 })])).toBe(false)
    expect(moonHint([throwOf({ planet: 'earth' })])).toMatch(/switch to the Moon/)
  })

  it('train: frame moving at the ball’s horizontal speed', () => {
    const vx = 20 * Math.cos(Math.PI / 4)
    expect(observedTrain([throwOf({ frame: 'train', trainSpeed: vx })])).toBe(true)
    expect(observedTrain([throwOf({ frame: 'train', trainSpeed: 5 })])).toBe(false)
    expect(observedTrain([throwOf({ frame: 'train', trainSpeed: 20, angle: 0 })])).toBe(false)
    expect(trainHint([throwOf({ frame: 'train', trainSpeed: 5 })])).toMatch(/Match the ball/)
  })

  it('drag angle: fast Earth throws with air at 45° and at 37–43°', () => {
    const fast = { drag: true, speed: 40 }
    expect(observedDragAngle([throwOf({ ...fast, angle: 45 }), throwOf({ ...fast, angle: 40 })])).toBe(true)
    expect(observedDragAngle([throwOf({ ...fast, angle: 45 }), throwOf({ ...fast, angle: 30 })])).toBe(false)
    expect(observedDragAngle([throwOf({ drag: true, angle: 45 }), throwOf({ drag: true, angle: 40 })])).toBe(false)
    expect(dragAngleHint([throwOf({ drag: true, speed: 20 })])).toMatch(/at least 30 m\/s/)
  })

  it('every level adds at least one prediction, ids are unique, answers exist', () => {
    for (const level of LEVELS) expect(PREDICTIONS.some((p) => p.minLevel === level.id)).toBe(true)
    expect(new Set(PREDICTIONS.map((p) => p.id)).size).toBe(PREDICTIONS.length)
    for (const p of PREDICTIONS) expect(p.options.map((o) => o.id)).toContain(p.correct)
  })
})
