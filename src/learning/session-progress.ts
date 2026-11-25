import { reactive } from 'vue'

/**
 * Which experiments the learner has explored in this browser session: an
 * experiment counts as explored once one of its prediction cards has reached
 * the explanation, which only happens after the learner has run the test.
 *
 * This lives in memory only. Nothing is written to storage or sent anywhere,
 * so a reload starts afresh, in line with Physica's no-tracking stance.
 */
const explored = reactive(new Set<string>())

export function markExplored(experimentPath: string): void {
  explored.add(experimentPath)
}

export function isExplored(experimentPath: string): boolean {
  return explored.has(experimentPath)
}

/** For tests. */
export function resetExplored(): void {
  explored.clear()
}
