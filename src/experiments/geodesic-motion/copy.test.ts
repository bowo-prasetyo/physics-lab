import { describe, expect, it } from 'vitest'
import { getGeodesicMotionDocumentTitle, localizeGeodesicText } from './copy'

describe('Geodesic Motion Lab localization', () => {
  it('translates the learner-facing title and key physics terms', () => {
    expect(localizeGeodesicText('Geodesic Motion Lab: falling through curved spacetime', 'id'))
      .toBe('Laboratorium Gerak Geodesik: jatuh dalam ruang-waktu melengkung')
    expect(localizeGeodesicText('Geodesic Motion Lab: falling through curved spacetime', 'ja'))
      .toBe('測地線運動実験室：曲がった時空を落下する')
    expect(localizeGeodesicText('Schwarzschild radius', 'id')).toBe('Jari-jari Schwarzschild')
    expect(localizeGeodesicText('Newtonian limit', 'ja')).toBe('ニュートン極限')
  })

  it('keeps the browser title synchronized with the active locale', () => {
    expect(getGeodesicMotionDocumentTitle('en')).toBe('Geodesic Motion Lab: falling through curved spacetime · Physica')
    expect(getGeodesicMotionDocumentTitle('id')).toBe('Laboratorium Gerak Geodesik: jatuh dalam ruang-waktu melengkung · Physica')
    expect(getGeodesicMotionDocumentTitle('ja')).toBe('測地線運動実験室：曲がった時空を落下する · Physica')
  })

  it('does not alter English copy', () => {
    const source = 'A geodesic is the locally straightest possible path through spacetime.'
    expect(localizeGeodesicText(source, 'en')).toBe(source)
  })
})
