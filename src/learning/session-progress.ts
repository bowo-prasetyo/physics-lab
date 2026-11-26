import { reactive } from 'vue'

/**
 * Which experiments the learner has explored: an experiment counts once one of
 * its prediction cards has reached the explanation, which only happens after
 * the learner has run the test.
 *
 * Session-only by default. The learner may opt in to remembering it in this
 * browser on this device (a ratified product decision, see the vision's
 * privacy note); nothing is ever sent to Physica. Because school devices are
 * often shared, a visible "forget" control clears it at any time.
 */
const STORAGE_KEY = 'physica.learning-progress.v1'
const explored = reactive(new Set<string>())
const settings = reactive({ persistenceEnabled: false })

function storage(): Storage | null {
  try { return typeof localStorage === 'undefined' ? null : localStorage } catch { return null }
}
function persist(): void {
  if (!settings.persistenceEnabled) return
  try { storage()?.setItem(STORAGE_KEY, JSON.stringify([...explored])) } catch { /* Storage unavailable or full. */ }
}
function restore(): void {
  try {
    const raw = storage()?.getItem(STORAGE_KEY)
    if (!raw) return
    const paths: unknown = JSON.parse(raw)
    if (Array.isArray(paths)) for (const path of paths) {
      if (typeof path === 'string' && path.startsWith('/')) explored.add(path)
    }
  } catch { /* Ignore malformed or unavailable local data. */ }
}
try {
  settings.persistenceEnabled = storage()?.getItem(STORAGE_KEY + '.enabled') === 'true'
  if (settings.persistenceEnabled) restore()
} catch { /* Private browsing may deny storage access. */ }

export function markExplored(experimentPath: string): void {
  explored.add(experimentPath)
  persist()
}
export function isExplored(experimentPath: string): boolean {
  return explored.has(experimentPath)
}
/** Learner-controlled, device-local progress memory. Disabling it clears saved data. */
export function setProgressPersistenceEnabled(enabled: boolean): void {
  settings.persistenceEnabled = enabled
  try {
    const store = storage()
    if (!store) return
    if (enabled) {
      store.setItem(STORAGE_KEY + '.enabled', 'true')
      persist()
    } else {
      store.removeItem(STORAGE_KEY + '.enabled')
      store.removeItem(STORAGE_KEY)
    }
  } catch { /* Continue in session-only mode when storage is unavailable. */ }
}
/** Forget everything about this learner on this device: the saved data, the opt-in and this session's progress. */
export function forgetProgressOnThisDevice(): void {
  explored.clear()
  setProgressPersistenceEnabled(false)
}
export function isProgressPersistenceEnabled(): boolean {
  return settings.persistenceEnabled
}
/** For tests. */
export function resetExplored(): void {
  explored.clear()
  persist()
}
