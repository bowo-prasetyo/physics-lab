/**
 * State and controls for “Different clocks”: an Earth clock and a ship clock that
 * pass each other at t = 0 (both reading 0), compared from either frame.
 *
 * The physics lives in src/physics/spacetime.ts; this composable only keeps
 * the experiment's settings and clock, and records runs for the predictions.
 */

import { computed, ref, watch } from 'vue'
import { gamma, inertialClockAt, simultaneousTimeAt, velocityInFrame, type ClockReading } from '@/physics'
import { useAnimationFrame } from '@/composables/useAnimationFrame'

/** Coordinate time shown per run, in the chosen frame (s). */
export const DURATION = 10
export const BETA_RANGE = { min: 0, max: 0.99, step: 0.01 } as const

export type Frame = 'earth' | 'ship'
export type RunStatus = 'ready' | 'running' | 'paused' | 'finished'

/** What the predictions need to know about a run. */
export interface ClockRun {
  /** Ship speed relative to Earth, as a fraction of c. */
  readonly beta: number
  /** Whose frame the run was viewed from. */
  readonly frame: Frame
  /** Coordinate time reached in that frame (s). */
  readonly tEnd: number
}

export interface ClockView {
  readonly earth: ClockReading
  readonly ship: ClockReading
  /** Velocity of the Earth clock and of the ship clock in the chosen frame. */
  readonly earthVelocity: number
  readonly shipVelocity: number
  /**
   * The moving clock's "now": the event on the resting clock's worldline
   * (x = 0) that the moving observer regards as simultaneous with their
   * current reading, and what the resting clock reads there.
   */
  readonly otherNowMeetsHomeAt: number
}

/** Readings of both clocks at coordinate time t in the given frame. */
export function clockView(beta: number, frame: Frame, t: number): ClockView {
  const earthVelocity = frame === 'earth' ? 0 : velocityInFrame(0, beta)
  const shipVelocity = frame === 'earth' ? beta : 0
  const earth = inertialClockAt(earthVelocity, t)
  const ship = inertialClockAt(shipVelocity, t)
  const moving = frame === 'earth' ? ship : earth
  const movingVelocity = frame === 'earth' ? shipVelocity : earthVelocity
  // The resting clock sits at x = 0 and reads its coordinate time.
  const otherNowMeetsHomeAt = simultaneousTimeAt(movingVelocity, moving, 0)
  return { earth, ship, earthVelocity, shipVelocity, otherNowMeetsHomeAt }
}

export function useMovingClocks(initial: { beta: number; frame: Frame }) {
  const beta = ref(initial.beta)
  const frame = ref<Frame>(initial.frame)
  const status = ref<RunStatus>('ready')
  const t = ref(0)
  const history = ref<ClockRun[]>([])

  const running = computed(() => status.value === 'running')
  const view = computed(() => clockView(beta.value, frame.value, t.value))
  const lorentz = computed(() => gamma(beta.value))

  useAnimationFrame(running, (dt) => {
    t.value = Math.min(DURATION, t.value + dt)
    if (t.value >= DURATION) status.value = 'finished'
  })

  function start() {
    if (status.value === 'ready' || status.value === 'paused') status.value = 'running'
  }

  function pause() {
    if (status.value === 'running') status.value = 'paused'
  }

  /** Back to t = 0. A run that had started is kept for the predictions. */
  function reset() {
    if (t.value > 0) history.value = [...history.value, { beta: beta.value, frame: frame.value, tEnd: t.value }]
    t.value = 0
    status.value = 'ready'
  }

  // Speed and frame are locked while the clock runs (the controls are
  // disabled). Changing either afterwards starts a fresh run; the run just
  // finished is recorded with the settings it actually used.
  watch([beta, frame], (_now, [oldBeta, oldFrame]) => {
    if (t.value > 0) history.value = [...history.value, { beta: oldBeta, frame: oldFrame, tEnd: t.value }]
    t.value = 0
    status.value = 'ready'
  })

  const allRuns = computed<ClockRun[]>(() => [...history.value, { beta: beta.value, frame: frame.value, tEnd: t.value }])

  return { beta, frame, status, t, view, lorentz, allRuns, start, pause, reset }
}
