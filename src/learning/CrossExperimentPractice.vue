<script setup lang="ts">
import { computed, useId } from 'vue'
import type { Locale } from '@/i18n/locales'
import type { LearningUi } from './learning-content'
import { getCrossExperimentChallenges, getCrossExperimentHeading } from './cross-experiment'
import { isExplored } from './session-progress'
import PracticeQuestion from './PracticeQuestion.vue'

const headingId = useId()

const props = defineProps<{
  stepPath: string
  locale: Locale
  ui: LearningUi
  seed: number
}>()

const copy = computed(() => getCrossExperimentHeading(props.locale))
