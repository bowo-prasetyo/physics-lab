import { describe, expect, it } from 'vitest'
import { LEVELS } from '@/levels'
import { BODIES, schwarzschildRadius } from '@/physics'
import {
  PREDICTIONS,
  gpsHint,
  mountainHint,
  nearHorizonHint,
  observedGps,
  observedMountain,
  observedNearHorizon,
  observedSignals,
  observedUncorrectedGps,
  uncorrectedGpsHint,
} from './predictions'
import { altitudeFromSlider, bodyById, clampAltitude, sliderFromAltitude, type GravityRun } from './useGravityClocks'
import { formatDuration, formatLength, formatNumber, formatSlowdown } from './format'

const run = (over: Partial<GravityRun>): GravityRun => ({
  mode: 'clocks',
  body: 'earth',
  altitudeA: 0,
  altitudeB: 8848,
  correction: true,
  tEnd: 2,
  ...over,
})
const rs = schwarzschildRadius(bodyById('black-hole').mass)

describe('observation tests', () => {
  it('mountain: Earth clocks at least 1 km apart, for a day or more', () => {
    expect(observedMountain([run({})])).toBe(true)
    expect(observedMountain([run({ altitudeB: 22.5 })])).toBe(false)
    expect(observedMountain([run({ tEnd: 0.5 })])).toBe(false)
    expect(observedMountain([run({ body: 'sun' })])).toBe(false)
    expect(mountainHint([run({ tEnd: 0.5 })])).toMatch(/one day/)
    expect(mountainHint([run({ altitudeB: 22.5 })])).toMatch(/Everest/)
  })

  it('GPS: any GPS run of a day; uncorrected needs the correction off', () => {
    expect(observedGps([run({ mode: 'gps' })])).toBe(true)
    expect(observedGps([run({})])).toBe(false)
    expect(gpsHint([run({})])).toMatch(/GPS satellite/)
    expect(observedUncorrectedGps([run({ mode: 'gps' })])).toBe(false)
    expect(observedUncorrectedGps([run({ mode: 'gps', correction: false })])).toBe(true)
    expect(uncorrectedGpsHint([run({ mode: 'gps' })])).toMatch(/correction was on/)
  })

  it('horizon: a black-hole clock within 0.01 r_s', () => {
    expect(observedNearHorizon([run({ body: 'black-hole', altitudeA: 0.01 * rs, altitudeB: 9 * rs })])).toBe(true)
    expect(observedNearHorizon([run({ body: 'black-hole', altitudeA: 0.5 * rs, altitudeB: 9 * rs })])).toBe(false)
    expect(nearHorizonHint([run({ body: 'black-hole', altitudeA: 0.5 * rs })])).toMatch(/closer/)
  })

  it('signals: any two clocks at different heights', () => {
    expect(observedSignals([run({ body: 'neutron-star', altitudeA: 0, altitudeB: 1000 })])).toBe(true)
    expect(observedSignals([run({ altitudeA: 5, altitudeB: 5 })])).toBe(false)
  })

  it('every level adds at least one prediction, ids are unique, answers exist', () => {
    for (const level of LEVELS) expect(PREDICTIONS.some((p) => p.minLevel === level.id)).toBe(true)
    expect(new Set(PREDICTIONS.map((p) => p.id)).size).toBe(PREDICTIONS.length)
    for (const p of PREDICTIONS) expect(p.options.map((o) => o.id)).toContain(p.correct)
  })
})

describe('height slider', () => {
  it('round-trips heights within one slider step, and keeps exact zero on surfaces', () => {
    for (const body of BODIES) {
      for (const p of [0, 1, 250, 500, 999, 1000]) {
        const h = altitudeFromSlider(body, p)
        expect(sliderFromAltitude(body, h)).toBe(body.hasSurface || p > 0 ? p : 0)
      }
    }
    expect(altitudeFromSlider(bodyById('earth'), 0)).toBe(0)
    expect(altitudeFromSlider(bodyById('black-hole'), 0)).toBeGreaterThan(0)
  })

  it('clamps heights from links into the slider range', () => {
    expect(clampAltitude(bodyById('earth'), -5)).toBe(0)
    expect(clampAltitude(bodyById('earth'), 1e20)).toBe(100 * bodyById('earth').radius)
    expect(clampAltitude(bodyById('black-hole'), 0)).toBeGreaterThan(0)
    expect(clampAltitude(bodyById('earth'), Number.NaN)).toBe(0)
  })
})

describe('formatting', () => {
  it('picks readable units', () => {
    expect(formatDuration(83.4e-9)).toBe('83.4 ns')
    expect(formatDuration(38.5e-6)).toBe('38.5 μs')
    expect(formatDuration(3 * 86400)).toBe('3 days')
    expect(formatDuration(0)).toBe('0 s')
    expect(formatDuration(10_700)).toBe('2.97 h')
    expect(formatLength(0.33)).toBe('33 cm')
    expect(formatLength(8848)).toBe('8.85 km')
    expect(formatLength(2.019e7)).toBe('20,190 km')
    expect(formatNumber(6.96e-10)).toBe('6.96 × 10⁻¹⁰')
    expect(formatSlowdown(0.9123)).toBe('91.2%')
    expect(formatSlowdown(6.96e-10)).toBe('6.96 × 10⁻¹⁰')
  })
})
