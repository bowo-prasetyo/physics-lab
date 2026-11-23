<script setup lang="ts">
import LevelSwitcher from '@/components/LevelSwitcher.vue'

const logo = `${import.meta.env.BASE_URL}favicon.svg`
</script>

<template>
  <header class="app-header">
    <div class="container header-inner">
      <RouterLink to="/" class="brand">
        <img :src="logo" alt="" width="28" height="28" />
        <span>Physica</span>
      </RouterLink>
      <nav class="header-tools" aria-label="Main navigation">
        <RouterLink class="teacher-link" to="/teachers">For teachers</RouterLink>
        <LevelSwitcher />
      </nav>
    </div>
  </header>
  <main>
    <RouterView />
  </main>
  <footer class="app-footer">
    <div class="container muted">Physica · Open-source physics experiments for students · MIT License</div>
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

.header-tools {
  display: flex;
  align-items: center;
  gap: 16px;
}

.teacher-link {
  font-size: 0.9rem;
  font-weight: 650;
  text-decoration: none;
}

.app-footer {
  border-top: 1px solid var(--border);
  padding: 20px 0;
  font-size: 0.85rem;
}

@media (max-width: 420px) {
  .header-tools { gap: 8px; }
  .teacher-link { font-size: 0.82rem; }
}
</style>
