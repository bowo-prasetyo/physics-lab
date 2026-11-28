import { describe, expect, it } from 'vitest'
import { LEVELS } from '@/levels'
import { IMPLEMENTED_EXPERIMENTS } from '@/modules'
import { PREDICTION_BANKS } from '@/experiments/prediction-banks'

/**
 * Levels add, never hide (CLAUDE.md): a higher level adds questions of its
 * own. Every experiment therefore has at least one prediction that first
 * appears at each level. "Force, mass and acceleration" once had only
 * Beginner predictions, so its higher levels added maths but nothing to test.
 */
describe('every level adds a prediction', () => {
  for (const experiment of IMPLEMENTED_EXPERIMENTS) {
    it(experiment.title, () => {
      const bank = PREDICTION_BANKS[experiment.path] ?? []
      const missing = LEVELS.map((level) => level.id).filter((level) => !bank.some((p) => p.minLevel === level))
      expect(missing, `${experiment.path} has no prediction that starts at these levels`).toEqual([])
    })
  }
})
