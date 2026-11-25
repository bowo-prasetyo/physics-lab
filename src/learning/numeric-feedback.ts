import type { Locale } from '@/i18n/locales'
import { translate, type MessageKey } from '@/i18n/messages'
import { isWithinTolerance, parseNumericAnswer, RELATIVE_TOLERANCE } from './problem-bank'

/**
 * Diagnostic feedback for a wrong numerical answer: which common slip the
 * response most likely shows. It reads the response with the same parser and
 * tolerance as the marker (problem-bank.ts), so the two never disagree.
 */
export type NumericFeedbackKind =
  | 'correct' // within tolerance: no coaching needed
  | 'invalid' // not a number
  | 'sign' // right size, opposite sign
  | 'scale' // off by a power of ten: a unit or exponent slip
  | 'near' // just outside tolerance: a rounding slip
  | 'too-small' // far too small, but not by a clean power of ten
  | 'too-large' // far too large, but not by a clean power of ten
  | 'review' // anything else: most likely the model or a step

/** Answers up to this far off (and outside the tolerance) are treated as rounding slips. */
export const NEAR_LIMIT = 0.05
/** How close the ratio to the answer must be to a power of ten to count as a scale slip. */
const SCALE_MATCH = 0.1

export interface NumericDiagnosis {
  readonly kind: NumericFeedbackKind
  /** For 'scale': the power of ten the response is off by (3 means 1000 times too large, −3 means 1000 times too small). */
  readonly powerOfTen?: number
}

export function diagnoseNumericResponse(expected: number, raw: string): NumericDiagnosis {
  const value = parseNumericAnswer(raw)
  if (value === null) return { kind: 'invalid' }
  if (isWithinTolerance(expected, value)) return { kind: 'correct' }
  if (isWithinTolerance(-expected, value)) return { kind: 'sign' }
  if (value !== 0 && Math.sign(value) === Math.sign(expected)) {
    const ratio = value / expected
    const powerOfTen = Math.round(Math.log10(ratio))
    if (powerOfTen !== 0 && Math.abs(ratio / 10 ** powerOfTen - 1) <= SCALE_MATCH) return { kind: 'scale', powerOfTen }
  }
  const relativeError = Math.abs(value - expected) / Math.abs(expected)
  if (relativeError <= NEAR_LIMIT) return { kind: 'near' }
  if (Math.abs(value) < Math.abs(expected) / 10) return { kind: 'too-small' }
  if (Math.abs(value) > Math.abs(expected) * 10) return { kind: 'too-large' }
  return { kind: 'review' }
}

export function classifyNumericResponse(expected: number, raw: string): NumericFeedbackKind {
  return diagnoseNumericResponse(expected, raw).kind
}

const KEYS: Record<Exclude<NumericFeedbackKind, 'correct' | 'scale'>, MessageKey> = {
  invalid: 'learning.feedback.invalid',
  sign: 'learning.feedback.sign',
  near: 'learning.feedback.near',
  'too-small': 'learning.feedback.tooSmall',
  'too-large': 'learning.feedback.tooLarge',
  review: 'learning.feedback.review',
}

/** Coaching text for a response, or '' when it is correct. `unit` is the unit the answer is asked in. */
export function numericFeedback(expected: number, raw: string, locale: Locale, unit = ''): string {
  const { kind, powerOfTen } = diagnoseNumericResponse(expected, raw)
  if (kind === 'correct') return ''
  if (kind === 'scale' && powerOfTen !== undefined) {
    const key: MessageKey = powerOfTen > 0 ? 'learning.feedback.scaleLarge' : 'learning.feedback.scaleSmall'
    const factor = new Intl.NumberFormat(locale).format(10 ** Math.abs(powerOfTen))
    return translate(locale, key).replace('{factor}', factor).replace('{unit}', unit)
  }
  return translate(locale, KEYS[kind as keyof typeof KEYS]).replace('{percent}', String(RELATIVE_TOLERANCE * 100))
}
