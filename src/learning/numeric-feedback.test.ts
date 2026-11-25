import { describe, expect, it } from 'vitest'
import { SUPPORTED_LOCALES } from '@/i18n/locales'
import { classifyNumericResponse, diagnoseNumericResponse, NEAR_LIMIT, numericFeedback } from './numeric-feedback'
import { isNumericallyCorrect, PROBLEM_SOURCES, RELATIVE_TOLERANCE } from './problem-bank'

const answer = (id: string) => PROBLEM_SOURCES.find((p) => p.id === id)!.answer

describe('numerical feedback diagnosis', () => {
  it('names the actual power of ten for unit and exponent slips', () => {
    // Metres entered where km is asked; seconds where ns is asked.
    expect(diagnoseNumericResponse(answer('sun-schwarzschild-radius'), '2950')).toEqual({ kind: 'scale', powerOfTen: 3 })
    expect(diagnoseNumericResponse(answer('height-clock-gain'), '9.42e-9')).toEqual({ kind: 'scale', powerOfTen: -9 })
    expect(diagnoseNumericResponse(2, '20')).toEqual({ kind: 'scale', powerOfTen: 1 })
    expect(diagnoseNumericResponse(200, '2')).toEqual({ kind: 'scale', powerOfTen: -2 })
  })

  it('treats only answers 2–5% off as rounding slips', () => {
    expect(classifyNumericResponse(10, '10.1')).toBe('correct')
    expect(classifyNumericResponse(10, '10.4')).toBe('near')
    expect(classifyNumericResponse(10, '9.6')).toBe('near')
    expect(classifyNumericResponse(10, '11')).toBe('review') // 10% off is a model or step problem, not rounding
    expect(classifyNumericResponse(answer('projectile-range'), '31.8')).toBe('review')
    expect(NEAR_LIMIT).toBeGreaterThan(RELATIVE_TOLERANCE)
  })

  it('diagnoses reversed signs, invalid input and far-off answers', () => {
    expect(classifyNumericResponse(-2, '2')).toBe('sign')
    expect(classifyNumericResponse(2, 'abc')).toBe('invalid')
    expect(classifyNumericResponse(2, '')).toBe('invalid')
    expect(classifyNumericResponse(10, '0.4')).toBe('too-small')
    expect(classifyNumericResponse(10, '400')).toBe('too-large')
    expect(classifyNumericResponse(-2, '30')).toBe('too-large') // wrong sign and scale: not a clean slip
  })

  it('agrees with the marker on every input the marker accepts', () => {
    const inputs = ['−2', '–2', '-2,0', ' 1 000 ', '1 000', '6,67', '9.42e-9', 'abc', '']
    for (const p of PROBLEM_SOURCES) {
      for (const raw of [...inputs, String(p.answer), String(-p.answer), String(p.answer * 1.03)]) {
        expect(classifyNumericResponse(p.answer, raw) === 'correct', `${p.id} ${raw}`).toBe(isNumericallyCorrect(p, raw))
      }
    }
    expect(isNumericallyCorrect({ answer: -2 }, '–2')).toBe(true) // en dash
    expect(isNumericallyCorrect({ answer: 1000 }, '1 000')).toBe(true)
  })
})

describe('numerical feedback text', () => {
  it('states the factor and the unit asked for', () => {
    expect(numericFeedback(2.95, '2950', 'en', 'km')).toBe('Your answer is about 1,000 times too large. The answer is asked in km: check unit conversions and powers of ten.')
    expect(numericFeedback(9.42, '9.42e-9', 'en', 'ns')).toContain('1,000,000,000 times too small')
    expect(numericFeedback(2.95, '2950', 'id', 'km')).toContain('1.000 kali terlalu besar')
    expect(numericFeedback(2.95, '2950', 'ja', 'km')).toContain('1,000倍')
  })

  it('gives coaching in every language for every wrong kind, and none for a correct answer', () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(numericFeedback(10, '10', locale)).toBe('')
      for (const raw of ['x', '-10', '100', '10.4', '0.4', '400', '13']) {
        const text = numericFeedback(10, raw, locale, 'm')
        expect(text.trim(), `${locale} ${raw}`).not.toBe('')
        expect(text, `${locale} ${raw}`).not.toMatch(/\{\w+\}/)
      }
    }
    expect(numericFeedback(10, '10.4', 'en')).toContain('2%')
    expect(numericFeedback(-2, '2', 'id')).toContain('tandanya terbalik')
  })
})
