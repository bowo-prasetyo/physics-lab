<script setup lang="ts">
import { computed, onMounted, ref, useId } from 'vue'
import { properTimeTicks, simultaneousTimeAt, type Event1D } from '@/physics'

export interface DiagramWorldline {
  readonly id: string
  readonly label: string
  /** Velocity in the diagram's frame, as a fraction of c. */
  readonly velocity: number
  readonly kind: 'earth' | 'ship'
  /** Which side of the line the tick labels go on. */
  readonly side: 'left' | 'right'
}

export interface DiagramSimultaneity {
  /** Velocity (in this frame) of the observer whose "now" is drawn. */
  readonly velocity: number
  /** The observer's current event; the line passes through it. */
  readonly through: Event1D
  readonly label: string
  /** Where the line crosses x = 0, and what to call that point. */
  readonly meets: { readonly t: number; readonly label: string }
}

const props = defineProps<{
  duration: number
  t: number
  worldlines: readonly DiagramWorldline[]
  simultaneity: DiagramSimultaneity | null
  frameName: string
}>()

const id = useId()

// When the diagram is wider than the screen, start centred on x = 0, where
// both worldlines begin.
const scroller = ref<HTMLElement | null>(null)
onMounted(() => {
  const el = scroller.value
  if (el && el.scrollWidth > el.clientWidth) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
})
const W = 800
const M = { left: 46, right: 20, top: 16, bottom: 44 }
const plotW = W - M.left - M.right
// Equal scales on both axes, so light rays are drawn at 45°.
const k = computed(() => plotW / (2 * props.duration))
const plotH = computed(() => props.duration * k.value)
const H = computed(() => M.top + plotH.value + M.bottom)

const sx = (x: number) => M.left + (x + props.duration) * k.value
const sy = (t: number) => M.top + (props.duration - t) * k.value

const xTicks = computed(() => {
  const list: number[] = []
  for (let x = -props.duration; x <= props.duration; x += 2) list.push(x)
  return list
})
const tTicks = computed(() => {
  const list: number[] = []
  for (let t = 0; t <= props.duration; t += 2) list.push(t)
  return list
})

const lines = computed(() =>
  props.worldlines.map((w) => {
    const now = { t: props.t, x: w.velocity * props.t }
    return {
      ...w,
      end: { t: props.duration, x: w.velocity * props.duration },
      ticks: properTimeTicks(w.velocity, props.duration),
      now,
      dx: w.side === 'left' ? -10 : 10,
      anchor: w.side === 'left' ? 'end' : 'start',
    }
  }),
)

const simultaneityLine = computed(() => {
  const s = props.simultaneity
  if (!s) return null
  const x1 = -props.duration
  const x2 = props.duration
  // The moving observer's worldline is on the side of its velocity; label the other side.
  const leftward = s.velocity > 0
  return {
    ...s,
    labelDx: leftward ? -10 : 10,
    labelAnchor: leftward ? 'end' : 'start',
    a: { x: x1, t: simultaneousTimeAt(s.velocity, s.through, x1) },
    b: { x: x2, t: simultaneousTimeAt(s.velocity, s.through, x2) },
  }
})

const description = computed(() => {
  const parts = lines.value.map((l) => `${l.label} worldline with velocity ${l.velocity.toFixed(2)}c`)
  return `Spacetime diagram seen from ${props.frameName}: time t upwards, position x across, light rays at 45 degrees. ${parts.join('; ')}. Current time ${props.t.toFixed(2)} s.`
})
</script>

<template>
  <figure class="diagram">
    <!-- On narrow screens the diagram keeps a readable size and scrolls sideways. -->
    <div ref="scroller" class="scroll" tabindex="0" aria-label="Spacetime diagram (scrolls sideways on small screens)">
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="description">
      <defs>
        <clipPath :id="`${id}-plot`">
          <rect :x="M.left" :y="M.top" :width="plotW" :height="plotH" />
        </clipPath>
      </defs>

      <!-- Grid and axes -->
      <g class="grid">
        <line v-for="x in xTicks" :key="`gx${x}`" :x1="sx(x)" :x2="sx(x)" :y1="M.top" :y2="M.top + plotH" />
        <line v-for="t in tTicks" :key="`gt${t}`" :x1="M.left" :x2="M.left + plotW" :y1="sy(t)" :y2="sy(t)" />
      </g>
      <text v-for="x in xTicks" :key="`lx${x}`" :x="sx(x)" :y="M.top + plotH + 18" class="tick-label">{{ x }}</text>
      <text v-for="t in tTicks" :key="`lt${t}`" :x="M.left - 8" :y="sy(t) + 4" class="tick-label y">{{ t }}</text>
      <text :x="M.left + plotW / 2" :y="H - 6" class="axis-title">position x (light-seconds)</text>
      <text :x="14" :y="M.top + plotH / 2" class="axis-title" :transform="`rotate(-90 14 ${M.top + plotH / 2})`">time t (s)</text>

      <g :clip-path="`url(#${id}-plot)`">
        <!-- Everything below "now" has already happened, in this frame -->
        <rect :x="M.left" :y="sy(t)" :width="plotW" :height="sy(0) - sy(t)" class="past" />

        <!-- Light rays through the passing event -->
        <line :x1="sx(0)" :y1="sy(0)" :x2="sx(duration)" :y2="sy(duration)" class="light" />
        <line :x1="sx(0)" :y1="sy(0)" :x2="sx(-duration)" :y2="sy(duration)" class="light" />
        <text :x="sx(duration) - 6" :y="sy(duration) + 16" class="light-label" text-anchor="end">light</text>
        <text :x="sx(-duration) + 6" :y="sy(duration) + 16" class="light-label">light</text>

        <!-- The moving observer's "now" -->
        <template v-if="simultaneityLine">
          <line
            :x1="sx(simultaneityLine.a.x)"
            :y1="sy(simultaneityLine.a.t)"
            :x2="sx(simultaneityLine.b.x)"
            :y2="sy(simultaneityLine.b.t)"
            class="simultaneity"
          />
          <circle :cx="sx(0)" :cy="sy(simultaneityLine.meets.t)" r="6" class="meets" />
          <text
            :x="sx(0) + simultaneityLine.labelDx"
            :y="sy(simultaneityLine.meets.t) + 4"
            class="meets-label"
            :text-anchor="simultaneityLine.labelAnchor"
          >
            {{ simultaneityLine.meets.label }}
          </text>
        </template>

        <!-- This frame's "now" -->
        <line :x1="M.left" :x2="M.left + plotW" :y1="sy(t)" :y2="sy(t)" class="now" />
        <text :x="M.left + 6" :y="sy(t) - 6 < M.top + 14 ? sy(t) + 16 : sy(t) - 6" class="now-label">now in {{ frameName }}: t = {{ t.toFixed(2) }} s</text>

        <!-- Worldlines with a tick at every second of proper time -->
        <g v-for="line in lines" :key="line.id" :class="['worldline', line.kind]">
          <line :x1="sx(0)" :y1="sy(0)" :x2="sx(line.end.x)" :y2="sy(line.end.t)" />
          <g v-for="tick in line.ticks" :key="tick.tau">
            <circle :cx="sx(tick.x)" :cy="sy(tick.t)" r="3.5" class="tick" />
            <text
              v-if="tick.tau > 0"
              :x="sx(tick.x) + line.dx"
              :y="sy(tick.t) + 4"
              :text-anchor="line.anchor"
              class="tick-text"
            >
              {{ tick.tau }}
            </text>
          </g>
          <circle :cx="sx(line.now.x)" :cy="sy(line.now.t)" r="8" class="clock" />
        </g>
      </g>

    </svg>
    </div>

    <figcaption class="legend">
      <span v-for="line in lines" :key="line.id"><i :class="['swatch', line.kind]" /> {{ line.label }} (dots: each second on its own clock)</span>
      <span><i class="swatch light" /> Light (45°)</span>
      <span v-if="simultaneityLine"><i class="swatch simultaneity" /> {{ simultaneityLine.label }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.diagram {
  margin: 0;
}

svg {
  display: block;
  width: 100%;
  height: auto;
}

.scroll {
  overflow-x: auto;
}

@media (max-width: 640px) {
  svg {
    min-width: 600px;
  }
}

.grid line {
  stroke: var(--grid);
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

.past {
  fill: var(--accent-soft);
  opacity: 0.45;
}

.light {
  stroke: var(--warn);
  stroke-width: 2;
  stroke-dasharray: 3 5;
}

.light-label {
  fill: var(--warn);
  font-size: 12px;
  font-weight: 700;
}

.now {
  stroke: var(--text-muted);
  stroke-width: 1.5;
}

.now-label {
  fill: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
}

.simultaneity {
  stroke: var(--observer);
  stroke-width: 2.5;
  stroke-dasharray: 9 6;
}

.meets {
  fill: var(--surface);
  stroke: var(--observer);
  stroke-width: 2.5;
}

.meets-label {
  fill: var(--observer);
  font-size: 12px;
  font-weight: 700;
}

.worldline line {
  stroke-width: 3;
}

.worldline.earth line {
  stroke: var(--success);
}

.worldline.ship line {
  stroke: var(--accent);
}

.worldline.earth .tick,
.worldline.earth .clock {
  fill: var(--success);
}

.worldline.ship .tick,
.worldline.ship .clock {
  fill: var(--accent);
}

.clock {
  stroke: var(--surface);
  stroke-width: 2.5;
}

.tick-text {
  font-size: 11px;
  font-family: var(--font-mono);
  fill: var(--text-muted);
}

.light-label,
.now-label,
.meets-label,
.tick-text {
  paint-order: stroke;
  stroke: var(--surface);
  stroke-width: 3px;
  stroke-linejoin: round;
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

.swatch.earth {
  background: var(--success);
}

.swatch.ship {
  background: var(--accent);
}

.swatch.light {
  background: repeating-linear-gradient(90deg, var(--warn) 0 3px, transparent 3px 7px);
}

.swatch.simultaneity {
  background: repeating-linear-gradient(90deg, var(--observer) 0 7px, transparent 7px 11px);
}
</style>
