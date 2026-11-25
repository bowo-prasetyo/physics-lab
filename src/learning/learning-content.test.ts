import { describe, expect, it } from 'vitest'
import { getLearningContent, validateLearningContent } from './learning-content'

describe('guided learning content', () => {
  it('has valid question banks in English, Indonesian and Japanese', () => {
    expect(validateLearningContent()).toEqual([])
    for (const locale of ['en', 'id', 'ja'] as const) {
      const copy = getLearningContent(locale)
      expect(copy.paths).toHaveLength(3)
      for (const path of copy.paths) {
        expect(path.steps.length).toBeGreaterThan(0)
        expect(path.questions.length).toBeGreaterThan(0)
        for (const question of path.questions) {
          expect(question.options.some((option) => option.id === question.answer)).toBe(true)
        }
      }
    }
  })

  it('links each learning step to an experiment route', () => {
    for (const locale of ['en', 'id', 'ja'] as const) {
      for (const path of getLearningContent(locale).paths) {
        for (const step of path.steps) {
          expect(step.path).toMatch(/^\/(space|time|mechanics|relativity|gravity)\//)
          expect(step.experiment.length).toBeGreaterThan(0)
          expect(step.prerequisite.length).toBeGreaterThan(20)
        }
      }
    }
  })
})
