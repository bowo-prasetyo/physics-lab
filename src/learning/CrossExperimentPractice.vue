<script setup lang="ts">
import { computed, useId } from 'vue'
import type { Locale } from '@/i18n/locales'
import type { LearningUi } from './learning-content'
import type { Level } from '@/levels'
import { atLeast } from '@/levels'
import { getCrossExperimentChallenges, getCrossExperimentHeading } from './cross-experiment'
import { isExplored } from './session-progress'
import PracticeQuestion from './PracticeQuestion.vue'

const headingId = useId()
const props = defineProps<{
  stepPath: string
  locale: Locale
  ui: LearningUi
  level: Level
  seed: number
}>()

const copy = computed(() => getCrossExperimentHeading(props.locale))
const challenges = computed(() => getCrossExperimentChallenges(props.locale)
  .filter((item) => item.anchorPath === props.stepPath && atLeast(props.level, item.question.minLevel)))
</script>

<template>
  <section v-if="challenges.length" class="cross-experiment" :aria-labelledby="headingId">
    <header>
      <h5 :id="headingId">{{ copy.title }}</h5>
      <p>{{ copy.intro }}</p>
    </header>
    <article v-for="challenge in challenges" :key="challenge.id" class="challenge card">
      <div>
        <h6>{{ challenge.title }}</h6>
        <p class="challenge-intro">{{ challenge.intro }}</p>
      </div>
      <template v-if="challenge.prerequisites.every((item) => isExplored(item.path))">
        <PracticeQuestion :question="challenge.question" :ui="ui" :seed="seed" />
      </template>
      <div v-else class="locked">
        <p>{{ copy.locked }}</p>
        <p class="prerequisite-label">{{ challenge.prerequisiteLabel }}</p>
        <ul>
          <li v-for="item in challenge.prerequisites" :key="item.path">
            <span aria-hidden="true">{{ isExplored(item.path) ? '✓' : '○' }}</span>
            <RouterLink :to="item.path">{{ item.title }}</RouterLink>
            <span class="status">{{ isExplored(item.path) ? ui.exploredLabel : ui.notExploredLabel }}</span>
          </li>
        </ul>
      </div>
    </article>
  </section>
</template>

<style scoped>
.cross-experiment { display: grid; gap: 12px; margin-top: 6px; }
.cross-experiment > header h5 { margin: 0 0 5px; font-size: .9rem; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); }
.cross-experiment > header p { margin: 0; max-width: 75ch; color: var(--text-muted); font-size: .9rem; }
.challenge { display: grid; gap: 12px; }
.challenge h6 { margin: 0 0 5px; font-size: 1rem; }
.challenge-intro { margin: 0; color: var(--text-muted); }
.locked { padding: 12px; border: 1px dashed var(--border); border-radius: var(--radius-sm); }
.locked > p { margin: 0 0 6px; }
.prerequisite-label { color: var(--text-muted); font-size: .86rem; }
.locked ul { display: grid; gap: 6px; margin: 8px 0 0; padding: 0; list-style: none; }
.locked li { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; }
.locked li > span:first-child { width: 1em; color: var(--success); }
.status { color: var(--text-muted); font-size: .82rem; }
@media (max-width: 560px) { .locked li { gap: 6px; } }
</style>
