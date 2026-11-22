import { describe, expect, it } from 'vitest'
import { MotionRun, type RunRecord } from '@/physics'
import { PREDICTIONS, observedDoubling, observedRest, observedReversal } from './predictions'

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

  it('every prediction lists its correct answer among the options', () => {
    for (const p of PREDICTIONS) expect(p.options.map((o) => o.id)).toContain(p.correct)
  })
})
