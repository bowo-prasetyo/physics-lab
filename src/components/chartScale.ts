/** The smallest "nice" upper limit at or above the largest value; its quarters are round numbers too. */
export function niceCeil(value: number): number {
  if (value <= 0) return 1
  const exponent = Math.floor(Math.log10(value))
  for (const m of [1, 1.2, 1.6, 2, 4, 6, 8, 10]) {
    const candidate = Number((m * 10 ** exponent).toPrecision(12))
    if (candidate >= value - 1e-9) return candidate
  }
  return 10 ** (exponent + 1)
}
