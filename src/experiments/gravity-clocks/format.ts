/** Number formatting for Experiment C, where values span from 10⁻¹⁷ to millions. */

import { schwarzschildRadius, type Body } from '@/physics'

const SUPERSCRIPT: Record<string, string> = {
  '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
}

/** 3 significant figures, in scientific notation (× 10ⁿ) when very small or large. */
export function formatNumber(x: number, digits = 3): string {
  if (x === 0) return '0'
  const abs = Math.abs(x)
  if (abs >= 1e-3 && abs < 1e6) return String(Number(x.toPrecision(digits)))
  const [mantissa, exponent] = x.toExponential(digits - 1).split('e')
  const exp = String(Number(exponent)).replace(/./g, (c) => SUPERSCRIPT[c] ?? c)
  return `${mantissa} × 10${exp}`
}

const DURATION_UNITS: [number, string][] = [
  [86_400, 'days'],
  [3_600, 'h'],
  [60, 'min'],
  [1, 's'],
  [1e-3, 'ms'],
  [1e-6, 'μs'],
  [1e-9, 'ns'],
  [1e-12, 'ps'],
  [1e-15, 'fs'],
]

/** A time interval in the most readable unit, e.g. "83.4 ns" or "2.51 days". */
export function formatDuration(seconds: number): string {
  const abs = Math.abs(seconds)
  if (abs === 0) return '0 s'
  for (const [size, unit] of DURATION_UNITS) {
    if (abs >= size) return `${formatNumber(seconds / size)} ${unit}`
  }
  return `${formatNumber(seconds)} s`
}

/** A length in m or km (mm and cm for small ones). */
export function formatLength(metres: number): string {
  const abs = Math.abs(metres)
  if (abs === 0) return '0 m'
  if (abs < 0.01) return `${formatNumber(metres * 1000)} mm`
  if (abs < 1) return `${formatNumber(metres * 100)} cm`
  if (abs < 1000) return `${formatNumber(metres)} m`
  if (abs < 1e5) return `${formatNumber(metres / 1000)} km`
  return `${Math.round(metres / 1000).toLocaleString('en-US')} km`
}

/** A clock's height, with its size relative to r_s for a black hole. */
export function formatAltitude(h: number, body: Body): string {
  if (body.hasSurface) return h === 0 ? 'on the surface' : formatLength(h)
  return `${formatLength(h)} (${formatNumber(h / schwarzschildRadius(body.mass))} r_s) above the horizon`
}

/** How much a clock is slowed: a percentage when large, scientific notation when tiny. */
export function formatSlowdown(deficit: number): string {
  if (deficit >= 1e-3) return `${Number((deficit * 100).toPrecision(3))}%`
  return formatNumber(deficit)
}
