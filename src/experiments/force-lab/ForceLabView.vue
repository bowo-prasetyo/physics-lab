<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MathFormula from '@/components/MathFormula.vue'
import ParameterSlider from '@/components/ParameterSlider.vue'
import { useLevel } from '@/composables/useLevel'
import { useLocale } from '@/composables/useLocale'
import { isLevel, atLeast } from '@/levels'
import { localizeForceLabText } from './copy'
import { getExperimentModuleEyebrow, experimentSectionLabel } from '@/i18n/experiment-metadata'
import { calculateForceLab, type ForceLabScenario, type ForceLabResult } from '@/physics/forceLab'

const route = useRoute()
const level = useLevel()
const { locale } = useLocale()
if (isLevel(route.query.level)) level.value = route.query.level
const tx = (value: string) => localizeForceLabText(value, locale.value)

const scenario = ref<ForceLabScenario>('horizontal')
const mass = ref(5)
const appliedForce = ref(30)
const frictionCoefficient = ref(0.2)
const inclineAngle = ref(20)
const duration = ref(2)
const prediction = ref<'up' | 'down' | 'none' | null>(null)
const lastRun = ref<ForceLabResult | null>(null)
const trialCount = ref(0)
const trials = ref<Array<{ scenario: ForceLabScenario; mass: number; netForce: number; acceleration: number }>>([])
const predictionOptions = [
  { id: 'up' as const, label: 'Up the slope / to the right' },
  { id: 'down' as const, label: 'Down the slope / to the left' },
  { id: 'none' as const, label: 'Zero acceleration' },
]

const result = computed(() => calculateForceLab({
  scenario: scenario.value,
  mass: mass.value,
  appliedForce: appliedForce.value,
  frictionCoefficient: frictionCoefficient.value,
  inclineAngle: scenario.value === 'incline' ? inclineAngle.value : 0,
  duration: duration.value,
}))
const direction = (net: number): 'up' | 'down' | 'none' =>
  Math.abs(net) < 1e-8 ? 'none' : net > 0 ? 'up' : 'down'
const observed = computed(() => lastRun.value ? direction(lastRun.value.netForce) : null)
const verdict = computed(() => prediction.value && observed.value
  ? prediction.value === observed.value : null)
const fmt = (value: number, digits = 2) => Number(value.toFixed(digits)).toString()
const maximumForce = computed(() => Math.max(20, ...result.value.forces.map((force) => Math.hypot(force.x, force.y))))
const arrowScale = computed(() => 72 / maximumForce.value)
const vectorEnd = (x: number, y: number) => ({
  x: 250 + x * arrowScale.value,
  y: 166 - y * arrowScale.value,
})
const vectorLabel = (id: 'applied' | 'friction' | 'normal' | 'weight-parallel' | 'weight-normal') => ({
  applied: tx('Applied force'),
  friction: tx('Friction'),
  normal: tx('Normal force'),
  'weight-parallel': tx('Weight along slope'),
  'weight-normal': tx('Weight into surface'),
}[id] ?? id)
const vectorColor = (id: 'applied' | 'friction' | 'normal' | 'weight-parallel' | 'weight-normal') => ({
  applied: 'var(--accent)',
  friction: 'var(--warn)',
  normal: 'var(--success)',
  'weight-parallel': 'var(--observer)',
  'weight-normal': 'var(--observer)',
}[id] ?? 'currentColor')
const vectorId = (id: string) => `arrow-${id}`

function runTrial() {
  lastRun.value = result.value
  trialCount.value += 1
  trials.value = [...trials.value, { scenario: scenario.value, mass: mass.value, netForce: result.value.netForce, acceleration: result.value.acceleration }]
}
function resetPrediction() {
  prediction.value = null
  lastRun.value = null
}
function clearTrials() {
  trials.value = []
  trialCount.value = 0
}
watch([scenario, mass, appliedForce, frictionCoefficient, inclineAngle, duration], resetPrediction)
</script>

<template>
  <article class="lesson container force-lab">
    <header class="lesson-head">
      <p class="eyebrow">{{ getExperimentModuleEyebrow('force-lab', locale) }}</p>
      <h1>{{ tx('Force Lab: free-body diagrams and multiple forces') }}</h1>
      <p class="lead">{{ tx('A push is only one part of the story. Draw every force on a sliding block, find their vector sum, and predict how its motion changes.') }}</p>
    </header>

    <section aria-labelledby="predict-title">
      <h2 id="predict-title"><span class="step-no">1</span> {{ experimentSectionLabel('predict', locale) }}</h2>
      <div class="prediction card">
        <p>{{ tx('Before running the model, predict the direction of the block’s acceleration along the surface.') }}</p>
        <fieldset>
          <legend>{{ tx('Your prediction') }}</legend>
          <label v-for="option in predictionOptions" :key="option.id">
            <input v-model="prediction" type="radio" name="force-prediction" :value="option.id" />
            {{ tx(option.label) }}
          </label>
        </fieldset>
        <p v-if="verdict !== null" class="verdict" role="status">
          {{ verdict ? tx('Your prediction matches the model.') : tx('The model gives a different result. Compare the force arrows and net force.') }}
          {{ tx('Observed direction') }}: {{ tx(observed === 'up' ? 'Up the slope / to the right' : observed === 'down' ? 'Down the slope / to the left' : 'Zero acceleration') }}.
        </p>
        <p v-else-if="prediction && !lastRun" class="muted">{{ tx('Prediction saved. Adjust the setup if needed, then run the experiment to test it.') }}</p>
      </div>
    </section>

    <section aria-labelledby="experiment-title">
      <h2 id="experiment-title"><span class="step-no">2</span> {{ experimentSectionLabel('experiment', locale) }}</h2>
      <div class="lab">
        <div class="lab-main card">
          <div class="scene-heading">
            <strong>{{ tx(scenario === 'horizontal' ? 'Horizontal surface' : 'Inclined plane') }}</strong>
            <span class="muted small">{{ tx('Free-body diagram · forces on the block') }}</span>
          </div>
          <svg class="force-diagram" viewBox="0 0 500 320" role="img" :aria-label="tx('Free-body diagram showing applied force, friction, normal force and weight components')">
            <defs>
              <marker v-for="id in ['applied','friction','normal','weight-parallel','weight-normal']" :id="vectorId(id)" :key="id" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L6,3 L0,6 Z" :fill="vectorColor(id)" />
              </marker>
            </defs>
            <g :transform="`rotate(-${scenario === 'incline' ? inclineAngle : 0} 250 166)`">
              <line x1="65" y1="215" x2="435" y2="215" stroke="var(--border-strong, var(--text-muted))" stroke-width="3" />
              <rect x="218" y="137" width="64" height="58" rx="7" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2" />
              <text x="250" y="171" text-anchor="middle" fill="var(--text)" font-size="14">{{ mass }} kg</text>
              <g v-for="force in result.forces" :key="force.id">
                <line
                  v-if="Math.hypot(force.x, force.y) > 0.001"
                  x1="250" y1="166"
                  :x2="vectorEnd(force.x, force.y).x"
                  :y2="vectorEnd(force.x, force.y).y"
                  :stroke="vectorColor(force.id)"
                  stroke-width="3"
                  :marker-end="`url(#${vectorId(force.id)})`"
                />
              </g>
            </g>
            <text x="250" y="292" text-anchor="middle" fill="var(--text-muted)" font-size="12">{{ tx('Vector lengths are scaled for readability; values are shown below.') }}</text>
          </svg>
          <div class="force-key">
            <div v-for="force in result.forces" :key="force.id">
              <span class="key-dot" :style="{ background: vectorColor(force.id) }"></span>
              <span>{{ vectorLabel(force.id) }}</span>
              <strong>{{ fmt(Math.hypot(force.x, force.y)) }} N</strong>
            </div>
          </div>
          <div class="readout-grid">
            <div><span>{{ tx('Net force along surface') }}</span><strong>{{ fmt(result.netForce) }} N</strong></div>
            <div><span>{{ tx('Acceleration') }}</span><strong>{{ fmt(result.acceleration) }} m/s²</strong></div>
            <div><span>{{ tx('Velocity after') }} {{ duration }} s</span><strong>{{ fmt(result.velocity) }} m/s</strong></div>
            <div><span>{{ tx('Displacement after') }} {{ duration }} s</span><strong>{{ fmt(result.displacement) }} m</strong></div>
          </div>
          <p class="small muted">{{ tx('Positive values point up the slope or to the right. Negative values point down the slope or to the left.') }}</p>
          <p v-if="lastRun" class="trial-note" aria-live="polite">{{ tx('Trial recorded') }} · {{ trialCount }} · {{ tx('Net force') }}: {{ fmt(lastRun.netForce) }} N</p>
          <section v-if="trials.length" class="trials">
            <div class="trials-heading"><h3>{{ tx('Recorded trials') }}</h3><button class="btn btn-small" type="button" @click="clearTrials">{{ tx('Clear trials') }}</button></div>
            <div class="table-scroll"><table><thead><tr><th>{{ tx('Trial') }}</th><th>{{ tx('Surface') }}</th><th>{{ tx('Mass') }}</th><th>{{ tx('Net force') }}</th><th>{{ tx('Acceleration') }}</th></tr></thead><tbody><tr v-for="(trial, index) in trials" :key="index"><td>{{ index + 1 }}</td><td>{{ tx(trial.scenario === 'horizontal' ? 'Horizontal surface' : 'Inclined plane') }}</td><td>{{ trial.mass }} kg</td><td>{{ fmt(trial.netForce) }} N</td><td>{{ fmt(trial.acceleration) }} m/s²</td></tr></tbody></table></div>
          </section>
        </div>

        <aside class="lab-side card">
          <label class="control-label" for="force-scenario">{{ tx('Surface') }}</label>
          <select id="force-scenario" v-model="scenario">
            <option value="horizontal">{{ tx('Horizontal surface') }}</option>
            <option value="incline">{{ tx('Inclined plane') }}</option>
          </select>
          <ParameterSlider v-model="mass" :label="tx('Block mass')" symbol="m" unit="kg" :min="1" :max="20" :step="1" :digits="0" :signed="false" />
          <ParameterSlider v-model="appliedForce" :label="tx('Applied force')" symbol="F_{app}" unit="N" :min="0" :max="100" :step="1" :digits="0" :signed="false" />
          <ParameterSlider v-model="frictionCoefficient" :label="tx('Friction coefficient')" symbol="\mu_k" unit="" :min="0" :max="0.8" :step="0.05" :digits="2" :signed="false" />
          <ParameterSlider v-if="scenario === 'incline'" v-model="inclineAngle" :label="tx('Incline angle')" symbol="\theta" unit="°" :min="0" :max="60" :step="1" :digits="0" :signed="false" />
          <ParameterSlider v-model="duration" :label="tx('Elapsed time')" symbol="t" unit="s" :min="1" :max="5" :step="0.5" :digits="1" :signed="false" />
          <button class="btn btn-primary" type="button" @click="runTrial">{{ tx('Run this trial') }}</button>
          <button class="btn" type="button" @click="resetPrediction">{{ tx('Reset prediction') }}</button>
          <p class="small muted">{{ tx('Change one setting at a time to see which force changes and how the net force responds.') }}</p>
        </aside>
      </div>
    </section>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('mathematicsDisclosure', locale) }}</summary>
      <section class="card prose">
        <h2><span class="step-no">3</span> {{ experimentSectionLabel('mathematics', locale) }}</h2>
        <p>{{ tx('Beginner: balanced forces cancel. If the net force is not zero, the block accelerates in the direction of the net force.') }}</p>
        <p v-if="atLeast(level, 'intermediate')">{{ tx('Intermediate: resolve each force into components parallel and perpendicular to the surface, then add the components.') }}</p>
        <MathFormula tex="\sum F_x = F_{app} - f - mg\sin\theta = ma_x" :display="true" />
        <MathFormula tex="\sum F_y = N - mg\cos\theta = 0" :display="true" />
        <p v-if="atLeast(level, 'advanced')">{{ tx('Advanced: in a local orthonormal basis, the constraint fixes the normal acceleration to zero. The tangential equation determines the acceleration; the normal equation determines the constraint force.') }}</p>
        <MathFormula v-if="atLeast(level, 'advanced')" tex="\vec F_{net}=\sum_i\vec F_i,\qquad \vec a=\frac{1}{m}\sum_i\vec F_i" :display="true" />
      </section>
    </details>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('meaningDisclosure', locale) }}</summary>
      <section class="card prose">
        <h2><span class="step-no">4</span> {{ experimentSectionLabel('meaning', locale) }}</h2>
        <h3>{{ tx('What the model teaches') }}</h3>
        <ul>
          <li>{{ tx('A free-body diagram includes every external force acting on the selected object.') }}</li>
          <li>{{ tx('The normal force is perpendicular to the surface; it is not automatically equal to the weight.') }}</li>
          <li>{{ tx('Friction opposes sliding, while the net force determines acceleration.') }}</li>
          <li>{{ tx('An object can move while its acceleration is zero, or accelerate while moving in the opposite direction.') }}</li>
        </ul>
        <h3>{{ tx('Model assumptions and limits') }}</h3>
        <p>{{ tx('This is a point-mass translational model in an inertial frame. The block starts from rest; one simplified friction coefficient sets the maximum friction force, which balances the tendency to slide below that limit. The applied force is parallel to the surface and the incline angle is fixed. Static friction, rotation, ropes, pulleys, air resistance and changing contact are not modelled.') }}</p>
        <p>{{ tx('The block starts from rest and the net force is constant during each trial. The displayed velocity and displacement therefore follow constant-acceleration kinematics.') }}</p>
      </section>
    </details>
  </article>
</template>

<style scoped>
.force-lab .prediction { display:grid; gap:10px; }
.prediction fieldset { display:flex; flex-wrap:wrap; gap:12px; border:0; padding:0; margin:0; }
.prediction legend { font-weight:650; margin-bottom:6px; }
.prediction label { display:flex; align-items:center; gap:7px; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); }
.verdict,.trial-note { padding:10px 12px; border-left:3px solid var(--accent); background:var(--surface-2); }
.scene-heading { display:flex; justify-content:space-between; flex-wrap:wrap; gap:6px; }
.force-diagram { display:block; width:100%; max-height:340px; margin:8px auto; overflow:visible; }
.trials { margin-top:18px; }
.trials-heading { display:flex; align-items:center; justify-content:space-between; gap:8px; }
.trials-heading h3 { margin:0; }
.force-key { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:7px 14px; }
.force-key > div { display:grid; grid-template-columns:10px 1fr auto; align-items:center; gap:7px; font-size:.84rem; }
.key-dot { width:9px; height:9px; border-radius:50%; }
.force-key strong { font-variant-numeric:tabular-nums; }
.readout-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(145px,1fr)); gap:10px; margin-top:18px; }
.readout-grid > div { display:grid; gap:3px; padding:10px; border-radius:var(--radius-sm); background:var(--surface-2); }
.readout-grid span { color:var(--text-muted); font-size:.8rem; }
.readout-grid strong { font-size:1.1rem; font-variant-numeric:tabular-nums; }
.lab-side { display:grid; align-content:start; gap:16px; }
.control-label { font-weight:650; }
.lab-side select { width:100%; min-height:42px; padding:8px; border:1px solid var(--border); border-radius:var(--radius-sm); background:var(--surface); color:var(--text); }
@media(max-width:640px) { .scene-heading { display:grid; } .prediction fieldset { display:grid; } }
</style>
