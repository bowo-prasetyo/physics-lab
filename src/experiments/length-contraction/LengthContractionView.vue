<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LocalizedExperimentGuide from '@/components/LocalizedExperimentGuide.vue'
import ShareExperiment from '@/components/ShareExperiment.vue'
import ExperimentSupport from '@/components/ExperimentSupport.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import PredictionCard from '@/components/PredictionCard.vue'
import MathFormula from '@/components/MathFormula.vue'
import ParameterSlider from '@/components/ParameterSlider.vue'
import { useLevel } from '@/composables/useLevel'
import { snapToRange, useQuerySync } from '@/composables/useQuerySync'
import { useLocale } from '@/composables/useLocale'
import { formatNumber } from '@/i18n/formatters'
import { getExperimentModuleEyebrow, experimentSectionLabel } from '@/i18n/experiment-metadata'
import { localizePredictions } from '@/i18n/experiment-content'
import { atLeast, isLevel } from '@/levels'
import { calculateLengthContraction } from '@/physics'
import { getLengthContractionDocumentTitle, localizeLengthContractionText } from './copy'
import { PREDICTIONS, type LengthMeasurement } from './predictions'

const route = useRoute()
const level = useLevel()
const { locale } = useLocale()
const tx = (value: string) => localizeLengthContractionText(value, locale.value)

const SPEED_RANGE = { min: 0, max: 0.9, step: 0.01 }
const LENGTH_RANGE = { min: 2, max: 20, step: 1 }
const beta = ref(snapToRange(route.query.beta, SPEED_RANGE, 0.8))
const properLength = ref(snapToRange(route.query.length, LENGTH_RANGE, 10))
if (isLevel(route.query.level)) level.value = route.query.level

useQuerySync({
  sources: [beta, properLength, level],
  write: () => ({ level: level.value, beta: beta.value.toFixed(2), length: String(properLength.value) }),
  read: (query) => {
    if (isLevel(query.level)) level.value = query.level
    beta.value = snapToRange(query.beta, SPEED_RANGE, beta.value)
    properLength.value = snapToRange(query.length, LENGTH_RANGE, properLength.value)
  },
})

const result = computed(() => calculateLengthContraction(properLength.value, beta.value))
const runs = ref<LengthMeasurement[]>([])
// Results stay hidden until the current setup has been measured.
const setupKey = computed(() => `${beta.value}|${properLength.value}`)
const lastRunKey = ref<string | null>(null)
const shown = computed(() => lastRunKey.value === setupKey.value)
const predictions = computed(() => localizePredictions('length-contraction', PREDICTIONS, locale.value).filter((p) => atLeast(level.value, p.minLevel)))
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed(runs.value)])))
const hints = computed(() => Object.fromEntries(PREDICTIONS.map((p) => {
  const hint = p.hint?.(runs.value) ?? null
  return [p.id, hint === null ? null : tx(hint)]
})))
const intermediate = computed(() => atLeast(level.value, 'intermediate'))
const advanced = computed(() => atLeast(level.value, 'advanced'))
const fmt = (value: number, digits = 2) => formatNumber(Number(value.toFixed(digits)))
const timeDifferenceNs = computed(() => result.value.frontEventTimeInRestFrame * 1e9)
const speedPercent = computed(() => beta.value * 100)

const W = 600
const H = 340
const plot = { left: 48, right: 18, top: 18, bottom: 44 }
const xMin = -2.5
const xMax = 2.8
const ctMin = -2.3
const ctMax = 2.3
const sx = (x: number) => plot.left + (x - xMin) / (xMax - xMin) * (W - plot.left - plot.right)
const sy = (ct: number) => plot.top + (ctMax - ct) / (ctMax - ctMin) * (H - plot.top - plot.bottom)
const diagram = computed(() => {
  const inverseGamma = 1 / result.value.gamma
  const endCt = beta.value * result.value.gamma
  return {
    rearStart: { x: sx(beta.value * ctMin), y: sy(ctMin) },
    rearEnd: { x: sx(beta.value * ctMax), y: sy(ctMax) },
    frontStart: { x: sx(beta.value * ctMin + inverseGamma), y: sy(ctMin) },
    frontEnd: { x: sx(beta.value * ctMax + inverseGamma), y: sy(ctMax) },
    earthRear: { x: sx(0), y: sy(0) },
    earthFront: { x: sx(inverseGamma), y: sy(0) },
    shipFront: { x: sx(result.value.gamma), y: sy(endCt) },
    xTicks: [-2, -1, 0, 1, 2],
    ctTicks: [-2, -1, 0, 1, 2],
  }
})

function runMeasurement() {
  runs.value = [...runs.value, { beta: beta.value, properLength: properLength.value, measuredLength: result.value.measuredLength }]
  lastRunKey.value = setupKey.value
}
function clearRuns() {
  runs.value = []
  lastRunKey.value = null
}

watch(locale, () => {
  if (route.name === 'length-contraction') document.title = getLengthContractionDocumentTitle(locale.value)
})
</script>

<template>
  <article class="lesson container length-contraction">
    <header class="lesson-head">
      <p class="eyebrow">{{ getExperimentModuleEyebrow('length-contraction', locale) }}</p>
      <h1>{{ tx('Length Contraction Lab: measuring moving space') }}</h1>
      <p class="lead">{{ tx('A moving object is measured to be shorter along its direction of motion. The key is not how it looks, but how one observer measures both ends at the same time.') }}</p>
    </header>

    <ShareExperiment />

    <ExperimentSupport
      experiment-id="length-contraction"
      :module-number="4"
      focus="Length is measured from endpoint positions recorded simultaneously in a chosen inertial frame."
      prompt="If the spaceship moves faster, will Earth observers measure a longer, shorter or unchanged length?"
      action="Predict first, then vary the speed and rest length. Compare the Earth-frame measurement with the spaceship's proper length and inspect the endpoint events on the diagram."
      reflect="Why must the two endpoint positions be recorded at the same time, and why does that pair of events differ between frames?"
    />

    <section aria-labelledby="predict-title">
      <h2 id="predict-title"><span class="step-no">1</span> {{ experimentSectionLabel('predict', locale) }}</h2>
      <p class="muted">{{ tx('Commit to an answer first. Each explanation unlocks only after you have made the measurement that tests it.') }}</p>
      <div class="prediction-grid">
        <PredictionCard v-for="(p, i) in predictions" :key="p.id" :prediction="p" :observed="observed[p.id] ?? false" :hint="hints[p.id]" :index="i + 1" />
      </div>
    </section>

    <section aria-labelledby="experiment-title">
      <h2 id="experiment-title"><span class="step-no">2</span> {{ experimentSectionLabel('experiment', locale) }}</h2>
      <div class="experiment-grid">
        <div class="card diagram-card">
          <div class="diagram-heading">
            <strong>{{ tx('Spacetime diagram: endpoint worldlines and two simultaneity slices') }}</strong>
            <span class="muted small">{{ tx('Measuring frame') }}: {{ tx('Earth') }}</span>
          </div>
          <svg class="spacetime" :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="tx('Spacetime diagram: endpoint worldlines and two simultaneity slices')">
            <defs>
              <clipPath id="length-contraction-plot">
                <rect :x="plot.left" :y="plot.top" :width="W - plot.left - plot.right" :height="H - plot.top - plot.bottom" />
              </clipPath>
            </defs>
            <g class="grid">
              <line v-for="tick in diagram.xTicks" :key="'x'+tick" :x1="sx(tick)" :x2="sx(tick)" :y1="plot.top" :y2="H-plot.bottom" />
              <line v-for="tick in diagram.ctTicks" :key="'t'+tick" :x1="plot.left" :x2="W-plot.right" :y1="sy(tick)" :y2="sy(tick)" />
            </g>
            <g class="axis">
              <line :x1="plot.left" :x2="W-plot.right" :y1="sy(0)" :y2="sy(0)" />
              <line :x1="sx(0)" :x2="sx(0)" :y1="plot.top" :y2="H-plot.bottom" />
            </g>
            <g class="tick-labels">
              <text v-for="tick in diagram.xTicks" :key="'xl'+tick" :x="sx(tick)" :y="H-plot.bottom+17" text-anchor="middle">{{ tick }}</text>
              <text v-for="tick in diagram.ctTicks" :key="'tl'+tick" :x="plot.left-9" :y="sy(tick)+4" text-anchor="end">{{ tick }}</text>
              <text :x="(plot.left+W-plot.right)/2" :y="H-7" text-anchor="middle">{{ tx('position x / proper length') }}</text>
              <text x="12" :y="(plot.top+H-plot.bottom)/2" text-anchor="middle" :transform="`rotate(-90 12 ${(plot.top+H-plot.bottom)/2})`">{{ tx('time ct / proper length') }}</text>
            </g>
            <text v-if="!shown" class="pending-text" :x="(plot.left + W - plot.right) / 2" :y="plot.top + 40" text-anchor="middle">{{ tx('Run the measurement to record the endpoint events.') }}</text>
            <g v-if="shown" clip-path="url(#length-contraction-plot)">
              <line class="worldline rear" :x1="diagram.rearStart.x" :y1="diagram.rearStart.y" :x2="diagram.rearEnd.x" :y2="diagram.rearEnd.y" />
              <line class="worldline front" :x1="diagram.frontStart.x" :y1="diagram.frontStart.y" :x2="diagram.frontEnd.x" :y2="diagram.frontEnd.y" />
              <line class="earth-slice" :x1="diagram.earthRear.x" :y1="diagram.earthRear.y" :x2="diagram.earthFront.x" :y2="diagram.earthFront.y" />
              <line class="ship-slice" :x1="diagram.earthRear.x" :y1="diagram.earthRear.y" :x2="diagram.shipFront.x" :y2="diagram.shipFront.y" />
              <circle class="event rear-event" :cx="diagram.earthRear.x" :cy="diagram.earthRear.y" r="5" />
              <circle class="event front-event" :cx="diagram.earthFront.x" :cy="diagram.earthFront.y" r="5" />
              <circle class="event ship-event" :cx="diagram.shipFront.x" :cy="diagram.shipFront.y" r="5" />
            </g>
            <g v-if="shown" class="diagram-legend">
              <line class="worldline rear" x1="66" y1="20" x2="90" y2="20" />
              <text x="96" y="24">{{ tx('Rear endpoint worldline') }}</text>
              <line class="worldline front" x1="290" y1="20" x2="314" y2="20" />
              <text x="320" y="24">{{ tx('Front endpoint worldline') }}</text>
            </g>
          </svg>
          <div v-if="shown" class="slice-legend">
            <p><span class="slice-key earth"></span>{{ tx('Earth-frame simultaneity (t = 0)') }}</p>
            <p v-if="intermediate"><span class="slice-key ship"></span>{{ tx('Ship-frame simultaneity (t′ = 0)') }}</p>
          </div>
          <p v-if="shown" class="small muted">{{ tx('The horizontal Earth slice intersects both ends at the same Earth time, giving the contracted length. The tilted ship slice is simultaneous in the ship frame instead; it is a different pair of endpoint events.') }}</p>
        </div>

        <aside class="card controls">
          <div>
            <p class="eyebrow">{{ tx('Measuring frame') }}</p>
            <strong>{{ tx('Earth') }}</strong>
            <p class="small muted">{{ tx('Moving object') }}: {{ tx('Spaceship') }}</p>
          </div>
          <ParameterSlider v-model="beta" :label="tx('Relative speed')" symbol="v/c" unit="c" v-bind="SPEED_RANGE" :digits="2" :signed="false" />
          <ParameterSlider v-model="properLength" :label="tx('Proper length')" symbol="L_0" unit="m" v-bind="LENGTH_RANGE" :digits="0" :signed="false" />
          <button class="btn btn-primary" type="button" @click="runMeasurement">{{ tx('Run the experiment') }}</button>
          <div v-if="shown" class="readouts" aria-live="polite">
            <div><span>{{ tx('Proper length') }} L₀</span><strong>{{ fmt(result.properLength) }} m</strong></div>
            <div class="measured"><span>{{ tx('Measured length') }} L</span><strong>{{ fmt(result.measuredLength) }} m</strong></div>
            <div><span>{{ tx('Length difference') }}</span><strong>{{ fmt(result.contraction) }} m</strong></div>
            <div><span>{{ tx('Lorentz factor') }} γ</span><strong>{{ fmt(result.gamma, 3) }}</strong></div>
            <div v-if="intermediate"><span>{{ tx('Relative speed') }}</span><strong>{{ fmt(speedPercent, 0) }}% c</strong></div>
            <div v-if="advanced" class="wide"><span>{{ tx('Endpoint timing difference in the ship frame') }}</span><strong>{{ fmt(timeDifferenceNs, 3) }} ns</strong></div>
          </div>
          <p v-else class="pending">{{ tx('Run the measurement to see the length Earth observers record.') }}</p>
          <p v-if="advanced && shown && beta > 0" class="small muted">{{ tx('The front-end event occurs earlier in the ship frame for this pair of Earth-simultaneous measurements.') }}</p>
        </aside>
      </div>
      <div v-if="runs.length" class="card runs">
        <div class="runs-heading"><h3>{{ tx('Recorded measurements') }}</h3><button class="btn btn-small" type="button" @click="clearRuns">{{ tx('Clear measurements') }}</button></div>
        <div class="table-scroll">
          <table>
            <thead><tr><th>#</th><th>{{ tx('Relative speed') }}</th><th>{{ tx('Proper length') }} L₀</th><th>{{ tx('Measured length') }} L</th><th>{{ tx('Length difference') }}</th></tr></thead>
            <tbody>
              <tr v-for="(run, i) in runs" :key="i"><td>{{ i + 1 }}</td><td>{{ fmt(run.beta) }} c</td><td>{{ fmt(run.properLength) }} m</td><td>{{ fmt(run.measuredLength) }} m</td><td>{{ fmt(run.properLength - run.measuredLength) }} m</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('mathematicsDisclosure', locale) }}</summary>
      <section aria-labelledby="maths-title" class="card prose">
        <h2 id="maths-title"><span class="step-no">3</span> {{ experimentSectionLabel('mathematics', locale) }}</h2>
        <p>{{ tx('Beginner: the object is not squeezed in its own rest frame. A moving observer measures its length by recording both endpoint positions at one shared time in that observer’s frame.') }}</p>
        <p v-if="intermediate">{{ tx('Intermediate: the Lorentz factor is γ = 1/√(1 − v²/c²). The moving-frame length is L = L₀/γ, where L₀ is the proper length measured in the object’s rest frame.') }}</p>
        <MathFormula v-if="intermediate" tex="\gamma=\frac{1}{\sqrt{1-v^2/c^2}},\qquad L=\frac{L_0}{\gamma}=L_0\sqrt{1-\frac{v^2}{c^2}}" :display="true" />
        <p v-if="advanced">{{ tx('Advanced: the two endpoint events are simultaneous in the measuring frame (Δt = 0), but the inverse Lorentz transformation gives Δt′ = −vL₀/c². Length measurement is frame-dependent because simultaneity is frame-dependent.') }}</p>
        <MathFormula v-if="advanced" tex="\Delta t'=\gamma\left(\Delta t-\frac{v\Delta x}{c^2}\right)=-\frac{vL_0}{c^2}" :display="true" />
        <MathFormula v-if="advanced" tex="\Delta x=L=\frac{L_0}{\gamma},\qquad \Delta x'=L_0" :display="true" />
      </section>
    </details>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('meaningDisclosure', locale) }}</summary>
      <section aria-labelledby="meaning-title" class="card prose">
        <h2 id="meaning-title"><span class="step-no">4</span> {{ experimentSectionLabel('meaning', locale) }}</h2>
        <div class="meaning">
          <InfoCallout kind="physics" :title="experimentSectionLabel('establishedPhysics', locale)">
            <ul>
              <li>{{ tx('The object’s own rest frame measures its proper length L₀.') }}</li>
              <li>{{ tx('In the Earth frame, the two endpoint positions must be recorded simultaneously using synchronized Earth clocks.') }}</li>
              <li>{{ tx('The contraction is along the direction of relative motion; dimensions perpendicular to the motion are unchanged.') }}</li>
              <li>{{ tx('Fast muons created high in the atmosphere reach the ground in large numbers. In the muons’ frame, the atmosphere they cross is contracted; in the Earth frame, their clocks run slow. Both descriptions predict the same count.') }}</li>
            </ul>
          </InfoCallout>
          <InfoCallout kind="interpretation" :title="experimentSectionLabel('interpretation', locale)">
            <ul>
              <li>{{ tx('This is a measurement of endpoint positions, not a photograph. The visual appearance of a fast-moving object also depends on light-travel time and can involve a different optical effect.') }}</li>
              <li>{{ tx('The proper length is the object’s rest-frame length; other frames measure a different length.') }} {{ tx('Is the contraction “real”? Every frame’s measurement is correct for that frame. Some prefer to say the object is four-dimensional and each frame measures a different slice of it.') }}</li>
            </ul>
          </InfoCallout>
        </div>
        <h3>{{ tx('Model assumptions and limits') }}</h3>
        <p>{{ tx('The rod is idealized as having a constant proper length and moving inertially at constant speed. The model treats one-dimensional endpoint positions, synchronized clocks in each inertial frame, and ignores acceleration, rotation, deformation, thickness effects and optical appearance. A perfectly rigid body cannot be accelerated as a whole in special relativity; this experiment considers uniform motion after any acceleration has ended.') }}</p>
        <LocalizedExperimentGuide experiment-id="length-contraction" />
      </section>
    </details>

    <nav class="next card" :aria-label="experimentSectionLabel('nextSteps', locale)">
      <p>{{ tx('Length contraction and time dilation are two consequences of the same Lorentz transformations.') }} {{ tx('Compare both, and the descriptions behind them, in “Different clocks” and “Space and time versus spacetime”.') }}</p>
      <span class="nav-links">
        <RouterLink to="/relativity/moving-clocks">{{ tx('Different clocks, different elapsed times') }}</RouterLink>
        <RouterLink to="/relativity/two-perspectives">{{ tx('Space and time versus spacetime') }}</RouterLink>
        <RouterLink to="/">{{ tx('All modules') }}</RouterLink>
      </span>
    </nav>
  </article>
</template>

<style scoped>
.pending { margin:0; padding:12px 14px; border-left:3px solid var(--accent); border-radius:var(--radius-sm); background:var(--surface-2); }
.pending-text { fill:var(--text-muted); font-size:14px; }
.runs { margin-top:16px; }
.runs-heading { display:flex; align-items:center; justify-content:space-between; gap:8px; }
.runs-heading h3 { margin:0; }
.table-scroll { overflow-x:auto; }
table { width:100%; border-collapse:collapse; font-variant-numeric:tabular-nums; }
th, td { white-space:nowrap; }
.btn-small { min-height:32px; padding:0 10px; font-size:.85rem; }
.experiment-grid { display:grid; grid-template-columns:minmax(0,1.5fr) minmax(260px,1fr); gap:16px; align-items:start; }
.diagram-card,.controls { min-width:0; }
.diagram-heading { display:flex; flex-wrap:wrap; justify-content:space-between; gap:8px; }
.spacetime { display:block; width:100%; height:auto; margin:10px 0 0; overflow:visible; }
.grid line { stroke:var(--border); stroke-width:1; }
.axis line { stroke:var(--text-muted); stroke-width:1.3; }
.tick-labels text { fill:var(--text-muted); font-size:11px; }
.worldline { fill:none; stroke-width:3; }
.worldline.rear { stroke:var(--observer); }
.worldline.front { stroke:var(--accent); }
.earth-slice { stroke:var(--success); stroke-width:4; }
.ship-slice { stroke:var(--warn); stroke-width:2.5; stroke-dasharray:7 5; }
.event { stroke:var(--surface); stroke-width:2; }
.rear-event { fill:var(--observer); }
.front-event { fill:var(--success); }
.ship-event { fill:var(--warn); }
.diagram-legend text { fill:var(--text); font-size:11px; }
.slice-legend { display:flex; flex-wrap:wrap; gap:8px 18px; }
.slice-legend p { display:flex; align-items:center; gap:7px; margin:0; font-size:.84rem; }
.slice-key { display:inline-block; width:20px; height:4px; border-radius:3px; }
.slice-key.earth { background:var(--success); }
.slice-key.ship { height:0; border-top:2px dashed var(--warn); }
.controls { display:grid; align-content:start; gap:18px; }
.controls p { margin:4px 0 0; }
.readouts { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:9px; margin:0; }
.readouts > div { display:grid; gap:3px; padding:10px; background:var(--surface-2); border-radius:var(--radius-sm); }
.readouts span { color:var(--text-muted); font-size:.78rem; }
.readouts strong { font-size:1.05rem; font-variant-numeric:tabular-nums; }
.readouts .measured { border:1px solid var(--accent); }
.readouts .wide { grid-column:1/-1; }
.nav-links { display:flex; flex-wrap:wrap; gap:12px 18px; }
@media(max-width:800px) { .experiment-grid { grid-template-columns:1fr; } }
@media(max-width:480px) { .readouts { grid-template-columns:1fr; } }
</style>
