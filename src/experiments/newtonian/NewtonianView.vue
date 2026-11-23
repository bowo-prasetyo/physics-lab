<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ParameterSlider from '@/components/ParameterSlider.vue'
import PredictionCard from '@/components/PredictionCard.vue'
import MathFormula from '@/components/MathFormula.vue'
import { useLevel } from '@/composables/useLevel'
import { snapToRange, useQuerySync } from '@/composables/useQuerySync'
import { atLeast, isLevel } from '@/levels'
import { accelerationFromNetForce, displacementFromRest, velocityFromRest } from '@/physics/newtonian'
import { PREDICTIONS, type ForceRun } from './predictions'

const route = useRoute()
const level = useLevel()
if (isLevel(route.query.level)) level.value = route.query.level

const FORCE = { min: 5, max: 50, step: 5 }
const MASS = { min: 1, max: 10, step: 1 }
const TIME = { min: 1, max: 5, step: 1 }
const force = ref(snapToRange(route.query.force, FORCE, 20))
const mass = ref(snapToRange(route.query.mass, MASS, 2))
const time = ref(snapToRange(route.query.time, TIME, 3))
const runs = ref<ForceRun[]>([])

useQuerySync({
  sources: [force, mass, time, level],
  write: () => ({ level: level.value, force: String(force.value), mass: String(mass.value), time: String(time.value) }),
  read: (q) => {
    if (isLevel(q.level)) level.value = q.level
    force.value = snapToRange(q.force, FORCE, force.value)
    mass.value = snapToRange(q.mass, MASS, mass.value)
    time.value = snapToRange(q.time, TIME, time.value)
  },
})

const acceleration = computed(() => accelerationFromNetForce(force.value, mass.value))
const velocity = computed(() => velocityFromRest(force.value, mass.value, time.value))
const displacement = computed(() => displacementFromRest(force.value, mass.value, time.value))
const predictions = computed(() => PREDICTIONS.filter((p) => atLeast(level.value, p.minLevel)))
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed(runs.value)])))
const hints = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.hint?.(runs.value) ?? null])))
const fmt = (n: number) => Number(n.toFixed(3)).toString()

function runExperiment() {
  runs.value = [...runs.value, { force: force.value, mass: mass.value, acceleration: acceleration.value }]
}
</script>

<template>
  <article class="lesson container">
    <header class="lesson-head">
      <p class="eyebrow">Module 3 · Classical mechanics · Newtonian foundations</p>
      <h1>Force, mass and acceleration</h1>
      <p class="lead">Push a cart with a constant net force. Change the force or the cart’s mass, predict what will happen, and test Newton’s second law.</p>
    </header>

    <section aria-labelledby="predict-title">
      <h2 id="predict-title"><span class="step-no">1</span> Predict</h2>
      <p class="muted">Choose an answer before running the model. Each explanation unlocks only after you have compared the relevant cases.</p>
      <div class="prediction-grid">
        <PredictionCard v-for="(p, i) in predictions" :key="p.id" :prediction="p" :observed="observed[p.id] ?? false" :hint="hints[p.id]" :index="i + 1" />
      </div>
    </section>

    <section aria-labelledby="experiment-title">
      <h2 id="experiment-title"><span class="step-no">2</span> Experiment</h2>
      <div class="lab">
        <div class="lab-main card">
          <div class="cart-scene" role="img" :aria-label="`A cart of mass ${mass} kilograms pushed to the right by a net force of ${force} newtons`">
            <div class="force-arrow"><span>{{ force }} N net force</span><span class="arrow">⟶</span></div>
            <div class="cart"><span>{{ mass }} kg</span><i></i><i></i></div>
            <p class="muted small">Idealised horizontal track · the cart starts from rest</p>
          </div>
          <div class="readout-grid">
            <div><span class="muted">Acceleration</span><strong class="num">{{ fmt(acceleration) }} m/s²</strong></div>
            <div><span class="muted">Speed after {{ time }} s</span><strong class="num">{{ fmt(velocity) }} m/s</strong></div>
            <div><span class="muted">Displacement after {{ time }} s</span><strong class="num">{{ fmt(displacement) }} m</strong></div>
          </div>
          <h3>Recorded trials</h3>
          <p v-if="runs.length === 0" class="muted">Run at least two carefully chosen cases to reveal a relationship.</p>
          <div v-else class="table-scroll">
            <table>
              <thead><tr><th>Trial</th><th>Net force</th><th>Mass</th><th>Acceleration</th></tr></thead>
              <tbody>
                <tr v-for="(run, i) in runs" :key="i"><td>{{ i + 1 }}</td><td>{{ run.force }} N</td><td>{{ run.mass }} kg</td><td>{{ fmt(run.acceleration) }} m/s²</td></tr>
              </tbody>
            </table>
          </div>
          <button class="btn btn-small" type="button" :disabled="runs.length === 0" @click="runs = []">Clear recorded trials</button>
        </div>
        <aside class="lab-side card">
          <ParameterSlider v-model="force" label="Net force" symbol="F_{net}" unit="N" v-bind="FORCE" :digits="0" :signed="false" />
          <ParameterSlider v-model="mass" label="Cart mass" symbol="m" unit="kg" v-bind="MASS" :digits="0" :signed="false" />
          <ParameterSlider v-model="time" label="Elapsed time" symbol="t" unit="s" v-bind="TIME" :digits="0" :signed="false" />
          <button class="btn btn-primary" type="button" @click="runExperiment">Run this trial</button>
          <p class="small muted">For a fair comparison, change one variable at a time and keep the other fixed.</p>
        </aside>
      </div>
    </section>

    <section class="card prose" aria-labelledby="maths-title">
      <h2 id="maths-title"><span class="step-no">3</span> The mathematics</h2>
      <p>Newton’s second law relates the net force on an object to its acceleration:</p>
      <MathFormula tex="\sum F = ma" :display="true" />
      <p>For this one-dimensional model, with constant mass and constant net force:</p>
      <MathFormula tex="a = \frac{F_{net}}{m}, \qquad v = at, \qquad \Delta x = \frac{1}{2}at^2" :display="true" />
      <p v-if="atLeast(level, 'intermediate')">The proportionalities are testable: at fixed mass, <MathFormula tex="a \propto F_{net}" />; at fixed net force, <MathFormula tex="a \propto 1/m" />. The signed form also captures a force acting in the negative direction.</p>
      <p v-if="atLeast(level, 'advanced')">In vector form, <MathFormula tex="\sum \vec{F} = m\vec{a}" />. Acceleration is determined by the vector sum of all external forces, not by a single force considered in isolation.</p>
    </section>

    <section class="card prose">
      <h2><span class="step-no">4</span> What does it tell us?</h2>
      <h3>Established physics</h3>
      <ul>
        <li>Acceleration is caused by the net force, not necessarily by the largest individual force.</li>
        <li>For the same net force, a more massive object accelerates less.</li>
        <li>For the same mass, a larger net force produces a proportionally larger acceleration.</li>
      </ul>
      <h3>Assumptions and limits</h3>
      <p>This is a one-dimensional Newtonian model in an inertial reference frame. The mass is constant, the net force is constant, and friction is omitted. The selected force represents the sum of all forces along the track; it is not simply the applied push if other forces oppose it.</p>
    </section>

    <nav class="next card" aria-label="Next steps">
      <p><strong>Continue:</strong> apply force and acceleration reasoning to a projectile, where gravity changes the vertical velocity.</p>
      <span class="nav-links"><RouterLink to="/mechanics/projectile">Projectile launcher</RouterLink><RouterLink to="/teachers">Teacher guide</RouterLink><RouterLink to="/">All modules</RouterLink></span>
    </nav>
  </article>
</template>

<style scoped>
.lab { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 16px; align-items: start; }
.lab-main, .lab-side { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.cart-scene { min-height: 230px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 18px; padding: 24px; border-radius: var(--radius-sm); background: var(--surface-2); }
.force-arrow { display: flex; flex-direction: column; align-items: center; color: var(--accent); font-weight: 700; }
.arrow { font-size: 3rem; line-height: 1; }
.cart { position: relative; display: grid; place-items: center; width: 150px; height: 62px; border: 3px solid var(--accent); border-radius: 10px; background: var(--accent-soft); font-weight: 700; }
.cart i { position: absolute; bottom: -13px; width: 18px; height: 18px; border-radius: 50%; background: var(--text-muted); border: 3px solid var(--surface); }
.cart i:first-of-type { left: 18px; }
.cart i:last-of-type { right: 18px; }
.small { font-size: .85rem; margin: 0; }
.readout-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
.readout-grid > div { display: grid; gap: 3px; padding: 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); }
.readout-grid strong { font-size: 1.15rem; }
.table-scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
th, td { padding: 8px; text-align: left; border-bottom: 1px solid var(--border); white-space: nowrap; }
th { color: var(--text-muted); font-size: .85rem; }
.btn-small { align-self: flex-start; min-height: 32px; padding: 0 10px; font-size: .85rem; }
.nav-links { display: inline-flex; flex-wrap: wrap; gap: 16px; }
@media (max-width: 900px) { .lab { grid-template-columns: 1fr; } }
</style>
