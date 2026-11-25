import { describe, expect, it } from 'vitest'
import { IMPLEMENTED_EXPERIMENTS, MODULES } from '@/modules'
import { router } from '@/router'
import { SUPPORTED_LOCALES } from '@/i18n/locales'
import { getCrossExperimentChallenges } from './cross-experiment'

describe('cross-experiment synthesis practice', () => {
  const routes = new Set(router.getRoutes().map((route) => route.path))
  const experiments = new Set(IMPLEMENTED_EXPERIMENTS.map((experiment) => experiment.path))

  it('connects real experiments within the intended learning chapters', () => {
    const challenges = getCrossExperimentChallenges('en')
    expect(challenges.length).toBeGreaterThanOrEqual(3)
    expect(new Set(challenges.map((challenge) => challenge.id)).size).toBe(challenges.length)
    for (const challenge of challenges) {
      expect(MODULES.some((module) => module.number === challenge.module), challenge.id).toBe(true)
      expect(challenge.prerequisites.length).toBeGreaterThanOrEqual(2)
      for (const prerequisite of challenge.prerequisites) {
        expect(routes.has(prerequisite.path), prerequisite.path).toBe(true)
        expect(experiments.has(prerequisite.path), prerequisite.path).toBe(true)
      }
    }
  })

  it('provides complete, distinct localized copy and valid answer keys in every supported language', () => {
    const ids = getCrossExperimentChallenges('en').map((challenge) => challenge.id)
    for (const locale of SUPPORTED_LOCALES) {
      const challenges = getCrossExperimentChallenges(locale)
      expect(challenges.map((challenge) => challenge.id)).toEqual(ids)
      for (const challenge of challenges) {
        expect(challenge.title.trim()).not.toBe('')
        expect(challenge.intro.trim()).not.toBe('')
        expect(challenge.prerequisiteLabel.trim()).not.toBe('')
        expect(challenge.prerequisites.every((item) => item.title.trim().length > 0)).toBe(true)
        expect(challenge.question.options).toHaveLength(4)
        expect(new Set(challenge.question.options.map((option) => option.id)).size).toBe(4)
        expect(challenge.question.options.some((option) => option.id === challenge.question.answer)).toBe(true)
        expect(challenge.question.prompt.trim()).not.toBe('')
        expect(challenge.question.hint.trim()).not.toBe('')
        expect(challenge.question.explanation.trim()).not.toBe('')
      }
    }
  })

  it('keeps the synthesis tasks available only at their intended chapters', () => {
    const challenges = getCrossExperimentChallenges('en')
    expect(challenges.filter((challenge) => challenge.module === 3)).toHaveLength(2)
    expect(challenges.filter((challenge) => challenge.module === 5)).toHaveLength(1)
  })
})
