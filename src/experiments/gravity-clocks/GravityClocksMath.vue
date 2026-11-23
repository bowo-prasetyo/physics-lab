<script setup lang="ts">
import { computed } from 'vue'
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
</script>

<template>
  <div class="maths">
    <InfoCallout kind="note" title="What this model assumes">
      <p>
        This is the <strong>Schwarzschild model</strong>: the mass is spherical and non-rotating, and the region outside it is treated as vacuum.
        Earth’s rotation, its slight flattening and other small corrections are omitted. The two clocks in the main comparison are held
        stationary relative to this idealized body, outside its surface (and, for a black hole, outside the horizon).
      </p>
      <p>
        A circular-orbit clock is a different case: it is freely falling, not held stationary. Its rate includes both gravity and orbital
        motion; the circular-orbit formula applies outside the photon sphere.
      </p>
    </InfoCallout>
    <!-- Beginner -->
    <template v-if="level === 'beginner'">
      <p>A clock held at rest at distance <MathFormula tex="r" /> from the centre of a mass <MathFormula tex="M" /> runs slower than a clock far away:</p>
      <MathFormula display tex="\frac{d\tau}{dt} = \sqrt{1 - \frac{r_s}{r}}, \qquad r_s = \frac{2GM}{c^2}" />
      <p>
        <MathFormula tex="r_s" /> is the <strong>Schwarzschild radius</strong>: the size the mass would need to be squeezed into to become a
        black hole. The smaller <MathFormula tex="r" /> is compared with <MathFormula tex="r_s" />, the slower the clock.
      </p>
      <h3>Your clocks ({{ body.name }})</h3>
      <MathFormula display :tex="workedExample" />
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th scope="col">Object</th><th scope="col">Radius</th><th scope="col">Schwarzschild radius</th></tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.name" :class="{ current: row.current }">
              <td>{{ row.name }}</td>
              <td class="num">{{ row.radius }}</td>
              <td class="num">{{ row.rs }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <InfoCallout kind="physics" title="Key idea">
        <p>
          Lower clocks run slower. Every process slows by the same factor (atoms, chemistry, heartbeats), so a person next to the lower clock
          notices nothing. The difference only shows when clocks are compared.
        </p>
      </InfoCallout>
    </template>

    <!-- Intermediate -->
    <template v-else-if="level === 'intermediate'">
      <h3>Near a surface: the weak-field rule</h3>
      <p>
        When <MathFormula tex="r_s \ll r" />, the square root can be expanded. For a small height difference <MathFormula tex="h" /> near a
        surface where gravity is <MathFormula tex="g" />:
      </p>
      <MathFormula display tex="\frac{\Delta\tau}{\tau} \approx \frac{\Delta\Phi}{c^2} = \frac{g\,h}{c^2}" />
      <MathFormula v-if="weakApplies" display :tex="weakExample" />
      <p v-else class="muted">
        Put both clocks close to the surface of a body (a height difference under 1% of its radius) to compare this approximation with the
        exact result.
      </p>
      <p>Pound and Rebka measured exactly this in 1959, with gamma rays sent up a 22.5 m tower: <MathFormula tex="gh/c^2 = 2.5 \times 10^{-15}" />.</p>

      <h3>GPS: two effects with opposite signs</h3>
      <MathFormula
        display
        tex="\frac{\Delta\tau}{\tau} \approx \underbrace{\frac{GM}{c^2}\left(\frac{1}{R} - \frac{1}{r}\right)}_{\text{gravity: faster up high}} \; \underbrace{- \frac{v^2}{2c^2}}_{\text{speed: slower}}"
      />
      <p>
        With <MathFormula tex="v^2 = GM/r" /> for a circular orbit: gravity <strong>+{{ perDay(gps.gravity) }}</strong> per day, speed
        <strong>−{{ perDay(-gps.velocity) }}</strong> per day, net <strong>+{{ perDay(gps.net) }}</strong> per day.
      </p>
    </template>

    <!-- Advanced -->
    <template v-else>
      <h3>The Schwarzschild metric</h3>
      <p>In the (−, +, +, +) convention:</p>
      <MathFormula
        display
        tex="\begin{aligned} ds^2 = &-\left(1 - \frac{r_s}{r}\right)c^2 dt^2 \\ &+ \frac{dr^2}{1 - r_s/r} + r^2\,d\Omega^2 \end{aligned}"
      />
      <p>
        A clock at rest has <MathFormula tex="dr = d\Omega = 0" />, so <MathFormula tex="d\tau = \sqrt{1 - r_s/r}\;dt" />. For a circular
        orbit, the orbital motion adds to this: <MathFormula tex="d\tau = \sqrt{1 - 3GM/(rc^2)}\;dt" />.
      </p>

      <h3>The lapse is the clock rate</h3>
      <p>
        In the ADM 3 + 1 split from Experiment E, <MathFormula tex="ds^2 = -N^2 dt^2 + (\text{spatial part})" />. Here the lapse is
        <MathFormula tex="N = \sqrt{1 - r_s/r}" />: the rate of a static clock. It falls to zero at the horizon. Experiment E’s formula is
        now something you can measure.
      </p>

      <h3>Space is curved too</h3>
      <p>Rulers laid out radially between the two clocks measure</p>
      <MathFormula display tex="\ell = \int_{r_1}^{r_2} \frac{dr}{\sqrt{1 - r_s/r}} \;>\; r_2 - r_1." />
      <p>
        For your clocks: <MathFormula tex="r_2 - r_1" /> = {{ formatLength(radialDistance.coordinate) }}, but the rulers measure
        {{ formatLength(radialDistance.proper) }}: an extra {{ formatLength(radialDistance.extra) }}.
      </p>

      <h3>Why the observers agree</h3>
      <p>Light sent from a static emitter to a static receiver arrives with frequency ratio</p>
      <MathFormula display tex="\frac{f_{\text{received}}}{f_{\text{emitted}}} = \sqrt{\frac{1 - r_s/r_{\text{emit}}}{1 - r_s/r_{\text{receive}}}}" />
      <p>
        which is a property of the two clocks’ positions in a static spacetime, not of anyone’s frame. The upward and downward ratios are exact
        inverses, so both observers agree that the lower clock is slow. This is unlike Experiment B, where the clocks were in symmetric relative
        motion.
      </p>
      <p class="muted">
        For your clocks (at radii {{ formatLength(rA) }} and {{ formatLength(rB) }}), clock B runs {{ formatSlowdown(Math.abs(rateBvsA)) }}
        {{ rateBvsA >= 0 ? 'faster' : 'slower' }} than clock A, and both observers agree.
      </p>
    </template>
  </div>
</template>

<style scoped>
.maths :deep(h3) {
  margin-top: 1.2em;
}

.table-wrap {
  overflow-x: auto;
  margin: 8px 0 12px;
}

table {
  border-collapse: collapse;
  font-size: 0.92rem;
}

th,
td {
  padding: 4px 12px;
  border: 1px solid var(--border);
  text-align: left;
}

th {
  background: var(--surface-2);
}

tr.current td {
  background: var(--accent-soft);
  font-weight: 700;
}
</style>
