<script setup lang="ts">
import { computed, useId } from 'vue'

const props = defineProps<{
  x: number
  x0: number
  v: number
  t: number
  bounds: { min: number; max: number }
  /** Velocity of a second observer (shown when not null). */
  observerVelocity: number | null
}>()

const id = useId()
const W = 800
const H = 172
const PAD = 40
const TRACK_Y = 78
const V_SCALE = 30 // px per (m/s)

const px = (x: number) => PAD + ((x - props.bounds.min) / (props.bounds.max - props.bounds.min)) * (W - 2 * PAD)

const ticks = computed(() => {
  const list: { x: number; major: boolean }[] = []
  for (let x = Math.ceil(props.bounds.min); x <= props.bounds.max; x++) list.push({ x, major: x % 2 === 0 })
  return list
})

const objectX = computed(() => px(props.x))
const startX = computed(() => px(props.x0))
const showDisplacement = computed(() => Math.abs(objectX.value - startX.value) > 4)
const observerX = computed(() => (props.observerVelocity === null ? null : props.observerVelocity * props.t))

const formatSigned = (n: number) => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n).toFixed(2)

const description = computed(
  () =>
    `Track from ${props.bounds.min} to ${props.bounds.max} metres. The object is at x = ${props.x.toFixed(2)} m, ` +
    `started at x₀ = ${props.x0.toFixed(1)} m, moving at ${props.v.toFixed(1)} m/s.`,
)
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="track" role="img" :aria-label="description">
    <defs>
      <marker :id="`${id}-arrow-v`" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" class="head-velocity" />
      </marker>
      <marker :id="`${id}-arrow-d`" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" class="head-displacement" />
      </marker>
      <clipPath :id="`${id}-clip`">
        <rect :x="PAD - 16" y="0" :width="W - 2 * PAD + 32" :height="H" />
      </clipPath>
    </defs>

    <!-- Track and scale -->
    <line :x1="px(bounds.min)" :x2="px(bounds.max)" :y1="TRACK_Y + 16" :y2="TRACK_Y + 16" class="rail" />
    <rect :x="px(bounds.min) - 6" :y="TRACK_Y - 6" width="6" height="28" class="wall" />
    <rect :x="px(bounds.max)" :y="TRACK_Y - 6" width="6" height="28" class="wall" />
    <g v-for="tick in ticks" :key="tick.x">
      <line :x1="px(tick.x)" :x2="px(tick.x)" :y1="TRACK_Y + 16" :y2="TRACK_Y + (tick.major ? 24 : 20)" class="tick" />
      <text v-if="tick.major" :x="px(tick.x)" :y="TRACK_Y + 40" class="tick-label">{{ tick.x }}</text>
    </g>
    <text :x="W / 2" :y="H - 6" class="tick-label axis-name">position x (m)</text>

    <!-- Starting position -->
    <line :x1="startX" :x2="startX" :y1="TRACK_Y - 46" :y2="TRACK_Y + 16" class="start-line" />
    <text :x="startX" :y="TRACK_Y - 52" class="start-label">x₀</text>

    <!-- Displacement -->
    <g v-if="showDisplacement">
      <line
        :x1="startX"
        :x2="objectX"
        :y1="TRACK_Y - 34"
        :y2="TRACK_Y - 34"
        class="displacement"
        :marker-end="`url(#${id}-arrow-d)`"
      />
      <text :x="(startX + objectX) / 2" :y="TRACK_Y - 40" class="displacement-label">Δx = {{ formatSigned(x - x0) }} m</text>
    </g>

    <!-- Moving observer -->
    <g v-if="observerX !== null" :clip-path="`url(#${id}-clip)`">
      <g :transform="`translate(${px(observerX)}, ${TRACK_Y + 52})`" class="observer">
        <path d="M0,-12 L9,6 L-9,6 z" />
        <text x="14" y="5">observer</text>
      </g>
    </g>

    <!-- Object and its velocity -->
    <line
      v-if="v !== 0"
      :x1="objectX + Math.sign(v) * 16"
      :x2="objectX + Math.sign(v) * 16 + v * V_SCALE"
      :y1="TRACK_Y + 2"
      :y2="TRACK_Y + 2"
      class="velocity"
      :marker-end="`url(#${id}-arrow-v)`"
    />
    <circle :cx="objectX" :cy="TRACK_Y + 2" r="13" class="object" />
  </svg>
</template>

<style scoped>
.track {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
}

.rail {
  stroke: var(--axis);
  stroke-width: 2;
}

.wall {
  fill: var(--axis);
}

.tick {
  stroke: var(--axis);
}

.tick-label {
  fill: var(--text-muted);
  font-size: 13px;
  text-anchor: middle;
  font-family: var(--font-mono);
}

.axis-name {
  font-family: var(--font);
}

.start-line {
  stroke: var(--text-muted);
  stroke-dasharray: 4 4;
}

.start-label {
  fill: var(--text-muted);
  font-size: 14px;
  text-anchor: middle;
  font-style: italic;
}

.displacement {
  stroke: var(--success);
  stroke-width: 2.5;
}

.displacement-label {
  fill: var(--success);
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
  font-family: var(--font-mono);
}

.head-velocity {
  fill: var(--accent);
}

.head-displacement {
  fill: var(--success);
}

.velocity {
  stroke: var(--accent);
  stroke-width: 3;
}

.object {
  fill: var(--accent);
  stroke: var(--surface);
  stroke-width: 3;
}

.observer path {
  fill: var(--observer);
}

.observer text {
  fill: var(--observer);
  font-size: 12px;
  font-weight: 700;
}
</style>
