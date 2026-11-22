import { describe, expect, it } from 'vitest'
import { LEVELS } from '@/levels'
import {
  PREDICTIONS,
  bothFramesHint,
  observedBothFrames,
  observedShipFrame,
  observedTextbookDilation,
  shipFrameHint,
  textbookDilationHint,
} from './predictions'
import { clockView, type ClockRun } from './useMovingClocks'

const run = (beta: number, frame: ClockRun['frame'], tEnd: number): ClockRun => ({ beta, frame, tEnd })

describe('clock view', () => {
  it('Earth frame at 0.80c, t = 10 s: Earth reads 10 s, ship reads 6 s, at x = 8 ls', () => {
    const v = clockView(0.8, 'earth', 10)
    expect(v.earth.tau).toBeCloseTo(10, 12)
    expect(v.ship.tau).toBeCloseTo(6, 12)
    expect(v.ship.x).toBeCloseTo(8, 12)
  })

  it('ship frame at 0.80c, t = 10 s: the ship reads 10 s and the Earth clock 6 s', () => {
    const v = clockView(0.8, 'ship', 10)
    expect(v.ship.tau).toBeCloseTo(10, 12)
    expect(v.earth.tau).toBeCloseTo(6, 12)
    expect(v.earth.x).toBeCloseTo(-8, 12)
  })

  it('the moving observer’s "now" meets the resting clock at t / γ² (3.6 s at 0.80c)', () => {
    expect(clockView(0.8, 'earth', 10).otherNowMeetsHomeAt).toBeCloseTo(3.6, 12)
    expect(clockView(0.8, 'ship', 10).otherNowMeetsHomeAt).toBeCloseTo(3.6, 12)
  })

  it('at zero speed both clocks agree', () => {
    const v = clockView(0, 'earth', 7)
    expect(v.ship.tau).toBe(7)
    expect(v.otherNowMeetsHomeAt).toBe(7)
  })
})

describe('prediction observation tests', () => {
  it('textbook dilation needs a full Earth-frame run at 0.80c', () => {
    expect(observedTextbookDilation([run(0.8, 'earth', 10)])).toBe(true)
    expect(observedTextbookDilation([run(0.8, 'earth', 9)])).toBe(false)
    expect(observedTextbookDilation([run(0.79, 'earth', 10)])).toBe(false)
    expect(observedTextbookDilation([run(0.8, 'ship', 10)])).toBe(false)
    expect(textbookDilationHint([run(0.6, 'earth', 10)])).toMatch(/0\.80c/)
    expect(textbookDilationHint([run(0.8, 'ship', 4)])).toMatch(/Earth’s point of view/)
    expect(textbookDilationHint([])).toBeNull()
  })

  it('the ship frame needs a noticeable speed and enough time', () => {
    expect(observedShipFrame([run(0.6, 'ship', 3)])).toBe(true)
    expect(observedShipFrame([run(0.3, 'ship', 10)])).toBe(false)
    expect(observedShipFrame([run(0.9, 'ship', 2)])).toBe(false)
    expect(observedShipFrame([run(0.9, 'earth', 10)])).toBe(false)
    expect(shipFrameHint([run(0.3, 'ship', 10)])).toMatch(/at least 0\.50c/)
    expect(shipFrameHint([run(0.8, 'earth', 5)])).toMatch(/Switch/)
  })

  it('the invariant question needs the same speed seen from both frames', () => {
    expect(observedBothFrames([run(0.8, 'earth', 4), run(0.8, 'ship', 4)])).toBe(true)
    expect(observedBothFrames([run(0.8, 'earth', 4), run(0.6, 'ship', 4)])).toBe(false)
    expect(observedBothFrames([run(0, 'earth', 4), run(0, 'ship', 4)])).toBe(false)
    expect(bothFramesHint([run(0.8, 'earth', 4)])).toMatch(/to the ship/)
    expect(bothFramesHint([run(0.8, 'earth', 4), run(0.6, 'ship', 4)])).toMatch(/different speeds/)
  })

  it('every level adds at least one prediction, ids are unique, answers exist', () => {
    for (const level of LEVELS) expect(PREDICTIONS.some((p) => p.minLevel === level.id)).toBe(true)
    expect(new Set(PREDICTIONS.map((p) => p.id)).size).toBe(PREDICTIONS.length)
    for (const p of PREDICTIONS) expect(p.options.map((o) => o.id)).toContain(p.correct)
  })
})
