/**
 * State for “Evolving space”: a model universe run forwards or backwards in time,
 * with a grid of galaxies whose separations scale with a(t).
 * The physics lives in src/physics/cosmology.ts.
 */

import { computed, ref, watch } from 'vue'
import {
  COSMOLOGIES,
  accelerationOnset,
  cmbTemperature,
  deceleration,
  hubbleRate,
  recessionSpeed,
  redshift,
  solveExpansion,
  toKmSMpc,
  type Cosmology,
} from '@/physics'
import { useAnimationFrame } from '@/composables/useAnimationFrame'

export type ModelId = Cosmology['id']
/** Billions of years of cosmic time per second of real time. */
export const SPEED_GYR_PER_SECOND = 2
/** Before this scale factor the classical model is not trustworthy and readouts are suppressed. */
export const A_BREAKDOWN = 1e-6
/** Recombination: the universe becomes transparent (the CMB is released). */
export const A_FIRST_LIGHT = 1 / 1100
/** Roughly when the first galaxies formed. */
export const A_FIRST_GALAXIES = 0.08

export function cosmologyById(id: ModelId): Cosmology {
  return COSMOLOGIES.find((c) => c.id === id) ?? (COSMOLOGIES[0] as Cosmology)
}

export function isModelId(value: unknown): value is ModelId {
  return COSMOLOGIES.some((c) => c.id === value)
}

export type Stage = 'breakdown' | 'plasma' | 'first-light' | 'dark-ages' | 'galaxies'

export function stageAt(a: number): Stage {
  if (a < A_BREAKDOWN) return 'breakdown'
  if (a < 0.95 * A_FIRST_LIGHT) return 'plasma'
  if (a <= 1.05 * A_FIRST_LIGHT) return 'first-light'
  if (a < A_FIRST_GALAXIES) return 'dark-ages'
  return 'galaxies'
}

/** A grid of galaxies with fixed comoving positions (Gly, measured today). */
export interface Galaxy {
  readonly id: number
  readonly x: number
  readonly y: number
}

export const GRID_COLUMNS = 9
export const GRID_ROWS = 7
export const GRID_SPACING = 1.5 // Gly today

/** Small deterministic offsets so the grid looks natural but is reproducible. */
function jitter(i: number): number {
  const s = Math.sin(i * 12.9898) * 43758.5453
  return (s - Math.floor(s) - 0.5) * 0.5
}

export const GALAXIES: readonly Galaxy[] = Array.from({ length: GRID_COLUMNS * GRID_ROWS }, (_, i) => {
  const col = i % GRID_COLUMNS
  const row = Math.floor(i / GRID_COLUMNS)
  const centreCol = (GRID_COLUMNS - 1) / 2
  const centreRow = (GRID_ROWS - 1) / 2
  const isCentre = col === centreCol && row === centreRow
  return {
    id: i,
    x: (col - centreCol + (isCentre ? 0 : jitter(i))) * GRID_SPACING,
    y: (row - centreRow + (isCentre ? 0 : jitter(i + 101))) * GRID_SPACING,
  }
})

/** Index of the galaxy at the middle of the grid: "us" to begin with. */
export const CENTRE_GALAXY = Math.floor((GRID_COLUMNS * GRID_ROWS) / 2)

/** A stretch of time the student ran the model through, for the predictions. */
export interface SpaceRun {
  readonly model: ModelId
  readonly home: number
  readonly tStart: number
  readonly tEnd: number
}

/** A moment the student looked at, for the predictions. */
export interface SpaceSnapshot {
  readonly model: ModelId
  readonly t: number
  /** Distance today (Gly) of the galaxy in the distance readout. */
  readonly target: number
}

export interface SpaceRecord {
  readonly runs: readonly SpaceRun[]
  readonly snapshots: readonly SpaceSnapshot[]
  /** How many galaxies were in the Hubble diagram after each observation. */
  readonly hubbleCounts?: readonly number[]
}

/** Galaxies added to the Hubble diagram by one observation, and the most it holds. */
export const HUBBLE_BATCH = 8
export const HUBBLE_MAX = 32

export const TARGET_RANGE = { min: 0.5, max: 40, step: 0.5 } as const

export function useEvolvingSpace(initial: { model: ModelId; t?: number; target: number }) {
  const model = ref<ModelId>(initial.model)
  const cosmology = computed(() => cosmologyById(model.value))
  const expansion = computed(() => solveExpansion(cosmology.value))
  const clampT = (t: number) => Math.min(expansion.value.tMax, Math.max(expansion.value.tMin, t))

  const t = ref(clampT(initial.t ?? expansion.value.tToday))
  const direction = ref<1 | -1>(1)
  const running = ref(false)
  const home = ref(CENTRE_GALAXY)
  const target = ref(initial.target)
  const runs = ref<SpaceRun[]>([])
  const snapshots = ref<SpaceSnapshot[]>([])
  /** Galaxies observed so far for the Hubble diagram, and the count after each observation. */
  const galaxiesObserved = ref(0)
  const hubbleCounts = ref<number[]>([])
  let runStart = t.value

  const snapshot = () => {
    snapshots.value = [...snapshots.value.slice(-199), { model: model.value, t: t.value, target: target.value }]
  }

  function stop() {
    if (!running.value) return
    running.value = false
    runs.value = [...runs.value, { model: model.value, home: home.value, tStart: runStart, tEnd: t.value }]
    snapshot()
  }

  function run(dir: 1 | -1) {
    if (running.value) stop()
    direction.value = dir
    runStart = t.value
    running.value = true
  }

  useAnimationFrame(running, (dt) => {
    const next = clampT(t.value + direction.value * SPEED_GYR_PER_SECOND * dt)
    const atEnd = next === t.value || next === expansion.value.tMin || next === expansion.value.tMax
    t.value = next
    if (atEnd) stop()
  })

  /** Jump to a moment (from the slider or a preset). Stops any run first. */
  function setTime(value: number) {
    stop()
    t.value = clampT(value)
    snapshot()
  }

  function observeGalaxies() {
    galaxiesObserved.value = Math.min(HUBBLE_MAX, galaxiesObserved.value + HUBBLE_BATCH)
    hubbleCounts.value = [...hubbleCounts.value, galaxiesObserved.value]
  }

  function clearGalaxies() {
    galaxiesObserved.value = 0
  }

  function setHome(id: number) {
    stop()
    home.value = id
  }

  watch(model, () => {
    stop()
    t.value = expansion.value.tToday
  })

  watch(target, snapshot)

  const a = computed(() => expansion.value.scaleFactorAt(t.value))
  const valid = computed(() => a.value >= A_BREAKDOWN)
  const hubble = computed(() => (valid.value ? hubbleRate(cosmology.value, a.value) : Infinity))
  const readings = computed(() => {
    const c = cosmology.value
    return {
      a: a.value,
      stage: stageAt(a.value),
      hubbleKmSMpc: valid.value ? toKmSMpc(hubble.value) : null,
      hubbleDistance: valid.value ? 1 / hubble.value : null,
      q: valid.value ? deceleration(c, a.value) : null,
      redshift: t.value < expansion.value.tToday && valid.value ? redshift(a.value) : null,
      temperature: valid.value ? cmbTemperature(a.value) : null,
      targetDistance: a.value * target.value,
      targetSpeed: valid.value ? recessionSpeed(c, a.value, target.value) : null,
    }
  })

  /** When our universe started speeding up (time coordinate), if it does. */
  const accelerationTime = computed(() => {
    const onset = accelerationOnset(cosmology.value)
    return onset === null ? null : expansion.value.timeAt(onset)
  })

  const record = computed<SpaceRecord>(() => ({ runs: runs.value, snapshots: snapshots.value, hubbleCounts: hubbleCounts.value }))

  return {
    model,
    cosmology,
    expansion,
    t,
    direction,
    running,
    home,
    target,
    readings,
    accelerationTime,
    record,
    run,
    stop,
    setTime,
    setHome,
    galaxiesObserved,
    observeGalaxies,
    clearGalaxies,
  }
}
