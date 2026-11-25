import { describe, expect, it } from 'vitest'
import { SUPPORTED_LOCALES } from '@/i18n/locales'
import { getProblemSet, isNumericallyCorrect } from './problem-bank'
import { router } from '@/router'

describe('physics problem bank', () => {
  it('is reachable through the application router', () => {
    expect(router.getRoutes().some((route) => route.path === '/problem-solving')).toBe(true)
  })
  it('provides a unique, valid problem set in every supported language', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const problems = getProblemSet(locale)
      expect(problems.length).toBeGreaterThanOrEqual(8)
      expect(new Set(problems.map((problem) => problem.id)).size).toBe(problems.length)
      for (const problem of problems) {
        expect(problem.title.trim()).not.toBe('')
        expect(problem.scenario.trim()).not.toBe('')
        expect(problem.given.trim()).not.toBe('')
        expect(problem.formula.trim()).not.toBe('')
        expect(problem.hint.trim()).not.toBe('')
        expect(problem.steps.length).toBeGreaterThanOrEqual(3)
        expect(problem.steps.every((step) => step.trim().length > 0)).toBe(true)
        expect(Number.isFinite(problem.answer)).toBe(true)
        expect(problem.tolerance).toBeGreaterThan(0)
      }
    }
  })

  it('covers all three mathematical levels and the core space-time-motion thread', () => {
    const problems = getProblemSet('en')
    expect(new Set(problems.map((problem) => problem.minLevel))).toEqual(new Set(['beginner', 'intermediate', 'advanced']))
    expect(new Set(problems.map((problem) => problem.module))).toEqual(new Set([1, 2, 3, 4, 6]))
  })

  it('accepts numerically correct answers within tolerance and rejects invalid values', () => {
    const problem = getProblemSet('en').find((item) => item.id === 'inelastic-collision')!
    expect(isNumericallyCorrect(problem, '1.6667')).toBe(true)
    expect(isNumericallyCorrect(problem, '1,6667')).toBe(true)
    expect(isNumericallyCorrect(problem, '2')).toBe(false)
    expect(isNumericallyCorrect(problem, '')).toBe(false)
    expect(isNumericallyCorrect(problem, 'not a number')).toBe(false)
  })
})
