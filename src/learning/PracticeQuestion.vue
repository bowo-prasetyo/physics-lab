<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import type { LearningUi, PracticeQuestion } from './learning-content'
import { seededShuffle } from '@/shuffle'

const props = defineProps<{ question: PracticeQuestion; ui: LearningUi; seed: number; levelTag?: string | null }>()
const id = useId()
const selected = ref('')
const submitted = ref(false)
const hintVisible = ref(false)
// Options appear in a per-session order, so a fixed position never wins.
const options = computed(() => seededShuffle(props.question.options, props.question.id, props.seed))
const correct = computed(() => submitted.value && selected.value === props.question.answer)

function check(): void {
  if (selected.value) submitted.value = true
}
function retry(): void {
  selected.value = ''
  submitted.value = false
  hintVisible.value = false
}
</script>

<template>
  <div class="practice-question" :aria-labelledby="`${id}-prompt`">
    <p :id="`${id}-prompt`" class="prompt">
      <span v-if="levelTag" class="level-tag">{{ levelTag }}</span>{{ question.prompt }}
    </p>
    <fieldset class="answer-options" :disabled="submitted">
      <legend class="visually-hidden">{{ ui.chooseLabel }}</legend>
      <label v-for="option in options" :key="option.id" class="answer-option" :class="{ selected: selected === option.id }">
        <input v-model="selected" type="radio" :name="id" :value="option.id" /><span>{{ option.label }}</span>
      </label>
    </fieldset>
    <div class="question-actions">
      <template v-if="!submitted">
        <button v-if="!hintVisible" type="button" class="btn btn-small" @click="hintVisible = true">{{ ui.hintLabel }}</button>
        <button type="button" class="btn btn-primary btn-small" :disabled="!selected" @click="check">{{ ui.checkLabel }}</button>
      </template>
      <button v-else type="button" class="btn btn-small" @click="retry">{{ ui.tryAgainLabel }}</button>
    </div>
    <p v-if="hintVisible && !submitted" class="hint" role="status">{{ question.hint }}</p>
    <div v-if="submitted" class="feedback" :class="correct ? 'correct' : 'incorrect'" role="status" aria-live="polite">
      <strong>{{ correct ? ui.correctLabel : ui.incorrectLabel }}</strong>
      <p><b>{{ ui.explanationLabel }}</b> {{ question.explanation }}</p>
    </div>
  </div>
</template>

<style scoped>
.practice-question { display: grid; gap: 10px; padding: 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); }
.prompt { margin: 0; font-weight: 650; }
.level-tag { display: inline-block; margin-right: 8px; padding: 1px 8px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-size: .75rem; font-weight: 700; vertical-align: 1px; }
.answer-options { display: grid; gap: 6px; min-width: 0; margin: 0; padding: 0; border: 0; }
.answer-option { display: flex; align-items: flex-start; gap: 10px; padding: 9px 11px; border: 1px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; }
.answer-option.selected { border-color: var(--accent); background: var(--accent-soft); }
.answer-option input { flex: 0 0 auto; margin-top: 4px; accent-color: var(--accent); }
.question-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.btn-small { min-height: 36px; padding: 0 12px; font-size: .88rem; }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.hint { margin: 0; padding: 9px 12px; border-left: 3px solid var(--accent); background: var(--surface-2); }
.feedback { padding: 10px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); }
.feedback.correct { border-left: 4px solid var(--success); }
.feedback.incorrect { border-left: 4px solid var(--warn); }
.feedback p { margin: 6px 0 0; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
</style>
