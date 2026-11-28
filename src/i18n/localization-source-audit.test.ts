import { describe, expect, it } from 'vitest'
import { extractTemplateCandidates, findUnlocalizedPrecisionOutput, isReviewableCopy } from '../../scripts/audit-localization.mjs'

describe('localization source audit', () => {
  it('detects precision-based numeric output that bypasses locale-aware formatters', () => {
    expect(findUnlocalizedPrecisionOutput('<span>{{ value.toPrecision(4) }}</span>\nconst path = point.toPrecision(3)', 'src/components/Example.vue')).toEqual([
      { file: 'src/components/Example.vue', line: 1, expression: '.toPrecision(' },
      { file: 'src/components/Example.vue', line: 2, expression: '.toPrecision(' },
    ])
    expect(findUnlocalizedPrecisionOutput('const rounded = value.toPrecision(12)', 'src/math.ts')).toHaveLength(1)
    expect(findUnlocalizedPrecisionOutput('<span>{{ significant(value, 4) }}</span>')).toEqual([])
  })

  it('keeps likely user-facing Latin copy while ignoring symbols and numeric values', () => {
    expect(isReviewableCopy('Horizontal velocity')).toBe(true)
    expect(isReviewableCopy('aria-label')).toBe(true)
    expect(isReviewableCopy('x = 2')).toBe(false)
    expect(isReviewableCopy('3.14')).toBe(false)
    expect(isReviewableCopy('')).toBe(false)
  })

  it('ignores intentional brand names and standard scientific notation', () => {
    for (const value of ['Physica', 'Physica ·', '· MIT License', 'Gly', 'km/s/Mpc.']) {
      expect(isReviewableCopy(value), value).toBe(false)
    }
    expect(isReviewableCopy('Learning effectiveness guidance')).toBe(true)
  })

  it('extracts template text, SVG annotations, and static accessibility attributes with locations', () => {
    const template = `
      <section aria-label="Experiment controls">
        <p>Change the initial velocity.</p>
        <svg><text>Horizontal displacement</text></svg>
        <button title="Reset experiment">Reset</button>
        <code>const x = 1</code>
      </section>
    `
    const candidates = extractTemplateCandidates(template, 'src/Example.vue')
    expect(candidates.map(item => [item.kind, item.text, item.tag])).toEqual([
      ['static-attribute', 'Experiment controls', 'section'],
      ['template-text', 'Change the initial velocity.', ''],
      ['template-text', 'Horizontal displacement', ''],
      ['static-attribute', 'Reset experiment', 'button'],
      ['template-text', 'Reset', ''],
    ])
    expect(candidates.every(item => item.line > 0 && item.column > 0)).toBe(true)
  })

  it('does not treat bound attributes as static translation candidates', () => {
    expect(extractTemplateCandidates('<button :aria-label="label">Go</button>', 'Example.vue'))
      .toEqual([])
  })
})
