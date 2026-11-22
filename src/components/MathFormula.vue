<script setup lang="ts">
import { computed } from 'vue'
import katex from 'katex'

const props = withDefaults(defineProps<{ tex: string; display?: boolean }>(), { display: false })

// trust: false (the default) keeps KaTeX from emitting links or raw HTML.
const html = computed(() =>
  katex.renderToString(props.tex, { displayMode: props.display, throwOnError: false, trust: false }),
)
</script>

<template>
  <component :is="display ? 'div' : 'span'" class="math" :class="{ 'math-display': display }" v-html="html" />
</template>

<style scoped>
.math-display {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 0;
}
</style>
