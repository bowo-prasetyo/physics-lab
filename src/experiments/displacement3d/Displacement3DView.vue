<script setup lang="ts">
import LocalizedExperimentGuide from '@/components/LocalizedExperimentGuide.vue'
import ShareExperiment from '@/components/ShareExperiment.vue'
import ExperimentSupport from '@/components/ExperimentSupport.vue'
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ParameterSlider from '@/components/ParameterSlider.vue'
import PredictionCard from '@/components/PredictionCard.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import Displacement3DMath from './Displacement3DMath.vue'
import { PREDICTIONS } from './predictions'
import { BOUND, PITCH_RANGE, PRESETS, SHIFT_RANGE, YAW_RANGE, useDisplacement3D, type Axis } from './useDisplacement3D'
import type { View } from '@/components/Scene3D.vue'
import { vec3, type Vec3 } from '@/physics'
import { useLevel } from '@/composables/useLevel'
import { snapToRange, useQuerySync } from '@/composables/useQuerySync'
import type { LocationQuery } from 'vue-router'
import { atLeast, isLevel } from '@/levels'
import { useLocale } from '@/composables/useLocale'
import { localizeExperimentText } from '@/i18n/experiment-ui'
import { localizePredictions } from '@/i18n/experiment-content'

// Three.js is large; it is only downloaded for this page.
const Scene3D = defineAsyncComponent(() => import('@/components/Scene3D.vue'))

const route = useRoute()
const level = useLevel()
const { locale } = useLocale()
const tx = (value: string) => localizeExperimentText(value, locale.value) ?? value

const { points, shift, yaw, pitch, frame, frameIsStandard, current, start, displacement, distance, size, inFrame, snapshots, moveTo, step, undo, restart, loadPreset, resetFrame } =
  useDisplacement3D()

// The level and the second coordinate system can be shared as a link,
// e.g. #/space/displacement-3d?level=intermediate&ox=2&oy=0&oz=0&yaw=40&pitch=0
function readQuery(query: LocationQuery) {
  if (isLevel(query.level)) level.value = query.level
  shift.value.x = snapToRange(query.ox, SHIFT_RANGE, 0)
  shift.value.y = snapToRange(query.oy, SHIFT_RANGE, 0)
  shift.value.z = snapToRange(query.oz, SHIFT_RANGE, 0)
  yaw.value = snapToRange(query.yaw, YAW_RANGE, 0)
  pitch.value = snapToRange(query.pitch, PITCH_RANGE, 0)
}
readQuery(route.query)
useQuerySync({
  sources: [level, frame],
  write: () => ({
    level: level.value,
    ox: String(shift.value.x),
    oy: String(shift.value.y),
    oz: String(shift.value.z),
    yaw: String(yaw.value),
    pitch: String(pitch.value),
  }),
  read: readQuery,
})

// The tilt slider exists only at Advanced, so a tilt must not linger out of sight.
watch(
  level,
  (l) => {
    if (!atLeast(l, 'advanced')) pitch.value = 0
  },
  { immediate: true },
)

const predictions = computed(() => localizePredictions('displacement3d', PREDICTIONS, locale.value).filter((p) => atLeast(level.value, p.minLevel)))
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed(snapshots.value)])))
const hints = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, localizeExperimentText(p.hint?.(snapshots.value) ?? null, locale.value)])))

const intermediate = computed(() => atLeast(level.value, 'intermediate'))
const advanced = computed(() => atLeast(level.value, 'advanced'))

const view = ref<View>('3d')
const viewKey = ref(0)
function setView(v: View) {
  view.value = v
  viewKey.value++
}

const target = ref({ x: 0, y: 0, z: 0 })
function goToTarget() {
  moveTo(vec3(Number(target.value.x) || 0, Number(target.value.y) || 0, Number(target.value.z) || 0))
}

const AXES: Axis[] = ['x', 'y', 'z']
/** Compass convention (east, north, up), as used in surveying and navigation. */
const DIRECTIONS = { x: ['west', 'east'], y: ['south', 'north'], z: ['down', 'up'] } as const satisfies Record<Axis, readonly [string, string]>
const fmt = (x: number, digits = 2) => {
  const v = Number(x.toFixed(digits))
  return (v < 0 ? '−' : '') + Math.abs(v).toString()
}
const vec = (v: Vec3) => `(${fmt(v.x)}, ${fmt(v.y)}, ${fmt(v.z)})`
const showFrame = computed(() => intermediate.value && !frameIsStandard.value)
</script>

<template>
  <article class="lesson container">
    <header class="lesson-head">
      <p class="eyebrow">{{ localizeExperimentText('Module 1 · Understanding space · Displacement in 3D', locale) ?? 'Module 1 · Understanding space · Displacement in 3D' }}</p>
      <h1>{{ localizeExperimentText('Displacement in 3D', locale) ?? 'Displacement in 3D' }}</h1>
      <p class="lead">{{ localizeExperimentText('Move an object through three-dimensional space and measure where it ends up. Then change the coordinate system and find out which numbers change, and which belong to space itself.', locale) ?? 'Move an object through three-dimensional space and measure where it ends up. Then change the coordinate system and find out which numbers change, and which belong to space itself.' }}</p>
    </header>

    <ShareExperiment />

    <LocalizedExperimentGuide experiment-id="displacement3d" />

    <ExperimentSupport experiment-id="displacement-3d" :module-number="1" focus="Position, path length and displacement are different descriptions of a journey." prompt="If an object takes two different routes to the same destination, what should stay the same?" action="Move the object through a few points, note the distance travelled and displacement, then rotate or move the coordinate frame." reflect="Which coordinates changed when you changed the frame, and which geometric quantity stayed invariant?" />

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
          <div class="views" role="group" :aria-label="localizeExperimentText('Camera', locale)">
            <span class="muted small">{{ tx('View') }}</span>
            <button v-for="v in (['3d', 'top', 'front', 'side'] as const)" :key="v" type="button" class="chip" :class="{ active: view === v }" @click="setView(v)">
              {{ v === '3d' ? '3D' : v === 'top' ? 'From above' : v === 'front' ? 'From the front' : 'From the side' }}
            </button>
          </div>
          <Scene3D
            :points="points"
            :bound="BOUND"
            :frame="frame"
            :show-frame="showFrame"
            :show-components="intermediate"
            :view="view"
            :view-key="viewKey"
            :directions="DIRECTIONS"
          />
          <p class="muted small">
            {{ tx(`Drag to turn the view, scroll or pinch to zoom. x points east, y north and z up. The orange arrow is the displacement Δr from the green start to the blue
            object.`) }}
            <template v-if="intermediate"> {{ tx('Dashed lines show its x, y and z components.') }}</template>
          </p>
        </div>

        <div class="lab-side card">
          <div class="moves">
            <p class="group-title">Move the object (1 m steps)</p>
            <p class="muted small convention">+x is east, +y is north, +z is up.</p>
            <div v-for="axis in AXES" :key="axis" class="move-row">
              <button class="btn btn-small" type="button" :aria-label="`Move 1 m ${DIRECTIONS[axis][0]} (−${axis})`" @click="step(axis, -1)">− {{ axis }} · {{ DIRECTIONS[axis][0] }}</button>
              <span :class="['axis-name', `axis-${axis}`]">{{ axis }}</span>
              <button class="btn btn-small" type="button" :aria-label="`Move 1 m ${DIRECTIONS[axis][1]} (+${axis})`" @click="step(axis, 1)">+ {{ axis }} · {{ DIRECTIONS[axis][1] }}</button>
            </div>
          </div>
          <form class="goto" @submit.prevent="goToTarget">
            <p class="group-title">Or go straight to a point</p>
            <div class="goto-row">
              <label v-for="axis in AXES" :key="axis">
                <span :class="['axis-name', `axis-${axis}`]">{{ axis }}</span>
                <input v-model.number="target[axis]" type="number" :min="-BOUND" :max="BOUND" step="0.5" />
              </label>
              <button class="btn btn-small" type="submit">{{ localizeExperimentText('Go', locale) ?? 'Go' }}</button>
            </div>
          </form>
          <div class="journey-buttons">
            <button class="btn btn-small" type="button" :disabled="points.length < 2" @click="undo">{{ localizeExperimentText('Undo move', locale) ?? 'Undo move' }}</button>
            <button class="btn btn-small" type="button" @click="restart(false)">{{ localizeExperimentText('New journey from here', locale) ?? 'New journey from here' }}</button>
            <button class="btn btn-small" type="button" @click="restart(true)">{{ localizeExperimentText('Back to the origin', locale) ?? 'Back to the origin' }}</button>
          </div>
          <div class="presets">
            <span class="muted small">Example journeys</span>
            <button v-for="p in PRESETS" :key="p.id" type="button" class="chip" @click="loadPreset(p.id)">{{ p.label }}</button>
          </div>

          <dl class="readouts">
            <div><dt>Position r</dt><dd class="num">{{ vec(current) }}</dd></div>
            <div><dt>Moves</dt><dd class="num">{{ points.length - 1 }}</dd></div>
            <div class="highlight"><dt>Displacement Δr</dt><dd class="num">{{ vec(displacement) }}</dd></div>
            <div class="highlight"><dt>Size |Δr|</dt><dd class="num">{{ fmt(size, 3) }} m</dd></div>
            <div><dt>Distance travelled</dt><dd class="num">{{ fmt(distance, 3) }} m</dd></div>
          </dl>

          <div v-if="intermediate" class="frame">
            <p class="group-title">A second coordinate system (x′, y′, z′)</p>
            <ParameterSlider v-model="shift.x" :label="localizeExperimentText('Origin moved, x', locale) ?? 'Origin moved, x'" symbol="O_x" unit="m" v-bind="SHIFT_RANGE" :digits="0" />
            <ParameterSlider v-model="shift.y" :label="localizeExperimentText('Origin moved, y', locale) ?? 'Origin moved, y'" symbol="O_y" unit="m" v-bind="SHIFT_RANGE" :digits="0" />
            <ParameterSlider v-model="shift.z" :label="localizeExperimentText('Origin moved, z', locale) ?? 'Origin moved, z'" symbol="O_z" unit="m" v-bind="SHIFT_RANGE" :digits="0" />
            <ParameterSlider v-model="yaw" :label="localizeExperimentText('Axes turned about z', locale) ?? 'Axes turned about z'" symbol="\varphi" unit="°" v-bind="YAW_RANGE" :digits="0" />
            <ParameterSlider v-if="advanced" v-model="pitch" :label="localizeExperimentText('Axes tilted', locale) ?? 'Axes tilted'" symbol="\psi" unit="°" v-bind="PITCH_RANGE" :digits="0" />
            <button class="btn btn-small" type="button" :disabled="frameIsStandard" @click="resetFrame">{{ localizeExperimentText('Reset to the original axes', locale) ?? 'Reset to the original axes' }}</button>
            <dl v-if="!frameIsStandard" class="readouts primed">
              <div><dt>Position r′</dt><dd class="num">{{ vec(inFrame.current) }}</dd></div>
              <div><dt>Displacement Δr′</dt><dd class="num">{{ vec(inFrame.displacement) }}</dd></div>
              <div><dt>Size |Δr′|</dt><dd class="num">{{ fmt(Math.hypot(inFrame.displacement.x, inFrame.displacement.y, inFrame.displacement.z), 3) }} m</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <details class="lesson-disclosure">
      <summary>{{ localizeExperimentText('3 · Explore the mathematics', locale) ?? '3 · Explore the mathematics' }}</summary>
      <section aria-labelledby="maths-title" class="card prose">
      <h2 id="maths-title"><span class="step-no">3</span> The mathematics</h2>
      <Displacement3DMath
        :level="level"
        :start="start"
        :end="current"
        :displacement="displacement"
        :primed="inFrame.displacement"
        :distance="distance"
        :yaw-deg="yaw"
        :frame-is-standard="frameIsStandard"
      />
    </section>
    </details>

    <details class="lesson-disclosure">
      <summary>{{ localizeExperimentText('4 · Explore the meaning and interpretation', locale) ?? '4 · Explore the meaning and interpretation' }}</summary>
      <section aria-labelledby="meaning-title" class="card prose">
      <h2 id="meaning-title"><span class="step-no">4</span> {{ localizeExperimentText('What does it tell us?', locale) }}</h2>
      <div class="meaning">
        <InfoCallout kind="physics" :title="localizeExperimentText('Established physics', locale) ?? 'Established physics'">
          <ul>
            <li>{{ localizeExperimentText('Over everyday distances, space is described extremely well by Euclidean geometry: Pythagoras holds, and triangles have angles adding up to 180°.', locale) }}</li>
            <li>{{ localizeExperimentText('Coordinates are a human choice; distances, lengths and angles are not. Physical laws are written so that they do not depend on the choice.', locale) }}</li>
            <li>{{ localizeExperimentText('Near massive bodies space is very slightly curved, and Euclidean geometry is only an approximation (Experiment C).', locale) }}</li>
          </ul>
        </InfoCallout>
        <InfoCallout kind="interpretation" :title="localizeExperimentText('Interpretation: open to debate', locale) ?? 'Interpretation: open to debate'">
          <ul>
            <li>
              <strong>{{ localizeExperimentText('Is space a thing, or only relations between things?', locale) }}</strong> {{ localizeExperimentText('Newton treated space as a container that exists even when empty; Leibniz argued that only the distances and directions between objects are real. Their followers debated it in letters in 1715–16, and the question is still discussed.', locale) }}
            </li>
            <li>
              <strong>{{ localizeExperimentText('Why three dimensions?', locale) }}</strong> {{ localizeExperimentText('Every observation so far fits three. Some theories propose extra dimensions too small to notice, but there is no evidence for them yet.', locale) }}
            </li>
          </ul>
        </InfoCallout>
      </div>
    </section>
    </details>

    <nav class="next card" :aria-label="localizeExperimentText('Next steps', locale)">
      <p><strong>{{ localizeExperimentText('Next:', locale) }}</strong> {{ localizeExperimentText('Experiment A adds time to position, and Experiment E compares space and time with spacetime.', locale) }}</p>
      <span class="nav-links">
        <RouterLink to="/space/space-vs-time">{{ tx("Experiment A") }}</RouterLink>
        <RouterLink to="/relativity/two-perspectives">{{ tx("Experiment E") }}</RouterLink>
        <RouterLink to="/">{{ tx("All modules") }}</RouterLink>
      </span>
    </nav>
  </article>
</template>

<style scoped>
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
  max-height: calc(100vh - 92px);
  overflow-y: auto;
}

.small {
  font-size: 0.85rem;
  margin: 0;
}

.views,
.presets {
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

.convention {
  margin: -2px 0 8px;
}

.group-title {
  margin: 0 0 6px;
  font-weight: 700;
}

.move-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.axis-name {
  font-weight: 800;
  text-align: center;
  min-width: 1.5em;
}

.axis-x {
  color: #e5484d;
}

.axis-y {
  color: #30a46c;
}

.axis-z {
  color: #3e63dd;
}

.goto-row {
  display: flex;
  align-items: flex-end;
  gap: 6px;
}

.goto-row label {
  display: grid;
  gap: 2px;
  flex: 1;
}

.goto-row input {
  width: 100%;
  min-width: 0;
  font: inherit;
  padding: 4px 6px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
}

.journey-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.btn-small {
  min-height: 34px;
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

.highlight dt,
.highlight dd {
  color: var(--observer);
}

.frame {
  display: grid;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

.primed dt,
.primed dd {
  color: var(--text);
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
    max-height: none;
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
