<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ExperimentSupport from '@/components/ExperimentSupport.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import MathFormula from '@/components/MathFormula.vue'
import PredictionCard from '@/components/PredictionCard.vue'
import ShareExperiment from '@/components/ShareExperiment.vue'
import { useLevel } from '@/composables/useLevel'
import { useQuerySync, snapToRange } from '@/composables/useQuerySync'
import { useLocale } from '@/composables/useLocale'
import { atLeast, isLevel } from '@/levels'
import { localizePredictions } from '@/i18n/experiment-content'
import { getExperimentModuleEyebrow, experimentSectionLabel } from '@/i18n/experiment-metadata'
import { calculateGeodesic, integrationFor, nearCircularShift, newtonianReference, periapsisShiftPerOrbit, type GeodesicRun } from './geodesic'
import { localizeGeodesicText } from './copy'
import { PREDICTIONS, type OrbitRun } from './predictions'

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

// The orbit is integrated only when the student runs the experiment, and
// shown only while the settings still match that run.
interface Integrated { key: string; relativistic: GeodesicRun; newtonian: GeodesicRun; shift: number | null }
const setupKey = computed(() => `${radius.value}|${angular.value}|${radial.value}`)
const latest = ref<Integrated | null>(null)
const shown = computed(() => (latest.value?.key === setupKey.value ? latest.value : null))
const runs = ref<OrbitRun[]>([])

function runExperiment() {
  const settings = { initialRadius: radius.value, angularMomentumFactor: angular.value, radialVelocity: radial.value, ...integrationFor(radius.value) }
  const relativistic = calculateGeodesic(settings)
  const shift = relativistic.captured ? null : periapsisShiftPerOrbit(relativistic)
  latest.value = { key: setupKey.value, relativistic, newtonian: newtonianReference(settings), shift }
  runs.value = [...runs.value, {
    radius: radius.value, angular: angular.value, radialVelocity: radial.value,
    captured: relativistic.captured, periapses: relativistic.periapses, shiftPerOrbit: shift,
  }]
}

const predictions = computed(() => localizePredictions('geodesic-motion', PREDICTIONS, locale.value).filter((p) => atLeast(level.value, p.minLevel)))
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed(runs.value)])))
const hints = computed(() => Object.fromEntries(PREDICTIONS.map((p) => {
  const hint = p.hint?.(runs.value) ?? null
  return [p.id, hint === null ? null : tx(hint)]
})))

const intermediate = computed(() => atLeast(level.value, 'intermediate'))
const advanced = computed(() => atLeast(level.value, 'advanced'))
const bounds = 14
const px = (x: number) => 300 + x / bounds * 270
const py = (y: number) => 205 - y / bounds * 185
const pathFor = (points: { x: number; y: number }[]) => points.map((p, i) => (i ? 'L ' : 'M ') + px(p.x).toFixed(2) + ' ' + py(p.y).toFixed(2)).join(' ')
const relativisticPath = computed(() => (shown.value ? pathFor(shown.value.relativistic.points) : ''))
const newtonianPath = computed(() => (shown.value ? pathFor(shown.value.newtonian.points) : ''))
const minRadius = computed(() => (shown.value ? Math.min(...shown.value.relativistic.points.map(p => p.radius)) : 0))
const deg = (value: number) => `${value.toFixed(1)}°`
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
      <p class="muted">{{ tx('Commit to an answer first. Each explanation unlocks only after you have run the orbit that tests it.') }}</p>
      <div class="prediction-grid">
        <PredictionCard v-for="(p, i) in predictions" :key="p.id" :prediction="p" :observed="observed[p.id] ?? false" :hint="hints[p.id]" :index="i + 1" />
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
              <circle v-for="r in [3, 6, 9, 12]" :key="r" cx="300" cy="205" :r="r / bounds * 270" />
              <line x1="30" y1="205" x2="570" y2="205" /><line x1="300" y1="20" x2="300" y2="390" />
            </g>
            <circle class="central-mass" cx="300" cy="205" r="11" />
            <circle class="horizon" cx="300" cy="205" :r="270 / bounds" />
            <g v-if="shown" clip-path="url(#geodesic-plot)">
              <path class="orbit-newton" :d="newtonianPath" />
              <path class="orbit-gr" :d="relativisticPath" />
            </g>
            <text v-else class="pending-text" x="300" y="45" text-anchor="middle">{{ tx('Run the experiment to integrate the orbit.') }}</text>
            <circle class="start-marker" :cx="px(radius)" :cy="py(0)" r="4" />
          </svg>
          <div class="orbit-legend">
            <span><i class="legend-gr"></i>{{ tx('Relativistic geodesic') }}</span>
            <span><i class="legend-newton"></i>{{ tx('Newtonian reference') }}</span>
            <span><i class="legend-horizon"></i>{{ tx('Schwarzschild radius') }}</span>
          </div>
          <div v-if="shown" class="readouts" aria-live="polite">
            <div><span>{{ tx('Closest approach') }}</span><strong>{{ minRadius.toFixed(2) }} rₛ</strong></div>
            <div><span>{{ tx('Periapsis passages') }}</span><strong>{{ shown.relativistic.periapses }}</strong></div>
            <div v-if="shown.relativistic.captured" class="wide"><span>{{ tx('Outcome') }}</span><strong>{{ tx('Captured: the spacecraft crossed the horizon.') }}</strong></div>
            <div v-if="intermediate && !shown.relativistic.captured"><span>{{ tx('Periapsis shift per orbit') }}</span><strong>{{ shown.shift === null ? '—' : deg(shown.shift) }}</strong></div>
            <div v-if="advanced && !shown.relativistic.captured"><span>{{ tx('Near-circular estimate') }}</span><strong>{{ radius > 3 ? deg(nearCircularShift(radius)) : '—' }}</strong></div>
          </div>
          <p v-else class="pending">{{ tx('Run the experiment to see the relativistic path and the Newtonian reference.') }}</p>
          <p class="small muted">{{ tx('The trajectory is not a force diagram. It is the path followed by a freely falling test particle through the chosen spacetime geometry.') }}</p>
        </div>
        <aside class="card controls">
          <label class="control-label" for="geodesic-radius"><span>{{ tx('Initial orbital radius') }}</span><strong>{{ radius.toFixed(1) }} rₛ</strong></label>
          <input id="geodesic-radius" v-model.number="radius" type="range" v-bind="RADIUS" />
          <label class="control-label" for="geodesic-angular"><span>{{ tx('Angular momentum') }}</span><strong>{{ angular.toFixed(3) }} {{ tx('× L circular') }}</strong></label>
          <input id="geodesic-angular" v-model.number="angular" type="range" v-bind="ANGULAR" />
          <label class="control-label" for="geodesic-radial"><span>{{ tx('Initial radial velocity') }}</span><strong>dr/dτ = {{ radial.toFixed(3) }}</strong></label>
          <input id="geodesic-radial" v-model.number="radial" type="range" v-bind="RADIAL" />
          <button class="btn btn-primary" type="button" @click="runExperiment">{{ tx('Run the experiment') }}</button>
          <p class="small muted">{{ tx('Schwarzschild radii') }}: rₛ = 2GM/c²</p>
        </aside>
      </div>
      <div v-if="runs.length && intermediate" class="card runs">
        <div class="runs-heading"><h3>{{ tx('Recorded orbits') }}</h3><button class="btn btn-small" type="button" @click="runs = []; latest = null">{{ tx('Clear orbits') }}</button></div>
        <div class="table-scroll">
          <table>
            <thead><tr><th>#</th><th>{{ tx('Initial orbital radius') }}</th><th>{{ tx('Angular momentum') }}</th><th>{{ tx('Initial radial velocity') }}</th><th>{{ tx('Periapsis shift per orbit') }}</th></tr></thead>
            <tbody>
              <tr v-for="(run, i) in runs" :key="i">
                <td>{{ i + 1 }}</td><td>{{ run.radius.toFixed(1) }} rₛ</td><td>{{ run.angular.toFixed(3) }}</td><td>{{ run.radialVelocity.toFixed(3) }}</td>
                <td>{{ run.captured ? tx('Captured') : run.shiftPerOrbit === null ? '—' : deg(run.shiftPerOrbit) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('mathematicsDisclosure', locale) }}</summary>
      <section aria-labelledby="maths-title" class="card prose">
        <h2 id="maths-title"><span class="step-no">3</span> {{ experimentSectionLabel('mathematics', locale) }}</h2>
        <h3>{{ tx('What is a geodesic?') }}</h3>
        <p>{{ tx('A geodesic is the locally straightest possible path through spacetime. A freely falling object follows one when no non-gravitational force acts on it.') }}</p>
        <p>{{ tx('Newtonian gravity predicts a closed ellipse for an ideal two-body orbit. In Schwarzschild spacetime, the orbit generally precesses; the perihelion advances after each revolution.') }}</p>
        <template v-if="intermediate">
          <h3>{{ tx('The Schwarzschild geodesic equation') }}</h3>
          <MathFormula display tex="\begin{gathered} \frac{d^2 r}{d\tau^2}=-\frac{1}{2r^2}+\frac{L^2}{r^3}-\frac{3L^2}{2r^4} \\ \frac{d\phi}{d\tau}=\frac{L}{r^2} \end{gathered}" />
          <p>{{ tx('For a circular orbit the angular momentum is fixed by the radius. A small change from that value produces a bound orbit whose closest-approach direction slowly rotates in general relativity.') }}</p>
          <MathFormula display tex="L_{\rm circ}=\frac{r}{\sqrt{2r-3}}" />
          <p>{{ tx('For nearly circular orbits, the periapsis advances per orbit by') }}</p>
          <MathFormula display tex="\Delta\phi \approx 2\pi\left(\frac{1}{\sqrt{1-3r_s/r}}-1\right)" />
        </template>
        <template v-if="advanced">
          <h3>{{ tx('Newtonian limit') }}</h3>
          <p>{{ tx('The Newtonian limit is recovered far from the mass, where the relativistic correction becomes small.') }}</p>
          <MathFormula display tex="\ddot r_{\rm GR}=\ddot r_{\rm Newton}-\frac{3L^2}{2r^4}, \qquad \Delta\phi \approx \frac{3\pi r_s}{r} \;\; (r \gg r_s)" />
        </template>
      </section>
    </details>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('meaningDisclosure', locale) }}</summary>
      <section aria-labelledby="meaning-title" class="card prose">
        <h2 id="meaning-title"><span class="step-no">4</span> {{ experimentSectionLabel('meaning', locale) }}</h2>
        <div class="meaning">
          <InfoCallout kind="physics" :title="experimentSectionLabel('establishedPhysics', locale)">
            <ul>
              <li>{{ tx('The Newtonian limit is recovered far from the mass, where the relativistic correction becomes small.') }}</li>
              <li>{{ tx('Mercury’s periapsis advances by 43 arcseconds per century more than Newtonian gravity predicts; general relativity accounts for it. Much larger shifts are measured in binary pulsars, and stars orbiting the black hole at the centre of our galaxy show the same effect.') }}</li>
            </ul>
          </InfoCallout>
          <InfoCallout kind="interpretation" :title="experimentSectionLabel('interpretation', locale)">
            <ul>
              <li>
                <strong>{{ tx('Is gravity a force?') }}</strong>
                {{ tx('In general relativity a freely falling object feels no force: it follows the straightest path the geometry allows. Some physicists describe gravity as curvature rather than a force; others treat the geometric picture as one useful formulation among several. All of them make the same predictions for orbits.') }}
              </li>
            </ul>
          </InfoCallout>
        </div>
        <h3>{{ tx('What this model assumes') }}</h3>
        <p>{{ tx('The model describes a test particle in the vacuum exterior of a static, spherical, non-rotating mass (Schwarzschild geometry). It uses an equatorial timelike geodesic and ignores the particle’s back-reaction, radiation, other bodies, spin, and the interior of the mass.') }}</p>
        <p>{{ tx('The plotted Newtonian curve is a comparison model with the same initial radius, radial velocity and angular momentum; it is not a second relativistic observer.') }}</p>
        <p>{{ tx('The Schwarzschild radius is a horizon, not a solid surface. The exterior-coordinate model is not continued through it.') }}</p>
      </section>
    </details>

    <nav class="next card" :aria-label="experimentSectionLabel('nextSteps', locale)">
      <p>{{ tx('Next: “Evolving space” scales up from one mass to the whole universe, where space itself evolves.') }}</p>
      <span class="nav-links">
        <RouterLink to="/gravity/clock-rates">{{ tx('Gravity and clock rates') }}</RouterLink>
        <RouterLink to="/cosmology/evolving-space">{{ tx('Evolving space') }}</RouterLink>
        <RouterLink to="/">{{ tx('All modules') }}</RouterLink>
      </span>
    </nav>
  </article>
</template>

<style scoped>
.experiment-grid { display:grid; grid-template-columns:minmax(0,1.65fr) minmax(230px,.75fr); gap:16px; align-items:start; }
.orbit-card svg { display:block; width:100%; max-height:460px; margin-top:12px; }
.orbit-grid circle,.orbit-grid line { fill:none; stroke:var(--border); stroke-width:1; }
.central-mass { fill:var(--text); }
.horizon { fill:var(--bg); stroke:var(--text-muted); stroke-dasharray:4 4; stroke-width:1.5; }
.orbit-newton,.orbit-gr { fill:none; stroke-width:2.4; stroke-linecap:round; stroke-linejoin:round; }
.orbit-newton { stroke:var(--text-muted); stroke-dasharray:5 4; }
.orbit-gr { stroke:var(--accent); }
.start-marker { fill:var(--accent); stroke:var(--bg); stroke-width:2; }
.pending-text { fill:var(--text-muted); font-size:14px; }
.pending { margin:14px 0; padding:12px 14px; border-left:3px solid var(--accent); border-radius:var(--radius-sm); background:var(--surface-2); }
.orbit-legend { display:flex; flex-wrap:wrap; gap:12px; font-size:.78rem; color:var(--text-muted); }
.orbit-legend span { display:flex; align-items:center; gap:6px; }
.orbit-legend i { display:inline-block; width:20px; border-top:2px solid var(--accent); }
.orbit-legend .legend-newton { border-color:var(--text-muted); border-top-style:dashed; }
.orbit-legend .legend-horizon { border-color:var(--text-muted); border-top-style:dotted; }
.readouts { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin:14px 0; }
.readouts div { padding:10px; border-radius:8px; background:var(--surface-2); }
.readouts .wide { grid-column:1/-1; }
.readouts span,.readouts strong { display:block; }
.readouts span { color:var(--text-muted); font-size:.78rem; }
.readouts strong { margin-top:4px; font-variant-numeric:tabular-nums; }
.controls { display:grid; gap:10px; }
.control-label { display:flex; justify-content:space-between; gap:8px; font-size:.86rem; }
.control-label strong { font-variant-numeric:tabular-nums; }
.controls input[type=range] { width:100%; accent-color:var(--accent); }
.controls button { margin-top:8px; }
.runs { margin-top:16px; }
.runs-heading { display:flex; align-items:center; justify-content:space-between; gap:8px; }
.runs-heading h3 { margin:0; }
.table-scroll { overflow-x:auto; }
table { width:100%; border-collapse:collapse; font-variant-numeric:tabular-nums; }
th, td { white-space:nowrap; }
.btn-small { min-height:32px; padding:0 10px; font-size:.85rem; }
.small { font-size:.85rem; margin:0; }
.nav-links { display:inline-flex; flex-wrap:wrap; gap:16px; }
@media(max-width:760px) { .experiment-grid { grid-template-columns:1fr; } }
</style>
