import { describe, expect, it } from 'vitest'
import { LEVELS } from '@/levels'
import {
  OUR_ACCELERATION_TIME,
  PREDICTIONS,
  accelerationHint,
  ageHint,
  fasterThanLightHint,
  noCentreHint,
  observedAccelerationOnset,
  observedAge,
  observedBound,
  observedFasterThanLight,
  observedNoCentre,
  observedHubbleDiagram,
  observedEstimateSettles,
  estimateHint,
} from './predictions'
import { CENTRE_GALAXY, GALAXIES, stageAt, type SpaceRecord, type SpaceRun, type SpaceSnapshot } from './useEvolvingSpace'

const record = (runs: Partial<SpaceRun>[] = [], snapshots: Partial<SpaceSnapshot>[] = []): SpaceRecord => ({
  runs: runs.map((r) => ({ model: 'our', home: CENTRE_GALAXY, tStart: 13.8, tEnd: 13.8, ...r })),
  snapshots: snapshots.map((s) => ({ model: 'our', t: 13.8, target: 5, ...s })),
})

describe('observation tests', () => {
  it('no centre: a run of 2 Gyr or more with another galaxy as home', () => {
    expect(observedNoCentre(record([{ home: 0, tStart: 10, tEnd: 13 }]))).toBe(true)
    expect(observedNoCentre(record([{ tStart: 10, tEnd: 13 }]))).toBe(false)
    expect(observedNoCentre(record([{ home: 0, tStart: 13, tEnd: 14 }]))).toBe(false)
    expect(noCentreHint(record([{ tStart: 10, tEnd: 13 }]))).toMatch(/Click a galaxy/)
  })

  it('bound systems: a run through 5 Gyr or more, in either direction', () => {
    expect(observedBound(record([{ tStart: 13.8, tEnd: 8 }]))).toBe(true)
    expect(observedBound(record([{ tStart: 13.8, tEnd: 12 }]))).toBe(false)
  })

  it('faster than light: a distant galaxy at v ≥ c', () => {
    expect(observedFasterThanLight(record([], [{ target: 20 }]))).toBe(true)
    expect(observedFasterThanLight(record([], [{ target: 5 }]))).toBe(false)
    expect(observedFasterThanLight(record([], [{ t: 0, target: 40 }]))).toBe(false) // at the Big Bang nothing is valid
    expect(fasterThanLightHint(record([], [{ target: 5 }]))).toMatch(/20 billion/)
  })

  it('age: our universe looked at near the Big Bang', () => {
    expect(observedAge(record([], [{ t: 0 }]))).toBe(true)
    expect(observedAge(record([], [{ model: 'matter', t: 0 }]))).toBe(false)
    expect(ageHint(record([], [{ model: 'matter', t: 0 }]))).toMatch(/Our universe/)
  })

  it('acceleration: our universe run through the switch-over (about 7.7 Gyr after the Big Bang)', () => {
    expect(OUR_ACCELERATION_TIME).toBeCloseTo(7.7, 0)
    expect(observedAccelerationOnset(record([{ tStart: 13.8, tEnd: 4 }]))).toBe(true)
    expect(observedAccelerationOnset(record([{ tStart: 9, tEnd: 13.8 }]))).toBe(false)
    expect(observedAccelerationOnset(record([{ model: 'matter', tStart: 1, tEnd: 9 }]))).toBe(false)
    expect(accelerationHint(record([{ tStart: 9, tEnd: 13.8 }]))).toMatch(/middle/)
  })

  it('every level adds at least one prediction, ids are unique, answers exist', () => {
    for (const level of LEVELS) expect(PREDICTIONS.some((p) => p.minLevel === level.id)).toBe(true)
    expect(new Set(PREDICTIONS.map((p) => p.id)).size).toBe(PREDICTIONS.length)
    for (const p of PREDICTIONS) expect(p.options.map((o) => o.id)).toContain(p.correct)
  })
})

describe('model universe layout', () => {
  it('has the home galaxy exactly at the centre', () => {
    const centre = GALAXIES[CENTRE_GALAXY]
    expect(centre?.x).toBe(0)
    expect(centre?.y).toBe(0)
  })

  it('labels the stages of cosmic history by scale factor', () => {
    expect(stageAt(1e-9)).toBe('breakdown')
    expect(stageAt(1e-4)).toBe('plasma')
    expect(stageAt(1 / 1100)).toBe('first-light')
    expect(stageAt(0.01)).toBe('dark-ages')
    expect(stageAt(1)).toBe('galaxies')
  })
})

describe('Hubble diagram predictions', () => {
  const withCounts = (hubbleCounts: number[]): SpaceRecord => ({ runs: [], snapshots: [], hubbleCounts })
  it('the diagram question needs at least 16 galaxies', () => {
    expect(observedHubbleDiagram(withCounts([8]))).toBe(false)
    expect(observedHubbleDiagram(withCounts([8, 16]))).toBe(true)
    expect(observedHubbleDiagram({ runs: [], snapshots: [] })).toBe(false)
  })
  it('the estimate question needs a fit with 8 galaxies and one with all 32', () => {
    expect(observedEstimateSettles(withCounts([8, 16, 24, 32]))).toBe(true)
    expect(observedEstimateSettles(withCounts([16, 24, 32]))).toBe(false)
    expect(estimateHint(withCounts([32]))).toMatch(/Start again/)
  })
})

describe('the breakdown prediction', () => {
  it('needs a look at a Big Bang model below a = 10⁻⁶; a model without a Big Bang does not count', async () => {
    const { observedBreakdown } = await import('./predictions')
    expect(observedBreakdown(record([], [{ model: 'our', t: 0 }]))).toBe(true)
    expect(observedBreakdown(record([], [{ model: 'our', t: 13.8 }]))).toBe(false)
    expect(observedBreakdown(record([], [{ model: 'lambda', t: -20 }]))).toBe(false)
  })
})
