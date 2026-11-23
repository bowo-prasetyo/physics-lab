import { afterEach, describe, expect, it } from 'vitest'
import { messages } from './messages'
import { DEFAULT_LOCALE, LOCALE_OPTIONS, SUPPORTED_LOCALES } from './locales'
import { getLocalizedModules } from './home-catalog'
import { MODULES } from '@/modules'
import { getTeacherGuide } from './teacher-guide'
import { getExperimentSupportCopy } from './experiment-support'
import { formatDate, formatNumber, getIntlLocale } from './formatters'
import { setLocale } from './index'
import { localizeExperimentText } from './experiment-ui'

const placeholderNames = (value: string): string[] =>
  [...value.matchAll(/\{([a-zA-Z][\w]*)\}/g)].map((match) => match[1] ?? '').sort()

afterEach(() => setLocale(DEFAULT_LOCALE))

describe('localization quality assurance', () => {
  it('keeps every locale complete, non-empty, and free of accidental edge whitespace', () => {
    const englishKeys = Object.keys(messages.en).sort()

    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(messages[locale]).sort()).toEqual(englishKeys)
      for (const [key, value] of Object.entries(messages[locale])) {
        expect(value.trim().length, `${locale} message ${key}`).toBeGreaterThan(0)
        expect(value, `${locale} message ${key} has edge whitespace`).toBe(value.trim())
      }
    }
  })

  it('preserves the exact interpolation placeholders for every message', () => {
    const englishEntries = Object.entries(messages.en)

    for (const locale of SUPPORTED_LOCALES) {
      for (const [key, englishValue] of englishEntries) {
        const localizedValue = messages[locale][key as keyof typeof messages.en]
        expect(
          placeholderNames(localizedValue),
          `${locale} message ${key} must preserve its interpolation variables`,
        ).toEqual(placeholderNames(englishValue))
      }
    }
  })

  it('uses the native language name in each language selector option', () => {
    expect(LOCALE_OPTIONS.map((option) => option.value)).toEqual(SUPPORTED_LOCALES)
    expect(LOCALE_OPTIONS.find((option) => option.value === 'id')?.nativeLabel).toBe('Bahasa Indonesia')
    expect(LOCALE_OPTIONS.find((option) => option.value === 'ja')?.nativeLabel).toBe('日本語')
  })

  it('keeps translated experiment routes aligned with the source catalogue', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const localized = getLocalizedModules(locale)
      expect(localized.map((module) => module.number)).toEqual(MODULES.map((module) => module.number))
      expect(localized.flatMap((module) => module.experiments.map((experiment) => experiment.path)))
        .toEqual(MODULES.flatMap((module) => module.experiments.map((experiment) => experiment.path)))
      expect(localized.flatMap((module) => module.experiments)).toHaveLength(9)
    }
  })

  it('keeps teacher-guide lesson structure consistent across locales', () => {
    const source = getTeacherGuide('en')

    for (const locale of SUPPORTED_LOCALES) {
      const guide = getTeacherGuide(locale)
      expect(guide.lessons).toHaveLength(source.lessons.length)
      expect(guide.beforeItems).toHaveLength(source.beforeItems.length)
      expect(guide.assessmentItems).toHaveLength(source.assessmentItems.length)

      guide.lessons.forEach((lesson, index) => {
        const sourceLesson = source.lessons[index]
        if (!sourceLesson) throw new Error(`Missing source teacher lesson at index ${index}`)
        expect(lesson.outcomes).toHaveLength(sourceLesson.outcomes.length)
        expect(lesson.sequence).toHaveLength(sourceLesson.sequence.length)
        expect(lesson.prompts).toHaveLength(sourceLesson.prompts.length)
        expect(lesson.module.trim()).not.toBe('')
        expect(lesson.title.trim()).not.toBe('')
        expect(lesson.check.trim()).not.toBe('')
      })
    }
  })

  it('provides complete support guidance for every experiment in both translated locales', () => {
    const experimentIds = [
      'space-vs-time',
      'displacement-3d',
      'pendulum',
      'newtonian',
      'projectile',
      'moving-clocks',
      'two-perspectives',
      'gravity-clock-rates',
      'evolving-space',
    ]

    for (const locale of ['id', 'ja'] as const) {
      for (const experimentId of experimentIds) {
        const copy = getExperimentSupportCopy(experimentId, locale)
        expect(copy, `missing ${locale} guidance for ${experimentId}`).toBeDefined()
        for (const [field, value] of Object.entries(copy ?? {})) {
          expect(value.trim().length, `${locale} ${experimentId} ${field}`).toBeGreaterThan(0)
          expect(value).toBe(value.trim())
        }
      }
    }
  })

  it('localizes dynamic two-perspectives verdicts and projectile chart labels', () => {
    const labels = [
      'Matches the measurement',
      'Thrown ball',
      'Vertical speed v_y',
      'Sideways speed vₓ',
      'Sideways speed v′ₓ (seen from the train)',
      'Distance x',
    ]

    for (const label of labels) {
      expect(localizeExperimentText(label, 'id'), 'Indonesian: ' + label).toBeDefined()
      expect(localizeExperimentText(label, 'ja'), 'Japanese: ' + label).toBeDefined()
      expect(localizeExperimentText(label, 'id')).not.toBe(label)
      expect(localizeExperimentText(label, 'ja')).not.toBe(label)
    }

    expect(localizeExperimentText('Off by 2.5 m (12%)', 'id'))
      .toBe('Selisih 2.5 m (12%) dari hasil pengukuran.')
    expect(localizeExperimentText('Off by 2.5 m (12%)', 'ja'))
      .toBe('測定結果との差は 2.5 m（12%）です。')
    expect(localizeExperimentText('Off by 0.25 s', 'id'))
      .toBe('Selisih 0.25 s dari hasil pengukuran.')
    expect(localizeExperimentText('Off by 0.25 s', 'ja'))
      .toBe('測定結果との差は 0.25 sです。')
  })

  it('formats numbers and dates using the active locale conventions', () => {
    const date = new Date('2025-01-05T12:00:00.000Z')
    const dateOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }

    setLocale('en')
    expect(getIntlLocale()).toBe('en-US')
    expect(formatNumber(1234.5)).toBe('1,234.5')
    expect(formatDate(date, dateOptions)).toBe('January 5, 2025')

    setLocale('id')
    expect(getIntlLocale()).toBe('id-ID')
    expect(formatNumber(1234.5)).toBe('1.234,5')
    expect(formatDate(date, dateOptions)).toBe('5 Januari 2025')

    setLocale('ja')
    expect(getIntlLocale()).toBe('ja-JP')
    expect(formatNumber(1234.5)).toBe('1,234.5')
    expect(formatDate(date, dateOptions)).toBe('2025年1月5日')
  })
})
