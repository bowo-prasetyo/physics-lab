<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  /** Current angle (rad). */
  theta: number
  /** Release angle (deg), drawn as a dashed arc. */
  amplitudeDeg: number
  length: number
  mass: number
}>()

const W = 600
/** Fixed scale, so longer pendulums really look longer. */
const PX_PER_M = 120

const rodPx = computed(() => props.length * PX_PER_M)
// Swings wider than 90° rise above the pivot, so leave room above it.
const PIVOT = computed(() => {
  const above = rodPx.value * Math.max(0, -Math.cos((props.amplitudeDeg * Math.PI) / 180))
  return { x: W / 2, y: 34 + above }
})
const H = computed(() => Math.max(PIVOT.value.y + Math.max(rodPx.value, PX_PER_M) + 34, 220))
const bobR = computed(() => 7 + 5 * Math.cbrt(props.mass))
const bob = computed(() => ({
  x: PIVOT.value.x + rodPx.value * Math.sin(props.theta),
  y: PIVOT.value.y + rodPx.value * Math.cos(props.theta),
}))

const arc = computed(() => {
  const a = (props.amplitudeDeg * Math.PI) / 180
  const r = rodPx.value
  const p = (angle: number) => `${(PIVOT.value.x + r * Math.sin(angle)).toFixed(1)},${(PIVOT.value.y + r * Math.cos(angle)).toFixed(1)}`
  const large = a > Math.PI / 2 ? 1 : 0
  return `M${p(-a)} A${r},${r} 0 ${large} 0 ${p(a)}`
})

const degrees = computed(() => (props.theta * 180) / Math.PI)
const description = computed(
  () => `Pendulum ${props.length.toFixed(2)} m long with a ${props.mass.toFixed(1)} kg bob, at ${degrees.value.toFixed(0)} degrees from the vertical.`,
)
</script>

<template>
  <figure class="pendulum">
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="description">
      <line :x1="PIVOT.x - 60" :x2="PIVOT.x + 60" :y1="PIVOT.y" :y2="PIVOT.y" class="beam" />
      <line :x1="PIVOT.x" :x2="PIVOT.x" :y1="PIVOT.y" :y2="PIVOT.y + rodPx + 14" class="vertical" />
      <path :d="arc" class="arc" />
      <line :x1="PIVOT.x" :y1="PIVOT.y" :x2="bob.x" :y2="bob.y" class="rod" />
      <circle :cx="PIVOT.x" :cy="PIVOT.y" r="4" class="pivot" />
      <circle :cx="bob.x" :cy="bob.y" :r="bobR" class="bob" />
      <text :x="PIVOT.x + 70" :y="PIVOT.y + 4" class="label num">{{ degrees.toFixed(0) }}°</text>

      <!-- Scale: 1 m -->
      <g class="scale">
        <line :x1="24" :x2="24" :y1="PIVOT.y" :y2="PIVOT.y + PX_PER_M" />
        <line :x1="18" :x2="30" :y1="PIVOT.y" :y2="PIVOT.y" />
        <line :x1="18" :x2="30" :y1="PIVOT.y + PX_PER_M" :y2="PIVOT.y + PX_PER_M" />
        <text :x="34" :y="PIVOT.y + PX_PER_M / 2 + 4">1 m</text>
      </g>
    </svg>
  </figure>
</template>

<style scoped>
.pendulum {
  margin: 0;
}

svg {
  display: block;
  width: 100%;
  max-height: 460px;
  height: auto;
}

.beam {
  stroke: var(--axis);
  stroke-width: 6;
  stroke-linecap: round;
}

.vertical {
  stroke: var(--grid);
  stroke-width: 2;
  stroke-dasharray: 4 5;
}

.arc {
  fill: none;
  stroke: var(--observer);
  stroke-width: 2;
  stroke-dasharray: 6 6;
  opacity: 0.8;
}

.rod {
  stroke: var(--text);
  stroke-width: 2.5;
}

.pivot {
  fill: var(--text);
}

.bob {
  fill: var(--accent);
  stroke: var(--surface);
  stroke-width: 3;
}

.label {
  fill: var(--text-muted);
  font-size: 14px;
  font-family: var(--font-mono);
}

.scale line {
  stroke: var(--text-muted);
  stroke-width: 2;
}

.scale text {
  fill: var(--text-muted);
  font-size: 13px;
}
</style>
