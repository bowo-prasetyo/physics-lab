/**
 * State and controls for “Space versus time”. This is the only place where the
 * physics model meets Vue: it owns a MotionRun, advances it on animation
 * frames and exposes plain reactive snapshots for the views to draw.
 */

import { computed, ref, shallowRef, watch } from 'vue'
import { MotionRun, type RunRecord } from '@/physics'
import { useAnimationFrame } from '@/composables/useAnimationFrame'
import type { ExperimentRun } from './runs'

export const DURATION = 10 // s on the experiment clock
export const BOUNDS = { min: -10, max: 10 } as const // m
export const X0_RANGE = { min: -8, max: 8, step: 0.5 } as const
export const V_RANGE = { min: -3, max: 3, step: 0.5 } as const
export const U_RANGE = { min: -3, max: 3, step: 0.5 } as const
/** Number of earlier runs kept on the graph for comparison. */
export const HISTORY_SIZE = 3

export type RunStatus = 'ready' | 'running' | 'paused' | 'finished'

export interface RunSnapshot {
  readonly t: number
  readonly x: number
  readonly v: number
  readonly displacement: number
  readonly distance: number
  readonly atBoundary: boolean
  readonly record: RunRecord
}

export function useSpaceVsTime(initial: { x0: number; v: number }) {
  const x0 = ref(initial.x0)
  const v = ref(initial.v)
  /** Velocity of the second (moving) observer, used at the advanced level. Fixed during a run. */
  const u = ref(0)
  const status = ref<RunStatus>('ready')
  const history = ref<ExperimentRun[]>([])

  let run = createRun()
  const snapshot = shallowRef<RunSnapshot>(takeSnapshot(run))

  function createRun(): MotionRun {
    return new MotionRun({ x0: x0.value, v: v.value, duration: DURATION, bounds: BOUNDS })
  }

  function takeSnapshot(r: MotionRun): RunSnapshot {
    return {
      t: r.t,
      x: r.x,
      v: r.v,
      displacement: r.displacement,
      distance: r.distance,
      atBoundary: r.atBoundary,
      record: r.toRecord(),
    }
  }

  const refresh = () => {
    snapshot.value = takeSnapshot(run)
  }

  watch(x0, () => {
    if (status.value === 'ready') {
      run = createRun()
      refresh()
    }
  })

  watch(v, (value) => {
    if (status.value === 'finished') return
    run.setVelocity(value)
    refresh()
  })

  const running = computed(() => status.value === 'running')

  useAnimationFrame(running, (dt) => {
    run.advance(dt)
    if (run.finished) status.value = 'finished'
    refresh()
  })

  function start() {
    if (status.value === 'ready' || status.value === 'paused') status.value = 'running'
  }

  function pause() {
    if (status.value === 'running') status.value = 'paused'
  }

  /** Put the clock back to zero. The finished (or partial) run is kept for comparison. */
  function reset() {
    if (run.t > 0) history.value = [...history.value, { ...run.toRecord(), u: u.value }].slice(-HISTORY_SIZE)
    status.value = 'ready'
    run = createRun()
    refresh()
  }

  function clearHistory() {
    history.value = []
  }

  /** Every run performed so far, including the one in progress. */
  const allRuns = computed<ExperimentRun[]>(() => [...history.value, { ...snapshot.value.record, u: u.value }])

  return { x0, v, u, status, history, snapshot, allRuns, start, pause, reset, clearHistory }
}
