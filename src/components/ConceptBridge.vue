<script setup lang="ts">
import { computed } from 'vue'
import MathFormula from '@/components/MathFormula.vue'
import { useLocale } from '@/composables/useLocale'
import { BRIDGE_EQUATIONS, getConceptBridge } from '@/i18n/concept-bridges'
import { atLeast, type Level } from '@/levels'

/**
 * A concept bridge, shown inside an experiment's Meaning section: it explains,
 * so it comes after the learner has predicted and seen the evidence. The
 * equation appears from the level at which the page introduces it.
 */
const props = defineProps<{ experimentId: string; level: Level }>()
const { locale } = useLocale()
const bridge = computed(() => getConceptBridge(props.experimentId, locale.value))
const equation = computed(() => {
  const eq = BRIDGE_EQUATIONS[props.experimentId]
  return eq && atLeast(props.level, eq.minLevel) ? eq : null
})
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
        <section v-if="equation">
          <h3>{{ bridge.equationTitle }}</h3>
          <MathFormula display :tex="equation.tex" />
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
.concept-bridge { margin: 0 0 14px; border: 1px solid var(--border); border-radius: var(--radius-md, 12px); background: var(--surface-2); overflow: hidden; }
.concept-bridge details { padding: 0; }
.concept-bridge summary { padding: 13px 16px; cursor: pointer; font-weight: 700; line-height: 1.5; color: var(--text); }
.concept-bridge summary::marker { color: var(--accent); }
.bridge-content { display: grid; gap: 14px; padding: 0 16px 16px; }
.bridge-content section { padding-top: 12px; border-top: 1px solid var(--border); }
.bridge-content h3 { margin: 0 0 5px; font-size: .92rem; }
.bridge-content p { margin: 0; line-height: 1.65; color: var(--text-muted); }
.misconception { border-inline-start: 3px solid var(--warn, var(--accent)); padding-inline-start: 12px; }
.self-check { border-inline-start: 3px solid var(--accent); padding-inline-start: 12px; }
</style>
