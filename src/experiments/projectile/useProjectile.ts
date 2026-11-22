/**
 * State for the projectile experiment. Each launch computes the whole flight
 * up front (src/physics/projectile.ts) and then animates along it, so what
 * students see does not depend on the frame rate.
 */

import { computed, ref, shallowRef, watch } from 'vue'
import { PLANETS, dragConstant, simulateFlight, stateAtTime, type LaunchParams, type Planet, type ProjectileState } from '@/physics'
import { useAnimationFrame } from '@/composables/useAnimationFrame'

export type PlanetId = Planet['id']
export type Frame = 'ground' | 'train'
export type Status = 'ready' | 'flying' | 'landed'

export const SPEED_RANGE = { min: 1, max: 50, step: 1 } as const
export const ANGLE_RANGE = { min: 0, max: 90, step: 1 } as const
export const HEIGHT_RANGE = { min: 0, max: 50, step: 1 } as const
export const TRAIN_RANGE = { min: -30, max: 30, step: 0.5 } as const
export const TIME_SCALES = [0.25, 1, 4] as const
/** Earlier flights kept on screen for comparison. */
export const HISTORY_SIZE = 4

export function planetById(id: PlanetId): Planet {
  return PLANETS.find((p) => p.id === id) ?? (PLANETS[0] as Planet)
}

export function isPlanetId(value: unknown): value is PlanetId {
  return PLANETS.some((p) => p.id === value)
}

/** Everything that describes one launch, for comparing flights and for the predictions. */
export interface Throw {
  readonly speed: number
  readonly angle: number
  readonly height: number
  readonly planet: PlanetId
  /** Air resistance actually applied (false on the Moon even if switched on). */
  readonly drag: boolean
  readonly frame: Frame
  readonly trainSpeed: number
  readonly companion: boolean
  /** True once the ball has landed. */
  readonly completed: boolean
  readonly range: number
  readonly flightTime: number
}

export interface Flight {
  readonly setup: Throw
  readonly states: readonly ProjectileState[]
}

export function useProjectile(initial: { speed: number; angle: number; height: number; planet: PlanetId; drag: boolean }) {
  const speed = ref(initial.speed)
  const angle = ref(initial.angle)
  const height = ref(initial.height)
  const planetId = ref<PlanetId>(initial.planet)
  const drag = ref(initial.drag)
  const frame = ref<Frame>('ground')
  const trainSpeed = ref(10)
  const companion = ref(false)
  const timeScale = ref<(typeof TIME_SCALES)[number]>(1)

  const planet = computed(() => planetById(planetId.value))
  const dragApplies = computed(() => drag.value && planet.value.airDensity > 0)
  const params = computed<LaunchParams>(() => ({
    speed: speed.value,
    angleDeg: angle.value,
    height: height.value,
    g: planet.value.g,
    k: dragApplies.value ? dragConstant(planet.value.airDensity) : 0,
  }))

  const status = ref<Status>('ready')
  const t = ref(0)
  const current = shallowRef<Flight | null>(null)
  const dropped = shallowRef<readonly ProjectileState[] | null>(null)
  const history = ref<Flight[]>([])
  const throws = ref<Throw[]>([])

  const setup = (states: readonly ProjectileState[], completed: boolean): Throw => {
    const end = states[states.length - 1] as ProjectileState
    return {
      speed: speed.value,
      angle: angle.value,
      height: height.value,
      planet: planetId.value,
      drag: dragApplies.value,
      frame: frame.value,
      trainSpeed: trainSpeed.value,
      companion: companion.value,
      completed,
      range: end.x,
      flightTime: end.t,
    }
  }

  /** Total animation length: until both balls have landed. */
  const endTime = computed(() => {
    const a = current.value?.states.at(-1)?.t ?? 0
    const b = dropped.value?.at(-1)?.t ?? 0
    return Math.max(a, b)
  })

  function launch() {
    if (current.value && status.value === 'landed') history.value = [...history.value, current.value].slice(-HISTORY_SIZE)
    const states = simulateFlight(params.value)
    current.value = { setup: setup(states, false), states }
    dropped.value = companion.value ? simulateFlight({ ...params.value, speed: 0, angleDeg: 0 }) : null
    t.value = 0
    status.value = endTime.value > 0 ? 'flying' : 'landed'
    if (status.value === 'landed') land()
  }

  function land() {
    status.value = 'landed'
    t.value = endTime.value
    if (current.value) {
      const done = { ...current.value, setup: { ...current.value.setup, completed: true } }
      current.value = done
      throws.value = [...throws.value, done.setup]
    }
  }

  const flying = computed(() => status.value === 'flying')
  useAnimationFrame(flying, (dt) => {
    t.value = Math.min(endTime.value, t.value + dt * timeScale.value)
    if (t.value >= endTime.value) land()
  })

  // Changing the setup after a landing prepares a new launch; the old flight
  // stays on screen as an earlier trace.
  watch([speed, angle, height, planetId, drag, frame, trainSpeed, companion], () => {
    if (status.value === 'landed' && current.value) {
      history.value = [...history.value, current.value].slice(-HISTORY_SIZE)
      current.value = null
      dropped.value = null
      t.value = 0
      status.value = 'ready'
    }
  })

  function clearHistory() {
    history.value = []
  }

  const ball = computed(() => (current.value ? stateAtTime(current.value.states, t.value) : null))
  const droppedBall = computed(() => (dropped.value ? stateAtTime(dropped.value, t.value) : null))
  /** The flight that will happen with the current settings (for the preview and readouts). */
  const preview = computed(() => simulateFlight(params.value))

  return {
    speed,
    angle,
    height,
    planetId,
    planet,
    drag,
    dragApplies,
    frame,
    trainSpeed,
    companion,
    timeScale,
    params,
    status,
    t,
    current,
    dropped,
    history,
    throws,
    ball,
    droppedBall,
    preview,
    launch,
    clearHistory,
  }
}
