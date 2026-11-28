<script setup lang="ts">
import { computed, useId } from 'vue'
import { significant } from '@/i18n/formatters'
import { staticClockDeficit, type Body } from '@/physics'
import { niceCeil } from './chartScale'
import { formatLength } from '@/experiments/gravity-clocks/format'
import { useLocale } from '@/composables/useLocale'
import { localizeExperimentText } from '@/i18n/experiment-ui'

const { locale } = useLocale()

const props = defineProps<{
  body: Body
  /** Height range shown (m); the minimum stands in for "on the surface". */
  range: { min: number; max: number }
  altitudeA: number
  altitudeB: number
}>()

const id = useId()
const W = 800
const H = 300
const M = { left: 62, right: 24, top: 18, bottom: 48 }
const plotW = W - M.left - M.right
const plotH = H - M.top - M.bottom

const logMin = computed(() => Math.log10(props.range.min))
const logMax = computed(() => Math.log10(props.range.max))
// Height 0 (on the surface) is drawn at the left edge.
const sx = (h: number) => M.left + ((Math.log10(Math.max(h, props.range.min)) - logMin.value) / (logMax.value - logMin.value)) * plotW

const deficitAt = (h: number) => staticClockDeficit(props.body.mass, props.body.radius + h)

/** Choose a unit so the largest value reads as a plain number. */
const unit = computed(() => {
  const max = deficitAt(props.body.hasSurface ? 0 : props.range.min)
  if (max >= 0.01) return { scale: 100, name: '%' }
  if (max >= 1e-7) return { scale: 1e6, name: localizeExperimentText('parts per million', locale.value) ?? 'parts per million' }
  if (max >= 1e-10) return { scale: 1e9, name: localizeExperimentText('parts per billion', locale.value) ?? 'parts per billion' }
  return { scale: 1e12, name: localizeExperimentText('parts per trillion', locale.value) ?? 'parts per trillion' }
})
const yMax = computed(() => niceCeil(deficitAt(props.body.hasSurface ? 0 : props.range.min) * unit.value.scale))
const sy = (d: number) => M.top + (1 - (d * unit.value.scale) / yMax.value) * plotH

const curve = computed(() => {
  const n = 160
  const points: string[] = []
  for (let i = 0; i <= n; i++) {
    const h = 10 ** (logMin.value + ((logMax.value - logMin.value) * i) / n)
    points.push(`${i ? 'L' : 'M'}${sx(h).toFixed(1)},${sy(deficitAt(h)).toFixed(1)}`)
  }
  return points.join(' ')
})

const xTicks = computed(() => {
  const ticks: number[] = []
  const first = Math.ceil(logMin.value)
  const step = logMax.value - logMin.value > 8 ? 2 : 1
  for (let e = first; e <= Math.floor(logMax.value); e += step) ticks.push(10 ** e)
  return ticks
})
const yTicks = computed(() => [0, 0.25, 0.5, 0.75, 1].map((f) => f * yMax.value))
const fmtY = (v: number) => significant(v, 3)

const markers = computed(() =>
  [
    { id: 'A', h: props.altitudeA },
    { id: 'B', h: props.altitudeB },
  ].map((m) => ({ ...m, x: sx(m.h), y: sy(deficitAt(m.h)) })),
)

const description = computed(() => {
  const bodyName = localizeExperimentText(props.body.name, locale.value) ?? props.body.name
  const reference = props.body.hasSurface ? (locale.value === 'id' ? 'permukaan' : '地表') : (locale.value === 'id' ? 'horizon' : '地平面')
  if (locale.value === 'id') {
    return `Grafik menunjukkan seberapa besar jam yang diam melambat pada ketinggian di atas ${reference} ${bodyName}, dengan skala ketinggian logaritmik. Jam A berada pada ${formatLength(props.altitudeA)} dan jam B pada ${formatLength(props.altitudeB)}; jam yang lebih rendah berjalan lebih lambat.`
  }
  if (locale.value === 'ja') {
    return `${bodyName}の${reference}からの高さに応じて、静止した時計がどれほど遅く進むかを対数スケールで示します。時計 A は ${formatLength(props.altitudeA)}、時計 B は ${formatLength(props.altitudeB)} にあり、低い位置の時計ほど遅く進みます。`
  }
  return `How much a clock at rest is slowed, against its height above ${props.body.hasSurface ? 'the surface' : 'the horizon'} of the ${props.body.name}, on a logarithmic height scale. Clock A is at ${formatLength(props.altitudeA)} and clock B at ${formatLength(props.altitudeB)}; the lower clock is slowed more.`
})
</script>

<template>
  <figure class="chart">
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="description">
      <defs>
        <clipPath :id="`${id}-plot`">
          <rect :x="M.left - 10" :y="M.top - 10" :width="plotW + 20" :height="plotH + 12" />
        </clipPath>
      </defs>
      <g class="grid">
        <line v-for="x in xTicks" :key="`gx${x}`" :x1="sx(x)" :x2="sx(x)" :y1="M.top" :y2="M.top + plotH" />
        <line v-for="y in yTicks" :key="`gy${y}`" :x1="M.left" :x2="M.left + plotW" :y1="M.top + (1 - y / yMax) * plotH" :y2="M.top + (1 - y / yMax) * plotH" />
      </g>
      <text v-for="x in xTicks" :key="`lx${x}`" :x="sx(x)" :y="M.top + plotH + 18" class="tick">{{ formatLength(x) }}</text>
      <text v-for="y in yTicks" :key="`ly${y}`" :x="M.left - 8" :y="M.top + (1 - y / yMax) * plotH + 4" class="tick y">{{ fmtY(y) }}</text>
      <text :x="M.left + plotW / 2" :y="H - 6" class="axis-title">
        {{ locale === 'id' ? (body.hasSurface ? 'ketinggian di atas permukaan' : 'ketinggian di atas horizon') : locale === 'ja' ? (body.hasSurface ? '地表からの高さ' : '地平面からの高さ') : (body.hasSurface ? 'height above the surface' : 'height above the horizon') }} ({{ localizeExperimentText('logarithmic scale', locale) }}{{ body.hasSurface ? (locale === 'id' ? '; tepi kiri = permukaan' : locale === 'ja' ? '；左端 = 地表' : '; left edge = on the surface') : '' }})
      </text>
      <text :x="14" :y="M.top + plotH / 2" class="axis-title" :transform="`rotate(-90 14 ${M.top + plotH / 2})`">{{ localizeExperimentText(`clock slowed by (${unit.name})`, locale) }}</text>

      <g :clip-path="`url(#${id}-plot)`">
        <path :d="`${curve} L${M.left + plotW},${M.top + plotH} L${M.left},${M.top + plotH} Z`" class="well" />
        <path :d="curve" class="curve" />
        <g v-for="m in markers" :key="m.id" :class="['marker', m.id === 'A' ? 'a' : 'b']">
          <line :x1="m.x" :x2="m.x" :y1="m.y" :y2="M.top + plotH" />
          <circle :cx="m.x" :cy="m.y" r="8" />
          <text :x="m.x" :y="m.y - 13">{{ m.id }}</text>
        </g>
      </g>
    </svg>
    <details class="chart-data">
      <summary>{{ localizeExperimentText('Read the clock comparisons as a table', locale) }}</summary>
      <table><thead><tr><th scope="col">{{ localizeExperimentText('Clock', locale) }}</th><th scope="col">{{ localizeExperimentText('Altitude', locale) }}</th><th scope="col">{{ localizeExperimentText('Clock-rate deficit', locale) }}</th></tr></thead>
        <tbody><tr><th scope="row">A</th><td>{{ formatLength(altitudeA) }}</td><td>{{ significant(deficitAt(altitudeA) * unit.scale, 5) }} {{ unit.name }}</td></tr>
          <tr><th scope="row">B</th><td>{{ formatLength(altitudeB) }}</td><td>{{ significant(deficitAt(altitudeB) * unit.scale, 5) }} {{ unit.name }}</td></tr></tbody>
      </table>
      <p class="muted small">{{ localizeExperimentText('A positive deficit means the clock runs slower than a clock infinitely far from this body, under the static Schwarzschild model.', locale) }}</p>
    </details>
  </figure>
</template>

<style scoped>
.chart { margin: 0; }
.chart-data { margin-top: 8px; font-size: .84rem; }
.chart-data summary { cursor: pointer; color: var(--accent); font-weight: 600; }
.chart-data table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.chart-data th, .chart-data td { padding: 6px 9px; border-bottom: 1px solid var(--border); text-align: left; }
.chart-data th { color: var(--text-muted); }
.chart-data .small { margin: 8px 0 0; }

svg {
  display: block;
  width: 100%;
  height: auto;
}

.grid line {
  stroke: var(--grid);
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

.well {
  fill: var(--accent-soft);
  opacity: 0.6;
}

.curve {
  fill: none;
  stroke: var(--accent);
  stroke-width: 3;
}

.marker line {
  stroke-width: 2;
  stroke-dasharray: 4 4;
}

.marker text {
  font-size: 14px;
  font-weight: 800;
  text-anchor: middle;
  paint-order: stroke;
  stroke: var(--surface);
  stroke-width: 3px;
}

.marker.a circle,
.marker.a line {
  fill: var(--observer);
  stroke: var(--observer);
}

.marker.a text {
  fill: var(--observer);
}

.marker.b circle,
.marker.b line {
  fill: var(--success);
  stroke: var(--success);
}

.marker.b text {
  fill: var(--success);
}

.marker circle {
  stroke: var(--surface) !important;
  stroke-width: 2.5;
  stroke-dasharray: none;
}
</style>
