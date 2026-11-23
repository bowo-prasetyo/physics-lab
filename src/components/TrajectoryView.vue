<script setup lang="ts">
import { computed, useId } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { localizeExperimentText } from '@/i18n/experiment-ui'

const { locale } = useLocale()
import { stateAtTime, type ProjectileState } from '@/physics'

const props = defineProps<{
  /** The current flight, or null before a launch. */
  flight: readonly ProjectileState[] | null
  /** A ball dropped at the same moment, or null. */
  dropped: readonly ProjectileState[] | null
  /** Earlier flights (ground frame), drawn faintly. */
  history: readonly (readonly ProjectileState[])[]
  t: number
  /** Launch settings, for the launcher drawn before and during a flight. */
  speed: number
  angle: number
  height: number
  /** Horizontal velocity of the observer's frame (0: the ground). */
  frameVelocity: number
  showVectors: boolean
}>()

const id = useId()
const W = 800
const H = 360
const M = { left: 48, right: 16, top: 16, bottom: 40 }
const plotW = W - M.left - M.right
const plotH = H - M.top - M.bottom

const u = computed(() => props.frameVelocity)
/** Position as seen by the observer: x′ = x − u t (Galilean). */
const view = (s: { t: number; x: number; y: number }) => ({ x: s.x - u.value * s.t, y: s.y })

const bounds = computed(() => {
  const pts: { x: number; y: number }[] = [{ x: 0, y: props.height }, { x: 0, y: 0 }]
  for (const f of [props.flight, props.dropped]) if (f) for (const s of f) pts.push(view(s))
  if (u.value === 0) for (const f of props.history) for (const s of f) pts.push(s)
  const lo = Math.min(...pts.map((p) => p.x))
  const hi = Math.max(...pts.map((p) => p.x))
  const yMax = Math.max(5, Math.max(...pts.map((p) => p.y)) * 1.1)
  // At least 10 m wide, with a margin; the same scale on both axes, so the path has its true shape.
  const spanX = Math.max(10, (hi - lo) * 1.12)
  const scale = Math.min(plotW / spanX, plotH / yMax)
  // Centre the content horizontally in the visible width (at least spanX, so there is always a margin).
  const xMin = (lo + hi) / 2 - plotW / scale / 2
  return { xMin, scale }
})

const sx = (x: number) => M.left + (x - bounds.value.xMin) * bounds.value.scale
const sy = (y: number) => M.top + plotH - y * bounds.value.scale

const niceStep = (span: number) => {
  const raw = span / 8
  const p = 10 ** Math.floor(Math.log10(raw))
  return [1, 2, 5, 10].map((m) => m * p).find((s) => s >= raw) ?? 10 * p
}
const visibleWidth = computed(() => plotW / bounds.value.scale)
const step = computed(() => niceStep(visibleWidth.value))

// Ground markers are fixed to the ground, so in the train's frame they slide backwards.
const groundTicks = computed(() => {
  const shift = u.value * props.t
  const start = Math.floor((bounds.value.xMin + shift) / step.value) * step.value
  const ticks: { pos: number; label: number }[] = []
  for (let x = start; x - shift <= bounds.value.xMin + visibleWidth.value; x += step.value) ticks.push({ pos: x - shift, label: x })
  return ticks
})
const heightTicks = computed(() => {
  const ticks: number[] = []
  const max = plotH / bounds.value.scale
  for (let y = 0; y <= max; y += step.value) ticks.push(y)
  return ticks
})

const pathUpTo = (flight: readonly ProjectileState[], t: number) => {
  const pts = flight.filter((s) => s.t <= t).map(view)
  const now = view(stateAtTime(flight, t))
  pts.push(now)
  return pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(' ')
}
const fullPath = (flight: readonly ProjectileState[]) => flight.map((s, i) => `${i ? 'L' : 'M'}${sx(s.x).toFixed(1)},${sy(s.y).toFixed(1)}`).join(' ')

const ball = computed(() => (props.flight ? stateAtTime(props.flight, props.t) : null))
const droppedBall = computed(() => (props.dropped ? stateAtTime(props.dropped, props.t) : null))
const tower = computed(() => view({ t: props.t, x: 0, y: props.height }))

const launcher = computed(() => {
  const theta = (props.angle * Math.PI) / 180
  const len = 18 + props.speed * 1.2
  const x = sx(tower.value.x)
  const y = sy(props.height)
  return { x1: x, y1: y, x2: x + len * Math.cos(theta), y2: y - len * Math.sin(theta) }
})

const ARROW_PX = 2.5
const vectors = computed(() => {
  if (!ball.value || !props.showVectors) return null
  const p = view(ball.value)
  const x = sx(p.x)
  const y = sy(p.y)
  const vx = ball.value.vx - u.value
  return {
    x,
    y,
    hx: x + vx * ARROW_PX,
    vy: y - ball.value.vy * ARROW_PX,
    showX: Math.abs(vx) * ARROW_PX > 4,
    showY: Math.abs(ball.value.vy) * ARROW_PX > 4,
  }
})

const description = computed(() => {
  const where = u.value === 0 ? 'seen from the ground' : `seen from a train moving at ${u.value} m/s`
  if (!ball.value) return `Launcher ready, ${where}: ${props.speed} m/s at ${props.angle} degrees from ${props.height} m.`
  return `Ball ${where}, at ${view(ball.value).x.toFixed(1)} m across and ${ball.value.y.toFixed(1)} m up, after ${props.t.toFixed(2)} s.`
})
</script>

<template>
  <figure class="trajectory">
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="localizeExperimentText(description, locale)">
      <defs>
        <clipPath :id="`${id}-plot`"><rect :x="M.left" :y="0" :width="plotW" :height="H - 18" /></clipPath>
        <marker :id="`${id}-vx`" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="head-x" /></marker>
        <marker :id="`${id}-vy`" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="head-y" /></marker>
      </defs>

      <g :clip-path="`url(#${id}-plot)`">
        <line v-for="h in heightTicks" :key="`h${h}`" :x1="M.left" :x2="M.left + plotW" :y1="sy(h)" :y2="sy(h)" class="grid" />
        <rect :x="M.left" :y="sy(0)" :width="plotW" height="6" class="ground" />
        <g v-for="tick in groundTicks" :key="`g${tick.label}`">
          <line :x1="sx(tick.pos)" :x2="sx(tick.pos)" :y1="sy(0)" :y2="sy(0) + 8" class="ground-tick" />
          <text :x="sx(tick.pos)" :y="sy(0) + 22" class="tick">{{ tick.label }}</text>
        </g>

        <template v-if="frameVelocity === 0">
          <path v-for="(f, i) in history" :key="`hist${i}`" :d="fullPath(f)" class="history" />
        </template>

        <rect v-if="height > 0" :x="sx(tower.x) - 4" :y="sy(height)" width="8" :height="sy(0) - sy(height)" class="tower" />
        <line v-if="!flight" v-bind="launcher" class="launcher" />

        <path v-if="dropped" :d="pathUpTo(dropped, t)" class="trace dropped" />
        <path v-if="flight" :d="pathUpTo(flight, t)" class="trace" />
        <circle v-if="droppedBall" :cx="sx(view(droppedBall).x)" :cy="sy(droppedBall.y)" r="7" class="ball dropped" />
        <circle v-if="ball" :cx="sx(view(ball).x)" :cy="sy(ball.y)" r="7" class="ball" />

        <template v-if="vectors">
          <line v-if="vectors.showX" :x1="vectors.x" :y1="vectors.y" :x2="vectors.hx" :y2="vectors.y" class="vx" :marker-end="`url(#${id}-vx)`" />
          <line v-if="vectors.showY" :x1="vectors.x" :y1="vectors.y" :x2="vectors.x" :y2="vectors.vy" class="vy" :marker-end="`url(#${id}-vy)`" />
        </template>
      </g>

      <text v-for="h in heightTicks" :key="`lh${h}`" :x="M.left - 6" :y="sy(h) + 4" class="tick y">{{ h }}</text>
      <text :x="M.left + plotW / 2" :y="H - 4" class="axis-title">
        {{ localizeExperimentText('distance along the ground (m)', locale) }}{{ frameVelocity !== 0 ? ` — ${localizeExperimentText('the ground slides backwards past the train', locale)}` : '' }}
      </text>
      <text :x="12" :y="M.top + plotH / 2" class="axis-title" :transform="`rotate(-90 12 ${M.top + plotH / 2})`">{{ localizeExperimentText('height (m)', locale) }}</text>
    </svg>
    <details class="trajectory-data">
      <summary>{{ localizeExperimentText('Read the current projectile measurements as a table', locale) }}</summary>
      <table><thead><tr><th scope="col">{{ localizeExperimentText('Object', locale) }}</th><th scope="col">{{ localizeExperimentText('Horizontal position', locale) }}</th><th scope="col">{{ localizeExperimentText('Height', locale) }}</th><th scope="col">{{ localizeExperimentText('Horizontal velocity', locale) }}</th><th scope="col">{{ localizeExperimentText('Vertical velocity', locale) }}</th></tr></thead>
        <tbody>
          <tr v-if="ball"><th scope="row">{{ localizeExperimentText('Launched ball', locale) }}</th><td>{{ view(ball).x.toFixed(2) }} m</td><td>{{ ball.y.toFixed(2) }} m</td><td>{{ (ball.vx - u).toFixed(2) }} m/s</td><td>{{ ball.vy.toFixed(2) }} m/s</td></tr>
          <tr v-if="droppedBall"><th scope="row">{{ localizeExperimentText('Dropped ball', locale) }}</th><td>{{ view(droppedBall).x.toFixed(2) }} m</td><td>{{ droppedBall.y.toFixed(2) }} m</td><td>{{ (droppedBall.vx - u).toFixed(2) }} m/s</td><td>{{ droppedBall.vy.toFixed(2) }} m/s</td></tr>
          <tr v-if="!ball && !droppedBall"><th scope="row">{{ localizeExperimentText('Before launch', locale) }}</th><td>0.00 m</td><td>{{ height.toFixed(2) }} m</td><td>{{ localizeExperimentText('Not moving', locale) }}</td><td>{{ localizeExperimentText('Not moving', locale) }}</td></tr>
        </tbody>
      </table>
      <p class="muted small">{{ localizeExperimentText('Positions and velocities are measured in', locale) }} {{ localizeExperimentText(frameVelocity === 0 ? 'the ground frame' : 'the moving observer’s frame', locale) }} at t = {{ t.toFixed(2) }} s.</p>
    </details>
  </figure>
</template>

<style scoped>
.trajectory { margin: 0; }
.trajectory-data { margin-top: 8px; font-size: .84rem; }
.trajectory-data summary { cursor: pointer; color: var(--accent); font-weight: 600; }
.trajectory-data table { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.trajectory-data th, .trajectory-data td { padding: 7px 9px; border-bottom: 1px solid var(--border); text-align: left; white-space: nowrap; }
.trajectory-data th { color: var(--text-muted); }
.trajectory-data .small { margin: 8px 0 0; }

svg {
  display: block;
  width: 100%;
  height: auto;
}

.grid {
  stroke: var(--grid);
}

.ground {
  fill: var(--success);
  opacity: 0.35;
}

.ground-tick {
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

.tower {
  fill: var(--axis);
}

.launcher {
  stroke: var(--accent);
  stroke-width: 6;
  stroke-linecap: round;
  opacity: 0.8;
}

.history {
  fill: none;
  stroke: var(--history-1);
  stroke-width: 2;
  stroke-dasharray: 6 5;
}

.trace {
  fill: none;
  stroke: var(--accent);
  stroke-width: 3;
}

.trace.dropped {
  stroke: var(--observer);
}

.ball {
  fill: var(--accent);
  stroke: var(--surface);
  stroke-width: 2.5;
}

.ball.dropped {
  fill: var(--observer);
}

.vx {
  stroke: var(--success);
  stroke-width: 3;
}

.vy {
  stroke: var(--warn);
  stroke-width: 3;
}

.head-x {
  fill: var(--success);
}

.head-y {
  fill: var(--warn);
}
</style>
