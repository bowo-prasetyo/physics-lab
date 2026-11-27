import { describe, expect, it } from 'vitest'
import { messages } from './messages'
import { CONCEPT_BRIDGE_EXPERIMENTS, getConceptBridge } from './concept-bridges'
import { getExperimentSupportCopy } from './experiment-support'
import { getTeacherGuide } from './teacher-guide'
import { PRACTICE_COPY, STEP_COPY } from '@/learning/learning-content'
import { PROBLEM_COPY } from '@/learning/problem-bank'

/**
 * Physica addresses Indonesian learners formally, with "Anda". Informal "kamu"
 * and its possessive suffix "-mu" (pemahamanmu, dorongmu) must not creep in.
 */
const INFORMAL = /\bkamu\b|\b[a-z]+mu\b/gi
/** Ordinary words that happen to end in -mu. */
const ALLOWED = new Set(['ilmu', 'temu', 'bertemu', 'tamu', 'jamu', 'ramu', 'jumpa'])

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(strings)
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings)
  return []
}

describe('Indonesian register', () => {
  it('uses the formal "Anda" throughout, never "kamu" or "-mu"', () => {
    const texts = [
      ...strings(messages.id),
      ...strings(PRACTICE_COPY.id),
      ...strings(STEP_COPY.id),
      ...strings(PROBLEM_COPY.id),
      ...strings(getTeacherGuide('id')),
      ...CONCEPT_BRIDGE_EXPERIMENTS.flatMap((id) => strings(getConceptBridge(id, 'id'))),
      ...['space-vs-time', 'displacement-3d', 'force-lab', 'circular-orbits', 'evolving-space'].flatMap((id) => strings(getExperimentSupportCopy(id, 'id'))),
    ]
    expect(texts.length).toBeGreaterThan(200)
    const informal = texts.flatMap((t) => (t.match(INFORMAL) ?? []).filter((w) => !ALLOWED.has(w.toLowerCase())))
    expect(informal).toEqual([])
  })
})
