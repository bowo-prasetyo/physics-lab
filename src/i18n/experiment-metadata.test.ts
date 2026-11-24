import { describe, expect, it } from 'vitest'
import { experimentSectionLabel, getExperimentModuleEyebrow, type ExperimentMetadataId } from './experiment-metadata'

const experiments: readonly ExperimentMetadataId[] = [
  'space-vs-time',
  'displacement3d',
  'pendulum',
  'newtonian',
  'projectile',
  'moving-clocks',
  'two-perspectives',
  'length-contraction',
  'gravity-clocks',
  'geodesic-motion',
  'evolving-space',
]

describe('experiment metadata and section localization', () => {
  it('builds complete module eyebrows from localized catalogue metadata', () => {
    const japanese = experiments.map((id) => getExperimentModuleEyebrow(id, 'ja'))
    expect(japanese).toEqual([
      'モジュール 1 · 空間を理解する · 実験 A',
      'モジュール 1 · 空間を理解する · 3次元の変位',
      'モジュール 2 · 時間を理解する · 振り子時計',
      'モジュール 3 · 古典力学 · ニュートン力学の基礎',
      'モジュール 3 · 古典力学 · 放物運動',
      'モジュール 4 · 特殊相対性理論 · 実験 B',
      'モジュール 4 · 特殊相対性理論 · 実験 E · 二つの視点',
      'モジュール 4 · 特殊相対性理論 · 実験 F · 長さの収縮',
      'モジュール 5 · 一般相対性理論 · 実験 C',
      'モジュール 5 · 一般相対性理論 · 実験 G · 測地線運動',
      'モジュール 6 · 宇宙論 · 実験 D',
    ])
    expect(japanese.every((label) => !/Module|Understanding|Experiment/.test(label))).toBe(true)
  })

  it('keeps English and Indonesian module metadata complete too', () => {
    expect(getExperimentModuleEyebrow('space-vs-time', 'en'))
      .toBe('Module 1 · Understanding space · Experiment A')
    expect(getExperimentModuleEyebrow('space-vs-time', 'id'))
      .toBe('Modul 1 · Memahami ruang · Eksperimen A')
    for (const id of experiments) {
      for (const locale of ['en', 'id', 'ja'] as const) {
        expect(getExperimentModuleEyebrow(id, locale).trim()).not.toBe('')
      }
    }
  })

  it('provides explicit translations for repeated experiment section headings', () => {
    expect(experimentSectionLabel('mathematicsDisclosure', 'ja')).toBe('3 · 数学を探究する')
    expect(experimentSectionLabel('meaningDisclosure', 'ja')).toBe('4 · 意味と解釈を探究する')
    expect(experimentSectionLabel('mathematics', 'ja')).toBe('数学')
    expect(experimentSectionLabel('meaning', 'ja')).toBe('何がわかるでしょうか？')
    expect(experimentSectionLabel('predict', 'ja')).toBe('予測')
    expect(experimentSectionLabel('experiment', 'ja')).toBe('実験')
    expect(experimentSectionLabel('mathematicsDisclosure', 'en')).toBe('3 · Explore the mathematics')
  })
})
