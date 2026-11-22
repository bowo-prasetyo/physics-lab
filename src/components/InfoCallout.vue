<script setup lang="ts">
withDefaults(defineProps<{ kind?: 'physics' | 'interpretation' | 'note'; title: string }>(), { kind: 'note' })
</script>

<template>
  <aside class="callout" :class="kind">
    <p class="callout-title">{{ title }}</p>
    <slot />
  </aside>
</template>

<style scoped>
.callout {
  border-left: 4px solid var(--border);
  background: var(--surface-2);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
}

.callout :deep(p:last-child),
.callout :deep(ul:last-child) {
  margin-bottom: 0;
}

.callout-title {
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.physics {
  border-left-color: var(--success);
  background: var(--success-soft);
}

.physics .callout-title {
  color: var(--success);
}

.interpretation {
  border-left-color: var(--warn);
  background: var(--warn-soft);
}

.interpretation .callout-title {
  color: var(--warn);
}
</style>
