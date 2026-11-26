<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { useLevel } from '@/composables/useLevel'
import { atLeast } from '@/levels'
import { newSeed } from '@/shuffle'
import { getLearningPath } from './learning-content'
import { isExplored } from './session-progress'
import PracticeQuestion from './PracticeQuestion.vue'
import ProblemCard from './ProblemCard.vue'
import GraphPractice from './GraphPractice.vue'
import ExamPractice from './ExamPractice.vue'
import { isProgressPersistenceEnabled, setProgressPersistenceEnabled } from './session-progress'

const { locale, t } = useLocale()
const level = useLevel()
const route = useRoute()
const router = useRouter()
const path = computed(() => getLearningPath(locale.value))
const ui = computed(() => path.value.ui)
// One shuffle seed per visit: options keep their order while the learner works.
const seed = newSeed()
const rememberProgress = ref(isProgressPersistenceEnabled())
watch(rememberProgress, setProgressPersistenceEnabled)
const totalSteps = computed(() => path.value.chapters.reduce((sum, item) => sum + item.steps.length, 0))
const totalExplored = computed(() => path.value.chapters.reduce((sum, item) => sum + exploredCount(item.steps), 0))
const examQuestions = computed(() => chapter.value.steps.filter((step) => isExplored(step.path)).flatMap((step) => [
  ...visibleQuestions(step.questions),
  ...step.graphs.flatMap((graph) => visibleQuestions(graph.questions)),
  ...visibleSyntheses(step.syntheses).filter((item) => item.requires.every((required) => isExplored(required.path))).map((item) => item.question),
]))

// The chosen chapter is in the link (#/learning?module=4), so a teacher can share it.
const chapterFromQuery = () => {
  const n = Number(route.query.module)
  return path.value.chapters.some((c) => c.number === n) ? n : 1
}
const chapterNumber = ref(chapterFromQuery())
watch(() => route.query.module, () => { chapterNumber.value = chapterFromQuery() })
function choose(n: number): void {
  chapterNumber.value = n
  router.replace({ query: { ...route.query, module: String(n) } })
}
const chapter = computed(() => path.value.chapters.find((c) => c.number === chapterNumber.value) ?? path.value.chapters[0]!)

const exploredCount = (steps: readonly { path: string }[]) => steps.filter((s) => isExplored(s.path)).length
const progressText = (steps: readonly { path: string }[]) =>
  ui.value.progressLabel.replace('{done}', String(exploredCount(steps))).replace('{total}', String(steps.length))

const levelName = (min: 'beginner' | 'intermediate' | 'advanced') =>
  min === 'beginner' ? null : t(min === 'intermediate' ? 'app.level.intermediate' : 'app.level.advanced')
const visibleQuestions = <T extends { minLevel: 'beginner' | 'intermediate' | 'advanced' }>(questions: readonly T[]): T[] =>
  questions.filter((q) => atLeast(level.value, q.minLevel))
const hasHigherLevelQuestions = computed(() => chapter.value.steps.some((s) =>
  [...s.questions, ...s.graphs.flatMap((g) => g.questions), ...s.syntheses.map((x) => x.question), ...s.problems].some((q) => !atLeast(level.value, q.minLevel))))
const visibleSyntheses = <T extends { question: { minLevel: 'beginner' | 'intermediate' | 'advanced' } }>(items: readonly T[]): T[] =>
  items.filter((item) => atLeast(level.value, item.question.minLevel))
const listTitles = (items: readonly { title: string }[]) =>
  new Intl.ListFormat(locale.value, { type: 'conjunction' }).format(items.map((i) => t('learning.synthesis.quoted').replace('{title}', i.title)))
</script>

<template>
  <article class="learning container">
    <header class="learning-head">
      <p class="eyebrow">{{ ui.eyebrow }}</p>
      <h1>{{ ui.title }}</h1>
      <p class="lead">{{ ui.intro }}</p>
    </header>

    <nav class="chapters" :aria-label="ui.chaptersLabel">
      <button v-for="c in path.chapters" :key="c.number" type="button" class="chapter-choice"
        :class="{ active: c.number === chapter.number }" :aria-pressed="c.number === chapter.number" @click="choose(c.number)">
        <span class="chapter-number">{{ ui.moduleLabel }} {{ c.number }}</span>
        <strong>{{ c.title }}</strong>
        <span class="chapter-progress">{{ progressText(c.steps) }}</span>
      </button>
    </nav>

    <section class="chapter" aria-labelledby="chapter-title">
      <header class="chapter-head">
        <p class="eyebrow">{{ ui.moduleLabel }} {{ chapter.number }}</p>
        <h2 id="chapter-title">{{ chapter.title }}</h2>
        <p class="role">{{ chapter.role }}</p>
      </header>

      <div class="card prerequisites">
        <h3>{{ ui.prerequisitesLabel }}</h3>
        <p>{{ chapter.prerequisites }}</p>
      </div>

      <section class="progress-dashboard card" :aria-label="t('learning.progress.title')">
        <div class="progress-copy">
          <strong>{{ t('learning.progress.title') }}</strong>
          <span class="muted">{{ t('learning.progress.summary').replace('{done}', String(totalExplored)).replace('{total}', String(totalSteps)) }}</span>
        </div>
        <div class="progress-track" role="progressbar" :aria-valuenow="totalExplored" :aria-valuemin="0" :aria-valuemax="totalSteps" :aria-label="t('learning.progress.aria')">
          <span :style="{ width: (totalSteps ? (totalExplored / totalSteps) * 100 : 0) + '%' }"></span>
        </div>
        <label class="remember-toggle"><input v-model="rememberProgress" type="checkbox" /> {{ t('learning.progress.remember') }}</label>
        <p class="privacy-note">{{ rememberProgress ? t('learning.progress.localPrivacy') : t('learning.progress.sessionPrivacy') }}</p>
      </section>
      <h3 class="steps-title">{{ ui.stepsLabel }}</h3>
      <p v-if="hasHigherLevelQuestions" class="muted small">{{ ui.moreAtHigherLevels }}</p>
      <ol class="steps">
        <li v-for="(step, index) in chapter.steps" :key="step.path" class="step card">
          <div class="step-head">
            <span class="step-number">{{ index + 1 }}</span>
            <div>
              <h4><RouterLink :to="step.path">{{ step.title }}</RouterLink></h4>
              <span class="status" :class="{ done: isExplored(step.path) }">{{ isExplored(step.path) ? `✓ ${ui.exploredLabel}` : ui.notExploredLabel }}</span>
            </div>
          </div>
          <p class="focus"><strong>{{ step.focus }}.</strong> {{ step.idea }}</p>
          <details class="prerequisite-detail"><summary>{{ ui.prerequisitesLabel }}</summary><p>{{ step.prerequisite }}</p></details>
          <RouterLink class="experiment-link" :to="step.path">{{ ui.openLabel }} <span aria-hidden="true">→</span></RouterLink>

          <div class="practice">
            <h5>{{ ui.practiceLabel }}</h5>
            <p v-if="!isExplored(step.path)" class="locked">🔒 {{ ui.lockedLabel }}</p>
            <template v-else>
              <PracticeQuestion v-for="q in visibleQuestions(step.questions)" :key="q.id" :question="q" :ui="ui" :seed="seed" :level-tag="levelName(q.minLevel)" />
              <template v-for="exercise in step.graphs" :key="exercise.id">
                <template v-if="visibleQuestions(exercise.questions).length">
                  <h5 class="apply-title">{{ t('learning.graph.title') }}</h5>
                  <GraphPractice :exercise="exercise" :questions="visibleQuestions(exercise.questions)" :ui="ui" :seed="seed" :level-tag="(q) => levelName(q.minLevel)" />
                </template>
              </template>
              <template v-if="visibleSyntheses(step.syntheses).length">
                <h5 class="apply-title">{{ t('learning.synthesis.title') }}</h5>
                <div v-for="item in visibleSyntheses(step.syntheses)" :key="item.question.id" class="synthesis">
                  <p class="apply-intro">{{ t('learning.synthesis.combines').replace('{experiments}', listTitles(item.requires)) }}</p>
                  <PracticeQuestion v-if="item.requires.every((r) => isExplored(r.path))" :question="item.question" :ui="ui" :seed="seed" :level-tag="levelName(item.question.minLevel)" />
                  <div v-else class="synthesis-locked">
                    <p class="locked">🔒 {{ t('learning.synthesis.locked') }}</p>
                    <ul>
                      <li v-for="r in item.requires" :key="r.path">
                        <RouterLink :to="r.path">{{ r.title }}</RouterLink>
                        <span class="status" :class="{ done: isExplored(r.path) }">{{ isExplored(r.path) ? `✓ ${ui.exploredLabel}` : ui.notExploredLabel }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
              <template v-if="visibleQuestions(step.problems).length">
                <h5 class="apply-title">{{ t('learning.apply.title') }}</h5>
                <p class="apply-intro">{{ t('learning.apply.intro') }}</p>
                <ProblemCard v-for="p in visibleQuestions(step.problems)" :key="p.id" :problem="p" :level-tag="levelName(p.minLevel)" />
              </template>
              <ExamPractice v-if="index === chapter.steps.length - 1" :questions="examQuestions" :seed="seed" />
            </template>
          </div>
        </li>
      </ol>

    </section>
  </article>
</template>

<style scoped>
.learning { display: flex; flex-direction: column; gap: 26px; padding-top: 36px; padding-bottom: 56px; }
.learning-head { max-width: 800px; }
.eyebrow { margin: 0 0 8px; color: var(--accent); font-size: .78rem; font-weight: 750; letter-spacing: .07em; text-transform: uppercase; }
.learning h1 { max-width: 22ch; margin-bottom: 12px; font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -.035em; }
.lead { max-width: 75ch; color: var(--text-muted); font-size: 1.05rem; }
.chapters { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 170px), 1fr)); gap: 10px; }
.chapter-choice { display: grid; gap: 3px; align-content: start; padding: 12px 14px; text-align: left; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); cursor: pointer; font: inherit; }
.chapter-choice:hover, .chapter-choice:focus-visible { border-color: var(--accent); }
.chapter-choice.active { border: 2px solid var(--accent); background: var(--accent-soft); padding: 11px 13px; }
.chapter-number { color: var(--accent); font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
.chapter-progress { color: var(--text-muted); font-size: .8rem; }
.chapter { display: grid; gap: 14px; }
.chapter-head h2 { margin: 0 0 6px; }
.role { margin: 0; max-width: 75ch; color: var(--text-muted); }
.prerequisites { border-left: 4px solid var(--accent); }
.prerequisites h3 { margin: 0 0 6px; font-size: 1rem; }
.prerequisites p { margin: 0; color: var(--text-muted); }
.steps-title { margin: 8px 0 0; }
.small { margin: 0; font-size: .88rem; }
.steps { display: grid; gap: 14px; margin: 0; padding: 0; list-style: none; }
.step { display: grid; gap: 10px; }
.step-head { display: flex; gap: 12px; align-items: flex-start; }
.step-head h4 { margin: 0 0 2px; font-size: 1.1rem; }
.step-head h4 a { text-decoration: none; }
.step-number { display: grid; place-items: center; flex: 0 0 auto; width: 34px; height: 34px; border-radius: 50%; background: var(--accent-soft); color: var(--accent); font-weight: 750; }
.status { color: var(--text-muted); font-size: .82rem; }
.status.done { color: var(--success); font-weight: 650; }
.focus { margin: 0; }
.prerequisite-detail { color: var(--text-muted); font-size: .9rem; }
.prerequisite-detail summary { width: fit-content; cursor: pointer; color: var(--accent); font-weight: 650; }
.prerequisite-detail p { margin: 6px 0 0; }
.experiment-link { width: fit-content; font-weight: 700; text-decoration: none; }
.practice { display: grid; gap: 10px; padding-top: 10px; border-top: 1px solid var(--border); }
.practice h5 { margin: 0; font-size: .9rem; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); }
.locked { margin: 0; color: var(--text-muted); }
.practice .apply-title { margin-top: 6px; }
.apply-intro { margin: -4px 0 0; color: var(--text-muted); font-size: .9rem; }
.synthesis { display: grid; gap: 8px; }
.synthesis-locked { padding: 10px 12px; border: 1px dashed var(--border); border-radius: var(--radius-sm); }
.synthesis-locked ul { display: grid; gap: 4px; margin: 6px 0 0; padding: 0; list-style: none; }
.synthesis-locked li { display: flex; flex-wrap: wrap; gap: 8px; align-items: baseline; }
.privacy-note { margin: 0; color: var(--text-muted); font-size: .8rem; }
.progress-dashboard { display: grid; gap: 10px; padding: 14px 16px; }
.progress-copy { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4px 12px; }
.progress-copy span { font-size: .88rem; }
.progress-track { height: 9px; overflow: hidden; border-radius: 999px; background: var(--surface-2); }
.progress-track span { display: block; height: 100%; border-radius: inherit; background: var(--success); transition: width .2s ease; }
.remember-toggle { display: flex; align-items: center; gap: 8px; width: fit-content; font-size: .9rem; font-weight: 600; cursor: pointer; }
.remember-toggle input { width: 18px; height: 18px; accent-color: var(--accent); }
@media (max-width: 560px) { .learning { gap: 20px; padding-top: 24px; } }
</style>
