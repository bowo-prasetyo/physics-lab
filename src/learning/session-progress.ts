import { reactive } from 'vue'

/**
 * Explored experiments are session-only unless the learner explicitly opts in
 * to remembering progress on this device. Nothing is transmitted to Physica.
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
export function isProgressPersistenceEnabled(): boolean {
  return settings.persistenceEnabled
}
/** For tests. */
export function resetExplored(): void {
  explored.clear()
  persist()
}
