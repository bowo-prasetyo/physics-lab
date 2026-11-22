import { ref, watch } from 'vue'
import { isLevel, type Level } from '@/levels'

const STORAGE_KEY = 'stl.level'

function readStored(): Level {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isLevel(stored) ? stored : 'beginner'
  } catch {
    return 'beginner'
  }
}

// One shared level for the whole app, remembered per browser as a convenience.
const level = ref<Level>(readStored())

watch(level, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the level still works for this visit.
  }
})

export function useLevel() {
  return level
}
