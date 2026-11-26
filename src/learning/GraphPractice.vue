<script setup lang="ts">
import { computed, useId } from 'vue'
import FunctionGraph from '@/components/FunctionGraph.vue'
import PositionTimeGraph from '@/components/PositionTimeGraph.vue'
import { graphVertices } from '@/physics'
import { useLocale } from '@/composables/useLocale'
import type { LearningGraph, LearningUi, PracticeQuestion as Question } from './learning-content'
import PracticeQuestion from './PracticeQuestion.vue'

/**
 * A graph exercise: one graph and the practice questions answered from it.
 * Position–time runs are drawn with the experiments' PositionTimeGraph; model
 * curves with FunctionGraph, from a function that calls the physics engine.
 * The questions are ordinary practice questions, so their options are
 * shuffled and their hints and explanations work as everywhere else.
 */
const props = defineProps<{
  exercise: LearningGraph
  /** The exercise's questions visible at the learner's level. */
  questions: readonly Question[]
  ui: LearningUi
  seed: number
  levelTag: (question: Question) => string | null
}>()

const { locale, t } = useLocale()
const id = useId()
const format = (value: number) => new Intl.NumberFormat(locale.value, { maximumFractionDigits: 2 }).format(value)

/** Rows of the value table: the run's corner points, or the curve at the listed x-values. */
const table = computed(() => {
  const graph = props.exercise.graph
  if (graph.kind === 'motion') {
    const corners = graphVertices(graph.record)
    return {
      caption: t('learning.graph.corners'),
      rows: [
        { label: t('learning.graph.time'), values: corners.map((p) => format(p.t)) },
        { label: t('learning.graph.position'), values: corners.map((p) => format(p.x)) },
      ],
    }
  }
  return {
    caption: t('learning.graph.values'),
    rows: [
      { label: props.exercise.xLabel ?? '', values: graph.table.map(format) },
      { label: props.exercise.yLabel ?? '', values: graph.table.map((x) => format(graph.f(x))) },
    ],
  }
})
const description = computed(() =>
  t('learning.graph.description').replace('{y}', props.exercise.yLabel ?? '').replace('{x}', props.exercise.xLabel ?? ''))
</script>

<template>
  <section class="graph-practice" :aria-labelledby="`${id}-title`">
    <div>
      <h6 :id="`${id}-title`">{{ exercise.title }}</h6>
      <p class="intro">{{ exercise.intro }}</p>
    </div>
    <PositionTimeGraph
      v-if="exercise.graph.kind === 'motion'"
      :current="exercise.graph.record"
      :history="[]"
      :duration="exercise.graph.duration"
      :bounds="exercise.graph.bounds"
      :observer-velocity="null"
    />
    <FunctionGraph
      v-else
      :f="exercise.graph.f"
      :x="exercise.graph.x"
      :y="exercise.graph.y"
      :x-label="exercise.xLabel ?? ''"
      :y-label="exercise.yLabel ?? ''"
      :description="description"
    />
    <div class="value-table">
      <table>
        <caption>{{ table.caption }}</caption>
        <tbody>
          <tr v-for="row in table.rows" :key="row.label"><th scope="row">{{ row.label }}</th><td v-for="(value, i) in row.values" :key="i">{{ value }}</td></tr>
        </tbody>
      </table>
    </div>
    <!-- Reading prompts only: the guide never shows values, which would answer the questions below. -->
    <aside class="interpretation-guide" :aria-label="t('learning.graph.interpretation')">
      <h6>{{ t('learning.graph.interpretation') }}</h6>
      <ul>
        <li>{{ t('learning.graph.axesPrompt') }}</li>
        <li>{{ exercise.graph.kind === 'motion' ? t('learning.graph.motionSlope') : t('learning.graph.ratePrompt') }}</li>
        <li>{{ t('learning.graph.shapePrompt') }}</li>
      </ul>
    </aside>
    <PracticeQuestion v-for="q in questions" :key="q.id" :question="q" :ui="ui" :seed="seed" :level-tag="levelTag(q)" />
  </section>
</template>

<style scoped>
.graph-practice { display: grid; gap: 10px; min-width: 0; padding: 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-2); }
h6 { margin: 0; font-size: 1rem; }
.interpretation-guide { padding: 12px 14px; border-radius: var(--radius-sm); background: var(--surface); border: 1px solid var(--border); }
.interpretation-guide h6 { margin-bottom: 6px; }
.interpretation-guide ul { margin: 0; padding-left: 20px; color: var(--text-muted); font-size: .88rem; }
.intro { margin: 2px 0 0; color: var(--text-muted); font-size: .9rem; }
.value-table { max-width: 100%; overflow-x: auto; }
table { border-collapse: collapse; font-size: .84rem; font-variant-numeric: tabular-nums; }
caption { margin-bottom: 4px; color: var(--text-muted); text-align: left; }
th, td { padding: 4px 10px; border-bottom: 1px solid var(--border); text-align: center; }
th { color: var(--text-muted); font-weight: 600; text-align: left; white-space: nowrap; }
</style>
