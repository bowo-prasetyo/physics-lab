<script setup lang="ts">
import LocalizedExperimentGuide from '@/components/LocalizedExperimentGuide.vue'
import { getExperimentModuleEyebrow, experimentSectionLabel } from '@/i18n/experiment-metadata'
import ShareExperiment from '@/components/ShareExperiment.vue'
import ExperimentSupport from '@/components/ExperimentSupport.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ParameterSlider from '@/components/ParameterSlider.vue'
import PredictionCard from '@/components/PredictionCard.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import PendulumView from '@/components/PendulumView.vue'
import PhasePortrait from '@/components/PhasePortrait.vue'
import LineChart, { type LineSeries } from '@/components/LineChart.vue'
import PendulumMath from './PendulumMath.vue'
import { PREDICTIONS } from './predictions'
import { AMPLITUDE_RANGE, LENGTH_RANGE, MASS_RANGE, TIME_SCALES, isPlanetId, usePendulum } from './usePendulum'
import { PLANETS, secondsPendulumLength } from '@/physics'
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
const fmtGravity = (value: number) => formatNumber(value, { maximumFractionDigits: 2 })

// A setup can be shared as a link, e.g. #/time/pendulum?level=beginner&L=1&amp=10&m=1&planet=earth
if (isLevel(route.query.level)) level.value = route.query.level
const { length, amplitude, mass, planetId, planet, timeScale, running, state, samples, swings, lastPeriod, measurements, smallAngle, exact, clock, reset } =
  usePendulum({
    length: snapToRange(route.query.L, LENGTH_RANGE, 1),
    amplitude: snapToRange(route.query.amp, AMPLITUDE_RANGE, 10),
    mass: snapToRange(route.query.m, MASS_RANGE, 1),
    planet: isPlanetId(route.query.planet) ? route.query.planet : 'earth',
  })

useQuerySync({
  sources: [length, amplitude, mass, planetId, level],
  write: () => ({
    level: level.value,
    L: String(Number(length.value.toFixed(3))),
    amp: String(amplitude.value),
    m: String(mass.value),
    planet: planetId.value,
  }),
  read: (q) => {
    if (isLevel(q.level)) level.value = q.level
    length.value = snapToRange(q.L, LENGTH_RANGE, length.value)
    amplitude.value = snapToRange(q.amp, AMPLITUDE_RANGE, amplitude.value)
    mass.value = snapToRange(q.m, MASS_RANGE, mass.value)
    if (isPlanetId(q.planet)) planetId.value = q.planet
  },
})

const predictions = computed(() => localizePredictions('pendulum', PREDICTIONS, locale.value).filter((p) => atLeast(level.value, p.minLevel)))
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed(measurements.value)])))
const hints = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, localizeExperimentText(p.hint?.(measurements.value) ?? null, locale.value)])))

const intermediate = computed(() => atLeast(level.value, 'intermediate'))
const advanced = computed(() => atLeast(level.value, 'advanced'))

const secondsLength = computed(() => secondsPendulumLength(planet.value.g))
function useSecondsPendulum() {
  length.value = Number(secondsLength.value.toFixed(3))
}

const angleSeries = computed<LineSeries[]>(() => [
  { id: 'theta', label: 'Angle θ (degrees)', colour: 'var(--accent)', points: samples.value.map((s) => ({ x: s.t, y: (s.theta * 180) / Math.PI })) },
])
const graphTime = computed(() => Math.max(10, state.value.t))
const phasePoints = computed(() => samples.value.slice(-400))
const omegaMax = computed(() => Math.sqrt((2 * planet.value.g * (1 - Math.cos((amplitude.value * Math.PI) / 180))) / length.value))

const fmt = (x: number, digits = 4) => String(Number(x.toPrecision(digits)))
function formatDrift(secondsPerDay: number): string {
  const abs = Math.abs(secondsPerDay)
  const word = tx(secondsPerDay < 0 ? 'loses' : 'gains')
  if (abs < 0.05) return tx('keeps time')
  if (abs < 120) return `${word} ${fmt(abs, 3)} ${tx('s per day')}`
  if (abs < 7200) return `${word} ${fmt(abs / 60, 3)} ${tx('min per day')}`
  return `${word} ${fmt(abs / 3600, 3)} ${tx('hours per day')}`
}
function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds - m * 60
  return `${m}:${s.toFixed(1).padStart(4, '0')}`
}
</script>

<template>
  <article class="lesson container">
    <header class="lesson-head">
      <p class="eyebrow">{{ getExperimentModuleEyebrow('pendulum', locale) }}</p>
      <h1>{{ localizeExperimentText('Pendulum clocks', locale) ?? 'Pendulum clocks' }}</h1>
      <p class="lead">{{ localizeExperimentText('For three centuries the best clocks were pendulums. Find out what sets the beat of a pendulum, then take a pendulum clock to the Moon and compare it with an atomic clock. What is a clock really measuring?', locale) ?? 'For three centuries the best clocks were pendulums. Find out what sets the beat of a pendulum, then take a pendulum clock to the Moon and compare it with an atomic clock. What is a clock really measuring?' }}</p>
    </header>

    <ShareExperiment />

    <ExperimentSupport experiment-id="pendulum" :module-number="2" focus="A pendulum is a physical clock: its period depends on its length, local gravitational acceleration and (beyond the small-angle limit) amplitude." prompt="Would adding mass to the bob make an ideal pendulum swing faster?" action="Vary length, mass and release angle separately; compare the measured period with the small-angle prediction." reflect="When does the small-angle approximation become less accurate, and why might a clock need recalibration in a new environment?" />

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
          <PendulumView :theta="state.theta" :amplitude-deg="amplitude" :length="length" :mass="mass" />
          <LineChart :series="angleSeries" :x-max="graphTime" :x-label="tx('time (s)')" :y-label="tx('angle (degrees)')" :marker="null" />
          <PhasePortrait v-if="advanced" :points="phasePoints" :omega-max="omegaMax" />
        </div>

        <div class="lab-side card">
          <div class="clocks">
            <div class="clock-card atomic">
              <span class="clock-name">{{ tx('Atomic clock') }}</span>
              <span class="clock-value num">{{ formatClock(clock.atomic) }}</span>
            </div>
            <div class="clock-card pendulum">
              <span class="clock-name">{{ tx('Pendulum clock') }}</span>
              <span class="clock-value num">{{ formatClock(clock.pendulum) }}</span>
            </div>
          </div>
          <p class="drift" :class="{ off: Math.abs(clock.driftPerDay) >= 0.05 }">{{ tx('Pendulum clock') }} {{ formatDrift(clock.driftPerDay) }}</p>
          <p class="small muted">{{ tx('The pendulum clock was adjusted on the Earth, with small swings, for this length.') }}</p>

          <div class="buttons">
            <button class="btn btn-primary" type="button" @click="running = !running">{{ tx(running ? 'Pause' : state.t > 0 ? 'Resume' : 'Release') }}</button>
            <button class="btn" type="button" :disabled="state.t === 0" @click="reset">{{ localizeExperimentText('Reset', locale) ?? 'Reset' }}</button>
          </div>
          <div class="time-scale" role="group" :aria-label="localizeExperimentText('Playback speed', locale)">
            <span class="muted small">{{ tx('Playback') }}</span>
            <button v-for="s in TIME_SCALES" :key="s" type="button" class="chip" :class="{ active: timeScale === s }" @click="timeScale = s">
              {{ s === 1 ? tx('real time') : `×${s}` }}
            </button>
          </div>

          <div>
            <ParameterSlider v-model="length" :label="localizeExperimentText('Length', locale) ?? 'Length'" symbol="L" unit="m" v-bind="LENGTH_RANGE" :digits="2" :signed="false" />
            <button class="btn btn-small" type="button" @click="useSecondsPendulum">{{ tx('Seconds pendulum on') }} {{ tx(planet.name.split(" ")[0] ?? planet.name) }} ({{ fmt(secondsLength, 3) }} m)</button>
          </div>
          <ParameterSlider v-model="amplitude" :label="localizeExperimentText('Release angle', locale) ?? 'Release angle'" symbol="\theta_0" unit="°" v-bind="AMPLITUDE_RANGE" :digits="0" :signed="false" />
          <ParameterSlider v-model="mass" :label="localizeExperimentText('Bob mass', locale) ?? 'Bob mass'" symbol="m" unit="kg" v-bind="MASS_RANGE" :digits="1" :signed="false" />
          <label class="field">
            <span>{{ tx('World') }}</span>
            <select v-model="planetId">
              <option v-for="p in PLANETS" :key="p.id" :value="p.id">{{ tx(p.name) }} (g = {{ fmtGravity(p.g) }} m/s²)</option>
            </select>
          </label>

          <dl class="readouts">
            <div><dt>{{ tx('Time') }}</dt><dd class="num">{{ fmt(state.t, 4) }} s</dd></div>
            <div><dt>{{ tx('Complete swings counted') }}</dt><dd class="num">{{ swings }}</dd></div>
            <div class="measured"><dt>{{ tx('Measured period') }}</dt><dd class="num">{{ lastPeriod === null ? tx('swing to measure') : `${fmt(lastPeriod)} s` }}</dd></div>
            <div v-if="intermediate"><dt>{{ tx('Small-swing formula 2π√(L/g)') }}</dt><dd class="num">{{ fmt(smallAngle) }} s</dd></div>
            <div v-if="advanced"><dt>{{ tx('Exact period for this swing') }}</dt><dd class="num">{{ fmt(exact) }} s</dd></div>
          </dl>
          <p class="small muted">{{ tx('Changing a setting releases the pendulum again from rest. Measurements you made are kept for the questions.') }}</p>
        </div>
      </div>
    </section>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('mathematicsDisclosure', locale) }}</summary>
      <section aria-labelledby="maths-title" class="card prose">
      <h2 id="maths-title"><span class="step-no">3</span> {{ experimentSectionLabel('mathematics', locale) }}</h2>
      <PendulumMath :level="level" :length="length" :g="planet.g" :amplitude-deg="amplitude" :small-angle="smallAngle" :exact="exact" />
    </section>
    </details>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('meaningDisclosure', locale) }}</summary>
      <section aria-labelledby="meaning-title" class="card prose">
      <h2 id="meaning-title"><span class="step-no">4</span> {{ experimentSectionLabel('meaning', locale) }}</h2>
      <div class="meaning">
        <InfoCallout kind="physics" :title="experimentSectionLabel('establishedPhysics', locale)">
          <ul>
            <li>
              {{ localizeExperimentText('Galileo noticed that a pendulum keeps a nearly steady beat, and Christiaan Huygens built the first pendulum clock in 1656. Pendulum clocks were the most accurate timekeepers until quartz clocks in the 1930s.', locale) }}
            </li>
            <li>
              {{ localizeExperimentText('A pendulum’s period depends on its length and on gravity, not on its mass. In 1672 Jean Richer found his pendulum clock ran slow near the equator, showing that gravity varies over the Earth.', locale) }}
            </li>
            <li>{{ localizeExperimentText('Since 1967 the second has been defined by caesium atoms: 9 192 631 770 oscillations. Today’s best clocks would lose less than a second over the age of the universe.', locale) }}</li>
          </ul>
        </InfoCallout>
        <InfoCallout kind="interpretation" :title="experimentSectionLabel('interpretation', locale)">
          <ul>
            <li>
              <strong>{{ localizeExperimentText('If every clock is a physical process, what is time?', locale) }}</strong> {{ localizeExperimentText('Aristotle called time “the number of motion”: nothing more than change, counted. Newton held that time flows on its own, whether or not anything changes. Physics uses clocks either way; the question is what they are measuring.', locale) }}
            </li>
            <li>
              <strong>{{ localizeExperimentText('Why do good clocks agree?', locale) }}</strong> {{ localizeExperimentText('Atoms, crystals and planets, built on completely different physics, keep step with each other when they are together. Some see that agreement as evidence of a single underlying time; others see time as nothing but that web of agreements. Relativity adds that clocks in different places or states of motion need not agree at all (Experiments B and C).', locale) }}
            </li>
          </ul>
        </InfoCallout>
      </div>
      <LocalizedExperimentGuide experiment-id="pendulum" />
    </section>
    </details>

    <nav class="next card" :aria-label="experimentSectionLabel('nextSteps', locale)">
      <p>{{ localizeExperimentText('Next: Experiment B, where clocks that move disagree, and Experiment C, where gravity changes how fast time passes.', locale) }}</p>
      <span class="nav-links">
        <RouterLink to="/relativity/moving-clocks">{{ tx('Experiment B') }}</RouterLink>
        <RouterLink to="/gravity/clock-rates">{{ tx('Experiment C') }}</RouterLink>
        <RouterLink to="/">{{ tx('All modules') }}</RouterLink>
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

.small {
  font-size: 0.85rem;
  margin: 0;
}

.clocks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.clock-card {
  display: grid;
  text-align: center;
  padding: 10px 6px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border-top: 4px solid var(--border);
}

.clock-card.atomic {
  border-top-color: var(--success);
}

.clock-card.pendulum {
  border-top-color: var(--accent);
}

.clock-name {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.clock-value {
  font-size: 1.8rem;
  font-weight: 700;
}

.drift {
  margin: -4px 0 0;
  text-align: center;
  font-weight: 700;
  color: var(--success);
}

.drift.off {
  color: var(--warn);
}

.buttons {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.time-scale {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.chip {
  padding: 2px 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  font-size: 0.8rem;
  cursor: pointer;
}

.chip.active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 700;
}

.btn-small {
  min-height: 32px;
  padding: 0 10px;
  font-size: 0.85rem;
  margin-top: 6px;
}

.field {
  display: grid;
  gap: 4px;
  font-weight: 600;
}

select {
  font: inherit;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
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
  white-space: nowrap;
}

.measured dt,
.measured dd {
  color: var(--accent);
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
