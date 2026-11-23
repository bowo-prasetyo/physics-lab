import { describe, expect, it } from 'vitest'
import { extractTemplateCandidates, isReviewableCopy } from '../../scripts/audit-localization.mjs'

describe('localization source audit', () => {
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
