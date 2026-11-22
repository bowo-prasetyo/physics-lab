<script setup lang="ts">
import { computed } from 'vue'
import MathFormula from '@/components/MathFormula.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import { lorentzFactorMinusOne } from '@/physics'
import type { Level } from '@/levels'
import type { RunSnapshot } from './useSpaceVsTime'

const props = defineProps<{ level: Level; snapshot: RunSnapshot; u: number }>()

/** Format a number for TeX, wrapping negatives in parentheses when asked. Never prints "−0.00". */
const n = (value: number, digits = 1, paren = false) => {
  const text = Math.abs(value).toFixed(digits)
  const negative = value < 0 && Number(text) !== 0
  if (!negative) return text
  return paren ? `(-${text})` : `-${text}`
}

const uniform = computed(() => props.snapshot.record.segments.length === 1)
const x0 = computed(() => props.snapshot.record.x0)

const workedExample = computed(() => {
  const { t, v, x } = props.snapshot
  // One step per line so the working fits on a phone screen.
  return (
    `\\begin{aligned} x &= x_0 + v\\,t \\\\ &= ${n(x0.value)} + ${n(v, 1, true)} \\times ${n(t, 2)} \\\\ ` +
    `&= ${n(x, 2)}\\ \\text{m} \\end{aligned}`
  )
})

const distanceExample = computed(() => {
  const { displacement, distance } = props.snapshot
  return `\\Delta x = ${n(displacement, 2)}\\ \\text{m}, \\qquad s = ${n(distance, 2)}\\ \\text{m}`
})

const boostExample = computed(() => {
  const { t, x, v } = props.snapshot
  const xPrime = x - props.u * t
  return (
    `\\begin{aligned} x' &= x - u\\,t = ${n(x, 2)} - ${n(props.u, 1, true)} \\times ${n(t, 2)} \\\\ ` +
    `&= ${n(xPrime, 2)}\\ \\text{m} \\\\ ` +
    `v' &= v - u = ${n(v - props.u)}\\ \\text{m/s} \\end{aligned}`
  )
})

/** Fractional size of the relativistic correction at the observer's speed, as TeX in scientific notation. */
const gammaCorrection = computed(() => {
  const value = lorentzFactorMinusOne(props.u === 0 ? 3 : props.u)
  const [mantissa, exponent] = value.toExponential(1).split('e')
  return `\\gamma - 1 \\approx ${mantissa} \\times 10^{${Number(exponent)}}`
})
const correctionSpeed = computed(() => Math.abs(props.u === 0 ? 3 : props.u).toFixed(1))
</script>

<template>
  <div class="maths">
    <!-- Beginner: algebra, graphs and tables -->
    <template v-if="level === 'beginner'">
      <p>Every run you did follows one simple rule:</p>
      <MathFormula display tex="x = x_0 + v\,t" />
      <p>
        In words: <em>where the object is now</em> = <em>where it started</em> + <em>its velocity</em> × <em>the time that has passed</em>.
      </p>
      <h3>Check it with your own run</h3>
      <MathFormula v-if="uniform" display :tex="workedExample" />
      <p v-else class="muted">
        Your current run changed velocity part-way through, so the rule applies to each straight piece of the graph separately. Reset and do a
        run without touching the velocity slider to check the formula.
      </p>
      <h3>Reading the graph</h3>
      <ul>
        <li>The <strong>steepness</strong> (slope) of the line is the velocity: <MathFormula tex="v = \dfrac{\Delta x}{\Delta t}" />.</li>
        <li>Where the line <strong>starts</strong> on the vertical axis is the starting position <MathFormula tex="x_0" />.</li>
        <li>A <strong>flat</strong> line means <MathFormula tex="v = 0" />: the object stays put.</li>
      </ul>
      <InfoCallout kind="physics" title="Key idea">
        <p>
          The time <MathFormula tex="t" /> is still in the formula when <MathFormula tex="v = 0" />. Setting the velocity to zero removes the
          <em>change in position</em>, not the passing of time.
        </p>
      </InfoCallout>
    </template>

    <!-- Intermediate: calculus and vectors -->
    <template v-else-if="level === 'intermediate'">
      <p>Velocity is the rate of change of position, so position is the accumulated velocity:</p>
      <MathFormula display tex="v(t) = \frac{dx}{dt} \quad\Longleftrightarrow\quad x(t) = x_0 + \int_0^t v(t')\,dt'" />
      <p>For constant <MathFormula tex="v" /> the integral gives <MathFormula tex="x(t) = x_0 + v\,t" />, the straight lines on your graph.</p>

      <h3>Displacement and distance</h3>
      <MathFormula display tex="\Delta x = \int_0^t v\,dt', \qquad s = \int_0^t |v|\,dt' \;\geq\; |\Delta x|" />
      <p>Your current run:</p>
      <MathFormula display :tex="distanceExample" />
      <p class="muted">The two agree unless the motion reverses. Try reversing the velocity mid-run (question Q3).</p>

      <h3>In three dimensions</h3>
      <p>The same law holds for each coordinate, so it can be written as one vector equation:</p>
      <MathFormula display tex="\mathbf r(t) = \mathbf r_0 + \mathbf v\,t, \qquad |\Delta\mathbf r| = \sqrt{\Delta x^2 + \Delta y^2 + \Delta z^2}" />
      <p>On this track <MathFormula tex="v_y = v_z = 0" />, so only the <MathFormula tex="x" />-component changes.</p>
    </template>

    <!-- Advanced: events, worldlines and frames -->
    <template v-else>
      <h3>Events and worldlines</h3>
      <p>
        An <strong>event</strong> is a place at a time, <MathFormula tex="(t, x)" />. The history of the object is a continuous set of events: its
        <strong>worldline</strong>. The graph above <em>is</em> the worldline drawn in the <MathFormula tex="(t, x)" /> plane. Relativity texts
        usually draw time vertically; we will switch to that convention in Module 4.
      </p>

      <h3>Rest depends on the observer</h3>
      <p>An observer moving at constant velocity <MathFormula tex="u" /> labels the same events with Galilean coordinates</p>
      <MathFormula display tex="t' = t, \qquad x' = x - u\,t, \qquad v' = v - u." />
      <MathFormula display :tex="boostExample" />
      <p>
        Use the <strong>observer velocity</strong> slider. With <MathFormula tex="u = v" /> the object is at rest for the observer; with
        <MathFormula tex="v = 0" /> and <MathFormula tex="u \neq 0" /> a "stationary" object moves. Being at rest is a relation between an
        object and a frame of reference, not a property of the object alone.
      </p>

      <h3>What all Galilean observers agree on</h3>
      <p>
        <MathFormula tex="t' = t" />: in Newtonian physics every observer agrees on time intervals and on which events are simultaneous. This
        is an approximation. The exact Lorentz transformation is
      </p>
      <MathFormula display tex="t' = \gamma\left(t - \frac{u\,x}{c^2}\right), \qquad x' = \gamma\,(x - u\,t), \qquad \gamma = \frac{1}{\sqrt{1 - u^2/c^2}}" />
      <p>
        At <MathFormula :tex="`|u| = ${correctionSpeed}\\ \\text{m/s}`" /> the correction is
        <MathFormula :tex="gammaCorrection" />, far too small to see here, which is why the Galilean picture works so well in everyday life.
        In Module 4 you will push <MathFormula tex="u" /> towards <MathFormula tex="c" /> and watch <MathFormula tex="t' = t" /> fail.
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

.callout {
  margin-top: 16px;
}
</style>
