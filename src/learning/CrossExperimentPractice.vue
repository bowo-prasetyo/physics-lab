<script setup lang="ts">
import { computed } from 'vue'
import type { Locale } from '@/i18n/locales'
import type { LearningUi } from './learning-content'
import { getCrossExperimentChallenges } from './cross-experiment'
import { isExplored } from './session-progress'
import PracticeQuestion from './PracticeQuestion.vue'

const props = defineProps<{
  chapterNumber: number
  locale: Locale
  ui: LearningUi
  seed: number
}>()

const heading: Record<Locale, { title: string; intro: string; locked: string }> = {
  en: {
    title: 'Connect ideas across experiments',
    intro: 'These challenges ask you to use evidence and models from more than one experiment. They become available after you have explored every linked experiment.',
    locked: 'Complete both linked experiments to unlock this synthesis question.',
  },
  id: {
    title: 'Hubungkan gagasan antar-eksperimen',
    intro: 'Tantangan ini mengajak Anda menggunakan bukti dan model dari lebih dari satu eksperimen. Tantangan terbuka setelah Anda menjelajahi semua eksperimen yang terkait.',
    locked: 'Selesaikan kedua eksperimen yang terhubung untuk membuka soal sintesis ini.',
  },
  ja: {
    title: '複数の実験をつなげて考える',
    intro: '複数の実験で得た証拠とモデルを組み合わせる課題です。関連するすべての実験を探究すると解けるようになります。',
    locked: '関連する2つの実験を完了すると、この統合問題が解けるようになります。',
  },
}

const copy = computed(() => heading[props.locale])
const challenges = computed(() => getCrossExperimentChallenges(props.locale).filter((item) => item.module === props.chapterNumber))
</script>

<template>
  <section v-if="challenges.length" class="cross-experiment" aria-labelledby="cross-experiment-title">
    <header>
      <h3 id="cross-experiment-title">{{ copy.title }}</h3>
      <p>{{ copy.intro }}</p>
    </header>
    <article v-for="challenge in challenges" :key="challenge.id" class="challenge card">
      <div>
        <h4>{{ challenge.title }}</h4>
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
.cross-experiment { display: grid; gap: 12px; margin-top: 8px; }
.cross-experiment > header h3 { margin: 0 0 5px; }
.cross-experiment > header p { margin: 0; max-width: 75ch; color: var(--text-muted); }
.challenge { display: grid; gap: 12px; }
.challenge h4 { margin: 0 0 5px; font-size: 1rem; }
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
