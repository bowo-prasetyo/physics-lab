<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { LESSON_EXPERIMENTS, getTeacherGuide } from '@/i18n/teacher-guide'
import { getLocalizedModules } from '@/i18n/home-catalog'

const { locale, t } = useLocale()
const guide = computed(() => getTeacherGuide(locale.value))
const assessmentLink = computed(() => locale.value === 'ja' ? '学習評価パイロットを実施' : locale.value === 'id' ? 'Jalankan uji coba asesmen pembelajaran' : 'Run the learning assessment pilot')
// Each lesson links to its experiments, titled as in the home catalogue.
const lessons = computed(() => {
  const titles = new Map(getLocalizedModules(locale.value).flatMap((module) => module.experiments.map((experiment) => [experiment.path, experiment.title] as const)))
  const seen = new Set<number>()
  return guide.value.lessons.map((lesson, index) => {
    const plan = LESSON_EXPERIMENTS[index]
    const moduleNumber = plan?.moduleNumber ?? 0
    // The first lesson of each module is the target of "Teacher resources for Module N".
    const anchor = seen.has(moduleNumber) ? `lesson-${index + 1}` : `module-${moduleNumber}`
    seen.add(moduleNumber)
    const links = (plan?.experiments ?? []).map((to) => ({ to, label: titles.get(to) ?? to }))
    return { ...lesson, anchor, links }
  })
})
</script>

<template>
  <article class="teacher container">
    <header class="teacher-head">
      <p class="eyebrow">{{ guide.eyebrow }}</p>
      <h1>{{ guide.title }}</h1>
      <p class="lead">{{ guide.lead }}</p>
      <div class="teacher-actions">
        <a class="btn btn-primary" href="#lesson-plans">{{ guide.browse }}</a>
        <RouterLink class="btn" to="/">{{ guide.learner }}</RouterLink>
      </div>
    </header>

    <section class="card teacher-note">
      <h2>{{ guide.before }}</h2>
      <ul><li v-for="item in guide.beforeItems" :key="item">{{ item }}</li></ul>
      <p class="muted small">{{ guide.privacy }}</p>
    </section>

    <section id="lesson-plans" aria-labelledby="plans-title">
      <h2 id="plans-title">{{ guide.plans }}</h2>
      <p class="muted">{{ guide.timing }}</p>
      <div class="lesson-grid">
        <article v-for="lesson in lessons" :key="lesson.anchor" :id="lesson.anchor" class="card lesson-card">
          <p class="eyebrow">{{ lesson.module }}</p>
          <h3>{{ lesson.title }}</h3>
          <p class="time">{{ lesson.time }}</p>
          <h4>{{ guide.intentions }}</h4>
          <ul><li v-for="outcome in lesson.outcomes" :key="outcome">{{ outcome }}</li></ul>
          <h4>{{ guide.sequence }}</h4>
          <ol><li v-for="step in lesson.sequence" :key="step">{{ step }}</li></ol>
          <h4>{{ guide.prompts }}</h4>
          <ul><li v-for="prompt in lesson.prompts" :key="prompt">{{ prompt }}</li></ul>
          <h4>{{ guide.check }}</h4>
          <p>{{ lesson.check }}</p>
          <div class="lesson-links">
            <RouterLink v-for="link in lesson.links" :key="link.to" :to="link.to">{{ link.label }}</RouterLink>
          </div>
        </article>
      </div>
    </section>

    <section class="card teacher-note">
      <h2>{{ guide.assessment }}</h2>
      <ul><li v-for="item in guide.assessmentItems" :key="item">{{ item }}</li></ul>
      <p><RouterLink class="btn btn-primary" to="/assessment-pilot">{{ assessmentLink }}</RouterLink></p>
      <p>{{ guide.footer }} <RouterLink to="/">Physica</RouterLink> · <a href="https://github.com/bowo-prasetyo/physics-lab/blob/main/docs/product/LEARNING_EFFECTIVENESS.md">{{ t('teacherGuide.learningEffectivenessLink') }}</a>.</p>
    </section>
  </article>
</template>

<style scoped>
.teacher { display: flex; flex-direction: column; gap: 28px; padding-top: 40px; padding-bottom: 56px; }
.teacher-head { max-width: 760px; }
.lead { max-width: 68ch; font-size: 1.1rem; color: var(--text-muted); }
.teacher-actions, .lesson-links { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
.teacher-actions a { text-decoration: none; }
.teacher-note { max-width: 900px; }
.small { font-size: .85rem; }
.lesson-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr)); gap: 16px; }
.lesson-card { display: flex; flex-direction: column; align-items: flex-start; }
.lesson-card .eyebrow { margin: 0 0 4px; font-size: .78rem; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: .04em; }
.lesson-card h3 { margin-bottom: 4px; }
.lesson-card h4 { margin: 14px 0 4px; font-size: .9rem; }
.lesson-card ul, .lesson-card ol { margin: 0; padding-left: 22px; }
.lesson-card li { margin: 3px 0; }
.time { color: var(--text-muted); font-size: .9rem; }
.lesson-links { margin-top: auto; padding-top: 16px; }
@media print {
  .teacher { max-width: none; padding: 0; }
  .teacher-actions { display: none; }
  .lesson-grid { display: block; }
  .lesson-card, .teacher-note { break-inside: avoid; box-shadow: none; margin-bottom: 14px; }
}
</style>
