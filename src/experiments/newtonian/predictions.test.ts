import { describe, expect, it } from 'vitest'
import { observedForceComparison, observedMassComparison, type ForceRun } from './predictions'

const run = (force: number, mass: number): ForceRun => ({ force, mass, acceleration: force / mass })

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
})
