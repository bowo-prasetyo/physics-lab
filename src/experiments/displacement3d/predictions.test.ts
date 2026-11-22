import { describe, expect, it } from 'vitest'
import { LEVELS } from '@/levels'
import { STANDARD_FRAME, vec3, type Vec3 } from '@/physics'
import {
  PREDICTIONS,
  diagonalHint,
  observedDiagonal,
  observedRotation,
  observedRoundTrip,
  observedShift,
  observedTriangle,
  rotationHint,
  roundTripHint,
  shiftHint,
} from './predictions'
import { PRESETS, type JourneySnapshot } from './useDisplacement3D'

const snap = (over: Partial<JourneySnapshot> & { displacement?: Vec3 }): JourneySnapshot => ({
  moves: 3,
  displacement: vec3(3, 4, 0),
  distance: 7,
  frame: STANDARD_FRAME,
  ...over,
})

describe('observation tests', () => {
  it('round trip: three or more moves, back at the start', () => {
    expect(observedRoundTrip([snap({ moves: 4, displacement: vec3(), distance: 14 })])).toBe(true)
    expect(observedRoundTrip([snap({ moves: 2, displacement: vec3(), distance: 6 })])).toBe(false)
    expect(observedRoundTrip([snap({})])).toBe(false)
    expect(roundTripHint([snap({})])).toMatch(/Round trip/)
  })

  it('diagonal: components 3, 4 and 12 in any order or sign', () => {
    expect(observedDiagonal([snap({ displacement: vec3(3, 4, 12) })])).toBe(true)
    expect(observedDiagonal([snap({ displacement: vec3(-12, 3, -4) })])).toBe(true)
    expect(observedDiagonal([snap({ displacement: vec3(3, 4, 11) })])).toBe(false)
    expect(diagonalHint([snap({})])).toMatch(/12 m along z/)
  })

  it('shift and rotation need a non-zero displacement seen in the changed frame', () => {
    const moved = { ...STANDARD_FRAME, origin: vec3(2, 0, 0) }
    const turned = { ...STANDARD_FRAME, yawDeg: 30 }
    expect(observedShift([snap({ frame: moved })])).toBe(true)
    expect(observedShift([snap({ frame: moved, displacement: vec3() })])).toBe(false)
    expect(observedRotation([snap({ frame: turned })])).toBe(true)
    expect(observedRotation([snap({ frame: moved })])).toBe(false)
    expect(shiftHint([snap({ frame: moved, displacement: vec3() })])).toMatch(/Make a journey/)
    expect(rotationHint([snap({})])).toMatch(/turn the second/)
  })

  it('triangle: two or more moves with distance clearly above |Δr|', () => {
    expect(observedTriangle([snap({ moves: 2, displacement: vec3(3, 4, 0), distance: 7 })])).toBe(true)
    expect(observedTriangle([snap({ moves: 2, displacement: vec3(7, 0, 0), distance: 7 })])).toBe(false)
  })

  it('the presets are what their names say', () => {
    const [round, diagonal] = PRESETS
    expect(observedRoundTrip([snap({ moves: (round?.points.length ?? 0) - 1, displacement: vec3(), distance: 1 })])).toBe(true)
    const end = diagonal?.points.at(-1)
    expect(end).toEqual(vec3(3, 4, 12))
  })

  it('every level adds at least one prediction, ids are unique, answers exist', () => {
    for (const level of LEVELS) expect(PREDICTIONS.some((p) => p.minLevel === level.id)).toBe(true)
    expect(new Set(PREDICTIONS.map((p) => p.id)).size).toBe(PREDICTIONS.length)
    for (const p of PREDICTIONS) expect(p.options.map((o) => o.id)).toContain(p.correct)
  })
})
