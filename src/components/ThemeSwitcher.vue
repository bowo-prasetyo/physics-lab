<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { preference } = useTheme()
</script>

<template>
  <label class="theme-switcher">
    <span>Theme</span>
    <select v-model="preference" aria-label="Color theme">
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
</template>

<style scoped>
.theme-switcher {
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
  max-width: 112px;
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
  .theme-switcher { gap: 4px; font-size: 0.76rem; }
  select { max-width: 96px; }
}
</style>
