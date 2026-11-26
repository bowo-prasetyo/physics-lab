<script setup lang="ts">
import LocalizedExperimentGuide from '@/components/LocalizedExperimentGuide.vue'
import { getExperimentModuleEyebrow, experimentSectionLabel } from '@/i18n/experiment-metadata'
import ShareExperiment from '@/components/ShareExperiment.vue'
import ExperimentSupport from '@/components/ExperimentSupport.vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ParameterSlider from '@/components/ParameterSlider.vue'
import PredictionCard from '@/components/PredictionCard.vue'
import MathFormula from '@/components/MathFormula.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import { useLevel } from '@/composables/useLevel'
import { snapToRange, useQuerySync } from '@/composables/useQuerySync'
import { atLeast, isLevel } from '@/levels'
import { useLocale } from '@/composables/useLocale'
import { localizeExperimentText } from '@/i18n/experiment-ui'
import { localizePredictions } from '@/i18n/experiment-content'
import { gravitationalPotential, inclineFromRest } from '@/physics/inclinedPlane'
import { PREDICTIONS, type InclineRun } from './predictions'

const route = useRoute()
const level = useLevel()
const { locale } = useLocale()
const tx = (value: string) => localizeExperimentText(value, locale.value) ?? value
if (isLevel(route.query.level)) level.value = route.query.level

const MASS = { min: 0.5, max: 10, step: 0.5 }
const LENGTH = { min: 1, max: 10, step: 0.5 }
const ANGLE = { min: 5, max: 60, step: 1 }
const MU = { min: 0, max: 0.8, step: 0.05 }

const mass = ref(snapToRange(route.query.mass, MASS, 2))
const length = ref(snapToRange(route.query.length, LENGTH, 5))
const angleDeg = ref(snapToRange(route.query.angle, ANGLE, 30))
const muK = ref(snapToRange(route.query.muK, MU, 0))
const muS = ref(snapToRange(route.query.muS, MU, 0.3))
const runs = ref<InclineRun[]>([])

useQuerySync({
  sources: [mass, length, angleDeg, muK, muS, level],
  write: () => ({
    level: level.value,
    mass: String(mass.value),
    length: String(length.value),
    angle: String(angleDeg.value),
    muK: String(muK.value),
    muS: String(muS.value),
  }),
  read: (q) => {
    if (isLevel(q.level)) level.value = q.level
    mass.value = snapToRange(q.mass, MASS, mass.value)
    length.value = snapToRange(q.length, LENGTH, length.value)
    angleDeg.value = snapToRange(q.angle, ANGLE, angleDeg.value)
    muK.value = snapToRange(q.muK, MU, muK.value)
    muS.value = snapToRange(q.muS, MU, muS.value)
  },
})

const angleRad = computed(() => (angleDeg.value * Math.PI) / 180)
const result = computed(() =>
  inclineFromRest(mass.value, length.value, angleRad.value, muK.value, muS.value),
)
const peTop = computed(() => gravitationalPotential(mass.value, result.value.height))

const predictions = computed(() =>
  localizePredictions('inclined-plane', PREDICTIONS, locale.value).filter((p) =>
    atLeast(level.value, p.minLevel),
  ),
)
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed(runs.value)])))
const hints = computed(() =>
  Object.fromEntries(PREDICTIONS.map((p) => [p.id, localizeExperimentText(p.hint?.(runs.value) ?? null, locale.value)])),
)
const fmt = (n: number | null, digits = 3) => (n == null ? '—' : Number(n.toFixed(digits)).toString())

const setupKey = computed(
  () => `${mass.value}|${length.value}|${angleDeg.value}|${muK.value}|${muS.value}`,
)
const lastRunKey = ref<string | null>(null)
const shown = computed(() => lastRunKey.value === setupKey.value)

function runExperiment() {
  const r = result.value
  runs.value = [
    ...runs.value,
    {
      mass: mass.value,
      length: length.value,
      angleDeg: angleDeg.value,
      muK: muK.value,
      muS: muS.value,
      staysAtRest: r.staysAtRest,
      speedAtBottom: r.speedAtBottom,
      kineticAtBottom: r.kineticAtBottom,
      height: r.height,
    },
  ]
  lastRunKey.value = setupKey.value
}
</script>

<template>
  <article class="lesson container">
    <header class="lesson-head">
      <p class="eyebrow">{{ getExperimentModuleEyebrow('inclined-plane', locale) }}</p>
      <h1>{{ localizeExperimentText('Energy on an incline', locale) ?? 'Energy on an incline' }}</h1>
      <p class="lead">
        {{
          localizeExperimentText(
            'Release a block on a straight incline. Change the angle, the length and the friction, and see how gravitational potential energy turns into kinetic energy — or is partly lost to friction.',
            locale,
          ) ??
          'Release a block on a straight incline. Change the angle, the length and the friction, and see how gravitational potential energy turns into kinetic energy — or is partly lost to friction.'
        }}
      </p>
    </header>

    <ShareExperiment />

    <ExperimentSupport
      experiment-id="inclined-plane"
      :module-number="3"
      focus="On a frictionless incline the speed at the bottom depends only on the vertical drop; kinetic friction does negative work and reduces the final kinetic energy."
      prompt="Does a steeper path give a higher final speed when friction is absent? What does friction change?"
      action="Compare trials that share the same height but different angles (frictionless), then add kinetic friction on a fixed geometry."
      reflect="Why can the angle cancel out of the final-speed formula when friction is zero? Where does the energy go when friction is present?"
    />

    <section aria-labelledby="predict-title">
      <h2 id="predict-title"><span class="step-no">1</span> {{ experimentSectionLabel('predict', locale) }}</h2>
      <p class="muted">{{ tx('Choose an answer before running the model. Each explanation unlocks only after you have compared the relevant cases.') }}</p>
      <div class="prediction-grid">
        <PredictionCard
          v-for="(p, i) in predictions"
          :key="p.id"
          :prediction="p"
          :observed="observed[p.id] ?? false"
          :hint="hints[p.id]"
          :index="i + 1"
        />
      </div>
    </section>

    <section aria-labelledby="experiment-title">
      <h2 id="experiment-title"><span class="step-no">2</span> {{ experimentSectionLabel('experiment', locale) }}</h2>
      <div class="lab">
        <div class="lab-main card">
          <div class="incline-scene" role="img" :aria-label="`Incline ${angleDeg}°, length ${length} m, μ_k = ${muK}`">
            <div class="plane" :style="{ '--angle': angleDeg + 'deg' }">
              <span class="block">{{ mass }} kg</span>
            </div>
            <p class="muted small">
              h = {{ fmt(result.height, 2) }} m · θ = {{ angleDeg }}° ·
              {{ result.staysAtRest ? tx('held by static friction') : tx('slides') }}
            </p>
          </div>

          <div v-if="shown" class="readout-grid" aria-live="polite">
            <div>
              <span class="muted">{{ tx('Height') }}</span>
              <strong class="num">{{ fmt(result.height, 2) }} m</strong>
            </div>
            <div>
              <span class="muted">{{ tx('PE at top') }}</span>
              <strong class="num">{{ fmt(peTop, 2) }} J</strong>
            </div>
            <div>
              <span class="muted">{{ tx('Speed at bottom') }}</span>
              <strong class="num">{{ fmt(result.speedAtBottom, 2) }} m/s</strong>
            </div>
            <div>
              <span class="muted">{{ tx('KE at bottom') }}</span>
              <strong class="num">{{ fmt(result.kineticAtBottom, 2) }} J</strong>
            </div>
            <div>
              <span class="muted">{{ tx('Work by friction') }}</span>
              <strong class="num">{{ fmt(result.workByFriction, 2) }} J</strong>
            </div>
          </div>
          <p v-else class="pending">{{ tx('Run this trial to see the energy accounting.') }}</p>

          <h3>{{ tx('Recorded trials') }}</h3>
          <p v-if="runs.length === 0" class="muted">{{ localizeExperimentText('Run at least two carefully chosen cases to reveal a relationship.', locale) }}</p>
          <div v-else class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{{ tx('Trial') }}</th>
                  <th>θ (°)</th>
                  <th>L (m)</th>
                  <th>μ_k</th>
                  <th>v (m/s)</th>
                  <th>KE (J)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(run, i) in runs" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ run.angleDeg }}</td>
                  <td>{{ run.length }}</td>
                  <td>{{ run.muK }}</td>
                  <td>{{ fmt(run.speedAtBottom, 2) }}</td>
                  <td>{{ fmt(run.kineticAtBottom, 2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button class="btn btn-small" type="button" :disabled="runs.length === 0" @click="runs = []; lastRunKey = null">
            {{ localizeExperimentText('Clear recorded trials', locale) ?? 'Clear recorded trials' }}
          </button>
        </div>

        <aside class="lab-side card">
          <ParameterSlider v-model="mass" :label="tx('Mass')" symbol="m" unit="kg" v-bind="MASS" :digits="1" :signed="false" />
          <ParameterSlider v-model="length" :label="tx('Length along plane')" symbol="L" unit="m" v-bind="LENGTH" :digits="1" :signed="false" />
          <ParameterSlider v-model="angleDeg" :label="tx('Angle')" symbol="\\theta" unit="°" v-bind="ANGLE" :digits="0" :signed="false" />
          <ParameterSlider v-model="muK" :label="tx('Kinetic friction μ_k')" symbol="\\mu_k" unit="" v-bind="MU" :digits="2" :signed="false" />
          <ParameterSlider v-model="muS" :label="tx('Static friction μ_s')" symbol="\\mu_s" unit="" v-bind="MU" :digits="2" :signed="false" />
          <button class="btn btn-primary" type="button" @click="runExperiment">
            {{ localizeExperimentText('Run this trial', locale) ?? 'Run this trial' }}
          </button>
        </aside>
      </div>
    </section>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('mathematicsDisclosure', locale) }}</summary>
      <section class="card prose" aria-labelledby="maths-title">
        <h2 id="maths-title"><span class="step-no">3</span> {{ experimentSectionLabel('mathematics', locale) }}</h2>
        <p>{{ localizeExperimentText('The vertical height of the plane is', locale) }}</p>
        <MathFormula tex="h = L\sin\theta" :display="true" />
        <p>{{ localizeExperimentText('With no friction the work–energy theorem gives', locale) }}</p>
        <MathFormula tex="\tfrac12 m v^2 = m g h \quad\Rightarrow\quad v = \sqrt{2gh}" :display="true" />
        <p>{{ localizeExperimentText('When kinetic friction is present the friction force does negative work −μ_k N L, so', locale) }}</p>
        <MathFormula tex="\tfrac12 m v^2 = m g h - \mu_k (m g \cos\theta) L" :display="true" />
        <p v-if="atLeast(level, 'intermediate')">
          {{ localizeExperimentText('The block remains at rest if the component of weight down the plane does not exceed the maximum static friction: mg sin θ ≤ μ_s mg cos θ, i.e. tan θ ≤ μ_s.', locale) }}
        </p>
      </section>
    </details>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('meaningDisclosure', locale) }}</summary>
      <section aria-labelledby="meaning-title" class="card prose">
        <h2 id="meaning-title"><span class="step-no">4</span> {{ experimentSectionLabel('meaning', locale) }}</h2>
        <div class="meaning">
          <InfoCallout kind="physics" :title="experimentSectionLabel('establishedPhysics', locale)">
            <ul>
              <li>{{ localizeExperimentText('On a frictionless incline the final speed depends only on the vertical drop, not on the path length or the angle.', locale) }}</li>
              <li>{{ localizeExperimentText('Kinetic friction removes mechanical energy; the final kinetic energy is smaller than the initial potential energy.', locale) }}</li>
              <li>{{ localizeExperimentText('Static friction can prevent motion entirely when the angle is shallow enough relative to μ_s.', locale) }}</li>
            </ul>
          </InfoCallout>
          <InfoCallout kind="interpretation" :title="experimentSectionLabel('interpretation', locale)">
            <ul>
              <li>
                <strong>{{ tx('Why does angle cancel for the frictionless speed?') }}</strong>
                {{ tx('Gravity is a conservative force. Only the change in height matters for the work it does; the path taken between the same two heights does not.') }}
              </li>
            </ul>
          </InfoCallout>
        </div>
        <h3>{{ localizeExperimentText('Assumptions and limits', locale) }}</h3>
        <p>
          {{
            localizeExperimentText(
              'The plane is straight and rigid, the block does not rotate, and friction coefficients are constant. Air resistance and the transition from static to kinetic friction during the first moment of motion are idealised. For free-body diagrams and force components see Force Lab.',
              locale,
            )
          }}
        </p>
        <LocalizedExperimentGuide experiment-id="inclined-plane" />
      </section>
    </details>

    <nav class="next card" :aria-label="experimentSectionLabel('nextSteps', locale)">
      <p>{{ localizeExperimentText('Compare with the force picture in Force Lab, or return to the mass–spring to see pure elastic energy exchange.', locale) }}</p>
      <span class="nav-links">
        <RouterLink to="/mechanics/force-lab">{{ tx('Force Lab') }}</RouterLink>
        <RouterLink to="/mechanics/mass-spring">{{ tx('Mass–spring') }}</RouterLink>
        <RouterLink to="/teachers">{{ tx('Teacher guide') }}</RouterLink>
        <RouterLink to="/">{{ tx('All modules') }}</RouterLink>
      </span>
    </nav>
  </article>
</template>

<style scoped>
.lab {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 16px;
  align-items: start;
}
.lab-main,
.lab-side {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
.incline-scene {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 24px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
}
.plane {
  position: relative;
  width: 220px;
  height: 12px;
  background: var(--accent);
  border-radius: 4px;
  transform: rotate(calc(-1 * var(--angle)));
  transform-origin: left center;
}
.block {
  position: absolute;
  right: 8px;
  top: -28px;
  width: 36px;
  height: 28px;
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  font-weight: 700;
  background: var(--accent-soft);
  border: 2px solid var(--accent);
  border-radius: 4px;
}
.small {
  font-size: 0.85rem;
  margin: 0;
}
.readout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px;
}
.readout-grid > div {
  display: grid;
  gap: 3px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.readout-grid strong {
  font-size: 1.1rem;
}
.table-scroll {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}
th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
th {
  color: var(--text-muted);
  font-size: 0.85rem;
}
.pending {
  margin: 0;
  padding: 12px 14px;
  border-left: 3px solid var(--accent);
  border-radius: var(--radius-sm);
  background: var(--surface-2);
}
.btn-small {
  align-self: flex-start;
  min-height: 32px;
  padding: 0 10px;
  font-size: 0.85rem;
}
.nav-links {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 16px;
}
@media (max-width: 900px) {
  .lab {
    grid-template-columns: 1fr;
  }
}
</style>
