<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { isNumericallyCorrect, type PhysicsProblem } from './problem-bank'
import { numericFeedback } from './numeric-feedback'

const props = defineProps<{ problem: PhysicsProblem; levelTag?: string | null }>()
const { locale, t } = useLocale()
const id = useId()
const response = ref('')
const checked = ref(false)
const hintVisible = ref(false)
const solutionVisible = ref(false)
const solutionStep = ref(0)
const solutionProgress = computed(() => {
  const labels = { en: 'Step', id: 'Langkah', ja: 'ステップ' }
  return labels[locale.value] + ' ' + solutionStep.value + ' / ' + props.problem.steps.length
})
const nextStepLabel = computed(() => ({ en: 'Show next step', id: 'Tampilkan langkah berikutnya', ja: '次のステップを表示' })[locale.value])
const completeLabel = computed(() => ({ en: 'All steps shown', id: 'Semua langkah ditampilkan', ja: 'すべてのステップを表示しました' })[locale.value])
const correct = computed(() => checked.value && isNumericallyCorrect(props.problem, response.value))
const formattedAnswer = computed(() => new Intl.NumberFormat(locale.value, { maximumSignificantDigits: 3 }).format(props.problem.answer))
const coaching = computed(() => !correct.value && checked.value ? numericFeedback(props.problem.answer, response.value, locale.value, props.problem.unit) : '')

function check(): void {
  if (response.value.trim() !== '') checked.value = true
}
function retry(): void {
  response.value = ''
  checked.value = false
  hintVisible.value = false
  solutionVisible.value = false
  solutionStep.value = 0
}
</script>

<template>
  <div class="problem-card" :aria-labelledby="`${id}-title`">
    <p :id="`${id}-title`" class="problem-title">
      <span v-if="levelTag" class="level-tag">{{ levelTag }}</span>{{ problem.title }}
    </p>
    <p class="scenario">{{ problem.scenario }}</p>
    <dl class="givens">
      <div><dt>{{ t('learning.problem.given') }}</dt><dd>{{ problem.given }}</dd></div>
      <div><dt>{{ t('learning.problem.find') }}</dt><dd>{{ problem.target }} ({{ problem.unit }})</dd></div>
    </dl>
    <label class="answer-label" :for="`${id}-answer`">{{ t('learning.problem.answerLabel') }}</label>
    <div class="answer-row">
      <input :id="`${id}-answer`" v-model="response" type="text" inputmode="decimal"
        autocomplete="off" :disabled="checked" :aria-describedby="`${id}-help`" @keydown.enter="check" />
      <span class="unit">{{ problem.unit }}</span>
    </div>
    <p :id="`${id}-help`" class="input-help">{{ t('learning.problem.inputHelp') }}</p>
    <div class="actions">
      <button v-if="!hintVisible && !checked" type="button" class="btn btn-small" @click="hintVisible = true">{{ t('learning.problem.hint') }}</button>
      <button v-if="!checked" type="button" class="btn btn-primary btn-small" :disabled="!response.trim()" @click="check">{{ t('learning.problem.check') }}</button>
      <button v-else type="button" class="btn btn-small" @click="retry">{{ t('learning.problem.retry') }}</button>
      <button v-if="checked && !solutionVisible" type="button" class="btn btn-small" @click="solutionVisible = true; solutionStep = 1">{{ t('learning.problem.worked')</button>
    </div>
    <p v-if="hintVisible && !checked" class="hint" role="status">{{ problem.hint }}</p>
    <div v-if="checked" class="feedback" :class="correct ? 'correct' : 'incorrect'" role="status" aria-live="polite">
      <strong>{{ correct ? t('learning.problem.correct') : t('learning.problem.incorrect') }}</strong>
      <p v-if="!correct" class="coaching">{{ coaching }}</p>
      <span v-if="correct"> {{ t('learning.problem.expected') }}: {{ formattedAnswer }} {{ problem.unit }}</span>
    </div>
    <section v-if="solutionVisible" class="solution" :aria-label="t('learning.problem.worked')">
      <h6>{{ t('learning.problem.formula') }}</h6>
      <p class="formula"><code>{{ problem.formula }}</code></p>
      <p class="solution-progress" aria-live="polite">{{ solutionProgress }}</p>
      <ol><li v-for="(step, index) in problem.steps.slice(0, solutionStep)" :key="index">{{ step }}</li></ol>
      <div class="actions">
        <button v-if="solutionStep < problem.steps.length" type="button" class="btn btn-primary btn-small" @click="solutionStep++">{{ nextStepLabel }}</button>
        <span v-else class="input-help" role="status">{{ completeLabel }}</span>
      </div>
      <p v-if="solutionStep === problem.steps.length" class="final-answer"><strong>{{ t('learning.problem.expected') }}:</strong> {{ formattedAnswer }} {{ problem.unit }}</p>
    </section>
  </div>
</template>

<style scoped>
.problem-card { display: grid; gap: 10px; min-width: 0; padding: 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); }
.problem-title { margin: 0; font-weight: 650; }
.level-tag { display: inline-block; margin-right: 8px; padding: 1px 8px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-size: .75rem; font-weight: 700; vertical-align: 1px; }
.scenario { margin: 0; }
.givens { display: grid; gap: 8px; margin: 0; padding: 10px 12px; background: var(--surface-2); border-radius: var(--radius-sm); }
.givens div { display: grid; grid-template-columns: minmax(70px, .5fr) minmax(0, 2fr); gap: 10px; }
.givens dt { color: var(--text-muted); font-size: .84rem; }
.givens dd { margin: 0; font-size: .9rem; overflow-wrap: anywhere; }
.answer-label { font-weight: 650; font-size: .9rem; }
.answer-row { display: flex; align-items: center; gap: 8px; max-width: 360px; }
.answer-row input { width: 100%; min-width: 0; min-height: 44px; padding: 9px 11px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); color: var(--text); font: inherit; }
.answer-row input:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.unit { flex: 0 0 auto; color: var(--text-muted); font-size: .9rem; }
.input-help { margin: -6px 0 0; color: var(--text-muted); font-size: .78rem; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; }
.btn-small { min-height: 36px; padding: 0 12px; font-size: .88rem; }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.hint { margin: 0; padding: 9px 12px; border-left: 3px solid var(--accent); background: var(--surface-2); }
.feedback { padding: 10px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); }
.feedback.correct { border-left: 4px solid var(--success); }
.coaching { margin: 6px 0 0; color: var(--text); }
.feedback.incorrect { border-left: 4px solid var(--warn); }
.solution { padding-top: 10px; border-top: 1px solid var(--border); }
.solution h6 { margin: 0 0 5px; font-size: .9rem; }
.solution-progress { margin: 0; color: var(--text-muted); font-size: .82rem; font-variant-numeric: tabular-nums; }
.formula { margin: 0 0 8px; }
.formula code { display: inline-block; max-width: 100%; padding: 5px 8px; border-radius: 5px; background: var(--surface-2); white-space: normal; overflow-wrap: anywhere; }
.solution ol { display: grid; gap: 7px; padding-left: 22px; }
.final-answer { margin: 0; padding: 10px 12px; border-radius: var(--radius-sm); background: var(--surface-2); }
@media (max-width: 480px) { .givens div { grid-template-columns: 1fr; gap: 2px; } }
</style>
