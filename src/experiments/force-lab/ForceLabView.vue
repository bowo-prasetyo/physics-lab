<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ExperimentSupport from '@/components/ExperimentSupport.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import MathFormula from '@/components/MathFormula.vue'
import ParameterSlider from '@/components/ParameterSlider.vue'
import PredictionCard from '@/components/PredictionCard.vue'
import ShareExperiment from '@/components/ShareExperiment.vue'
import { useLevel } from '@/composables/useLevel'
import { useLocale } from '@/composables/useLocale'
import { snapToRange, useQuerySync } from '@/composables/useQuerySync'
import { localizePredictions } from '@/i18n/experiment-content'
import { experimentSectionLabel, getExperimentModuleEyebrow } from '@/i18n/experiment-metadata'
import { atLeast, isLevel } from '@/levels'
import { calculateForceLab, type ForceLabResult, type ForceLabScenario } from '@/physics/forceLab'
import { workOnForceLabBlock } from '@/physics/energy'
import { localizeForceLabText } from './copy'
import { PREDICTIONS, type ForceTrial } from './predictions'

const route = useRoute()
const level = useLevel()
const { locale } = useLocale()
const tx = (value: string) => localizeForceLabText(value, locale.value)

const MASS = { min: 1, max: 20, step: 1 }
const FORCE = { min: 0, max: 100, step: 1 }
const MU = { min: 0, max: 0.8, step: 0.05 }
const ANGLE = { min: 0, max: 60, step: 1 }
const TIME = { min: 1, max: 5, step: 0.5 }

const isScenario = (value: unknown): value is ForceLabScenario => value === 'horizontal' || value === 'incline'
const scenario = ref<ForceLabScenario>(isScenario(route.query.surface) ? route.query.surface : 'horizontal')
const mass = ref(snapToRange(route.query.m, MASS, 5))
const appliedForce = ref(snapToRange(route.query.F, FORCE, 30))
const staticFrictionCoefficient = ref(snapToRange(route.query.us, MU, 0.4))
// Kinetic friction never exceeds static friction (see the physics model).
const kineticFrictionCoefficient = ref(Math.min(snapToRange(route.query.uk, MU, 0.2), staticFrictionCoefficient.value))
const inclineAngle = ref(snapToRange(route.query.angle, ANGLE, 20))
const duration = ref(snapToRange(route.query.t, TIME, 2))
if (isLevel(route.query.level)) level.value = route.query.level

watch(staticFrictionCoefficient, (us) => {
  if (kineticFrictionCoefficient.value > us) kineticFrictionCoefficient.value = us
})

useQuerySync({
  sources: [scenario, mass, appliedForce, staticFrictionCoefficient, kineticFrictionCoefficient, inclineAngle, duration, level],
  write: () => ({
    level: level.value,
    surface: scenario.value,
    m: String(mass.value),
    F: String(appliedForce.value),
    us: staticFrictionCoefficient.value.toFixed(2),
    uk: kineticFrictionCoefficient.value.toFixed(2),
    angle: String(inclineAngle.value),
    t: String(duration.value),
  }),
  read: (query) => {
    if (isLevel(query.level)) level.value = query.level
    if (isScenario(query.surface)) scenario.value = query.surface
    mass.value = snapToRange(query.m, MASS, mass.value)
    appliedForce.value = snapToRange(query.F, FORCE, appliedForce.value)
    staticFrictionCoefficient.value = snapToRange(query.us, MU, staticFrictionCoefficient.value)
    kineticFrictionCoefficient.value = Math.min(snapToRange(query.uk, MU, kineticFrictionCoefficient.value), staticFrictionCoefficient.value)
    inclineAngle.value = snapToRange(query.angle, ANGLE, inclineAngle.value)
    duration.value = snapToRange(query.t, TIME, duration.value)
  },
})

const angleInUse = computed(() => (scenario.value === 'incline' ? inclineAngle.value : 0))
const result = computed(() => calculateForceLab({
  scenario: scenario.value,
  mass: mass.value,
  appliedForce: appliedForce.value,
  staticFrictionCoefficient: staticFrictionCoefficient.value,
  kineticFrictionCoefficient: kineticFrictionCoefficient.value,
  inclineAngle: angleInUse.value,
  duration: duration.value,
}))

// Results stay hidden until the current setup has been run.
const setupKey = computed(() => [scenario.value, mass.value, appliedForce.value, staticFrictionCoefficient.value, kineticFrictionCoefficient.value, angleInUse.value, duration.value].join('|'))
const lastRunKey = ref<string | null>(null)
const shown = computed<ForceLabResult | null>(() => (lastRunKey.value === setupKey.value ? result.value : null))
const trials = ref<ForceTrial[]>([])
// Work done by each force during the trial; net work equals the kinetic energy gained from rest.
const work = computed(() => (shown.value ? workOnForceLabBlock(shown.value, mass.value) : null))

function runTrial() {
  const r = result.value
  trials.value = [...trials.value, {
    scenario: scenario.value,
    mass: mass.value,
    appliedForce: appliedForce.value,
    staticFrictionCoefficient: staticFrictionCoefficient.value,
    kineticFrictionCoefficient: kineticFrictionCoefficient.value,
    inclineAngle: angleInUse.value,
    frictionRegime: r.frictionRegime,
    frictionForce: r.frictionForce,
    normalForce: r.normalForce,
    netForce: r.netForce,
    acceleration: r.acceleration,
    displacement: r.displacement,
    frictionWork: workOnForceLabBlock(r, mass.value).friction,
  }]
  lastRunKey.value = setupKey.value
}
function clearTrials() {
  trials.value = []
  lastRunKey.value = null
}

const predictions = computed(() => localizePredictions('force-lab', PREDICTIONS, locale.value).filter((p) => atLeast(level.value, p.minLevel)))
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed(trials.value)])))
const hints = computed(() => Object.fromEntries(PREDICTIONS.map((p) => {
  const hint = p.hint?.(trials.value) ?? null
  return [p.id, hint === null ? null : tx(hint)]
})))

const fmt = (value: number, digits = 2) => {
  const v = Number(value.toFixed(digits))
  return String(Object.is(v, -0) ? 0 : v)
}
// Before a run only the push is drawn; the model's forces appear once it has run.
const drawnForces = computed(() => (shown.value ? shown.value.forces : result.value.forces.filter((force) => force.id === 'applied')))
const maximumForce = computed(() => Math.max(20, ...result.value.forces.map((force) => Math.hypot(force.x, force.y))))
const arrowScale = computed(() => 72 / maximumForce.value)
const vectorEnd = (x: number, y: number) => ({ x: 250 + x * arrowScale.value, y: 166 - y * arrowScale.value })
type ForceId = 'applied' | 'friction' | 'normal' | 'weight-parallel' | 'weight-normal'
const vectorLabel = (id: ForceId) => ({
  applied: tx('Applied force'),
  friction: tx('Friction'),
  normal: tx('Normal force'),
  'weight-parallel': tx('Weight along slope'),
  'weight-normal': tx('Weight into surface'),
}[id])
const vectorColor = (id: ForceId) => ({
  applied: 'var(--accent)',
  friction: 'var(--warn)',
  normal: 'var(--success)',
  'weight-parallel': 'var(--observer)',
  'weight-normal': 'var(--observer)',
}[id])
const vectorId = (id: string) => `arrow-${id}`
const surfaceLabel = (s: ForceLabScenario) => tx(s === 'horizontal' ? 'Horizontal surface' : 'Inclined plane')
</script>

<template>
  <article class="lesson container force-lab">
    <header class="lesson-head">
      <p class="eyebrow">{{ getExperimentModuleEyebrow('force-lab', locale) }}</p>
      <h1>{{ tx('Force Lab: free-body diagrams and multiple forces') }}</h1>
      <p class="lead">{{ tx('A push is only one part of the story. Draw every force on a block, find their vector sum, and predict how its motion changes.') }}</p>
    </header>

    <ShareExperiment />

    <ExperimentSupport
      experiment-id="force-lab"
      :module-number="3"
      focus="Acceleration is set by the vector sum of every force on the block. Static friction is only as large as it needs to be, up to a limit."
      prompt="If a push does not move the block, how large is the friction force? What changes once the block starts to slide?"
      action="Change one setting at a time, run each trial, and compare the friction regime, the net force and the acceleration."
      reflect="Which forces in the diagram depend on the mass, and which do not? Why does that make the angle at which sliding starts independent of mass?"
    />

    <section aria-labelledby="predict-title">
      <h2 id="predict-title"><span class="step-no">1</span> {{ experimentSectionLabel('predict', locale) }}</h2>
      <p class="muted">{{ tx('Commit to an answer first. Each explanation unlocks only after you have run the trials that test it.') }}</p>
      <div class="prediction-grid">
        <PredictionCard v-for="(p, i) in predictions" :key="p.id" :prediction="p" :observed="observed[p.id] ?? false" :hint="hints[p.id]" :index="i + 1" />
      </div>
    </section>

    <section aria-labelledby="experiment-title">
      <h2 id="experiment-title"><span class="step-no">2</span> {{ experimentSectionLabel('experiment', locale) }}</h2>
      <div class="lab">
        <div class="lab-main card">
          <div class="scene-heading">
            <strong>{{ surfaceLabel(scenario) }}</strong>
            <span class="muted small">{{ tx('Free-body diagram · forces on the block') }}</span>
          </div>
          <svg class="force-diagram" viewBox="0 0 500 320" role="img" :aria-label="tx('Free-body diagram showing applied force, friction, normal force and weight components')">
            <defs>
              <marker v-for="id in (['applied', 'friction', 'normal', 'weight-parallel', 'weight-normal'] as const)" :id="vectorId(id)" :key="id" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L6,3 L0,6 Z" :fill="vectorColor(id)" />
              </marker>
            </defs>
            <g :transform="`rotate(-${angleInUse} 250 166)`">
              <line x1="65" y1="215" x2="435" y2="215" stroke="var(--border-strong, var(--text-muted))" stroke-width="3" />
              <rect x="218" y="137" width="64" height="58" rx="7" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2" />
              <g v-for="force in drawnForces" :key="force.id">
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
              <text x="212" y="150" text-anchor="end" fill="var(--text)" font-size="13" font-weight="700">{{ mass }} kg</text>
            </g>
            <text x="250" y="292" text-anchor="middle" fill="var(--text-muted)" font-size="12">{{ tx('Vector lengths are scaled for readability; values are shown below.') }}</text>
          </svg>

          <template v-if="shown">
            <div class="force-key">
              <div v-for="force in shown.forces" :key="force.id">
                <span class="key-dot" :style="{ background: vectorColor(force.id) }"></span>
                <span>{{ vectorLabel(force.id) }}</span>
                <strong>{{ fmt(Math.hypot(force.x, force.y)) }} N</strong>
              </div>
            </div>
            <div class="readout-grid" aria-live="polite">
              <div><span>{{ tx('Friction regime') }}</span><strong>{{ tx(shown.frictionRegime === 'static' ? 'Static friction · at rest' : 'Kinetic friction · sliding') }}</strong></div>
              <div><span>{{ tx('Maximum static friction') }}</span><strong>{{ fmt(shown.maximumStaticFriction) }} N</strong></div>
              <div><span>{{ tx('Friction force') }}</span><strong>{{ fmt(shown.frictionForce) }} N</strong></div>
              <div><span>{{ tx('Net force along surface') }}</span><strong>{{ fmt(shown.netForce) }} N</strong></div>
              <div><span>{{ tx('Acceleration') }}</span><strong>{{ fmt(shown.acceleration) }} m/s²</strong></div>
              <div><span>{{ tx('Velocity after') }} {{ duration }} s</span><strong>{{ fmt(shown.velocity) }} m/s</strong></div>
              <div><span>{{ tx('Displacement after') }} {{ duration }} s</span><strong>{{ fmt(shown.displacement) }} m</strong></div>
            </div>
            <p class="small muted">{{ tx('Positive values point up the slope or to the right. Negative values point down the slope or to the left.') }}</p>
            <div v-if="work" class="energy" aria-live="polite">
              <h3>{{ tx('Work and energy in this trial') }}</h3>
              <div class="readout-grid">
                <div><span>{{ tx('Work by the push') }}</span><strong>{{ fmt(work.applied, 1) }} J</strong></div>
                <div><span>{{ tx('Work by friction') }}</span><strong>{{ fmt(work.friction, 1) }} J</strong></div>
                <div v-if="scenario === 'incline'"><span>{{ tx('Work by gravity') }}</span><strong>{{ fmt(work.gravity, 1) }} J</strong></div>
                <div><span>{{ tx('Work by the normal force') }}</span><strong>{{ fmt(work.normal, 1) }} J</strong></div>
                <div><span>{{ tx('Net work') }}</span><strong>{{ fmt(work.net, 1) }} J</strong></div>
                <div><span>{{ tx('Kinetic energy gained, ½mv²') }}</span><strong>{{ fmt(work.finalKineticEnergy, 1) }} J</strong></div>
              </div>
              <p class="small muted">{{ tx('Work is the force along the motion times the distance moved. A force against the motion does negative work. The net work always equals the kinetic energy gained.') }}</p>
            </div>
          </template>
          <p v-else class="pending">{{ tx('Run this trial to see every force on the block, the friction regime and the acceleration.') }}</p>

          <section v-if="trials.length" class="trials">
            <div class="trials-heading"><h3>{{ tx('Recorded trials') }}</h3><button class="btn btn-small" type="button" @click="clearTrials">{{ tx('Clear trials') }}</button></div>
            <div class="table-scroll">
              <table>
                <thead><tr><th>{{ tx('Trial') }}</th><th>{{ tx('Surface') }}</th><th>{{ tx('Mass') }}</th><th>{{ tx('Applied force') }}</th><th>{{ tx('Friction regime') }}</th><th>{{ tx('Friction force') }}</th><th>{{ tx('Normal force') }}</th><th>{{ tx('Acceleration') }}</th></tr></thead>
                <tbody>
                  <tr v-for="(trial, index) in trials" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ surfaceLabel(trial.scenario) + (trial.scenario === 'incline' ? ` · ${trial.inclineAngle}°` : '') }}</td>
                    <td>{{ trial.mass }} kg</td>
                    <td>{{ trial.appliedForce }} N</td>
                    <td>{{ tx(trial.frictionRegime === 'static' ? 'Static' : 'Kinetic') }}</td>
                    <td>{{ fmt(trial.frictionForce) }} N</td>
                    <td>{{ fmt(trial.normalForce) }} N</td>
                    <td>{{ fmt(trial.acceleration) }} m/s²</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside class="lab-side card">
          <label class="control-label" for="force-scenario">{{ tx('Surface') }}</label>
          <select id="force-scenario" v-model="scenario">
            <option value="horizontal">{{ tx('Horizontal surface') }}</option>
            <option value="incline">{{ tx('Inclined plane') }}</option>
          </select>
          <ParameterSlider v-model="mass" :label="tx('Block mass')" symbol="m" unit="kg" v-bind="MASS" :digits="0" :signed="false" />
          <ParameterSlider v-model="appliedForce" :label="tx('Applied force')" symbol="F_{app}" unit="N" v-bind="FORCE" :digits="0" :signed="false" />
          <ParameterSlider v-model="staticFrictionCoefficient" :label="tx('Static friction coefficient')" symbol="\mu_s" unit="" v-bind="MU" :digits="2" :signed="false" />
          <ParameterSlider v-model="kineticFrictionCoefficient" :label="tx('Kinetic friction coefficient')" symbol="\mu_k" unit="" :min="0" :max="staticFrictionCoefficient" :step="0.05" :digits="2" :signed="false" />
          <p class="small muted">{{ tx('Kinetic friction cannot exceed static friction, so μk stays at or below μs.') }}</p>
          <ParameterSlider v-if="scenario === 'incline'" v-model="inclineAngle" :label="tx('Incline angle')" symbol="\theta" unit="°" v-bind="ANGLE" :digits="0" :signed="false" />
          <ParameterSlider v-model="duration" :label="tx('Elapsed time')" symbol="t" unit="s" v-bind="TIME" :digits="1" :signed="false" />
          <button class="btn btn-primary" type="button" @click="runTrial">{{ tx('Run this trial') }}</button>
          <p class="small muted">{{ tx('Change one setting at a time to see when static friction reaches its limit and sliding begins.') }}</p>
        </aside>
      </div>
    </section>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('mathematicsDisclosure', locale) }}</summary>
      <section aria-labelledby="maths-title" class="card prose">
        <h2 id="maths-title"><span class="step-no">3</span> {{ experimentSectionLabel('mathematics', locale) }}</h2>
        <p>{{ tx('Beginner: balanced forces cancel. Static friction can take any value needed for rest, up to its maximum. If the tendency to slide exceeds that maximum, kinetic friction acts while the block slides.') }}</p>
        <MathFormula tex="F_{net} = ma, \qquad f_s \le f_{s,\max}" :display="true" />
        <p>{{ tx('Work and energy: each force does work equal to its component along the motion times the distance moved. Their sum, the net work, is the kinetic energy the block gains.') }}</p>
        <MathFormula tex="W = F_{\parallel}\,d, \qquad W_{net} = \Delta K = \tfrac12 m v^2" :display="true" />
        <p v-if="atLeast(level, 'intermediate')">{{ tx('Intermediate: resolve each force into components parallel and perpendicular to the surface, then compare the tangential tendency with the maximum static friction.') }}</p>
        <MathFormula v-if="atLeast(level, 'intermediate')" tex="f_s\leq\mu_s N,\qquad f_{s,\max}=\mu_s N" :display="true" />
        <MathFormula v-if="atLeast(level, 'intermediate')" tex="\begin{gathered} f_k=\mu_k N \\ \sum F_x=F_{app}-mg\sin\theta+F_{fr,x}=ma_x \end{gathered}" :display="true" />
        <MathFormula v-if="atLeast(level, 'intermediate')" tex="\sum F_y=N-mg\cos\theta=0" :display="true" />
        <p v-if="atLeast(level, 'advanced')">{{ tx('Advanced: at rest, friction is a constraint force that takes the value required by tangential equilibrium, provided that value does not exceed the Coulomb limit. Beyond the threshold, the model switches to kinetic friction opposite the impending motion.') }}</p>
        <MathFormula v-if="atLeast(level, 'advanced')" tex="|F_{app}-mg\sin\theta|\leq\mu_s N\;\Rightarrow\;a_x=0" :display="true" />
        <MathFormula v-if="atLeast(level, 'advanced')" tex="|F_{app}-mg\sin\theta|>\mu_s N\;\Rightarrow\;f_k=\mu_kN" :display="true" />
        <p v-if="atLeast(level, 'advanced')">{{ tx('With no push, both sides of the sliding condition are proportional to m, so the mass cancels:') }}</p>
        <MathFormula v-if="atLeast(level, 'advanced')" tex="mg\sin\theta > \mu_s mg\cos\theta \iff \tan\theta > \mu_s" :display="true" />
      </section>
    </details>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('meaningDisclosure', locale) }}</summary>
      <section aria-labelledby="meaning-title" class="card prose">
        <h2 id="meaning-title"><span class="step-no">4</span> {{ experimentSectionLabel('meaning', locale) }}</h2>
        <div class="meaning">
          <InfoCallout kind="physics" :title="experimentSectionLabel('establishedPhysics', locale)">
            <ul>
              <li>{{ tx('A free-body diagram includes every external force acting on the selected object.') }}</li>
              <li>{{ tx('The normal force is perpendicular to the surface; it is not automatically equal to the weight.') }}</li>
              <li>{{ tx('Static friction adjusts to the force needed for rest; it is not always at its maximum.') }}</li>
              <li>{{ tx('When the static limit is exceeded, kinetic friction acts opposite the sliding direction.') }}</li>
              <li>{{ tx('An object can move while its acceleration is zero, or accelerate while moving in the opposite direction.') }}</li>
            </ul>
          </InfoCallout>
          <InfoCallout kind="interpretation" :title="experimentSectionLabel('interpretation', locale)">
            <ul>
              <li>
                <strong>{{ tx('Is friction a fundamental force?') }}</strong>
                {{ tx('No. It is the combined effect of countless electromagnetic interactions between two rough surfaces. The rule f ≤ μN is an empirical model that works well for many dry surfaces, not a law of nature, and μ has to be measured for each pair of materials.') }}
              </li>
              <li>
                <strong>{{ tx('What does a model leave out?') }}</strong>
                {{ tx('Physicists still study why friction depends so little on contact area and so much on the materials. A simple model can be useful precisely because it ignores those details.') }}
              </li>
            </ul>
          </InfoCallout>
        </div>
        <h3>{{ tx('Model assumptions and limits') }}</h3>
        <p>{{ tx('This is a point-mass translational model in an inertial frame. The block starts from rest. Static friction adjusts up to μsN; after the threshold is exceeded, kinetic friction has magnitude μkN and opposes the impending direction of motion. The applied force is parallel to the surface and the incline angle is fixed. The model switches regimes at breakaway without simulating the short transition, and assumes constant kinetic friction. Rotation, ropes, pulleys, air resistance and changing contact are not modelled.') }}</p>
        <p>{{ tx('The net force is constant during each trial after the friction regime is selected. The displayed velocity and displacement therefore follow constant-acceleration kinematics.') }}</p>
      </section>
    </details>

    <nav class="next card" :aria-label="experimentSectionLabel('nextSteps', locale)">
      <p>{{ tx('Next: in Momentum and collisions, two carts exert equal and opposite forces on each other during an impact.') }}</p>
      <span class="nav-links">
        <RouterLink to="/mechanics/momentum-collisions">{{ tx('Momentum and collisions') }}</RouterLink>
        <RouterLink to="/teachers">{{ tx('Teacher guide') }}</RouterLink>
        <RouterLink to="/">{{ tx('All modules') }}</RouterLink>
      </span>
    </nav>
  </article>
</template>

<style scoped>
.energy { margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border); }
.energy h3 { margin: 0 0 8px; font-size: 1rem; }
.lab { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 16px; align-items: start; }
.lab-main { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.lab-side { display: grid; align-content: start; gap: 14px; }
.scene-heading { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 6px; }
.force-diagram { display: block; width: 100%; max-height: 340px; margin: 8px auto; overflow: visible; }
.force-key { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 7px 14px; }
.force-key > div { display: grid; grid-template-columns: 10px 1fr auto; align-items: center; gap: 7px; font-size: .84rem; }
.key-dot { width: 9px; height: 9px; border-radius: 50%; }
.force-key strong { font-variant-numeric: tabular-nums; }
.readout-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(145px, 1fr)); gap: 10px; }
.readout-grid > div { display: grid; gap: 3px; padding: 10px; border-radius: var(--radius-sm); background: var(--surface-2); }
.readout-grid span { color: var(--text-muted); font-size: .8rem; }
.readout-grid strong { font-size: 1.1rem; font-variant-numeric: tabular-nums; }
.pending { margin: 0; padding: 12px 14px; border-left: 3px solid var(--accent); border-radius: var(--radius-sm); background: var(--surface-2); }
.trials { margin-top: 8px; }
.trials-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.trials-heading h3 { margin: 0; }
.table-scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
th, td { white-space: nowrap; }
th { color: var(--text-muted); font-size: .85rem; }
.control-label { font-weight: 650; }
.lab-side select { width: 100%; min-height: 42px; padding: 8px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); color: var(--text); }
.small { font-size: .85rem; margin: 0; }
.btn-small { min-height: 32px; padding: 0 10px; font-size: .85rem; }
.nav-links { display: inline-flex; flex-wrap: wrap; gap: 16px; }
@media (max-width: 900px) { .lab { grid-template-columns: 1fr; } }
@media (max-width: 640px) { .scene-heading { display: grid; } }
</style>
