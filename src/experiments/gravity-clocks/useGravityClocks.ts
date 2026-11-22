/**
 * State for Experiment C: two clocks held at rest at different heights above
 * a mass (or a GPS satellite and a ground clock), running in time-lapse.
 * The physics lives in src/physics/gravity.ts.
 */

import { computed, ref, watch } from 'vue'
import {
  BODIES,
  GPS_ORBIT_RADIUS,
  SECONDS_PER_DAY,
  SPEED_OF_LIGHT,
  circularOrbitSpeed,
  gpsBreakdown,
  gravitationalFrequencyShift,
  properRadialDistance,
  relativeRate,
  schwarzschildRadius,
  staticClockDeficit,
  type Body,
} from '@/physics'
import { useAnimationFrame } from '@/composables/useAnimationFrame'

export type Mode = 'clocks' | 'gps'
export type BodyId = Body['id']
export type RunStatus = 'ready' | 'running' | 'paused' | 'finished'

/** Time-lapse speed: far-away days per real second. */
export const DAYS_PER_SECOND = 1
/** Length of a run in far-away days. */
export const RUN_DAYS = 365
export const SLIDER_STEPS = 1000

export function bodyById(id: BodyId): Body {
  return BODIES.find((b) => b.id === id) ?? (BODIES[0] as Body)
}

export function isBodyId(value: unknown): value is BodyId {
  return BODIES.some((b) => b.id === value)
}

/** Heights available on the logarithmic slider (m). Black holes have no surface, so no zero height. */
export function altitudeRange(body: Body): { min: number; max: number } {
  return { min: body.radius * (body.hasSurface ? 1e-8 : 1e-6), max: body.radius * 100 }
}

export function altitudeFromSlider(body: Body, position: number): number {
  const { min, max } = altitudeRange(body)
  if (position <= 0) return body.hasSurface ? 0 : min
  return min * (max / min) ** (Math.min(position, SLIDER_STEPS) / SLIDER_STEPS)
}

export function sliderFromAltitude(body: Body, h: number): number {
  const { min, max } = altitudeRange(body)
  if (h <= 0) return 0
  const p = Math.round((SLIDER_STEPS * Math.log(h / min)) / Math.log(max / min))
  return Math.min(SLIDER_STEPS, Math.max(body.hasSurface ? 1 : 0, p))
}

export function clampAltitude(body: Body, h: number): number {
  const { min, max } = altitudeRange(body)
  if (!Number.isFinite(h)) return body.hasSurface ? 0 : min
  if (body.hasSurface && h <= 0) return 0
  return Math.min(max, Math.max(min, h))
}

export interface Preset {
  readonly label: string
  readonly altitude: number
}

/** Interesting heights for each body. */
export function presets(body: Body): Preset[] {
  const rs = schwarzschildRadius(body.mass)
  switch (body.id) {
    case 'earth':
      return [
        { label: 'Sea level', altitude: 0 },
        { label: '33 cm', altitude: 0.33 },
        { label: 'Tower (22.5 m)', altitude: 22.5 },
        { label: 'Everest (8.8 km)', altitude: 8848 },
        { label: 'GPS height', altitude: GPS_ORBIT_RADIUS - body.radius },
        { label: 'Moon distance', altitude: 3.78e8 },
      ]
    case 'black-hole':
      return [
        { label: '0.001 r_s', altitude: 1e-3 * rs },
        { label: '0.01 r_s', altitude: 1e-2 * rs },
        { label: 'Photon sphere', altitude: 0.5 * rs },
        { label: '10 r_s', altitude: 9 * rs },
      ]
    default:
      return [
        { label: 'Surface', altitude: 0 },
        { label: '1 km', altitude: 1000 },
        { label: 'One radius up', altitude: body.radius },
        { label: 'Ten radii up', altitude: 9 * body.radius },
      ]
  }
}

export function defaultAltitudes(body: Body): [number, number] {
  const rs = schwarzschildRadius(body.mass)
  if (body.id === 'earth') return [0, 8848]
  if (!body.hasSurface) return [0.01 * rs, 9 * rs]
  return [0, body.radius]
}

/** What the predictions need to know about a run. */
export interface GravityRun {
  readonly mode: Mode
  readonly body: BodyId
  readonly altitudeA: number
  readonly altitudeB: number
  readonly correction: boolean
  /** Far-away days elapsed. */
  readonly tEnd: number
}

export function useGravityClocks(initial: { mode: Mode; body: BodyId; altitudeA?: number; altitudeB?: number; correction: boolean }) {
  const mode = ref<Mode>(initial.mode)
  const bodyId = ref<BodyId>(initial.body)
  const body = computed(() => bodyById(bodyId.value))
  const [defA, defB] = defaultAltitudes(body.value)
  const altitudeA = ref(clampAltitude(body.value, initial.altitudeA ?? defA))
  const altitudeB = ref(clampAltitude(body.value, initial.altitudeB ?? defB))
  const correction = ref(initial.correction)
  const status = ref<RunStatus>('ready')
  const t = ref(0)
  const history = ref<GravityRun[]>([])

  const running = computed(() => status.value === 'running')
  useAnimationFrame(running, (dt) => {
    t.value = Math.min(RUN_DAYS, t.value + dt * DAYS_PER_SECOND)
    if (t.value >= RUN_DAYS) status.value = 'finished'
  })

  const record = (): GravityRun => ({
    mode: mode.value,
    body: bodyId.value,
    altitudeA: altitudeA.value,
    altitudeB: altitudeB.value,
    correction: correction.value,
    tEnd: t.value,
  })

  function archive(run: GravityRun) {
    if (run.tEnd > 0) history.value = [...history.value, run]
  }

  function start() {
    if (status.value === 'ready' || status.value === 'paused') status.value = 'running'
  }

  function pause() {
    if (status.value === 'running') status.value = 'paused'
  }

  function reset() {
    archive(record())
    t.value = 0
    status.value = 'ready'
  }

  // A new body starts with that body's default heights.
  watch(bodyId, () => {
    const [a, b] = defaultAltitudes(body.value)
    altitudeA.value = a
    altitudeB.value = b
  })

  // Settings are locked while running; changing them afterwards starts a new
  // run, and the finished run is recorded with the settings it used.
  watch([mode, bodyId, altitudeA, altitudeB, correction], (_now, old) => {
    const [m, b, a, bb, c] = old
    archive({ mode: m, body: b, altitudeA: a, altitudeB: bb, correction: c, tEnd: t.value })
    t.value = 0
    status.value = 'ready'
  })

  // Two static clocks
  const rA = computed(() => body.value.radius + altitudeA.value)
  const rB = computed(() => body.value.radius + altitudeB.value)
  const deficitA = computed(() => staticClockDeficit(body.value.mass, rA.value))
  const deficitB = computed(() => staticClockDeficit(body.value.mass, rB.value))
  /** Fractional rate of B relative to A (positive: B faster). */
  const rateBvsA = computed(() => relativeRate(deficitA.value, deficitB.value))
  const elapsed = computed(() => {
    const far = t.value * SECONDS_PER_DAY
    return {
      far,
      a: far * (1 - deficitA.value),
      b: far * (1 - deficitB.value),
      /** How far B is ahead of A (s), computed from deficits to keep precision. */
      bAhead: far * (deficitA.value - deficitB.value),
    }
  })
  const signals = computed(() => ({
    /** Ticks sent up from A, as received at B: rate change. */
    upward: gravitationalFrequencyShift(body.value.mass, rA.value, rB.value),
    downward: gravitationalFrequencyShift(body.value.mass, rB.value, rA.value),
  }))
  const radialDistance = computed(() => {
    const [lo, hi] = rA.value <= rB.value ? [rA.value, rB.value] : [rB.value, rA.value]
    const proper = properRadialDistance(body.value.mass, lo, hi)
    return { coordinate: hi - lo, proper, extra: proper - (hi - lo) }
  })

  // GPS
  const earth = bodyById('earth')
  const gps = gpsBreakdown(earth.mass, earth.radius)
  const gpsSpeed = circularOrbitSpeed(earth.mass, GPS_ORBIT_RADIUS)
  const gpsState = computed(() => {
    const far = t.value * SECONDS_PER_DAY
    const offset = far * gps.net
    return { offset, positionError: correction.value ? 0 : offset * SPEED_OF_LIGHT }
  })

  const allRuns = computed<GravityRun[]>(() => [...history.value, record()])

  return {
    mode,
    bodyId,
    body,
    altitudeA,
    altitudeB,
    correction,
    status,
    t,
    deficitA,
    deficitB,
    rateBvsA,
    elapsed,
    signals,
    radialDistance,
    gps,
    gpsSpeed,
    gpsState,
    allRuns,
    start,
    pause,
    reset,
  }
}
