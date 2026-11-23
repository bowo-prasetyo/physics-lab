<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { localizeExperimentText } from '@/i18n/experiment-ui'

const { locale } = useLocale()

export interface FieldGalaxy {
  readonly id: number
  /** Comoving position (Gly, measured today). */
  readonly x: number
  readonly y: number
}

const props = defineProps<{
  galaxies: readonly FieldGalaxy[]
  /**
   * Size of the repeating pattern (Gly, comoving). Offsets from the home
   * galaxy wrap around, so every galaxy is surrounded on all sides: the model
   * universe has no edge and no centre.
   */
  period: { x: number; y: number }
  home: number
  /** Scale factor a(t). */
  a: number
  /** Hubble rate H (1/Gyr), or null where the model is not valid. */
  hubble: number | null
  stage: 'breakdown' | 'plasma' | 'first-light' | 'dark-ages' | 'galaxies'
  temperature: number | null
}>()

const emit = defineEmits<{ select: [id: number] }>()

const W = 800
const H = 440
const CX = W / 2
const CY = H / 2
/** Pixels per billion light-years of actual (proper) distance. */
const PX_PER_GLY = 40
/** Arrow pixels per unit of c. */
const PX_PER_C = 60
const MAX_ARROW = 70

const homeGalaxy = computed(() => props.galaxies.find((g) => g.id === props.home) ?? props.galaxies[0])

const wrap = (v: number, period: number) => v - period * Math.round(v / period)

const placed = computed(() =>
  props.galaxies.map((g) => {
    const dx = wrap(g.x - (homeGalaxy.value?.x ?? 0), props.period.x)
    const dy = wrap(g.y - (homeGalaxy.value?.y ?? 0), props.period.y)
    // Proper separation = a × comoving separation.
    const px = CX + dx * props.a * PX_PER_GLY
    const py = CY + dy * props.a * PX_PER_GLY
    const d = Math.hypot(dx, dy) * props.a
    const speed = props.hubble === null ? 0 : props.hubble * d // fraction of c
    const len = Math.min(MAX_ARROW, speed * PX_PER_C)
    const ux = d > 0 ? dx / Math.hypot(dx, dy) : 0
    const uy = d > 0 ? dy / Math.hypot(dx, dy) : 0
    return {
      ...g,
      px,
      py,
      isHome: g.id === props.home,
      visible: px > -20 && px < W + 20 && py > -20 && py < H + 20,
      arrow: { x2: px + ux * len, y2: py + uy * len, show: len > 3 && g.id !== props.home },
      angle: (g.id * 47) % 180,
    }
  }),
)

const glow = computed(() => {
  if (props.stage === 'plasma' || props.stage === 'breakdown') return 0.85
  if (props.stage === 'first-light') return 0.4
  return 0
})

/** Caption for the early universe, as two short lines. */
const stageLines = computed<[string, string] | null>(() => {
  switch (props.stage) {
    case 'breakdown':
      return ['The classical model breaks down here.', 'It predicts infinite density: new physics (quantum gravity) is needed.']
    case 'plasma':
      return [
        `Hot, opaque plasma${props.temperature ? ` at about ${Math.round(props.temperature).toLocaleString('en-US')} K` : ''}.`,
        'Light cannot travel freely yet.',
      ]
    case 'first-light':
      return ['First light: the universe becomes transparent.', 'This light reaches us today as the 2.7 K microwave background.']
    case 'dark-ages':
      return ['Before the first galaxies.', 'Cooling gas, slowly clumping under gravity.']
    default:
      return null
  }
})
const stageText = computed(() => stageLines.value?.join(' ') ?? '')

const description = computed(
  () =>
    `Model universe with ${props.galaxies.length} galaxies on a grid, seen from the home galaxy. ` +
    `Distances are ${props.a.toFixed(3)} times today's. ${stageText.value} Arrows show recession speeds, longer for more distant galaxies.`,
)

function onKey(event: KeyboardEvent, id: number) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('select', id)
  }
}
</script>

<template>
  <figure class="field">
    <svg :viewBox="`0 0 ${W} ${H}`" role="group" :aria-label="localizeExperimentText(description, locale)">
      <defs>
        <radialGradient id="plasma-glow">
          <stop offset="0%" stop-color="#ffd27a" />
          <stop offset="60%" stop-color="#ff8a3d" />
          <stop offset="100%" stop-color="#7a1f12" />
        </radialGradient>
        <marker id="galaxy-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" class="arrow-head" />
        </marker>
      </defs>
      <rect x="0" y="0" :width="W" :height="H" class="space" />
      <rect v-if="glow" x="0" y="0" :width="W" :height="H" fill="url(#plasma-glow)" :opacity="glow" />

      <template v-if="stage === 'galaxies' || stage === 'dark-ages'">
        <g v-for="g in placed" :key="g.id">
          <template v-if="g.visible">
            <line
              v-if="g.arrow.show && stage === 'galaxies'"
              :x1="g.px"
              :y1="g.py"
              :x2="g.arrow.x2"
              :y2="g.arrow.y2"
              class="arrow"
              marker-end="url(#galaxy-arrow)"
            />
            <g
              v-if="stage === 'galaxies'"
              class="galaxy"
              :class="{ home: g.isHome }"
              role="button"
              tabindex="0"
              :aria-label="g.isHome ? localizeExperimentText('Home galaxy', locale) : localizeExperimentText('Make this galaxy home', locale)"
              @click="emit('select', g.id)"
              @keydown="onKey($event, g.id)"
            >
              <circle :cx="g.px" :cy="g.py" r="12" class="hit" />
              <ellipse :cx="g.px" :cy="g.py" rx="8" ry="3.5" :transform="`rotate(${g.angle} ${g.px} ${g.py})`" class="disc" />
              <circle :cx="g.px" :cy="g.py" r="2.2" class="core" />
              <circle v-if="g.isHome" :cx="g.px" :cy="g.py" r="14" class="ring" />
            </g>
            <circle v-else :cx="g.px" :cy="g.py" r="5" class="gas" />
          </template>
        </g>
        <text v-if="stage === 'galaxies'" :x="CX" :y="CY + 30" class="home-label">{{ localizeExperimentText('home', locale) }}</text>
      </template>

      <!-- Scale bar: a fixed physical length -->
      <g class="scale">
        <line :x1="20" :x2="20 + PX_PER_GLY" :y1="H - 20" :y2="H - 20" />
        <line :x1="20" :x2="20" :y1="H - 25" :y2="H - 15" />
        <line :x1="20 + PX_PER_GLY" :x2="20 + PX_PER_GLY" :y1="H - 25" :y2="H - 15" />
        <text :x="20" :y="H - 30">{{ localizeExperimentText('1 billion light-years', locale) }}</text>
      </g>
      <text v-if="stageLines" :x="CX" :y="34" class="stage-text">
        <tspan :x="CX" dy="0">{{ localizeExperimentText(stageLines[0], locale) }}</tspan>
        <tspan :x="CX" dy="22" class="second">{{ localizeExperimentText(stageLines[1], locale) }}</tspan>
      </text>
    </svg>
  </figure>
</template>

<style scoped>
.field {
  margin: 0;
}

svg {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
}

.space {
  fill: #0b1020;
}

.galaxy {
  cursor: pointer;
}

.galaxy:focus-visible {
  outline: none;
}

.galaxy:focus-visible .hit {
  stroke: #ffffff;
  stroke-width: 2;
}

.hit {
  fill: transparent;
}

.disc {
  fill: #b9c8ff;
  opacity: 0.85;
}

.core {
  fill: #ffffff;
}

.galaxy.home .disc {
  fill: #7ee2a8;
}

.ring {
  fill: none;
  stroke: #7ee2a8;
  stroke-width: 2;
}

.home-label {
  fill: #7ee2a8;
  font-size: 13px;
  font-weight: 700;
  text-anchor: middle;
}

.gas {
  fill: #8090b8;
  opacity: 0.35;
}

.arrow {
  stroke: #ffb37a;
  stroke-width: 2;
}

.arrow-head {
  fill: #ffb37a;
}

.scale line {
  stroke: #e6e9f0;
  stroke-width: 2;
}

.scale text {
  fill: #e6e9f0;
  font-size: 12px;
}

.stage-text .second {
  font-weight: 500;
}

.stage-text {
  fill: #ffffff;
  font-size: 17px;
  font-weight: 700;
  text-anchor: middle;
  paint-order: stroke;
  stroke: #0b1020;
  stroke-width: 4px;
}
</style>
