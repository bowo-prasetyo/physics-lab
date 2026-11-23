<script setup lang="ts">
import LocalizedExperimentGuide from '@/components/LocalizedExperimentGuide.vue'
import ShareExperiment from '@/components/ShareExperiment.vue'
import ExperimentSupport from '@/components/ExperimentSupport.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MathFormula from '@/components/MathFormula.vue'
import ParameterSlider from '@/components/ParameterSlider.vue'
import PredictionCard from '@/components/PredictionCard.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import GalaxyField from '@/components/GalaxyField.vue'
import ScaleFactorChart from '@/components/ScaleFactorChart.vue'
import EvolvingSpaceMath from './EvolvingSpaceMath.vue'
import { PREDICTIONS, expansionOf } from './predictions'
import {
  A_BREAKDOWN,
  A_FIRST_GALAXIES,
  A_FIRST_LIGHT,
  GALAXIES,
  GRID_COLUMNS,
  GRID_ROWS,
  GRID_SPACING,
  TARGET_RANGE,
  isModelId,
  useEvolvingSpace,
} from './useEvolvingSpace'
import { COSMOLOGIES } from '@/physics'
import { snapToRange, useQuerySync } from '@/composables/useQuerySync'
import { useLevel } from '@/composables/useLevel'
import { atLeast, isLevel } from '@/levels'
import { useLocale } from '@/composables/useLocale'
import { localizeExperimentText } from '@/i18n/experiment-ui'
import { localizePredictions } from '@/i18n/experiment-content'

const route = useRoute()
const level = useLevel()
const { locale } = useLocale()
const num = (value: unknown) => (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value)) ? Number(value) : undefined)

// A setup can be shared as a link, e.g. #/cosmology/evolving-space?level=advanced&model=our&t=13.8
if (isLevel(route.query.level)) level.value = route.query.level
const { model, cosmology, expansion, t, direction, running, home, target, readings, accelerationTime, record, run, stop, setTime, setHome } =
  useEvolvingSpace({
    model: isModelId(route.query.model) ? route.query.model : 'our',
    t: num(route.query.t),
    target: snapToRange(route.query.d, TARGET_RANGE, 5),
  })

useQuerySync({
  sources: [model, level, target, running, t],
  write: () => ({ level: level.value, model: model.value, t: t.value.toFixed(2), d: String(target.value) }),
  read: (query) => {
    if (isLevel(query.level)) level.value = query.level
    if (isModelId(query.model)) model.value = query.model
    const time = num(query.t)
    if (time !== undefined) setTime(time)
    target.value = snapToRange(query.d, TARGET_RANGE, target.value)
  },
})

const predictions = computed(() => localizePredictions('evolving-space', PREDICTIONS, locale.value).filter((p) => atLeast(level.value, p.minLevel)))
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed([record.value])])))
const hints = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, localizeExperimentText(p.hint?.([record.value]) ?? null, locale.value)])))

const intermediate = computed(() => atLeast(level.value, 'intermediate'))
const advanced = computed(() => atLeast(level.value, 'advanced'))

const timeModel = computed({ get: () => t.value, set: (v: number) => setTime(v) })
const timeLabel = computed(() => {
  const e = expansion.value
  if (e.hasBigBang) return `${formatGyr(t.value)} after the Big Bang`
  const rel = t.value - e.tToday
  if (Math.abs(rel) < 0.005) return 'today'
  return `${formatGyr(Math.abs(rel))} ${rel > 0 ? 'from now' : 'ago'}`
})

function formatGyr(gyr: number): string {
  if (gyr >= 1) return `${gyr.toFixed(2)} billion years`
  if (gyr >= 1e-3) return `${Math.round(gyr * 1000)} million years`
  if (gyr >= 1e-6) return `${Math.round(gyr * 1e6).toLocaleString('en-US')} thousand years`
  return 'a tiny fraction of a second'
}

const milestones = computed(() => {
  const e = expansion.value
  const list: { label: string; t: number }[] = []
  if (e.hasBigBang) list.push({ label: 'Big Bang', t: 0 })
  list.push({ label: 'First light (CMB)', t: e.timeAt(A_FIRST_LIGHT) })
  list.push({ label: 'First galaxies', t: e.timeAt(A_FIRST_GALAXIES) })
  list.push({ label: 'Half today’s size', t: e.timeAt(0.5) })
  list.push({ label: 'Today', t: e.tToday })
  list.push({ label: 'Twice today’s size', t: e.timeAt(2) })
  return list.filter((m) => m.t >= e.tMin - 1e-9 && m.t <= e.tMax + 1e-9)
})

const compare = computed(() => (model.value === 'our' ? null : expansionOf('our')))
const accelerationMarker = computed(() => (advanced.value ? accelerationTime.value : null))
const hubblePerGyr = computed(() => (readings.value.hubbleDistance === null ? null : 1 / readings.value.hubbleDistance))

const sig = (x: number, digits = 3) => Number(x.toPrecision(digits)).toLocaleString('en-US', { maximumSignificantDigits: digits })
const expansionWord = computed(() => {
  const q = readings.value.q
  if (q === null) return '—'
  if (Math.abs(q) < 0.005) return 'coasting'
  return q > 0 ? 'slowing down' : 'speeding up'
})
</script>

<template>
  <article class="lesson container">
    <header class="lesson-head">
      <p class="eyebrow">{{ localizeExperimentText('Module 6 · Cosmology · Experiment D', locale) ?? 'Module 6 · Cosmology · Experiment D' }}</p>
      <h1>{{ localizeExperimentText('Evolving space', locale) ?? 'Evolving space' }}</h1>
      <p class="lead">{{ localizeExperimentText('A model universe filled with galaxies. Run it forwards and backwards in time. What grows, what stays the same, and where does the model stop making sense?', locale) ?? 'A model universe filled with galaxies. Run it forwards and backwards in time. What grows, what stays the same, and where does the model stop making sense?' }}</p>
    </header>

    <ShareExperiment />

    <LocalizedExperimentGuide experiment-id="evolving-space" />

    <ExperimentSupport experiment-id="evolving-space" :module-number="6" focus="Distinguish the expansion of distances between comoving locations from motion through static space." prompt="If the scale factor doubles, what happens to the separation of two comoving galaxies?" action="Run at least two cosmological models and compare their scale-factor and Hubble histories at the same epoch." reflect="Which conclusions follow from the chosen model, and what observational evidence would be needed to test it?" />

    <section aria-labelledby="predict-title">
      <h2 id="predict-title"><span class="step-no">1</span> Predict</h2>
      <p class="muted">Commit to an answer first. Each explanation unlocks only after you have tested it in the experiment below.</p>
      <div class="prediction-grid">
        <PredictionCard v-for="(p, i) in predictions" :key="p.id" :prediction="p" :observed="observed[p.id] ?? false" :hint="hints[p.id]" :index="i + 1" />
      </div>
    </section>

    <section aria-labelledby="experiment-title">
      <h2 id="experiment-title"><span class="step-no">2</span> Experiment</h2>
      <div class="lab">
        <div class="lab-main card">
          <label class="model-select">
            <span>Universe</span>
            <select v-model="model">
              <option v-for="c in COSMOLOGIES" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </label>
          <GalaxyField
            :galaxies="GALAXIES"
            :period="{ x: GRID_COLUMNS * GRID_SPACING, y: GRID_ROWS * GRID_SPACING }"
            :home="home"
            :a="readings.a"
            :hubble="hubblePerGyr"
            :stage="readings.stage"
            :temperature="readings.temperature"
            @select="setHome"
          />
          <p class="muted small">
            Click any galaxy to make it “home”. Arrows show how fast the others recede from it. The galaxies themselves keep their size:
            gravity holds them together. The pattern repeats in every direction, so no galaxy is at an edge.
          </p>
          <ScaleFactorChart :expansion="expansion" :compare="compare" :t="t" :acceleration-time="accelerationMarker" />
        </div>

        <div class="lab-side card">
          <div class="clock">
            <span class="clock-label">Cosmic time</span>
            <span class="clock-value">{{ timeLabel }}</span>
            <span class="clock-sub num">a = {{ sig(readings.a, 4) }}</span>
          </div>
          <div class="buttons">
            <button class="btn" type="button" :disabled="t <= expansion.tMin" @click="running && direction === -1 ? stop() : run(-1)">
              {{ running && direction === -1 ? 'Pause' : '◀ Backwards' }}
            </button>
            <button class="btn btn-primary" type="button" :disabled="t >= expansion.tMax" @click="running && direction === 1 ? stop() : run(1)">
              {{ running && direction === 1 ? 'Pause' : 'Forwards ▶' }}
            </button>
          </div>
          <div class="time-slider">
            <label for="cosmic-time">Jump to a time</label>
            <input id="cosmic-time" v-model.number="timeModel" type="range" :min="expansion.tMin" :max="expansion.tMax" step="0.01" />
            <div class="presets">
              <button v-for="m in milestones" :key="m.label" type="button" class="chip" @click="setTime(m.t)">{{ m.label }}</button>
            </div>
          </div>

          <dl class="readouts">
            <div>
              <dt>Distances compared with today</dt>
              <dd class="num">{{ readings.a < A_BREAKDOWN ? 'model fails' : readings.a >= 0.01 ? `${sig(readings.a * 100)}%` : `1/${sig(1 / readings.a)}` }}</dd>
            </div>
            <div><dt>Expansion is</dt><dd>{{ expansionWord }}</dd></div>
            <div v-if="readings.redshift !== null"><dt>Light from now, seen today: redshift z</dt><dd class="num">{{ sig(readings.redshift) }}</dd></div>
            <div v-if="readings.temperature !== null"><dt>Background radiation</dt><dd class="num">{{ sig(readings.temperature) }} K</dd></div>
            <template v-if="intermediate">
              <div><dt>Hubble rate H</dt><dd class="num">{{ readings.hubbleKmSMpc === null ? '—' : `${sig(readings.hubbleKmSMpc)} km/s/Mpc` }}</dd></div>
              <div><dt>Hubble distance c/H</dt><dd class="num">{{ readings.hubbleDistance === null ? '—' : `${sig(readings.hubbleDistance)} Gly` }}</dd></div>
            </template>
            <div v-if="advanced"><dt>Deceleration q</dt><dd class="num">{{ readings.q === null ? '—' : sig(readings.q) }}</dd></div>
          </dl>

          <div class="target">
            <ParameterSlider
              v-model="target"
              :label="localizeExperimentText('A distant galaxy, today at', locale) ?? 'A distant galaxy, today at'"
              symbol="d_0"
              unit="Gly"
              v-bind="TARGET_RANGE"
              :signed="false"
              :hint="localizeExperimentText('Distance today, in billions of light-years.', locale) ?? 'Distance today, in billions of light-years.'"
            />
            <dl class="readouts">
              <div><dt>Its distance at this time</dt><dd class="num">{{ sig(readings.targetDistance) }} Gly</dd></div>
              <div :class="{ ftl: (readings.targetSpeed ?? 0) >= 1 }">
                <dt>Its recession speed</dt>
                <dd class="num">{{ readings.targetSpeed === null ? '—' : `${sig(readings.targetSpeed)} c` }}</dd>
              </div>
            </dl>
          </div>
          <p class="small muted">{{ cosmology.name }}: H₀ = {{ cosmology.h0 }} km/s/Mpc.</p>
        </div>
      </div>
    </section>

    <details class="lesson-disclosure">
      <summary>{{ localizeExperimentText('3 · Explore the mathematics', locale) ?? '3 · Explore the mathematics' }}</summary>
      <section aria-labelledby="maths-title" class="card prose">
      <h2 id="maths-title"><span class="step-no">3</span> The mathematics</h2>
      <EvolvingSpaceMath :level="level" :cosmology="cosmology" :expansion="expansion" :a="readings.a" :hubble="hubblePerGyr" :target="target" />
    </section>
    </details>

    <details class="lesson-disclosure">
      <summary>{{ localizeExperimentText('4 · Explore the meaning and interpretation', locale) ?? '4 · Explore the meaning and interpretation' }}</summary>
      <section aria-labelledby="meaning-title" class="card prose">
      <h2 id="meaning-title"><span class="step-no">4</span> {{ localizeExperimentText('What does it tell us?', locale) }}</h2>
      <div class="meaning">
        <InfoCallout kind="physics" :title="localizeExperimentText('Established physics', locale)">
          <ul>
            <li>{{ localizeExperimentText('Distant galaxies recede with speeds proportional to their distance (Lemaître, 1927; Hubble, 1929).', locale) }}</li>
            <li>
              {{ localizeExperimentText('The universe was once hot and dense: the cosmic microwave background, discovered in 1965, is light released when it became transparent, now cooled to 2.7 K. The amounts of hydrogen, helium and lithium agree with nuclear reactions in the first minutes.', locale) }}
            </li>
            <li>{{ localizeExperimentText('The expansion has been speeding up for about 6 billion years (distant supernovae, 1998; Nobel Prize 2011).', locale) }}</li>
            <li>{{ localizeExperimentText('Fitting all the data, the standard model gives an age of 13.8 billion years (Planck satellite, 2018).', locale) }}</li>
            <li>{{ localizeExperimentText('Objects bound by gravity or other forces, such as galaxies, planets and people, do not expand.', locale) }}</li>
          </ul>
        </InfoCallout>
        <InfoCallout kind="interpretation" :title="localizeExperimentText('Interpretation: open to debate', locale)">
          <ul>
            <li>
              <strong>{{ localizeExperimentText('Did time begin at the Big Bang?', locale) }}</strong> {{ localizeExperimentText('In classical general relativity the model has an edge at', locale) }} <MathFormula tex="a = 0" />{{ localizeExperimentText(', but the theory is not expected to hold there. Proposals include a quantum “no-boundary” beginning, a bounce from an earlier contracting phase, and eternal inflation. None is confirmed.', locale) }}
            </li>
            <li>
              <strong>{{ localizeExperimentText('Is time fundamental?', locale) }}</strong> {{ localizeExperimentText('In some approaches to quantum gravity the basic equation has no time in it, and time emerges from how parts of the universe change relative to each other, for example using the size of the universe itself as a clock. This bears directly on whether space and time are separate fundamental things.', locale) }}
            </li>
            <li>
              <strong>{{ localizeExperimentText('Is space really stretching?', locale) }}</strong> {{ localizeExperimentText('“Expanding space” is a natural description in these coordinates. Some physicists prefer to describe the same thing as galaxies moving apart. As in Experiment E, the predictions are the same.', locale) }}
            </li>
          </ul>
        </InfoCallout>
      </div>
    </section>
    </details>

    <nav class="next card" :aria-label="localizeExperimentText('Next steps', locale)">
      <p><strong>See also:</strong> Experiment C for clocks in gravity, and Experiment E for the 3 + 1 split.</p>
      <span class="nav-links">
        <RouterLink to="/gravity/clock-rates">Experiment C</RouterLink>
        <RouterLink to="/relativity/two-perspectives">Experiment E</RouterLink>
        <RouterLink to="/">All modules</RouterLink>
      </span>
    </nav>
  </article>
</template>

<style scoped>
.lab {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 16px;
  align-items: start;
}

.lab-main {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.lab-side {
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: sticky;
  top: 76px;
}

.model-select {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

select {
  font: inherit;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  max-width: 100%;
}

.small {
  font-size: 0.85rem;
  margin: 0;
}

.clock {
  display: grid;
  text-align: center;
  gap: 2px;
  padding: 10px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
}

.clock-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.clock-value {
  font-size: 1.15rem;
  font-weight: 700;
}

.clock-sub {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.time-slider label {
  font-weight: 600;
}

input[type='range'] {
  width: 100%;
  accent-color: var(--accent);
}

.presets {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.chip {
  padding: 2px 8px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  font-size: 0.78rem;
  cursor: pointer;
}

.chip:hover {
  background: var(--surface-2);
}

.readouts {
  display: grid;
  gap: 6px;
  margin: 0;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

.readouts div {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.readouts dt {
  color: var(--text-muted);
}

.readouts dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
  white-space: nowrap;
}

.ftl dt,
.ftl dd {
  color: var(--observer);
}

.target {
  display: grid;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
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

  .lab-side {
    position: static;
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
