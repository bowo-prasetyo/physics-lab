<script setup lang="ts">
import { fixed } from '@/i18n/formatters'
import { computed, useId } from 'vue'
import { niceCeil } from './chartScale'
import { useLocale } from '@/composables/useLocale'
import { localizeExperimentText } from '@/i18n/experiment-ui'

const { locale } = useLocale()

export interface ChartSeries {
  readonly id: string
  readonly label: string
  /** Colour key: one per description. */
  readonly kind: 'galilean' | 'lorentz' | 'spacetime'
  readonly points: readonly { x: number; y: number }[]
  readonly dashed?: boolean
}

const props = defineProps<{
  series: readonly ChartSeries[]
  xMax: number
  xLabel: string
  yLabel: string
  /** Current x, drawn as a vertical marker. */
  marker: number
  /** The measured value at the marker, once measured. */
  measured: number | null
}>()

const id = useId()
const W = 800
const H = 300
const M = { left: 58, right: 20, top: 14, bottom: 44 }
const plotW = W - M.left - M.right
const plotH = H - M.top - M.bottom

const yMax = computed(() => niceCeil(Math.max(...props.series.flatMap((s) => s.points.map((p) => p.y)), props.measured ?? 0)))
const sx = (x: number) => M.left + (x / props.xMax) * plotW
const sy = (y: number) => M.top + (1 - y / yMax.value) * plotH

const xTicks = [0, 0.2, 0.4, 0.6, 0.8, 1]
const yTicks = computed(() => [0, 0.25, 0.5, 0.75, 1].map((f) => f * yMax.value))
const fmt = (v: number) => String(Number(v.toPrecision(3)))

const lines = computed(() =>
  props.series.map((s) => ({ ...s, path: s.points.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(' ') })),
)

const description = computed(
  () =>
    `Chart of ${props.yLabel} against ${props.xLabel}, one line per description. ` +
    props.series.map((s) => `${localizeExperimentText(s.label, locale.value) ?? s.label}: ${s.points.at(-1)?.y.toFixed(2)} at the top speed`).join('; ') +
    '.',
)
</script>

<template>
  <figure class="chart">
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="localizeExperimentText(description, locale)">
      <defs>
        <clipPath :id="`${id}-plot`">
          <rect :x="M.left" :y="M.top - 4" :width="plotW + 4" :height="plotH + 8" />
        </clipPath>
      </defs>
      <g class="grid">
        <line v-for="x in xTicks" :key="`gx${x}`" :x1="sx(x)" :x2="sx(x)" :y1="M.top" :y2="M.top + plotH" />
        <line v-for="y in yTicks" :key="`gy${y}`" :x1="M.left" :x2="M.left + plotW" :y1="sy(y)" :y2="sy(y)" />
      </g>
      <text v-for="x in xTicks" :key="`lx${x}`" :x="sx(x)" :y="M.top + plotH + 18" class="tick">{{ x === 1 ? '1c' : fixed(x, 1) }}</text>
      <text v-for="y in yTicks" :key="`ly${y}`" :x="M.left - 8" :y="sy(y) + 4" class="tick y">{{ fmt(y) }}</text>
      <text :x="M.left + plotW / 2" :y="H - 6" class="axis-title">{{ localizeExperimentText(xLabel, locale) }}</text>
      <text :x="14" :y="M.top + plotH / 2" class="axis-title" :transform="`rotate(-90 14 ${M.top + plotH / 2})`">{{ localizeExperimentText(yLabel, locale) }}</text>

      <g :clip-path="`url(#${id}-plot)`">
        <line :x1="sx(marker)" :x2="sx(marker)" :y1="M.top" :y2="M.top + plotH" class="marker" />
        <path v-for="line in lines" :key="line.id" :d="line.path" :class="['series', line.kind, { dashed: line.dashed }]" />
        <circle v-if="measured !== null" :cx="sx(marker)" :cy="sy(measured)" r="7" class="measured" />
      </g>
    </svg>
    <details class="chart-data">
      <summary>{{ localizeExperimentText('View the plotted values as a table', locale) }}</summary>
      <div class="chart-scroll"><table><thead><tr><th scope="col">{{ localizeExperimentText('Model', locale) }}</th><th scope="col">{{ localizeExperimentText(xLabel, locale) }}</th><th scope="col">{{ localizeExperimentText(yLabel, locale) }}</th></tr></thead>
        <tbody><template v-for="item in series" :key="item.id"><tr v-for="(point, index) in item.points" :key="`${item.id}-${index}`"><th scope="row">{{ localizeExperimentText(item.label, locale) }}</th><td>{{ fixed(point.x, 3) }}</td><td>{{ fixed(point.y, 3) }}</td></tr></template>
          <tr v-if="measured !== null"><th scope="row">{{ localizeExperimentText('Measured', locale) }}</th><td>{{ fixed(marker, 3) }}</td><td>{{ fixed(measured, 3) }}</td></tr></tbody></table></div>
    </details>
    <figcaption class="legend">
      <span v-for="line in lines" :key="line.id"><i :class="['swatch', line.kind, { dashed: line.dashed }]" /> {{ localizeExperimentText(line.label, locale) }}</span>
      <span v-if="measured !== null"><i class="swatch measured-swatch" /> {{ localizeExperimentText('Measured', locale) }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.chart { margin: 0; }
.chart-data { margin-top: 8px; font-size: .84rem; }
.chart-data summary { cursor: pointer; color: var(--accent); font-weight: 600; }
.chart-scroll { max-width: 100%; overflow-x: auto; }
.chart-data table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.chart-data th, .chart-data td { padding: 6px 9px; border-bottom: 1px solid var(--border); text-align: left; white-space: nowrap; }
.chart-data th { color: var(--text-muted); }

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
  font-size: 13px;
  font-family: var(--font-mono);
  text-anchor: middle;
}

.tick.y {
  text-anchor: end;
}

.axis-title {
  fill: var(--text-muted);
  font-size: 14px;
  text-anchor: middle;
}

.marker {
  stroke: var(--text-muted);
  stroke-dasharray: 4 4;
}

.series {
  fill: none;
  stroke-width: 3.5;
  stroke-linejoin: round;
}

.series.galilean {
  stroke: var(--observer);
}

.series.lorentz {
  stroke: var(--accent);
  stroke-width: 6;
  opacity: 0.55;
}

.series.spacetime {
  stroke: var(--success);
}

.series.dashed {
  stroke-dasharray: 10 7;
}

.measured {
  fill: var(--text);
  stroke: var(--surface);
  stroke-width: 3;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 6px;
}

.legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.swatch {
  display: inline-block;
  width: 20px;
  height: 4px;
  border-radius: 2px;
}

.swatch.galilean {
  background: var(--observer);
}

.swatch.lorentz {
  background: var(--accent);
  opacity: 0.55;
  height: 6px;
}

.swatch.spacetime {
  background: var(--success);
}

.swatch.spacetime.dashed {
  background: repeating-linear-gradient(90deg, var(--success) 0 7px, transparent 7px 11px);
}

.measured-swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--text);
}
</style>
