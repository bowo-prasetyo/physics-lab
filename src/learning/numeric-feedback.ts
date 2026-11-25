import type { Locale } from '@/i18n/locales'
export type NumericFeedbackKind = 'invalid' | 'sign' | 'tenfold' | 'magnitude' | 'near' | 'review'
export function classifyNumericResponse(expected: number, raw: string): NumericFeedbackKind {
  const trimmed = raw.trim()
  const normalized = trimmed.replace(',', '.').replace(/[−–]/g, '-')
  if (!trimmed || !Number.isFinite(Number(normalized))) return 'invalid'
  const value = Number(normalized)
  if (Math.abs(value - expected) <= Math.abs(expected) * 0.02) return 'review'
  if (Math.abs(value + expected) <= Math.abs(expected) * 0.02) return 'sign'
  const ratio = Math.abs(value / expected)
  if ((ratio >= 9 && ratio <= 11) || (ratio >= 0.09 && ratio <= 0.11)) return 'tenfold'
  if (Math.abs(value) < Math.abs(expected) / 10) return 'magnitude'
  if (Math.abs(value - expected) <= Math.abs(expected) * 0.15) return 'near'
  return 'review'
}
const COPY: Record<Locale, Record<NumericFeedbackKind, string>> = {
  en: { invalid: 'Enter a numerical value. Use a decimal point or comma, and include a minus sign when direction matters.', sign: 'Your magnitude is right, but the sign is reversed. Recheck the positive direction and the direction of the quantity.', tenfold: 'Your answer is about ten times too large or too small. Check unit conversions and powers of ten.', magnitude: 'Your answer is much smaller than expected. Recheck the scale of the quantities and any squared or square-root terms.', near: 'You are close. Keep more digits during intermediate steps, then round only the final result.', review: 'Try a structured check: write the governing equation, substitute values with units, check signs, and estimate whether the result is reasonable.' },
  id: { invalid: 'Masukkan nilai numerik. Gunakan titik atau koma desimal, serta tanda minus jika arah besaran berpengaruh.', sign: 'Besar nilainya sudah tepat, tetapi tandanya terbalik. Periksa kembali arah positif dan arah besaran.', tenfold: 'Jawaban Anda sekitar sepuluh kali terlalu besar atau terlalu kecil. Periksa konversi satuan dan pangkat sepuluh.', magnitude: 'Jawaban Anda jauh lebih kecil dari perkiraan. Periksa skala besaran serta penggunaan kuadrat atau akar kuadrat.', near: 'Hampir tepat. Pertahankan lebih banyak angka pada langkah antara, lalu bulatkan hanya hasil akhir.', review: 'Periksa secara bertahap: tulis persamaan fisika, masukkan nilai beserta satuannya, periksa tanda, lalu nilai kewajaran hasilnya.' },
  ja: { invalid: '数値を入力してください。小数点はピリオドまたはカンマを使い、向きが重要な場合はマイナス符号も確認してください。', sign: '大きさは合っていますが、符号が逆です。正の向きと物理量の向きを確認しましょう。', tenfold: '答えが約10倍ずれています。単位の変換と10の累乗を確認しましょう。', magnitude: '答えが予想よりかなり小さくなっています。物理量の桁や二乗・平方根の扱いを確認しましょう。', near: 'あと少しです。途中計算では多くの桁を残し、最後に丸めましょう。', review: '順番に確認しましょう。物理の式を書き、単位付きで代入し、符号を確認して、結果が妥当な大きさか見積もります。' },
}
export function numericFeedback(expected: number, raw: string, locale: Locale): string { return COPY[locale][classifyNumericResponse(expected, raw)] }
