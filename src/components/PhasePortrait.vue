<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { localizeExperimentText } from '@/i18n/experiment-ui'

const { locale } = useLocale()

const props = defineProps<{
  /** Recent states: angle θ (rad) and angular velocity ω (rad/s). */
  points: readonly { theta: number; omega: number }[]
  /** Largest |ω| the motion can reach, used to fix the vertical scale. */
  omegaMax: number
}>()

const S = 260
const PAD = 30
const half = (S - 2 * PAD) / 2
const cx = S / 2
const cy = S / 2

const thetaScale = computed(() => Math.max(...props.points.map((p) => Math.abs(p.theta)), 0.05) * 1.15)
const omegaScale = computed(() => Math.max(props.omegaMax, 0.05) * 1.15)
const sx = (t: number) => cx + (t / thetaScale.value) * half
const sy = (w: number) => cy - (w / omegaScale.value) * half

const path = computed(() => props.points.map((p, i) => `${i ? 'L' : 'M'}${sx(p.theta).toFixed(1)},${sy(p.omega).toFixed(1)}`).join(' '))
const now = computed(() => props.points[props.points.length - 1] ?? { theta: 0, omega: 0 })
</script>

<template>
  <figure class="phase">
    <svg :viewBox="`0 0 ${S} ${S}`" role="img" :aria-label="localizeExperimentText('Phase portrait: angle across, angular velocity up. Each swing traces the same closed loop.', locale)">
      <line :x1="PAD" :x2="S - PAD" :y1="cy" :y2="cy" class="axis" />
      <line :x1="cx" :x2="cx" :y1="PAD" :y2="S - PAD" class="axis" />
      <text :x="S - PAD" :y="cy - 6" class="label end">{{ localizeExperimentText('angle θ', locale) }}</text>
      <text :x="cx + 6" :y="PAD + 4" class="label">{{ localizeExperimentText('angular velocity ω', locale) }}</text>
      <path :d="path" class="trace" />
      <circle :cx="sx(now.theta)" :cy="sy(now.omega)" r="5" class="dot" />
    </svg>
    <figcaption class="muted">{{ localizeExperimentText('Phase portrait: one closed loop per swing. The loop does not spiral, because energy is conserved.', locale) }}</figcaption>
  </figure>
</template>

<style scoped>
.phase {
  margin: 0;
  max-width: 320px;
}

svg {
  display: block;
  width: 100%;
  height: auto;
}

.axis {
  stroke: var(--axis);
}

.label {
  fill: var(--text-muted);
  font-size: 11px;
}

.label.end {
  text-anchor: end;
}

.trace {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2;
}

.dot {
  fill: var(--observer);
}

figcaption {
  font-size: 0.82rem;
}
</style>
