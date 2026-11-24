import { describe, expect, it } from 'vitest'
import {
  addParticipantResult, cohortToCsv, createEmptyCohort, getPilotExperiments,
  pilotExperiments, scoreQuestions,
} from './pilot'

describe('learning assessment pilot', () => {
  it('provides introductory and advanced experiments with aligned pre, post and transfer checks', () => {
    expect(pilotExperiments).toHaveLength(2)
    for (const experiment of pilotExperiments) {
      expect(experiment.pre).toHaveLength(2)
      expect(experiment.post).toHaveLength(experiment.pre.length)
      expect(experiment.transfer.options).toHaveLength(4)
      expect(experiment.outcome.length).toBeGreaterThan(20)
    }
  })

  it('localizes all question prompts and options for Indonesian and Japanese', () => {
    for (const language of ['id', 'ja'] as const) {
      const localized = getPilotExperiments(language)
      for (const experiment of localized) {
        const questions = [...experiment.pre, ...experiment.post, experiment.transfer]
        expect(questions.every(item => item.prompt.length > 0 && item.options.every(option => option.label.length > 0))).toBe(true)
        expect(experiment.outcome.length).toBeGreaterThan(10)
      }
    }
  })

  it('uses the contracted 12 m result for a 20 m rod moving at 0.8c', () => {
    const transfer = pilotExperiments.find(item => item.id === 'length-contraction')!.transfer
    expect(transfer.options[Number(transfer.correct)]!.label).toBe('12 m')
  })

  it('scores only exact keyed responses', () => {
    const experiment = pilotExperiments[0]!
    expect(scoreQuestions(experiment.pre, {
      [experiment.pre[0]!.id]: '0', [experiment.pre[1]!.id]: '2',
    })).toBe(1)
  })

  it('aggregates immediate and delayed results without retaining individual answers', () => {
    const cohort = createEmptyCohort()
    addParticipantResult(cohort, {
      experimentId: 'force-lab', phase: 'immediate',
      preCorrect: 1, postCorrect: 2, transferCorrect: 1, explanationScore: 3,
    })
    addParticipantResult(cohort, {
      experimentId: 'force-lab', phase: 'delayed',
      preCorrect: 0, postCorrect: 1, transferCorrect: 0, explanationScore: 2,
    })
    expect(cohort['force-lab'].immediateCount).toBe(1)
    expect(cohort['force-lab'].delayedCount).toBe(1)
    expect(cohort['force-lab'].preTotal).toBe(1)
    expect(cohort['force-lab'].postTotal).toBe(2)
    expect(cohort['force-lab'].delayedPostTotal).toBe(1)
    expect(cohort['force-lab'].immediateRubricCounts).toEqual([0, 0, 0, 1])
    expect(cohort['force-lab'].delayedRubricCounts).toEqual([0, 0, 1, 0])
    expect(JSON.stringify(cohort)).not.toContain('answer')
  })

  it('rejects rubric values outside the published 0–3 scale', () => {
    expect(() => addParticipantResult(createEmptyCohort(), {
      experimentId: 'force-lab', phase: 'immediate',
      preCorrect: 0, postCorrect: 0, transferCorrect: 0, explanationScore: 4,
    })).toThrow(RangeError)
  })

  it('exports cohort-level values and labels delayed results as unmatched', () => {
    const cohort = createEmptyCohort()
    addParticipantResult(cohort, {
      experimentId: 'length-contraction', phase: 'delayed',
      preCorrect: 0, postCorrect: 1, transferCorrect: 1, explanationScore: 1,
    })
    const csv = cohortToCsv(cohort)
    expect(csv).toContain('delayed_unmatched')
    expect(csv).toContain('length-contraction')
    expect(csv).not.toContain('learner')
    expect(csv.split('\n')).toHaveLength(2)
  })
})
