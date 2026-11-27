/** Low-redshift Hubble law: recession speed ≈ H₀ × proper distance. */
export function hubbleVelocity(h0KmPerSecondPerMpc: number, distanceMpc: number): number {
  if (!(Number.isFinite(h0KmPerSecondPerMpc) && h0KmPerSecondPerMpc > 0)) throw new RangeError('H₀ must be finite and positive')
  if (!(Number.isFinite(distanceMpc) && distanceMpc >= 0)) throw new RangeError('distance must be finite and non-negative')
  return h0KmPerSecondPerMpc * distanceMpc
}

/** Invert the low-redshift Hubble law to estimate distance in megaparsecs. */
export function hubbleDistance(h0KmPerSecondPerMpc: number, recessionSpeedKmPerSecond: number): number {
  if (!(Number.isFinite(h0KmPerSecondPerMpc) && h0KmPerSecondPerMpc > 0)) throw new RangeError('H₀ must be finite and positive')
  if (!(Number.isFinite(recessionSpeedKmPerSecond) && recessionSpeedKmPerSecond >= 0)) throw new RangeError('recession speed must be finite and non-negative')
  return recessionSpeedKmPerSecond / h0KmPerSecondPerMpc
}
