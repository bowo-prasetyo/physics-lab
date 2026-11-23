<script setup lang="ts">
import { computed } from 'vue'
import MathFormula from '@/components/MathFormula.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import { agm } from '@/physics'
import type { Level } from '@/levels'

const props = defineProps<{ level: Level; length: number; g: number; amplitudeDeg: number; smallAngle: number; exact: number }>()

const f = (x: number, digits = 3) => String(Number(x.toPrecision(digits)))
const theta0 = computed(() => (props.amplitudeDeg * Math.PI) / 180)

const periodExample = computed(
  () => `T = 2\\pi\\sqrt{\\frac{L}{g}} = 2\\pi\\sqrt{\\frac{${f(props.length)}}{${f(props.g)}}} = ${f(props.smallAngle)}\\ \\text{s}`,
)
const frequencyExample = computed(() => `f = \\frac{1}{T} = ${f(1 / props.smallAngle)}\\ \\text{Hz}`)
const exactExample = computed(() => {
  const m = agm(1, Math.cos(theta0.value / 2))
  return (
    `\\begin{aligned} T &= \\frac{T_0}{\\operatorname{AGM}\\!\\left(1, \\cos\\frac{\\theta_0}{2}\\right)} = \\frac{${f(props.smallAngle, 4)}}{${f(m, 5)}} \\\\ ` +
    `&= ${f(props.exact, 4)}\\ \\text{s} \\quad (${f(props.exact / props.smallAngle, 4)}\\,T_0) \\end{aligned}`
  )
})
const seriesExample = computed(() => {
  const a = theta0.value
  return `\\frac{T}{T_0} \\approx 1 + \\frac{\\theta_0^2}{16} + \\frac{11\\,\\theta_0^4}{3072} = ${f(1 + a ** 2 / 16 + (11 * a ** 4) / 3072, 4)}`
})
</script>

<template>
  <div class="maths">
    <!-- Beginner -->
    <template v-if="level === 'beginner'">
      <p>For small swings, the time for one complete swing (the <strong>period</strong>) depends only on the length and on gravity:</p>
      <MathFormula display :tex="periodExample" />
      <p>The <strong>frequency</strong> is how many swings happen each second:</p>
      <MathFormula display :tex="frequencyExample" />
      <h3>What makes something a clock?</h3>
      <p>Every clock counts something that repeats at a steady rate:</p>
      <ul>
        <li>a pendulum, about 1 swing per second;</li>
        <li>a quartz crystal in a watch, 32 768 vibrations per second;</li>
        <li>caesium atoms, 9 192 631 770 oscillations per second. Since 1967 this number has defined the second;</li>
        <li>the Earth itself, one turn per day, although tides are slowly lengthening the day by about 1.7 thousandths of a second per century.</li>
      </ul>
      <InfoCallout kind="physics" title="Key idea">
        <p>
          Clocks are physical processes. We measure time by comparing one repeating process with another, and we trust the ones that agree
          with each other best.
        </p>
      </InfoCallout>
    </template>

    <!-- Intermediate -->
    <template v-else-if="level === 'intermediate'">
      <h3>Where the formula comes from</h3>
      <p>Gravity pulls the bob back towards the bottom with a force along the arc of <MathFormula tex="-m g \sin\theta" />, so</p>
      <MathFormula display tex="\begin{gathered} m L\,\ddot\theta = -m g \sin\theta \\ \Longrightarrow\quad \ddot\theta = -\frac{g}{L}\sin\theta \end{gathered}" />
      <p>
        The mass cancels: the same <MathFormula tex="m" /> measures how strongly gravity pulls (gravitational mass) and how hard the bob is to
        accelerate (inertial mass). That they are equal is the <strong>equivalence principle</strong>, the foundation of general relativity
        (Experiment C).
      </p>
      <h3>Small swings: simple harmonic motion</h3>
      <MathFormula display tex="\begin{gathered} \sin\theta \approx \theta \;\Longrightarrow\; \theta(t) = \theta_0 \cos\!\left(\sqrt{\tfrac{g}{L}}\,t\right) \\ T_0 = 2\pi\sqrt{\tfrac{L}{g}} \end{gathered}" />
      <p>
        Because <MathFormula tex="T_0 \propto 1/\sqrt g" />, the same pendulum on the Moon (<MathFormula tex="g = 1.62\ \text{m/s}^2" />)
        swings <MathFormula tex="\sqrt{9.81/1.62} \approx 2.46" /> times more slowly.
      </p>
    </template>

    <!-- Advanced -->
    <template v-else>
      <h3>The exact period</h3>
      <p>
        Energy conservation gives the period as a complete elliptic integral, <MathFormula tex="T = 4\sqrt{L/g}\,K\!\left(\sin\tfrac{\theta_0}{2}\right)" />.
        Gauss’s arithmetic–geometric mean evaluates it exactly in a few steps. For your swing:
      </p>
      <MathFormula display :tex="exactExample" />
      <p>For moderate amplitudes the series is enough:</p>
      <MathFormula display :tex="seriesExample" />
      <h3>Simulating a clock that runs for ever</h3>
      <p>The simulation uses the Störmer–Verlet method with 1 ms steps:</p>
      <MathFormula
        display
        tex="\begin{aligned} \omega_{n+\frac12} &= \omega_n - \tfrac{h}{2}\tfrac{g}{L}\sin\theta_n \\ \theta_{n+1} &= \theta_n + h\,\omega_{n+\frac12} \\ \omega_{n+1} &= \omega_{n+\frac12} - \tfrac{h}{2}\tfrac{g}{L}\sin\theta_{n+1} \end{aligned}"
      />
      <p>
        It is <strong>symplectic</strong>: in exact arithmetic it preserves phase-space area, but it does not exactly conserve the
        pendulum’s original energy. With a sufficiently small fixed time step, its energy error typically stays bounded and oscillates
        over long runs because the method nearly conserves a slightly modified energy. This is not guaranteed for every step size or
        arbitrarily long computation; finite-precision round-off can also accumulate. In the tested setup, RK4 starts more accurate
        but accumulates substantially more energy error. That comparison is specific to this pendulum and step size, not a universal
        rule for every simulation.
      </p>
      <p>
        Huygens showed in 1673 that a bob guided along a <strong>cycloid</strong> instead of a circle has a period that does not depend on the
        amplitude at all.
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
</style>
