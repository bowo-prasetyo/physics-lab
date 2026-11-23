<script setup lang="ts">
import LocalizedExperimentGuide from '@/components/LocalizedExperimentGuide.vue'
import ShareExperiment from '@/components/ShareExperiment.vue'
import ExperimentSupport from '@/components/ExperimentSupport.vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import MathFormula from '@/components/MathFormula.vue'
import ParameterSlider from '@/components/ParameterSlider.vue'
import PredictionCard from '@/components/PredictionCard.vue'
import TrackView from '@/components/TrackView.vue'
import PositionTimeGraph from '@/components/PositionTimeGraph.vue'
import ValueTable from '@/components/ValueTable.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import SpaceVsTimeMath from './SpaceVsTimeMath.vue'
import { PREDICTIONS } from './predictions'
import { BOUNDS, DURATION, U_RANGE, V_RANGE, X0_RANGE, useSpaceVsTime } from './useSpaceVsTime'
import { snapToRange, useQuerySync } from '@/composables/useQuerySync'
import { useLevel } from '@/composables/useLevel'
import { atLeast, isLevel } from '@/levels'
import { useLocale } from '@/composables/useLocale'
import { localizeExperimentText } from '@/i18n/experiment-ui'
import { localizePredictions } from '@/i18n/experiment-content'

const route = useRoute()
const level = useLevel()
const { locale } = useLocale()
const tx = (value: string) => localizeExperimentText(value, locale.value) ?? value

// A setup can be shared as a link, e.g. #/space/space-vs-time?x0=-4&v=1.5
const experiment = useSpaceVsTime({
  x0: snapToRange(route.query.x0, X0_RANGE, -6),
  v: snapToRange(route.query.v, V_RANGE, 1.5),
})
const { x0, v, u, status, history, snapshot, allRuns, start, pause, reset, clearHistory } = experiment
u.value = snapToRange(route.query.u, U_RANGE, 0)
// The level is part of the link too, so a teacher can share e.g. the Advanced version.
if (isLevel(route.query.level)) level.value = route.query.level

const advanced = computed(() => atLeast(level.value, 'advanced'))
const observerVelocity = computed(() => (advanced.value && u.value !== 0 ? u.value : null))

const predictions = computed(() => localizePredictions('space-vs-time', PREDICTIONS, locale.value).filter((p) => atLeast(level.value, p.minLevel)))
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed(allRuns.value)])))
const hints = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, localizeExperimentText(p.hint?.(allRuns.value) ?? null, locale.value)])))

const showTable = ref(level.value === 'beginner')

const signed = (value: number, digits = 2) => {
  const text = Math.abs(value).toFixed(digits)
  return (value < 0 && Number(text) !== 0 ? '−' : '') + text
}

const primaryLabel = computed(() => {
  switch (status.value) {
    case 'running':
      return 'Pause'
    case 'paused':
      return 'Resume'
    case 'finished':
      return 'Run again'
    default:
      return 'Start clock'
  }
})

function primaryAction() {
  if (status.value === 'running') pause()
  else if (status.value === 'finished') {
    reset()
    start()
  } else start()
}

const velocityNote = computed(() => {
  if (snapshot.value.atBoundary && snapshot.value.v === 0 && v.value !== 0) return 'Held at the end of the track: the object cannot move further, but the clock keeps running.'
  if (status.value === 'ready') return 'You can also change this while the clock runs.'
  return ''
})

// Keep the setup (and level) in the URL so a teacher can share it exactly.
useQuerySync({
  sources: [x0, v, u, level],
  write: () => {
    const query: Record<string, string> = { level: level.value, x0: String(x0.value), v: String(v.value) }
    if (u.value !== 0) query.u = String(u.value)
    return query
  },
  read: (query) => {
    if (isLevel(query.level)) level.value = query.level
    const next = {
      x0: snapToRange(query.x0, X0_RANGE, x0.value),
      v: snapToRange(query.v, V_RANGE, v.value),
      u: snapToRange(query.u, U_RANGE, 0),
    }
    if (next.x0 === x0.value && next.v === v.value && next.u === u.value) return
    if (status.value !== 'ready') reset()
    x0.value = next.x0
    v.value = next.v
    u.value = next.u
  },
})

</script>

<template>
  <article class="lesson container">
    <header class="lesson-head">
      <p class="eyebrow">{{ localizeExperimentText('Module 1 · Understanding space · Experiment A', locale) ?? 'Module 1 · Understanding space · Experiment A' }}</p>
      <h1>{{ localizeExperimentText('Space versus time', locale) ?? 'Space versus time' }}</h1>
      <p class="lead">{{ localizeExperimentText('An object sits on a straight track while a clock runs. You control where it starts and how fast it moves. What happens to its position, and what happens to time, when you stop it?', locale) ?? 'An object sits on a straight track while a clock runs. You control where it starts and how fast it moves. What happens to its position, and what happens to time, when you stop it?' }}</p>
    </header>

    <ShareExperiment />

    <LocalizedExperimentGuide experiment-id="space-vs-time" />

    <ExperimentSupport experiment-id="space-vs-time" :module-number="1" focus="Position is described relative to a reference frame; elapsed time continues even when the object is stationary." prompt="When the object stops moving, what happens to its position and to the clock?" action="Run the object at different speeds, stop it part-way through, and compare the motion with the position–time graph." reflect="What does the slope of a position–time graph represent, and how does the graph show the difference between rest and the passage of time?" />

    <section aria-labelledby="predict-title">
      <h2 id="predict-title"><span class="step-no">1</span> {{ tx('Predict') }}</h2>
      <p class="muted">{{ tx('Commit to an answer first. Each explanation unlocks only after you have tested it in the experiment below.') }}</p>
      <div class="prediction-grid">
        <PredictionCard v-for="(p, i) in predictions" :key="p.id" :prediction="p" :observed="observed[p.id] ?? false" :hint="hints[p.id]" :index="i + 1" />
      </div>
    </section>

    <section aria-labelledby="experiment-title">
      <h2 id="experiment-title"><span class="step-no">2</span> {{ tx('Experiment') }}</h2>
      <div class="lab">
        <div class="lab-main card">
          <TrackView :x="snapshot.x" :x0="x0" :v="snapshot.v" :t="snapshot.t" :bounds="BOUNDS" :observer-velocity="observerVelocity" />
          <PositionTimeGraph
            :current="snapshot.record"
            :history="history"
            :duration="DURATION"
            :bounds="BOUNDS"
            :observer-velocity="observerVelocity"
          />
          <details class="table-toggle" :open="showTable" @toggle="showTable = ($event.target as HTMLDetailsElement).open">
            <summary>{{ localizeExperimentText('Table of values', locale) ?? 'Table of values' }}</summary>
            <ValueTable :record="snapshot.record" :duration="DURATION" />
          </details>
        </div>

        <div class="lab-side card">
          <div class="clock" role="timer" :aria-label="localizeExperimentText('Experiment clock', locale)">
            <span class="clock-label">{{ tx('Clock') }}</span>
            <span class="clock-value num">{{ snapshot.t.toFixed(2) }}<small> s</small></span>
            <span class="clock-status muted">{{ status === 'finished' ? 'Run complete' : status === 'running' ? 'Running' : status === 'paused' ? 'Paused' : 'Ready' }}</span>
          </div>

          <div class="buttons">
            <button class="btn btn-primary" type="button" @click="primaryAction">{{ primaryLabel }}</button>
            <button class="btn" type="button" :disabled="status === 'ready' && snapshot.t === 0" @click="reset">{{ localizeExperimentText('Reset', locale) ?? 'Reset' }}</button>
          </div>

          <ParameterSlider
            v-model="x0"
            :label="localizeExperimentText('Starting position', locale) ?? 'Starting position'"
            symbol="x_0"
            unit="m"
            v-bind="X0_RANGE"
            :disabled="status !== 'ready'"
            :hint="localizeExperimentText(status !== 'ready' ? 'Reset the clock to choose a new starting position.' : '', locale)"
          />
          <div>
            <ParameterSlider v-model="v" :label="localizeExperimentText('Velocity', locale) ?? 'Velocity'" symbol="v" unit="m/s" v-bind="V_RANGE" :disabled="status === 'finished'" :hint="velocityNote" />
            <button class="btn btn-small" type="button" :disabled="v === 0 || status === 'finished'" @click="v = 0">{{ localizeExperimentText('Set v = 0', locale) ?? 'Set v = 0' }}</button>
          </div>
          <ParameterSlider
            v-if="advanced"
            v-model="u"
            :label="localizeExperimentText('Observer velocity', locale) ?? 'Observer velocity'"
            symbol="u"
            unit="m/s"
            v-bind="U_RANGE"
            :disabled="status !== 'ready'"
            :hint="
              status === 'ready'
                ? 'A second observer moving along the track, passing x = 0 at t = 0. Fixed for the whole run.'
                : 'Reset the clock to change the observer’s velocity.'
            "
          />

          <dl class="readouts">
            <div><dt>{{ tx('Position') }} <MathFormula tex="x" /></dt><dd class="num">{{ signed(snapshot.x) }} m</dd></div>
            <div><dt>{{ tx('Velocity') }} <MathFormula tex="v" /></dt><dd class="num">{{ signed(snapshot.v, 1) }} m/s</dd></div>
            <div><dt>{{ tx('Displacement') }} <MathFormula tex="\Delta x" /></dt><dd class="num">{{ signed(snapshot.displacement) }} m</dd></div>
            <div><dt>{{ tx('Distance travelled') }} <MathFormula tex="s" /></dt><dd class="num">{{ snapshot.distance.toFixed(2) }} m</dd></div>
            <template v-if="observerVelocity !== null">
              <div class="observer-readout"><dt>{{ tx('Observer measures') }} <MathFormula tex="x'" /></dt><dd class="num">{{ signed(snapshot.x - u * snapshot.t) }} m</dd></div>
              <div class="observer-readout"><dt>{{ tx('Observer measures') }} <MathFormula tex="v'" /></dt><dd class="num">{{ signed(snapshot.v - u, 1) }} m/s</dd></div>
            </template>
          </dl>

          <div class="side-footer">
            <button class="btn btn-small" type="button" :disabled="history.length === 0" @click="clearHistory">{{ localizeExperimentText('Clear earlier runs', locale) ?? 'Clear earlier runs' }}</button>
          </div>
        </div>
      </div>
    </section>

    <details class="lesson-disclosure">
      <summary>{{ localizeExperimentText('3 · Explore the mathematics', locale) ?? '3 · Explore the mathematics' }}</summary>
      <section aria-labelledby="maths-title" class="card prose">
      <h2 id="maths-title"><span class="step-no">3</span> The mathematics</h2>
      <SpaceVsTimeMath :level="level" :snapshot="snapshot" :u="u" />
    </section>
    </details>

    <details class="lesson-disclosure">
      <summary>{{ localizeExperimentText('4 · Explore the meaning and interpretation', locale) ?? '4 · Explore the meaning and interpretation' }}</summary>
      <section aria-labelledby="meaning-title" class="card prose">
      <h2 id="meaning-title"><span class="step-no">4</span> {{ localizeExperimentText('What does it tell us?', locale) }}</h2>
      <div class="meaning">
        <InfoCallout kind="physics" :title="localizeExperimentText('Established physics', locale) ?? 'Established physics'">
          <ul>
            <li>{{ localizeExperimentText('With v = 0, the position stays constant while the clock reading keeps increasing.', locale) }}</li>
            <li>
              {{ localizeExperimentText('Clocks keep ticking whether or not they move. At the speeds on this track, a moving clock and a stationary one also tick at the same rate to better than one part in', locale) }} <MathFormula tex="10^{16}" />{{ localizeExperimentText('. At speeds close to light, they do not (Module 4).', locale) }}
            </li>
          </ul>
        </InfoCallout>
        <InfoCallout kind="interpretation" :title="localizeExperimentText('Interpretation: open to debate', locale) ?? 'Interpretation: open to debate'">
          <p>
            {{ localizeExperimentText('We can stop moving through space, but never through time, so space and time must be fundamentally different things.', locale) }} {{ localizeExperimentText('This is a philosophical claim. The experiment is consistent with it, but does not prove it. Points to weigh:', locale) }}
          </p>
          <ul>
            <li>
              <strong>{{ localizeExperimentText('Rest is relative.', locale) }}</strong> {{ localizeExperimentText('An object at rest for one observer moves for another.', locale) }}
              <template v-if="advanced">{{ localizeExperimentText('Try it with the observer slider above.', locale) }}</template>
              <template v-else>{{ localizeExperimentText('Switch to the Advanced level to try this with a second observer.', locale) }}</template>
            </li>
            <li v-if="atLeast(level, 'intermediate')">
              <strong>{{ localizeExperimentText('Relativity reframes it.', locale) }}</strong> {{ localizeExperimentText('In spacetime language every object moves along its worldline with a 4-velocity of the same size,', locale) }} <MathFormula tex="c" />. {{ localizeExperimentText('Being "at rest" means all of that motion is in the time direction.', locale) }}
            </li>
            <li>
              <strong>{{ localizeExperimentText('Time does differ from space in some ways.', locale) }}</strong> {{ localizeExperimentText('You can walk back and forth along', locale) }} <MathFormula tex="x" />, {{ localizeExperimentText('but clocks only ever advance. Whether that arrow of time is fundamental is still an open question.', locale) }}
            </li>
          </ul>
        </InfoCallout>
      </div>
    </section>
    </details>

    <nav class="next card" :aria-label="localizeExperimentText('Next steps', locale)">
      <p><strong>Next:</strong> Experiment B compares two clocks moving relative to each other near the speed of light.</p>
      <span class="nav-links">
        <RouterLink to="/relativity/moving-clocks">Experiment B →</RouterLink>
        <RouterLink to="/">All modules</RouterLink>
      </span>
    </nav>
  </article>
</template>

<style scoped>
.lab {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
  align-items: start;
}

.lab-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.lab-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: sticky;
  top: 76px;
}

.clock {
  display: grid;
  text-align: center;
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
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.1;
}

.clock-value small {
  font-size: 1rem;
  color: var(--text-muted);
}

.clock-status {
  font-size: 0.85rem;
}

.buttons {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.btn-small {
  min-height: 32px;
  padding: 0 10px;
  font-size: 0.85rem;
  margin-top: 6px;
}

.readouts {
  display: grid;
  gap: 6px;
  margin: 0;
  padding-top: 12px;
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
}

.observer-readout dt,
.observer-readout dd {
  color: var(--observer);
}

.side-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.table-toggle summary {
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 6px;
}

.prose {
  max-width: 100%;
}

.nav-links {
  display: inline-flex;
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
