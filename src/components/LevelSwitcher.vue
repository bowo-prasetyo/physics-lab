<script setup lang="ts">
import { LEVELS } from '@/levels'
import { useLevel } from '@/composables/useLevel'

const level = useLevel()
</script>

<template>
  <fieldset class="level-switcher">
    <legend class="sr-only">Mathematical level</legend>
    <label v-for="info in LEVELS" :key="info.id" :title="`${info.audience}: ${info.maths}`" :class="{ active: level === info.id }">
      <input v-model="level" type="radio" name="level" :value="info.id" class="sr-only" />
      {{ info.label }}
    </label>
  </fieldset>
</template>

<style scoped>
.level-switcher {
  display: inline-flex;
  margin: 0;
  padding: 3px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface-2);
}

label {
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  white-space: nowrap;
}

label.active {
  background: var(--surface);
  color: var(--accent);
  box-shadow: var(--shadow);
}

label:has(input:focus-visible) {
  outline: 3px solid var(--accent);
  outline-offset: 1px;
}

@media (max-width: 480px) {
  label {
    padding: 5px 9px;
    font-size: 0.8rem;
  }
}
</style>
