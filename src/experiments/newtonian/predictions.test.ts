import { describe, expect, it } from 'vitest'
import { observedDoubledTime, observedEqualRatio, observedForceComparison, observedMassComparison, PREDICTIONS, type ForceRun } from './predictions'
import { accelerationFromNetForce, displacementFromRest } from '@/physics/newtonian'

const run = (force: number, mass: number, time = 3): ForceRun => ({
  force, mass, time,
  acceleration: accelerationFromNetForce(force, mass),
  displacement: displacementFromRest(force, mass, time),
})
const hint = (id: string, runs: readonly ForceRun[]) => PREDICTIONS.find((p) => p.id === id)!.hint!(runs)

describe('Newtonian prediction gates', () => {
  it('requires equal force and different masses for the mass comparison', () => {
    expect(observedMassComparison([run(20, 2)])).toBe(false)
    expect(observedMassComparison([run(20, 2), run(20, 4)])).toBe(true)
    expect(observedMassComparison([run(20, 2), run(40, 4)])).toBe(false)
  })

  it('requires equal mass and different forces for the force comparison', () => {
    expect(observedForceComparison([run(20, 2)])).toBe(false)
    expect(observedForceComparison([run(20, 2), run(40, 2)])).toBe(true)
    expect(observedForceComparison([run(20, 2), run(40, 4)])).toBe(false)
  })

  it('requires different forces and masses with an equal ratio for the ratio comparison', () => {
    expect(observedEqualRatio([run(20, 2)])).toBe(false)
    expect(observedEqualRatio([run(20, 2), run(40, 4)])).toBe(true)
    expect(observedEqualRatio([run(20, 2), run(30, 4)])).toBe(false)
    expect(observedEqualRatio([run(20, 2), run(20, 2)])).toBe(false)
    expect(hint('ratio', [run(20, 2), run(30, 4)])).toMatch(/not by the same factor/)
    expect(hint('ratio', [run(20, 2), run(40, 4)])).toBeNull()
  })

  it('requires the same force and mass with one time twice the other for the time comparison', () => {
    expect(observedDoubledTime([run(20, 2, 2)])).toBe(false)
    expect(observedDoubledTime([run(20, 2, 2), run(20, 2, 4)])).toBe(true)
    expect(observedDoubledTime([run(20, 2, 4), run(20, 2, 2)])).toBe(true)
    expect(observedDoubledTime([run(20, 2, 2), run(20, 2, 3)])).toBe(false)
    expect(observedDoubledTime([run(20, 2, 2), run(40, 2, 4)])).toBe(false)
    expect(hint('time-squared', [run(20, 2, 2), run(20, 2, 3)])).toMatch(/1 : 2/)
  })

  it('has answers that the physics engine confirms', () => {
    const correct = (id: string) => PREDICTIONS.find((p) => p.id === id)!.correct
    // Equal force-to-mass ratios give equal accelerations.
    expect(accelerationFromNetForce(20, 2)).toBeCloseTo(accelerationFromNetForce(40, 4), 12)
    expect(correct('ratio')).toBe('same')
    // Doubling the time from rest quadruples the displacement.
    expect(displacementFromRest(20, 2, 4) / displacementFromRest(20, 2, 2)).toBeCloseTo(4, 12)
    expect(correct('time-squared')).toBe('four')
  })

  it('adds a question at every level', () => {
    expect(new Set(PREDICTIONS.map((p) => p.minLevel))).toEqual(new Set(['beginner', 'intermediate', 'advanced']))
  })
})
