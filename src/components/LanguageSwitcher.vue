<script setup lang="ts">
import { useLocale } from '@/composables/useLocale'

const { locale, locales, t } = useLocale()
</script>

<template>
  <label class="language-switcher">
    <span>{{ t('app.language.label') }}</span>
    <select v-model="locale" :aria-label="t('app.language.label')">
      <option v-for="option in locales" :key="option.value" :value="option.value">
        {{ option.nativeLabel }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.language-switcher {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
}

select {
  min-height: 36px;
  max-width: 142px;
  padding: 4px 28px 4px 9px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
  font: inherit;
  cursor: pointer;
}

select:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

@media (max-width: 380px) {
  .language-switcher { gap: 4px; font-size: 0.76rem; }
  select { max-width: 112px; }
}
</style>
