<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { localizeExperimentText } from '@/i18n/experiment-ui'

const { locale } = useLocale()
import { positionAtTime, type RunRecord } from '@/physics'

const props = defineProps<{ record: RunRecord; duration: number }>()

// Position at each whole second the clock has reached so far.
const rows = computed(() => {
  const list: { t: number; x: number }[] = []
  for (let t = 0; t <= Math.min(props.record.tEnd, props.duration) + 1e-9; t++) {
    list.push({ t, x: positionAtTime(props.record.segments, t) })
  }
  return list
})
</script>

<template>
  <div class="table-wrap">
    <table>
      <caption class="sr-only">{{ localizeExperimentText('Position at each whole second of the current run', locale) }}</caption>
      <thead>
        <tr>
          <th scope="row">t (s)</th>
          <td v-for="row in rows" :key="row.t" class="num">{{ row.t }}</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">x (m)</th>
          <td v-for="row in rows" :key="row.t" class="num">{{ row.x.toFixed(1) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="rows.length === 1" class="muted empty">{{ localizeExperimentText('Start the clock to fill in the table.', locale) }}</p>
  </div>
</template>

<style scoped>
.table-wrap {
  overflow-x: auto;
}

table {
  border-collapse: collapse;
  font-size: 0.9rem;
}

th,
td {
  padding: 4px 10px;
  border: 1px solid var(--border);
  text-align: right;
  white-space: nowrap;
}

th {
  background: var(--surface-2);
  text-align: left;
  font-weight: 600;
}

.empty {
  font-size: 0.85rem;
  margin: 6px 0 0;
}
</style>
