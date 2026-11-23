<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { localizeGravityClocksMathText } from '@/i18n/gravity-clocks-math'
import MathFormula from '@/components/MathFormula.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import {
  BODIES,
  SECONDS_PER_DAY,
  schwarzschildRadius,
  surfaceGravity,
  weakFieldShift,
  type Body,
  type GpsBreakdown,
} from '@/physics'
import type { Level } from '@/levels'
import { formatDuration, formatLength, formatNumber, formatSlowdown } from './format'

const { locale } = useLocale()
const tx = (value: string) => localizeGravityClocksMathText(value, locale.value)

const props = defineProps<{
  level: Level
  body: Body
  altitudeA: number
  altitudeB: number
  deficitA: number
  deficitB: number
  rateBvsA: number
  gps: GpsBreakdown
  radialDistance: { coordinate: number; proper: number; extra: number }
}>()

/** formatNumber output as TeX. */
const tex = (x: number) => formatNumber(x).replace(' × 10', ' \\times 10^{').replace(/([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/, (m) => `${toAscii(m)}}`)
function toAscii(sup: string): string {
  const map: Record<string, string> = { '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' }
  return sup.replace(/./g, (c) => map[c] ?? c)
}

const rs = computed(() => schwarzschildRadius(props.body.mass))
const rA = computed(() => props.body.radius + props.altitudeA)
const rB = computed(() => props.body.radius + props.altitudeB)

const workedExample = computed(
  () =>
    `\\begin{aligned} r_s &= \\frac{2GM}{c^2} = ${texLength(rs.value)} \\\\ ` +
    `\\text{A: } 1 - \\frac{d\\tau}{dt} &= ${tex(props.deficitA)} \\\\ ` +
    `\\text{B: } 1 - \\frac{d\\tau}{dt} &= ${tex(props.deficitB)} \\end{aligned}`,
)
const texLength = (m: number) => formatLength(m).replace(/ (\S+)$/, '\\ \\text{$1}').replace(/,/g, '{,}')

const rows = computed(() =>
  BODIES.map((b) => ({ name: b.name, rs: formatLength(schwarzschildRadius(b.mass)), radius: b.hasSurface ? formatLength(b.radius) : '—', current: b.id === props.body.id })),
)

const g = computed(() => surfaceGravity(props.body.mass, props.body.radius))
const heightDiff = computed(() => props.altitudeB - props.altitudeA)
const weakExample = computed(() => {
  const approx = weakFieldShift(g.value, heightDiff.value)
  return (
    `\\begin{aligned} \\frac{\\Delta\\tau}{\\tau} &\\approx \\frac{g\\,h}{c^2} \\\\ &= \\frac{${formatNumber(g.value)} \\times ${texLength(heightDiff.value)}}{c^2} \\\\ ` +
    `&= ${tex(approx)} \\\\ \\text{exact: } &\\phantom{=}\\ ${tex(props.rateBvsA)} \\end{aligned}`
  )
})
const weakApplies = computed(() => props.body.hasSurface && Math.abs(heightDiff.value) < 0.01 * props.body.radius)
const perDay = (x: number) => formatDuration(x * SECONDS_PER_DAY)

