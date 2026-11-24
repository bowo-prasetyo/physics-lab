<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ExperimentSupport from '@/components/ExperimentSupport.vue'
import ShareExperiment from '@/components/ShareExperiment.vue'
import MathFormula from '@/components/MathFormula.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import { useLevel } from '@/composables/useLevel'
import { useQuerySync, snapToRange } from '@/composables/useQuerySync'
import { useLocale } from '@/composables/useLocale'
import { atLeast, isLevel } from '@/levels'
import { getExperimentModuleEyebrow, experimentSectionLabel } from '@/i18n/experiment-metadata'
import { calculateGeodesic, newtonianReference } from './geodesic'
import { getGeodesicMotionDocumentTitle, localizeGeodesicText } from './copy'

const route = useRoute()
const level = useLevel()
const { locale } = useLocale()
const tx = (value: string) => localizeGeodesicText(value, locale.value)
const RADIUS = { min: 3.2, max: 12, step: 0.1 }
const ANGULAR = { min: 0.94, max: 1.04, step: 0.005 }
const RADIAL = { min: -0.035, max: 0.035, step: 0.001 }
const radius = ref(snapToRange(route.query.r, RADIUS, 8))
const angular = ref(snapToRange(route.query.l, ANGULAR, 0.985))
const radial = ref(snapToRange(route.query.vr, RADIAL, 0))
if (isLevel(route.query.level)) level.value = route.query.level
useQuerySync({
  sources: [radius, angular, radial, level],
  write: () => ({ level: level.value, r: radius.value.toFixed(1), l: angular.value.toFixed(3), vr: radial.value.toFixed(3) }),
  read: query => {
    if (isLevel(query.level)) level.value = query.level
    radius.value = snapToRange(query.r, RADIUS, radius.value)
    angular.value = snapToRange(query.l, ANGULAR, angular.value)
    radial.value = snapToRange(query.vr, RADIAL, radial.value)
  },
})
const settings = computed(() => ({ initialRadius: radius.value, angularMomentumFactor: angular.value, radialVelocity: radial.value, steps: 24000, stepSize: 0.025 }))
const relativistic = computed(() => calculateGeodesic(settings.value))
const newtonian = computed(() => newtonianReference(settings.value))
const tested = ref(false)
const prediction = ref<'circle' | 'precess' | 'spiral' | null>(null)
const correctPrediction = computed(() => angular.value === 1 && radial.value === 0 ? 'circle' : 'precess')
const predictionMatches = computed(() => prediction.value === correctPrediction.value)
const advanced = computed(() => atLeast(level.value, 'advanced'))
const bounds = 14
const px = (x: number) => 300 + x / bounds * 270
const py = (y: number) => 205 - y / bounds * 185
const pathFor = (points: {x:number;y:number}[]) => points.map((p,i) => (i ? 'L ' : 'M ') + px(p.x).toFixed(2) + ' ' + py(p.y).toFixed(2)).join(' ')
const relativisticPath = computed(() => pathFor(relativistic.value.points))
const newtonianPath = computed(() => pathFor(newtonian.value.points))
const minRadius = computed(() => Math.min(...relativistic.value.points.map(p => p.radius)))
const periapsisText = computed(() => String(relativistic.value.periapses))
watch([radius, angular, radial], () => { prediction.value = null; tested.value = false })
watch(locale, () => { if (route.name === 'geodesic-motion') document.title = getGeodesicMotionDocumentTitle(locale.value) })
</script>

<template>
  <article class="lesson container geodesic-lab">
    <header class="lesson-head">
      <p class="eyebrow">{{ getExperimentModuleEyebrow('geodesic-motion', locale) }}</p>
      <h1>{{ tx('Geodesic Motion Lab: falling through curved spacetime') }}</h1>
      <p class="lead">{{ tx('An orbiting spacecraft is in free fall. Change its orbit and compare the path predicted by Newtonian gravity with the path of a freely moving object in Schwarzschild spacetime.') }}</p>
    </header>
    <ShareExperiment />
    <ExperimentSupport
      experiment-id="geodesic-motion"
      :module-number="5"
      focus="A freely falling test particle follows a timelike geodesic in the chosen spacetime geometry."
      prompt="Why can a freely falling object follow a curved orbit without a local gravitational force pushing it sideways?"
      action="Predict the orbit, vary angular momentum and initial radial velocity, then compare the Schwarzschild path with the Newtonian reference."
      reflect="What changes when the same initial conditions are evolved in curved spacetime rather than Newtonian gravity?"
    />
    <section aria-labelledby="predict-title">
      <h2 id="predict-title"><span class="step-no">1</span> {{ experimentSectionLabel('predict', locale) }}</h2>
      <div class="card prediction">
        <p>{{ tx('If the spacecraft starts close to a circular orbit but its angular momentum is changed slightly, what happens after several revolutions?') }}</p>
        <fieldset>
          <legend>{{ tx('Predict the shape of the relativistic path.') }}</legend>
          <label><input v-model="prediction" type="radio" name="geodesic-prediction" value="circle" /> {{ tx('A circular orbit') }}</label>
          <label><input v-model="prediction" type="radio" name="geodesic-prediction" value="precess" /> {{ tx('A slowly precessing ellipse') }}</label>
          <label><input v-model="prediction" type="radio" name="geodesic-prediction" value="spiral" /> {{ tx('A rapidly changing spiral') }}</label>
        </fieldset>
        <p v-if="tested && prediction" class="verdict" role="status">{{ predictionMatches ? tx('Your prediction matches the result.') : tx('The relativistic path precesses: each closest approach shifts slightly.') }}</p>
        <p v-else class="muted small">{{ tx('Predict the orbit before changing the parameters.') }}</p>
      </div>
    </section>
    <section aria-labelledby="experiment-title">
      <h2 id="experiment-title"><span class="step-no">2</span> {{ experimentSectionLabel('experiment', locale) }}</h2>
      <div class="experiment-grid">
        <div class="card orbit-card">
          <strong>{{ tx('Relativistic geodesic') }} / {{ tx('Newtonian reference') }}</strong>
          <svg viewBox="0 0 600 420" role="img" :aria-label="tx('Relativistic geodesic') + ' / ' + tx('Newtonian reference')">
            <defs><clipPath id="geodesic-plot"><rect x="20" y="18" width="560" height="374" rx="8" /></clipPath></defs>
            <g class="orbit-grid">
              <circle v-for="r in [3,6,9,12]" :key="r" cx="300" cy="205" :r="r / bounds * 270" />
              <line x1="30" y1="205" x2="570" y2="205" /><line x1="300" y1="20" x2="300" y2="390" />
            </g>
            <circle class="central-mass" cx="300" cy="205" r="11" />
            <circle class="horizon" cx="300" cy="205" :r="270 / bounds" />
            <g clip-path="url(#geodesic-plot)">
              <path class="orbit-newton" :d="newtonianPath" />
              <path class="orbit-gr" :d="relativisticPath" />
            </g>
            <circle class="start-marker" :cx="px(radius)" :cy="py(0)" r="4" />
          </svg>
          <div class="orbit-legend">
            <span><i class="legend-gr"></i>{{ tx('Relativistic geodesic') }}</span>
            <span><i class="legend-newton"></i>{{ tx('Newtonian reference') }}</span>
            <span><i class="legend-horizon"></i>{{ tx('Schwarzschild radius') }}</span>
          </div>
          <div class="readouts">
            <div><span>{{ tx('Closest approach') }}</span><strong>{{ minRadius.toFixed(2) }} rₛ</strong></div>
            <div><span>{{ tx('Periapsis passages') }}</span><strong>{{ periapsisText }}</strong></div>
          </div>
          <p class="small muted">{{ tx('The trajectory is not a force diagram. It is the path followed by a freely falling test particle through the chosen spacetime geometry.') }}</p>
        </div>
        <aside class="card controls">
          <label class="control-label"><span>{{ tx('Initial orbital radius') }}</span><strong>{{ radius.toFixed(1) }} rₛ</strong></label>
          <input v-model.number="radius" type="range" v-bind="RADIUS" :aria-label="tx('Initial orbital radius')" />
          <label class="control-label"><span>{{ tx('Angular momentum') }}</span><strong>{{ angular.toFixed(3) }} × L circular</strong></label>
          <input v-model.number="angular" type="range" v-bind="ANGULAR" :aria-label="tx('Angular momentum')" />
          <label class="control-label"><span>{{ tx('Initial radial velocity') }}</span><strong>dr/dτ = {{ radial.toFixed(3) }}</strong></label>
          <input v-model.number="radial" type="range" v-bind="RADIAL" :aria-label="tx('Initial radial velocity')" />
          <button class="btn btn-primary" type="button" :disabled="!prediction" @click="tested = true">{{ tx('Run the experiment') }}</button>
          <p class="small muted">{{ tx('Schwarzschild radii') }}: rₛ = 2GM/c²</p>
        </aside>
      </div>
    </section>
    <section aria-labelledby="math-title">
      <h2 id="math-title"><span class="step-no">3</span> {{ experimentSectionLabel('mathematics', locale) }}</h2>
      <div class="card math-panel">
        <InfoCallout kind="note" :title="tx('What this model assumes')">
          <p>{{ tx('The model describes a test particle in the vacuum exterior of a static, spherical, non-rotating mass (Schwarzschild geometry). It uses an equatorial timelike geodesic and ignores the particle’s back-reaction, radiation, other bodies, spin, and the interior of the mass.') }}</p>
          <p>{{ tx('The plotted Newtonian curve is a comparison model with the same initial radius, radial velocity and angular momentum; it is not a second relativistic observer.') }}</p>
          <p>{{ tx('The Schwarzschild radius is a horizon, not a solid surface. The exterior-coordinate model is not continued through it.') }}</p>
        </InfoCallout>
        <template v-if="level === 'beginner'">
          <h3>{{ tx('What is a geodesic?') }}</h3>
          <p>{{ tx('A geodesic is the locally straightest possible path through spacetime. A freely falling object follows one when no non-gravitational force acts on it.') }}</p>
          <p>{{ tx('Newtonian gravity predicts a closed ellipse for an ideal two-body orbit. In Schwarzschild spacetime, the orbit generally precesses; the perihelion advances after each revolution.') }}</p>
        </template>
        <template v-else>
          <h3>{{ tx('The Schwarzschild geodesic equation') }}</h3>
          <MathFormula display tex="\frac{d^2 r}{d\tau^2}=-\frac{1}{2r^2}+\frac{L^2}{r^3}-\frac{3L^2}{2r^4},\qquad \frac{d\phi}{d\tau}=\frac{L}{r^2}" />
          <p>{{ tx('For a circular orbit the angular momentum is fixed by the radius. A small change from that value produces a bound orbit whose closest-approach direction slowly rotates in general relativity.') }}</p>
          <MathFormula display tex="L_{\rm circ}=\frac{r}{\sqrt{2r-3}}" />
          <template v-if="advanced">
            <h3>{{ tx('Newtonian limit') }}</h3>
            <p>{{ tx('The Newtonian limit is recovered far from the mass, where the relativistic correction becomes small.') }}</p>
            <MathFormula display tex="\ddot r_{\rm GR}=\ddot r_{\rm Newton}-\frac{3L^2}{2r^4}" />
          </template>
        </template>
      </div>
    </section>
    <section aria-labelledby="meaning-title">
      <h2 id="meaning-title"><span class="step-no">4</span> {{ experimentSectionLabel('meaning', locale) }}</h2>
      <div class="card">
        <h3>{{ tx('Key idea') }}</h3>
        <p>{{ tx('A geodesic is the locally straightest possible path through spacetime. A freely falling object follows one when no non-gravitational force acts on it.') }}</p>
        <p>{{ tx('Newtonian gravity predicts a closed ellipse for an ideal two-body orbit. In Schwarzschild spacetime, the orbit generally precesses; the perihelion advances after each revolution.') }}</p>
        <p>{{ tx('The Newtonian limit is recovered far from the mass, where the relativistic correction becomes small.') }}</p>
      </div>
    </section>
  </article>
</template>

<style scoped>
.geodesic-lab .prediction fieldset { display:grid; gap:9px; margin:14px 0 8px; padding:0; border:0; }
.geodesic-lab .prediction label { display:flex; align-items:center; gap:9px; }
.experiment-grid { display:grid; grid-template-columns:minmax(0,1.65fr) minmax(230px,.75fr); gap:16px; align-items:start; }
.orbit-card svg { display:block; width:100%; max-height:460px; margin-top:12px; }
.orbit-grid circle,.orbit-grid line { fill:none; stroke:var(--border); stroke-width:1; }
.central-mass { fill:var(--text); }
.horizon { fill:var(--bg); stroke:var(--text-muted); stroke-dasharray:4 4; stroke-width:1.5; }
.orbit-newton,.orbit-gr { fill:none; stroke-width:2.4; stroke-linecap:round; stroke-linejoin:round; }
.orbit-newton { stroke:var(--text-muted); stroke-dasharray:5 4; }
.orbit-gr { stroke:var(--accent); }
.start-marker { fill:var(--accent); stroke:var(--bg); stroke-width:2; }
.orbit-legend { display:flex; flex-wrap:wrap; gap:12px; font-size:.78rem; color:var(--text-muted); }
.orbit-legend span { display:flex; align-items:center; gap:6px; }
.orbit-legend i { display:inline-block; width:20px; border-top:2px solid var(--accent); }
.orbit-legend .legend-newton { border-color:var(--text-muted); border-top-style:dashed; }
.orbit-legend .legend-horizon { border-color:var(--text-muted); border-top-style:dotted; }
.readouts { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin:14px 0; }
.readouts div { padding:10px; border-radius:8px; background:var(--surface-2); }
.readouts span,.readouts strong { display:block; }
.readouts span { color:var(--text-muted); font-size:.78rem; }
.readouts strong { margin-top:4px; font-variant-numeric:tabular-nums; }
.controls { display:grid; gap:10px; }
.control-label { display:flex; justify-content:space-between; gap:8px; font-size:.86rem; }
.control-label strong { font-variant-numeric:tabular-nums; }
.controls input[type=range] { width:100%; accent-color:var(--accent); }
.controls button { margin-top:8px; }
.math-panel { display:grid; gap:12px; }
@media(max-width:760px) { .experiment-grid { grid-template-columns:1fr; } }
</style>
