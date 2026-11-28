<script setup lang="ts">
import { fixed, formatNumber, significant } from '@/i18n/formatters'
import { computed, useId } from 'vue'
import type { Expansion } from '@/physics'
import { niceCeil } from './chartScale'
import { useLocale } from '@/composables/useLocale'
import { localizeExperimentText } from '@/i18n/experiment-ui'

const { locale } = useLocale()

const props = defineProps<{
  expansion: Expansion
  /** Our universe, drawn faintly for comparison (aligned at today), or null. */
  compare: Expansion | null
  t: number
  /** Time when the expansion starts speeding up, to mark it, or null. */
  accelerationTime: number | null
}>()

const id = useId()
const W = 800
const H = 280
const M = { left: 54, right: 20, top: 14, bottom: 46 }
const plotW = W - M.left - M.right
const plotH = H - M.top - M.bottom

const tMin = computed(() => props.expansion.tMin)
const tMax = computed(() => props.expansion.tMax)
const sample = (e: Expansion, shift: number) => {
  const pts: { t: number; a: number }[] = []
  const n = 300
  for (let i = 0; i <= n; i++) {
    const t = tMin.value + ((tMax.value - tMin.value) * i) / n
    pts.push({ t, a: e.scaleFactorAt(t - shift) })
  }
  return pts
}

const main = computed(() => sample(props.expansion, 0))
// Align the comparison curve so both reach a = 1 at the same moment ("today").
const other = computed(() => (props.compare ? sample(props.compare, props.expansion.tToday - props.compare.tToday) : null))
const yMax = computed(() => niceCeil(Math.max(...main.value.map((p) => p.a), ...(other.value?.map((p) => p.a) ?? [0]))))

const sx = (t: number) => M.left + ((t - tMin.value) / (tMax.value - tMin.value)) * plotW
const sy = (a: number) => M.top + (1 - Math.min(a, yMax.value * 1.05) / yMax.value) * plotH
const path = (pts: { t: number; a: number }[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p.t).toFixed(1)},${sy(p.a).toFixed(1)}`).join(' ')

const xTicks = computed(() => {
  const span = tMax.value - tMin.value
  const step = span > 30 ? 10 : 5
  const ticks: number[] = []
  for (let t = Math.ceil(tMin.value / step) * step; t <= tMax.value; t += step) ticks.push(t)
  return ticks
})
const yTicks = computed(() => [0, 0.25, 0.5, 0.75, 1].map((f) => f * yMax.value))
const current = computed(() => ({ x: sx(props.t), y: sy(props.expansion.scaleFactorAt(props.t)) }))
const xLabel = computed(() => (props.expansion.hasBigBang ? 'time since the Big Bang (billion years)' : 'time relative to today (billion years)'))
</script>

<template>
  <figure class="chart">
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="localizeExperimentText(`Scale factor a against time. ${xLabel}. Today a = 1.`, locale)">
      <defs>
        <clipPath :id="`${id}-plot`"><rect :x="M.left" :y="M.top - 6" :width="plotW + 6" :height="plotH + 6" /></clipPath>
      </defs>
      <g class="grid">
        <line v-for="t in xTicks" :key="`gx${t}`" :x1="sx(t)" :x2="sx(t)" :y1="M.top" :y2="M.top + plotH" />
        <line v-for="a in yTicks" :key="`gy${a}`" :x1="M.left" :x2="M.left + plotW" :y1="sy(a)" :y2="sy(a)" />
      </g>
      <text v-for="t in xTicks" :key="`lx${t}`" :x="sx(t)" :y="M.top + plotH + 18" class="tick">{{ formatNumber(t, { maximumFractionDigits: 0 }) }}</text>
      <text v-for="a in yTicks" :key="`ly${a}`" :x="M.left - 8" :y="sy(a) + 4" class="tick y">{{ significant(a, 3) }}</text>
      <text :x="M.left + plotW / 2" :y="H - 6" class="axis-title">{{ localizeExperimentText(xLabel, locale) }}</text>
      <text :x="14" :y="M.top + plotH / 2" class="axis-title" :transform="`rotate(-90 14 ${M.top + plotH / 2})`">{{ localizeExperimentText('scale factor a', locale) }}</text>

      <g :clip-path="`url(#${id}-plot)`">
        <line :x1="sx(expansion.tToday)" :x2="sx(expansion.tToday)" :y1="M.top" :y2="M.top + plotH" class="today" />
        <line :x1="M.left" :x2="M.left + plotW" :y1="sy(1)" :y2="sy(1)" class="today" />
        <text :x="sx(expansion.tToday) + 4" :y="M.top + 12" class="today-label">{{ localizeExperimentText('today', locale) }}</text>
        <path v-if="other" :d="path(other)" class="curve compare" />
        <path :d="path(main)" class="curve" />
        <template v-if="accelerationTime !== null">
          <circle :cx="sx(accelerationTime)" :cy="sy(expansion.scaleFactorAt(accelerationTime))" r="5" class="onset" />
          <text :x="sx(accelerationTime) - 8" :y="sy(expansion.scaleFactorAt(accelerationTime)) - 10" class="onset-label">{{ localizeExperimentText('starts speeding up', locale) }}</text>
        </template>
        <circle :cx="current.x" :cy="current.y" r="7" class="now" />
      </g>
    </svg>
    <details class="chart-data">
      <summary>{{ localizeExperimentText('Read the current model values', locale) }}</summary>
      <table><tbody>
        <tr><th scope="row">{{ localizeExperimentText('Selected time', locale) }}</th><td>{{ fixed(t, 3) }} {{ localizeExperimentText('billion years', locale) }}</td></tr>
        <tr><th scope="row">{{ localizeExperimentText('Scale factor at selected time', locale) }}</th><td>{{ significant(expansion.scaleFactorAt(t), 5) }}</td></tr>
        <tr><th scope="row">{{ localizeExperimentText('Scale factor today', locale) }}</th><td>1</td></tr>
        <tr v-if="accelerationTime !== null"><th scope="row">{{ localizeExperimentText('Acceleration begins', locale) }}</th><td>{{ fixed(accelerationTime, 3) }} {{ localizeExperimentText('billion years', locale) }}</td></tr>
      </tbody></table>
    </details>
    <figcaption class="legend">
      <span><i class="swatch main" /> {{ localizeExperimentText('This model', locale) }}</span>
      <span v-if="other"><i class="swatch compare" /> {{ localizeExperimentText('Our universe, for comparison', locale) }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.chart { margin: 0; }
.chart-data { margin-top: 8px; font-size: .84rem; }
.chart-data summary { cursor: pointer; color: var(--accent); font-weight: 600; }
.chart-data table { width: 100%; border-collapse: collapse; }
.chart-data th, .chart-data td { padding: 6px 9px; border-bottom: 1px solid var(--border); text-align: left; }
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

.today {
  stroke: var(--text-muted);
  stroke-dasharray: 4 4;
}

.today-label {
  fill: var(--text-muted);
  font-size: 12px;
}

.curve {
  fill: none;
  stroke: var(--accent);
  stroke-width: 3.5;
}

.curve.compare {
  stroke: var(--text-muted);
  stroke-width: 2;
  stroke-dasharray: 8 6;
  opacity: 0.7;
}

.onset {
  fill: var(--observer);
}

.onset-label {
  fill: var(--observer);
  font-size: 12px;
  font-weight: 700;
  text-anchor: end;
  paint-order: stroke;
  stroke: var(--surface);
  stroke-width: 3px;
}

.now {
  fill: var(--accent);
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

.swatch.main {
  background: var(--accent);
}

.swatch.compare {
  background: repeating-linear-gradient(90deg, var(--text-muted) 0 7px, transparent 7px 11px);
}
</style>
