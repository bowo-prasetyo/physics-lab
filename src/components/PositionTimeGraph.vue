<script setup lang="ts">
import { computed, useId } from 'vue'
import { galileanBoost, graphVertices, type RunRecord } from '@/physics'
import { useLocale } from '@/composables/useLocale'
import { localizeExperimentText } from '@/i18n/experiment-ui'

const { locale } = useLocale()

const props = defineProps<{
  current: RunRecord
  history: readonly RunRecord[]
  duration: number
  bounds: { min: number; max: number }
  /** When set, also plot the current run as measured by an observer moving at this velocity. */
  observerVelocity: number | null
}>()

const id = useId()
const W = 800
const H = 380
const M = { left: 58, right: 18, top: 14, bottom: 46 }
const plotW = W - M.left - M.right
const plotH = H - M.top - M.bottom

const sx = (t: number) => M.left + (t / props.duration) * plotW
const sy = (x: number) => M.top + ((props.bounds.max - x) / (props.bounds.max - props.bounds.min)) * plotH

const toPoints = (vertices: { t: number; x: number }[]) => vertices.map((p) => `${sx(p.t).toFixed(1)},${sy(p.x).toFixed(1)}`).join(' ')

const timeTicks = computed(() => Array.from({ length: Math.floor(props.duration) + 1 }, (_, i) => i))
const positionTicks = computed(() => {
  const list: number[] = []
  for (let x = props.bounds.min; x <= props.bounds.max; x += 2) list.push(x)
  return list
})

const currentVertices = computed(() => graphVertices(props.current))
const currentEnd = computed(() => currentVertices.value[currentVertices.value.length - 1] ?? { t: 0, x: props.current.x0 })

const observerVertices = computed(() =>
  props.observerVelocity === null || props.observerVelocity === 0
    ? null
    : currentVertices.value.map((p) => galileanBoost(p, props.observerVelocity as number)),
)
const observerEnd = computed(() => observerVertices.value?.[observerVertices.value.length - 1] ?? null)

const historyColours = ['var(--history-3)', 'var(--history-2)', 'var(--history-1)']
const historyLines = computed(() =>
  props.history.map((record, i) => ({
    key: i,
    points: toPoints(graphVertices(record)),
    colour: historyColours[i + historyColours.length - props.history.length] ?? 'var(--history-1)',
    label: describeRun(record),
  })),
)

function describeRun(record: RunRecord): string {
  const first = record.segments[0]
  if (record.segments.length === 1 && first) return `v = ${first.v.toFixed(1)} m/s`
  return 'velocity changed during run'
}

const description = computed(() => {
  const end = currentEnd.value
  return (
    `Graph of position x against time t. The current run is at t = ${end.t.toFixed(2)} s, x = ${end.x.toFixed(2)} m. ` +
    (props.history.length ? `${props.history.length} earlier run(s) are shown for comparison.` : '')
  )
})
</script>

<template>
  <figure class="graph">
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="localizeExperimentText(description, locale)">
      <defs>
        <clipPath :id="`${id}-plot`">
          <rect :x="M.left" :y="M.top" :width="plotW" :height="plotH" />
        </clipPath>
      </defs>

      <!-- Grid and axes -->
      <g class="grid">
        <line v-for="t in timeTicks" :key="`gt${t}`" :x1="sx(t)" :x2="sx(t)" :y1="M.top" :y2="M.top + plotH" />
        <line v-for="x in positionTicks" :key="`gx${x}`" :x1="M.left" :x2="M.left + plotW" :y1="sy(x)" :y2="sy(x)" />
      </g>
      <line class="axis" :x1="M.left" :x2="M.left + plotW" :y1="sy(0)" :y2="sy(0)" />
      <line class="axis" :x1="M.left" :x2="M.left" :y1="M.top" :y2="M.top + plotH" />
      <text v-for="t in timeTicks" :key="`lt${t}`" :x="sx(t)" :y="M.top + plotH + 18" class="tick-label">{{ t }}</text>
      <text v-for="x in positionTicks" :key="`lx${x}`" :x="M.left - 8" :y="sy(x) + 4" class="tick-label y">{{ x }}</text>
      <text :x="M.left + plotW / 2" :y="H - 6" class="axis-title">{{ localizeExperimentText('time t (s)', locale) }}</text>
      <text :x="14" :y="M.top + plotH / 2" class="axis-title" :transform="`rotate(-90 14 ${M.top + plotH / 2})`">{{ localizeExperimentText('position x (m)', locale) }}</text>

      <g :clip-path="`url(#${id}-plot)`">
        <!-- Earlier runs -->
        <polyline v-for="line in historyLines" :key="line.key" :points="line.points" class="trace history" :style="{ stroke: line.colour }" />

        <!-- Same motion, measured by the moving observer -->
        <template v-if="observerVertices">
          <polyline :points="toPoints(observerVertices)" class="trace observer" />
          <circle v-if="observerEnd" :cx="sx(observerEnd.t)" :cy="sy(observerEnd.x)" r="5" class="dot observer-dot" />
        </template>

        <!-- Current run -->
        <polyline :points="toPoints(currentVertices)" class="trace current" />
        <circle :cx="sx(currentEnd.t)" :cy="sy(currentEnd.x)" r="6" class="dot" />
      </g>
    </svg>

    <details class="graph-data">
      <summary>{{ localizeExperimentText('Read the position–time values as a table', locale) }}</summary>
      <div class="table-scroll"><table><thead><tr><th scope="col">{{ localizeExperimentText('Run / observer', locale) }}</th><th scope="col">{{ localizeExperimentText('Time', locale) }}</th><th scope="col">{{ localizeExperimentText('Position', locale) }}</th></tr></thead>
        <tbody>
          <tr><th scope="row">{{ localizeExperimentText('Current run', locale) }}</th><td>{{ currentEnd.t.toFixed(2) }} s</td><td>{{ currentEnd.x.toFixed(2) }} m</td></tr>
          <tr v-if="observerEnd"><th scope="row">{{ localizeExperimentText('Moving observer', locale) }}</th><td>{{ observerEnd.t.toFixed(2) }} s</td><td>{{ observerEnd.x.toFixed(2) }} m</td></tr>
          <tr v-for="(record, index) in history" :key="index"><th scope="row">Earlier run {{ index + 1 }} ({{ describeRun(record) }})</th><td>{{ graphVertices(record).at(-1)?.t.toFixed(2) }} s</td><td>{{ graphVertices(record).at(-1)?.x.toFixed(2) }} m</td></tr>
        </tbody></table></div>
    </details>
    <figcaption class="legend">
      <span><i class="swatch current" /> {{ localizeExperimentText('Current run', locale) }}</span>
      <span v-if="observerVertices"><i class="swatch observer" /> {{ localizeExperimentText('Same run, measured by the moving observer', locale) }}</span>
      <span v-for="line in historyLines" :key="line.key"><i class="swatch" :style="{ background: line.colour }" /> {{ localizeExperimentText('Earlier', locale) }}: {{ line.label }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.graph { margin: 0; }
.graph-data { margin-top: 8px; font-size: .84rem; }
.graph-data summary { cursor: pointer; color: var(--accent); font-weight: 600; }
.graph-data table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.graph-data th, .graph-data td { padding: 6px 9px; border-bottom: 1px solid var(--border); text-align: left; white-space: nowrap; }
.graph-data th { color: var(--text-muted); }
.graph-data .table-scroll { max-width: 100%; overflow-x: auto; }

svg {
  display: block;
  width: 100%;
  height: auto;
}

.grid line {
  stroke: var(--grid);
  stroke-width: 1;
}

.axis {
  stroke: var(--axis);
  stroke-width: 1.5;
}

.tick-label {
  fill: var(--text-muted);
  font-size: 13px;
  font-family: var(--font-mono);
  text-anchor: middle;
}

.tick-label.y {
  text-anchor: end;
}

.axis-title {
  fill: var(--text-muted);
  font-size: 14px;
  text-anchor: middle;
}

.trace {
  fill: none;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.trace.current {
  stroke: var(--accent);
  stroke-width: 3.5;
}

.trace.history {
  stroke-width: 2.5;
}

.trace.observer {
  stroke: var(--observer);
  stroke-width: 3;
  stroke-dasharray: 8 6;
}

.dot {
  fill: var(--accent);
  stroke: var(--surface);
  stroke-width: 2;
}

.observer-dot {
  fill: var(--observer);
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
  width: 18px;
  height: 4px;
  border-radius: 2px;
}

.swatch.current {
  background: var(--accent);
}

.swatch.observer {
  background: repeating-linear-gradient(90deg, var(--observer) 0 6px, transparent 6px 9px);
}
</style>
