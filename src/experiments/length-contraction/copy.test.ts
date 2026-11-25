import { describe, expect, it } from 'vitest'
import { localizeLengthContractionText } from './copy'

describe('Length Contraction Lab localization', () => {
  it.each([
    ['Length Contraction Lab: measuring moving space', 'Laboratorium Kontraksi Panjang: mengukur ruang yang bergerak', '長さの収縮実験室：動く空間を測る'],
    ['Proper length', 'Panjang wajar', '固有長'],
    ['Measured length', 'Panjang terukur', '測定された長さ'],
    ['Earth-frame simultaneity (t = 0)', 'Keserentakan kerangka Bumi (t = 0)', '地球基準系の同時刻面（t = 0）'],
    ['Ship-frame simultaneity (t′ = 0)', 'Keserentakan kerangka pesawat (t′ = 0)', '宇宙船基準系の同時刻面（t′ = 0）'],
  ] as const)('localizes %s in Indonesian and Japanese', (source, indonesian, japanese) => {
    expect(localizeLengthContractionText(source, 'id')).toBe(indonesian)
    expect(localizeLengthContractionText(source, 'ja')).toBe(japanese)
  })

  it('keeps English source text unchanged', () => {
    const source = 'Proper length'
    expect(localizeLengthContractionText(source, 'en')).toBe(source)
  })
})
