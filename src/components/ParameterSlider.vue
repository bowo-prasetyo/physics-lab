<script setup lang="ts">
import { useId } from 'vue'
import MathFormula from './MathFormula.vue'

const props = withDefaults(
  defineProps<{
    label: string
    symbol: string
    unit: string
    min: number
    max: number
    step: number
    disabled?: boolean
    hint?: string
    /** Decimal places shown. */
    digits?: number
    /** Show an explicit + sign for positive values. */
    signed?: boolean
  }>(),
  { disabled: false, hint: '', digits: 1, signed: true },
)

const model = defineModel<number>({ required: true })
const id = useId()

const format = (value: number) =>
  (value > 0 && props.signed ? '+' : value < 0 ? '−' : '') + Math.abs(value).toFixed(props.digits)
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
  min-height: 44px;
  accent-color: var(--accent);
  touch-action: pan-y;
}

.disabled {
  opacity: 0.6;
}

.hint {
  margin: 2px 0 0;
  font-size: 0.82rem;
}
</style>
