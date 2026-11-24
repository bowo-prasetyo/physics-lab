import { describe, expect, it } from 'vitest'
import { localizePredictions } from './experiment-content'
import { PREDICTIONS as space } from '@/experiments/space-vs-time/predictions'
import { PREDICTIONS as displacement } from '@/experiments/displacement3d/predictions'
import { PREDICTIONS as pendulum } from '@/experiments/pendulum/predictions'
import { PREDICTIONS as newtonian } from '@/experiments/newtonian/predictions'
import { PREDICTIONS as projectile } from '@/experiments/projectile/predictions'
import { PREDICTIONS as movingClocks } from '@/experiments/moving-clocks/predictions'
import { PREDICTIONS as twoPerspectives } from '@/experiments/two-perspectives/predictions'
import { PREDICTIONS as gravityClocks } from '@/experiments/gravity-clocks/predictions'
import { PREDICTIONS as evolvingSpace } from '@/experiments/evolving-space/predictions'
import { PREDICTIONS as forceLab } from '@/experiments/force-lab/predictions'
import { PREDICTIONS as momentum } from '@/experiments/momentum-collisions/predictions'
import { PREDICTIONS as lengthContraction } from '@/experiments/length-contraction/predictions'
import { PREDICTIONS as geodesic } from '@/experiments/geodesic-motion/predictions'

type TestPrediction = {
  readonly id: string
  readonly question: string
  readonly task: string
  readonly options: readonly { readonly id: string; readonly label: string }[]
  readonly explanation: string
  readonly correct: string
  readonly observed: unknown
}

function checkTranslations<T extends TestPrediction>(
  id: Parameters<typeof localizePredictions<T>>[0],
  source: readonly T[],
) {
  for (const locale of ['id', 'ja'] as const) {
    const localized = localizePredictions(id, source, locale)
    let translatedOptionLabels = 0
    expect(localized.map((item) => item.id)).toEqual(source.map((item) => item.id))
    expect(localized).toHaveLength(source.length)
    localized.forEach((item, index) => {
      const sourceItem = source[index]
      expect(item.question.trim().length).toBeGreaterThan(0)
      expect(item.task.trim().length).toBeGreaterThan(0)
      expect(item.explanation.trim().length).toBeGreaterThan(0)
      expect(item.question).not.toBe(sourceItem?.question)
      expect(item.task).not.toBe(sourceItem?.task)
      expect(item.explanation).not.toBe(sourceItem?.explanation)
      expect(item.options.map((option) => option.id)).toEqual(sourceItem?.options.map((option) => option.id))
      expect(item.options).toHaveLength(sourceItem?.options.length ?? 0)
      item.options.forEach((option, optionIndex) => {
        expect(option.label.trim().length).toBeGreaterThan(0)
        if (option.label !== sourceItem?.options[optionIndex]?.label) translatedOptionLabels += 1
      })
      expect(item.correct).toBe(sourceItem?.correct)
      expect(item.observed).toBe(sourceItem?.observed)
    })
    // Short numeric answers and SI units may intentionally be identical in every language.
    expect(translatedOptionLabels).toBeGreaterThan(0)
  }
}

describe('experiment content localization', () => {
  it('translates every prediction in every experiment catalogue', () => {
    checkTranslations('space-vs-time', space)
    checkTranslations('displacement3d', displacement)
    checkTranslations('pendulum', pendulum)
    checkTranslations('newtonian', newtonian)
    checkTranslations('projectile', projectile)
    checkTranslations('moving-clocks', movingClocks)
    checkTranslations('two-perspectives', twoPerspectives)
    checkTranslations('gravity-clocks', gravityClocks)
    checkTranslations('evolving-space', evolvingSpace)
    checkTranslations('force-lab', forceLab)
    checkTranslations('momentum-collisions', momentum)
    checkTranslations('length-contraction', lengthContraction)
    checkTranslations('geodesic-motion', geodesic)
  })

  it('leaves English content unchanged and does not mutate source predictions', () => {
    expect(localizePredictions('space-vs-time', space, 'en')).toEqual(space)
    expect(space[0]?.question).toContain('You set the velocity')
  })
})
