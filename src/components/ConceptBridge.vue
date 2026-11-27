<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { getConceptBridge } from '@/i18n/concept-bridges'

const props = defineProps<{ experimentId: string }>()
const { locale } = useLocale()
const bridge = computed(() => getConceptBridge(props.experimentId, locale.value))
</script>

<template>
  <section v-if="bridge" class="concept-bridge" :aria-label="bridge.summary">
    <details>
      <summary>{{ bridge.summary }}</summary>
      <div class="bridge-content">
        <section>
          <h3>{{ bridge.intuitionTitle }}</h3>
          <p>{{ bridge.intuition }}</p>
        </section>
        <section>
          <h3>{{ bridge.equationTitle }}</h3>
          <p><code class="equation">{{ bridge.equation }}</code></p>
          <p>{{ bridge.equationMeaning }}</p>
        </section>
        <section class="misconception">
          <h3>{{ bridge.misconceptionTitle }}</h3>
          <p>{{ bridge.misconception }}</p>
        </section>
        <section class="self-check">
          <h3>{{ bridge.checkTitle }}</h3>
          <p>{{ bridge.check }}</p>
        </section>
      </div>
    </details>
  </section>
</template>

<style scoped>
.concept-bridge{border:1px solid var(--border);border-radius:var(--radius-md,12px);background:var(--surface-2);overflow:hidden}
.concept-bridge details{padding:0}
.concept-bridge summary{padding:13px 16px;cursor:pointer;font-weight:700;line-height:1.5;color:var(--text)}
.concept-bridge summary::marker{color:var(--accent)}
.bridge-content{display:grid;gap:14px;padding:0 16px 16px}
.bridge-content section{padding-top:12px;border-top:1px solid var(--border)}
.bridge-content h3{margin:0 0 5px;font-size:.92rem}
.bridge-content p{margin:0;line-height:1.65;color:var(--text-muted)}
.bridge-content p+p{margin-top:7px}
.equation{display:inline-block;padding:5px 9px;border-radius:6px;background:var(--surface);color:var(--text);font-size:.98rem;white-space:normal}
.misconception{border-inline-start:3px solid var(--warning, var(--accent));padding-inline-start:12px}
.self-check{border-inline-start:3px solid var(--accent);padding-inline-start:12px}
</style>
