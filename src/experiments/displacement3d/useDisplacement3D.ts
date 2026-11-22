/**
 * State for the 3D displacement experiment: a journey through space made of
 * straight moves, and an optional second coordinate system.
 */

import { computed, ref, watch } from 'vue'
import {
  STANDARD_FRAME,
  netDisplacement,
  norm,
  pathLength,
  pointInFrame,
  vec3,
  vectorInFrame,
  type CoordinateFrame,
  type Vec3,
} from '@/physics'

/** Positions are kept inside a cube of this half-width (m). */
export const BOUND = 12
export const SHIFT_RANGE = { min: -6, max: 6, step: 1 } as const
export const YAW_RANGE = { min: -180, max: 180, step: 5 } as const
export const PITCH_RANGE = { min: -90, max: 90, step: 5 } as const

export type Axis = 'x' | 'y' | 'z'

export interface Preset {
  readonly id: string
  readonly label: string
  readonly points: readonly Vec3[]
}

export const PRESETS: readonly Preset[] = [
  { id: 'round-trip', label: 'Round trip', points: [vec3(), vec3(3, 0, 0), vec3(3, 4, 0), vec3(3, 4, 2), vec3()] },
  { id: 'diagonal', label: '3, 4, 12 diagonal', points: [vec3(), vec3(3, 0, 0), vec3(3, 4, 0), vec3(3, 4, 12)] },
  { id: 'staircase', label: 'Staircase', points: [vec3(), vec3(2, 0, 0), vec3(2, 0, 1), vec3(4, 0, 1), vec3(4, 0, 2), vec3(6, 0, 2), vec3(6, 0, 3)] },
]

/** What the predictions need: the state of the journey and frame at one moment. */
export interface JourneySnapshot {
  readonly moves: number
  readonly displacement: Vec3
  readonly distance: number
  readonly frame: CoordinateFrame
}

const clamp = (v: number) => Math.max(-BOUND, Math.min(BOUND, v))

export function useDisplacement3D() {
  const points = ref<Vec3[]>([vec3()])
  const shift = ref({ x: 0, y: 0, z: 0 })
  const yaw = ref(0)
  const pitch = ref(0)
  const snapshots = ref<JourneySnapshot[]>([])

  const frame = computed<CoordinateFrame>(() => ({ origin: vec3(shift.value.x, shift.value.y, shift.value.z), yawDeg: yaw.value, pitchDeg: pitch.value }))
  const current = computed(() => points.value[points.value.length - 1] as Vec3)
  const start = computed(() => points.value[0] as Vec3)
  const displacement = computed(() => netDisplacement(points.value))
  const distance = computed(() => pathLength(points.value))

  function moveTo(p: Vec3) {
    const target = vec3(clamp(p.x), clamp(p.y), clamp(p.z))
    const last = current.value
    if (target.x === last.x && target.y === last.y && target.z === last.z) return
    points.value = [...points.value, target]
  }

  function step(axis: Axis, amount: number) {
    const c = current.value
    moveTo(vec3(c.x + (axis === 'x' ? amount : 0), c.y + (axis === 'y' ? amount : 0), c.z + (axis === 'z' ? amount : 0)))
  }

  function undo() {
    if (points.value.length > 1) points.value = points.value.slice(0, -1)
  }

  /** Start a new journey from the current position (or from the origin). */
  function restart(fromOrigin = false) {
    points.value = [fromOrigin ? vec3() : current.value]
  }

  function loadPreset(id: string) {
    const preset = PRESETS.find((p) => p.id === id)
    if (preset) points.value = [...preset.points]
  }

  function resetFrame() {
    shift.value = { x: 0, y: 0, z: 0 }
    yaw.value = 0
    pitch.value = 0
  }

  // Record every state the student looks at, for the predictions.
  watch(
    [points, frame],
    () => {
      snapshots.value = [
        ...snapshots.value.slice(-299),
        { moves: points.value.length - 1, displacement: displacement.value, distance: distance.value, frame: frame.value },
      ]
    },
    { deep: true },
  )

  const inFrame = computed(() => ({
    current: pointInFrame(current.value, frame.value),
    start: pointInFrame(start.value, frame.value),
    displacement: vectorInFrame(displacement.value, frame.value),
  }))
  const frameIsStandard = computed(
    () => frame.value.origin.x === 0 && frame.value.origin.y === 0 && frame.value.origin.z === 0 && yaw.value === 0 && pitch.value === 0,
  )

  return {
    points,
    shift,
    yaw,
    pitch,
    frame,
    frameIsStandard,
    current,
    start,
    displacement,
    distance,
    size: computed(() => norm(displacement.value)),
    inFrame,
    snapshots,
    moveTo,
    step,
    undo,
    restart,
    loadPreset,
    resetFrame,
  }
}

export { STANDARD_FRAME }
