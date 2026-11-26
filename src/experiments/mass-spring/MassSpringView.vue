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
import {
  elasticPotential,
  kineticEnergy,
  period,
  stateAtTime,
  totalEnergy,
} from '@/physics/massSpring'
import { makeRun, PREDICTIONS, type SpringRun } from './predictions'

const route = useRoute()
const level = useLevel()
const { locale } = useLocale()
const tx = (value: string) => localizeExperimentText(value, locale.value) ?? value
if (isLevel(route.query.level)) level.value = route.query.level

const K = { min: 1, max: 40, step: 1 }
const MASS = { min: 0.5, max: 8, step: 0.5 }
const AMP = { min: 0.1, max: 1.5, step: 0.1 }
const k = ref(snapToRange(route.query.k, K, 10))
const mass = ref(snapToRange(route.query.mass, MASS, 1))
const amplitude = ref(snapToRange(route.query.amplitude, AMP, 0.5))
const runs = ref<SpringRun[]>([])

useQuerySync({
  sources: [k, mass, amplitude, level],
  write: () => ({
    level: level.value,
    k: String(k.value),
    mass: String(mass.value),
    amplitude: String(amplitude.value),
  }),
  read: (q) => {
    if (isLevel(q.level)) level.value = q.level
    k.value = snapToRange(q.k, K, k.value)
    mass.value = snapToRange(q.mass, MASS, mass.value)
    amplitude.value = snapToRange(q.amplitude, AMP, amplitude.value)
  },
})

const T = computed(() => period(k.value, mass.value))
const E = computed(() => totalEnergy(k.value, amplitude.value))
// Sample at a few characteristic times for the energy readout
const atQuarter = computed(() => stateAtTime(k.value, mass.value, amplitude.value, T.value / 4))
const maxKE = computed(() => kineticEnergy(mass.value, atQuarter.value.v))
const maxPE = computed(() => elasticPotential(k.value, amplitude.value))

const predictions = computed(() =>
  localizePredictions('mass-spring', PREDICTIONS, locale.value).filter((p) => atLeast(level.value, p.minLevel)),
)
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed(runs.value)])))
const hints = computed(() =>
  Object.fromEntries(PREDICTIONS.map((p) => [p.id, localizeExperimentText(p.hint?.(runs.value) ?? null, locale.value)])),
)
const fmt = (n: number, digits = 3) => Number(n.toFixed(digits)).toString()

const setupKey = computed(() => `${k.value}|${mass.value}|${amplitude.value}`)
const lastRunKey = ref<string | null>(null)
const shown = computed(() => lastRunKey.value === setupKey.value)

function runExperiment() {
  runs.value = [...runs.value, makeRun(k.value, mass.value, amplitude.value)]
  lastRunKey.value = setupKey.value
}
</script>

<template>
  <article class="lesson container">
    <header class="lesson-head">
      <p class="eyebrow">{{ getExperimentModuleEyebrow('mass-spring', locale) }}</p>
      <h1>{{ localizeExperimentText('Mass–spring: Hooke’s law and energy', locale) ?? 'Mass–spring: Hooke’s law and energy' }}</h1>
      <p class="lead">
        {{
          localizeExperimentText(
            'Stretch a spring, release a mass, and watch the period and the energy. Change mass, stiffness or amplitude and test what the ideal oscillator does — and does not — depend on.',
            locale,
          ) ??
          'Stretch a spring, release a mass, and watch the period and the energy. Change mass, stiffness or amplitude and test what the ideal oscillator does — and does not — depend on.'
        }}
      </p>
    </header>

    <ShareExperiment />

    <ExperimentSupport
      experiment-id="mass-spring"
      :module-number="3"
      focus="The period of an ideal mass–spring system depends on mass and stiffness, not on how far you pull it; mechanical energy is conserved and exchanges between kinetic and elastic potential forms."
      prompt="Does a larger amplitude make the oscillation slower? What about a heavier mass or a stiffer spring?"
      action="Change one variable at a time, record the period, and compare trials that isolate amplitude, mass or k."
      reflect="Where does the energy go when the mass is at the extreme points? At the equilibrium point? Which idealisations does this model make?"
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
          <div
            class="spring-scene"
            role="img"
            :aria-label="
              locale === 'id'
                ? `Pegas dengan konstanta ${k} N/m dan massa ${mass} kg, simpangan awal ${amplitude} m`
                : locale === 'ja'
                  ? `ばね定数 ${k} N/m、質量 ${mass} kg、初期変位 ${amplitude} m`
                  : `Spring of stiffness ${k} N/m with mass ${mass} kg, released from ${amplitude} m`
            "
          >
            <div class="spring-label">k = {{ k }} N/m</div>
            <div class="spring-visual">
              <span class="wall"></span>
              <span class="coil"></span>
              <span class="mass-block">{{ mass }} kg</span>
            </div>
            <p class="muted small">{{ tx('Ideal horizontal track · released from rest · no damping') }}</p>
          </div>

          <div v-if="shown" class="readout-grid" aria-live="polite">
            <div>
              <span class="muted">{{ tx('Period') }}</span>
              <strong class="num">{{ fmt(T, 3) }} s</strong>
            </div>
            <div>
              <span class="muted">{{ tx('Total energy') }}</span>
              <strong class="num">{{ fmt(E, 3) }} J</strong>
            </div>
            <div>
              <span class="muted">{{ tx('Max PE (at ends)') }}</span>
              <strong class="num">{{ fmt(maxPE, 3) }} J</strong>
            </div>
            <div>
              <span class="muted">{{ tx('Max KE (at centre)') }}</span>
              <strong class="num">{{ fmt(maxKE, 3) }} J</strong>
            </div>
          </div>
          <p v-else class="pending">{{ tx('Run this trial to see the period and the energy exchange.') }}</p>

          <h3>{{ tx('Recorded trials') }}</h3>
          <p v-if="runs.length === 0" class="muted">{{ localizeExperimentText('Run at least two carefully chosen cases to reveal a relationship.', locale) }}</p>
          <div v-else class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{{ tx('Trial') }}</th>
                  <th>k (N/m)</th>
                  <th>m (kg)</th>
                  <th>A (m)</th>
                  <th>T (s)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(run, i) in runs" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ run.k }}</td>
                  <td>{{ run.mass }}</td>
                  <td>{{ run.amplitude }}</td>
                  <td>{{ fmt(run.period, 3) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button class="btn btn-small" type="button" :disabled="runs.length === 0" @click="runs = []; lastRunKey = null">
            {{ localizeExperimentText('Clear recorded trials', locale) ?? 'Clear recorded trials' }}
          </button>
        </div>

        <aside class="lab-side card">
          <ParameterSlider
            v-model="k"
            :label="localizeExperimentText('Spring constant', locale) ?? 'Spring constant'"
            symbol="k"
            unit="N/m"
            v-bind="K"
            :digits="0"
            :signed="false"
          />
          <ParameterSlider
            v-model="mass"
            :label="localizeExperimentText('Mass', locale) ?? 'Mass'"
            symbol="m"
            unit="kg"
            v-bind="MASS"
            :digits="1"
            :signed="false"
          />
          <ParameterSlider
            v-model="amplitude"
            :label="localizeExperimentText('Amplitude', locale) ?? 'Amplitude'"
            symbol="A"
            unit="m"
            v-bind="AMP"
            :digits="1"
            :signed="false"
          />
          <button class="btn btn-primary" type="button" @click="runExperiment">
            {{ localizeExperimentText('Run this trial', locale) ?? 'Run this trial' }}
          </button>
          <p class="small muted">
            {{ localizeExperimentText('For a fair comparison, change one variable at a time and keep the others fixed.', locale) }}
          </p>
        </aside>
      </div>
    </section>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('mathematicsDisclosure', locale) }}</summary>
      <section class="card prose" aria-labelledby="maths-title">
        <h2 id="maths-title"><span class="step-no">3</span> {{ experimentSectionLabel('mathematics', locale) }}</h2>
        <p>{{ localizeExperimentText('Hooke’s law for an ideal spring gives a restoring force proportional to displacement:', locale) }}</p>
        <MathFormula tex="F = -kx" :display="true" />
        <p>{{ localizeExperimentText('Newton’s second law then yields simple harmonic motion with angular frequency', locale) }}</p>
        <MathFormula tex="\omega = \sqrt{\frac{k}{m}}, \qquad T = 2\pi\sqrt{\frac{m}{k}}" :display="true" />
        <p>{{ localizeExperimentText('Released from rest at amplitude A the displacement and velocity are', locale) }}</p>
        <MathFormula tex="x(t) = A\cos(\omega t), \qquad v(t) = -A\omega\sin(\omega t)" :display="true" />
        <p v-if="atLeast(level, 'intermediate')">
          {{ localizeExperimentText('Mechanical energy is conserved and continuously exchanges between elastic potential and kinetic forms:', locale) }}
        </p>
        <MathFormula v-if="atLeast(level, 'intermediate')" tex="E = \tfrac12 k A^2 = \tfrac12 m v^2 + \tfrac12 k x^2" :display="true" />
        <p v-if="atLeast(level, 'advanced')">
          {{ localizeExperimentText('The period is independent of amplitude only while the force remains linear in x. Real springs deviate at large extensions; damping and non-Hookean behaviour then appear.', locale) }}
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
              <li>{{ localizeExperimentText('The period of an ideal mass–spring system depends on mass and spring stiffness, not on amplitude.', locale) }}</li>
              <li>{{ localizeExperimentText('A stiffer spring or a lighter mass produces a higher frequency (shorter period).', locale) }}</li>
              <li>{{ localizeExperimentText('At the extremes of the motion the energy is entirely elastic potential; at equilibrium it is entirely kinetic.', locale) }}</li>
            </ul>
          </InfoCallout>
          <InfoCallout kind="interpretation" :title="experimentSectionLabel('interpretation', locale)">
            <ul>
              <li>
                <strong>{{ tx('Why is the period independent of amplitude?') }}</strong>
                {{ tx('Because the restoring force grows in exact proportion to displacement. A larger swing means a proportionally larger acceleration, so the mass covers the extra distance in the same time.') }}
              </li>
              <li>
                <strong>{{ tx('Where does the energy live?') }}</strong>
                {{ tx('In the spring’s deformation (elastic PE) and in the mass’s motion (KE). The sum stays constant while the system is isolated and the spring remains Hookean.') }}
              </li>
            </ul>
          </InfoCallout>
        </div>
        <h3>{{ localizeExperimentText('Assumptions and limits', locale) }}</h3>
        <p>
          {{
            localizeExperimentText(
              'This is a one-dimensional, undamped, linear spring on a frictionless horizontal track. Gravity does no work along the motion. Real springs have mass, can buckle or yield, and experience air resistance and internal friction; those effects are omitted so that the ideal relationships can be seen clearly.',
              locale,
            )
          }}
        </p>
        <LocalizedExperimentGuide experiment-id="mass-spring" />
      </section>
    </details>

    <nav class="next card" :aria-label="experimentSectionLabel('nextSteps', locale)">
      <p>{{ localizeExperimentText('Continue: examine how forces and energy appear on an inclined plane, where gravity and friction both do work.', locale) }}</p>
      <span class="nav-links">
        <RouterLink to="/mechanics/inclined-plane">{{ tx('Energy on an incline') }}</RouterLink>
        <RouterLink to="/mechanics/force-lab">{{ tx('Force Lab') }}</RouterLink>
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
.spring-scene {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
}
.spring-label {
  font-weight: 700;
  color: var(--accent);
}
.spring-visual {
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
  max-width: 360px;
}
.wall {
  width: 12px;
  height: 64px;
  background: var(--text-muted);
  border-radius: 2px;
}
.coil {
  flex: 1;
  height: 8px;
  background: repeating-linear-gradient(
    90deg,
    var(--accent) 0 6px,
    transparent 6px 10px
  );
  border-radius: 2px;
}
.mass-block {
  display: grid;
  place-items: center;
  width: 72px;
  height: 48px;
  border: 3px solid var(--accent);
  border-radius: 8px;
  background: var(--accent-soft);
  font-weight: 700;
  font-size: 0.9rem;
}
.small {
  font-size: 0.85rem;
  margin: 0;
}
.readout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
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
  font-size: 1.15rem;
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
