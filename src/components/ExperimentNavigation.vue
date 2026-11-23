<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { getLocalizedModules } from '@/i18n/home-catalog'

const route = useRoute()
const { locale, t } = useLocale()
const experiments = computed(() =>
  getLocalizedModules(locale.value).flatMap((module) =>
    module.experiments.flatMap((experiment) =>
      experiment.path
        ? [{ ...experiment, path: experiment.path, moduleNumber: module.number, moduleTitle: module.title }]
        : [],
    ),
  ),
)
const currentIndex = computed(() => experiments.value.findIndex((experiment) => experiment.path === route.path))
const current = computed(() => experiments.value[currentIndex.value] ?? null)
const previous = computed(() => (currentIndex.value > 0 ? experiments.value[currentIndex.value - 1] : null))
const next = computed(() => (currentIndex.value >= 0 ? experiments.value[currentIndex.value + 1] ?? null : null))
</script>

<template>
  <div v-if="current" class="experiment-navigation container">
    <div class="navigation-top">
      <nav :aria-label="t('app.navigation.breadcrumb')">
        <ol class="breadcrumbs">
          <li><RouterLink to="/">{{ t('app.navigation.allExperiments') }}</RouterLink></li>
          <li aria-hidden="true">/</li>
          <li>{{ current.moduleTitle }}</li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{{ current.title }}</li>
        </ol>
      </nav>
      <div class="sequence" :aria-label="t('app.navigation.browseExperiments')">
        <RouterLink v-if="previous" :to="previous.path" class="sequence-link previous">
          <span aria-hidden="true">←</span>
          <span><small>{{ t('app.navigation.previous') }}</small>{{ previous.title }}</span>
        </RouterLink>
        <span v-else class="sequence-placeholder">{{ t('app.navigation.firstExperiment') }}</span>
        <RouterLink v-if="next" :to="next.path" class="sequence-link next">
          <span><small>{{ t('app.navigation.next') }}</small>{{ next.title }}</span>
          <span aria-hidden="true">→</span>
        </RouterLink>
        <span v-else class="sequence-placeholder">{{ t('app.navigation.endExperiments') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.experiment-navigation { padding-top:12px; padding-bottom:12px; border-bottom:1px solid var(--border); }
.navigation-top { display:flex; align-items:center; justify-content:space-between; gap:12px 20px; }
.breadcrumbs { display:flex; flex-wrap:wrap; align-items:center; gap:7px; margin:0; padding:0; list-style:none; color:var(--text-muted); font-size:.84rem; }
.breadcrumbs li[aria-current='page'] { color:var(--text); font-weight:650; }
.breadcrumbs a { text-decoration:none; }
.sequence { display:flex; align-items:center; justify-content:flex-end; gap:14px; }
.sequence-link { display:inline-flex; align-items:center; gap:7px; min-height:36px; text-decoration:none; font-size:.82rem; font-weight:650; }
.sequence-link span:not([aria-hidden='true']) { display:grid; line-height:1.25; }
.sequence-link small { color:var(--text-muted); font-size:.7rem; font-weight:500; }
.sequence-placeholder { color:var(--text-muted); font-size:.78rem; }
@media(max-width:680px) { .navigation-top { align-items:flex-start; flex-direction:column; } .sequence { width:100%; justify-content:space-between; } }
@media(max-width:380px) { .breadcrumbs { gap:5px; font-size:.78rem; } .sequence { gap:8px; } .sequence-link { font-size:.76rem; } }
</style>
