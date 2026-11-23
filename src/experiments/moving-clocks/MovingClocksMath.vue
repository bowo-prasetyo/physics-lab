<script setup lang="ts">
import { computed } from 'vue'
import MathFormula from '@/components/MathFormula.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import { gamma, intervalSquared, lorentzFactorMinusOne, rapidity } from '@/physics'
import type { Level } from '@/levels'
import type { ClockView, Frame } from './useMovingClocks'
import { useLocale } from '@/composables/useLocale'
import { localizeMovingClocksMathText } from '@/i18n/moving-clocks-math'

const props = defineProps<{ level: Level; beta: number; frame: Frame; t: number; view: ClockView }>()
const { locale } = useLocale()
const tx = (value: string) => localizeMovingClocksMathText(value, locale.value)

const f = (value: number, digits = 2) => {
  const text = Math.abs(value).toFixed(digits)
  return value < 0 && Number(text) !== 0 ? `-${text}` : text
}

const g = computed(() => gamma(props.beta))
const home = computed(() => tx(props.frame === 'earth' ? 'Earth' : 'ship'))
const other = computed(() => tx(props.frame === 'earth' ? 'ship' : 'Earth'))
const movingReading = computed(() => (props.frame === 'earth' ? props.view.ship.tau : props.view.earth.tau))

const workedExample = computed(
  () =>
    `\\begin{aligned} \\gamma &= \\frac{1}{\\sqrt{1 - ${f(props.beta)}^2}} = ${f(g.value, 3)} \\\\ ` +
    `\\Delta\\tau &= \\frac{\\Delta t}{\\gamma} = \\frac{${f(props.t)}\\ \\text{s}}{${f(g.value, 3)}} = ${f(movingReading.value)}\\ \\text{s} \\end{aligned}`,
)

const SPEEDS = [
  { label: tx('Airliner (250 m/s)'), beta: 250 / 299_792_458 },
  { label: '0.10c', beta: 0.1 },
  { label: '0.50c', beta: 0.5 },
  { label: '0.80c', beta: 0.8 },
  { label: '0.90c', beta: 0.9 },
  { label: '0.99c', beta: 0.99 },
]
const gammaRows = computed(() =>
  SPEEDS.map((s) => {
    const minusOne = lorentzFactorMinusOne(s.beta, 1)
    const value = minusOne < 1e-6 ? `1 + ${minusOne.toExponential(1).replace('e-', ' × 10⁻').replace(/\d+$/, (d) => toSuperscript(d))}` : (1 + minusOne).toFixed(3)
    return { ...s, value, current: Math.abs(s.beta - props.beta) < 1e-6 }
  }),
)

function toSuperscript(digits: string): string {
  const map: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
  return digits.replace(/\d/g, (d) => map[d] ?? d)
}

const simultaneityExample = computed(() => {
  const meets = props.view.otherNowMeetsHomeAt
  return (
    `\\begin{aligned} t_{\\text{${home.value}}} &= t - \\frac{v}{c^2}\\,x \\\\ ` +
    `&= ${f(meets)}\\ \\text{s} = \\frac{${f(movingReading.value)}\\ \\text{s}}{\\gamma} \\end{aligned}`
  )
})

const shipEvent = computed(() => props.view.ship)
const intervalExample = computed(() => {
  const e = shipEvent.value
  const s2 = intervalSquared(e)
  return (
    `\\begin{aligned} s^2 &= t^2 - x^2 = ${f(e.t)}^2 - ${e.x < 0 ? `(${f(e.x)})` : f(e.x)}^2 \\\\ ` +
    `&= ${f(s2)}\\ \\text{s}^2 = \\tau_{\\text{ship}}^2 = ${f(e.tau)}^2 \\end{aligned}`
  )
})

const phi = computed(() => (props.beta < 1 ? rapidity(props.beta) : 0))
</script>

<template>
  <div class="maths">
    <!-- Beginner -->
    <template v-if="level === 'beginner'">
      <p>{{ tx('A clock moving at speed') }} <MathFormula tex="v" /> {{ tx('relative to you runs slow by the') }} <strong>{{ tx('Lorentz factor') }}</strong> γ:</p>
      <MathFormula display tex="\Delta\tau = \frac{\Delta t}{\gamma}, \qquad \gamma = \frac{1}{\sqrt{1 - v^2/c^2}}" />
      <p>
        <MathFormula tex="\Delta t" /> {{ tx('is the time on your clock, and') }} <MathFormula tex="\Delta\tau" /> {{ tx('(tau) is the time shown by the moving clock.') }}
      </p>

      <h3>{{ tx('Check it with your own run') }}</h3>
      <p>{{ tx('Seen from the') }} {{ home }}, {{ other }} {{ tx('clock is the moving one:') }}</p>
      <MathFormula display :tex="workedExample" />

      <h3>{{ tx('How big is γ?') }}</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th scope="col">{{ tx('Speed') }}</th><th scope="col">γ</th></tr>
          </thead>
          <tbody>
            <tr v-for="row in gammaRows" :key="row.label" :class="{ current: row.current }">
              <td>{{ row.label }}</td>
              <td class="num">{{ row.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="muted">
        {{ tx('At everyday speeds γ is so close to 1 that the effect is far too small to notice, but atomic clocks can measure it.') }}
      </p>

      <h3>{{ tx('Reading the diagram') }}</h3>
      <ul>
        <li>{{ tx('Time goes') }} <strong>{{ tx('up') }}</strong> {{ tx('and position goes') }} <strong>{{ tx('across') }}</strong>{{ tx('. Each line is a') }} <strong>{{ tx('worldline') }}</strong>{{ tx(': where a clock is at each moment.') }}</li>
        <li>{{ tx('Each dot marks one more second on') }} <em>{{ tx('that') }}</em> {{ tx('clock. Wider gaps between dots mean that clock is running slow compared with yours.') }}</li>
        <li>{{ tx('Distances are in') }} <strong>{{ tx('light-seconds') }}</strong>{{ tx(', the distance light travels in one second (about 300 000 km), so light rays are at 45°.') }}</li>
      </ul>

      <InfoCallout kind="physics" :title="tx('Key idea')">
        <p>
          {{ tx('Every clock ticks normally for the person carrying it. Time dilation appears only when you compare clocks that are moving relative to each other.') }}
        </p>
      </InfoCallout>
    </template>

    <!-- Intermediate -->
    <template v-else-if="level === 'intermediate'">
      <p>{{ tx('An observer moving at velocity') }} <MathFormula tex="v" /> {{ tx('labels events with coordinates given by the') }} <strong>{{ tx('Lorentz transformation') }}</strong>:</p>
      <MathFormula display tex="t' = \gamma\left(t - \frac{v\,x}{c^2}\right), \qquad x' = \gamma\,(x - v\,t)" />
      <p>{{ tx("On the ship's own worldline") }} <MathFormula tex="x = v\,t" />{{ tx(', so its clock reads') }}</p>
      <MathFormula display tex="t' = \gamma\,t\left(1 - \frac{v^2}{c^2}\right) = \frac{t}{\gamma}." />

      <h3>{{ tx('Why both observers can be right') }}</h3>
      <p>
        {{ tx('The term') }} <MathFormula tex="v x / c^2" /> {{ tx('means that events at the same time in one frame (') }}<MathFormula tex="\Delta t = 0" />){{ tx(') are not at the same time in the other:') }}
      </p>
      <MathFormula display tex="\Delta t' = -\gamma\,\frac{v\,\Delta x}{c^2}." />
      <p>
        {{ tx("On the diagram, the moving observer's “now” is the tilted orange line. It passes through the") }} {{ other }} {{ tx("clock's current event") }}
        <MathFormula tex="(t, x)" /> {{ tx('and meets the') }} {{ home }} {{ tx('clock (at') }} <MathFormula tex="x = 0" />{{ tx(') at the') }} {{ home }}{{ tx("'s time") }}
      </p>
      <MathFormula display :tex="simultaneityExample" />
      <p>
        {{ tx('So according to the') }} {{ other }}, {{ home }} {{ tx('clock reads less than the') }} {{ other }}{{ tx("'s own clock: the") }} {{ home }} {{ tx("clock is the slow one. Each observer finds the other's clock slow by the same factor γ. There is no contradiction, because they are comparing different pairs of events.") }}
      </p>
    </template>

    <!-- Advanced -->
    <template v-else>
      <h3>{{ tx('The invariant interval') }}</h3>
      <p>{{ tx('Coordinates depend on the frame, but the') }} <strong>{{ tx('spacetime interval') }}</strong> {{ tx('between two events does not:') }}</p>
      <MathFormula display tex="s^2 = c^2\Delta t^2 - \Delta x^2 = c^2\Delta t'^2 - \Delta x'^2." />
      <p>{{ tx("From the passing event to the ship clock's current event, in the frame you are viewing from (with") }} <MathFormula tex="c = 1" />):</p>
      <MathFormula display :tex="intervalExample" />
      <p>{{ tx('Switch frames and run again:') }} <MathFormula tex="t" /> {{ tx('and') }} <MathFormula tex="x" /> {{ tx('change, but') }} <MathFormula tex="s^2" /> {{ tx('does not.') }}</p>

      <h3>{{ tx('Proper time is the length of a worldline') }}</h3>
      <MathFormula display tex="\tau = \int \sqrt{1 - \frac{v(t)^2}{c^2}}\;dt = \int \frac{ds}{c}" />
      <p>
        {{ tx('Every observer computes the same') }} <MathFormula tex="\tau" /> {{ tx('for a given worldline. Because of the minus sign in') }}
        <MathFormula tex="s^2" />{{ tx(', a straight (inertial) worldline between two events has the') }} <em>longest</em>{{ tx('proper time. This resolves the twin paradox, which a later experiment explores.') }}
      </p>

      <h3>{{ tx('Four-vectors and the metric') }}</h3>
      <MathFormula
        display
        tex="\begin{gathered} x^\mu = (ct, x, y, z) \\ ds^2 = \eta_{\mu\nu}\,dx^\mu dx^\nu \\ \eta = \operatorname{diag}(1, -1, -1, -1) \end{gathered}"
      />

      <h3>{{ tx('Boosts are hyperbolic rotations') }}</h3>
      <p>
        {{ tx('With rapidity') }} <MathFormula tex="\varphi = \operatorname{artanh}(v/c)" /> {{ tx('(here') }}
        <MathFormula :tex="`\\varphi = ${f(phi, 3)}`" />):
      </p>
      <MathFormula display tex="\begin{aligned} ct' &= ct\cosh\varphi - x\sinh\varphi \\ x' &= x\cosh\varphi - ct\sinh\varphi \end{aligned}" />
      <p>
        {{ tx('Rapidities add under successive boosts, while velocities combine as') }}
        <MathFormula tex="w' = \dfrac{w - u}{1 - w u / c^2}" />{{ tx(', which never exceeds') }} <MathFormula tex="c" />{{ tx('. Experiment E compares this spacetime description with the separate space-and-time description you have been using.') }}
      </p>
    </template>
  </div>
</template>

<style scoped>
.maths :deep(h3) {
  margin-top: 1.2em;
}

ul {
  padding-left: 1.2em;
}

li {
  margin-bottom: 4px;
}

.table-wrap {
  overflow-x: auto;
  margin-bottom: 8px;
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
