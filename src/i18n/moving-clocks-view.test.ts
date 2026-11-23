import { describe, expect, it } from 'vitest'
import { localizeMovingClocksSimultaneityLabel } from './moving-clocks-view'

describe('Moving Clocks view localization', () => {
  it('localizes the dynamic simultaneity readout in all supported locales', () => {
    expect(localizeMovingClocksSimultaneityLabel('ship', 'Earth', 'en')).toBe('The ship’s “now” meets the Earth clock at')
    expect(localizeMovingClocksSimultaneityLabel('Kapal', 'Bumi', 'id')).toBe('Waktu “sekarang” Kapal bertemu dengan jam Bumi pada')
    expect(localizeMovingClocksSimultaneityLabel('宇宙船', '地球', 'ja')).toBe('宇宙船の「現在」が地球の時計と一致する時刻は')
  })
})
