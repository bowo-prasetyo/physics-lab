<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MathFormula from '@/components/MathFormula.vue'
import ParameterSlider from '@/components/ParameterSlider.vue'
import PredictionCard from '@/components/PredictionCard.vue'
import TrackView from '@/components/TrackView.vue'
import PositionTimeGraph from '@/components/PositionTimeGraph.vue'
import ValueTable from '@/components/ValueTable.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import SpaceVsTimeMath from './SpaceVsTimeMath.vue'
import { PREDICTIONS } from './predictions'
import { BOUNDS, DURATION, U_RANGE, V_RANGE, X0_RANGE, snapToRange, useSpaceVsTime } from './useSpaceVsTime'
import { useLevel } from '@/composables/useLevel'
import { atLeast } from '@/levels'

const route = useRoute()
const router = useRouter()
const level = useLevel()

// A setup can be shared as a link, e.g. #/space/space-vs-time?x0=-4&v=1.5
const experiment = useSpaceVsTime({
  x0: snapToRange(route.query.x0, X0_RANGE, -6),
  v: snapToRange(route.query.v, V_RANGE, 1.5),
})
const { x0, v, u, status, history, snapshot, allRuns, start, pause, reset, clearHistory } = experiment
u.value = snapToRange(route.query.u, U_RANGE, 0)

const advanced = computed(() => atLeast(level.value, 'advanced'))
const observerVelocity = computed(() => (advanced.value && u.value !== 0 ? u.value : null))

const predictions = computed(() => PREDICTIONS.filter((p) => atLeast(level.value, p.minLevel)))
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed(allRuns.value)])))

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

// A shared link opened in a tab that already shows this lesson changes only
// the query, and Vue reuses the page, so apply incoming values here too.
// The page's own URL updates (below) are recognised and ignored.
let ownQuery = ''
watch(
  () => route.query,
  (query) => {
    if (JSON.stringify(query) === ownQuery) return
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
)

// Keep the URL in sync so a teacher can share an exact setup.
let urlTimer: ReturnType<typeof setTimeout> | undefined
watch([x0, v, u], () => {
  clearTimeout(urlTimer)
  urlTimer = setTimeout(() => {
    const query: Record<string, string> = { x0: String(x0.value), v: String(v.value) }
    if (u.value !== 0) query.u = String(u.value)
    ownQuery = JSON.stringify(query)
    router.replace({ query })
  }, 300)
})
onBeforeUnmount(() => clearTimeout(urlTimer))

const copied = ref(false)
async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    window.prompt('Copy this link:', window.location.href)
  }
}
</script>

<template>
  <article class="lesson container">
    <header class="lesson-head">
      <p class="eyebrow">Module 1 · Understanding space · Experiment A</p>
      <h1>Space versus time</h1>
      <p class="lead">
        An object sits on a straight track while a clock runs. You control where it starts and how fast it moves. What happens to its
        position, and what happens to time, when you stop it?
      </p>
    </header>

    <section aria-labelledby="predict-title">
      <h2 id="predict-title"><span class="step-no">1</span> Predict</h2>
      <p class="muted">Commit to an answer first. Each explanation unlocks only after you have tested it in the experiment below.</p>
      <div class="prediction-grid">
        <PredictionCard v-for="(p, i) in predictions" :key="p.id" :prediction="p" :observed="observed[p.id] ?? false" :index="i + 1" />
      </div>
    </section>

    <section aria-labelledby="experiment-title">
      <h2 id="experiment-title"><span class="step-no">2</span> Experiment</h2>
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
            <summary>Table of values</summary>
            <ValueTable :record="snapshot.record" :duration="DURATION" />
          </details>
        </div>

        <div class="lab-side card">
          <div class="clock" role="timer" aria-label="Experiment clock">
            <span class="clock-label">Clock</span>
            <span class="clock-value num">{{ snapshot.t.toFixed(2) }}<small> s</small></span>
            <span class="clock-status muted">{{ status === 'finished' ? 'Run complete' : status === 'running' ? 'Running' : status === 'paused' ? 'Paused' : 'Ready' }}</span>
          </div>

          <div class="buttons">
            <button class="btn btn-primary" type="button" @click="primaryAction">{{ primaryLabel }}</button>
            <button class="btn" type="button" :disabled="status === 'ready' && snapshot.t === 0" @click="reset">Reset</button>
          </div>

          <ParameterSlider
            v-model="x0"
            label="Starting position"
            symbol="x_0"
            unit="m"
            v-bind="X0_RANGE"
            :disabled="status !== 'ready'"
            :hint="status !== 'ready' ? 'Reset the clock to choose a new starting position.' : ''"
          />
          <div>
            <ParameterSlider v-model="v" label="Velocity" symbol="v" unit="m/s" v-bind="V_RANGE" :disabled="status === 'finished'" :hint="velocityNote" />
            <button class="btn btn-small" type="button" :disabled="v === 0 || status === 'finished'" @click="v = 0">Set v = 0</button>
          </div>
          <ParameterSlider
            v-if="advanced"
            v-model="u"
            label="Observer velocity"
            symbol="u"
            unit="m/s"
            v-bind="U_RANGE"
            hint="A second observer moving along the track, starting from x = 0 at t = 0."
          />

          <dl class="readouts">
            <div><dt>Position <MathFormula tex="x" /></dt><dd class="num">{{ signed(snapshot.x) }} m</dd></div>
            <div><dt>Velocity <MathFormula tex="v" /></dt><dd class="num">{{ signed(snapshot.v, 1) }} m/s</dd></div>
            <div><dt>Displacement <MathFormula tex="\Delta x" /></dt><dd class="num">{{ signed(snapshot.displacement) }} m</dd></div>
            <div><dt>Distance travelled <MathFormula tex="s" /></dt><dd class="num">{{ snapshot.distance.toFixed(2) }} m</dd></div>
            <template v-if="observerVelocity !== null">
              <div class="observer-readout"><dt>Observer measures <MathFormula tex="x'" /></dt><dd class="num">{{ signed(snapshot.x - u * snapshot.t) }} m</dd></div>
              <div class="observer-readout"><dt>Observer measures <MathFormula tex="v'" /></dt><dd class="num">{{ signed(snapshot.v - u, 1) }} m/s</dd></div>
            </template>
          </dl>

          <div class="side-footer">
            <button class="btn btn-small" type="button" :disabled="history.length === 0" @click="clearHistory">Clear earlier runs</button>
            <button class="btn btn-small" type="button" @click="copyLink">{{ copied ? 'Link copied' : 'Copy link to this setup' }}</button>
          </div>
        </div>
      </div>
    </section>

    <section aria-labelledby="maths-title" class="card prose">
      <h2 id="maths-title"><span class="step-no">3</span> The mathematics</h2>
      <SpaceVsTimeMath :level="level" :snapshot="snapshot" :u="u" />
    </section>

    <section aria-labelledby="meaning-title" class="card prose">
      <h2 id="meaning-title"><span class="step-no">4</span> What does it tell us?</h2>
      <div class="meaning">
        <InfoCallout kind="physics" title="Established physics">
          <ul>
            <li>With <MathFormula tex="v = 0" />, the position stays constant while the clock reading keeps increasing.</li>
            <li>
              Clocks keep ticking whether or not they move. At the speeds on this track, a moving clock and a stationary one also tick at the same
              rate to better than one part in <MathFormula tex="10^{16}" />. At speeds close to light, they do not (Module 4).
            </li>
          </ul>
        </InfoCallout>
        <InfoCallout kind="interpretation" title="Interpretation: open to debate">
          <p>
            "We can stop moving through space, but never through time, so space and time must be fundamentally different things."
            This is a philosophical claim. The experiment is consistent with it, but does not prove it. Points to weigh:
          </p>
          <ul>
            <li>
              <strong>Rest is relative.</strong> An object at rest for one observer moves for another.
              <template v-if="advanced">Try it with the observer slider above.</template>
              <template v-else>Switch to the Advanced level to try this with a second observer.</template>
            </li>
            <li v-if="atLeast(level, 'intermediate')">
              <strong>Relativity reframes it.</strong> In spacetime language every object moves along its worldline with a 4-velocity of the same
              size, <MathFormula tex="c" />. Being "at rest" means all of that motion is in the time direction.
            </li>
            <li>
              <strong>Time does differ from space in some ways.</strong> You can walk back and forth along <MathFormula tex="x" />, but clocks
              only ever advance. Whether that arrow of time is fundamental is still an open question.
            </li>
          </ul>
        </InfoCallout>
      </div>
    </section>

    <nav class="next card" aria-label="Next steps">
      <p><strong>Coming next:</strong> Experiment B, which compares two clocks moving relative to each other near the speed of light.</p>
      <RouterLink to="/">Back to all modules</RouterLink>
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
