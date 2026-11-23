import { describe, expect, it } from 'vitest'
import {
  localizeMovingClocksFrameName,
  localizeMovingClocksMeetingLabel,
  localizeMovingClocksNowLabel,
  localizeMovingClocksSimultaneityLabel,
} from './moving-clocks-view'

describe('Moving Clocks view localization', () => {
  it('localizes the dynamic simultaneity readout in all supported locales', () => {
    expect(localizeMovingClocksSimultaneityLabel('ship', 'Earth', 'en')).toBe('The ship’s “now” meets the Earth clock at')
    expect(localizeMovingClocksSimultaneityLabel('Kapal', 'Bumi', 'id')).toBe('Waktu “sekarang” Kapal bertemu dengan jam Bumi pada')
    expect(localizeMovingClocksSimultaneityLabel('宇宙船', '地球', 'ja')).toBe('宇宙船の「現在」が地球の時計と一致する時刻は')
  })

  it('localizes frame names and dynamic spacetime annotations', () => {
    expect(localizeMovingClocksFrameName('earth', 'id')).toBe('Bumi')
    expect(localizeMovingClocksFrameName('ship', 'ja')).toBe('宇宙船')
    expect(localizeMovingClocksNowLabel('ship', 'id')).toBe('Waktu “sekarang” kapal')
    expect(localizeMovingClocksNowLabel('Earth', 'ja')).toBe('地球の「現在」')
    expect(localizeMovingClocksMeetingLabel('Earth', 3.5, 'en')).toBe('Earth clock 3.50 s')
    expect(localizeMovingClocksMeetingLabel('Earth', 3.5, 'id')).toBe('Jam Bumi: 3,50 dtk')
    expect(localizeMovingClocksMeetingLabel('ship', 3.5, 'ja')).toBe('宇宙船の時計：3.50 秒')
  })
})
