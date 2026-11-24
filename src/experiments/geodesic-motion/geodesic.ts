/**
 * Equatorial timelike geodesics in a Schwarzschild exterior.
 *
 * Units: radius is measured in Schwarzschild radii (r_s = 2GM/c²),
 * proper time in r_s/c, and angular momentum per unit rest mass in r_s c.
 * The radial equation is the timelike Schwarzschild geodesic equation:
 * r¨ = -1/(2r²) + L²/r³ - 3L²/(2r⁴), with φ˙ = L/r².
 */
export interface GeodesicPoint { x: number; y: number; radius: number }
export interface GeodesicRun {
  points: GeodesicPoint[]
  periapses: number
  escaped: boolean
  captured: boolean
}
export interface GeodesicSettings {
  initialRadius: number
  angularMomentumFactor: number
  radialVelocity: number
  steps?: number
  stepSize?: number
}

type State = { r: number; vr: number; phi: number }
const derivative = (s: State, angularMomentum: number, relativistic: boolean): State => {
  const l2 = angularMomentum * angularMomentum
  const correction = relativistic ? (3 * l2) / (2 * s.r ** 4) : 0
  return {
    r: s.vr,
    vr: -1 / (2 * s.r ** 2) + l2 / s.r ** 3 - correction,
    phi: angularMomentum / s.r ** 2,
  }
}
function add(s: State, d: State, scale: number): State {
  return { r: s.r + d.r * scale, vr: s.vr + d.vr * scale, phi: s.phi + d.phi * scale }
}
function rk4(s: State, l: number, h: number, relativistic: boolean): State {
  const k1 = derivative(s, l, relativistic)
  const k2 = derivative(add(s, k1, h / 2), l, relativistic)
  const k3 = derivative(add(s, k2, h / 2), l, relativistic)
  const k4 = derivative(add(s, k3, h), l, relativistic)
  return {
    r: s.r + h / 6 * (k1.r + 2 * k2.r + 2 * k3.r + k4.r),
    vr: s.vr + h / 6 * (k1.vr + 2 * k2.vr + 2 * k3.vr + k4.vr),
    phi: s.phi + h / 6 * (k1.phi + 2 * k2.phi + 2 * k3.phi + k4.phi),
  }
}

/** Specific angular momentum of a circular timelike Schwarzschild orbit. */
export function circularGeodesicAngularMomentum(radius: number): number {
  if (!Number.isFinite(radius) || radius <= 1.5) throw new RangeError('Circular timelike orbit requires r > 1.5 r_s.')
  return radius / Math.sqrt(2 * radius - 3)
}

/** Integrate a Schwarzschild geodesic and its Newtonian reference orbit. */
export function calculateGeodesic(settings: GeodesicSettings, relativistic = true): GeodesicRun {
  const { initialRadius, angularMomentumFactor, radialVelocity } = settings
  if (!Number.isFinite(initialRadius) || initialRadius <= 1.5) throw new RangeError('Initial radius must be outside the photon sphere (r > 1.5 r_s).')
  if (!Number.isFinite(angularMomentumFactor) || angularMomentumFactor <= 0) throw new RangeError('Angular-momentum factor must be positive.')
  if (!Number.isFinite(radialVelocity)) throw new RangeError('Radial velocity must be finite.')
  const steps = Math.max(1, Math.min(30000, Math.floor(settings.steps ?? 2400)))
  const h = settings.stepSize ?? 0.025
  const l = circularGeodesicAngularMomentum(initialRadius) * angularMomentumFactor
  let state: State = { r: initialRadius, vr: radialVelocity, phi: 0 }
  const points: GeodesicPoint[] = []
  let periapses = 0
  let previousVr = state.vr
  let escaped = false
  let captured = false
  for (let i = 0; i <= steps; i++) {
    if (!Number.isFinite(state.r) || state.r <= 1.0005) { captured = true; break }
    if (state.r > 80) { escaped = true; break }
    points.push({ x: state.r * Math.cos(state.phi), y: state.r * Math.sin(state.phi), radius: state.r })
    if (i > 0 && previousVr < 0 && state.vr >= 0) periapses++
    previousVr = state.vr
    state = rk4(state, l, h, relativistic)
  }
  return { points, periapses, escaped, captured }
}

export function newtonianReference(settings: GeodesicSettings): GeodesicRun {
  return calculateGeodesic(settings, false)
}
