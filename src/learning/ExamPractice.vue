<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { seededShuffle } from '@/shuffle'
import type { PracticeQuestion } from './learning-content'

const props = defineProps<{ questions: readonly PracticeQuestion[]; seed: number }>()
const { t } = useLocale()
const id = useId()
const active = ref(false)
const submitted = ref(false)
const attempt = ref(0)
const answers = ref<Record<string, string>>({})
const examQuestions = computed(() => seededShuffle(props.questions, 'chapter-exam-' + attempt.value, props.seed).slice(0, 5))
const score = computed(() => examQuestions.value.filter((question) => answers.value[question.id] === question.answer).length)
function start(): void {
  answers.value = {}
  submitted.value = false
  active.value = true
  attempt.value += 1
}
</script>

<template>
  <section class="exam-practice" :aria-labelledby="id + '-title'">
    <div>
      <h5 :id="id + '-title'">{{ t('learning.exam.title') }}</h5>
      <p class="intro">{{ t('learning.exam.intro') }}</p>
    </div>
    <p v-if="!questions.length" class="muted">{{ t('learning.exam.empty') }}</p>
    <template v-else-if="!active">
      <p class="muted">{{ questions.length }} {{ t('learning.exam.title').toLowerCase() }}</p>
      <button type="button" class="btn btn-primary btn-small" @click="start">{{ t('learning.exam.start') }}</button>
    </template>
    <template v-else>
      <ol class="exam-questions">
        <li v-for="question in examQuestions" :key="question.id">
          <p class="question">{{ question.prompt }}</p>
          <label v-for="option in seededShuffle(question.options, question.id, seed)" :key="option.id" class="option">
            <input v-model="answers[question.id]" type="radio" :name="id + '-' + question.id" :value="option.id" :disabled="submitted" />
            <span>{{ option.label }}</span>
          </label>
          <div v-if="submitted" class="answer-review" :class="answers[question.id] === question.answer ? 'right' : 'wrong'">
            <strong>{{ answers[question.id] === question.answer ? '✓' : '✗' }}</strong>
            <p>{{ t('learning.exam.explanation') }}: {{ question.explanation }}</p>
          </div>
        </li>
      </ol>
      <p v-if="submitted" class="exam-score" role="status" aria-live="polite">{{ t('learning.exam.score').replace('{score}', String(score)).replace('{total}', String(examQuestions.length)) }}</p>
      <div class="actions">
        <button v-if="!submitted" type="button" class="btn btn-primary btn-small" :disabled="Object.keys(answers).length !== examQuestions.length" @click="submitted = true">{{ t('learning.exam.submit') }}</button>
        <button v-else type="button" class="btn btn-small" @click="start">{{ t('learning.exam.restart') }}</button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.exam-practice { display: grid; gap: 12px; padding: 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-2); }
.exam-practice h5 { margin: 0; font-size: .95rem; }
.intro { margin: 3px 0 0; color: var(--text-muted); font-size: .88rem; }
.exam-questions { display: grid; gap: 16px; margin: 0; padding-left: 22px; }
.exam-questions li { padding-left: 4px; }
.question { margin: 0 0 8px; font-weight: 600; }
.option { display: flex; align-items: flex-start; gap: 8px; margin: 6px 0; font-size: .9rem; cursor: pointer; }
.option input { margin-top: 5px; accent-color: var(--accent); }
.answer-review { display: grid; grid-template-columns: auto 1fr; gap: 8px; margin-top: 8px; padding: 9px 11px; border-radius: var(--radius-sm); background: var(--surface); font-size: .88rem; }
.answer-review p { margin: 0; }
.answer-review.right { border-left: 3px solid var(--success); }
.answer-review.wrong { border-left: 3px solid var(--warn); }
.exam-score { margin: 0; font-weight: 700; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
