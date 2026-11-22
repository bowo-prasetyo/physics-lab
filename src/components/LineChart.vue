<script setup lang="ts">
import { computed } from 'vue'

export interface LineSeries {
  readonly id: string
  readonly label: string
  /** A CSS colour, normally a design token such as var(--accent). */
  readonly colour: string
  readonly points: readonly { x: number; y: number }[]
}

const props = defineProps<{
  series: readonly LineSeries[]
  xMax: number
  xLabel: string
  yLabel: string
  /** Current x, drawn as a vertical marker, or null. */
  marker: number | null
}>()

const W = 800
const H = 220
const M = { left: 54, right: 16, top: 12, bottom: 40 }
const plotW = W - M.left - M.right
const plotH = H - M.top - M.bottom

const niceStep = (span: number, count: number) => {
  const raw = span / count
  const p = 10 ** Math.floor(Math.log10(raw))
  return [1, 2, 5, 10].map((m) => m * p).find((s) => s >= raw) ?? 10 * p
}

const xMax = computed(() => Math.max(props.xMax, 1e-6))
const yRange = computed(() => {
  const ys = props.series.flatMap((s) => s.points.map((p) => p.y))
  const lo = Math.min(0, ...ys)
  const hi = Math.max(0, ...ys)
  const step = niceStep(Math.max(hi - lo, 1e-6), 4)
  return { lo: Math.floor(lo / step) * step, hi: Math.ceil(hi / step) * step || step, step }
})

const sx = (x: number) => M.left + (x / xMax.value) * plotW
const sy = (y: number) => M.top + ((yRange.value.hi - y) / (yRange.value.hi - yRange.value.lo)) * plotH

const xTicks = computed(() => {
  const step = niceStep(xMax.value, 6)
  const ticks: number[] = []
  for (let x = 0; x <= xMax.value + 1e-9; x += step) ticks.push(Number(x.toPrecision(6)))
  return ticks
})
const yTicks = computed(() => {
  const ticks: number[] = []
  for (let y = yRange.value.lo; y <= yRange.value.hi + 1e-9; y += yRange.value.step) ticks.push(Number(y.toPrecision(6)))
  return ticks
})

const paths = computed(() =>
  props.series.map((s) => ({ ...s, d: s.points.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(' ') })),
)
</script>

<template>
  <figure class="chart">
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="`${yLabel} against ${xLabel}: ${series.map((s) => s.label).join(', ')}.`">
      <g class="grid">
        <line v-for="x in xTicks" :key="`gx${x}`" :x1="sx(x)" :x2="sx(x)" :y1="M.top" :y2="M.top + plotH" />
        <line v-for="y in yTicks" :key="`gy${y}`" :x1="M.left" :x2="M.left + plotW" :y1="sy(y)" :y2="sy(y)" />
      </g>
      <line :x1="M.left" :x2="M.left + plotW" :y1="sy(0)" :y2="sy(0)" class="zero" />
      <text v-for="x in xTicks" :key="`lx${x}`" :x="sx(x)" :y="M.top + plotH + 16" class="tick">{{ x }}</text>
      <text v-for="y in yTicks" :key="`ly${y}`" :x="M.left - 6" :y="sy(y) + 4" class="tick y">{{ y }}</text>
      <text :x="M.left + plotW / 2" :y="H - 4" class="axis-title">{{ xLabel }}</text>
      <text :x="12" :y="M.top + plotH / 2" class="axis-title" :transform="`rotate(-90 12 ${M.top + plotH / 2})`">{{ yLabel }}</text>
      <line v-if="marker !== null" :x1="sx(marker)" :x2="sx(marker)" :y1="M.top" :y2="M.top + plotH" class="marker" />
      <path v-for="p in paths" :key="p.id" :d="p.d" class="line" :style="{ stroke: p.colour }" />
    </svg>
    <figcaption class="legend">
      <span v-for="s in series" :key="s.id"><i class="swatch" :style="{ background: s.colour }" /> {{ s.label }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.chart {
  margin: 0;
}

svg {
  display: block;
  width: 100%;
  height: auto;
}

.grid line {
  stroke: var(--grid);
}

.zero {
  stroke: var(--axis);
}

.tick {
  fill: var(--text-muted);
  font-size: 12px;
  font-family: var(--font-mono);
  text-anchor: middle;
}

.tick.y {
  text-anchor: end;
}

.axis-title {
  fill: var(--text-muted);
  font-size: 13px;
  text-anchor: middle;
}

.marker {
  stroke: var(--text-muted);
  stroke-dasharray: 4 4;
}

.line {
  fill: none;
  stroke-width: 3;
  stroke-linejoin: round;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.swatch {
  display: inline-block;
  width: 18px;
  height: 4px;
  border-radius: 2px;
}
</style>
