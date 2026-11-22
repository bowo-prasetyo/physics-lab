/**
 * State for the pendulum-clock experiment. The pendulum is integrated live
 * with Störmer–Verlet steps (src/physics/pendulum.ts); its period is measured
 * the way a student would: the time between successive passes through the
 * bottom of the swing in the same direction.
 */

import { computed, ref, shallowRef, watch } from 'vue'
import { PLANETS, advancePendulum, exactPeriod, smallAnglePeriod, type PendulumState, type Planet } from '@/physics'
import { useAnimationFrame } from '@/composables/useAnimationFrame'

export type PlanetId = Planet['id']

export const LENGTH_RANGE = { min: 0.1, max: 2.5, step: 0.05 } as const
export const AMPLITUDE_RANGE = { min: 1, max: 170, step: 1 } as const
export const MASS_RANGE = { min: 0.1, max: 10, step: 0.1 } as const
export const TIME_SCALES = [0.25, 1, 4] as const
/** Seconds of simulated time between stored samples for the graphs. */
const SAMPLE_EVERY = 0.03
const MAX_SAMPLES = 2000
const EARTH_G = (PLANETS.find((p) => p.id === 'earth') as Planet).g

export function planetById(id: PlanetId): Planet {
  return PLANETS.find((p) => p.id === id) ?? (PLANETS[0] as Planet)
}

export function isPlanetId(value: unknown): value is PlanetId {
  return PLANETS.some((p) => p.id === value)
}

/** A period the student measured, with the settings it was measured at. */
export interface PeriodMeasurement {
  readonly length: number
  readonly mass: number
  readonly amplitude: number
  readonly planet: PlanetId
  readonly period: number
}

const deg = (d: number) => (d * Math.PI) / 180

export function usePendulum(initial: { length: number; amplitude: number; mass: number; planet: PlanetId }) {
  const length = ref(initial.length)
  const amplitude = ref(initial.amplitude)
  const mass = ref(initial.mass)
  const planetId = ref<PlanetId>(initial.planet)
  const timeScale = ref<(typeof TIME_SCALES)[number]>(1)
  const running = ref(false)

  const planet = computed(() => planetById(planetId.value))
  const release = (): PendulumState => ({ t: 0, theta: deg(amplitude.value), omega: 0 })

  const state = shallowRef<PendulumState>(release())
  const samples = shallowRef<PendulumState[]>([release()])
  const lastCrossing = ref<number | null>(null)
  const swings = ref(0)
  const lastPeriod = ref<number | null>(null)
  const measurements = ref<PeriodMeasurement[]>([])

  function reset() {
    running.value = false
    state.value = release()
    samples.value = [state.value]
    lastCrossing.value = null
    swings.value = 0
    lastPeriod.value = null
  }

  // A new setup starts a fresh swing from rest; earlier measurements are kept.
  watch([length, amplitude, mass, planetId], reset)

  useAnimationFrame(running, (dt) => {
    const { state: next, crossings } = advancePendulum(state.value, length.value, planet.value.g, dt * timeScale.value)
    for (const c of crossings) {
      if (lastCrossing.value !== null) {
        const period = c - lastCrossing.value
        lastPeriod.value = period
        swings.value += 1
        measurements.value = [
          ...measurements.value.slice(-199),
          { length: length.value, mass: mass.value, amplitude: amplitude.value, planet: planetId.value, period },
        ]
      }
      lastCrossing.value = c
    }
    state.value = next
    const last = samples.value[samples.value.length - 1] as PendulumState
    if (next.t - last.t >= SAMPLE_EVERY) samples.value = [...samples.value.slice(-(MAX_SAMPLES - 1)), next]
  })

  const smallAngle = computed(() => smallAnglePeriod(length.value, planet.value.g))
  const exact = computed(() => exactPeriod(length.value, planet.value.g, deg(amplitude.value)))

  /**
   * A pendulum clock adjusted on the Earth with small swings: it counts each
   * swing as T₀(Earth) seconds. Here its swings last `exact` seconds, so it
   * shows T₀(Earth)/T of the true time.
   */
  const clock = computed(() => {
    const rate = smallAnglePeriod(length.value, EARTH_G) / exact.value
    return { atomic: state.value.t, pendulum: state.value.t * rate, rate, driftPerDay: (rate - 1) * 86_400 }
  })

  return {
    length,
    amplitude,
    mass,
    planetId,
    planet,
    timeScale,
    running,
    state,
    samples,
    swings,
    lastPeriod,
    measurements,
    smallAngle,
    exact,
    clock,
    reset,
  }
}
