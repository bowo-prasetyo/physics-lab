<script setup lang="ts">
import { computed, useId } from 'vue'
import PositionTimeGraph from '@/components/PositionTimeGraph.vue'
import { graphVertices } from '@/physics'
import { useLocale } from '@/composables/useLocale'
import type { LearningGraph, LearningUi, PracticeQuestion as Question } from './learning-content'
import PracticeQuestion from './PracticeQuestion.vue'

/**
 * A graph exercise: one position–time graph, drawn with the same component as
 * the experiments, and the practice questions answered from it. The questions
 * are ordinary practice questions, so their options are shuffled and their
 * hints and explanations work as everywhere else.
 */
const props = defineProps<{
  exercise: LearningGraph
  /** The exercise's questions visible at the learner's level. */
  questions: readonly Question[]
  ui: LearningUi
  seed: number
  levelTag: (question: Question) => string | null
}>()

const { t } = useLocale()
const id = useId()
const corners = computed(() => graphVertices(props.exercise.graph.record))
const format = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(1))
</script>

<template>
  <section class="graph-practice" :aria-labelledby="`${id}-title`">
    <div>
      <h6 :id="`${id}-title`">{{ exercise.title }}</h6>
      <p class="intro">{{ exercise.intro }}</p>
    </div>
    <PositionTimeGraph
      :current="exercise.graph.record"
      :history="[]"
      :duration="exercise.graph.duration"
      :bounds="exercise.graph.bounds"
      :observer-velocity="null"
    />
    <div class="corner-table">
      <table>
        <caption>{{ t('learning.graph.corners') }}</caption>
        <tbody>
          <tr><th scope="row">{{ t('learning.graph.time') }}</th><td v-for="(p, i) in corners" :key="`t${i}`">{{ format(p.t) }}</td></tr>
          <tr><th scope="row">{{ t('learning.graph.position') }}</th><td v-for="(p, i) in corners" :key="`x${i}`">{{ format(p.x) }}</td></tr>
        </tbody>
      </table>
    </div>
    <PracticeQuestion v-for="q in questions" :key="q.id" :question="q" :ui="ui" :seed="seed" :level-tag="levelTag(q)" />
  </section>
</template>

<style scoped>
.graph-practice { display: grid; gap: 10px; min-width: 0; padding: 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-2); }
h6 { margin: 0; font-size: 1rem; }
.intro { margin: 2px 0 0; color: var(--text-muted); font-size: .9rem; }
.corner-table { max-width: 100%; overflow-x: auto; }
table { border-collapse: collapse; font-size: .84rem; font-variant-numeric: tabular-nums; }
caption { margin-bottom: 4px; color: var(--text-muted); text-align: left; }
th, td { padding: 4px 10px; border-bottom: 1px solid var(--border); text-align: center; }
th { color: var(--text-muted); font-weight: 600; text-align: left; }
</style>
