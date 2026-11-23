<script setup lang="ts">
import LocalizedExperimentGuide from '@/components/LocalizedExperimentGuide.vue'
import { getExperimentModuleEyebrow, experimentSectionLabel } from '@/i18n/experiment-metadata'
import ShareExperiment from '@/components/ShareExperiment.vue'
import ExperimentSupport from '@/components/ExperimentSupport.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PredictionCard from '@/components/PredictionCard.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import ClockRateChart from '@/components/ClockRateChart.vue'
import GravityClocksMath from './GravityClocksMath.vue'
import { PREDICTIONS } from './predictions'
import {
  RUN_DAYS,
  SLIDER_STEPS,
  altitudeFromSlider,
  altitudeRange,
  bodyById,
  clampAltitude,
  isBodyId,
  presets,
  sliderFromAltitude,
  useGravityClocks,
  type Mode,
} from './useGravityClocks'
import { formatAltitude, formatDuration, formatLength, formatNumber, formatSlowdown } from './format'
import { BODIES, SECONDS_PER_DAY } from '@/physics'
import { useQuerySync } from '@/composables/useQuerySync'
import { useLevel } from '@/composables/useLevel'
import { atLeast, isLevel } from '@/levels'
import { useLocale } from '@/composables/useLocale'
import { localizeExperimentText } from '@/i18n/experiment-ui'
import { localizePredictions } from '@/i18n/experiment-content'
import { localizeGravityClocksViewText } from '@/i18n/gravity-clocks-view'

const route = useRoute()
const level = useLevel()
const { locale } = useLocale()
const tx = (value: string) => localizeGravityClocksViewText(value, locale.value)

const isMode = (value: unknown): value is Mode => value === 'clocks' || value === 'gps'
const num = (value: unknown) => (typeof value === 'string' && value.trim() !== '' ? Number(value) : undefined)

// A setup can be shared as a link, e.g. #/gravity/clock-rates?level=beginner&body=earth&a=0&b=8848
if (isLevel(route.query.level)) level.value = route.query.level
const initialBody = isBodyId(route.query.body) ? route.query.body : 'earth'
const experiment = useGravityClocks({
  mode: isMode(route.query.mode) ? route.query.mode : 'clocks',
  body: initialBody,
  altitudeA: num(route.query.a),
  altitudeB: num(route.query.b),
  correction: route.query.fix !== '0',
})
const { mode, bodyId, body, altitudeA, altitudeB, correction, status, t, deficitA, deficitB, rateBvsA, elapsed, signals, radialDistance, gps, gpsSpeed, gpsState, allRuns, start, pause, reset } =
  experiment

const short = (h: number) => String(Number(h.toPrecision(6)))
useQuerySync({
  sources: [mode, bodyId, altitudeA, altitudeB, correction, level],
  write: () => {
    const query: Record<string, string> = { level: level.value, mode: mode.value }
    if (mode.value === 'clocks') Object.assign(query, { body: bodyId.value, a: short(altitudeA.value), b: short(altitudeB.value) })
    else query.fix = correction.value ? '1' : '0'
    return query
  },
  read: (query) => {
    if (isLevel(query.level)) level.value = query.level
    if (isMode(query.mode)) mode.value = query.mode
    if (isBodyId(query.body) && query.body !== bodyId.value) bodyId.value = query.body
    const b = bodyById(bodyId.value)
    const a = num(query.a)
    const bb = num(query.b)
    if (a !== undefined) altitudeA.value = clampAltitude(b, a)
    if (bb !== undefined) altitudeB.value = clampAltitude(b, bb)
    if (query.fix === '0' || query.fix === '1') correction.value = query.fix === '1'
  },
})

const predictions = computed(() => localizePredictions('gravity-clocks', PREDICTIONS, locale.value).filter((p) => atLeast(level.value, p.minLevel)))
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed(allRuns.value)])))
const hints = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, localizeExperimentText(p.hint?.(allRuns.value) ?? null, locale.value)])))

const intermediate = computed(() => atLeast(level.value, 'intermediate'))
const advanced = computed(() => atLeast(level.value, 'advanced'))
const locked = computed(() => status.value === 'running')

const sliderA = computed({
  get: () => sliderFromAltitude(body.value, altitudeA.value),
  set: (p: number) => (altitudeA.value = altitudeFromSlider(body.value, p)),
})
const sliderB = computed({
  get: () => sliderFromAltitude(body.value, altitudeB.value),
  set: (p: number) => (altitudeB.value = altitudeFromSlider(body.value, p)),
})
const bodyPresets = computed(() => presets(body.value))
const range = computed(() => altitudeRange(body.value))

const days = computed(() => t.value)
const daysText = computed(() => `${days.value.toFixed(1)} ${locale.value === 'id' ? 'hari' : locale.value === 'ja' ? '日' : 'days'}`)
const bFaster = computed(() => rateBvsA.value >= 0)

const primaryLabel = computed(() => {
  switch (status.value) {
    case 'running':
      return tx('Pause')
    case 'paused':
      return tx('Resume')
    case 'finished':
      return tx('Run again')
    default:
      return tx('Run the clocks')
  }
})

function primaryAction() {
  if (status.value === 'running') pause()
  else if (status.value === 'finished') {
    reset()
    start()
  } else start()
}

const gpsBars = computed(() => {
  const items = [
    { id: 'gravity', label: tx('Higher up, weaker gravity'), value: gps.gravity },
    { id: 'velocity', label: tx('Orbital speed (Experiment B)'), value: gps.velocity },
    { id: 'net', label: tx('Net effect'), value: gps.net },
  ]
  const max = Math.max(...items.map((i) => Math.abs(i.value)))
  return items.map((i) => ({ ...i, width: (100 * Math.abs(i.value)) / max, perDay: i.value * SECONDS_PER_DAY }))
})

const signed = (seconds: number) => `${seconds >= 0 ? '+' : '−'}${formatDuration(Math.abs(seconds))}`
</script>

<template>
  <article class="lesson container">
    <header class="lesson-head">
      <p class="eyebrow">{{ tx('Module 5 · General relativity · Experiment C') }}</p>
      <h1>{{ tx('Gravity and clock rates') }}</h1>
      <p class="lead">
        {{ tx('Two identical clocks at different heights above a mass. Does gravity change how fast they tick, and what does that mean for the GPS in your phone?') }}
      </p>
    </header>

    <ShareExperiment />

    <LocalizedExperimentGuide experiment-id="gravity-clocks" />

    <ExperimentSupport experiment-id="gravity-clock-rates" :module-number="5"  :focus="tx('Compare clock rates in the stated static Schwarzschild setting; keep the model assumptions visible.')" :prompt="tx('Which clock should accumulate more time when two stationary clocks are held at different heights?')" :action="tx('Change the two clock heights, compare the predicted rates, then inspect the separate gravitational and kinematic GPS corrections.')" :reflect="tx('What is held fixed in this comparison, and why is the GPS correction not purely gravitational?')" />

    <section aria-labelledby="predict-title">
      <h2 id="predict-title"><span class="step-no">1</span> {{ experimentSectionLabel('predict', locale) }}</h2>
      <p class="muted">{{ tx('Commit to an answer first. Each explanation unlocks only after you have tested it in the experiment below.') }}</p>
      <div class="prediction-grid">
        <PredictionCard v-for="(p, i) in predictions" :key="p.id" :prediction="p" :observed="observed[p.id] ?? false" :hint="hints[p.id]" :index="i + 1" />
      </div>
    </section>

    <section aria-labelledby="experiment-title">
      <h2 id="experiment-title"><span class="step-no">2</span> {{ experimentSectionLabel('experiment', locale) }}</h2>
      <fieldset class="tabs" :disabled="locked">
        <legend>{{ localizeExperimentText('Setup', locale) ?? 'Setup' }}</legend>
        <label :class="{ active: mode === 'clocks' }"><input v-model="mode" type="radio" value="clocks" class="sr-only" /> {{ tx('Two clocks') }}</label>
        <label :class="{ active: mode === 'gps' }"><input v-model="mode" type="radio" value="gps" class="sr-only" /> {{ tx('GPS satellite') }}</label>
      </fieldset>

      <!-- Two static clocks -->
      <div v-if="mode === 'clocks'" class="lab">
        <div class="lab-main card">
          <label class="body-select">
            <span>{{ tx('Central mass') }}</span>
            <select v-model="bodyId" :disabled="locked">
              <option v-for="b in BODIES" :key="b.id" :value="b.id">{{ tx(b.name) }}</option>
            </select>
          </label>
          <h3 class="chart-title">{{ tx('How much each clock is slowed, compared with a clock far away') }}</h3>
          <ClockRateChart :body="body" :range="range" :altitude-a="altitudeA" :altitude-b="altitudeB" />
          <p class="muted small">
            {{ tx('The curve has the shape of the gravity “well”: deeper means slower. Clocks are held at rest at these heights (a real satellite would be moving; see the GPS setup).') }}
          </p>
        </div>

        <div class="lab-side card">
          <div class="clocks">
            <div class="clock-card far"><span class="clock-name">{{ tx('Far away') }}</span><span class="clock-value num">{{ daysText }}</span></div>
            <div class="clock-card a"><span class="clock-name">{{ tx('Clock A') }}</span><span class="clock-value num">{{ (elapsed.a / SECONDS_PER_DAY).toFixed(1) }} {{ tx('days') }}</span></div>
            <div class="clock-card b"><span class="clock-name">{{ tx('Clock B') }}</span><span class="clock-value num">{{ (elapsed.b / SECONDS_PER_DAY).toFixed(1) }} {{ tx('days') }}</span></div>
          </div>
          <p class="ahead" :class="bFaster ? 'b-ahead' : 'a-ahead'">
            {{ tx('Clock {clock} is ahead by').replace('{clock}', bFaster ? 'B' : 'A') }} <strong class="num">{{ formatDuration(Math.abs(elapsed.bAhead)) }}</strong>
          </p>
          <p class="status muted">{{ tx('Time-lapse: 1 day per second, up to') }} {{ RUN_DAYS }} {{ tx('days') }}</p>
          <div class="buttons">
            <button class="btn btn-primary" type="button" @click="primaryAction">{{ primaryLabel }}</button>
            <button class="btn" type="button" :disabled="status === 'ready'" @click="reset">{{ localizeExperimentText('Reset', locale) ?? 'Reset' }}</button>
          </div>

          <div v-for="clock in (['A', 'B'] as const)" :key="clock" class="height" :class="clock === 'A' ? 'a' : 'b'">
            <div class="height-head">
              <label :for="`height-${clock}`">{{ tx('Clock {clock} height').replace('{clock}', clock) }}</label>
              <output class="num">{{ formatAltitude(clock === 'A' ? altitudeA : altitudeB, body, locale) }}</output>
            </div>
            <input
              v-if="clock === 'A'"
              id="height-A"
              v-model.number="sliderA"
              type="range"
              min="0"
              :max="SLIDER_STEPS"
              step="1"
              :disabled="locked"
            />
            <input v-else id="height-B" v-model.number="sliderB" type="range" min="0" :max="SLIDER_STEPS" step="1" :disabled="locked" />
            <div class="presets">
              <button
                v-for="p in bodyPresets"
                :key="p.label"
                type="button"
                class="chip"
                :disabled="locked"
                @click="clock === 'A' ? (altitudeA = p.altitude) : (altitudeB = p.altitude)"
              >
                {{ tx(p.label) }}
              </button>
            </div>
          </div>

          <dl class="readouts">
            <div><dt>{{ tx('Clock A slowed by') }}</dt><dd class="num">{{ formatSlowdown(deficitA) }}</dd></div>
            <div><dt>{{ tx('Clock B slowed by') }}</dt><dd class="num">{{ formatSlowdown(deficitB) }}</dd></div>
            <div>
              <dt>{{ tx('B gains on A, per day on clock A') }}</dt>
              <dd class="num">{{ signed(rateBvsA * SECONDS_PER_DAY) }}</dd>
            </div>
            <template v-if="advanced">
              <div class="signal"><dt>{{ tx('Ticks from A, received at B') }}</dt><dd class="num">{{ signals.upward >= 0 ? '+' : '' }}{{ formatNumber(signals.upward) }}</dd></div>
              <div class="signal"><dt>{{ tx('Ticks from B, received at A') }}</dt><dd class="num">{{ signals.downward >= 0 ? '+' : '' }}{{ formatNumber(signals.downward) }}</dd></div>
              <div><dt>{{ tx('Ruler distance A to B') }}</dt><dd class="num">{{ formatLength(radialDistance.proper) }}</dd></div>
            </template>
          </dl>
          <p v-if="advanced" class="small muted">
            {{ tx('“Received” rates are relative to the receiver’s own clock: negative means the ticks arrive slowed (redshift), positive sped up (blueshift).') }}
          </p>
        </div>
      </div>

      <!-- GPS -->
      <div v-else class="lab">
        <div class="lab-main card">
          <h3 class="chart-title">{{ tx('A GPS satellite clock compared with a ground clock') }}</h3>
          <p class="muted small">
            {{ tx('Orbit about 20 200 km above the surface, at') }} {{ (gpsSpeed / 1000).toFixed(2) }} km/s.
          </p>
          <div class="bars" role="list">
            <div v-for="bar in gpsBars" :key="bar.id" class="bar-row" role="listitem">
              <span class="bar-label">{{ bar.label }}</span>
              <span class="bar-track">
                <span class="bar" :class="[bar.id, bar.value >= 0 ? 'pos' : 'neg']" :style="{ width: `${bar.width}%` }" />
              </span>
              <span class="bar-value num">{{ signed(bar.perDay) }} {{ tx('per day') }}</span>
            </div>
          </div>
          <InfoCallout v-if="intermediate" kind="note" :title="tx('How GPS deals with it')">
            <p>
              {{ tx('Before launch, each satellite clock is set to tick at 10.22999999543 MHz instead of 10.23 MHz, so that in orbit it runs at the right rate as seen from the ground. Switch the correction off to see what would happen without it.') }}
            </p>
          </InfoCallout>
        </div>

        <div class="lab-side card">
          <div class="clocks two">
            <div class="clock-card far"><span class="clock-name">{{ tx('Ground clock') }}</span><span class="clock-value num">{{ daysText }}</span></div>
            <div class="clock-card b">
              <span class="clock-name">{{ tx('Satellite gained') }}</span><span class="clock-value num">{{ formatDuration(gpsState.offset) }}</span>
            </div>
          </div>
          <div class="buttons">
            <button class="btn btn-primary" type="button" @click="primaryAction">{{ primaryLabel }}</button>
            <button class="btn" type="button" :disabled="status === 'ready'" @click="reset">{{ localizeExperimentText('Reset', locale) ?? 'Reset' }}</button>
          </div>
          <label class="toggle">
            <input v-model="correction" type="checkbox" :disabled="locked" />
            {{ tx('Relativity correction') }} {{ tx(correction ? 'on' : 'off') }}
          </label>
          <div class="error" :class="{ bad: !correction }">
            <span class="clock-name">{{ tx('Position error') }}</span>
            <span class="clock-value num">{{ correction ? '0 m' : formatLength(gpsState.positionError) }}</span>
            <span class="small">{{ correction ? tx('The correction keeps the satellite clock in step.') : tx('Growing by about 11.5 km every day.') }}</span>
          </div>
        </div>
      </div>
    </section>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('mathematicsDisclosure', locale) }}</summary>
      <section aria-labelledby="maths-title" class="card prose">
      <h2 id="maths-title"><span class="step-no">3</span> {{ experimentSectionLabel('mathematics', locale) }}</h2>
      <GravityClocksMath
        :level="level"
        :body="body"
        :altitude-a="altitudeA"
        :altitude-b="altitudeB"
        :deficit-a="deficitA"
        :deficit-b="deficitB"
        :rate-bvs-a="rateBvsA"
        :gps="gps"
        :radial-distance="radialDistance"
      />
    </section>
    </details>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('meaningDisclosure', locale) }}</summary>
      <section aria-labelledby="meaning-title" class="card prose">
      <h2 id="meaning-title"><span class="step-no">4</span> {{ experimentSectionLabel('meaning', locale) }}</h2>
      <div class="meaning">
        <InfoCallout kind="physics" :title="tx('Established physics')">
          <ul>
            <li>{{ tx('Clocks lower in a gravitational field run slower, and observers at both heights agree which clock is slow.') }}</li>
            <li>
              {{ tx('Measured again and again: gamma rays up a 22.5 m tower (Pound and Rebka, 1959), a hydrogen-maser clock launched on a rocket (Gravity Probe A, 1976, agreeing to about 7 parts in 100 000), and optical clocks that detect a height change of about 33 cm (2010). GPS corrects for it every day.') }}
            </li>
            <li>
              {{ tx('A clock falling into a black hole ticks normally by its own measure and crosses the horizon after a finite time on its own dial.') }}
            </li>
          </ul>
        </InfoCallout>
        <InfoCallout kind="interpretation" :title="tx('Interpretation: open to debate')">
          <ul>
            <li>
              <strong>{{ tx('Does gravity slow time itself, or only clocks?') }}</strong> {{ tx('Every clock and every process slows by the same factor, so no measurement can separate the two. Whether that means “time itself” runs slower depends on what you think time is: something that exists on its own, or a measure of how physical processes relate.') }}
            </li>
            <li>
              <strong>{{ tx('Is gravity a force or geometry?') }}</strong> {{ tx('General relativity describes it as the curvature of spacetime, and the lapse in the 3 + 1 split is exactly the clock rate you measured. Other formulations, such as the teleparallel equivalent of general relativity, describe gravity differently but make the same predictions. As in Experiment E, equal predictions leave the interpretation open.') }}
            </li>
          </ul>
        </InfoCallout>
      </div>
    </section>
    </details>

    <nav class="next card" :aria-label="experimentSectionLabel('nextSteps', locale)">
      <p><strong>{{ tx('Next:') }}</strong> {{ tx('Experiment D, where space itself evolves in time. See also Experiments B and E.') }}</p>
      <span class="nav-links">
        <RouterLink to="/cosmology/evolving-space">{{ tx('Experiment D →') }}</RouterLink>
        <RouterLink to="/relativity/moving-clocks">{{ tx('Experiment B') }}</RouterLink>
        <RouterLink to="/relativity/two-perspectives">{{ tx('Experiment E') }}</RouterLink>
        <RouterLink to="/">{{ tx('All modules') }}</RouterLink>
      </span>
    </nav>
  </article>
</template>

<style scoped>
.tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 0 0 12px;
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

.tabs:disabled label {
  opacity: 0.55;
  cursor: not-allowed;
}

.tabs label:has(input:focus-visible) {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

.lab {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
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

.body-select {
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
}

.chart-title {
  margin: 4px 0 0;
  font-size: 1rem;
}

.small {
  font-size: 0.85rem;
}

.clocks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.clocks.two {
  grid-template-columns: 1fr 1fr;
}

.clock-card {
  display: grid;
  text-align: center;
  padding: 8px 4px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border-top: 4px solid var(--border);
}

.clock-card.a {
  border-top-color: var(--observer);
}

.clock-card.b {
  border-top-color: var(--success);
}

.clock-name {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.clock-value {
  font-size: 1.05rem;
  font-weight: 700;
}

.ahead {
  margin: 0;
  text-align: center;
}

.status {
  margin: -8px 0 0;
  text-align: center;
  font-size: 0.82rem;
}

.buttons {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.height {
  border-left: 4px solid var(--border);
  padding-left: 10px;
}

.height.a {
  border-left-color: var(--observer);
}

.height.b {
  border-left-color: var(--success);
}

.height-head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-weight: 600;
}

.height-head output {
  text-align: right;
  font-size: 0.85rem;
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

.chip:hover:not(:disabled) {
  background: var(--surface-2);
}

.chip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
}

.signal dt,
.signal dd {
  color: var(--observer);
}

.bars {
  display: grid;
  gap: 10px;
  margin: 6px 0;
}

.bar-row {
  display: grid;
  grid-template-columns: minmax(120px, 200px) 1fr auto;
  align-items: center;
  gap: 10px;
}

.bar-track {
  height: 18px;
  border-radius: 4px;
  background: var(--surface-2);
  overflow: hidden;
}

.bar {
  display: block;
  height: 100%;
  border-radius: 4px;
}

.bar.pos {
  background: var(--success);
}

.bar.neg {
  background: var(--observer);
}

.bar.net {
  background: var(--accent);
}

.bar-value {
  font-weight: 700;
  white-space: nowrap;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.toggle input {
  width: 18px;
  height: 18px;
  accent-color: var(--accent);
}

.error {
  display: grid;
  text-align: center;
  gap: 2px;
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--success-soft);
  color: var(--success);
}

.error.bad {
  background: var(--warn-soft);
  color: var(--warn);
}

.error .clock-value {
  font-size: 1.6rem;
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

  .bar-row {
    grid-template-columns: 1fr auto;
  }

  .bar-track {
    grid-column: 1 / -1;
    grid-row: 2;
  }
}
</style>
