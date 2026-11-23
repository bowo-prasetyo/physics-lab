<script setup lang="ts">
import ShareExperiment from '@/components/ShareExperiment.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MathFormula from '@/components/MathFormula.vue'
import ParameterSlider from '@/components/ParameterSlider.vue'
import PredictionCard from '@/components/PredictionCard.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import SpacetimeDiagram, { type DiagramSimultaneity, type DiagramWorldline } from '@/components/SpacetimeDiagram.vue'
import MovingClocksMath from './MovingClocksMath.vue'
import { PREDICTIONS } from './predictions'
import { BETA_RANGE, DURATION, useMovingClocks, type Frame } from './useMovingClocks'
import { intervalSquared } from '@/physics'
import { snapToRange, useQuerySync } from '@/composables/useQuerySync'
import { useLevel } from '@/composables/useLevel'
import { atLeast, isLevel } from '@/levels'

const route = useRoute()
const level = useLevel()

const isFrame = (value: unknown): value is Frame => value === 'earth' || value === 'ship'

// A setup can be shared as a link, e.g. #/relativity/moving-clocks?level=advanced&beta=0.8&frame=ship
if (isLevel(route.query.level)) level.value = route.query.level
const { beta, frame, status, t, view, lorentz, allRuns, start, pause, reset } = useMovingClocks({
  beta: snapToRange(route.query.beta, BETA_RANGE, 0.8),
  frame: isFrame(route.query.frame) ? route.query.frame : 'earth',
})

useQuerySync({
  sources: [beta, frame, level],
  write: () => ({ level: level.value, beta: beta.value.toFixed(2), frame: frame.value }),
  read: (query) => {
    if (isLevel(query.level)) level.value = query.level
    beta.value = snapToRange(query.beta, BETA_RANGE, beta.value)
    if (isFrame(query.frame)) frame.value = query.frame
  },
})

const predictions = computed(() => PREDICTIONS.filter((p) => atLeast(level.value, p.minLevel)))
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed(allRuns.value)])))
const hints = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.hint?.(allRuns.value) ?? null])))

const intermediate = computed(() => atLeast(level.value, 'intermediate'))
const advanced = computed(() => atLeast(level.value, 'advanced'))

const frameName = computed(() => (frame.value === 'earth' ? 'the Earth' : 'the ship'))
// Names as used mid-sentence ("the ship clock", "the Earth clock").
const home = computed(() => (frame.value === 'earth' ? 'Earth' : 'ship'))
const other = computed(() => (frame.value === 'earth' ? 'ship' : 'Earth'))
const capitalise = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

// The resting clock's tick labels go on the same side as the moving clock,
// so the "now" marker on the resting worldline can be labelled on the other.
const movingSide = computed<'left' | 'right'>(() => (frame.value === 'earth' ? 'right' : 'left'))

const worldlines = computed<DiagramWorldline[]>(() => [
  { id: 'earth', label: 'Earth clock', velocity: view.value.earthVelocity, kind: 'earth', side: movingSide.value },
  { id: 'ship', label: 'Ship clock', velocity: view.value.shipVelocity, kind: 'ship', side: movingSide.value },
])

// From Intermediate on, draw the moving observer's "now" as well.
const simultaneity = computed<DiagramSimultaneity | null>(() => {
  if (!intermediate.value || beta.value === 0 || t.value === 0) return null
  const moving = frame.value === 'earth' ? view.value.ship : view.value.earth
  const velocity = frame.value === 'earth' ? view.value.shipVelocity : view.value.earthVelocity
  return {
    velocity,
    through: moving,
    label: `The ${other.value}’s “now”`,
    meets: { t: view.value.otherNowMeetsHomeAt, label: `${capitalise(home.value)} clock ${view.value.otherNowMeetsHomeAt.toFixed(2)} s` },
  }
})

const shipInterval = computed(() => intervalSquared(view.value.ship))

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

const statusText = computed(() =>
  status.value === 'finished' ? 'Run complete' : status.value === 'running' ? 'Running' : status.value === 'paused' ? 'Paused' : 'Ready',
)

const signed = (value: number, digits = 2) => {
  const text = Math.abs(value).toFixed(digits)
  return (value < 0 && Number(text) !== 0 ? '−' : '') + text
}
</script>

<template>
  <article class="lesson container">
    <header class="lesson-head">
      <p class="eyebrow">Module 4 · Special relativity · Experiment B</p>
      <h1>Different clocks, different elapsed times</h1>
      <p class="lead">
        A spaceship flies past the Earth. At the moment they pass, both clocks read zero. How much time has passed on each clock a little
        later, and does the answer depend on who you ask?
      </p>
    </header>

    <ShareExperiment />

    <section aria-labelledby="predict-title">
      <h2 id="predict-title"><span class="step-no">1</span> Predict</h2>
      <p class="muted">Commit to an answer first. Each explanation unlocks only after you have tested it in the experiment below.</p>
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
      <h2 id="experiment-title"><span class="step-no">2</span> Experiment</h2>
      <div class="lab">
        <div class="lab-main card">
          <fieldset class="frame-switch" :disabled="status === 'running'">
            <legend>Seen from</legend>
            <label :class="{ active: frame === 'earth' }">
              <input v-model="frame" type="radio" value="earth" class="sr-only" />
              <span class="dot earth" /> the Earth
            </label>
            <label :class="{ active: frame === 'ship' }">
              <input v-model="frame" type="radio" value="ship" class="sr-only" />
              <span class="dot ship" /> the ship
            </label>
          </fieldset>
          <SpacetimeDiagram :duration="DURATION" :t="t" :worldlines="worldlines" :simultaneity="simultaneity" :frame-name="frameName" />
        </div>

        <div class="lab-side card">
          <div class="clocks">
            <div class="clock-card earth">
              <span class="clock-name">Earth clock</span>
              <span class="clock-value num">{{ view.earth.tau.toFixed(2) }}<small> s</small></span>
              <span class="clock-note">{{ frame === 'earth' ? 'at rest in this frame' : 'moving in this frame' }}</span>
            </div>
            <div class="clock-card ship">
              <span class="clock-name">Ship clock</span>
              <span class="clock-value num">{{ view.ship.tau.toFixed(2) }}<small> s</small></span>
              <span class="clock-note">{{ frame === 'ship' ? 'at rest in this frame' : 'moving in this frame' }}</span>
            </div>
          </div>
          <p class="status muted">{{ statusText }} · seen from {{ frameName }}</p>

          <div class="buttons">
            <button class="btn btn-primary" type="button" @click="primaryAction">{{ primaryLabel }}</button>
            <button class="btn" type="button" :disabled="status === 'ready'" @click="reset">Reset</button>
          </div>

          <ParameterSlider
            v-model="beta"
            label="Ship speed"
            symbol="v/c"
            unit="c"
            v-bind="BETA_RANGE"
            :digits="2"
            :signed="false"
            :disabled="status === 'running'"
            :hint="status === 'running' ? 'Pause to change the speed (this starts a new run).' : 'Relative to the Earth. 0.80c is 80% of light speed.'"
          />

          <dl class="readouts">
            <div><dt>Lorentz factor <MathFormula tex="\gamma" /></dt><dd class="num">{{ lorentz.toFixed(3) }}</dd></div>
            <div><dt>Moving clock ÷ resting clock</dt><dd class="num">{{ (1 / lorentz).toFixed(3) }}</dd></div>
            <div v-if="simultaneity" class="other-now">
              <dt>The {{ other }}’s “now” meets the {{ home }} clock at</dt>
              <dd class="num">{{ view.otherNowMeetsHomeAt.toFixed(2) }} s</dd>
            </div>
            <template v-if="advanced">
              <div><dt>Ship event <MathFormula tex="(t, x)" /></dt><dd class="num">({{ view.ship.t.toFixed(2) }}, {{ signed(view.ship.x) }})</dd></div>
              <div><dt>Interval <MathFormula tex="s^2 = t^2 - x^2" /></dt><dd class="num">{{ shipInterval.toFixed(2) }} s²</dd></div>
              <div><dt>Ship clock squared <MathFormula tex="\tau^2" /></dt><dd class="num">{{ (view.ship.tau ** 2).toFixed(2) }} s²</dd></div>
            </template>
          </dl>
          <p class="units muted">Units: c = 1, so distances are in light-seconds (ls).</p>
        </div>
      </div>
    </section>

    <details class="lesson-disclosure">
      <summary>3 · Explore the mathematics</summary>
      <section aria-labelledby="maths-title" class="card prose">
      <h2 id="maths-title"><span class="step-no">3</span> The mathematics</h2>
      <MovingClocksMath :level="level" :beta="beta" :frame="frame" :t="t" :view="view" />
    </section>
    </details>

    <details class="lesson-disclosure">
      <summary>4 · Explore the meaning and interpretation</summary>
      <section aria-labelledby="meaning-title" class="card prose">
      <h2 id="meaning-title"><span class="step-no">4</span> What does it tell us?</h2>
      <div class="meaning">
        <InfoCallout kind="physics" title="Established physics">
          <ul>
            <li>Measured from any inertial frame, a clock moving at speed <MathFormula tex="v" /> runs slow by the factor γ.</li>
            <li>The effect is symmetric: each of two inertial observers finds the other’s clock running slow.</li>
            <li>
              It is measured routinely: fast cosmic-ray muons survive long enough to reach the ground, atomic clocks flown on airliners
              (Hafele and Keating, 1971) came back measurably out of step, and GPS satellite clocks are corrected by about 7 microseconds
              per day for their speed.
            </li>
            <li>The proper time along a worldline, what a clock actually shows, is the same in every frame.</li>
          </ul>
        </InfoCallout>
        <InfoCallout kind="interpretation" title="Interpretation: open to debate">
          <ul>
            <li>
              <strong>Does time “really” slow down for the astronaut?</strong> For two clocks that just fly past each other, “which one is
              really slower” has no frame-independent answer: it depends on which events you call simultaneous. A frame-independent
              difference only appears when the clocks meet again (the twin paradox).
            </li>
            <li>
              <strong>Is there a universal “now”?</strong> The tilted lines of simultaneity show that observers disagree about which distant
              events are happening now. Some philosophers argue this favours a “block universe”, in which past, present and future events
              all exist equally. Others defend a privileged present. Physics makes the same predictions either way; the debate is about
              interpretation.
            </li>
          </ul>
        </InfoCallout>
      </div>
      <InfoCallout kind="note" title="Seeing versus measuring" class="seeing">
        <p>
          The diagram shows what each observer <em>measures</em> after allowing for the time light takes to travel. What an astronaut would
          literally <em>see</em> through a telescope also includes that travel delay (and the Doppler effect), so the images can run faster
          or slower still. Time dilation is what remains after correcting for it.
        </p>
      </InfoCallout>
    </section>
    </details>

    <nav class="next card" aria-label="Next steps">
      <p>
        <strong>Next:</strong> Experiment E describes the same situations with separate space and time, and with a single spacetime.
      </p>
      <span class="nav-links">
        <RouterLink to="/space/space-vs-time">← Experiment A</RouterLink>
        <RouterLink to="/relativity/two-perspectives">Experiment E →</RouterLink>
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
  gap: 10px;
  min-width: 0;
}

.lab-side {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 76px;
}

.frame-switch {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  border: 0;
}

.frame-switch legend {
  float: left;
  margin-right: 6px;
  font-weight: 700;
}

.frame-switch label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
}

.frame-switch label.active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent);
}

.frame-switch:disabled label {
  opacity: 0.55;
  cursor: not-allowed;
}

.frame-switch label:has(input:focus-visible) {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.earth {
  background: var(--success);
}

.dot.ship {
  background: var(--accent);
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
  border-top: 4px solid;
}

.clock-card.earth {
  border-top-color: var(--success);
}

.clock-card.ship {
  border-top-color: var(--accent);
}

.clock-name {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.clock-value {
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1.15;
}

.clock-value small {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.clock-note {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.status {
  margin: -8px 0 0;
  text-align: center;
  font-size: 0.85rem;
}

.buttons {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
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
  white-space: nowrap;
}

.other-now dt,
.other-now dd {
  color: var(--observer);
}

.units {
  margin: -6px 0 0;
  font-size: 0.8rem;
}

.seeing {
  margin-top: 16px;
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
