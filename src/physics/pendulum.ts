/**
 * The simple pendulum: a point mass on a light rod of length L.
 *
 *   θ'' = −(g/L) sin θ
 *
 * The mass cancels out of the equation: every bob, heavy or light, swings
 * the same way. For small swings sin θ ≈ θ and the period is T₀ = 2π√(L/g),
 * independent of the amplitude. For larger swings the exact period is longer:
 *
 *   T = T₀ / AGM(1, cos(θ₀/2))
 *
 * using the arithmetic–geometric mean, an exact and fast way to evaluate the
 * complete elliptic integral 4√(L/g) K(sin(θ₀/2)).
 *
 * The motion is integrated with the Störmer–Verlet method. It is symplectic:
 * its energy error oscillates at a fixed size however long the pendulum
 * swings. RK4 is more accurate at first, but its energy error keeps growing in
 * proportion to the running time. A clock must keep going for a long time, so
 * bounded beats drifting.
 */

export interface PendulumState {
  readonly t: number
  /** Angle from the vertical (rad). */
  readonly theta: number
  /** Angular velocity (rad/s). */
  readonly omega: number
}

/** Period for small swings, T₀ = 2π√(L/g) (s). */
export function smallAnglePeriod(length: number, g: number): number {
  return 2 * Math.PI * Math.sqrt(length / g)
}

/** Arithmetic–geometric mean of a and b. */
export function agm(a: number, b: number): number {
  let x = a
  let y = b
  for (let i = 0; i < 40 && Math.abs(x - y) > 1e-15 * x; i++) {
    const nx = (x + y) / 2
    y = Math.sqrt(x * y)
    x = nx
  }
  return (x + y) / 2
}

/** Exact period for a swing of amplitude θ₀ (rad), released from rest. */
export function exactPeriod(length: number, g: number, amplitude: number): number {
  if (!(Math.abs(amplitude) < Math.PI)) throw new RangeError('amplitude must be below 180°')
  return smallAnglePeriod(length, g) / agm(1, Math.cos(amplitude / 2))
}

/** Length of a "seconds pendulum": each swing (half period) lasts exactly 1 s. */
export function secondsPendulumLength(g: number): number {
  return g / (Math.PI * Math.PI)
}

/** Energy per unit mass: ½ L² ω² + g L (1 − cos θ) (J/kg). */
export function pendulumEnergy(s: PendulumState, length: number, g: number): number {
  return 0.5 * length * length * s.omega * s.omega + g * length * (1 - Math.cos(s.theta))
}

/** One Störmer–Verlet (velocity Verlet) step of length h. */
export function verletStep(s: PendulumState, length: number, g: number, h: number): PendulumState {
  const k = g / length
  const omegaHalf = s.omega - 0.5 * h * k * Math.sin(s.theta)
  const theta = s.theta + h * omegaHalf
  const omega = omegaHalf - 0.5 * h * k * Math.sin(theta)
  return { t: s.t + h, theta, omega }
}

/** One classical RK4 step, kept for comparison: its energy error grows steadily. */
export function rk4PendulumStep(s: PendulumState, length: number, g: number, h: number): PendulumState {
  const k = g / length
  const f = (theta: number, omega: number) => [omega, -k * Math.sin(theta)] as const
  const [a1, b1] = f(s.theta, s.omega)
  const [a2, b2] = f(s.theta + (h / 2) * a1, s.omega + (h / 2) * b1)
  const [a3, b3] = f(s.theta + (h / 2) * a2, s.omega + (h / 2) * b2)
  const [a4, b4] = f(s.theta + h * a3, s.omega + h * b3)
  return {
    t: s.t + h,
    theta: s.theta + (h / 6) * (a1 + 2 * a2 + 2 * a3 + a4),
    omega: s.omega + (h / 6) * (b1 + 2 * b2 + 2 * b3 + b4),
  }
}

/** Time at which θ passes upwards through zero between two states, or null (linear interpolation). */
export function upwardCrossing(previous: PendulumState, next: PendulumState): number | null {
  if (!(previous.theta < 0 && next.theta >= 0)) return null
  const f = -previous.theta / (next.theta - previous.theta)
  return previous.t + f * (next.t - previous.t)
}

/** Advance by `duration` using fixed Verlet steps of at most h, returning every upward crossing time. */
export function advancePendulum(
  s: PendulumState,
  length: number,
  g: number,
  duration: number,
  h = 1e-3,
): { state: PendulumState; crossings: number[] } {
  const crossings: number[] = []
  let state = s
  let remaining = duration
  while (remaining > 1e-12) {
    const step = Math.min(h, remaining)
    const next = verletStep(state, length, g, step)
    const c = upwardCrossing(state, next)
    if (c !== null) crossings.push(c)
    state = next
    remaining -= step
  }
  return { state, crossings }
}
