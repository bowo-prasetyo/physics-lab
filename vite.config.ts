import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Relative asset URLs: with hash routing the page path never changes, so one
  // build works at a domain root, under /physics-lab/ on GitHub Pages, or
  // from any folder on a school server.
  base: './',
  plugins: [vue()],
  build: {
    // The 3D scene's chunk is mostly Three.js (about 140 kB gzipped). It is
    // loaded only by the page that draws in 3D, so a larger limit is fine.
    chunkSizeWarningLimit: 600,
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
