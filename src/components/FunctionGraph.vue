<script setup lang="ts">
import { computed, useId } from 'vue'
import { useLocale } from '@/composables/useLocale'

/**
 * Plots a model curve y = f(x) on scales that start at zero, with labelled
 * ticks so values can be read off. The caller passes axis labels and the
 * accessible description already translated; f should come from the physics
 * engine so the drawing always agrees with the model.
 */
const props = defineProps<{
  f: (x: number) => number
  x: { max: number; step: number }
  y: { max: number; step: number }
  xLabel: string
  yLabel: string
  description: string
}>()

const { locale } = useLocale()
const id = useId()
const W = 560
const H = 320
const M = { left: 62, right: 18, top: 14, bottom: 50 }
const plotW = W - M.left - M.right
const plotH = H - M.top - M.bottom
const sx = (v: number) => M.left + (v / props.x.max) * plotW
const sy = (v: number) => M.top + plotH - (v / props.y.max) * plotH
const ticks = (axis: { max: number; step: number }) => Array.from({ length: Math.round(axis.max / axis.step) + 1 }, (_, i) => i * axis.step)
const xTicks = computed(() => ticks(props.x))
const yTicks = computed(() => ticks(props.y))
const format = (v: number) => new Intl.NumberFormat(locale.value, { maximumFractionDigits: 2 }).format(v)
const SAMPLES = 200
const points = computed(() => Array.from({ length: SAMPLES + 1 }, (_, i) => {
  const xv = (props.x.max * i) / SAMPLES
  return `${sx(xv).toFixed(1)},${sy(props.f(xv)).toFixed(1)}`
}).join(' '))
</script>

<template>
  <figure class="function-graph">
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="description">
      <defs><clipPath :id="`${id}-plot`"><rect :x="M.left" :y="M.top" :width="plotW" :height="plotH" /></clipPath></defs>
      <g class="grid">
        <line v-for="t in xTicks" :key="`gx${t}`" :x1="sx(t)" :x2="sx(t)" :y1="M.top" :y2="M.top + plotH" />
        <line v-for="t in yTicks" :key="`gy${t}`" :x1="M.left" :x2="M.left + plotW" :y1="sy(t)" :y2="sy(t)" />
      </g>
      <line class="axis" :x1="M.left" :x2="M.left + plotW" :y1="sy(0)" :y2="sy(0)" />
      <line class="axis" :x1="M.left" :x2="M.left" :y1="M.top" :y2="M.top + plotH" />
      <text v-for="t in xTicks" :key="`lx${t}`" :x="sx(t)" :y="M.top + plotH + 18" class="tick">{{ format(t) }}</text>
      <text v-for="t in yTicks" :key="`ly${t}`" :x="M.left - 8" :y="sy(t) + 4" class="tick y">{{ format(t) }}</text>
      <text :x="M.left + plotW / 2" :y="H - 8" class="axis-title">{{ xLabel }}</text>
      <text x="16" :y="M.top + plotH / 2" class="axis-title" :transform="`rotate(-90 16 ${M.top + plotH / 2})`">{{ yLabel }}</text>
      <polyline :points="points" class="curve" :clip-path="`url(#${id}-plot)`" />
    </svg>
  </figure>
</template>

<style scoped>
.function-graph { margin: 0; }
svg { display: block; width: 100%; height: auto; }
.grid line { stroke: var(--grid); stroke-width: 1; }
.axis { stroke: var(--axis); stroke-width: 1.5; }
.tick { fill: var(--text-muted); font-size: 13px; font-family: var(--font-mono); text-anchor: middle; }
.tick.y { text-anchor: end; }
.axis-title { fill: var(--text-muted); font-size: 14px; text-anchor: middle; }
.curve { fill: none; stroke: var(--accent); stroke-width: 3.5; stroke-linejoin: round; stroke-linecap: round; }
</style>
