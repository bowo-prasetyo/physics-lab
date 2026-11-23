<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useLocale } from '@/composables/useLocale'

const props = defineProps<{ experimentId: string; moduleNumber: number; focus: string; prompt: string; action: string; reflect: string }>()
const { t } = useLocale()
const labels = computed(() => [
  t('app.support.progressLabel').startsWith('Learning') ? 'I made a prediction before revealing the explanation' : t('app.support.progressLabel').startsWith('Daftar') ? 'Saya membuat prediksi sebelum melihat penjelasan' : '説明を見る前に予測を立てた',
  t('app.support.progressLabel').startsWith('Learning') ? 'I tested the idea by changing a meaningful setting' : t('app.support.progressLabel').startsWith('Daftar') ? 'Saya menguji gagasan dengan mengubah pengaturan yang bermakna' : '意味のある設定を変更して考えを検証した',
  t('app.support.progressLabel').startsWith('Learning') ? 'I can explain the result using evidence from the experiment' : t('app.support.progressLabel').startsWith('Daftar') ? 'Saya dapat menjelaskan hasil menggunakan bukti eksperimen' : '実験の証拠を使って結果を説明できる',
  t('app.support.progressLabel').startsWith('Learning') ? 'I can name an assumption or limitation of the model' : t('app.support.progressLabel').startsWith('Daftar') ? 'Saya dapat menyebutkan asumsi atau keterbatasan model' : 'モデルの仮定または限界を挙げられる',
])
const enabled = ref(false)
const completed = ref<boolean[]>([false, false, false, false])
const progress = computed(() => completed.value.filter(Boolean).length)
const percentage = computed(() => Math.round((progress.value / labels.value.length) * 100))
const storageKey = computed(() => `physica:learning-progress:${props.experimentId}`)
function saveProgress() {
  if (!enabled.value) return
  try { localStorage.setItem(storageKey.value, JSON.stringify({ completed: completed.value })) } catch { /* Keep the checklist usable for this visit. */ }
}
onMounted(() => {
  try {
    const saved = localStorage.getItem(storageKey.value)
    if (!saved) return
    const parsed: unknown = JSON.parse(saved)
    if (typeof parsed === 'object' && parsed !== null && 'completed' in parsed) {
      const values = (parsed as { completed?: unknown }).completed
      if (Array.isArray(values) && values.length === labels.value.length && values.every(value => typeof value === 'boolean')) {
        completed.value = values
        enabled.value = true
      }
    }
  } catch { /* Ignore unavailable or malformed local progress data. */ }
})
watch(completed, saveProgress, { deep: true })
watch(enabled, value => {
  if (value) saveProgress()
  else {
    completed.value = [false, false, false, false]
    try { localStorage.removeItem(storageKey.value) } catch { /* The checklist is still disabled in memory. */ }
  }
})
const teacherLabel = computed(() => t('app.support.teacherResources').replace('{number}', String(props.moduleNumber)))
const completionLabel = computed(() => t('app.support.complete').replace('{done}', String(progress.value)).replace('{total}', String(labels.value.length)).replace('{percent}', String(percentage.value)))
const progressAriaLabel = computed(() => t('app.support.progressLabel').replace('{done}', String(progress.value)).replace('{total}', String(labels.value.length)))
</script>
<template>
  <section class="experiment-support card" aria-labelledby="learning-guide-title">
    <div class="support-heading">
      <div><p class="eyebrow">{{ t('app.support.eyebrow') }}</p><h2 id="learning-guide-title">{{ t('app.support.title') }}</h2></div>
      <RouterLink class="teacher-link" :to="{ path: '/teachers', hash: `#module-${moduleNumber}` }">{{ teacherLabel }} <span aria-hidden="true">↗</span></RouterLink>
    </div>
    <div class="guidance-grid">
      <div><h3>{{ t('app.support.keepInMind') }}</h3><p>{{ focus }}</p></div>
      <div><h3>{{ t('app.support.before') }}</h3><p>{{ prompt }}</p></div>
      <div><h3>{{ t('app.support.try') }}</h3><p>{{ action }}</p></div>
      <div><h3>{{ t('app.support.after') }}</h3><p>{{ reflect }}</p></div>
    </div>
    <div class="progress-option">
      <label class="progress-toggle"><input v-model="enabled" type="checkbox"><span>{{ t('app.support.progressToggle') }}</span></label>
      <p class="privacy-note">{{ t('app.support.privacy') }}</p>
    </div>
    <div v-if="enabled" class="progress-panel">
      <div class="progress-summary"><strong>{{ t('app.support.checklist') }}</strong><span>{{ completionLabel }}</span></div>
      <div class="progress-track" role="progressbar" :aria-valuenow="progress" :aria-valuemin="0" :aria-valuemax="labels.length" :aria-label="progressAriaLabel"><span :style="{ width: percentage + '%' }"></span></div>
      <ul><li v-for="(label, index) in labels" :key="index"><label><input v-model="completed[index]" type="checkbox"> {{ label }}</label></li></ul>
    </div>
  </section>
</template>
<style scoped>
.experiment-support{display:flex;flex-direction:column;gap:16px}.support-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap}.support-heading .eyebrow{margin-bottom:4px}.support-heading h2{margin:0}.teacher-link{font-weight:650;text-decoration:none}.guidance-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:14px}.guidance-grid>div{border-left:3px solid var(--accent);padding:2px 0 2px 12px}.guidance-grid h3{margin:0 0 5px;font-size:.92rem}.guidance-grid p{margin:0;color:var(--text-muted)}.progress-option{border-top:1px solid var(--border);padding-top:12px}.progress-toggle{display:inline-flex;align-items:center;gap:9px;min-height:40px;font-weight:650;cursor:pointer}.progress-toggle input,.progress-panel input{width:18px;height:18px;accent-color:var(--accent)}.privacy-note{margin:2px 0 0;color:var(--text-muted);font-size:.82rem;max-width:85ch}.progress-panel{border-top:1px solid var(--border);padding-top:12px}.progress-summary{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;font-size:.9rem}.progress-summary span{color:var(--text-muted);font-variant-numeric:tabular-nums}.progress-track{height:8px;margin:10px 0 12px;overflow:hidden;border-radius:99px;background:var(--surface-2)}.progress-track span{display:block;height:100%;background:var(--accent);transition:width .18s ease}.progress-panel ul{display:grid;gap:7px;margin:0;padding:0;list-style:none}.progress-panel li label{display:flex;align-items:flex-start;gap:9px;cursor:pointer}.progress-panel li input{flex:0 0 auto;margin-top:2px}@media(max-width:640px){.progress-summary{flex-direction:column}}@media(prefers-reduced-motion:reduce){.progress-track span{transition:none}}
</style>
