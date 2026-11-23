<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'

const copied = ref(false)
const error = ref('')
let feedbackTimer: ReturnType<typeof setTimeout> | undefined

async function shareExperiment() {
  error.value = ''
  // Query state is debounced by useQuerySync; let the last slider value reach the URL first.
  await new Promise((resolve) => window.setTimeout(resolve, 350))
  const url = window.location.href
  try {
    if (navigator.share) {
      await navigator.share({ title: document.title, text: 'Explore this Physica experiment with the same setup.', url })
      return
    }
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url)
      copied.value = true
      clearTimeout(feedbackTimer)
      feedbackTimer = setTimeout(() => (copied.value = false), 2200)
    } else {
      window.prompt('Copy this experiment link:', url)
    }
  } catch (cause) {
    if (cause instanceof Error && cause.name === 'AbortError') return
    error.value = 'Could not share automatically. Copy the page address from your browser.'
  }
}
onBeforeUnmount(() => clearTimeout(feedbackTimer))
</script>

<template>
  <div class="share-experiment">
    <button class="btn btn-small" type="button" @click="shareExperiment">
      <span aria-hidden="true">↗</span> Share this experiment
    </button>
    <span v-if="copied" class="share-status" role="status" aria-live="polite">Link copied to clipboard.</span>
    <span v-if="error" class="share-status" role="status">{{ error }}</span>
  </div>
</template>

<style scoped>
.share-experiment { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.share-status { color: var(--text-muted); font-size: .82rem; }
.btn-small { min-height: 40px; }
</style>
