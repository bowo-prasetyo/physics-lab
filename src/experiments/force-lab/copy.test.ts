import { describe, expect, it } from 'vitest'
import { getForceLabDocumentTitle, localizeForceLabText } from './copy'

describe('Force Lab document title localization', () => {
  it.each([
    ['en', 'Force Lab · Physica'],
    ['id', 'Laboratorium Gaya · Physica'],
    ['ja', '力の実験室 · Physica'],
  ] as const)('returns the %s title', (locale, expected) => {
    expect(getForceLabDocumentTitle(locale)).toBe(expected)
  })
})


describe('Force Lab explanatory heading localization', () => {
  it.each([
    ['en', 'Model assumptions and limits'],
    ['id', 'Asumsi dan keterbatasan model'],
    ['ja', 'モデルの前提と限界'],
  ] as const)('returns the %s heading', (locale, expected) => {
    expect(localizeForceLabText('Model assumptions and limits', locale)).toBe(expected)
  })
})
