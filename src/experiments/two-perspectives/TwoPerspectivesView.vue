<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MathFormula from '@/components/MathFormula.vue'
import ParameterSlider from '@/components/ParameterSlider.vue'
import PredictionCard from '@/components/PredictionCard.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import PredictionChart, { type ChartSeries } from '@/components/PredictionChart.vue'
import TwoPerspectivesMath from './TwoPerspectivesMath.vue'
import { PREDICTIONS } from './predictions'
import { DESCRIPTION_INFO, SCENARIO_INFO, derivation } from './content'
import { BETA_RANGE, SCENARIOS, isScenario, useTwoPerspectives } from './useTwoPerspectives'
import { DESCRIPTIONS, predict, type Description } from '@/physics'
import { snapToRange, useQuerySync } from '@/composables/useQuerySync'
import { useLevel } from '@/composables/useLevel'
import { atLeast, isLevel } from '@/levels'

const route = useRoute()
const level = useLevel()

// A setup can be shared as a link, e.g. #/relativity/two-perspectives?level=advanced&scenario=flashes&beta=0.6
if (isLevel(route.query.level)) level.value = route.query.level
const { scenario, beta, measured, observations, predictions, measurement, measure } = useTwoPerspectives({
  scenario: isScenario(route.query.scenario) ? route.query.scenario : 'light',
  beta: snapToRange(route.query.beta, BETA_RANGE, 0.5),
})

useQuerySync({
  sources: [scenario, beta, level],
  write: () => ({ level: level.value, scenario: scenario.value, beta: beta.value.toFixed(2) }),
  read: (query) => {
    if (isLevel(query.level)) level.value = query.level
    if (isScenario(query.scenario)) scenario.value = query.scenario
    beta.value = snapToRange(query.beta, BETA_RANGE, beta.value)
  },
})

const predictionList = computed(() => PREDICTIONS.filter((p) => atLeast(level.value, p.minLevel)))
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed(observations.value)])))
const hints = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.hint?.(observations.value) ?? null])))

const info = computed(() => SCENARIO_INFO[scenario.value])
const showWorkingOpen = computed(() => atLeast(level.value, 'intermediate'))

const format = (value: number) => `${value.toFixed(info.value.digits)} ${info.value.unit}`

/** How a description's prediction compares with the measurement. */
function verdict(d: Description): { ok: boolean; text: string } {
  const diff = predictions.value[d] - measurement.value
  if (Math.abs(diff) < 1e-9) return { ok: true, text: 'Matches the measurement' }
  const pct = Math.abs((100 * diff) / measurement.value)
  const percent = measurement.value !== 0 ? ` (${pct >= 10 ? pct.toFixed(0) : pct.toPrecision(2)}%)` : ''
  return { ok: false, text: `Off by ${Math.abs(diff).toFixed(info.value.digits)} ${info.value.unit}${percent}` }
}

const SAMPLES = Array.from({ length: 100 }, (_, i) => i / 100)
const chartSeries = computed<ChartSeries[]>(() =>
  DESCRIPTIONS.map((d) => ({
    id: d,
    kind: d,
    label: d === 'spacetime' ? `${DESCRIPTION_INFO[d].title} (dashed: lies on the Lorentz line)` : DESCRIPTION_INFO[d].title,
    dashed: d === 'spacetime',
    points: SAMPLES.map((x) => ({ x, y: predict(scenario.value, d, x) })),
  })),
)
</script>

<template>
  <article class="lesson container">
    <header class="lesson-head">
      <p class="eyebrow">Module 4 · Special relativity · Experiment E · Two perspectives</p>
      <h1>Space and time versus spacetime</h1>
      <p class="lead">
        Three mathematical descriptions of the same situations. Which ones match what we measure, and do the ones that match disagree about
        anything at all?
      </p>
    </header>

    <section aria-labelledby="predict-title">
      <h2 id="predict-title"><span class="step-no">1</span> Predict</h2>
      <p class="muted">Commit to an answer first. Each explanation unlocks only after you have tested it in the experiment below.</p>
      <div class="prediction-grid">
        <PredictionCard
          v-for="(p, i) in predictionList"
          :key="p.id"
          :prediction="p"
          :observed="observed[p.id] ?? false"
          :hint="hints[p.id]"
          :index="i + 1"
        />
      </div>
    </section>

    <section aria-labelledby="experiment-title">
      <h2 id="experiment-title"><span class="step-no">2</span> Experiment</h2>

      <div class="card setup">
        <fieldset class="tabs">
          <legend>Situation</legend>
          <label v-for="s in SCENARIOS" :key="s" :class="{ active: scenario === s }">
            <input v-model="scenario" type="radio" :value="s" class="sr-only" />
            {{ SCENARIO_INFO[s].tab }}
          </label>
        </fieldset>
        <p class="setup-text">{{ info.setup }}</p>
        <div class="setup-row">
          <ParameterSlider v-model="beta" label="Ship speed" symbol="v/c" unit="c" v-bind="BETA_RANGE" :digits="2" :signed="false" />
          <p class="question"><span class="muted">Predicting:</span> <strong>{{ info.quantity }}</strong></p>
        </div>
      </div>

      <div class="columns">
        <article v-for="d in DESCRIPTIONS" :key="d" :class="['card', 'description', d]">
          <h3>{{ DESCRIPTION_INFO[d].title }}</h3>
          <p class="assumption">{{ DESCRIPTION_INFO[d].assumption }}</p>
          <details class="working" :open="showWorkingOpen">
            <summary>Show the working</summary>
            <MathFormula display :tex="derivation(scenario, d, beta)" />
          </details>
          <p class="value num">{{ format(predictions[d]) }}</p>
          <p v-if="measured" class="badge" :class="verdict(d).ok ? 'ok' : 'off'">
            {{ verdict(d).ok ? '✓' : '✗' }} {{ verdict(d).text }}
          </p>
        </article>

        <article class="card description measurement" aria-live="polite">
          <h3>What experiments find</h3>
          <template v-if="!measured">
            <p class="assumption">Nature decides. Compare the three predictions, then check them against real measurements.</p>
            <button class="btn btn-primary" type="button" @click="measure">Make the measurement</button>
          </template>
          <template v-else>
            <p class="value num">{{ format(measurement) }}</p>
            <p class="evidence">{{ info.evidence }}</p>
          </template>
        </article>
      </div>

      <div class="card chart-card">
        <h3>The predictions at every speed</h3>
        <PredictionChart
          :series="chartSeries"
          :x-max="1"
          x-label="ship speed v (fraction of c)"
          :y-label="info.axis"
          :marker="beta"
          :measured="measured ? measurement : null"
        />
      </div>
    </section>

    <section aria-labelledby="maths-title" class="card prose">
      <h2 id="maths-title"><span class="step-no">3</span> The mathematics</h2>
      <TwoPerspectivesMath :level="level" :beta="beta" />
    </section>

    <section aria-labelledby="meaning-title" class="card prose">
      <h2 id="meaning-title"><span class="step-no">4</span> What does it tell us?</h2>
      <div class="meaning">
        <InfoCallout kind="physics" title="Established physics">
          <ul>
            <li>
              The speed of light is the same for every observer, whatever the motion of its source (Michelson and Morley, 1887; CERN, 1964).
              The Galilean description cannot accommodate this.
            </li>
            <li>The Galilean description is the low-speed limit of relativity: for objects much slower than light its errors are tiny.</li>
            <li>
              The space + time (Lorentz) description and the spacetime description are mathematically equivalent formulations of special
              relativity. They make identical predictions for every measurement.
            </li>
          </ul>
        </InfoCallout>
        <InfoCallout kind="interpretation" title="Interpretation: open to debate">
          <ul>
            <li>
              <strong>Is spacetime real, or a convenient bookkeeping?</strong> Equivalent predictions cannot settle this. Some physicists and
              philosophers take the four-dimensional geometry as the basic reality; others see it as a compact way of describing how
              measurements by different observers relate, with space and time (or the behaviour of rods and clocks) more basic.
            </li>
            <li>
              <strong>An instructive historical case:</strong> Lorentz’s own interpretation kept an absolute space and time, with a hidden
              “true” rest frame, and explained time dilation as an effect on moving clocks. It predicts exactly the same measurements as
              Einstein’s relativity, yet most physicists set it aside because its special frame can never be detected.
            </li>
            <li>
              <strong>Choosing a description</strong> is often a matter of convenience: 3 + 1 splits are standard in computer simulations of
              colliding black holes, while four-dimensional geometry makes invariants obvious.
            </li>
          </ul>
        </InfoCallout>
      </div>
    </section>

    <nav class="next card" aria-label="Next steps">
      <p><strong>Coming later:</strong> Experiment C, in which gravity, not motion, changes how fast clocks tick.</p>
      <span class="nav-links">
        <RouterLink to="/relativity/moving-clocks">← Experiment B</RouterLink>
        <RouterLink to="/">All modules</RouterLink>
      </span>
    </nav>
  </article>
</template>

<style scoped>
.lesson {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-top: 28px;
  padding-bottom: 48px;
}

.eyebrow {
  margin: 0 0 6px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
}

.lead {
  max-width: 68ch;
  font-size: 1.1rem;
  color: var(--text-muted);
}

h2 {
  display: flex;
  align-items: center;
  gap: 10px;
}

.step-no {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--on-accent);
  font-size: 0.9rem;
}

.prediction-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  align-items: start;
}

section[aria-labelledby='experiment-title'] {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 0 0 10px;
  padding: 0;
  border: 0;
}

.tabs legend {
  float: left;
  margin-right: 6px;
  font-weight: 700;
}

.tabs label {
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
}

.tabs label.active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent);
}

.tabs label:has(input:focus-visible) {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

.setup-text {
  max-width: 75ch;
}

.setup-row {
  display: grid;
  grid-template-columns: minmax(220px, 360px) 1fr;
  gap: 16px 24px;
  align-items: center;
}

.question {
  margin: 0;
}

.columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  align-items: stretch;
}

.description {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 5px solid var(--border);
  min-width: 0;
}

.description h3 {
  margin: 0;
}

.description.galilean {
  border-top-color: var(--observer);
}

.description.lorentz {
  border-top-color: var(--accent);
}

.description.spacetime {
  border-top-color: var(--success);
}

.description.measurement {
  border-top-color: var(--text);
  background: var(--surface-2);
}

.assumption {
  color: var(--text-muted);
  font-size: 0.92rem;
}

.working :deep(.katex-display) {
  font-size: 0.92em;
}

.working summary {
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
}

.value {
  margin: auto 0 0;
  font-size: 1.7rem;
  font-weight: 700;
}

.badge {
  margin: 0;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 700;
}

.badge.ok {
  background: var(--success-soft);
  color: var(--success);
}

.badge.off {
  background: var(--warn-soft);
  color: var(--warn);
}

.evidence {
  font-size: 0.88rem;
  margin: 0;
}

.measurement .btn {
  margin-top: auto;
}

.chart-card h3 {
  margin-bottom: 8px;
}

.prose :deep(p),
.prose :deep(li) {
  max-width: 75ch;
}

.meaning {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.meaning ul {
  padding-left: 1.2em;
}

.next {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.next p {
  margin: 0;
}

.nav-links {
  display: inline-flex;
  gap: 16px;
}

@media (max-width: 640px) {
  .setup-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 14px;
  }

  .prediction-grid,
  .meaning {
    grid-template-columns: 1fr;
  }
}
</style>
