<script setup lang="ts">
import { computed } from 'vue'
import MathFormula from '@/components/MathFormula.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import { exactFlightTime, exactRange, terminalSpeed, type LaunchParams, type Planet } from '@/physics'
import type { Level } from '@/levels'

const props = defineProps<{ level: Level; params: LaunchParams; planet: Planet; dragApplies: boolean; bestAngle: number | null }>()

const f = (x: number, digits = 3) => String(Number(x.toPrecision(digits)))
const theta = computed(() => (props.params.angleDeg * Math.PI) / 180)
const vx = computed(() => props.params.speed * Math.cos(theta.value))
const vy = computed(() => props.params.speed * Math.sin(theta.value))

const rangeExample = computed(() => {
  const p = props.params
  const r = exactRange({ ...p, height: 0, k: 0 })
  return (
    `\\begin{aligned} R &= \\frac{v_0^2 \\sin 2\\theta}{g} = \\frac{${f(p.speed)}^2 \\times \\sin ${f(2 * p.angleDeg)}^\\circ}{${f(p.g)}} \\\\ ` +
    `&= ${f(r)}\\ \\text{m} \\end{aligned}`
  )
})

const flightTimeExample = computed(() => {
  const p = props.params
  return (
    `\\begin{aligned} t_f &= \\frac{v_{0y} + \\sqrt{v_{0y}^2 + 2 g h}}{g} \\\\ ` +
    `&= \\frac{${f(vy.value)} + \\sqrt{${f(vy.value)}^2 + 2 \\times ${f(p.g)} \\times ${f(p.height)}}}{${f(p.g)}} \\\\ ` +
    `&= ${f(exactFlightTime({ ...p, k: 0 }))}\\ \\text{s} \\end{aligned}`
  )
})

const kValue = computed(() => props.params.k)
</script>

<template>
  <div class="maths">
    <!-- Beginner -->
    <template v-if="level === 'beginner'">
      <p>Split the motion into two parts that do not affect each other. Sideways, nothing pushes the ball, so it keeps a steady speed:</p>
      <MathFormula display tex="x = v_0 \cos\theta \; t" />
      <p>Up and down, gravity pulls it, so its vertical speed changes steadily:</p>
      <MathFormula display tex="y = h + v_0 \sin\theta \; t - \tfrac12 g t^2" />
      <h3>How far does it go?</h3>
      <p>Launched from the ground (<MathFormula tex="h = 0" />) and without air, the two parts combine into the <strong>range</strong>:</p>
      <MathFormula display :tex="rangeExample" />
      <p class="muted">With your speed and angle on the {{ planet.name }}, from ground level and without air.</p>
      <InfoCallout kind="physics" title="Key idea">
        <p>
          The sideways motion and the up-and-down motion are independent. Gravity only changes the vertical speed, which is why a ball thrown
          sideways and a ball dropped at the same moment hit the ground together.
        </p>
      </InfoCallout>
    </template>

    <!-- Intermediate -->
    <template v-else-if="level === 'intermediate'">
      <h3>As vectors</h3>
      <MathFormula display tex="\begin{gathered} \mathbf r(t) = \mathbf r_0 + \mathbf v_0 t + \tfrac12 \mathbf g\, t^2 \\ \mathbf g = (0, -g) \end{gathered}" />
      <h3>Time in the air</h3>
      <p>Setting <MathFormula tex="y = 0" /> gives a quadratic in <MathFormula tex="t" />. Its positive root, for your launch:</p>
      <MathFormula display :tex="flightTimeExample" />
      <p>
        Every term in the range has a factor <MathFormula tex="1/g" />, so on the Moon (<MathFormula tex="g = 1.62\ \text{m/s}^2" />) the same
        throw goes about 6 times as far as on the Earth.
      </p>
      <h3>Seen from a moving train</h3>
      <MathFormula display tex="\begin{gathered} x' = x - u\,t, \qquad v_x' = v_x - u \\ a' = a \end{gathered}" />
      <p>
        With <MathFormula :tex="`u = v_x = ${f(vx)}\\ \\text{m/s}`" /> the ball has no sideways motion at all for the train: it goes straight
        up and down. The path depends on the observer; the acceleration, and so Newton’s laws, do not. This is <strong>Galilean
        relativity</strong>.
      </p>
    </template>

    <!-- Advanced -->
    <template v-else>
      <h3>Newton’s law with air resistance</h3>
      <MathFormula display tex="m\,\frac{d\mathbf v}{dt} = -m g\,\hat{\mathbf y} - \tfrac12 \rho\, C_d A\, |\mathbf v|\, \mathbf v" />
      <p>
        Dividing by <MathFormula tex="m" />: <MathFormula tex="\dot{\mathbf v} = -g\hat{\mathbf y} - k|\mathbf v|\mathbf v" /> with
        <MathFormula tex="k = \rho C_d A / 2m" />
        <template v-if="dragApplies">
          (here <MathFormula :tex="`k = ${f(kValue)}\\ \\text{m}^{-1}`" />, terminal speed
          <MathFormula :tex="`\\sqrt{g/k} = ${f(terminalSpeed(params.g, kValue))}\\ \\text{m/s}`" />)</template
        >. Because <MathFormula tex="|\mathbf v|" /> contains both components, the horizontal and vertical motions are now coupled, and
        there is no formula for the path.
      </p>
      <h3>Solving it step by step: RK4</h3>
      <MathFormula
        display
        tex="\begin{aligned} \mathbf y_{n+1} &= \mathbf y_n + \tfrac{\Delta t}{6}\big(\mathbf k_1 + 2\mathbf k_2 \\ &\qquad + 2\mathbf k_3 + \mathbf k_4\big) \\ \mathbf k_1 &= \mathbf f(\mathbf y_n) \\ \mathbf k_2 &= \mathbf f(\mathbf y_n + \tfrac{\Delta t}{2}\mathbf k_1), \ \dots \end{aligned}"
      />
      <p>
        The classical Runge–Kutta method has an error that shrinks as <MathFormula tex="\Delta t^4" />: halving the step makes it about 16
        times smaller. This experiment uses <MathFormula tex="\Delta t = 5\ \text{ms}" />, and finds the landing moment by bisection.
      </p>
      <h3>Energy</h3>
      <MathFormula display tex="\frac{d}{dt}\left(\tfrac12 v^2 + g y\right) = -k\,|\mathbf v|^3 \le 0" />
      <p>
        Drag always removes energy. For orbits, where energy should be conserved, a symplectic method such as velocity Verlet would be the
        better choice, because RK4 slowly drifts.
      </p>
      <p v-if="bestAngle !== null">
        <strong>Best angle for your settings:</strong> <MathFormula :tex="`${f(bestAngle)}^\\circ`" />, found by searching the simulated
        range.
      </p>
    </template>
  </div>
</template>

<style scoped>
.maths :deep(h3) {
  margin-top: 1.2em;
}
</style>
