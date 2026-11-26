<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { seededShuffle } from '@/shuffle'
import type { LearningUi, PracticeQuestion } from './learning-content'
import PracticeQuestionCard from './PracticeQuestion.vue'

/**
 * A short mixed review of the chapter's questions from steps the learner has
 * explored. It is practice, not assessment: it keeps no score, shows each
 * answer's explanation, and is never reported as evidence of learning.
 */
const props = defineProps<{ questions: readonly PracticeQuestion[]; seed: number; ui: LearningUi }>()
const { t } = useLocale()
const id = useId()
const REVIEW_SIZE = 5
const active = ref(false)
const checked = ref(false)
const attempt = ref(0)
const answers = ref<Record<string, string>>({})
const reviewQuestions = computed(() => seededShuffle(props.questions, `chapter-review-${attempt.value}`, props.seed).slice(0, REVIEW_SIZE))
function start(): void {
  answers.value = {}
  checked.value = false
  active.value = true
  attempt.value += 1
}
</script>

<template>
  <section class="chapter-review" :aria-labelledby="`${id}-title`">
    <div>
      <h5 :id="`${id}-title`">{{ t('learning.review.title') }}</h5>
      <p class="intro">{{ t('learning.review.intro') }}</p>
    </div>
    <template v-if="!active">
      <p class="muted">{{ t('learning.review.available').replace('{count}', String(questions.length)) }}</p>
      <button type="button" class="btn btn-primary btn-small" @click="start">{{ t('learning.review.start') }}</button>
    </template>
    <template v-else>
      <ol class="review-questions">
        <li v-for="question in reviewQuestions" :key="question.id">
          <PracticeQuestionCard :question="question" :ui="ui" :seed="seed" mode="review" :model-value="answers[question.id]" :disabled="checked" @update:model-value="(value) => answers[question.id] = value" />
          <div v-if="checked" class="answer-review" :class="answers[question.id] === question.answer ? 'right' : 'wrong'">
            <strong>{{ answers[question.id] === question.answer ? ui.correctLabel : ui.incorrectLabel }}</strong>
            <p><b>{{ ui.explanationLabel }}</b> {{ question.explanation }}</p>
          </div>
        </li>
      </ol>
      <div class="actions">
        <button v-if="!checked" type="button" class="btn btn-primary btn-small" :disabled="Object.keys(answers).length !== reviewQuestions.length" @click="checked = true">{{ t('learning.review.check') }}</button>
        <button v-else type="button" class="btn btn-small" @click="start">{{ t('learning.review.again') }}</button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.chapter-review { display: grid; gap: 12px; padding: 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-2); }
.chapter-review h5 { margin: 0; font-size: .95rem; }
.intro { margin: 3px 0 0; color: var(--text-muted); font-size: .88rem; }
.muted { margin: 0; }
.review-questions { display: grid; gap: 16px; margin: 0; padding-left: 22px; }
.review-questions li { padding-left: 4px; }
.answer-review { margin-top: 8px; padding: 9px 11px; border-radius: var(--radius-sm); background: var(--surface); font-size: .88rem; }
.answer-review p { margin: 6px 0 0; }
.answer-review.right { border-left: 3px solid var(--success); }
.answer-review.wrong { border-left: 3px solid var(--warn); }
.actions { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
