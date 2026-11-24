import { describe, expect, it } from 'vitest'
import { getForceLabDocumentTitle } from './copy'

describe('Force Lab document title localization', () => {
  it.each([
    ['en', 'Force Lab · Physica'],
    ['id', 'Laboratorium Gaya · Physica'],
    ['ja', '力の実験室 · Physica'],
  ] as const)('returns the %s title', (locale, expected) => {
    expect(getForceLabDocumentTitle(locale)).toBe(expected)
  })
})
