import { describe, expect, it } from 'vitest'
import { EARTH_GM, EARTH_RADIUS, launchOrbit } from '@/physics'
import { PREDICTIONS, observedCircle, observedEnergyTrade, observedEscape, observedFasterEllipse, observedKepler, type LaunchRun } from './predictions'

/** A run as the page records it, from the real engine. */
const run = (radius: number, speedFactor: number): LaunchRun => {
  const orbit = launchOrbit({ gm: EARTH_GM, planetRadius: EARTH_RADIUS, radius: radius * EARTH_RADIUS, speedFactor })
  return { radius, speedFactor, outcome: orbit.outcome, period: orbit.period }
}

describe('circular-orbit predictions', () => {
  it('unlock only after the launch that tests them', () => {
    expect(observedCircle([run(2, 0.9)])).toBe(false)
    expect(observedCircle([run(2, 1)])).toBe(true)
    expect(observedFasterEllipse([run(2, 1.01)])).toBe(false)
    expect(observedFasterEllipse([run(2, 1.5)])).toBe(false) // an escape is not an ellipse
    expect(observedFasterEllipse([run(2, 1.2)])).toBe(true)
    expect(observedKepler([run(2, 1), run(2.5, 1)])).toBe(false)
    expect(observedKepler([run(2, 1), run(4, 1)])).toBe(true)
    expect(observedEscape([run(2, 1.45)])).toBe(false) // needs a bound launch near the threshold too
    expect(observedEscape([run(2, 1.45), run(2, 1.3)])).toBe(true)
    expect(observedEnergyTrade([run(2, 1), run(2, 1.5)])).toBe(false) // a circle and an escape have no farthest-and-closest trade
    expect(observedEnergyTrade([run(2, 1.2)])).toBe(true)
  })

  it('are all reachable with the page’s controls (radius 1.1–6 R⊕, speed 0.6–1.5 ×)', () => {
    const reachable = [run(2, 1), run(2, 1.2), run(4, 1), run(2, 1.5), run(2, 1.3)]
    for (const p of PREDICTIONS) expect(p.observed(reachable), p.id).toBe(true)
  })

  it('nudge a learner whose launch missed the test', () => {
    const faster = PREDICTIONS.find((p) => p.id === 'faster')!
    expect(faster.hint!([run(2, 1.5)])).toContain('escape')
    expect(faster.hint!([run(2, 1.2)])).toBeNull()
  })

  it('add questions with the level: two at Beginner, five at Advanced', () => {
    expect(PREDICTIONS.filter((p) => p.minLevel === 'beginner')).toHaveLength(2)
    expect(PREDICTIONS.map((p) => p.minLevel)).toEqual(['beginner', 'beginner', 'intermediate', 'intermediate', 'advanced'])
  })
})
