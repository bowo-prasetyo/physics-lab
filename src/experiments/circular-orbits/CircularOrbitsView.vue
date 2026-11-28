<script setup lang="ts">
import { fixed } from '@/i18n/formatters'
import { computed, ref, useId } from 'vue'
import { useRoute } from 'vue-router'
import ExperimentSupport from '@/components/ExperimentSupport.vue'
import ConceptBridge from '@/components/ConceptBridge.vue'
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
import {
  EARTH_GM, EARTH_RADIUS, centripetalAcceleration, escapeSpeed, gravitationalAcceleration, launchOrbit, orbitEnergyAt,
  type OrbitOutcome, type OrbitResult,
} from '@/physics'
import { localizeCircularOrbitsText } from './copy'
import { PREDICTIONS, type LaunchRun } from './predictions'

const route = useRoute()
const level = useLevel()
const { locale } = useLocale()
const id = useId()
const tx = (value: string) => localizeCircularOrbitsText(value, locale.value)

/** Launch distance from the Earth's centre, in Earth radii. */
const RADIUS = { min: 1.1, max: 6, step: 0.1 }
/** Launch speed as a multiple of the circular speed. */
const SPEED = { min: 0.6, max: 1.5, step: 0.01 }
const radius = ref(snapToRange(route.query.r, RADIUS, 2))
const speedFactor = ref(snapToRange(route.query.f, SPEED, 1))
if (isLevel(route.query.level)) level.value = route.query.level
useQuerySync({
  sources: [radius, speedFactor, level],
  write: () => ({ level: level.value, r: radius.value.toFixed(1), f: speedFactor.value.toFixed(2) }),
  read: (query) => {
    if (isLevel(query.level)) level.value = query.level
    radius.value = snapToRange(query.r, RADIUS, radius.value)
    speedFactor.value = snapToRange(query.f, SPEED, speedFactor.value)
  },
})

// The path is calculated only when the learner launches, and shown only while the settings still match that launch.
const VIEW = 2.7 // the plot shows out to 2.7 × the launch radius
const setupKey = computed(() => `${radius.value}|${speedFactor.value}`)
const latest = ref<{ key: string; radius: number; orbit: OrbitResult } | null>(null)
const shown = computed(() => (latest.value?.key === setupKey.value ? latest.value : null))
const runs = ref<LaunchRun[]>([])

function launch(): void {
  const r = radius.value * EARTH_RADIUS
  const orbit = launchOrbit({ gm: EARTH_GM, planetRadius: EARTH_RADIUS, radius: r, speedFactor: speedFactor.value }, r * VIEW * 1.5, 720)
  latest.value = { key: setupKey.value, radius: radius.value, orbit }
  runs.value = [...runs.value, { radius: radius.value, speedFactor: speedFactor.value, outcome: orbit.outcome, period: orbit.period }]
}

const predictions = computed(() => localizePredictions('circular-orbits', PREDICTIONS, locale.value).filter((p) => atLeast(level.value, p.minLevel)))
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed(runs.value)])))
const hints = computed(() => Object.fromEntries(PREDICTIONS.map((p) => {
  const hint = p.hint?.(runs.value) ?? null
  return [p.id, hint === null ? null : tx(hint)]
})))

const intermediate = computed(() => atLeast(level.value, 'intermediate'))
const advanced = computed(() => atLeast(level.value, 'advanced'))

// Plot: the launch radius sits at 1/VIEW of the plot radius, so ellipses up to 2.7 × farther fit.
const CX = 300
const CY = 210
const PLOT = 195
const scale = computed(() => PLOT / (radius.value * EARTH_RADIUS * VIEW))
const px = (x: number) => CX + x * scale.value
const py = (y: number) => CY - y * scale.value
const pathD = computed(() => (shown.value ? shown.value.orbit.points.map((p, i) => `${i ? 'L' : 'M'} ${px(p.x).toFixed(1)} ${py(p.y).toFixed(1)}`).join(' ') + (shown.value.orbit.outcome === 'circle' || shown.value.orbit.outcome === 'ellipse' ? ' Z' : '') : ''))
const earthR = computed(() => EARTH_RADIUS * scale.value)
const launchX = computed(() => px(radius.value * EARTH_RADIUS))
const velocityLength = computed(() => 46 * speedFactor.value)

const OUTCOME_TEXT: Record<OrbitOutcome, string> = {
  circle: 'Circular orbit',
  ellipse: 'Elliptical orbit',
  escape: 'Escapes: it never comes back',
  crash: 'Crashes: the path meets the Earth’s surface',
}
const km = (metres: number) => `${fixed(metres / 1000, 2)} km/s`
const earthRadii = (metres: number) => `${fixed(metres / EARTH_RADIUS, 2)} R⊕`
const hours = (seconds: number | null | undefined) => (seconds == null ? '—' : `${fixed(seconds / 3600, 2)} h`)
const needed = computed(() => (shown.value ? centripetalAcceleration(shown.value.orbit.speed, shown.value.radius * EARTH_RADIUS) : 0))
const gravity = computed(() => (shown.value ? gravitationalAcceleration(EARTH_GM, shown.value.radius * EARTH_RADIUS) : 0))
// Energy per kilogram at the closest and (for bound orbits) farthest points: the total is the same at both.
const energyPoints = computed(() => {
  const s = shown.value
  if (!s || s.orbit.outcome === 'crash') return null
  const closest = orbitEnergyAt(EARTH_GM, s.orbit.minRadius, s.orbit.energy)
  const farthest = Number.isFinite(s.orbit.maxRadius) ? orbitEnergyAt(EARTH_GM, s.orbit.maxRadius, s.orbit.energy) : null
  return { closest, farthest }
})
const mj = (joulesPerKg: number) => fixed(joulesPerKg / 1e6, 2)
</script>

<template>
  <article class="lesson container orbits-lab">
    <header class="lesson-head">
      <p class="eyebrow">{{ getExperimentModuleEyebrow('circular-orbits', locale) }}</p>
      <h1>{{ tx('Circular motion and orbits: Newton’s cannonball') }}</h1>
      <p class="lead">{{ tx('Launch a satellite sideways from above the Earth. Too slow and it falls back; fast enough and it keeps falling round the planet. Find the speed for a circle, and see what gravity has to do to keep it there.') }}</p>
    </header>

    <ShareExperiment />

    <ExperimentSupport
      experiment-id="circular-orbits"
      :module-number="3"
      focus="Moving in a circle needs a net force towards the centre, m v²/r. For an orbit, gravity provides it."
      prompt="If a satellite moves at constant speed, why does it need a force at all, and which way must that force point?"
      action="Predict the path, launch at different speeds and heights, and compare the acceleration a circle needs with the acceleration gravity provides."
      reflect="What decides whether a launch gives a circle, an ellipse, an escape or a crash?"
    />

    <section aria-labelledby="predict-title">
      <h2 id="predict-title"><span class="step-no">1</span> {{ experimentSectionLabel('predict', locale) }}</h2>
      <p class="muted">{{ tx('Commit to an answer first. Each explanation unlocks only after you have made the launch that tests it.') }}</p>
      <div class="prediction-grid">
        <PredictionCard v-for="(p, i) in predictions" :key="p.id" :prediction="p" :observed="observed[p.id] ?? false" :hint="hints[p.id]" :index="i + 1" />
      </div>
    </section>

    <section aria-labelledby="experiment-title">
      <h2 id="experiment-title"><span class="step-no">2</span> {{ experimentSectionLabel('experiment', locale) }}</h2>
      <div class="experiment-grid">
        <div class="card orbit-card">
          <strong>{{ tx('Orbit around the Earth') }}</strong>
          <svg viewBox="0 0 600 420" role="img" :aria-label="shown ? `${tx('Orbit around the Earth')}: ${tx(OUTCOME_TEXT[shown.orbit.outcome])}` : tx('Orbit around the Earth')">
            <defs>
              <clipPath :id="`${id}-plot`"><rect x="10" y="10" width="580" height="400" rx="8" /></clipPath>
              <marker :id="`${id}-arrow-v`" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="arrow-v-head" /></marker>
              <marker :id="`${id}-arrow-f`" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="arrow-f-head" /></marker>
            </defs>
            <circle class="earth" :cx="CX" :cy="CY" :r="earthR" />
            <circle class="launch-ring" :cx="CX" :cy="CY" :r="launchX - CX" />
            <g v-if="shown" :clip-path="`url(#${id}-plot)`">
              <path class="orbit-path" :d="pathD" />
            </g>
            <text v-else class="pending-text" :x="CX" y="34" text-anchor="middle">{{ tx('Launch the satellite to see its path.') }}</text>
            <line class="arrow-f" :x1="launchX" :y1="CY" :x2="launchX - 52" :y2="CY" :marker-end="`url(#${id}-arrow-f)`" />
            <line class="arrow-v" :x1="launchX" :y1="CY" :x2="launchX" :y2="CY - velocityLength" :marker-end="`url(#${id}-arrow-v)`" />
            <circle class="satellite" :cx="launchX" :cy="CY" r="5" />
          </svg>
          <div class="orbit-legend">
            <span><i class="legend-path"></i>{{ tx('Path') }}</span>
            <span><i class="legend-v"></i>{{ tx('Velocity at launch') }}</span>
            <span><i class="legend-f"></i>{{ tx('Net force: gravity, towards the centre') }}</span>
          </div>
          <div v-if="shown" class="readouts" aria-live="polite">
            <div class="wide"><span>{{ tx('Outcome') }}</span><strong>{{ tx(OUTCOME_TEXT[shown.orbit.outcome]) }}</strong></div>
            <div><span>{{ tx('Acceleration a circle needs, v²/r') }}</span><strong>{{ fixed(needed, 2) }} m/s²</strong></div>
            <div><span>{{ tx('Gravity’s acceleration here, GM/r²') }}</span><strong>{{ fixed(gravity, 2) }} m/s²</strong></div>
            <div><span>{{ tx('Launch speed') }}</span><strong>{{ km(shown.orbit.speed) }}</strong></div>
            <div><span>{{ tx('Period') }}</span><strong>{{ hours(shown.orbit.period) }}</strong></div>
            <template v-if="intermediate">
              <div><span>{{ tx('Circular speed here') }}</span><strong>{{ km(shown.orbit.circularSpeed) }}</strong></div>
              <div><span>{{ tx('Closest distance') }}</span><strong>{{ earthRadii(shown.orbit.minRadius) }}</strong></div>
              <div><span>{{ tx('Farthest distance') }}</span><strong>{{ Number.isFinite(shown.orbit.maxRadius) ? earthRadii(shown.orbit.maxRadius) : '∞' }}</strong></div>
            </template>
            <template v-if="advanced">
              <div><span>{{ tx('Escape speed here') }}</span><strong>{{ km(escapeSpeed(EARTH_GM, shown.radius * EARTH_RADIUS)) }}</strong></div>
              <div><span>{{ tx('Eccentricity') }}</span><strong>{{ fixed(shown.orbit.eccentricity, 3) }}</strong></div>
            </template>
          </div>
          <div v-if="shown && intermediate && energyPoints" class="energy-table">
            <table>
              <caption>{{ tx('Energy per kilogram (MJ/kg), with zero potential energy far away') }}</caption>
              <thead><tr><th scope="col"></th><th scope="col">{{ tx('Closest point') }}</th><th v-if="energyPoints.farthest" scope="col">{{ tx('Farthest point') }}</th></tr></thead>
              <tbody>
                <tr><th scope="row">{{ tx('Kinetic, v²/2') }}</th><td>{{ mj(energyPoints.closest.kinetic) }}</td><td v-if="energyPoints.farthest">{{ mj(energyPoints.farthest.kinetic) }}</td></tr>
                <tr><th scope="row">{{ tx('Potential, −GM/r') }}</th><td>{{ mj(energyPoints.closest.potential) }}</td><td v-if="energyPoints.farthest">{{ mj(energyPoints.farthest.potential) }}</td></tr>
                <tr class="total"><th scope="row">{{ tx('Total') }}</th><td>{{ mj(energyPoints.closest.total) }}</td><td v-if="energyPoints.farthest">{{ mj(energyPoints.farthest.total) }}</td></tr>
              </tbody>
            </table>
          </div>
          <p v-if="!shown" class="pending">{{ tx('Launch the satellite to see its path, the accelerations and the period.') }}</p>
          <p class="small muted">{{ tx('Arrows show directions at the launch point; they are not to scale. The Earth and the orbit are drawn to scale.') }}</p>
        </div>
        <aside class="card controls">
          <label class="control-label" :for="`${id}-radius`"><span>{{ tx('Launch distance from the Earth’s centre') }}</span><strong>{{ fixed(radius, 1) }} R⊕</strong></label>
          <input :id="`${id}-radius`" v-model.number="radius" type="range" v-bind="RADIUS" />
          <label class="control-label" :for="`${id}-speed`"><span>{{ tx('Launch speed') }}</span><strong>{{ fixed(speedFactor, 2) }} {{ tx('× circular speed') }}</strong></label>
          <input :id="`${id}-speed`" v-model.number="speedFactor" type="range" v-bind="SPEED" />
          <button class="btn btn-primary" type="button" @click="launch">{{ tx('Launch') }}</button>
          <p class="small muted">{{ tx('R⊕ is the Earth’s radius, 6371 km. The launch is always horizontal: at right angles to the line to the Earth’s centre.') }}</p>
        </aside>
      </div>
      <div v-if="runs.length && intermediate" class="card runs">
        <div class="runs-heading"><h3>{{ tx('Recorded launches') }}</h3><button class="btn btn-small" type="button" @click="runs = []; latest = null">{{ tx('Clear launches') }}</button></div>
        <div class="table-scroll">
          <table>
            <thead><tr><th>#</th><th>{{ tx('Launch distance from the Earth’s centre') }}</th><th>{{ tx('Launch speed') }}</th><th>{{ tx('Outcome') }}</th><th>{{ tx('Period') }}</th></tr></thead>
            <tbody>
              <tr v-for="(run, i) in runs" :key="i">
                <td>{{ i + 1 }}</td><td>{{ fixed(run.radius, 1) }} R⊕</td><td>{{ fixed(run.speedFactor, 2) }} {{ tx('× circular speed') }}</td>
                <td>{{ tx(OUTCOME_TEXT[run.outcome]) }}</td><td>{{ hours(run.period) }}</td>
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
        <h3>{{ tx('Why a circle needs a force') }}</h3>
        <p>{{ tx('Moving in a circle at constant speed, the direction of the velocity keeps changing, so the object accelerates towards the centre. A net force towards the centre must cause that acceleration:') }}</p>
        <MathFormula display tex="a = \frac{v^2}{r}, \qquad F_{\rm net} = \frac{m v^2}{r}" />
        <p>{{ tx('A string, a road or gravity can supply this force. Nothing pushes outwards: the outward pull you feel in a turning car is your body carrying on in a straight line.') }}</p>
        <template v-if="intermediate">
          <h3>{{ tx('Gravity as the centripetal force') }}</h3>
          <p>{{ tx('Setting gravity equal to the force a circle needs gives the circular speed and, with T = 2πr/v, the period:') }}</p>
          <MathFormula display tex="\frac{GMm}{r^2} = \frac{m v^2}{r} \;\Rightarrow\; v_c = \sqrt{\frac{GM}{r}}, \qquad T = 2\pi\sqrt{\frac{r^3}{GM}}" />
          <p>{{ tx('So T² ∝ r³: Kepler’s third law. A geostationary orbit, with a period of one sidereal day (23.93 h), sits at about 6.6 Earth radii.') }}</p>
        </template>
        <template v-if="advanced">
          <h3>{{ tx('Energy, ellipses and escape') }}</h3>
          <p>{{ tx('The energy per kilogram, E = v²/2 − GM/r, decides the shape: negative for an ellipse, zero for a parabola, positive for a hyperbola. A horizontal launch at f times the circular speed follows the conic') }}</p>
          <MathFormula display tex="r(\theta) = \frac{r_0 f^2}{1 + (f^2 - 1)\cos\theta}, \qquad e = |f^2 - 1|, \qquad v_{\rm esc} = \sqrt{2}\,v_c" />
          <p>{{ tx('This closed ellipse is the Newtonian reference in the Geodesic Motion Lab. In curved spacetime the same orbit does not close: its closest point advances each turn.') }}</p>
        </template>
      </section>
    </details>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('meaningDisclosure', locale) }}</summary>
      <section aria-labelledby="meaning-title" class="card prose">
        <h2 id="meaning-title"><span class="step-no">4</span> {{ experimentSectionLabel('meaning', locale) }}</h2>
        <ConceptBridge experiment-id="circular-orbits" :level="level" />
        <div class="meaning">
          <InfoCallout kind="physics" :title="experimentSectionLabel('establishedPhysics', locale)">
            <ul>
              <li>{{ tx('Newton’s gravity together with circular motion explains the orbits of the Moon, the planets and artificial satellites very precisely, and gives Kepler’s three laws.') }}</li>
              <li>{{ tx('Satellites in low orbit travel at about 7.7 km/s and go round in about 90 minutes; geostationary satellites orbit once per sidereal day, about 42 000 km from the Earth’s centre.') }}</li>
            </ul>
          </InfoCallout>
          <InfoCallout kind="interpretation" :title="experimentSectionLabel('interpretation', locale)">
            <ul>
              <li>
                <strong>{{ tx('Is an orbiting satellite falling?') }}</strong>
                {{ tx('In Newton’s picture it falls towards the Earth all the time, but moves sideways fast enough to keep missing it. General relativity describes the same orbit as free fall along a geodesic, with no force at all. Here the two agree very closely; they differ measurably in strong gravity or over many orbits, as the Geodesic Motion Lab shows.') }}
              </li>
            </ul>
          </InfoCallout>
        </div>
        <h3>{{ tx('What this model assumes') }}</h3>
        <p>{{ tx('The satellite is a point and the Earth a fixed, uniform sphere. The model ignores air, the Moon and the Sun, the Earth’s rotation and flattening, and relativistic effects. The launch is always horizontal.') }}</p>
        <p>{{ tx('The path is calculated exactly from Newton’s laws (it is a conic section), not by stepping through time.') }}</p>
      </section>
    </details>

    <nav class="next card" :aria-label="experimentSectionLabel('nextSteps', locale)">
      <p>{{ tx('Next: Module 4, “Different clocks”, asks what happens to clocks near the speed of light. Later, the Geodesic Motion Lab revisits these orbits in curved spacetime.') }}</p>
      <span class="nav-links">
        <RouterLink to="/relativity/moving-clocks">{{ tx('Different clocks') }}</RouterLink>
        <RouterLink to="/gravity/geodesic-motion">{{ tx('Geodesic Motion Lab') }}</RouterLink>
        <RouterLink to="/">{{ tx('All modules') }}</RouterLink>
      </span>
    </nav>
  </article>
</template>

<style scoped>
.experiment-grid { display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(230px, .75fr); gap: 16px; align-items: start; }
.orbit-card svg { display: block; width: 100%; max-height: 460px; margin-top: 12px; }
.earth { fill: var(--accent-soft); stroke: var(--accent); stroke-width: 1.5; }
.launch-ring { fill: none; stroke: var(--border); stroke-dasharray: 4 5; }
.orbit-path { fill: none; stroke: var(--accent); stroke-width: 2.6; stroke-linejoin: round; stroke-linecap: round; }
.satellite { fill: var(--text); stroke: var(--surface); stroke-width: 2; }
.arrow-v { stroke: var(--series-2, var(--brand-amber-ink)); stroke-width: 3; }
.arrow-v-head { fill: var(--series-2, var(--brand-amber-ink)); }
.arrow-f { stroke: var(--observer); stroke-width: 3; stroke-dasharray: 6 3; }
.arrow-f-head { fill: var(--observer); }
.pending-text { fill: var(--text-muted); font-size: 14px; }
.pending { margin: 14px 0; padding: 12px 14px; border-left: 3px solid var(--accent); border-radius: var(--radius-sm); background: var(--surface-2); }
.orbit-legend { display: flex; flex-wrap: wrap; gap: 12px; font-size: .78rem; color: var(--text-muted); }
.orbit-legend span { display: flex; align-items: center; gap: 6px; }
.orbit-legend i { display: inline-block; width: 20px; border-top: 3px solid var(--accent); }
.orbit-legend .legend-v { border-color: var(--series-2, var(--brand-amber-ink)); }
.orbit-legend .legend-f { border-color: var(--observer); border-top-style: dashed; }
.readouts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin: 14px 0; }
.readouts div { padding: 10px; border-radius: 8px; background: var(--surface-2); }
.readouts .wide { grid-column: 1 / -1; }
.energy-table { margin: 0 0 14px; overflow-x: auto; }
.energy-table table { font-size: .88rem; }
.energy-table caption { margin-bottom: 4px; color: var(--text-muted); text-align: left; font-size: .8rem; }
.energy-table th, .energy-table td { padding: 4px 10px; border-bottom: 1px solid var(--border); text-align: right; }
.energy-table th[scope=row] { text-align: left; color: var(--text-muted); font-weight: 600; }
.energy-table .total td, .energy-table .total th { font-weight: 700; color: var(--text); }
.readouts span, .readouts strong { display: block; }
.readouts span { color: var(--text-muted); font-size: .78rem; }
.readouts strong { margin-top: 4px; font-variant-numeric: tabular-nums; }
.controls { display: grid; gap: 10px; }
.control-label { display: flex; justify-content: space-between; gap: 8px; font-size: .86rem; }
.control-label strong { font-variant-numeric: tabular-nums; white-space: nowrap; }
.controls input[type=range] { width: 100%; accent-color: var(--accent); }
.controls button { margin-top: 8px; }
.runs { margin-top: 16px; }
.runs-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.runs-heading h3 { margin: 0; }
.table-scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
th, td { white-space: nowrap; }
.btn-small { min-height: 32px; padding: 0 10px; font-size: .85rem; }
.small { font-size: .85rem; margin: 0; }
.nav-links { display: inline-flex; flex-wrap: wrap; gap: 16px; }
@media (max-width: 760px) { .experiment-grid { grid-template-columns: 1fr; } }
</style>
