import { onBeforeUnmount, watch, type WatchSource } from 'vue'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'

/**
 * Parse a link parameter as a number snapped to a slider's range and step.
 * Anything missing or invalid falls back to `fallback`.
 */
export function snapToRange(value: unknown, range: { min: number; max: number; step: number }, fallback: number): number {
  const n = typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN
  if (!Number.isFinite(n)) return fallback
  // toFixed removes floating-point residue such as 0.8000000000000002.
  const stepped = Number((Math.round(n / range.step) * range.step).toFixed(10))
  return Math.min(range.max, Math.max(range.min, stepped))
}

/**
 * Keep an experiment's setup in the URL so a teacher can share it.
 *
 * - `write` builds the query from the current state; it runs (debounced)
 *   whenever one of `sources` changes.
 * - `read` applies a query to the state. The caller reads the initial query
 *   itself; afterwards `read` runs when the query changes from outside, for
 *   example a shared link opened in a tab that already shows the page (Vue
 *   reuses the page, so nothing else would notice). The page's own URL
 *   updates are recognised and ignored.
 */
export function useQuerySync(options: {
  sources: WatchSource[]
  write: () => Record<string, string>
  read: (query: LocationQuery) => void
}): void {
  const route = useRoute()
  const router = useRouter()
  const path = route.path
  let ownQuery = ''
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(
    () => route.query,
    (query) => {
      if (route.path !== path || JSON.stringify(query) === ownQuery) return
      options.read(query)
    },
  )

  watch(options.sources, () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      const query = options.write()
      ownQuery = JSON.stringify(query)
      router.replace({ query })
    }, 300)
  })

  onBeforeUnmount(() => clearTimeout(timer))
}
