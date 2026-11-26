<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { seededShuffle } from '@/shuffle'
import type { LearningUi, PracticeQuestion } from './learning-content'
import PracticeQuestionCard from './PracticeQuestion.vue'

const props = defineProps<{ questions: readonly PracticeQuestion[]; seed: number; ui: LearningUi }>()
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
          <PracticeQuestionCard :question="question" :ui="ui" :seed="seed" mode="exam" :model-value="answers[question.id]" :disabled="submitted" @update:model-value="(value) => answers[question.id] = value" />
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
.answer-review { display: grid; grid-template-columns: auto 1fr; gap: 8px; margin-top: 8px; padding: 9px 11px; border-radius: var(--radius-sm); background: var(--surface); font-size: .88rem; }
.answer-review p { margin: 0; }
.answer-review.right { border-left: 3px solid var(--success); }
.answer-review.wrong { border-left: 3px solid var(--warn); }
.exam-score { margin: 0; font-weight: 700; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
