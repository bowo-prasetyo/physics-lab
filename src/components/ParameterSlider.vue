<script setup lang="ts">
import { useId } from 'vue'
import MathFormula from './MathFormula.vue'

withDefaults(
  defineProps<{
    label: string
    symbol: string
    unit: string
    min: number
    max: number
    step: number
    disabled?: boolean
    hint?: string
  }>(),
  { disabled: false, hint: '' },
)

const model = defineModel<number>({ required: true })
const id = useId()

const format = (value: number) => (value > 0 ? '+' : value < 0 ? '−' : '') + Math.abs(value).toFixed(1)
</script>

<template>
  <div class="slider" :class="{ disabled }">
    <div class="slider-head">
      <label :for="id">
        {{ label }} <MathFormula :tex="symbol" />
      </label>
      <output :for="id" class="num">{{ format(model) }} {{ unit }}</output>
    </div>
    <input :id="id" v-model.number="model" type="range" :min="min" :max="max" :step="step" :disabled="disabled" />
    <p v-if="hint" class="hint muted">{{ hint }}</p>
  </div>
</template>

<style scoped>
.slider-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

label {
  font-weight: 600;
}

output {
  font-weight: 600;
  color: var(--accent);
}

input[type='range'] {
  width: 100%;
  margin: 6px 0 0;
  accent-color: var(--accent);
}

.disabled {
  opacity: 0.6;
}

.hint {
  margin: 2px 0 0;
  font-size: 0.82rem;
}
</style>
