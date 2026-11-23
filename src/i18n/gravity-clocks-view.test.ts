import { describe, expect, it } from 'vitest'
import {
  GRAVITY_CLOCKS_VIEW_TRANSLATION_KEYS,
  localizeGravityClocksViewText,
} from './gravity-clocks-view'

describe('Gravity Clocks experiment view localization', () => {
  it('preserves English source strings', () => {
    for (const key of GRAVITY_CLOCKS_VIEW_TRANSLATION_KEYS) {
      expect(localizeGravityClocksViewText(key, 'en')).toBe(key)
    }
  })

  it('provides Indonesian and Japanese copy for every catalogue entry', () => {
    expect(GRAVITY_CLOCKS_VIEW_TRANSLATION_KEYS.length).toBeGreaterThan(60)
    for (const key of GRAVITY_CLOCKS_VIEW_TRANSLATION_KEYS) {
      expect(localizeGravityClocksViewText(key, 'id'), `id: ${key}`).not.toBe(key)
      expect(localizeGravityClocksViewText(key, 'ja'), `ja: ${key}`).not.toBe(key)
      expect(localizeGravityClocksViewText(key, 'id').trim()).not.toBe('')
      expect(localizeGravityClocksViewText(key, 'ja').trim()).not.toBe('')
    }
  })

  it('preserves interpolation tokens in translated labels', () => {
    expect(localizeGravityClocksViewText('Clock {clock} height', 'id')).toContain('{clock}')
    expect(localizeGravityClocksViewText('Clock {clock} is ahead by', 'ja')).toContain('{clock}')
  })

  it('localizes GPS controls and the interpretation section', () => {
    expect(localizeGravityClocksViewText('Relativity correction', 'id')).toBe('Koreksi relativitas')
    expect(localizeGravityClocksViewText('Established physics', 'ja')).toBe('確立された物理学')
    expect(localizeGravityClocksViewText('Interpretation: open to debate', 'id')).toContain('diperdebatkan')
  })
})
