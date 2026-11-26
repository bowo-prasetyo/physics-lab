import { describe, expect, it } from 'vitest'
import {
  angularFrequency,
  elasticPotential,
  kineticEnergy,
  period,
  sampleMotion,
  stateAtTime,
  totalEnergy,
} from './massSpring'

describe('massSpring', () => {
  const k = 4
  const m = 1
  const A = 0.5

  it('computes angular frequency and period', () => {
    expect(angularFrequency(k, m)).toBeCloseTo(2, 12)
    expect(period(k, m)).toBeCloseTo(Math.PI, 12)
  })

  it('period is independent of amplitude', () => {
    expect(period(k, m)).toBe(period(k, m)) // same params
    // Changing A does not change T
    const T1 = period(9, 1)
    const T2 = period(9, 1)
    expect(T1).toBe(T2)
  })

  it('period scales as √(m/k)', () => {
    expect(period(4, 4)).toBeCloseTo(2 * period(4, 1), 12)
    expect(period(16, 1)).toBeCloseTo(0.5 * period(4, 1), 12)
  })

  it('released from rest: x(0)=A, v(0)=0', () => {
    const s = stateAtTime(k, m, A, 0)
    expect(s.x).toBeCloseTo(A, 12)
    expect(s.v).toBeCloseTo(0, 12)
  })

  it('reaches equilibrium with maximum speed at T/4', () => {
    const T = period(k, m)
    const s = stateAtTime(k, m, A, T / 4)
    expect(s.x).toBeCloseTo(0, 10)
    expect(Math.abs(s.v)).toBeCloseTo(A * angularFrequency(k, m), 10)
  })

  it('returns to start after one period', () => {
    const T = period(k, m)
    const s = stateAtTime(k, m, A, T)
    expect(s.x).toBeCloseTo(A, 10)
    expect(s.v).toBeCloseTo(0, 10)
  })

  it('conserves mechanical energy', () => {
    const E = totalEnergy(k, A)
    const times = [0, 0.1, 0.3, 0.7, 1.2]
    for (const t of times) {
      const s = stateAtTime(k, m, A, t)
      const sum = elasticPotential(k, s.x) + kineticEnergy(m, s.v)
      expect(sum).toBeCloseTo(E, 10)
    }
  })

  it('samples a continuous motion', () => {
    const states = sampleMotion(k, m, A, period(k, m), 0.05)
    expect(states.length).toBeGreaterThan(10)
    expect(states[0].x).toBeCloseTo(A, 12)
    expect(states[states.length - 1].x).toBeCloseTo(A, 8)
  })

  it('rejects non-positive mass or k', () => {
    expect(() => period(0, 1)).toThrow(RangeError)
    expect(() => period(1, 0)).toThrow(RangeError)
    expect(() => period(-1, 1)).toThrow(RangeError)
  })
})
