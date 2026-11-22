/**
 * Educational levels. The physical phenomenon in an experiment never changes
 * with the level; only the depth of the mathematical treatment does.
 */

export type Level = 'beginner' | 'intermediate' | 'advanced'

export interface LevelInfo {
  readonly id: Level
  readonly label: string
  readonly audience: string
  readonly maths: string
}

export const LEVELS: readonly LevelInfo[] = [
  { id: 'beginner', label: 'Beginner', audience: 'High school', maths: 'Algebra, graphs and tables' },
  { id: 'intermediate', label: 'Intermediate', audience: 'Undergraduate', maths: 'Calculus and vectors' },
  { id: 'advanced', label: 'Advanced', audience: 'Physics undergraduate', maths: 'Events, worldlines and reference frames' },
]

const ORDER: Record<Level, number> = { beginner: 0, intermediate: 1, advanced: 2 }

/** True when `level` is at least `minimum`. */
export function atLeast(level: Level, minimum: Level): boolean {
  return ORDER[level] >= ORDER[minimum]
}

export function isLevel(value: unknown): value is Level {
  return value === 'beginner' || value === 'intermediate' || value === 'advanced'
}
