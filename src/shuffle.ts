/**
 * Deterministic shuffle for answer options. Question banks often list the
 * correct answer first; showing options in a per-learner order stops a fixed
 * position from scoring well. The same `key` and `seed` always give the same
 * order, so a re-render never reshuffles options under a learner's cursor.
 */
export function seededShuffle<T>(items: readonly T[], key: string, seed: number): T[] {
  let state = seed >>> 0
  for (const char of key) state = Math.imul(state ^ char.charCodeAt(0), 2654435761) >>> 0
  const random = () => {
    // mulberry32
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    const swap = result[i] as T
    result[i] = result[j] as T
    result[j] = swap
  }
  return result
}

/** A fresh random seed, for example one per learner session. */
export function newSeed(): number {
  return Math.floor(Math.random() * 2 ** 32)
}
