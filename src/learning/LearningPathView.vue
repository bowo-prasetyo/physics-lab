<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { getLearningContent } from '@/learning/learning-content'

const { locale } = useLocale()
const content = computed(() => getLearningContent(locale.value))
const selectedPathId = ref('foundations')
const questionIndex = ref(0)
const selectedAnswer = ref('')
const submitted = ref(false)
const hintVisible = ref(false)
const score = ref(0)
const completed = ref(false)

const selectedPath = computed(() => content.value.paths.find((path) => path.id === selectedPathId.value) ?? content.value.paths[0]!)
const question = computed(() => selectedPath.value.questions[questionIndex.value])
const totalQuestions = computed(() => selectedPath.value.questions.length)
const progress = computed(() => completed.value ? 100 : Math.round(((questionIndex.value + (submitted.value ? 1 : 0)) / totalQuestions.value) * 100))
const relatedExperimentPath = computed(() => {
  const routes: Record<string, readonly string[]> = {
    foundations: ['/space/displacement-3d', '/time/pendulum'],
    motion: ['/mechanics/newtonian', '/mechanics/momentum-collisions'],
    relativity: ['/relativity/two-perspectives', '/gravity/clock-rates'],
  }
  return routes[selectedPath.value.id]?.[questionIndex.value] ?? selectedPath.value.steps[0]!.path
})
const isCorrect = computed(() => submitted.value && selectedAnswer.value === question.value?.answer)

function selectPath(id: string): void {
  selectedPathId.value = id
  questionIndex.value = 0
  selectedAnswer.value = ''
  submitted.value = false
  hintVisible.value = false
  score.value = 0
  completed.value = false
}
function checkAnswer(): void {
  if (!selectedAnswer.value || submitted.value || !question.value) return
  submitted.value = true
  if (selectedAnswer.value === question.value.answer) score.value += 1
}
function nextQuestion(): void {
  if (!submitted.value) return
  if (questionIndex.value + 1 >= totalQuestions.value) { completed.value = true; return }
  questionIndex.value += 1
  selectedAnswer.value = ''
  submitted.value = false
  hintVisible.value = false
}
function restartPath(): void { selectPath(selectedPathId.value) }
watch(locale, () => {
  if (!content.value.paths.some((path) => path.id === selectedPathId.value)) selectedPathId.value = content.value.paths[0]!.id
  restartPath()
})
</script>

<template>
  <article class="learning container">
    <header class="learning-head">
      <p class="eyebrow">{{ content.eyebrow }}</p>
      <h1>{{ content.title }}</h1>
      <p class="lead">{{ content.intro }}</p>
    </header>

    <section aria-labelledby="paths-title">
      <h2 id="paths-title">{{ content.pathsLabel }}</h2>
      <div class="path-picker">
        <button v-for="path in content.paths" :key="path.id" type="button" class="path-choice"
          :class="{ active: selectedPathId === path.id }" :aria-pressed="selectedPathId === path.id"
          @click="selectPath(path.id)">
          <strong>{{ path.title }}</strong><span>{{ path.description }}</span>
        </button>
      </div>
    </section>

    <section class="card prerequisites" aria-labelledby="prerequisites-title">
      <h2 id="prerequisites-title">{{ content.prerequisitesLabel }}</h2>
      <p>{{ selectedPath.prerequisites }}</p>
    </section>

    <section aria-labelledby="sequence-title">
      <h2 id="sequence-title">{{ content.sequenceLabel }}</h2>
      <ol class="sequence">
        <li v-for="(step, index) in selectedPath.steps" :key="step.path" class="sequence-step">
          <span class="step-number">{{ index + 1 }}</span>
          <div class="step-copy">
            <h3>{{ step.title }}</h3><p>{{ step.idea }}</p>
            <details class="prerequisite-detail"><summary>{{ content.prerequisitesLabel }}</summary><p>{{ step.prerequisite }}</p></details>
            <RouterLink class="experiment-link" :to="step.path">{{ step.experiment }} <span aria-hidden="true">→</span></RouterLink>
          </div>
        </li>
      </ol>
    </section>

    <section class="practice card" aria-labelledby="practice-title">
      <div class="practice-heading">
        <div><p class="eyebrow">{{ content.practiceLabel }}</p><h2 id="practice-title">{{ content.questionLabel }} {{ Math.min(questionIndex + 1, totalQuestions) }} / {{ totalQuestions }}</h2></div>
        <p class="score">{{ content.scoreLabel }}: {{ score }} / {{ totalQuestions }}</p>
      </div>
      <div class="progress-track" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100" :aria-label="content.practiceLabel"><span :style="{ width: progress + '%' }"></span></div>

      <div v-if="!completed && question" class="question-area">
        <h3>{{ question.prompt }}</h3>
        <fieldset class="answer-options" :disabled="submitted">
          <legend class="visually-hidden">{{ content.chooseLabel }}</legend>
          <label v-for="option in question.options" :key="option.id" class="answer-option" :class="{ selected: selectedAnswer === option.id }">
            <input v-model="selectedAnswer" type="radio" name="practice-answer" :value="option.id" /><span>{{ option.label }}</span>
          </label>
        </fieldset>
        <div class="question-actions">
          <button v-if="!hintVisible && !submitted" type="button" class="btn" @click="hintVisible = true">{{ content.hintLabel }}</button>
          <button v-if="!submitted" type="button" class="btn btn-primary" :disabled="!selectedAnswer" @click="checkAnswer">{{ content.checkLabel }}</button>
          <button v-else type="button" class="btn btn-primary" @click="nextQuestion">{{ questionIndex + 1 === totalQuestions ? content.completeLabel : content.nextLabel }}</button>
        </div>
        <p v-if="hintVisible && !submitted" class="hint" role="status">{{ question.hint }}</p>
        <div v-if="submitted" class="answer-feedback" :class="{ correct: isCorrect, incorrect: !isCorrect }" role="status" aria-live="polite">
          <strong>{{ isCorrect ? content.correctLabel : content.incorrectLabel }}</strong>
          <h4>{{ content.explanationLabel }}</h4><p>{{ question.explanation }}</p>
          <RouterLink :to="relatedExperimentPath">{{ content.relatedExperimentLabel }}</RouterLink>
        </div>
      </div>
      <div v-else class="completion" role="status">
        <h3>{{ content.completeLabel }}</h3><p>{{ content.scoreLabel }}: <strong>{{ score }} / {{ totalQuestions }}</strong></p>
        <button type="button" class="btn btn-primary" @click="restartPath">{{ content.restartLabel }}</button>
      </div>
      <p class="privacy-note">{{ content.privacyNote }}</p>
    </section>
  </article>
</template>

<style scoped>
.learning { display:flex; flex-direction:column; gap:30px; padding-top:36px; padding-bottom:56px; }
.learning-head { max-width:780px; }
.eyebrow { margin:0 0 8px; color:var(--accent); font-size:.78rem; font-weight:750; letter-spacing:.07em; text-transform:uppercase; }
.learning h1 { max-width:22ch; margin-bottom:12px; font-size:clamp(2rem,5vw,3rem); letter-spacing:-.035em; }
.lead { max-width:72ch; color:var(--text-muted); font-size:1.08rem; }
.path-picker { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr)); gap:12px; }
.path-choice { display:grid; gap:7px; min-height:112px; padding:16px; text-align:left; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); cursor:pointer; font:inherit; }
.path-choice:hover,.path-choice:focus-visible { border-color:var(--accent); }
.path-choice.active { border:2px solid var(--accent); background:var(--accent-soft); padding:15px; }
.path-choice span { color:var(--text-muted); font-size:.9rem; line-height:1.45; }
.prerequisites { border-left:4px solid var(--accent); }
.prerequisites h2 { font-size:1.05rem; margin-bottom:6px; }
.prerequisites p { margin:0; color:var(--text-muted); }
.sequence { display:grid; gap:12px; margin:0; padding:0; list-style:none; }
.sequence-step { display:grid; grid-template-columns:38px minmax(0,1fr); gap:12px; align-items:start; }
.step-number { display:grid; place-items:center; width:36px; height:36px; border-radius:50%; background:var(--accent-soft); color:var(--accent); font-weight:750; }
.step-copy { min-width:0; padding:4px 0 16px; border-bottom:1px solid var(--border); }
.step-copy h3 { margin:0 0 5px; font-size:1.05rem; }
.step-copy > p { margin:0 0 8px; color:var(--text-muted); }
.prerequisite-detail { margin:8px 0; color:var(--text-muted); font-size:.9rem; }
.prerequisite-detail summary { width:fit-content; cursor:pointer; color:var(--accent); font-weight:650; }
.prerequisite-detail p { margin:7px 0 0; }
.experiment-link { display:inline-flex; gap:7px; align-items:center; font-weight:700; text-decoration:none; }
.practice { display:grid; gap:16px; }
.practice-heading { display:flex; justify-content:space-between; align-items:end; flex-wrap:wrap; gap:8px; }
.practice-heading h2 { margin:0; }
.practice-heading .eyebrow { margin-bottom:4px; }
.score { margin:0; color:var(--text-muted); font-size:.9rem; font-variant-numeric:tabular-nums; }
.progress-track { height:7px; overflow:hidden; border-radius:99px; background:var(--surface-2); }
.progress-track span { display:block; height:100%; background:var(--accent); transition:width .2s ease; }
.question-area h3 { max-width:70ch; margin-bottom:16px; font-size:1.12rem; }
.answer-options { display:grid; gap:8px; min-width:0; margin:0; padding:0; border:0; }
.answer-option { display:flex; align-items:flex-start; gap:10px; padding:12px; border:1px solid var(--border); border-radius:var(--radius-sm); cursor:pointer; }
.answer-option.selected { border-color:var(--accent); background:var(--accent-soft); }
.answer-option input { flex:0 0 auto; margin-top:4px; accent-color:var(--accent); }
.question-actions { display:flex; flex-wrap:wrap; gap:9px; margin-top:16px; }
.question-actions .btn:disabled { opacity:.48; cursor:not-allowed; }
.hint { margin:12px 0 0; padding:10px 12px; border-left:3px solid var(--accent); background:var(--surface-2); }
.answer-feedback { margin-top:16px; padding:14px; border:1px solid var(--border); border-radius:var(--radius-sm); }
.answer-feedback.correct { border-left:4px solid var(--success, var(--accent)); }
.answer-feedback.incorrect { border-left:4px solid var(--warn, var(--accent)); }
.answer-feedback h4 { margin:10px 0 4px; }
.answer-feedback p { margin:0 0 8px; }
.completion { padding:10px 0; }
.privacy-note { margin:0; color:var(--text-muted); font-size:.8rem; }
.visually-hidden { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
@media(max-width:560px) { .learning { gap:24px; padding-top:24px; } .practice { padding:16px; } .sequence-step { grid-template-columns:32px minmax(0,1fr); gap:9px; } .step-number { width:30px; height:30px; } }
</style>
