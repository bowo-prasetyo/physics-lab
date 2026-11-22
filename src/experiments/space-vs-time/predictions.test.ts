import { describe, expect, it } from 'vitest'
import { MotionRun, type RunRecord } from '@/physics'
import { LEVELS } from '@/levels'
import type { ExperimentRun } from './runs'
import {
  PREDICTIONS,
  movingFrameHint,
  observedDoubling,
  observedRest,
  observedRestFromMovingFrame,
  observedReversal,
  reversalHint,
} from './predictions'

const bounds = { min: -10, max: 10 }

function uniformRun(v: number, seconds: number, x0 = 0): RunRecord {
  const run = new MotionRun({ x0, v, duration: 10, bounds })
  run.advance(seconds)
  return run.toRecord()
}

describe('prediction observation tests', () => {
  it('rest requires a run held at v = 0 for long enough', () => {
    expect(observedRest([uniformRun(0, 1)])).toBe(false)
    expect(observedRest([uniformRun(1, 5)])).toBe(false)
    expect(observedRest([uniformRun(0, 3)])).toBe(true)
  })

  it('doubling requires two uniform runs with a 2:1 velocity ratio', () => {
    expect(observedDoubling([uniformRun(1, 4)])).toBe(false)
    expect(observedDoubling([uniformRun(1, 4), uniformRun(1.5, 4)])).toBe(false)
    expect(observedDoubling([uniformRun(1, 4), uniformRun(2, 4)])).toBe(true)
    expect(observedDoubling([uniformRun(-1.5, 4), uniformRun(-3, 4)])).toBe(true)
    expect(observedDoubling([uniformRun(1, 1), uniformRun(2, 1)])).toBe(false)
  })

  it('a run that reaches the end of the track still counts (its opening segment lasted long enough)', () => {
    const fast = uniformRun(3, 5) // reaches x = 10 at t ≈ 3.33 s, then rests
    expect(fast.segments).toHaveLength(2)
    expect(observedDoubling([uniformRun(1.5, 4), fast])).toBe(true)
  })

  it('doubling ignores runs whose velocity changed before 3 s', () => {
    const changed = new MotionRun({ x0: 0, v: 2, duration: 10, bounds })
    changed.advance(1)
    changed.setVelocity(0.5)
    changed.advance(3)
    expect(observedDoubling([uniformRun(1, 4), changed.toRecord()])).toBe(false)
  })

  it('reversal requires going both ways with distance > |displacement|', () => {
    const run = new MotionRun({ x0: 0, v: 2, duration: 10, bounds })
    run.advance(3)
    run.setVelocity(-2)
    expect(observedReversal([run.toRecord()])).toBe(false) // has not moved back yet
    run.advance(3)
    expect(observedReversal([run.toRecord()])).toBe(true)
  })

  it('separate forward and backward runs do not count as a reversal, and trigger a hint', () => {
    const forward = uniformRun(2, 3)
    const backward = uniformRun(-2, 3)
    expect(observedReversal([forward, backward])).toBe(false)
    expect(reversalHint([forward, backward])).toMatch(/separate runs/)
  })

  it('no reversal hint before both directions are tried, or once the reversal is observed', () => {
    expect(reversalHint([uniformRun(2, 3)])).toBeNull()
    const run = new MotionRun({ x0: 0, v: 2, duration: 10, bounds })
    run.advance(3)
    run.setVelocity(-2)
    run.advance(3)
    expect(reversalHint([uniformRun(-2, 3), run.toRecord()])).toBeNull()
  })

  it('moving-observer question needs the object at rest while the observer moves', () => {
    const withObserver = (run: RunRecord, u: number): ExperimentRun => ({ ...run, u })
    expect(observedRestFromMovingFrame([withObserver(uniformRun(0, 4), 2)])).toBe(true)
    expect(observedRestFromMovingFrame([withObserver(uniformRun(0, 4), 0)])).toBe(false) // observer not moving
    expect(observedRestFromMovingFrame([withObserver(uniformRun(1.5, 4), 2)])).toBe(false) // object not at rest
    expect(observedRestFromMovingFrame([withObserver(uniformRun(0, 1), 2)])).toBe(false) // too short
  })

  it('moving-observer hints name the setting that was wrong', () => {
    const withObserver = (run: RunRecord, u: number): ExperimentRun => ({ ...run, u })
    expect(movingFrameHint([])).toBeNull()
    expect(movingFrameHint([withObserver(uniformRun(0, 4), 0)])).toMatch(/observer velocity/)
    expect(movingFrameHint([withObserver(uniformRun(1.5, 4), 2)])).toMatch(/Set v = 0/)
    expect(movingFrameHint([withObserver(uniformRun(0, 4), 2)])).toBeNull()
  })

  it('every level adds at least one prediction of its own', () => {
    for (const level of LEVELS) expect(PREDICTIONS.some((p) => p.minLevel === level.id)).toBe(true)
  })

  it('prediction ids are unique', () => {
    expect(new Set(PREDICTIONS.map((p) => p.id)).size).toBe(PREDICTIONS.length)
  })

  it('every prediction lists its correct answer among the options', () => {
    for (const p of PREDICTIONS) expect(p.options.map((o) => o.id)).toContain(p.correct)
  })
})
