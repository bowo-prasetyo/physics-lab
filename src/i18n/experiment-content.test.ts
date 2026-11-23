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

const experiments = {
  'space-vs-time': space,
  displacement3d: displacement,
  pendulum,
  newtonian,
  projectile,
  'moving-clocks': movingClocks,
  'two-perspectives': twoPerspectives,
  'gravity-clocks': gravityClocks,
  'evolving-space': evolvingSpace,
} as const

describe('experiment content localization', () => {
  it('provides translated copy for every prediction in all nine experiments', () => {
    for (const [id, source] of Object.entries(experiments) as [keyof typeof experiments, (typeof experiments)[keyof typeof experiments]][]) {
      for (const locale of ['id', 'ja'] as const) {
        const localized = localizePredictions(id, source, locale)
        expect(localized.map((item) => item.id)).toEqual(source.map((item) => item.id))
        expect(localized).toHaveLength(source.length)
        localized.forEach((item, index) => {
          expect(item.question).not.toBe(source[index]?.question)
          expect(item.task).not.toBe(source[index]?.task)
          expect(item.explanation).not.toBe(source[index]?.explanation)
          expect(item.options.map((option) => option.id)).toEqual(source[index]?.options.map((option) => option.id))
          expect(item.options.every((option) => option.label.length > 0)).toBe(true)
          expect(item.correct).toBe(source[index]?.correct)
          expect(item.observed).toBe(source[index]?.observed)
        })
      }
    }
  })

  it('leaves English content unchanged and does not mutate source predictions', () => {
    for (const [id, source] of Object.entries(experiments) as [keyof typeof experiments, (typeof experiments)[keyof typeof experiments]][]) {
      expect(localizePredictions(id, source, 'en')).toEqual(source)
    }
    expect(space[0]?.question).toContain('You set the velocity')
  })
})
