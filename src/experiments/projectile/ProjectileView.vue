<script setup lang="ts">
import LocalizedExperimentGuide from '@/components/LocalizedExperimentGuide.vue'
import { getExperimentModuleEyebrow, experimentSectionLabel } from '@/i18n/experiment-metadata'
import ShareExperiment from '@/components/ShareExperiment.vue'
import ExperimentSupport from '@/components/ExperimentSupport.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MathFormula from '@/components/MathFormula.vue'
import ParameterSlider from '@/components/ParameterSlider.vue'
import PredictionCard from '@/components/PredictionCard.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import TrajectoryView from '@/components/TrajectoryView.vue'
import LineChart, { type LineSeries } from '@/components/LineChart.vue'
import ProjectileMath from './ProjectileMath.vue'
import { PREDICTIONS } from './predictions'
import { ANGLE_RANGE, HEIGHT_RANGE, SPEED_RANGE, TIME_SCALES, TRAIN_RANGE, isPlanetId, useProjectile } from './useProjectile'
import { PLANETS, optimalAngle, specificEnergy, type ProjectileState } from '@/physics'
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

// A setup can be shared as a link, e.g. #/mechanics/projectile?level=beginner&v=20&angle=45&h=0&planet=earth&air=0
if (isLevel(route.query.level)) level.value = route.query.level
const {
  speed,
  angle,
  height,
  planetId,
  planet,
  drag,
  dragApplies,
  frame,
  trainSpeed,
  companion,
  timeScale,
  params,
  status,
  t,
  current,
  dropped,
  history,
  throws,
  ball,
  launch,
  clearHistory,
} = useProjectile({
  speed: snapToRange(route.query.v, SPEED_RANGE, 20),
  angle: snapToRange(route.query.angle, ANGLE_RANGE, 45),
  height: snapToRange(route.query.h, HEIGHT_RANGE, 0),
  planet: isPlanetId(route.query.planet) ? route.query.planet : 'earth',
  drag: route.query.air === '1',
})

useQuerySync({
  sources: [speed, angle, height, planetId, drag, level],
  write: () => ({
    level: level.value,
    v: String(speed.value),
    angle: String(angle.value),
    h: String(height.value),
    planet: planetId.value,
    air: drag.value ? '1' : '0',
  }),
  read: (q) => {
    if (isLevel(q.level)) level.value = q.level
    speed.value = snapToRange(q.v, SPEED_RANGE, speed.value)
    angle.value = snapToRange(q.angle, ANGLE_RANGE, angle.value)
    height.value = snapToRange(q.h, HEIGHT_RANGE, height.value)
    if (isPlanetId(q.planet)) planetId.value = q.planet
    if (q.air === '0' || q.air === '1') drag.value = q.air === '1'
  },
})

const predictions = computed(() => localizePredictions('projectile', PREDICTIONS, locale.value).filter((p) => atLeast(level.value, p.minLevel)))
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed(throws.value)])))
const hints = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, localizeExperimentText(p.hint?.(throws.value) ?? null, locale.value)])))

const intermediate = computed(() => atLeast(level.value, 'intermediate'))
const advanced = computed(() => atLeast(level.value, 'advanced'))
const flying = computed(() => status.value === 'flying')

const frameVelocity = computed(() => (frame.value === 'train' ? trainSpeed.value : 0))
const horizontalSpeed = computed(() => speed.value * Math.cos((angle.value * Math.PI) / 180))
function matchBall() {
  trainSpeed.value = Math.round(horizontalSpeed.value * 100) / 100
}

const states = computed(() => current.value?.states ?? null)
const upTo = (list: readonly ProjectileState[]) => list.filter((s) => s.t <= t.value)
const end = computed(() => states.value?.at(-1) ?? null)
const maxHeight = computed(() => (states.value ? Math.max(...states.value.map((s) => s.y)) : null))
const graphTime = computed(() => Math.max(end.value?.t ?? 1, dropped.value?.at(-1)?.t ?? 0))

const heightSeries = computed<LineSeries[]>(() => {
  const list: LineSeries[] = []
  if (states.value) list.push({ id: 'y', label: tx('Thrown ball'), colour: 'var(--accent)', points: upTo(states.value).map((s) => ({ x: s.t, y: s.y })) })
  if (dropped.value) list.push({ id: 'drop', label: 'Dropped ball', colour: 'var(--observer)', points: upTo(dropped.value).map((s) => ({ x: s.t, y: s.y })) })
  return list
})
const velocitySeries = computed<LineSeries[]>(() => {
  if (!states.value) return []
  const pts = upTo(states.value)
  return [
    { id: 'vx', label: tx(frame.value === 'train' ? 'Sideways speed v′ₓ (seen from the train)' : 'Sideways speed vₓ'), colour: 'var(--success)', points: pts.map((s) => ({ x: s.t, y: s.vx - frameVelocity.value })) },
    { id: 'vy', label: tx('Vertical speed v_y'), colour: 'var(--warn)', points: pts.map((s) => ({ x: s.t, y: s.vy })) },
  ]
})

const energy = computed(() => {
  if (!ball.value || !states.value) return null
  const e0 = specificEnergy(states.value[0] as ProjectileState, params.value.g)
  const e = specificEnergy(ball.value, params.value.g)
  return { e, lost: e0 - e }
})
const bestAngle = computed(() => (advanced.value ? optimalAngle({ speed: speed.value, height: height.value, g: params.value.g, k: params.value.k }, 0.01) : null))

const fmt = (x: number, digits = 3) => {
  const v = Number(x.toPrecision(digits))
  return (v < 0 ? '−' : '') + Math.abs(v).toLocaleString('en-US', { maximumSignificantDigits: digits })
}
const dropDifference = computed(() => {
  if (!end.value || !dropped.value || status.value !== 'landed') return null
  const d = end.value.t - (dropped.value.at(-1) as ProjectileState).t
  return Math.abs(d) < 1e-6 ? 'Both balls landed at the same moment.' : `The thrown ball landed ${fmt(Math.abs(d))} s ${d > 0 ? 'later' : 'earlier'}.`
})
</script>

<template>
  <article class="lesson container">
    <header class="lesson-head">
      <p class="eyebrow">{{ getExperimentModuleEyebrow('projectile', locale) }}</p>
      <h1>{{ localizeExperimentText('Projectile launcher', locale) ?? 'Projectile launcher' }}</h1>
      <p class="lead">{{ localizeExperimentText('Launch a ball at any speed and angle, from the ground or a tower, on the Earth, the Moon, Mars or Jupiter, with or without air. Watch it from the ground, or from a moving train.', locale) ?? 'Launch a ball at any speed and angle, from the ground or a tower, on the Earth, the Moon, Mars or Jupiter, with or without air. Watch it from the ground, or from a moving train.' }}</p>
    </header>

    <ShareExperiment />

    <ExperimentSupport experiment-id="projectile" :module-number="3" focus="In the ideal no-drag model, horizontal and vertical motion have different roles: gravity changes vertical velocity." prompt="If a ball is launched horizontally, does it begin falling immediately or only after its forward motion slows?" action="Compare launch angles and gravitational environments; then switch air resistance on and compare the trajectory." reflect="Which results rely on the no-drag approximation, and why can horizontal velocity coexist with downward acceleration?" />

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
          <TrajectoryView
            :flight="states"
            :dropped="dropped"
            :history="frame === 'ground' ? history.map((h) => h.states) : []"
            :t="t"
            :speed="speed"
            :angle="angle"
            :height="height"
            :frame-velocity="frameVelocity"
            :show-vectors="intermediate"
          />
          <p class="muted small">
            {{ tx('Drawn to scale: one metre across equals one metre up. Dashed lines are earlier throws.') }}
            <template v-if="intermediate"> {{ tx('Arrows show the sideways (green) and vertical (yellow) velocity.') }}</template>
          </p>
          <p v-if="dropDifference" class="drop-result">{{ dropDifference }}</p>
          <div class="charts">
            <LineChart :series="heightSeries" :x-max="graphTime" :x-label="tx('time (s)')" :y-label="tx('height (m)')" :marker="states ? t : null" />
            <LineChart :series="velocitySeries" :x-max="graphTime" :x-label="tx('time (s)')" :y-label="tx('velocity (m/s)')" :marker="states ? t : null" />
          </div>
        </div>

        <div class="lab-side card">
          <button class="btn btn-primary launch" type="button" :disabled="flying" @click="launch">{{ flying ? tx('In flight…') : tx('Launch') }}</button>
          <div class="time-scale" role="group" :aria-label="localizeExperimentText('Playback speed', locale)">
            <span class="muted small">{{ tx("Playback") }}</span>
            <button v-for="s in TIME_SCALES" :key="s" type="button" class="chip" :class="{ active: timeScale === s }" @click="timeScale = s">
              {{ s === 1 ? tx('real time') : `×${s}` }}
            </button>
          </div>

          <ParameterSlider v-model="speed" :label="localizeExperimentText('Launch speed', locale) ?? 'Launch speed'" symbol="v_0" unit="m/s" v-bind="SPEED_RANGE" :digits="0" :signed="false" :disabled="flying" />
          <ParameterSlider v-model="angle" :label="localizeExperimentText('Launch angle', locale) ?? 'Launch angle'" symbol="\theta" unit="°" v-bind="ANGLE_RANGE" :digits="0" :signed="false" :disabled="flying" />
          <ParameterSlider v-model="height" :label="localizeExperimentText('Launch height', locale) ?? 'Launch height'" symbol="h" unit="m" v-bind="HEIGHT_RANGE" :digits="0" :signed="false" :disabled="flying" />

          <label class="field">
            <span>{{ tx("World") }}</span>
            <select v-model="planetId" :disabled="flying">
              <option v-for="p in PLANETS" :key="p.id" :value="p.id">{{ tx(p.name) }} (g = {{ fmtGravity(p.g) }} m/s²)</option>
            </select>
          </label>
          <label class="toggle">
            <input v-model="drag" type="checkbox" :disabled="flying" />
            {{ tx('Air resistance (a baseball)') }}
          </label>
          <p v-if="drag && planet.airDensity === 0" class="small muted">{{ tx('The Moon has no air, so there is no air resistance there.') }}</p>
          <label class="toggle">
            <input v-model="companion" type="checkbox" :disabled="flying" />
            {{ tx('Also drop a ball from the same height at the same moment') }}
          </label>

          <fieldset class="frame" :disabled="flying">
            <legend>{{ localizeExperimentText('Seen from', locale) ?? 'Seen from' }}</legend>
            <label><input v-model="frame" type="radio" value="ground" /> {{ tx('the ground') }}</label>
            <label><input v-model="frame" type="radio" value="train" /> {{ tx('a moving train') }}</label>
          </fieldset>
          <template v-if="frame === 'train'">
            <ParameterSlider v-model="trainSpeed" :label="localizeExperimentText('Train speed', locale) ?? 'Train speed'" symbol="u" unit="m/s" v-bind="TRAIN_RANGE" :disabled="flying" />
            <button class="btn btn-small" type="button" :disabled="flying" @click="matchBall">{{ tx('Match the ball') }} ({{ fmt(horizontalSpeed) }} m/s)</button>
          </template>

          <dl class="readouts">
            <div><dt>{{ tx("Time") }}</dt><dd class="num">{{ fmt(t) }} s</dd></div>
            <template v-if="ball">
              <div><dt>{{ tx("Distance x") }}</dt><dd class="num">{{ fmt(ball.x - frameVelocity * ball.t) }} m</dd></div>
              <div><dt>{{ tx("Height y") }}</dt><dd class="num">{{ fmt(ball.y) }} m</dd></div>
            </template>
            <template v-if="end && status === 'landed'">
              <div><dt>{{ tx('Range (along the ground)') }}</dt><dd class="num">{{ fmt(end.x) }} m</dd></div>
              <div><dt>{{ tx("Highest point") }}</dt><dd class="num">{{ fmt(maxHeight ?? 0) }} m</dd></div>
              <div><dt>{{ tx('Time in the air') }}</dt><dd class="num">{{ fmt(end.t) }} s</dd></div>
            </template>
            <template v-if="advanced && energy">
              <div><dt>{{ tx("Energy per kg") }}</dt><dd class="num">{{ fmt(energy.e) }} J/kg</dd></div>
              <div><dt>{{ tx('Lost to air so far') }}</dt><dd class="num">{{ fmt(energy.lost) }} J/kg</dd></div>
            </template>
            <div v-if="bestAngle !== null"><dt>{{ tx('Best angle for these settings') }}</dt><dd class="num">{{ fmt(bestAngle) }}°</dd></div>
          </dl>
          <button class="btn btn-small" type="button" :disabled="history.length === 0 || flying" @click="clearHistory">{{ localizeExperimentText('Clear earlier throws', locale) ?? 'Clear earlier throws' }}</button>
        </div>
      </div>
    </section>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('mathematicsDisclosure', locale) }}</summary>
      <section aria-labelledby="maths-title" class="card prose">
      <h2 id="maths-title"><span class="step-no">3</span> {{ experimentSectionLabel('mathematics', locale) }}</h2>
      <ProjectileMath :level="level" :params="params" :planet="planet" :drag-applies="dragApplies" :best-angle="bestAngle" />
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
              {{ localizeExperimentText('Without air, a projectile’s path is a parabola, and its horizontal and vertical motions are independent (Galileo, Two New Sciences, 1638).', locale) }}
            </li>
            <li>{{ localizeExperimentText('Newton’s laws explain why: gravity gives a constant downward acceleration, and nothing acts sideways.', locale) }}</li>
            <li>{{ localizeExperimentText('Air resistance shortens the flight, lowers the best launch angle and makes the path lopsided.', locale) }}</li>
            <li>{{ localizeExperimentText('Observers moving at constant velocity see different paths but find the same laws of motion (Galilean relativity).', locale) }}</li>
          </ul>
        </InfoCallout>
        <InfoCallout kind="interpretation" :title="experimentSectionLabel('interpretation', locale)">
          <ul>
            <li>
              <strong>{{ localizeExperimentText('Is there an absolute space?', locale) }}</strong> {{ localizeExperimentText('Newton believed space is a fixed stage and that there is a true state of rest, even though no experiment with moving trains or ships can detect it. Leibniz, and later Mach, argued that only motion relative to other things is real.', locale) }}
            </li>
            <li>
              <strong>{{ localizeExperimentText('Is time absolute?', locale) }}</strong> {{ localizeExperimentText('Newton’s time flows equally for everyone, which is the assumption', locale) }} <MathFormula tex="t' = t" />{{ localizeExperimentText(' used for the train here. Experiments A, B and E show how relativity changed that, and keep the question of what space and time really are open.', locale) }}
            </li>
          </ul>
        </InfoCallout>
      </div>
      <LocalizedExperimentGuide experiment-id="projectile" />
    </section>
    </details>

    <nav class="next card" :aria-label="experimentSectionLabel('nextSteps', locale)">
      <p>{{ localizeExperimentText('See also: Experiment A for motion in one dimension, and Experiment B for what happens near the speed of light.', locale) }}</p>
      <span class="nav-links">
        <RouterLink to="/space/space-vs-time">{{ tx("Experiment A") }}</RouterLink>
        <RouterLink to="/relativity/moving-clocks">{{ tx("Experiment B") }}</RouterLink>
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

.small {
  font-size: 0.85rem;
  margin: 0;
}

.drop-result {
  margin: 0;
  font-weight: 700;
  color: var(--observer);
}

.charts {
  display: grid;
  gap: 8px;
}

.launch {
  min-height: 48px;
  font-size: 1.05rem;
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

.toggle {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-weight: 600;
}

.toggle input,
.frame input {
  accent-color: var(--accent);
  margin-top: 4px;
}

.frame {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  margin: 0;
  padding: 0;
  border: 0;
}

.frame legend {
  font-weight: 700;
  margin-bottom: 4px;
}

.frame label {
  display: inline-flex;
  gap: 6px;
}

.btn-small {
  min-height: 32px;
  padding: 0 10px;
  font-size: 0.85rem;
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
