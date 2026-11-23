/**
 * Educational levels. The physical phenomenon and experiment stay the same;
 * levels change the depth and mathematical language used to explain them.
 */

export type Level = 'beginner' | 'intermediate' | 'advanced'

export interface LevelInfo {
  readonly id: Level
  readonly label: string
  readonly audience: string
  readonly maths: string
}

export const LEVELS: readonly LevelInfo[] = [
  { id: 'beginner', label: 'Beginner', audience: 'High school', maths: 'Algebra, proportional reasoning, graphs and tables' },
  { id: 'intermediate', label: 'Intermediate', audience: 'Undergraduate', maths: 'Vectors, functions, calculus and quantitative models' },
  { id: 'advanced', label: 'Advanced', audience: 'Physics undergraduate', maths: 'Deeper derivations and specialised frameworks, such as spacetime events and worldlines where relevant' },
]

const ORDER: Record<Level, number> = { beginner: 0, intermediate: 1, advanced: 2 }

/** True when `level` is at least `minimum`. */
export function atLeast(level: Level, minimum: Level): boolean {
  return ORDER[level] >= ORDER[minimum]
}

export function isLevel(value: unknown): value is Level {
  return value === 'beginner' || value === 'intermediate' || value === 'advanced'
}
