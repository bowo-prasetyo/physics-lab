import { describe, expect, it } from 'vitest'
import { localizeExperimentText } from './experiment-ui'

describe('experiment UI localization', () => {
  it('keeps English hints unchanged', () => {
    const hint = 'Make at least three moves and come back to where you started (or load “Round trip”).'
    expect(localizeExperimentText(hint, 'en')).toBe(hint)
  })

  it('translates dynamic hints in Indonesian and Japanese', () => {
    const hint = 'Set the ship speed to at least 0.80c and make the measurement again.'
    expect(localizeExperimentText(hint, 'id')).toContain('0.80c')
    expect(localizeExperimentText(hint, 'id')).toContain('kecepatan kapal')
    expect(localizeExperimentText(hint, 'ja')).toContain('0.80c')
    expect(localizeExperimentText(hint, 'ja')).toContain('宇宙船')
  })

  it('translates visualization controls and axis labels', () => {
    expect(localizeExperimentText('Playback speed', 'id')).toBe('Kecepatan pemutaran')
    expect(localizeExperimentText('time t (s)', 'ja')).toBe('時間 t (s)')
    expect(localizeExperimentText('View the plotted values as a table', 'id')).toBe('Lihat nilai grafik sebagai tabel')
  })

  it('translates individual experiment control labels and instructions', () => {
    expect(localizeExperimentText('A distant galaxy, today at', 'id')).toBe('Jarak galaksi jauh saat ini')
    expect(localizeExperimentText('Ship speed', 'ja')).toBe('宇宙船の速度')
    expect(localizeExperimentText('Distance today, in billions of light-years.', 'ja')).toBe('現在の距離（10 億光年単位）。')
  })

  it('preserves scientific notation and unknown text', () => {
    expect(localizeExperimentText('Δr = 12 m; v = 0.80c', 'ja')).toBe('Δr = 12 m; v = 0.80c')
    expect(localizeExperimentText('A new experimental label', 'id')).toBe('A new experimental label')
    expect(localizeExperimentText(null, 'id')).toBeUndefined()
  })
})
