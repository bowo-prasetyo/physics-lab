<script setup lang="ts">
import LocalizedExperimentGuide from '@/components/LocalizedExperimentGuide.vue'
import { getExperimentModuleEyebrow, experimentSectionLabel } from '@/i18n/experiment-metadata'
import ShareExperiment from '@/components/ShareExperiment.vue'
import ExperimentSupport from '@/components/ExperimentSupport.vue'
import ConceptBridge from '@/components/ConceptBridge.vue'
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
  HUBBLE_MAX,
  TARGET_RANGE,
  isModelId,
  useEvolvingSpace,
} from './useEvolvingSpace'
import { COSMOLOGIES, HUBBLE_SAMPLE_SEED, fitHubbleConstant, illustrativeHubbleSample } from '@/physics'
import { snapToRange, useQuerySync } from '@/composables/useQuerySync'
import { useLevel } from '@/composables/useLevel'
import { atLeast, isLevel } from '@/levels'
import { useLocale } from '@/composables/useLocale'
import { localizeExperimentText } from '@/i18n/experiment-ui'
import { formatNumber } from '@/i18n/formatters'
import { localizePredictions } from '@/i18n/experiment-content'

const route = useRoute()
const level = useLevel()
const { locale } = useLocale()
const tx = (value: string) => localizeExperimentText(value, locale.value) ?? value
const num = (value: unknown) => (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value)) ? Number(value) : undefined)

// A setup can be shared as a link, e.g. #/cosmology/evolving-space?level=advanced&model=our&t=13.8
if (isLevel(route.query.level)) level.value = route.query.level
const { model, cosmology, expansion, t, direction, running, home, target, readings, accelerationTime, record, run, stop, setTime, setHome, galaxiesObserved, observeGalaxies, clearGalaxies } =
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
  if (e.hasBigBang) return `${formatGyr(t.value)} ${tx('after the Big Bang')}`
  const rel = t.value - e.tToday
  if (Math.abs(rel) < 0.005) return tx('today')
  return `${formatGyr(Math.abs(rel))} ${tx(rel > 0 ? 'from now' : 'ago')}`
})

function formatGyr(gyr: number): string {
  if (gyr >= 1) return `${formatNumber(gyr, { maximumFractionDigits: 2 })} ${tx('billion years')}`
  if (gyr >= 1e-3) return `${formatNumber(Math.round(gyr * 1000))} ${tx('million years')}`
  if (gyr >= 1e-6) return `${formatNumber(Math.round(gyr * 1e6))} ${tx('thousand years')}`
  return tx('a tiny fraction of a second')
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

// Hubble diagram: an illustrative sample drawn from this model's H₀ with realistic scatter.
const HUBBLE_AXES = { distance: 140, speed: 10000 } as const
const hubbleSample = computed(() => illustrativeHubbleSample(HUBBLE_MAX, { h0: cosmology.value.h0, seed: HUBBLE_SAMPLE_SEED }))
const hubblePoints = computed(() => hubbleSample.value.slice(0, galaxiesObserved.value))
const hubbleFit = computed(() => (hubblePoints.value.length >= 2 ? fitHubbleConstant(hubblePoints.value) : null))
const hx = (d: number) => 56 + (d / HUBBLE_AXES.distance) * 504
const hy = (v: number) => 262 - (v / HUBBLE_AXES.speed) * 240
const lineTo = (slope: number) => {
  const d = Math.min(HUBBLE_AXES.distance, HUBBLE_AXES.speed / slope)
  return { x2: hx(d), y2: hy(slope * d) }
}

const sig = (x: number, digits = 3) => formatNumber(Number(x.toPrecision(digits)), { maximumSignificantDigits: digits })
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
      <p class="eyebrow">{{ getExperimentModuleEyebrow('evolving-space', locale) }}</p>
      <h1>{{ localizeExperimentText('Evolving space', locale) ?? 'Evolving space' }}</h1>
      <p class="lead">{{ localizeExperimentText('A model universe filled with galaxies. Run it forwards and backwards in time. What grows, what stays the same, and where does the model stop making sense?', locale) ?? 'A model universe filled with galaxies. Run it forwards and backwards in time. What grows, what stays the same, and where does the model stop making sense?' }}</p>
    </header>

    <ShareExperiment />

    <ExperimentSupport experiment-id="evolving-space" :module-number="6" focus="Distinguish the expansion of distances between comoving locations from motion through static space." prompt="If the scale factor doubles, what happens to the separation of two comoving galaxies?" action="Run at least two cosmological models and compare their scale-factor and Hubble histories at the same epoch." reflect="Which conclusions follow from the chosen model, and what observational evidence would be needed to test it?" />

    <section aria-labelledby="predict-title">
      <h2 id="predict-title"><span class="step-no">1</span> {{ experimentSectionLabel('predict', locale) }}</h2>
      <p class="muted">{{ tx('Commit to an answer first. Each explanation unlocks only after you have tested it in the experiment below.') }}</p>
      <div class="prediction-grid">
        <PredictionCard v-for="(p, i) in predictions" :key="p.id" :prediction="p" :observed="observed[p.id] ?? false" :hint="hints[p.id]" :index="i + 1" />
      </div>
    </section>

    <section aria-labelledby="experiment-title">
      <h2 id="experiment-title"><span class="step-no">2</span> {{ experimentSectionLabel('experiment', locale) }}</h2>
      <div class="lab">
        <div class="lab-main card">
          <label class="model-select">
            <span>{{ tx('Universe') }}</span>
            <select v-model="model">
              <option v-for="c in COSMOLOGIES" :key="c.id" :value="c.id">{{ tx(c.name) }}</option>
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
            {{ tx('Click any galaxy to make it “home”. Arrows show how fast the others recede from it. The galaxies themselves keep their size: gravity holds them together. The pattern repeats in every direction, so no galaxy is at an edge.') }}
          </p>
          <ScaleFactorChart :expansion="expansion" :compare="compare" :t="t" :acceleration-time="accelerationMarker" />
        </div>

        <div class="lab-side card">
          <div class="clock">
            <span class="clock-label">{{ tx('Cosmic time') }}</span>
            <span class="clock-value">{{ tx(timeLabel) }}</span>
            <span class="clock-sub num">a = {{ sig(readings.a, 4) }}</span>
          </div>
          <div class="buttons">
            <button class="btn" type="button" :disabled="t <= expansion.tMin" @click="running && direction === -1 ? stop() : run(-1)">
              {{ running && direction === -1 ? tx('Pause') : tx('◀ Backwards') }}
            </button>
            <button class="btn btn-primary" type="button" :disabled="t >= expansion.tMax" @click="running && direction === 1 ? stop() : run(1)">
              {{ running && direction === 1 ? tx('Pause') : tx('Forwards ▶') }}
            </button>
          </div>
          <div class="time-slider">
            <label for="cosmic-time">{{ tx('Jump to a time') }}</label>
            <input id="cosmic-time" v-model.number="timeModel" type="range" :min="expansion.tMin" :max="expansion.tMax" step="0.01" />
            <div class="presets">
              <button v-for="m in milestones" :key="m.label" type="button" class="chip" @click="setTime(m.t)">{{ tx(m.label) }}</button>
            </div>
          </div>

          <dl class="readouts">
            <div>
              <dt>{{ tx('Distances compared with today') }}</dt>
              <dd class="num">{{ readings.a < A_BREAKDOWN ? tx('model fails') : readings.a >= 0.01 ? `${sig(readings.a * 100)}%` : `1/${sig(1 / readings.a)}` }}</dd>
            </div>
            <div><dt>{{ tx('Expansion is') }}</dt><dd>{{ tx(expansionWord) }}</dd></div>
            <div v-if="readings.redshift !== null"><dt>{{ tx('Light from now, seen today: redshift z') }}</dt><dd class="num">{{ sig(readings.redshift) }}</dd></div>
            <div v-if="readings.temperature !== null"><dt>{{ tx('Background radiation') }}</dt><dd class="num">{{ sig(readings.temperature) }} K</dd></div>
            <template v-if="intermediate">
              <div><dt>{{ tx('Hubble rate H') }}</dt><dd class="num">{{ readings.hubbleKmSMpc === null ? '—' : `${sig(readings.hubbleKmSMpc)} km/s/Mpc` }}</dd></div>
              <div><dt>{{ tx('Hubble distance c/H') }}</dt><dd class="num">{{ readings.hubbleDistance === null ? '—' : `${sig(readings.hubbleDistance)} Gly` }}</dd></div>
            </template>
            <div v-if="advanced"><dt>{{ tx("Deceleration q") }}</dt><dd class="num">{{ readings.q === null ? '—' : sig(readings.q) }}</dd></div>
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
              <div><dt>{{ tx("Its distance at this time") }}</dt><dd class="num">{{ sig(readings.targetDistance) }} Gly</dd></div>
              <div :class="{ ftl: (readings.targetSpeed ?? 0) >= 1 }">
                <dt>{{ tx("Its recession speed") }}</dt>
                <dd class="num">{{ readings.targetSpeed === null ? '—' : `${sig(readings.targetSpeed)} c` }}</dd>
              </div>
            </dl>
          </div>
          <p class="small muted">{{ tx(cosmology.name) }}: H₀ = {{ cosmology.h0 }} km/s/Mpc.</p>
        </div>
      </div>

      <div class="card hubble-card">
        <h3>{{ tx('Hubble diagram: nearby galaxies today') }}</h3>
        <p class="muted small">{{ tx('Each point is one galaxy: its measured distance, and its recession speed worked out from its redshift. These galaxies are illustrative, generated from the model with realistic scatter, not a real catalogue.') }}</p>
        <svg class="hubble-plot" viewBox="0 0 600 300" role="img" :aria-label="tx('Hubble diagram: nearby galaxies today')">
          <g class="hubble-grid">
            <line v-for="d in [20, 40, 60, 80, 100, 120, 140]" :key="'x' + d" :x1="hx(d)" :x2="hx(d)" :y1="hy(0)" :y2="hy(HUBBLE_AXES.speed)" />
            <line v-for="v in [2000, 4000, 6000, 8000, 10000]" :key="'y' + v" :x1="hx(0)" :x2="hx(HUBBLE_AXES.distance)" :y1="hy(v)" :y2="hy(v)" />
          </g>
          <line class="hubble-axis" :x1="hx(0)" :y1="hy(0)" :x2="hx(HUBBLE_AXES.distance)" :y2="hy(0)" />
          <line class="hubble-axis" :x1="hx(0)" :y1="hy(0)" :x2="hx(0)" :y2="hy(HUBBLE_AXES.speed)" />
          <text v-for="d in [0, 40, 80, 120]" :key="'tx' + d" class="hubble-tick" :x="hx(d)" :y="hy(0) + 16" text-anchor="middle">{{ d }}</text>
          <text v-for="v in [0, 4000, 8000]" :key="'ty' + v" class="hubble-tick" :x="hx(0) - 6" :y="hy(v) + 4" text-anchor="end">{{ formatNumber(v) }}</text>
          <text class="hubble-label" :x="hx(HUBBLE_AXES.distance / 2)" y="296" text-anchor="middle">{{ tx('Distance (Mpc)') }}</text>
          <text class="hubble-label" x="14" :y="hy(HUBBLE_AXES.speed / 2)" text-anchor="middle" :transform="`rotate(-90 14 ${hy(HUBBLE_AXES.speed / 2)})`">{{ tx('Recession speed (km/s)') }}</text>
          <line v-if="advanced && hubbleFit" class="hubble-model" :x1="hx(0)" :y1="hy(0)" v-bind="lineTo(cosmology.h0)" />
          <line v-if="hubbleFit" class="hubble-fit" :x1="hx(0)" :y1="hy(0)" v-bind="lineTo(hubbleFit.h0)" />
          <circle v-for="(p, i) in hubblePoints" :key="i" class="hubble-point" :cx="hx(p.distance)" :cy="hy(p.speed)" r="4.5" />
          <text v-if="!hubblePoints.length" class="hubble-tick" :x="hx(HUBBLE_AXES.distance / 2)" :y="hy(HUBBLE_AXES.speed / 2)" text-anchor="middle">{{ tx('Observe some galaxies to start the diagram.') }}</text>
        </svg>
        <div class="hubble-controls">
          <button class="btn btn-primary" type="button" :disabled="galaxiesObserved >= HUBBLE_MAX" @click="observeGalaxies">{{ tx('Observe 8 more galaxies') }}</button>
          <button class="btn" type="button" :disabled="galaxiesObserved === 0" @click="clearGalaxies">{{ tx('Start again') }}</button>
        </div>
        <dl class="readouts hubble-readouts">
          <div><dt>{{ tx('Galaxies observed') }}</dt><dd class="num">{{ galaxiesObserved }} / {{ HUBBLE_MAX }}</dd></div>
          <div>
            <dt>{{ tx('H₀ from the best straight line') }}</dt>
            <dd class="num">{{ hubbleFit === null ? '—' : intermediate ? `${formatNumber(hubbleFit.h0, { maximumFractionDigits: 1, minimumFractionDigits: 1 })} ± ${formatNumber(hubbleFit.standardError, { maximumFractionDigits: 1, minimumFractionDigits: 1 })} km/s/Mpc` : `${formatNumber(Math.round(hubbleFit.h0))} km/s/Mpc` }}</dd>
          </div>
          <div v-if="advanced"><dt>{{ tx('The model’s H₀ (dashed)') }}</dt><dd class="num">{{ cosmology.h0 }} km/s/Mpc</dd></div>
        </dl>
      </div>
    </section>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('mathematicsDisclosure', locale) }}</summary>
      <section aria-labelledby="maths-title" class="card prose">
      <h2 id="maths-title"><span class="step-no">3</span> {{ experimentSectionLabel('mathematics', locale) }}</h2>
      <EvolvingSpaceMath :level="level" :cosmology="cosmology" :expansion="expansion" :a="readings.a" :hubble="hubblePerGyr" :target="target" />
    </section>
    </details>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('meaningDisclosure', locale) }}</summary>
      <section aria-labelledby="meaning-title" class="card prose">
      <h2 id="meaning-title"><span class="step-no">4</span> {{ experimentSectionLabel('meaning', locale) }}</h2>
      <ConceptBridge experiment-id="evolving-space" :level="level" />
      <div class="meaning">
        <InfoCallout kind="physics" :title="experimentSectionLabel('establishedPhysics', locale)">
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
        <InfoCallout kind="interpretation" :title="experimentSectionLabel('interpretation', locale)">
          <ul>
            <li>
              <strong>{{ localizeExperimentText('Did time begin at the Big Bang?', locale) }}</strong> {{ localizeExperimentText('In classical general relativity the model has an edge at', locale) }} <MathFormula tex="a = 0" />{{ localizeExperimentText(', but the theory is not expected to hold there. Proposals include a quantum “no-boundary” beginning, a bounce from an earlier contracting phase, and eternal inflation. None is confirmed.', locale) }}
            </li>
            <li>
              <strong>{{ localizeExperimentText('Is time fundamental?', locale) }}</strong> {{ localizeExperimentText('In some approaches to quantum gravity the basic equation has no time in it, and time emerges from how parts of the universe change relative to each other, for example using the size of the universe itself as a clock. This bears directly on whether space and time are separate fundamental things.', locale) }}
            </li>
            <li>
              <strong>{{ localizeExperimentText('Is space really stretching?', locale) }}</strong> {{ localizeExperimentText('“Expanding space” is a natural description in these coordinates. Some physicists prefer to describe the same thing as galaxies moving apart. As in “Space and time versus spacetime”, the predictions are the same.', locale) }}
            </li>
          </ul>
        </InfoCallout>
      </div>
      <LocalizedExperimentGuide experiment-id="evolving-space" />
    </section>
    </details>

    <nav class="next card" :aria-label="experimentSectionLabel('nextSteps', locale)">
      <p><strong>{{ localizeExperimentText('See also:', locale) }}</strong> {{ localizeExperimentText('“Gravity and clock rates” for clocks in gravity, and “Space and time versus spacetime” for the 3 + 1 split.', locale) }}</p>
      <span class="nav-links">
        <RouterLink to="/gravity/clock-rates">{{ tx("Gravity and clock rates") }}</RouterLink>
        <RouterLink to="/relativity/two-perspectives">{{ tx("Space and time versus spacetime") }}</RouterLink>
        <RouterLink to="/">{{ tx("All modules") }}</RouterLink>
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
.hubble-card { margin-top: 16px; display: flex; flex-direction: column; gap: 10px; }
.hubble-card h3 { margin: 0; }
.hubble-plot { width: 100%; max-height: 340px; }
.hubble-grid line { stroke: var(--border); stroke-width: 1; }
.hubble-axis { stroke: var(--text-muted); stroke-width: 1.5; }
.hubble-tick { fill: var(--text-muted); font-size: 12px; }
.hubble-label { fill: var(--text); font-size: 13px; }
.hubble-point { fill: var(--accent); fill-opacity: 0.8; stroke: var(--bg); stroke-width: 1; }
.hubble-fit { stroke: var(--text); stroke-width: 2; }
.hubble-model { stroke: var(--text-muted); stroke-width: 2; stroke-dasharray: 6 5; }
.hubble-controls { display: flex; flex-wrap: wrap; gap: 8px; }
.hubble-readouts { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; }
.hubble-readouts div { flex-direction: column; justify-content: flex-start; gap: 2px; padding: 8px 10px; border-radius: 8px; background: var(--surface-2); }
.hubble-readouts dd { text-align: left; }
</style>
