import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CIRCULAR_ORBITS_STRINGS, localizeCircularOrbitsText } from './copy'
import { PREDICTIONS } from './predictions'

/** Every string the page passes through tx(), its outcome labels, and every hint the predictions can give. */
function pageStrings(): string[] {
  const view = readFileSync(join(__dirname, 'CircularOrbitsView.vue'), 'utf8')
  const predictions = readFileSync(join(__dirname, 'predictions.ts'), 'utf8')
  const outcomes = view.slice(view.indexOf('const OUTCOME_TEXT'), view.indexOf('const km'))
  return [
    ...[...view.matchAll(/tx\('((?:[^'\\]|\\.)*)'\)/g)].map((m) => m[1]!),
    ...[...outcomes.matchAll(/^\s+\w+: '([^']*)',$/gm)].map((m) => m[1]!),
    ...[...predictions.matchAll(/return '([^']*)'/g)].map((m) => m[1]!),
    ...[...predictions.matchAll(/\? '([^']*)' : null/g)].map((m) => m[1]!),
  ]
}

describe('Circular motion and orbits translations', () => {
  it('translates every string on the page into Indonesian and Japanese, with no stale entries', () => {
    const strings = new Set(pageStrings())
    expect(strings.size).toBeGreaterThan(40)
    expect([...strings].filter((s) => !CIRCULAR_ORBITS_STRINGS.includes(s))).toEqual([])
    expect(CIRCULAR_ORBITS_STRINGS.filter((s) => !strings.has(s))).toEqual([])
    for (const s of strings) {
      expect(localizeCircularOrbitsText(s, 'id'), s).not.toBe(s)
      expect(localizeCircularOrbitsText(s, 'ja'), s).not.toBe(s)
    }
  })

  it('gives a hint for every near miss the predictions recognise', () => {
    for (const p of PREDICTIONS) expect(p.hint, p.id).toBeTypeOf('function')
  })

  it('leaves English unchanged', () => {
    expect(localizeCircularOrbitsText('Launch', 'en')).toBe('Launch')
  })
})
