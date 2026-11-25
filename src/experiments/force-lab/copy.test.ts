import { describe, expect, it } from 'vitest'
import { localizeForceLabText } from './copy'

describe('Force Lab explanatory heading localization', () => {
  it.each([
    ['en', 'Model assumptions and limits'],
    ['id', 'Asumsi dan keterbatasan model'],
    ['ja', 'モデルの前提と限界'],
  ] as const)('returns the %s heading', (locale, expected) => {
    expect(localizeForceLabText('Model assumptions and limits', locale)).toBe(expected)
  })
})

describe('Force Lab friction localization', () => {
  it.each([
    ['Static friction coefficient', 'Koefisien gesekan statis', '静止摩擦係数'],
    ['Kinetic friction coefficient', 'Koefisien gesekan kinetis', '動摩擦係数'],
    ['Maximum static friction', 'Gaya gesek statis maksimum', '最大静止摩擦力'],
    ['Friction regime', 'Jenis gaya gesek', '摩擦の状態'],
  ] as const)('localizes %s in Indonesian and Japanese', (source, indonesian, japanese) => {
    expect(localizeForceLabText(source, 'id')).toBe(indonesian)
    expect(localizeForceLabText(source, 'ja')).toBe(japanese)
  })
})
