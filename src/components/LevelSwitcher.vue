<script setup lang="ts">
import { LEVELS } from '@/levels'
import { useLevel } from '@/composables/useLevel'

const level = useLevel()
</script>

<template>
  <div class="level-control">
    <fieldset class="level-switcher">
      <legend class="sr-only">Mathematical level</legend>
      <label v-for="info in LEVELS" :key="info.id" :title="`${info.audience}: ${info.maths}`" :class="{ active: level === info.id }">
        <input v-model="level" type="radio" name="level" :value="info.id" class="sr-only" />
        {{ info.label }}
      </label>
    </fieldset>
    <details class="level-help">
      <summary>What changes?</summary>
      <div class="level-popover">
        <strong>Same physics, different mathematical depth.</strong>
        <p>Changing level does not change the experiment, its physical assumptions, or its results. It changes which mathematical tools, derivations, and deeper interpretations are shown.</p>
        <ul>
          <li><strong>Beginner:</strong> algebra, graphs, and tables.</li>
          <li><strong>Intermediate:</strong> vectors, functions, and calculus.</li>
          <li><strong>Advanced:</strong> deeper mathematical models, spacetime events, worldlines, and reference frames where relevant.</li>
        </ul>
      </div>
    </details>
  </div>
</template>

<style scoped>
.level-control {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}
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
.level-help {
  position: relative;
  font-size: 0.78rem;
}
.level-help summary {
  color: var(--accent);
  cursor: pointer;
  font-weight: 650;
  white-space: nowrap;
}
.level-popover {
  position: absolute;
  z-index: 20;
  top: calc(100% + 10px);
  right: 0;
  width: min(340px, calc(100vw - 32px));
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
  color: var(--text);
  line-height: 1.45;
}
.level-popover p { margin: 6px 0; color: var(--text-muted); }
.level-popover ul { margin: 8px 0 0; padding-left: 18px; }
.level-popover li + li { margin-top: 5px; }
@media (max-width: 480px) {
  .level-control { gap: 5px; }
  label { padding: 5px 8px; font-size: 0.78rem; }
  .level-help { font-size: 0.72rem; }
}
</style>
