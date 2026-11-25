<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { useRoute } from 'vue-router'
import { markExplored } from '@/learning/session-progress'
import type { PredictionText } from '@/experiments/prediction'
import { useLocale } from '@/composables/useLocale'

const props = defineProps<{ prediction: PredictionText; observed: boolean; index: number; hint?: string | null }>()
const { t } = useLocale()
const id = useId()
const selected = ref<string | null>(null)
const committed = ref(false)
const stage = computed<'predict' | 'observe' | 'explain'>(() =>
  !committed.value ? 'predict' : props.observed ? 'explain' : 'observe',
)
const chosen = computed(() => props.prediction.options.find((o) => o.id === selected.value))
const correctOption = computed(() => props.prediction.options.find((o) => o.id === props.prediction.correct))
const wasRight = computed(() => selected.value === props.prediction.correct)
function commit() { if (selected.value) committed.value = true }
function retry() { selected.value = null; committed.value = false }
// Record (in memory only) that the learner has tested a prediction on this
// experiment, so the learning path can unlock its practice questions.
const route = useRoute()
watch(stage, (value) => { if (value === 'explain' && route?.path) markExplored(route.path) }, { immediate: true })
</script>

<template>
  <article class="prediction card" :class="stage" :aria-labelledby="`${id}-q`">
    <ol class="steps" :aria-label="t('app.prediction.progress')">
      <li :class="{ current: stage === 'predict', done: stage !== 'predict' }">{{ t('app.prediction.predict') }}</li>
      <li :class="{ current: stage === 'observe', done: stage === 'explain' }">{{ t('app.prediction.observe') }}</li>
      <li :class="{ current: stage === 'explain' }">{{ t('app.prediction.explain') }}</li>
    </ol>
    <h3 :id="`${id}-q`"><span class="muted">Q{{ index }}.</span> {{ prediction.question }}</h3>
    <form v-if="stage === 'predict'" @submit.prevent="commit">
      <fieldset>
        <legend class="sr-only">{{ t('app.prediction.yourPrediction') }}</legend>
        <label v-for="option in prediction.options" :key="option.id" class="option" :class="{ chosen: selected === option.id }">
          <input v-model="selected" type="radio" :name="id" :value="option.id" />
          <span>{{ option.label }}</span>
        </label>
      </fieldset>
      <button class="btn btn-primary" type="submit" :disabled="!selected">{{ t('app.prediction.lock') }}</button>
    </form>
    <div v-else-if="stage === 'observe'" class="observe">
      <p><strong>{{ t('app.prediction.predictionLabel') }}</strong> {{ chosen?.label }}</p>
      <p class="task"><span class="pill">{{ t('app.prediction.nowTest') }}</span> {{ prediction.task }}</p>
      <p v-if="hint" class="hint" role="status">{{ hint }}</p>
    </div>
    <div v-else class="explain" aria-live="polite">
      <p class="verdict" :class="wasRight ? 'right' : 'wrong'">
        {{ wasRight ? t('app.prediction.matches') : t('app.prediction.differs') }}
      </p>
      <p v-if="!wasRight"><strong>{{ t('app.prediction.youPredicted') }}</strong> {{ chosen?.label }}</p>
      <p><strong>{{ t('app.prediction.observed') }}</strong> {{ correctOption?.label }}</p>
      <p>{{ prediction.explanation }}</p>
      <button class="btn" type="button" @click="retry">{{ t('app.prediction.again') }}</button>
    </div>
  </article>
</template>

<style scoped>
.prediction { display:flex; flex-direction:column; gap:4px; }
.steps { display:flex; flex-wrap:wrap; gap:6px; list-style:none; margin:0 0 8px; padding:0; font-size:.75rem; font-weight:700; letter-spacing:.04em; text-transform:uppercase; }
.steps li { padding:2px 8px; border-radius:999px; background:var(--surface-2); color:var(--text-muted); }
.steps li.current { background:var(--accent); color:var(--on-accent); }
.steps li.done { background:var(--accent-soft); color:var(--accent); }
h3 { font-size:1rem; font-weight:650; }
fieldset { border:0; margin:0 0 12px; padding:0; display:grid; gap:6px; }
.option { display:flex; align-items:flex-start; gap:10px; padding:8px 10px; border:1px solid var(--border); border-radius:var(--radius-sm); cursor:pointer; }
.option.chosen { border-color:var(--accent); background:var(--accent-soft); }
.option input { margin-top:4px; accent-color:var(--accent); }
.pill { display:inline-block; padding:1px 8px; margin-right:4px; border-radius:999px; background:var(--warn-soft); color:var(--warn); font-size:.78rem; font-weight:700; }
.hint { border-left:3px solid var(--warn); background:var(--warn-soft); border-radius:var(--radius-sm); padding:8px 12px; font-size:.92rem; }
.verdict { font-weight:700; }
.verdict.right { color:var(--success); }
.verdict.wrong { color:var(--warn); }
.explain .btn { align-self:flex-start; }
</style>
