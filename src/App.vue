<script setup lang="ts">
import LevelSwitcher from '@/components/LevelSwitcher.vue'
</script>

<template>
  <header class="app-header">
    <div class="container header-inner">
      <RouterLink to="/" class="brand">
        <img src="/favicon.svg" alt="" width="28" height="28" />
        <span>Space &amp; Time Laboratory</span>
      </RouterLink>
      <LevelSwitcher />
    </div>
  </header>
  <main>
    <RouterView />
  </main>
  <footer class="app-footer">
    <div class="container muted">Space &amp; Time Laboratory · Open-source physics experiments for students · MIT License</div>
  </footer>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 16px;
  min-height: 60px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  font-weight: 750;
  text-decoration: none;
  letter-spacing: -0.01em;
}

.app-footer {
  border-top: 1px solid var(--border);
  padding: 20px 0;
  font-size: 0.85rem;
}
</style>
