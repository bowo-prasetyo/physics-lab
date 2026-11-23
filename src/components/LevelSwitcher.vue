<script setup lang="ts">
import { LEVELS } from '@/levels'
import { useLevel } from '@/composables/useLevel'
import { useLocale } from '@/composables/useLocale'

const level = useLevel()
const { t } = useLocale()
const levelKeys = { beginner: 'app.level.beginner', intermediate: 'app.level.intermediate', advanced: 'app.level.advanced' } as const
const detailKeys = { beginner: 'app.level.beginnerDetails', intermediate: 'app.level.intermediateDetails', advanced: 'app.level.advancedDetails' } as const
</script>

<template>
  <div class="level-control">
    <fieldset class="level-switcher">
      <legend class="sr-only">{{ t('app.level.label') }}</legend>
      <label v-for="info in LEVELS" :key="info.id" :title="t(detailKeys[info.id])" :class="{ active: level === info.id }">
        <input v-model="level" type="radio" name="level" :value="info.id" class="sr-only" />
        {{ t(levelKeys[info.id]) }}
      </label>
    </fieldset>
    <details class="level-help">
      <summary>{{ t('app.level.help') }}</summary>
      <div class="level-popover">
        <strong>{{ t('app.level.samePhysics') }}</strong>
        <p>{{ t('app.level.description') }}</p>
        <ul>
          <li><strong>{{ t('app.level.beginner') }}:</strong> {{ t('app.level.beginnerDetails') }}</li>
          <li><strong>{{ t('app.level.intermediate') }}:</strong> {{ t('app.level.intermediateDetails') }}</li>
          <li><strong>{{ t('app.level.advanced') }}:</strong> {{ t('app.level.advancedDetails') }}</li>
        </ul>
      </div>
    </details>
  </div>
</template>

<style scoped>
.level-control { position:relative; display:flex; align-items:center; gap:8px; }
.level-switcher { display:inline-flex; margin:0; padding:3px; border:1px solid var(--border); border-radius:999px; background:var(--surface-2); }
label { padding:5px 12px; border-radius:999px; font-size:.85rem; font-weight:600; color:var(--text-muted); cursor:pointer; white-space:nowrap; }
label.active { background:var(--surface); color:var(--accent); box-shadow:var(--shadow); }
label:has(input:focus-visible) { outline:3px solid var(--accent); outline-offset:1px; }
.level-help { position:relative; font-size:.78rem; }
.level-help summary { color:var(--accent); cursor:pointer; font-weight:650; white-space:nowrap; }
.level-popover { position:absolute; z-index:20; top:calc(100% + 10px); right:0; width:min(340px,calc(100vw - 32px)); padding:14px 16px; border:1px solid var(--border); border-radius:var(--radius); background:var(--surface); box-shadow:var(--shadow); color:var(--text); line-height:1.45; }
.level-popover p { margin:6px 0; color:var(--text-muted); }
.level-popover ul { margin:8px 0 0; padding-left:18px; }
.level-popover li+li { margin-top:5px; }
@media(max-width:480px) { .level-control { gap:5px; } label { padding:5px 8px; font-size:.78rem; } .level-help { font-size:.72rem; } }
</style>
