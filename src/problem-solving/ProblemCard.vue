<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PhysicsProblem } from './problem-bank'
import { isNumericallyCorrect } from './problem-bank'
import type { Locale } from '@/i18n/locales'

const props = defineProps<{
  problem: PhysicsProblem
  locale: Locale
  levelLabel: string
  labels: {
    given: string; find: string; formula: string; hint: string; check: string
    retry: string; correct: string; incorrect: string; worked: string
    answer: string; inputHelp: string
  }
}>()
const response = ref('')
const checked = ref(false)
const hintVisible = ref(false)
const solutionVisible = ref(false)
const correct = computed(() => checked.value && isNumericallyCorrect(props.problem, response.value))
const formattedAnswer = computed(() => new Intl.NumberFormat(props.locale, { maximumFractionDigits: 3 }).format(props.problem.answer))

function check(): void {
  if (response.value.trim() !== '') checked.value = true
}
function retry(): void {
  response.value = ''
  checked.value = false
  hintVisible.value = false
  solutionVisible.value = false
}
</script>

<template>
  <article class="problem-card card">
    <header class="problem-heading">
      <div>
        <p class="problem-topic">{{ problem.topic }} · {{ levelLabel }}</p>
        <h3>{{ problem.title }}</h3>
      </div>
      <span class="module-number">M{{ problem.module }}</span>
    </header>
    <p class="scenario">{{ problem.scenario }}</p>
    <dl class="givens">
      <div><dt>{{ labels.given }}</dt><dd>{{ problem.given }}</dd></div>
      <div><dt>{{ labels.find }}</dt><dd>{{ problem.target }} ({{ problem.unit }})</dd></div>
    </dl>
    <label class="answer-label" :for="'answer-' + problem.id">{{ labels.inputHelp }}</label>
    <div class="answer-row">
      <input :id="'answer-' + problem.id" v-model="response" type="text" inputmode="decimal"
        autocomplete="off" :disabled="checked" :aria-describedby="'answer-help-' + problem.id" />
      <span class="unit">{{ problem.unit }}</span>
    </div>
    <p :id="'answer-help-' + problem.id" class="input-help">{{ labels.inputHelp }}</p>
    <div class="actions">
      <button v-if="!hintVisible && !checked" type="button" class="btn btn-small" @click="hintVisible = true">{{ labels.hint }}</button>
      <button v-if="!checked" type="button" class="btn btn-primary btn-small" :disabled="!response.trim()" @click="check">{{ labels.check }}</button>
      <button v-else type="button" class="btn btn-small" @click="retry">{{ labels.retry }}</button>
      <button v-if="checked && !solutionVisible" type="button" class="btn btn-small" @click="solutionVisible = true">{{ labels.worked }}</button>
    </div>
    <p v-if="hintVisible && !checked" class="hint" role="status">{{ problem.hint }}</p>
    <div v-if="checked" class="feedback" :class="correct ? 'correct' : 'incorrect'" role="status" aria-live="polite">
      <strong>{{ correct ? labels.correct : labels.incorrect }}</strong>
      <span v-if="correct"> {{ labels.answer }}: {{ formattedAnswer }} {{ problem.unit }}</span>
    </div>
    <section v-if="solutionVisible" class="solution" :aria-label="labels.worked">
      <h4>{{ labels.formula }}</h4>
      <p class="formula"><code>{{ problem.formula }}</code></p>
      <ol><li v-for="(step, index) in problem.steps" :key="index">{{ step }}</li></ol>
      <p class="final-answer"><strong>{{ labels.answer }}:</strong> {{ formattedAnswer }} {{ problem.unit }}</p>
    </section>
  </article>
</template>

<style scoped>
.problem-card { display:grid; gap:12px; min-width:0; }
.problem-heading { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; }
.problem-heading h3 { margin:0; font-size:1.08rem; }
.problem-topic { margin:0 0 4px; color:var(--accent); font-size:.78rem; font-weight:700; }
.module-number { display:grid; place-items:center; flex:0 0 38px; height:34px; border-radius:9px; background:var(--accent-soft); color:var(--accent); font-size:.8rem; font-weight:750; }
.scenario { margin:0; }
.givens { display:grid; gap:8px; margin:0; padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-sm); }
.givens div { display:grid; grid-template-columns:minmax(90px, .7fr) minmax(0, 1.5fr); gap:10px; }
.givens dt { color:var(--text-muted); font-size:.84rem; }
.givens dd { margin:0; font-size:.9rem; overflow-wrap:anywhere; }
.answer-label { font-weight:650; font-size:.9rem; }
.answer-row { display:flex; align-items:center; gap:8px; max-width:360px; }
.answer-row input { width:100%; min-width:0; min-height:44px; padding:9px 11px; border:1px solid var(--border); border-radius:var(--radius-sm); background:var(--surface); color:var(--text); font:inherit; }
.answer-row input:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.unit { flex:0 0 auto; color:var(--text-muted); font-size:.9rem; }
.input-help { margin:-8px 0 0; color:var(--text-muted); font-size:.78rem; }
.actions { display:flex; flex-wrap:wrap; gap:8px; }
.btn-small { min-height:36px; padding:0 12px; font-size:.88rem; }
.btn:disabled { opacity:.5; cursor:not-allowed; }
.hint { margin:0; padding:10px 12px; border-left:3px solid var(--accent); background:var(--surface-2); }
.feedback { padding:10px 12px; border:1px solid var(--border); border-radius:var(--radius-sm); }
.feedback.correct { border-left:4px solid var(--success); }
.feedback.incorrect { border-left:4px solid var(--warn); }
.solution { padding-top:10px; border-top:1px solid var(--border); }
.solution h4 { margin:0 0 5px; font-size:.9rem; }
.formula { margin:0 0 8px; }
.formula code { display:inline-block; max-width:100%; padding:5px 8px; border-radius:5px; background:var(--surface-2); white-space:normal; overflow-wrap:anywhere; }
.solution ol { display:grid; gap:7px; padding-left:22px; }
.final-answer { margin:0; padding:10px 12px; border-radius:var(--radius-sm); background:var(--surface-2); }
@media(max-width:480px) { .givens div { grid-template-columns:1fr; gap:2px; } }
</style>
