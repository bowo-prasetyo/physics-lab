<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ExperimentSupport from '@/components/ExperimentSupport.vue'
import InfoCallout from '@/components/InfoCallout.vue'
import PredictionCard from '@/components/PredictionCard.vue'
import ShareExperiment from '@/components/ShareExperiment.vue'
import MathFormula from '@/components/MathFormula.vue'
import { useLevel } from '@/composables/useLevel'
import { snapToRange, useQuerySync } from '@/composables/useQuerySync'
import { useLocale } from '@/composables/useLocale'
import { atLeast, isLevel } from '@/levels'
import { calculateMomentumCollision } from '@/physics'
import { experimentSectionLabel, getExperimentModuleEyebrow } from '@/i18n/experiment-metadata'
import { localizePredictions } from '@/i18n/experiment-content'
import { getMomentumCollisionsDocumentTitle, localizeMomentumCollisionsText } from './copy'
import { PREDICTIONS, type CollisionRun } from './predictions'

const route = useRoute()
const level = useLevel()
const { locale } = useLocale()
const tx = (value: string) => localizeMomentumCollisionsText(value, locale.value)
const mass1 = ref(snapToRange(route.query.m1, { min: 1, max: 10, step: .5 }, 2))
const mass2 = ref(snapToRange(route.query.m2, { min: 1, max: 10, step: .5 }, 2))
const velocity1 = ref(snapToRange(route.query.v1, { min: -8, max: 8, step: .5 }, 4))
const velocity2 = ref(snapToRange(route.query.v2, { min: -8, max: 8, step: .5 }, 0))
const restitution = ref(snapToRange(route.query.e, { min: 0, max: 1, step: .05 }, 1))
if (isLevel(route.query.level)) level.value = route.query.level

useQuerySync({
  sources: [mass1, mass2, velocity1, velocity2, restitution, level],
  write: () => ({ level: level.value, m1: String(mass1.value), m2: String(mass2.value), v1: String(velocity1.value), v2: String(velocity2.value), e: restitution.value.toFixed(2) }),
  read: (query) => {
    if (isLevel(query.level)) level.value = query.level
    mass1.value = snapToRange(query.m1, { min: 1, max: 10, step: .5 }, mass1.value)
    mass2.value = snapToRange(query.m2, { min: 1, max: 10, step: .5 }, mass2.value)
    velocity1.value = snapToRange(query.v1, { min: -8, max: 8, step: .5 }, velocity1.value)
    velocity2.value = snapToRange(query.v2, { min: -8, max: 8, step: .5 }, velocity2.value)
    restitution.value = snapToRange(query.e, { min: 0, max: 1, step: .05 }, restitution.value)
  },
})

type Phase = 'idle' | 'approaching' | 'impact' | 'complete'
const phase = ref<Phase>('idle')
const runs = ref<CollisionRun[]>([])
let animationTimer: ReturnType<typeof setTimeout> | undefined
const result = computed(() => calculateMomentumCollision({
  mass1: mass1.value, mass2: mass2.value, velocity1: velocity1.value,
  velocity2: velocity2.value, restitution: restitution.value,
}))
const predictions = computed(() => localizePredictions('momentum-collisions', PREDICTIONS, locale.value).filter((p) => atLeast(level.value, p.minLevel)))
const observed = computed(() => Object.fromEntries(PREDICTIONS.map((p) => [p.id, p.observed(runs.value)])))
const hints = computed(() => Object.fromEntries(PREDICTIONS.map((p) => {
  const hint = p.hint?.(runs.value) ?? null
  return [p.id, hint === null ? null : tx(hint)]
})))
const isApproaching = computed(() => velocity1.value > velocity2.value)
const intermediate = computed(() => atLeast(level.value, 'intermediate'))
const advanced = computed(() => atLeast(level.value, 'advanced'))
const isRunning = computed(() => phase.value === 'approaching' || phase.value === 'impact')
const runDisabledReason = computed(() => {
  if (!isApproaching.value) return 'No collision is possible with the current velocities: cart 1 must move faster than cart 2 (v₁ > v₂).'
  if (isRunning.value) return 'The collision animation is running. Wait until it finishes.'
  return ''
})
const fmt = (value: number, digits = 2) => Number(value.toFixed(digits)).toString()
const lossPct = computed(() => result.value.kineticEnergyBefore > 0 ? 100 * result.value.kineticEnergyLost / result.value.kineticEnergyBefore : 0)
const separation = computed(() => Math.min(34, result.value.relativeSpeedAfter * 2.5))
const cart1Position = computed(() => phase.value === 'idle' ? 15 : phase.value === 'complete' ? 50 - separation.value / 2 : 44)
const cart2Position = computed(() => phase.value === 'idle' ? 75 : phase.value === 'complete' ? 50 + separation.value / 2 : 56)
const phaseLabel = computed(() => ({
  idle: 'Ready to run', approaching: 'Approaching', impact: 'Impact', complete: 'After collision',
})[phase.value])

function clearAnimationTimer() {
  if (animationTimer !== undefined) clearTimeout(animationTimer)
  animationTimer = undefined
}
function runCollision() {
  if (!isApproaching.value || isRunning.value) return
  clearAnimationTimer()
  if (phase.value === 'complete') {
    phase.value = 'idle'
    animationTimer = setTimeout(startApproach, 40)
  } else {
    startApproach()
  }
}
function startApproach() {
  phase.value = 'approaching'
  animationTimer = setTimeout(() => {
    phase.value = 'impact'
    animationTimer = setTimeout(() => {
      phase.value = 'complete'
      animationTimer = undefined
      const r = result.value
      runs.value = [...runs.value, {
        mass1: mass1.value, mass2: mass2.value, velocity1: velocity1.value, velocity2: velocity2.value,
        restitution: restitution.value, velocity1After: r.velocity1After, velocity2After: r.velocity2After,
      }]
    }, 240)
  }, 700)
}
// Results belong to one setup: changing it hides them until the next run.
watch([mass1, mass2, velocity1, velocity2, restitution], () => {
  clearAnimationTimer()
  phase.value = 'idle'
})
watch(locale, () => {
  if (route.name === 'momentum-collisions') document.title = getMomentumCollisionsDocumentTitle(locale.value)
})
onBeforeUnmount(clearAnimationTimer)
</script>

<template>
  <article class="lesson container momentum-collisions">
    <header class="lesson-head">
      <p class="eyebrow">{{ getExperimentModuleEyebrow('momentum-collisions', locale) }}</p>
      <h1>{{ tx('Momentum and collisions') }}</h1>
      <p class="lead">{{ tx('Two carts approach, collide and move apart. Predict their motion first, then investigate what momentum conservation tells us—and what it does not tell us about kinetic energy.') }}</p>
    </header>
    <ShareExperiment />

    <ExperimentSupport experiment-id="momentum-collisions" :module-number="3"
      focus="Momentum is conserved in an isolated collision, but kinetic energy depends on the collision's elasticity."
      prompt="Before running the collision, predict the final directions and speeds of both carts."
      action="Change one mass, initial velocity or restitution value at a time; compare momentum and kinetic energy before and after."
      reflect="If momentum is unchanged but kinetic energy decreases, where might the energy have gone?" />

    <section aria-labelledby="predict-title">
      <h2 id="predict-title"><span class="step-no">1</span> {{ experimentSectionLabel('predict', locale) }}</h2>
      <p class="muted">{{ tx('Commit to an answer first. Each explanation unlocks only after you have run the collision that tests it.') }}</p>
      <div class="prediction-grid">
        <PredictionCard v-for="(p, i) in predictions" :key="p.id" :prediction="p" :observed="observed[p.id] ?? false" :hint="hints[p.id]" :index="i + 1" />
      </div>
    </section>

    <section aria-labelledby="experiment-title">
      <h2 id="experiment-title"><span class="step-no">2</span> {{ experimentSectionLabel('experiment', locale) }}</h2>
      <div class="card controls">
        <div class="control-grid">
          <label>{{ tx('Cart 1 mass') }} <output>{{ fmt(mass1) }} kg</output><input v-model.number="mass1" type="range" min="1" max="10" step=".5"></label>
          <label>{{ tx('Cart 2 mass') }} <output>{{ fmt(mass2) }} kg</output><input v-model.number="mass2" type="range" min="1" max="10" step=".5"></label>
          <label>{{ tx('Cart 1 initial velocity') }} <output>{{ fmt(velocity1) }} m/s</output><input v-model.number="velocity1" type="range" min="-8" max="8" step=".5"></label>
          <label>{{ tx('Cart 2 initial velocity') }} <output>{{ fmt(velocity2) }} m/s</output><input v-model.number="velocity2" type="range" min="-8" max="8" step=".5"></label>
          <label class="wide">{{ tx('Coefficient of restitution') }} <output>{{ fmt(restitution, 2) }} · {{ tx(restitution === 1 ? 'Elastic' : restitution === 0 ? 'Perfectly inelastic' : 'Inelastic') }}</output><input v-model.number="restitution" type="range" min="0" max="1" step=".05"></label>
        </div>
        <p class="muted">{{ tx('The coefficient of restitution compares separation speed with approach speed along the collision line.') }}</p>

        <div class="direction-note">
          <strong>{{ tx('Direction convention') }}</strong>
          <span>{{ tx('Cart 1 starts behind cart 2. Right is positive; a collision occurs only when cart 1 approaches faster than cart 2.') }}</span>
        </div>
        <p v-if="!isApproaching" class="no-collision" role="status">{{ tx('No collision: cart 1 is not catching up with cart 2. Increase cart 1 velocity or reduce cart 2 velocity.') }}</p>

        <div class="simulation" :class="'phase-' + phase" role="img" :aria-label="tx('Two-cart collision animation showing the carts approach, make contact and separate.')">
          <div class="simulation-heading">
            <strong>{{ tx('Collision simulation') }}</strong>
            <span class="phase-label" aria-live="polite">{{ tx(phaseLabel) }}</span>
          </div>
          <div class="track" aria-hidden="true">
            <div class="track-line"></div>
            <div class="cart cart-one" :style="{ left: cart1Position + '%' }"><span>1</span></div>
            <div class="cart cart-two" :style="{ left: cart2Position + '%' }"><span>2</span></div>
            <div v-if="phase === 'impact'" class="impact-flash"></div>
          </div>
          <div class="velocity-key">
            <span><strong>{{ tx('Cart 1') }}</strong> {{ velocity1 < 0 ? '←' : velocity1 > 0 ? '→' : '•' }} {{ fmt(velocity1) }} m/s</span>
            <span><strong>{{ tx('Cart 2') }}</strong> {{ velocity2 < 0 ? '←' : velocity2 > 0 ? '→' : '•' }} {{ fmt(velocity2) }} m/s</span>
          </div>
          <p class="small muted">{{ tx('Schematic view: cart positions illustrate contact and separation; velocity values are shown with their signs.') }}</p>
        </div>

        <p v-if="runDisabledReason" id="collision-run-guidance" class="run-guidance muted small">
          {{ tx(runDisabledReason) }}
        </p>
        <button class="button button-primary run-button" type="button"
          :disabled="Boolean(runDisabledReason)" :aria-describedby="runDisabledReason ? 'collision-run-guidance' : undefined"
          @click="runCollision">
          {{ isRunning ? tx('Collision in progress…') : phase === 'complete' ? tx('Run again') : tx('Run collision') }}
        </button>
        <p v-if="phase !== 'complete' && !isRunning" class="muted small">{{ tx('The results appear once the carts have collided.') }}</p>
      </div>

      <div v-if="phase === 'complete'" class="card results" aria-live="polite">
        <h3>{{ tx('Collision results') }}</h3>
        <div class="result-grid">
          <div><span>{{ tx('Cart 1 final velocity') }}</span><strong>{{ fmt(result.velocity1After) }} m/s</strong></div>
          <div><span>{{ tx('Cart 2 final velocity') }}</span><strong>{{ fmt(result.velocity2After) }} m/s</strong></div>
          <div><span>{{ tx('Momentum before') }}</span><strong>{{ fmt(result.momentumBefore) }} kg·m/s</strong></div>
          <div><span>{{ tx('Momentum after') }}</span><strong>{{ fmt(result.momentumAfter) }} kg·m/s</strong></div>
          <div><span>{{ tx('Kinetic energy before') }}</span><strong>{{ fmt(result.kineticEnergyBefore) }} J</strong></div>
          <div><span>{{ tx('Kinetic energy after') }}</span><strong>{{ fmt(result.kineticEnergyAfter) }} J</strong></div>
          <div><span>{{ tx('Kinetic energy lost') }}</span><strong>{{ fmt(result.kineticEnergyLost) }} J ({{ fmt(lossPct, 1) }}%)</strong></div>
          <div><span>{{ tx('Momentum change') }}</span><strong>{{ fmt(result.momentumChange, 5) }} kg·m/s</strong></div>
          <div><span>{{ tx('Impulse on cart 1') }}</span><strong>{{ fmt(result.impulseOn1) }} N·s</strong></div>
          <div><span>{{ tx('Impulse on cart 2') }}</span><strong>{{ fmt(result.impulseOn2) }} N·s</strong></div>
        </div>
      </div>
    </section>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('mathematicsDisclosure', locale) }}</summary>
      <section aria-labelledby="maths-title" class="card prose">
        <h2 id="maths-title"><span class="step-no">3</span> {{ experimentSectionLabel('mathematics', locale) }}</h2>
        <p>{{ tx('Beginner: momentum is mass multiplied by velocity. In an isolated collision, the total momentum before and after is the same. Kinetic energy may decrease in an inelastic collision.') }}</p>
        <template v-if="intermediate">
          <p>{{ tx('Intermediate: use conservation of momentum together with the coefficient of restitution e, the ratio of relative separation speed to relative approach speed. e = 1 is elastic; e = 0 is perfectly inelastic.') }}</p>
          <MathFormula display tex="m_1u_1+m_2u_2=m_1v_1+m_2v_2" />
          <MathFormula display tex="v_2-v_1=e(u_1-u_2)" />
        </template>
        <template v-if="advanced">
          <p>{{ tx('Advanced: the center-of-mass velocity is constant. The impulse on one cart is equal and opposite to the impulse on the other. For this isolated two-body model, kinetic-energy loss is one half of the reduced mass times (1 − e²) times the squared initial relative speed.') }}</p>
          <MathFormula display tex="V_{CM}=\frac{m_1u_1+m_2u_2}{m_1+m_2}" />
          <MathFormula display tex="\Delta K=-\frac12\mu(1-e^2)(u_1-u_2)^2,\quad \mu=\frac{m_1m_2}{m_1+m_2}" />
        </template>
        <MathFormula display tex="p = mv, \qquad p_{\text{before}} = p_{\text{after}}" />
      </section>
    </details>

    <details class="lesson-disclosure">
      <summary>{{ experimentSectionLabel('meaningDisclosure', locale) }}</summary>
      <section aria-labelledby="meaning-title" class="card prose">
        <h2 id="meaning-title"><span class="step-no">4</span> {{ experimentSectionLabel('meaning', locale) }}</h2>
        <div class="meaning">
          <InfoCallout kind="physics" :title="experimentSectionLabel('establishedPhysics', locale)">
            <ul>
              <li>{{ tx('Momentum is conserved in this model; kinetic energy is conserved only when the collision is elastic.') }}</li>
              <li>{{ tx('During the impact each cart pushes on the other with an equal and opposite force for the same time, so their impulses cancel (Newton’s third law).') }}</li>
              <li>{{ tx('Momentum conservation has been confirmed from billiard balls to particle collisions, where it is used to discover particles that cannot be seen directly.') }}</li>
            </ul>
          </InfoCallout>
          <InfoCallout kind="interpretation" :title="experimentSectionLabel('interpretation', locale)">
            <ul>
              <li>
                <strong>{{ tx('Why is momentum conserved at all?') }}</strong>
                {{ tx('Emmy Noether showed in 1918 that it follows from a symmetry: the laws of physics are the same everywhere in space. Shifting an experiment to another place changes nothing, the idea behind moving the origin in Displacement in 3D. Whether symmetries or conservation laws are the more fundamental description is a question of perspective.') }}
              </li>
              <li>
                <strong>{{ tx('Is energy “lost”?') }}</strong>
                {{ tx('Not in total: the missing kinetic energy becomes internal energy, sound and deformation. “Lost” only means it has left the quantities this model keeps track of.') }}
              </li>
            </ul>
          </InfoCallout>
        </div>
        <h3>{{ tx('Model assumptions and limits') }}</h3>
        <p>{{ tx('This is a one-dimensional, isolated, two-body collision. External impulse during impact is neglected; masses remain constant; the coefficient of restitution is constant and lies between zero and one. Rotation, deformation details, sound, heat, fragmentation and multidimensional contact are not simulated. Kinetic energy not retained as translational kinetic energy is transferred to internal energy, sound or deformation; it is not destroyed.') }}</p>
      </section>
    </details>

    <nav class="next card" :aria-label="experimentSectionLabel('nextSteps', locale)">
      <p>{{ tx('Next: the projectile launcher, where gravity is the only force and the horizontal and vertical motions separate.') }}</p>
      <span class="nav-links">
        <RouterLink to="/mechanics/projectile">{{ tx('Projectile launcher') }}</RouterLink>
        <RouterLink to="/teachers">{{ tx('Teacher guide') }}</RouterLink>
        <RouterLink to="/">{{ tx('All modules') }}</RouterLink>
      </span>
    </nav>
  </article>
</template>

<style scoped>
section[aria-labelledby="experiment-title"] { display:grid; gap:14px; }
.no-collision { margin:0; font-weight:650; color:var(--warn); }
.controls,.results { display:grid; gap:16px; }
.control-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr)); gap:18px; }
.control-grid label { display:grid; gap:8px; font-weight:600; }
.control-grid output { font-weight:500; color:var(--accent); }
.control-grid input { width:100%; accent-color:var(--accent); }
.wide { grid-column:1/-1; }
.direction-note { display:grid; gap:4px; padding:12px 14px; border-left:3px solid var(--accent); background:var(--surface-2); border-radius:8px; }
.simulation { display:grid; gap:12px; padding:16px; border-radius:12px; background:var(--surface-2); overflow:hidden; }
.simulation-heading { display:flex; justify-content:space-between; align-items:center; gap:12px; }
.phase-label { color:var(--accent); font-weight:650; }
.track { height:112px; position:relative; }
.track-line { position:absolute; left:2%; right:2%; bottom:24px; height:4px; border-radius:4px; background:var(--border); }
.cart { position:absolute; bottom:28px; width:46px; height:36px; display:grid; place-items:center; border:2px solid var(--accent); border-radius:8px 8px 5px 5px; background:var(--surface); color:var(--text); font-weight:750; transform:translateX(-50%); transition:left 700ms cubic-bezier(.2,.7,.2,1), transform 180ms ease; }
.cart::before,.cart::after { content:''; position:absolute; bottom:-8px; width:9px; height:9px; border-radius:50%; background:var(--text-muted); }
.cart::before { left:5px; }.cart::after { right:5px; }
.cart-two { border-color:var(--text-muted); }
.phase-impact .cart { transform:translateX(-50%) scale(1.12); }
.impact-flash { position:absolute; left:50%; bottom:57px; width:5px; height:34px; border-radius:50%; background:var(--accent); box-shadow:0 0 18px var(--accent); transform:translateX(-50%); }
.velocity-key { display:flex; flex-wrap:wrap; gap:10px 24px; font-variant-numeric:tabular-nums; }
.velocity-key strong { margin-right:4px; }
.result-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr)); gap:12px; }
.result-grid>div { display:grid; gap:4px; padding:12px; border:1px solid var(--border); border-radius:10px; }
.result-grid span { color:var(--text-muted); font-size:.86rem; }
.result-grid strong { font-variant-numeric:tabular-nums; }
.run-guidance { margin:0; padding:10px 12px; border-left:3px solid var(--text-muted); border-radius:6px; background:var(--surface-2); }
.run-button:disabled { cursor:not-allowed; opacity:.58; filter:saturate(.55); }
.run-button:focus-visible { outline:3px solid var(--accent); outline-offset:3px; }
.nav-links { display:inline-flex; flex-wrap:wrap; gap:16px; }
.small { font-size:.85rem; margin:0; }
@media(prefers-reduced-motion:reduce) { .cart { transition:none; } }
@media(max-width:520px) { .simulation-heading { align-items:flex-start; flex-direction:column; } }
</style>
