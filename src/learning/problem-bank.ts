import type { Locale } from '@/i18n/locales'
import type { Level } from '@/levels'

/**
 * Numerical problems for the learning path's "Apply it" step.
 *
 * Each problem belongs to one experiment and unlocks with that step's practice
 * questions, once the learner has tested a prediction in the experiment (see
 * session-progress.ts): the learner calculates with a model they have already
 * seen at work. Every experiment has a Beginner problem, and every module has
 * at least one Intermediate and one Advanced problem; each level adds problems
 * and never hides a topic.
 *
 * Sources hold everything that is the same in every language (experiment,
 * level, answer); PROBLEM_COPY holds the text. problem-bank.test.ts checks the
 * coverage, the copy in every language and the answers against the physics
 * engine.
 */

/** Answers within 2% of the expected value count as correct. */
export const RELATIVE_TOLERANCE = 0.02

export interface ProblemSource {
  readonly id: string
  /** Route of the experiment the problem applies. */
  readonly experiment: string
  readonly minLevel: Level
  /** Expected answer, in the unit given in the copy. Never zero. */
  readonly answer: number
}

export interface ProblemCopy {
  readonly title: string
  readonly scenario: string
  readonly given: string
  readonly target: string
  readonly unit: string
  readonly formula: string
  readonly hint: string
  readonly steps: readonly string[]
}

export interface PhysicsProblem extends ProblemSource, ProblemCopy {}

export const PROBLEM_SOURCES: readonly ProblemSource[] = [
  { id: 'average-speed-pause', experiment: '/space/space-vs-time', minLevel: 'beginner', answer: 6 / 10 },
  { id: 'instantaneous-velocity', experiment: '/space/space-vs-time', minLevel: 'intermediate', answer: 3 - 1 * 2 },
  { id: 'displacement-3d', experiment: '/space/displacement-3d', minLevel: 'beginner', answer: Math.hypot(1, 2, 2) },
  { id: 'axis-rotation', experiment: '/space/displacement-3d', minLevel: 'advanced', answer: 3 * Math.cos(Math.PI / 6) + 4 * Math.sin(Math.PI / 6) },
  { id: 'pendulum-period', experiment: '/time/pendulum', minLevel: 'beginner', answer: 2 * Math.PI * Math.sqrt(1 / 9.81) },
  { id: 'pendulum-moon', experiment: '/time/pendulum', minLevel: 'intermediate', answer: 2 * Math.sqrt(9.81 / 1.62) },
  { id: 'pendulum-amplitude', experiment: '/time/pendulum', minLevel: 'advanced', answer: (100 * (Math.PI / 6) ** 2) / 16 },
  { id: 'net-force', experiment: '/mechanics/newtonian', minLevel: 'beginner', answer: 10 / 2.5 },
  { id: 'kinetic-friction-level', experiment: '/mechanics/force-lab', minLevel: 'beginner', answer: (30 - 0.2 * 10 * 9.8) / 10 },
  { id: 'incline-slide', experiment: '/mechanics/force-lab', minLevel: 'intermediate', answer: 9.8 * (Math.sin(Math.PI / 6) - 0.2 * Math.cos(Math.PI / 6)) },
  { id: 'inelastic-collision', experiment: '/mechanics/momentum-collisions', minLevel: 'beginner', answer: (2 * 3 + 1 * -1) / (2 + 1) },
  { id: 'elastic-rebound', experiment: '/mechanics/momentum-collisions', minLevel: 'advanced', answer: ((1 - 3) * 4) / (1 + 3) },
  { id: 'projectile-horizontal', experiment: '/mechanics/projectile', minLevel: 'beginner', answer: 2 * Math.sqrt((2 * 1.25) / 9.8) },
  { id: 'projectile-range', experiment: '/mechanics/projectile', minLevel: 'intermediate', answer: (20 ** 2 * Math.sin(Math.PI / 3)) / 9.8 },
  { id: 'car-bend', experiment: '/mechanics/circular-orbits', minLevel: 'beginner', answer: 20 ** 2 / 50 },
  { id: 'iss-speed', experiment: '/mechanics/circular-orbits', minLevel: 'intermediate', answer: Math.sqrt(3.99e14 / 6.77e6) / 1000 },
  { id: 'time-dilation', experiment: '/relativity/moving-clocks', minLevel: 'beginner', answer: 4 / Math.sqrt(1 - 0.8 ** 2) },
  { id: 'simultaneity-offset', experiment: '/relativity/moving-clocks', minLevel: 'advanced', answer: (0.8 * 6) / Math.sqrt(1 - 0.8 ** 2) },
  { id: 'interval-proper-time', experiment: '/relativity/two-perspectives', minLevel: 'beginner', answer: Math.sqrt(5 ** 2 - 3 ** 2) },
  { id: 'lorentz-time', experiment: '/relativity/two-perspectives', minLevel: 'intermediate', answer: (5 - 0.6 * 3) / Math.sqrt(1 - 0.6 ** 2) },
  { id: 'length-contraction', experiment: '/relativity/length-contraction', minLevel: 'beginner', answer: 100 * Math.sqrt(1 - 0.6 ** 2) },
  { id: 'gps-net', experiment: '/gravity/clock-rates', minLevel: 'beginner', answer: 45.7 - 7.2 },
  { id: 'height-clock-gain', experiment: '/gravity/clock-rates', minLevel: 'intermediate', answer: ((9.81 * 1000) / 3e8 ** 2) * 86_400 * 1e9 },
  { id: 'sun-schwarzschild-radius', experiment: '/gravity/geodesic-motion', minLevel: 'beginner', answer: (2 * 6.67e-11 * 1.99e30) / 3e8 ** 2 / 1000 },
  { id: 'mercury-precession', experiment: '/gravity/geodesic-motion', minLevel: 'advanced', answer: ((3 * Math.PI * 2.95) / (5.79e7 * (1 - 0.206 ** 2))) * 206_265 * 415 },
  { id: 'cosmological-redshift', experiment: '/cosmology/evolving-space', minLevel: 'beginner', answer: 1 + 1.5 },
  { id: 'hubble-time', experiment: '/cosmology/evolving-space', minLevel: 'intermediate', answer: 3.086e19 / 70 / 3.156e16 },
  { id: 'matter-age', experiment: '/cosmology/evolving-space', minLevel: 'advanced', answer: (2 / 3) * (3.086e19 / 70 / 3.156e16) },
  { id: 'work-energy-speed', experiment: '/mechanics/force-lab', minLevel: 'advanced', answer: 6 },
  { id: 'circular-orbit-energy', experiment: '/mechanics/circular-orbits', minLevel: 'advanced', answer: -(3.99e14 / (2 * 6.77e6)) / 1e6 },
]

export const PROBLEM_COPY: Record<Locale, Readonly<Record<string, ProblemCopy>>> = {
  "en": {
    "car-bend": {
      "title": "Round a bend",
      "scenario": "A car drives round a circular bend of radius 50 m at a steady 20 m/s. What acceleration does it have, and so what must the road’s friction supply per kilogram?",
      "given": "v = 20 m/s; r = 50 m",
      "target": "Centripetal acceleration",
      "unit": "m/s²",
      "formula": "a = v² / r",
      "hint": "The speed is steady, but the direction changes. Square the speed, then divide by the radius.",
      "steps": [
        "Moving in a circle at constant speed, the car accelerates towards the centre of the bend.",
        "a = v² / r = (20 m/s)² / 50 m = 400 / 50 m/s².",
        "a = 8.0 m/s², towards the centre of the bend.",
        "Friction from the road must supply 8.0 N per kilogram; on ice it cannot, and the car carries on in a straight line."
      ]
    },
    "iss-speed": {
      "title": "How fast is the ISS?",
      "scenario": "The International Space Station orbits about 6.77 × 10⁶ m from the Earth’s centre, on a nearly circular orbit. For the Earth, GM = 3.99 × 10¹⁴ m³/s². How fast does the station move?",
      "given": "r = 6.77 × 10⁶ m; GM = 3.99 × 10¹⁴ m³/s²",
      "target": "Orbital speed",
      "unit": "km/s",
      "formula": "GMm/r² = mv²/r, so v = √(GM/r)",
      "hint": "Gravity supplies exactly the force a circle needs. Set them equal, solve for v, and convert m/s to km/s.",
      "steps": [
        "For a circular orbit, gravity is the centripetal force: GMm/r² = mv²/r.",
        "The satellite’s mass cancels: v = √(GM/r) = √(3.99 × 10¹⁴ / 6.77 × 10⁶) m/s.",
        "v ≈ √(5.89 × 10⁷) ≈ 7.68 × 10³ m/s ≈ 7.68 km/s.",
        "At this speed the station goes round the Earth in about 92 minutes."
      ]
    },
    "average-speed-pause": {
      "title": "Average speed with a stop",
      "scenario": "An object moves 6.0 m along a track in 4.0 s, then stays still for 6.0 s while the clock keeps running. What is its average speed over the whole 10 s?",
      "given": "Distance = 6.0 m; moving time = 4.0 s; stopped time = 6.0 s",
      "target": "Average speed",
      "unit": "m/s",
      "formula": "average speed = distance / total time",
      "hint": "Stopping the object does not stop time. Divide by all the time that passed, not only the time it moved.",
      "steps": [
        "Time keeps passing while the object is still, so the total time is 4.0 s + 6.0 s = 10 s.",
        "Average speed = distance / total time = 6.0 m / 10 s.",
        "Average speed = 0.60 m/s.",
        "Dividing by 4.0 s instead gives 1.5 m/s: the speed while moving, not the average over the run."
      ]
    },
    "instantaneous-velocity": {
      "title": "Velocity from a position function",
      "scenario": "An object’s position along a track is x(t) = 2 + 3t − 0.5t², with x in metres and t in seconds. What is its velocity at t = 2.0 s?",
      "given": "x(t) = 2 + 3t − 0.5t² (m); t = 2.0 s",
      "target": "Velocity at t = 2.0 s",
      "unit": "m/s",
      "formula": "v(t) = dx/dt",
      "hint": "Differentiate x(t) term by term, then substitute t = 2.0 s.",
      "steps": [
        "Velocity is the rate of change of position: v(t) = dx/dt.",
        "Differentiate: v(t) = 3 − 1.0t (m/s).",
        "Substitute t = 2.0 s: v = 3 − 2 = 1.0 m/s.",
        "It is the slope of the position–time graph at t = 2.0 s; the object is still moving forwards but slowing down."
      ]
    },
    "displacement-3d": {
      "title": "Calculate a 3D displacement",
      "scenario": "A drone moves from the origin to the point (1 m, 2 m, 2 m). What is the magnitude of its straight-line displacement?",
      "given": "Δx = 1 m; Δy = 2 m; Δz = 2 m",
      "target": "Displacement magnitude",
      "unit": "m",
      "formula": "|Δr| = √(Δx² + Δy² + Δz²)",
      "hint": "Square each component, add the squares, then take the square root.",
      "steps": [
        "The displacement vector is (1, 2, 2) m.",
        "Use the three-dimensional Pythagorean theorem: |Δr| = √(1² + 2² + 2²) m.",
        "Evaluate: √(1 + 4 + 4) = √9 = 3.",
        "The straight-line displacement has magnitude 3 m, regardless of the route taken."
      ]
    },
    "axis-rotation": {
      "title": "Rotate the coordinate axes",
      "scenario": "A displacement is (3.0 m, 4.0 m, 0) in one set of axes. The x and y axes are rotated by 30° about the z axis, without moving the object. What is the displacement’s new x′ component?",
      "given": "Δx = 3.0 m; Δy = 4.0 m; Δz = 0; rotation θ = 30° about z",
      "target": "New component Δx′",
      "unit": "m",
      "formula": "Δx′ = Δx cos θ + Δy sin θ",
      "hint": "Project the unchanged displacement onto the rotated x′ axis. Check your result by computing Δy′ and the magnitude in both sets of axes.",
      "steps": [
        "Rotating the axes changes the components, not the displacement itself.",
        "Δx′ = Δx cos θ + Δy sin θ = 3.0 × 0.866 + 4.0 × 0.500 ≈ 4.60 m.",
        "Similarly Δy′ = −Δx sin θ + Δy cos θ = −1.50 + 3.46 ≈ 1.96 m.",
        "Check: √(4.60² + 1.96²) ≈ 5.0 m = √(3.0² + 4.0²). The magnitude is the same in both sets of axes."
      ]
    },
    "pendulum-period": {
      "title": "Estimate a pendulum’s period",
      "scenario": "A simple pendulum has length 1.00 m. For small oscillations on Earth, use g = 9.81 m/s². Estimate its period.",
      "given": "L = 1.00 m; g = 9.81 m/s²",
      "target": "Period",
      "unit": "s",
      "formula": "T ≈ 2π√(L / g)",
      "hint": "Substitute the length and gravitational acceleration inside the square root, then multiply by 2π.",
      "steps": [
        "For small oscillations, the simple-pendulum approximation is T ≈ 2π√(L/g).",
        "Substitute: T ≈ 2π√(1.00/9.81).",
        "Evaluate: T ≈ 2.006 s.",
        "One complete oscillation takes about 2.01 s. The small-angle assumption matters."
      ]
    },
    "pendulum-moon": {
      "title": "Take a pendulum clock to the Moon",
      "scenario": "A pendulum has a period of 2.00 s on the Earth (g = 9.81 m/s²). The same pendulum is taken to the Moon (g = 1.62 m/s²). What is its period there?",
      "given": "T_Earth = 2.00 s; g_Earth = 9.81 m/s²; g_Moon = 1.62 m/s²; same length",
      "target": "Period on the Moon",
      "unit": "s",
      "formula": "T = 2π√(L/g), so T_Moon = T_Earth √(g_Earth / g_Moon)",
      "hint": "The length does not change, so the period is proportional to 1/√g. Weaker gravity means a longer period.",
      "steps": [
        "For small swings T = 2π√(L/g), and L is the same in both places.",
        "Divide the two periods: T_Moon / T_Earth = √(g_Earth / g_Moon) = √(9.81 / 1.62) ≈ 2.46.",
        "T_Moon ≈ 2.00 s × 2.46 ≈ 4.92 s.",
        "A clock calibrated on the Earth runs about 2.5 times too slowly on the Moon: it measures pendulum swings, not time itself."
      ]
    },
    "pendulum-amplitude": {
      "title": "How much does a wide swing slow a clock?",
      "scenario": "A pendulum is released from 30° instead of a small angle. Using the first correction to the small-angle formula, by what percentage is its period longer than T₀ = 2π√(L/g)?",
      "given": "Release amplitude θ₀ = 30° = π/6 rad",
      "target": "Increase in period",
      "unit": "%",
      "formula": "T ≈ T₀ (1 + θ₀²/16), with θ₀ in radians",
      "hint": "Convert the angle to radians first, then evaluate θ₀²/16 and express it as a percentage.",
      "steps": [
        "The small-angle formula assumes sin θ ≈ θ; at larger amplitudes the period grows.",
        "θ₀ = 30° = π/6 ≈ 0.524 rad, so θ₀² ≈ 0.274.",
        "θ₀²/16 ≈ 0.0171, so the period is about 1.71% longer than T₀.",
        "The exact period (an elliptic integral, as in the experiment) gives about 1.74%. Over a day, a 1.7% error is roughly 25 minutes."
      ]
    },
    "net-force": {
      "title": "Find the acceleration",
      "scenario": "A 2.5 kg cart experiences a constant net force of 10 N on a frictionless track. What is its acceleration?",
      "given": "Mass = 2.5 kg; net force = 10 N",
      "target": "Acceleration",
      "unit": "m/s²",
      "formula": "a = F_net / m",
      "hint": "Divide the net force by the mass. Check that newtons per kilogram is equivalent to m/s².",
      "steps": [
        "Start with Newton’s second law: F_net = m a.",
        "Rearrange for acceleration: a = F_net / m.",
        "Substitute: a = 10 N / 2.5 kg = 4 m/s².",
        "The cart accelerates at 4 m/s² in the direction of the net force."
      ]
    },
    "kinetic-friction-level": {
      "title": "Push a crate against friction",
      "scenario": "A 10 kg crate is already sliding across a level floor. You push it horizontally with 30 N. The coefficient of kinetic friction is 0.20. Use g = 9.8 m/s². What is the crate’s acceleration?",
      "given": "m = 10 kg; F_push = 30 N; μk = 0.20; g = 9.8 m/s²",
      "target": "Acceleration",
      "unit": "m/s²",
      "formula": "a = (F_push − μk m g) / m",
      "hint": "Draw the free-body diagram. On a level floor the normal force equals the weight; friction opposes the sliding.",
      "steps": [
        "Normal force: N = m g = 10 kg × 9.8 m/s² = 98 N.",
        "Kinetic friction: f = μk N = 0.20 × 98 N = 19.6 N, opposite to the motion.",
        "Net force: 30 N − 19.6 N = 10.4 N.",
        "a = F_net / m = 10.4 N / 10 kg ≈ 1.04 m/s², in the direction of the push."
      ]
    },
    "incline-slide": {
      "title": "Slide down a rough incline",
      "scenario": "A block slides down a 30° incline. The coefficient of kinetic friction is 0.20. Use g = 9.8 m/s². What is its acceleration along the slope?",
      "given": "θ = 30°; μk = 0.20; g = 9.8 m/s²; the block is already sliding",
      "target": "Acceleration down the slope",
      "unit": "m/s²",
      "formula": "a = g (sin θ − μk cos θ)",
      "hint": "Resolve the weight into components along and perpendicular to the slope. The normal force balances only the perpendicular component.",
      "steps": [
        "Along the slope, gravity contributes m g sin θ downhill.",
        "Perpendicular to the slope, N = m g cos θ, so kinetic friction is μk m g cos θ uphill.",
        "Newton’s second law along the slope: m a = m g sin θ − μk m g cos θ, so the mass cancels.",
        "a = 9.8 × (0.500 − 0.20 × 0.866) ≈ 3.20 m/s² down the slope."
      ]
    },
    "inelastic-collision": {
      "title": "Find the shared velocity after a collision",
      "scenario": "A 2 kg cart moving at +3 m/s collides with a 1 kg cart moving at −1 m/s. They stick together. Find their final velocity.",
      "given": "m₁ = 2 kg; u₁ = +3 m/s; m₂ = 1 kg; u₂ = −1 m/s",
      "target": "Final velocity",
      "unit": "m/s",
      "formula": "v = (m₁u₁ + m₂u₂) / (m₁ + m₂)",
      "hint": "Take right as positive. Add the carts’ signed momenta before dividing by their combined mass.",
      "steps": [
        "Because the carts stick together, this is a perfectly inelastic collision.",
        "Conserve momentum: m₁u₁ + m₂u₂ = (m₁ + m₂)v.",
        "Substitute: (2 × 3 + 1 × −1) / (2 + 1) = 5/3.",
        "The shared velocity is about +1.67 m/s, so the carts move to the right."
      ]
    },
    "elastic-rebound": {
      "title": "Velocity after an elastic collision",
      "scenario": "A 1.0 kg cart moving at +4.0 m/s collides elastically with a 3.0 kg cart at rest. What is the velocity of the 1.0 kg cart after the collision? Include the sign.",
      "given": "m₁ = 1.0 kg; u₁ = +4.0 m/s; m₂ = 3.0 kg; u₂ = 0; elastic",
      "target": "Velocity v₁ of the lighter cart",
      "unit": "m/s",
      "formula": "v₁ = (m₁ − m₂) u₁ / (m₁ + m₂)",
      "hint": "An elastic collision conserves both momentum and kinetic energy. Solve the two equations together, or use the relative-velocity condition v₂ − v₁ = u₁ − u₂.",
      "steps": [
        "Momentum: m₁u₁ = m₁v₁ + m₂v₂. Elastic, so the relative velocity reverses: v₂ − v₁ = u₁.",
        "Solving gives v₁ = (m₁ − m₂) u₁ / (m₁ + m₂) and v₂ = 2m₁u₁ / (m₁ + m₂).",
        "v₁ = (1.0 − 3.0) × 4.0 / 4.0 = −2.0 m/s; v₂ = +2.0 m/s.",
        "Check: momentum 4.0 = −2.0 + 6.0 kg·m/s, and kinetic energy 8.0 J = 2.0 J + 6.0 J. The lighter cart bounces back."
      ]
    },
    "projectile-horizontal": {
      "title": "Roll a ball off a bench",
      "scenario": "A ball rolls off a 1.25 m high bench at 2.0 m/s horizontally. Ignore air resistance and use g = 9.8 m/s². How far from the bench does it land?",
      "given": "Height h = 1.25 m; horizontal speed vₓ = 2.0 m/s; g = 9.8 m/s²",
      "target": "Horizontal distance",
      "unit": "m",
      "formula": "t = √(2h/g); x = vₓ t",
      "hint": "Treat the vertical and horizontal motions separately. The fall time depends only on the height; the horizontal speed stays constant.",
      "steps": [
        "Vertically the ball starts with zero speed and falls h = ½ g t².",
        "t = √(2 × 1.25 / 9.8) ≈ 0.505 s.",
        "Horizontally there is no force, so x = vₓ t = 2.0 m/s × 0.505 s ≈ 1.01 m.",
        "A faster roll would land further away, but it would take the same time to reach the floor."
      ]
    },
    "projectile-range": {
      "title": "Calculate a projectile’s range",
      "scenario": "A ball is launched at 20 m/s at 30° above level ground. Ignore air resistance and use g = 9.8 m/s². How far away does it land?",
      "given": "v₀ = 20 m/s; θ = 30°; g = 9.8 m/s²",
      "target": "Horizontal range",
      "unit": "m",
      "formula": "R = v₀² sin(2θ) / g",
      "hint": "For equal launch and landing heights, use the range equation. Evaluate sin(60°), not sin(30°).",
      "steps": [
        "For a projectile that lands at its launch height, R = v₀² sin(2θ) / g.",
        "Substitute: R = 20² × sin(60°) / 9.8.",
        "Evaluate: R ≈ 400 × 0.8660 / 9.8 ≈ 35.35 m.",
        "The idealised horizontal range is about 35.35 m. The result assumes no air resistance and equal launch and landing heights."
      ]
    },
    "time-dilation": {
      "title": "Calculate a dilated time interval",
      "scenario": "A clock moving at 0.80c measures 4.0 μs between two events on its path. What time interval does an observer who sees the clock moving measure?",
      "given": "Proper time Δτ = 4.0 μs; speed v = 0.80c",
      "target": "Observer’s time interval",
      "unit": "μs",
      "formula": "Δt = γΔτ; γ = 1 / √(1 − v²/c²)",
      "hint": "First calculate γ for v/c = 0.80. The moving-clock interval is the proper time, so the other frame measures a longer interval.",
      "steps": [
        "The clock’s own frame measures the proper time Δτ = 4.0 μs.",
        "Calculate the Lorentz factor: γ = 1/√(1 − 0.80²) = 1/0.6 = 5/3.",
        "Apply time dilation: Δt = γΔτ = (5/3)(4.0 μs) ≈ 6.67 μs.",
        "The observer measures about 6.67 μs. This comparison concerns the same pair of events."
      ]
    },
    "simultaneity-offset": {
      "title": "Simultaneous for whom?",
      "scenario": "Two lamps 6.0 light-seconds apart flash at the same time in the Earth’s frame. A spaceship flies along the line joining them at 0.80c. By how much do the two flashes differ in time in the ship’s frame?",
      "given": "Δx = 6.0 light-seconds; Δt = 0 (Earth frame); v = 0.80c",
      "target": "Time difference in the ship frame, |Δt′|",
      "unit": "s",
      "formula": "Δt′ = γ (Δt − v Δx / c²)",
      "hint": "Use the Lorentz transformation for time with Δt = 0. In light-seconds and seconds, v Δx / c² is simply 0.80 × 6.0 s.",
      "steps": [
        "γ = 1 / √(1 − 0.80²) = 1 / 0.60 ≈ 1.667.",
        "With Δt = 0: Δt′ = −γ v Δx / c² = −1.667 × 0.80 × 6.0 s.",
        "|Δt′| ≈ 8.0 s. The flash at the front of the ship’s motion happens first in the ship’s frame.",
        "Both frames are right: simultaneity depends on the frame, while the interval between the events is the same in both."
      ]
    },
    "interval-proper-time": {
      "title": "The time a travelling clock shows",
      "scenario": "In the Earth’s frame, two events are 5.0 s apart in time and 3.0 light-seconds apart in space. A clock travels at constant speed from the first event to the second. What time does it show between them?",
      "given": "Δt = 5.0 s; Δx = 3.0 light-seconds (Earth frame)",
      "target": "Proper time Δτ on the travelling clock",
      "unit": "s",
      "formula": "(c Δτ)² = (c Δt)² − Δx²",
      "hint": "The spacetime interval is the same in every frame. In seconds and light-seconds, Δτ² = Δt² − Δx².",
      "steps": [
        "The clock is present at both events, so it measures the proper time between them.",
        "Δτ² = (5.0 s)² − (3.0 s)² = 25 − 9 = 16 s².",
        "Δτ = 4.0 s, less than the 5.0 s between the events in the Earth’s frame.",
        "The minus sign is what separates spacetime from ordinary space, where the two squares would add."
      ]
    },
    "lorentz-time": {
      "title": "When did it happen for the ship?",
      "scenario": "A spaceship passes the Earth at t = 0 moving at 0.60c. In the Earth’s frame, an event happens 3.0 light-years away (in the ship’s direction of travel) at t = 5.0 years. At what time does it happen in the ship’s frame?",
      "given": "v = 0.60c; x = 3.0 light-years; t = 5.0 years (Earth frame); both clocks read 0 as the ship passes the Earth",
      "target": "Time t′ in the ship frame",
      "unit": "years",
      "formula": "t′ = γ (t − v x / c²)",
      "hint": "Find γ first. In years and light-years, v x / c² is 0.60 × 3.0 years.",
      "steps": [
        "γ = 1 / √(1 − 0.60²) = 1 / 0.80 = 1.25.",
        "v x / c² = 0.60 × 3.0 years = 1.8 years.",
        "t′ = 1.25 × (5.0 − 1.8) years = 1.25 × 3.2 years = 4.0 years.",
        "A Galilean transformation would give t′ = t = 5.0 years; experiments agree with the Lorentz transformation."
      ]
    },
    "length-contraction": {
      "title": "Measure a moving spaceship",
      "scenario": "A spaceship has a proper length of 100 m. It passes an observer at 0.60c. What length does that observer measure, recording both endpoints simultaneously in their frame?",
      "given": "Proper length L₀ = 100 m; speed v = 0.60c",
      "target": "Measured length",
      "unit": "m",
      "formula": "L = L₀ / γ; γ = 1 / √(1 − v²/c²)",
      "hint": "Calculate γ at 0.60c, then divide the proper length by it.",
      "steps": [
        "The spaceship’s rest-frame length is the proper length L₀ = 100 m.",
        "Calculate γ = 1/√(1 − 0.60²) = 1/0.8 = 1.25.",
        "Length contraction gives L = L₀/γ = 100/1.25 = 80 m.",
        "The observer measures 80 m when both endpoint positions are recorded simultaneously in that observer’s frame."
      ]
    },
    "gps-net": {
      "title": "Add up the GPS clock corrections",
      "scenario": "Compared with a clock on the ground, a GPS satellite clock gains about 45.7 μs per day because gravity is weaker at its height, and loses about 7.2 μs per day because of its orbital speed. What is its net change per day?",
      "given": "Gravitational gain = +45.7 μs/day; speed effect = −7.2 μs/day",
      "target": "Net gain per day",
      "unit": "μs",
      "formula": "net = gravitational effect + speed effect",
      "hint": "Keep the signs: one effect makes the satellite clock run faster, the other slower.",
      "steps": [
        "Weaker gravity at the satellite’s height makes its clock run faster: +45.7 μs per day.",
        "Its orbital speed makes it run slower: −7.2 μs per day.",
        "Net: 45.7 − 7.2 ≈ +38.5 μs per day.",
        "Light travels about 11 km in 38 μs, so without this correction positions would drift by kilometres each day."
      ]
    },
    "height-clock-gain": {
      "title": "A clock on a mountain",
      "scenario": "One clock sits 1000 m higher than another near the Earth’s surface (g = 9.81 m/s², c = 3.00 × 10⁸ m/s). In the weak-field approximation, how much time does the higher clock gain in one day (86 400 s)?",
      "given": "h = 1000 m; g = 9.81 m/s²; c = 3.00 × 10⁸ m/s; one day = 86 400 s",
      "target": "Time gained per day",
      "unit": "ns",
      "formula": "Δτ/τ ≈ g h / c²",
      "hint": "First find the fractional rate difference g h / c², then multiply by the number of seconds in a day. 1 ns = 10⁻⁹ s.",
      "steps": [
        "Fractional rate difference: g h / c² = 9.81 × 1000 / (3.00 × 10⁸)² ≈ 1.09 × 10⁻¹³.",
        "Gain per day: 1.09 × 10⁻¹³ × 86 400 s ≈ 9.42 × 10⁻⁹ s.",
        "That is about 9.4 ns per day.",
        "Optical atomic clocks now detect this effect for height differences of centimetres."
      ]
    },
    "sun-schwarzschild-radius": {
      "title": "Squeeze the Sun into a black hole",
      "scenario": "The Sun has mass 1.99 × 10³⁰ kg. What is its Schwarzschild radius: the radius it would need to be squeezed inside to become a black hole? Use G = 6.67 × 10⁻¹¹ N·m²/kg² and c = 3.00 × 10⁸ m/s.",
      "given": "M = 1.99 × 10³⁰ kg; G = 6.67 × 10⁻¹¹ N·m²/kg²; c = 3.00 × 10⁸ m/s",
      "target": "Schwarzschild radius",
      "unit": "km",
      "formula": "r_s = 2 G M / c²",
      "hint": "Work in SI units to get metres, then divide by 1000 for kilometres. Handle the powers of ten separately.",
      "steps": [
        "r_s = 2 × 6.67 × 10⁻¹¹ × 1.99 × 10³⁰ / (3.00 × 10⁸)².",
        "Numerator ≈ 2.65 × 10²⁰; denominator = 9.00 × 10¹⁶.",
        "r_s ≈ 2.95 × 10³ m ≈ 2.95 km.",
        "The Sun’s actual radius is about 700 000 km, so its gravity is far too weak for strong-field effects; orbits around it are nearly Newtonian."
      ]
    },
    "mercury-precession": {
      "title": "Mercury’s extra precession",
      "scenario": "For a nearly Newtonian orbit, general relativity predicts that periapsis advances by Δφ = 3π r_s / (a (1 − e²)) radians per orbit. For Mercury around the Sun, r_s = 2.95 km, a = 5.79 × 10⁷ km and e = 0.206, and Mercury completes 415 orbits per century. What is the advance in arcseconds per century?",
      "given": "r_s = 2.95 km; a = 5.79 × 10⁷ km; e = 0.206; 415 orbits per century; 1 rad = 206 265″",
      "target": "Periapsis advance per century",
      "unit": "″",
      "formula": "Δφ = 3π r_s / (a (1 − e²)) per orbit",
      "hint": "Compute Δφ per orbit in radians (km cancel), convert to arcseconds, then multiply by the number of orbits.",
      "steps": [
        "a (1 − e²) = 5.79 × 10⁷ km × (1 − 0.0424) ≈ 5.54 × 10⁷ km.",
        "Δφ = 3π × 2.95 / 5.54 × 10⁷ ≈ 5.01 × 10⁻⁷ rad per orbit ≈ 0.103″ per orbit.",
        "Per century: 0.103″ × 415 ≈ 43″.",
        "This matches the 43″ per century that Newtonian gravity, including the pull of the other planets, could not explain."
      ]
    },
    "cosmological-redshift": {
      "title": "Connect redshift to expansion",
      "scenario": "Light is observed today with cosmological redshift z = 1.5. In a homogeneous expanding-universe model, by what factor has the scale factor increased since the light was emitted?",
      "given": "Redshift z = 1.5",
      "target": "Expansion factor a_today / a_emit",
      "unit": "×",
      "formula": "1 + z = a_today / a_emit",
      "hint": "Add 1 to the redshift. The result is a ratio of scale factors, not a speed.",
      "steps": [
        "For cosmological redshift in an FLRW model, 1 + z = a_today/a_emit.",
        "Substitute z = 1.5: a_today/a_emit = 1 + 1.5.",
        "The ratio is 2.5.",
        "The scale factor is 2.5 times larger today than when the light was emitted. This does not mean galaxies locally move through space at 2.5 times the speed of light."
      ]
    },
    "hubble-time": {
      "title": "The Hubble time",
      "scenario": "The Hubble constant is H₀ = 70 km/s per megaparsec. What is the Hubble time 1/H₀, in billions of years (Gyr)? Use 1 Mpc = 3.086 × 10¹⁹ km and 1 Gyr = 3.156 × 10¹⁶ s.",
      "given": "H₀ = 70 km/s/Mpc; 1 Mpc = 3.086 × 10¹⁹ km; 1 Gyr = 3.156 × 10¹⁶ s",
      "target": "Hubble time 1/H₀",
      "unit": "Gyr",
      "formula": "t_H = 1/H₀",
      "hint": "Convert H₀ to units of 1/s by dividing by the number of kilometres in a megaparsec; then invert and convert seconds to Gyr.",
      "steps": [
        "H₀ = 70 km/s / (3.086 × 10¹⁹ km) ≈ 2.27 × 10⁻¹⁸ s⁻¹.",
        "1/H₀ ≈ 4.41 × 10¹⁷ s.",
        "In Gyr: 4.41 × 10¹⁷ s / 3.156 × 10¹⁶ s ≈ 14.0 Gyr.",
        "The Hubble time sets the timescale of expansion. The actual age depends on how the expansion rate has changed, which depends on what the universe contains."
      ]
    },
    "matter-age": {
      "title": "The age of a matter-only universe",
      "scenario": "In a flat universe containing only matter, the scale factor grows as a ∝ t^(2/3). If H₀ = 70 km/s/Mpc (Hubble time 1/H₀ ≈ 13.97 Gyr), how old is that model universe today?",
      "given": "a ∝ t^(2/3); 1/H₀ ≈ 13.97 Gyr",
      "target": "Age of the model universe",
      "unit": "Gyr",
      "formula": "H = ȧ/a = 2/(3t), so t₀ = 2/(3H₀)",
      "hint": "Differentiate a ∝ t^(2/3) to find H = ȧ/a as a function of t, then solve for t when H = H₀.",
      "steps": [
        "With a = k t^(2/3), ȧ = (2/3) k t^(−1/3).",
        "H = ȧ / a = 2 / (3t), so the age today is t₀ = 2 / (3H₀).",
        "t₀ = (2/3) × 13.97 Gyr ≈ 9.31 Gyr.",
        "Some stars are older than 9.3 Gyr: one sign that a matter-only model is not our universe. Dark energy makes the expansion speed up and the age longer."
      ]
    },
  "work-energy-speed": {
    "title": "Where did the cart's energy go?",
    "scenario": "A 10 kg cart is moving at 2 m/s. A motor pulls it forward with 50 N while kinetic friction opposes it with 10 N over 4 m. What is its final speed?",
    "given": "m = 10 kg; vᵢ = 2 m/s; Fmotor = 50 N; fₖ = 10 N; d = 4 m",
    "target": "Final speed", "unit": "m/s",
    "formula": "Wnet = (Fmotor − fₖ)d; Kf = Ki + Wnet; v_f = √(2Kf/m)",
    "hint": "Calculate the signed work of each force. Friction does negative work; add net work to the initial kinetic energy.",
    "steps": ["The initial kinetic energy is Ki = ½mvᵢ² = 20 J.", "The motor does +50 × 4 = +200 J; friction does −10 × 4 = −40 J. Net work is +160 J.", "The work–energy theorem gives Kf = Ki + Wnet = 20 + 160 = 180 J.", "v_f = √(2Kf/m) = √(360/10) = 6 m/s. Some energy transferred by the motor is dissipated by friction; the remainder increases kinetic energy."]
  },
  "circular-orbit-energy": {
    "title": "Is an orbit's total energy positive or negative?",
    "scenario": "A satellite is in a circular orbit at radius 6.77 × 10⁶ m from Earth's centre. Use GM = 3.99 × 10¹⁴ m³/s². What is its total mechanical energy per kilogram, in MJ/kg?",
    "given": "r = 6.77 × 10⁶ m; GM = 3.99 × 10¹⁴ m³/s²",
    "target": "Specific total orbital energy", "unit": "MJ/kg",
    "formula": "ε = K/m + U/m = v²/2 − GM/r = −GM/(2r)",
    "hint": "For a circular orbit, v² = GM/r. Add kinetic energy per kilogram to gravitational potential energy per kilogram, whose zero is at infinity.",
    "steps": ["With zero gravitational potential at infinity, U/m = −GM/r ≈ −5.90 × 10⁷ J/kg.", "For a circular orbit, K/m = v²/2 = GM/(2r) ≈ +2.95 × 10⁷ J/kg.", "The total is ε = K/m + U/m = −GM/(2r) ≈ −2.95 × 10⁷ J/kg.", "That is −29.5 MJ/kg. Negative total energy means the satellite is gravitationally bound in this Newtonian model; energy must be added to reach zero energy at infinity."]
  },
},
  "id": {
    "car-bend": {
      "title": "Melewati tikungan",
      "scenario": "Sebuah mobil melaju mengitari tikungan melingkar berjari-jari 50 m dengan kelajuan tetap 20 m/s. Berapa percepatannya, dan dengan demikian berapa gaya gesek jalan yang harus diberikan per kilogram?",
      "given": "v = 20 m/s; r = 50 m",
      "target": "Percepatan sentripetal",
      "unit": "m/s²",
      "formula": "a = v² / r",
      "hint": "Kelajuannya tetap, tetapi arahnya berubah. Kuadratkan kelajuan, lalu bagi dengan jari-jari.",
      "steps": [
        "Saat bergerak melingkar dengan kelajuan tetap, mobil mengalami percepatan menuju pusat tikungan.",
        "a = v² / r = (20 m/s)² / 50 m = 400 / 50 m/s².",
        "a = 8,0 m/s², menuju pusat tikungan.",
        "Gesekan jalan harus memberikan 8,0 N per kilogram; di atas es hal itu tidak mungkin, dan mobil terus bergerak lurus."
      ]
    },
    "iss-speed": {
      "title": "Seberapa cepat ISS?",
      "scenario": "Stasiun Luar Angkasa Internasional mengorbit sekitar 6,77 × 10⁶ m dari pusat Bumi dalam orbit yang hampir lingkaran. Untuk Bumi, GM = 3,99 × 10¹⁴ m³/s². Seberapa cepat stasiun itu bergerak?",
      "given": "r = 6,77 × 10⁶ m; GM = 3,99 × 10¹⁴ m³/s²",
      "target": "Kelajuan orbit",
      "unit": "km/s",
      "formula": "GMm/r² = mv²/r, sehingga v = √(GM/r)",
      "hint": "Gravitasi memberikan tepat gaya yang diperlukan lingkaran. Samakan keduanya, selesaikan untuk v, lalu ubah m/s ke km/s.",
      "steps": [
        "Untuk orbit lingkaran, gravitasi adalah gaya sentripetal: GMm/r² = mv²/r.",
        "Massa satelit saling meniadakan: v = √(GM/r) = √(3,99 × 10¹⁴ / 6,77 × 10⁶) m/s.",
        "v ≈ √(5,89 × 10⁷) ≈ 7,68 × 10³ m/s ≈ 7,68 km/s.",
        "Dengan kelajuan ini, stasiun mengelilingi Bumi dalam sekitar 92 menit."
      ]
    },
    "average-speed-pause": {
      "title": "Kelajuan rata-rata dengan berhenti",
      "scenario": "Sebuah benda bergerak 6,0 m sepanjang lintasan dalam 4,0 s, lalu diam selama 6,0 s sementara jam terus berjalan. Berapa kelajuan rata-ratanya selama seluruh 10 s?",
      "given": "Jarak = 6,0 m; waktu bergerak = 4,0 s; waktu diam = 6,0 s",
      "target": "Kelajuan rata-rata",
      "unit": "m/s",
      "formula": "kelajuan rata-rata = jarak / waktu total",
      "hint": "Menghentikan benda tidak menghentikan waktu. Bagi dengan seluruh waktu yang berlalu, bukan hanya waktu saat benda bergerak.",
      "steps": [
        "Waktu terus berjalan saat benda diam, jadi waktu totalnya 4,0 s + 6,0 s = 10 s.",
        "Kelajuan rata-rata = jarak / waktu total = 6,0 m / 10 s.",
        "Kelajuan rata-rata = 0,60 m/s.",
        "Membagi dengan 4,0 s menghasilkan 1,5 m/s: kelajuan saat bergerak, bukan rata-rata selama seluruh percobaan."
      ]
    },
    "instantaneous-velocity": {
      "title": "Kecepatan dari fungsi posisi",
      "scenario": "Posisi sebuah benda sepanjang lintasan adalah x(t) = 2 + 3t − 0,5t², dengan x dalam meter dan t dalam detik. Berapa kecepatannya pada t = 2,0 s?",
      "given": "x(t) = 2 + 3t − 0,5t² (m); t = 2,0 s",
      "target": "Kecepatan pada t = 2,0 s",
      "unit": "m/s",
      "formula": "v(t) = dx/dt",
      "hint": "Turunkan x(t) suku demi suku, lalu substitusikan t = 2,0 s.",
      "steps": [
        "Kecepatan adalah laju perubahan posisi: v(t) = dx/dt.",
        "Turunkan: v(t) = 3 − 1,0t (m/s).",
        "Substitusikan t = 2,0 s: v = 3 − 2 = 1,0 m/s.",
        "Nilai ini adalah kemiringan grafik posisi–waktu pada t = 2,0 s; benda masih bergerak maju tetapi melambat."
      ]
    },
    "displacement-3d": {
      "title": "Hitung perpindahan 3D",
      "scenario": "Sebuah drone bergerak dari titik asal ke titik (1 m, 2 m, 2 m). Berapa besar perpindahan garis lurusnya?",
      "given": "Δx = 1 m; Δy = 2 m; Δz = 2 m",
      "target": "Besar perpindahan",
      "unit": "m",
      "formula": "|Δr| = √(Δx² + Δy² + Δz²)",
      "hint": "Kuadratkan setiap komponen, jumlahkan hasilnya, lalu ambil akar kuadrat.",
      "steps": [
        "Vektor perpindahannya adalah (1, 2, 2) m.",
        "Gunakan teorema Pythagoras tiga dimensi: |Δr| = √(1² + 2² + 2²) m.",
        "Hitung: √(1 + 4 + 4) = √9 = 3.",
        "Besar perpindahan garis lurus adalah 3 m, apa pun lintasan yang ditempuh."
      ]
    },
    "axis-rotation": {
      "title": "Putar sumbu koordinat",
      "scenario": "Sebuah perpindahan bernilai (3,0 m; 4,0 m; 0) dalam satu sistem sumbu. Sumbu x dan y diputar 30° terhadap sumbu z tanpa memindahkan benda. Berapa komponen x′ yang baru?",
      "given": "Δx = 3,0 m; Δy = 4,0 m; Δz = 0; rotasi θ = 30° terhadap z",
      "target": "Komponen baru Δx′",
      "unit": "m",
      "formula": "Δx′ = Δx cos θ + Δy sin θ",
      "hint": "Proyeksikan perpindahan yang tidak berubah ke sumbu x′ yang telah diputar. Periksa hasilnya dengan menghitung Δy′ dan besar perpindahan pada kedua sistem sumbu.",
      "steps": [
        "Memutar sumbu mengubah komponen, bukan perpindahannya.",
        "Δx′ = Δx cos θ + Δy sin θ = 3,0 × 0,866 + 4,0 × 0,500 ≈ 4,60 m.",
        "Dengan cara serupa, Δy′ = −Δx sin θ + Δy cos θ = −1,50 + 3,46 ≈ 1,96 m.",
        "Periksa: √(4,60² + 1,96²) ≈ 5,0 m = √(3,0² + 4,0²). Besarnya sama pada kedua sistem sumbu."
      ]
    },
    "pendulum-period": {
      "title": "Perkirakan periode bandul",
      "scenario": "Sebuah bandul sederhana memiliki panjang 1,00 m. Untuk ayunan kecil di Bumi, gunakan g = 9,81 m/s². Perkirakan periodenya.",
      "given": "L = 1,00 m; g = 9,81 m/s²",
      "target": "Periode",
      "unit": "s",
      "formula": "T ≈ 2π√(L / g)",
      "hint": "Masukkan panjang dan percepatan gravitasi ke dalam akar kuadrat, lalu kalikan dengan 2π.",
      "steps": [
        "Untuk ayunan kecil, pendekatan bandul sederhana adalah T ≈ 2π√(L/g).",
        "Substitusi: T ≈ 2π√(1,00/9,81).",
        "Hitung: T ≈ 2,006 s.",
        "Satu ayunan penuh memerlukan sekitar 2,01 s. Asumsi sudut kecil penting di sini."
      ]
    },
    "pendulum-moon": {
      "title": "Bawa jam pendulum ke Bulan",
      "scenario": "Sebuah pendulum memiliki periode 2,00 s di Bumi (g = 9,81 m/s²). Pendulum yang sama dibawa ke Bulan (g = 1,62 m/s²). Berapa periodenya di sana?",
      "given": "T_Bumi = 2,00 s; g_Bumi = 9,81 m/s²; g_Bulan = 1,62 m/s²; panjang sama",
      "target": "Periode di Bulan",
      "unit": "s",
      "formula": "T = 2π√(L/g), sehingga T_Bulan = T_Bumi √(g_Bumi / g_Bulan)",
      "hint": "Panjangnya tidak berubah, jadi periode sebanding dengan 1/√g. Gravitasi yang lebih lemah berarti periode lebih panjang.",
      "steps": [
        "Untuk ayunan kecil T = 2π√(L/g), dan L sama di kedua tempat.",
        "Bandingkan kedua periode: T_Bulan / T_Bumi = √(g_Bumi / g_Bulan) = √(9,81 / 1,62) ≈ 2,46.",
        "T_Bulan ≈ 2,00 s × 2,46 ≈ 4,92 s.",
        "Jam yang dikalibrasi di Bumi berjalan sekitar 2,5 kali terlalu lambat di Bulan: jam itu mengukur ayunan pendulum, bukan waktu itu sendiri."
      ]
    },
    "pendulum-amplitude": {
      "title": "Seberapa besar ayunan lebar memperlambat jam?",
      "scenario": "Sebuah pendulum dilepaskan dari sudut 30°, bukan sudut kecil. Dengan koreksi pertama terhadap rumus sudut kecil, berapa persen periodenya lebih panjang daripada T₀ = 2π√(L/g)?",
      "given": "Amplitudo pelepasan θ₀ = 30° = π/6 rad",
      "target": "Pertambahan periode",
      "unit": "%",
      "formula": "T ≈ T₀ (1 + θ₀²/16), dengan θ₀ dalam radian",
      "hint": "Ubah sudut ke radian terlebih dahulu, lalu hitung θ₀²/16 dan nyatakan sebagai persentase.",
      "steps": [
        "Rumus sudut kecil mengasumsikan sin θ ≈ θ; pada amplitudo lebih besar periodenya bertambah.",
        "θ₀ = 30° = π/6 ≈ 0,524 rad, sehingga θ₀² ≈ 0,274.",
        "θ₀²/16 ≈ 0,0171, jadi periodenya sekitar 1,71% lebih panjang daripada T₀.",
        "Periode eksak (integral eliptik, seperti dalam eksperimen) memberikan sekitar 1,74%. Dalam sehari, galat 1,7% kira-kira setara 25 menit."
      ]
    },
    "net-force": {
      "title": "Tentukan percepatan",
      "scenario": "Sebuah troli bermassa 2,5 kg mengalami gaya netto konstan 10 N pada lintasan tanpa gesekan. Berapa percepatannya?",
      "given": "Massa = 2,5 kg; gaya netto = 10 N",
      "target": "Percepatan",
      "unit": "m/s²",
      "formula": "a = F_net / m",
      "hint": "Bagi gaya netto dengan massa. Periksa bahwa newton per kilogram setara dengan m/s².",
      "steps": [
        "Mulai dari hukum kedua Newton: F_net = m a.",
        "Susun ulang untuk mencari percepatan: a = F_net / m.",
        "Substitusikan: a = 10 N / 2,5 kg = 4 m/s².",
        "Troli mengalami percepatan 4 m/s² searah gaya netto."
      ]
    },
    "kinetic-friction-level": {
      "title": "Dorong peti melawan gesekan",
      "scenario": "Sebuah peti 10 kg sudah meluncur di lantai datar. Anda mendorongnya secara horizontal dengan 30 N. Koefisien gesekan kinetiknya 0,20. Gunakan g = 9,8 m/s². Berapa percepatan peti?",
      "given": "m = 10 kg; F_dorong = 30 N; μk = 0,20; g = 9,8 m/s²",
      "target": "Percepatan",
      "unit": "m/s²",
      "formula": "a = (F_dorong − μk m g) / m",
      "hint": "Gambarlah diagram benda bebas. Di lantai datar gaya normal sama dengan berat; gesekan melawan arah luncuran.",
      "steps": [
        "Gaya normal: N = m g = 10 kg × 9,8 m/s² = 98 N.",
        "Gesekan kinetik: f = μk N = 0,20 × 98 N = 19,6 N, berlawanan arah gerak.",
        "Gaya netto: 30 N − 19,6 N = 10,4 N.",
        "a = F_netto / m = 10,4 N / 10 kg ≈ 1,04 m/s², searah dorongan."
      ]
    },
    "incline-slide": {
      "title": "Meluncur di bidang miring kasar",
      "scenario": "Sebuah balok meluncur turun pada bidang miring 30°. Koefisien gesekan kinetiknya 0,20. Gunakan g = 9,8 m/s². Berapa percepatannya sepanjang bidang miring?",
      "given": "θ = 30°; μk = 0,20; g = 9,8 m/s²; balok sudah meluncur",
      "target": "Percepatan menuruni bidang",
      "unit": "m/s²",
      "formula": "a = g (sin θ − μk cos θ)",
      "hint": "Uraikan berat menjadi komponen sejajar dan tegak lurus bidang. Gaya normal hanya mengimbangi komponen yang tegak lurus.",
      "steps": [
        "Sejajar bidang, gravitasi memberikan m g sin θ ke bawah.",
        "Tegak lurus bidang, N = m g cos θ, sehingga gesekan kinetik sebesar μk m g cos θ ke atas bidang.",
        "Hukum kedua Newton sepanjang bidang: m a = m g sin θ − μk m g cos θ, sehingga massa saling meniadakan.",
        "a = 9,8 × (0,500 − 0,20 × 0,866) ≈ 3,20 m/s² menuruni bidang."
      ]
    },
    "inelastic-collision": {
      "title": "Tentukan kecepatan bersama setelah tumbukan",
      "scenario": "Troli 2 kg bergerak dengan kecepatan +3 m/s menumbuk troli 1 kg yang bergerak −1 m/s. Keduanya menempel. Tentukan kecepatan akhirnya.",
      "given": "m₁ = 2 kg; u₁ = +3 m/s; m₂ = 1 kg; u₂ = −1 m/s",
      "target": "Kecepatan akhir",
      "unit": "m/s",
      "formula": "v = (m₁u₁ + m₂u₂) / (m₁ + m₂)",
      "hint": "Ambil arah kanan sebagai positif. Jumlahkan momentum bertanda sebelum membaginya dengan massa total.",
      "steps": [
        "Karena kedua troli menempel, ini adalah tumbukan tidak lenting sama sekali.",
        "Kekekalan momentum: m₁u₁ + m₂u₂ = (m₁ + m₂)v.",
        "Substitusi: (2 × 3 + 1 × −1) / (2 + 1) = 5/3.",
        "Kecepatan bersama sekitar +1,67 m/s, sehingga troli bergerak ke kanan."
      ]
    },
    "elastic-rebound": {
      "title": "Kecepatan setelah tumbukan lenting",
      "scenario": "Troli 1,0 kg yang bergerak +4,0 m/s menumbuk secara lenting sempurna troli 3,0 kg yang diam. Berapa kecepatan troli 1,0 kg setelah tumbukan? Sertakan tandanya.",
      "given": "m₁ = 1,0 kg; u₁ = +4,0 m/s; m₂ = 3,0 kg; u₂ = 0; lenting",
      "target": "Kecepatan v₁ troli yang lebih ringan",
      "unit": "m/s",
      "formula": "v₁ = (m₁ − m₂) u₁ / (m₁ + m₂)",
      "hint": "Tumbukan lenting mempertahankan momentum dan energi kinetik. Selesaikan kedua persamaan bersama, atau gunakan syarat kecepatan relatif v₂ − v₁ = u₁ − u₂.",
      "steps": [
        "Momentum: m₁u₁ = m₁v₁ + m₂v₂. Karena lenting, kecepatan relatif berbalik: v₂ − v₁ = u₁.",
        "Penyelesaiannya v₁ = (m₁ − m₂) u₁ / (m₁ + m₂) dan v₂ = 2m₁u₁ / (m₁ + m₂).",
        "v₁ = (1,0 − 3,0) × 4,0 / 4,0 = −2,0 m/s; v₂ = +2,0 m/s.",
        "Periksa: momentum 4,0 = −2,0 + 6,0 kg·m/s, dan energi kinetik 8,0 J = 2,0 J + 6,0 J. Troli yang lebih ringan memantul balik."
      ]
    },
    "projectile-horizontal": {
      "title": "Gulirkan bola dari bangku",
      "scenario": "Sebuah bola menggelinding dari bangku setinggi 1,25 m dengan kecepatan horizontal 2,0 m/s. Abaikan hambatan udara dan gunakan g = 9,8 m/s². Seberapa jauh dari bangku bola mendarat?",
      "given": "Tinggi h = 1,25 m; kecepatan horizontal vₓ = 2,0 m/s; g = 9,8 m/s²",
      "target": "Jarak horizontal",
      "unit": "m",
      "formula": "t = √(2h/g); x = vₓ t",
      "hint": "Tinjau gerak vertikal dan horizontal secara terpisah. Waktu jatuh hanya bergantung pada tinggi; kecepatan horizontal tetap.",
      "steps": [
        "Secara vertikal bola mulai tanpa kecepatan dan jatuh sejauh h = ½ g t².",
        "t = √(2 × 1,25 / 9,8) ≈ 0,505 s.",
        "Secara horizontal tidak ada gaya, jadi x = vₓ t = 2,0 m/s × 0,505 s ≈ 1,01 m.",
        "Bola yang menggelinding lebih cepat mendarat lebih jauh, tetapi membutuhkan waktu yang sama untuk mencapai lantai."
      ]
    },
    "projectile-range": {
      "title": "Hitung jangkauan proyektil",
      "scenario": "Sebuah bola diluncurkan dengan kecepatan 20 m/s pada sudut 30° terhadap tanah datar. Abaikan hambatan udara dan gunakan g = 9,8 m/s². Seberapa jauh bola mendarat?",
      "given": "v₀ = 20 m/s; θ = 30°; g = 9,8 m/s²",
      "target": "Jangkauan horizontal",
      "unit": "m",
      "formula": "R = v₀² sin(2θ) / g",
      "hint": "Untuk ketinggian awal dan akhir yang sama, gunakan rumus jangkauan. Hitung sin(60°), bukan sin(30°).",
      "steps": [
        "Untuk proyektil yang mendarat pada ketinggian awal, R = v₀² sin(2θ) / g.",
        "Substitusi: R = 20² × sin(60°) / 9,8.",
        "Hitung: R ≈ 400 × 0,8660 / 9,8 ≈ 35,35 m.",
        "Jangkauan horizontal ideal sekitar 35,35 m. Hasil ini mengasumsikan tanpa hambatan udara dan ketinggian awal serta akhir sama."
      ]
    },
    "time-dilation": {
      "title": "Hitung interval waktu terdilatasi",
      "scenario": "Sebuah jam yang bergerak dengan kecepatan 0,80c mengukur 4,0 μs antara dua peristiwa pada lintasannya. Berapa interval waktu yang diukur pengamat yang melihat jam itu bergerak?",
      "given": "Waktu wajar Δτ = 4,0 μs; kecepatan v = 0,80c",
      "target": "Interval waktu pengamat",
      "unit": "μs",
      "formula": "Δt = γΔτ; γ = 1 / √(1 − v²/c²)",
      "hint": "Hitung γ untuk v/c = 0,80 terlebih dahulu. Interval pada jam yang bergerak adalah waktu wajarnya, sehingga kerangka lain mengukur interval lebih panjang.",
      "steps": [
        "Kerangka jam itu sendiri mengukur waktu wajar Δτ = 4,0 μs.",
        "Hitung faktor Lorentz: γ = 1/√(1 − 0,80²) = 1/0,6 = 5/3.",
        "Gunakan dilatasi waktu: Δt = γΔτ = (5/3)(4,0 μs) ≈ 6,67 μs.",
        "Pengamat mengukur sekitar 6,67 μs. Perbandingan ini merujuk pada pasangan peristiwa yang sama."
      ]
    },
    "simultaneity-offset": {
      "title": "Serentak menurut siapa?",
      "scenario": "Dua lampu yang terpisah 6,0 detik cahaya berkedip pada saat yang sama dalam kerangka Bumi. Sebuah pesawat antariksa terbang sepanjang garis yang menghubungkan keduanya dengan 0,80c. Berapa selisih waktu kedua kedipan dalam kerangka pesawat?",
      "given": "Δx = 6,0 detik cahaya; Δt = 0 (kerangka Bumi); v = 0,80c",
      "target": "Selisih waktu dalam kerangka pesawat, |Δt′|",
      "unit": "s",
      "formula": "Δt′ = γ (Δt − v Δx / c²)",
      "hint": "Gunakan transformasi Lorentz untuk waktu dengan Δt = 0. Dalam detik cahaya dan detik, v Δx / c² cukup 0,80 × 6,0 s.",
      "steps": [
        "γ = 1 / √(1 − 0,80²) = 1 / 0,60 ≈ 1,667.",
        "Dengan Δt = 0: Δt′ = −γ v Δx / c² = −1,667 × 0,80 × 6,0 s.",
        "|Δt′| ≈ 8,0 s. Kedipan di depan arah gerak pesawat terjadi lebih dulu dalam kerangka pesawat.",
        "Kedua kerangka benar: keserentakan bergantung pada kerangka, sedangkan interval antara kedua peristiwa sama di keduanya."
      ]
    },
    "interval-proper-time": {
      "title": "Waktu yang ditunjukkan jam yang bepergian",
      "scenario": "Dalam kerangka Bumi, dua peristiwa terpisah 5,0 s dalam waktu dan 3,0 detik cahaya dalam ruang. Sebuah jam bergerak dengan kelajuan tetap dari peristiwa pertama ke peristiwa kedua. Berapa waktu yang ditunjukkannya di antara keduanya?",
      "given": "Δt = 5,0 s; Δx = 3,0 detik cahaya (kerangka Bumi)",
      "target": "Waktu wajar Δτ pada jam yang bepergian",
      "unit": "s",
      "formula": "(c Δτ)² = (c Δt)² − Δx²",
      "hint": "Interval ruang-waktu sama di setiap kerangka. Dalam detik dan detik cahaya, Δτ² = Δt² − Δx².",
      "steps": [
        "Jam itu hadir di kedua peristiwa, jadi ia mengukur waktu wajar di antara keduanya.",
        "Δτ² = (5,0 s)² − (3,0 s)² = 25 − 9 = 16 s².",
        "Δτ = 4,0 s, lebih kecil daripada 5,0 s antara kedua peristiwa dalam kerangka Bumi.",
        "Tanda minus inilah yang membedakan ruang-waktu dari ruang biasa, tempat kedua kuadrat itu dijumlahkan."
      ]
    },
    "lorentz-time": {
      "title": "Kapan peristiwa itu terjadi menurut pesawat?",
      "scenario": "Sebuah pesawat antariksa melewati Bumi pada t = 0 dengan kelajuan 0,60c. Dalam kerangka Bumi, sebuah peristiwa terjadi sejauh 3,0 tahun cahaya (searah gerak pesawat) pada t = 5,0 tahun. Pada waktu berapa peristiwa itu terjadi dalam kerangka pesawat?",
      "given": "v = 0,60c; x = 3,0 tahun cahaya; t = 5,0 tahun (kerangka Bumi); kedua jam menunjukkan 0 saat pesawat melewati Bumi",
      "target": "Waktu t′ dalam kerangka pesawat",
      "unit": "tahun",
      "formula": "t′ = γ (t − v x / c²)",
      "hint": "Tentukan γ terlebih dahulu. Dalam tahun dan tahun cahaya, v x / c² adalah 0,60 × 3,0 tahun.",
      "steps": [
        "γ = 1 / √(1 − 0,60²) = 1 / 0,80 = 1,25.",
        "v x / c² = 0,60 × 3,0 tahun = 1,8 tahun.",
        "t′ = 1,25 × (5,0 − 1,8) tahun = 1,25 × 3,2 tahun = 4,0 tahun.",
        "Transformasi Galileo akan memberikan t′ = t = 5,0 tahun; eksperimen sesuai dengan transformasi Lorentz."
      ]
    },
    "length-contraction": {
      "title": "Ukur pesawat ruang angkasa yang bergerak",
      "scenario": "Panjang wajar sebuah pesawat ruang angkasa adalah 100 m. Pesawat melintas dengan kecepatan 0,60c. Berapa panjang yang diukur pengamat jika kedua ujung dicatat secara serentak dalam kerangkanya?",
      "given": "Panjang wajar L₀ = 100 m; kecepatan v = 0,60c",
      "target": "Panjang terukur",
      "unit": "m",
      "formula": "L = L₀ / γ; γ = 1 / √(1 − v²/c²)",
      "hint": "Hitung γ pada 0,60c, lalu bagi panjang wajarnya dengan nilai tersebut.",
      "steps": [
        "Panjang pada kerangka diam pesawat adalah panjang wajar L₀ = 100 m.",
        "Hitung γ = 1/√(1 − 0,60²) = 1/0,8 = 1,25.",
        "Kontraksi panjang memberikan L = L₀/γ = 100/1,25 = 80 m.",
        "Pengamat mengukur 80 m ketika posisi kedua ujung dicatat secara serentak dalam kerangka pengamat tersebut."
      ]
    },
    "gps-net": {
      "title": "Jumlahkan koreksi jam GPS",
      "scenario": "Dibandingkan dengan jam di permukaan Bumi, jam satelit GPS bertambah cepat sekitar 45,7 μs per hari karena gravitasi lebih lemah di ketinggiannya, dan berkurang sekitar 7,2 μs per hari karena kelajuan orbitnya. Berapa perubahan bersihnya per hari?",
      "given": "Pertambahan gravitasi = +45,7 μs/hari; efek kelajuan = −7,2 μs/hari",
      "target": "Pertambahan bersih per hari",
      "unit": "μs",
      "formula": "bersih = efek gravitasi + efek kelajuan",
      "hint": "Perhatikan tandanya: satu efek membuat jam satelit lebih cepat, efek lainnya lebih lambat.",
      "steps": [
        "Gravitasi yang lebih lemah di ketinggian satelit membuat jamnya lebih cepat: +45,7 μs per hari.",
        "Kelajuan orbitnya membuat jam lebih lambat: −7,2 μs per hari.",
        "Bersih: 45,7 − 7,2 ≈ +38,5 μs per hari.",
        "Cahaya menempuh sekitar 11 km dalam 38 μs, jadi tanpa koreksi ini posisi akan bergeser berkilometer setiap hari."
      ]
    },
    "height-clock-gain": {
      "title": "Jam di atas gunung",
      "scenario": "Sebuah jam berada 1000 m lebih tinggi daripada jam lain di dekat permukaan Bumi (g = 9,81 m/s², c = 3,00 × 10⁸ m/s). Dengan pendekatan medan lemah, berapa waktu yang diperoleh jam yang lebih tinggi dalam sehari (86 400 s)?",
      "given": "h = 1000 m; g = 9,81 m/s²; c = 3,00 × 10⁸ m/s; satu hari = 86 400 s",
      "target": "Waktu yang diperoleh per hari",
      "unit": "ns",
      "formula": "Δτ/τ ≈ g h / c²",
      "hint": "Tentukan dahulu selisih laju relatif g h / c², lalu kalikan dengan jumlah detik dalam sehari. 1 ns = 10⁻⁹ s.",
      "steps": [
        "Selisih laju relatif: g h / c² = 9,81 × 1000 / (3,00 × 10⁸)² ≈ 1,09 × 10⁻¹³.",
        "Pertambahan per hari: 1,09 × 10⁻¹³ × 86 400 s ≈ 9,42 × 10⁻⁹ s.",
        "Itu sekitar 9,4 ns per hari.",
        "Jam atom optik kini dapat mendeteksi efek ini untuk beda ketinggian beberapa sentimeter."
      ]
    },
    "sun-schwarzschild-radius": {
      "title": "Mampatkan Matahari menjadi lubang hitam",
      "scenario": "Massa Matahari 1,99 × 10³⁰ kg. Berapa jari-jari Schwarzschild-nya: jari-jari yang harus dicapai bila Matahari dimampatkan agar menjadi lubang hitam? Gunakan G = 6,67 × 10⁻¹¹ N·m²/kg² dan c = 3,00 × 10⁸ m/s.",
      "given": "M = 1,99 × 10³⁰ kg; G = 6,67 × 10⁻¹¹ N·m²/kg²; c = 3,00 × 10⁸ m/s",
      "target": "Jari-jari Schwarzschild",
      "unit": "km",
      "formula": "r_s = 2 G M / c²",
      "hint": "Gunakan satuan SI untuk memperoleh meter, lalu bagi 1000 untuk kilometer. Tangani pangkat sepuluh secara terpisah.",
      "steps": [
        "r_s = 2 × 6,67 × 10⁻¹¹ × 1,99 × 10³⁰ / (3,00 × 10⁸)².",
        "Pembilang ≈ 2,65 × 10²⁰; penyebut = 9,00 × 10¹⁶.",
        "r_s ≈ 2,95 × 10³ m ≈ 2,95 km.",
        "Jari-jari Matahari sebenarnya sekitar 700 000 km, jadi gravitasinya jauh terlalu lemah untuk efek medan kuat; orbit di sekitarnya hampir Newtonian."
      ]
    },
    "mercury-precession": {
      "title": "Presesi tambahan Merkurius",
      "scenario": "Untuk orbit yang hampir Newtonian, relativitas umum memprediksi bahwa periapsis maju sebesar Δφ = 3π r_s / (a (1 − e²)) radian per orbit. Untuk Merkurius mengelilingi Matahari, r_s = 2,95 km, a = 5,79 × 10⁷ km, dan e = 0,206, dan Merkurius menyelesaikan 415 orbit per abad. Berapa pergeserannya dalam detik busur per abad?",
      "given": "r_s = 2,95 km; a = 5,79 × 10⁷ km; e = 0,206; 415 orbit per abad; 1 rad = 206 265″",
      "target": "Pergeseran periapsis per abad",
      "unit": "″",
      "formula": "Δφ = 3π r_s / (a (1 − e²)) per orbit",
      "hint": "Hitung Δφ per orbit dalam radian (km saling meniadakan), ubah ke detik busur, lalu kalikan dengan jumlah orbit.",
      "steps": [
        "a (1 − e²) = 5,79 × 10⁷ km × (1 − 0,0424) ≈ 5,54 × 10⁷ km.",
        "Δφ = 3π × 2,95 / 5,54 × 10⁷ ≈ 5,01 × 10⁻⁷ rad per orbit ≈ 0,103″ per orbit.",
        "Per abad: 0,103″ × 415 ≈ 43″.",
        "Nilai ini cocok dengan 43″ per abad yang tidak dapat dijelaskan gravitasi Newton, bahkan dengan memperhitungkan tarikan planet lain."
      ]
    },
    "cosmological-redshift": {
      "title": "Hubungkan pergeseran merah dengan ekspansi",
      "scenario": "Cahaya diamati hari ini dengan pergeseran merah kosmologis z = 1,5. Dalam model alam semesta mengembang yang homogen, berapa faktor pertambahan faktor skala sejak cahaya dipancarkan?",
      "given": "Pergeseran merah z = 1,5",
      "target": "Faktor ekspansi a_sekarang / a_emisi",
      "unit": "×",
      "formula": "1 + z = a_sekarang / a_emisi",
      "hint": "Tambahkan 1 pada nilai pergeseran merah. Hasilnya adalah rasio faktor skala, bukan kecepatan.",
      "steps": [
        "Untuk pergeseran merah kosmologis dalam model FLRW, 1 + z = a_sekarang/a_emisi.",
        "Substitusi z = 1,5: a_sekarang/a_emisi = 1 + 1,5.",
        "Rasionya adalah 2,5.",
        "Faktor skala sekarang 2,5 kali lebih besar daripada saat cahaya dipancarkan. Ini tidak berarti galaksi secara lokal bergerak menembus ruang dengan kecepatan 2,5 kali kecepatan cahaya."
      ]
    },
    "hubble-time": {
      "title": "Waktu Hubble",
      "scenario": "Konstanta Hubble H₀ = 70 km/s per megaparsec. Berapa waktu Hubble 1/H₀ dalam miliar tahun? Gunakan 1 Mpc = 3,086 × 10¹⁹ km dan 1 miliar tahun = 3,156 × 10¹⁶ s.",
      "given": "H₀ = 70 km/s/Mpc; 1 Mpc = 3,086 × 10¹⁹ km; 1 miliar tahun = 3,156 × 10¹⁶ s",
      "target": "Waktu Hubble 1/H₀",
      "unit": "miliar tahun",
      "formula": "t_H = 1/H₀",
      "hint": "Ubah H₀ ke satuan 1/s dengan membaginya dengan jumlah kilometer dalam satu megaparsec; lalu balik nilainya dan ubah detik ke miliar tahun.",
      "steps": [
        "H₀ = 70 km/s / (3,086 × 10¹⁹ km) ≈ 2,27 × 10⁻¹⁸ s⁻¹.",
        "1/H₀ ≈ 4,41 × 10¹⁷ s.",
        "Dalam miliar tahun: 4,41 × 10¹⁷ s / 3,156 × 10¹⁶ s ≈ 14,0 miliar tahun.",
        "Waktu Hubble menetapkan skala waktu pengembangan. Usia sebenarnya bergantung pada bagaimana laju pengembangan berubah, yang bergantung pada isi alam semesta."
      ]
    },
    "matter-age": {
      "title": "Usia alam semesta yang hanya berisi materi",
      "scenario": "Dalam alam semesta datar yang hanya berisi materi, faktor skala tumbuh sebagai a ∝ t^(2/3). Jika H₀ = 70 km/s/Mpc (waktu Hubble 1/H₀ ≈ 13,97 miliar tahun), berapa usia model alam semesta itu sekarang?",
      "given": "a ∝ t^(2/3); 1/H₀ ≈ 13,97 miliar tahun",
      "target": "Usia model alam semesta",
      "unit": "miliar tahun",
      "formula": "H = ȧ/a = 2/(3t), sehingga t₀ = 2/(3H₀)",
      "hint": "Turunkan a ∝ t^(2/3) untuk memperoleh H = ȧ/a sebagai fungsi t, lalu selesaikan t ketika H = H₀.",
      "steps": [
        "Dengan a = k t^(2/3), ȧ = (2/3) k t^(−1/3).",
        "H = ȧ / a = 2 / (3t), sehingga usia sekarang t₀ = 2 / (3H₀).",
        "t₀ = (2/3) × 13,97 miliar tahun ≈ 9,31 miliar tahun.",
        "Sebagian bintang lebih tua dari 9,3 miliar tahun: satu tanda bahwa model yang hanya berisi materi bukanlah alam semesta kita. Energi gelap mempercepat pengembangan dan membuat usianya lebih panjang."
      ]
    },
  "work-energy-speed": {
    "title": "Ke mana energi kereta berpindah?",
    "scenario": "Kereta bermassa 10 kg bergerak dengan kecepatan 2 m/s. Motor menariknya ke depan dengan gaya 50 N, sedangkan gesekan kinetik 10 N melawannya sepanjang 4 m. Berapa kecepatan akhirnya?",
    "given": "m = 10 kg; vᵢ = 2 m/s; Fmotor = 50 N; fₖ = 10 N; d = 4 m",
    "target": "Kecepatan akhir", "unit": "m/s",
    "formula": "Wresultan = (Fmotor − fₖ)d; Kakhir = Kawal + Wresultan; v_akhir = √(2Kakhir/m)",
    "hint": "Hitung usaha bertanda dari setiap gaya. Gesekan melakukan usaha negatif; tambahkan usaha resultan pada energi kinetik awal.",
    "steps": ["Energi kinetik awal Kawal = ½mvᵢ² = 20 J.", "Motor melakukan usaha +200 J; gesekan melakukan −40 J. Usaha resultan +160 J.", "Teorema usaha–energi memberi Kakhir = Kawal + Wresultan = 180 J.", "v_akhir = √(2Kakhir/m) = 6 m/s. Sebagian energi dari motor terdisipasi oleh gesekan; sisanya menambah energi kinetik."]
  },
  "circular-orbit-energy": {
    "title": "Apakah energi total orbit positif atau negatif?",
    "scenario": "Satelit berada pada orbit lingkaran dengan jari-jari 6,77 × 10⁶ m dari pusat Bumi. Gunakan GM = 3,99 × 10¹⁴ m³/s². Berapa energi mekanik total per kilogram, dalam MJ/kg?",
    "given": "r = 6,77 × 10⁶ m; GM = 3,99 × 10¹⁴ m³/s²",
    "target": "Energi orbit total spesifik", "unit": "MJ/kg",
    "formula": "ε = K/m + U/m = v²/2 − GM/r = −GM/(2r)",
    "hint": "Untuk orbit lingkaran, v² = GM/r. Jumlahkan energi kinetik per kilogram dengan energi potensial gravitasi per kilogram yang bernilai nol di tak terhingga.",
    "steps": ["Dengan energi potensial gravitasi nol di tak terhingga, U/m = −GM/r ≈ −5,90 × 10⁷ J/kg.", "Untuk orbit lingkaran, K/m = v²/2 = GM/(2r) ≈ +2,95 × 10⁷ J/kg.", "Energi total ε = K/m + U/m = −GM/(2r) ≈ −2,95 × 10⁷ J/kg.", "Hasilnya −29,5 MJ/kg. Energi total negatif berarti satelit terikat secara gravitasi dalam model Newton ini; energi harus ditambahkan agar mencapai energi nol di tak terhingga."]
  },
},
  "ja": {
    "car-bend": {
      "title": "カーブを曲がる",
      "scenario": "車が半径50 mの円形のカーブを一定の速さ20 m/sで曲がっています。加速度はいくらですか。つまり、道路の摩擦は1 kgあたりどれだけの力を与える必要がありますか。",
      "given": "v = 20 m/s、r = 50 m",
      "target": "向心加速度",
      "unit": "m/s²",
      "formula": "a = v² / r",
      "hint": "速さは一定でも向きは変わります。速さを2乗し、半径で割りましょう。",
      "steps": [
        "一定の速さで円運動をすると、車はカーブの中心に向かって加速します。",
        "a = v² / r = (20 m/s)² / 50 m = 400 / 50 m/s²。",
        "a = 8.0 m/s²（カーブの中心向き）。",
        "道路の摩擦は1 kgあたり8.0 Nを与える必要があります。凍った道ではそれができず、車はまっすぐ進んでしまいます。"
      ]
    },
    "iss-speed": {
      "title": "ISSはどれだけ速いか",
      "scenario": "国際宇宙ステーションは、地球の中心から約6.77 × 10⁶ mの所をほぼ円軌道で回っています。地球では GM = 3.99 × 10¹⁴ m³/s² です。ステーションの速さはいくらですか。",
      "given": "r = 6.77 × 10⁶ m、GM = 3.99 × 10¹⁴ m³/s²",
      "target": "軌道の速さ",
      "unit": "km/s",
      "formula": "GMm/r² = mv²/r より v = √(GM/r)",
      "hint": "重力が円運動に必要な力をちょうど与えています。両者を等しいとおいてvを求め、m/sをkm/sに換算しましょう。",
      "steps": [
        "円軌道では重力が向心力です: GMm/r² = mv²/r。",
        "衛星の質量は約分されます: v = √(GM/r) = √(3.99 × 10¹⁴ / 6.77 × 10⁶) m/s。",
        "v ≈ √(5.89 × 10⁷) ≈ 7.68 × 10³ m/s ≈ 7.68 km/s。",
        "この速さで、ステーションは約92分で地球を1周します。"
      ]
    },
    "average-speed-pause": {
      "title": "止まっている時間を含む平均の速さ",
      "scenario": "物体がレールに沿って4.0 sで6.0 m進み、その後、時計が進み続ける間に6.0 s静止しました。10 s全体での平均の速さはいくらですか。",
      "given": "距離 = 6.0 m、動いていた時間 = 4.0 s、止まっていた時間 = 6.0 s",
      "target": "平均の速さ",
      "unit": "m/s",
      "formula": "平均の速さ = 距離 / 全時間",
      "hint": "物体が止まっても時間は止まりません。動いていた時間だけでなく、経過したすべての時間で割ります。",
      "steps": [
        "物体が静止している間も時間は進むので、全時間は 4.0 s + 6.0 s = 10 s です。",
        "平均の速さ = 距離 / 全時間 = 6.0 m / 10 s です。",
        "平均の速さは 0.60 m/s です。",
        "4.0 sで割ると1.5 m/sになりますが、これは動いている間の速さであり、全体の平均ではありません。"
      ]
    },
    "instantaneous-velocity": {
      "title": "位置の関数から速度を求める",
      "scenario": "レール上の物体の位置は x(t) = 2 + 3t − 0.5t² です（xはメートル、tは秒）。t = 2.0 sでの速度はいくらですか。",
      "given": "x(t) = 2 + 3t − 0.5t² (m)、t = 2.0 s",
      "target": "t = 2.0 sでの速度",
      "unit": "m/s",
      "formula": "v(t) = dx/dt",
      "hint": "x(t)を項ごとに微分し、t = 2.0 sを代入します。",
      "steps": [
        "速度は位置の変化率です: v(t) = dx/dt。",
        "微分すると v(t) = 3 − 1.0t (m/s) です。",
        "t = 2.0 sを代入すると v = 3 − 2 = 1.0 m/s です。",
        "これはt = 2.0 sにおける位置–時間グラフの傾きです。物体はまだ前進していますが、減速しています。"
      ]
    },
    "displacement-3d": {
      "title": "3次元の変位を計算する",
      "scenario": "ドローンが原点から点 (1 m, 2 m, 2 m) まで移動しました。直線変位の大きさはいくらですか。",
      "given": "Δx = 1 m、Δy = 2 m、Δz = 2 m",
      "target": "変位の大きさ",
      "unit": "m",
      "formula": "|Δr| = √(Δx² + Δy² + Δz²)",
      "hint": "各成分を2乗して合計し、その平方根を求めます。",
      "steps": [
        "変位ベクトルは (1, 2, 2) m です。",
        "3次元の三平方の定理を使います: |Δr| = √(1² + 2² + 2²) m。",
        "計算すると √(1 + 4 + 4) = √9 = 3 です。",
        "実際の経路に関係なく、直線変位の大きさは3 mです。"
      ]
    },
    "axis-rotation": {
      "title": "座標軸を回転させる",
      "scenario": "ある座標軸で変位は (3.0 m, 4.0 m, 0) です。物体は動かさずに、x軸とy軸をz軸の周りに30°回転させます。新しいx′成分はいくらですか。",
      "given": "Δx = 3.0 m、Δy = 4.0 m、Δz = 0、z軸周りの回転 θ = 30°",
      "target": "新しい成分 Δx′",
      "unit": "m",
      "formula": "Δx′ = Δx cos θ + Δy sin θ",
      "hint": "変わらない変位を、回転したx′軸に射影します。Δy′と両方の座標軸での大きさを計算して確かめましょう。",
      "steps": [
        "軸を回転させると成分は変わりますが、変位そのものは変わりません。",
        "Δx′ = Δx cos θ + Δy sin θ = 3.0 × 0.866 + 4.0 × 0.500 ≈ 4.60 m です。",
        "同様に Δy′ = −Δx sin θ + Δy cos θ = −1.50 + 3.46 ≈ 1.96 m です。",
        "確認: √(4.60² + 1.96²) ≈ 5.0 m = √(3.0² + 4.0²)。大きさはどちらの座標軸でも同じです。"
      ]
    },
    "pendulum-period": {
      "title": "振り子の周期を見積もる",
      "scenario": "単振り子の長さは1.00 mです。地球上で小さく振動するとき、g = 9.81 m/s²として周期を見積もってください。",
      "given": "L = 1.00 m、g = 9.81 m/s²",
      "target": "周期",
      "unit": "s",
      "formula": "T ≈ 2π√(L / g)",
      "hint": "長さと重力加速度を平方根の中に代入し、2πを掛けます。",
      "steps": [
        "小振幅では、単振り子の近似式は T ≈ 2π√(L/g) です。",
        "代入すると T ≈ 2π√(1.00/9.81) です。",
        "計算すると T ≈ 2.006 s です。",
        "1往復の周期は約2.01 sです。小振幅という仮定が重要です。"
      ]
    },
    "pendulum-moon": {
      "title": "振り子時計を月に持っていく",
      "scenario": "ある振り子の周期は地球上（g = 9.81 m/s²）で2.00 sです。同じ振り子を月（g = 1.62 m/s²）に持っていくと、周期はいくらになりますか。",
      "given": "T_地球 = 2.00 s、g_地球 = 9.81 m/s²、g_月 = 1.62 m/s²、長さは同じ",
      "target": "月での周期",
      "unit": "s",
      "formula": "T = 2π√(L/g) より T_月 = T_地球 √(g_地球 / g_月)",
      "hint": "長さは変わらないので、周期は1/√gに比例します。重力が弱いほど周期は長くなります。",
      "steps": [
        "小さな振れでは T = 2π√(L/g) で、Lはどちらでも同じです。",
        "2つの周期の比は T_月 / T_地球 = √(g_地球 / g_月) = √(9.81 / 1.62) ≈ 2.46 です。",
        "T_月 ≈ 2.00 s × 2.46 ≈ 4.92 s です。",
        "地球で調整した時計は月では約2.5倍遅れます。時計が測っているのは振り子の振動であり、時間そのものではありません。"
      ]
    },
    "pendulum-amplitude": {
      "title": "大きな振れは時計をどれだけ遅らせるか",
      "scenario": "振り子を小さな角度ではなく30°から放します。小角度の公式に対する第1次の補正を使うと、周期は T₀ = 2π√(L/g) より何パーセント長くなりますか。",
      "given": "放す振幅 θ₀ = 30° = π/6 rad",
      "target": "周期の増加",
      "unit": "%",
      "formula": "T ≈ T₀ (1 + θ₀²/16)（θ₀はラジアン）",
      "hint": "まず角度をラジアンに直し、θ₀²/16を計算してパーセントで表します。",
      "steps": [
        "小角度の公式は sin θ ≈ θ を仮定しています。振幅が大きいと周期は長くなります。",
        "θ₀ = 30° = π/6 ≈ 0.524 rad なので θ₀² ≈ 0.274 です。",
        "θ₀²/16 ≈ 0.0171 なので、周期はT₀より約1.71%長くなります。",
        "厳密な周期（実験と同じ楕円積分）では約1.74%です。1日では1.7%の誤差はおよそ25分になります。"
      ]
    },
    "net-force": {
      "title": "加速度を求める",
      "scenario": "摩擦のないレール上で、質量2.5 kgの台車に一定の合力10 Nが働いています。加速度はいくらですか。",
      "given": "質量 = 2.5 kg、合力 = 10 N",
      "target": "加速度",
      "unit": "m/s²",
      "formula": "a = F_net / m",
      "hint": "合力を質量で割ります。N/kgがm/s²と等しいことを確認しましょう。",
      "steps": [
        "ニュートンの第2法則 F_net = m a から始めます。",
        "加速度について解くと a = F_net / m です。",
        "代入すると a = 10 N / 2.5 kg = 4 m/s² です。",
        "台車は合力の向きに4 m/s²で加速します。"
      ]
    },
    "kinetic-friction-level": {
      "title": "摩擦に逆らって箱を押す",
      "scenario": "質量10 kgの箱が水平な床の上をすでに滑っています。これを水平に30 Nで押します。動摩擦係数は0.20です。g = 9.8 m/s²とします。箱の加速度はいくらですか。",
      "given": "m = 10 kg、F_押す = 30 N、μk = 0.20、g = 9.8 m/s²",
      "target": "加速度",
      "unit": "m/s²",
      "formula": "a = (F_押す − μk m g) / m",
      "hint": "自由物体図を描きましょう。水平な床では垂直抗力は重さに等しく、摩擦は滑る向きと逆向きに働きます。",
      "steps": [
        "垂直抗力: N = m g = 10 kg × 9.8 m/s² = 98 N。",
        "動摩擦力: f = μk N = 0.20 × 98 N = 19.6 N（運動と逆向き）。",
        "合力: 30 N − 19.6 N = 10.4 N。",
        "a = F_合力 / m = 10.4 N / 10 kg ≈ 1.04 m/s²（押す向き）。"
      ]
    },
    "incline-slide": {
      "title": "粗い斜面を滑り下りる",
      "scenario": "ブロックが30°の斜面を滑り下りています。動摩擦係数は0.20です。g = 9.8 m/s²とします。斜面に沿った加速度はいくらですか。",
      "given": "θ = 30°、μk = 0.20、g = 9.8 m/s²、ブロックはすでに滑っている",
      "target": "斜面下向きの加速度",
      "unit": "m/s²",
      "formula": "a = g (sin θ − μk cos θ)",
      "hint": "重力を斜面に平行な成分と垂直な成分に分解します。垂直抗力がつり合うのは垂直成分だけです。",
      "steps": [
        "斜面に沿って、重力は下向きに m g sin θ を与えます。",
        "斜面に垂直な方向では N = m g cos θ なので、動摩擦力は斜面上向きに μk m g cos θ です。",
        "斜面方向のニュートンの第2法則: m a = m g sin θ − μk m g cos θ。質量は約分されます。",
        "a = 9.8 × (0.500 − 0.20 × 0.866) ≈ 3.20 m/s²（斜面下向き）。"
      ]
    },
    "inelastic-collision": {
      "title": "衝突後の共通速度を求める",
      "scenario": "質量2 kgの台車が+3 m/sで進み、質量1 kgで−1 m/sの台車に衝突します。2台はくっつきます。衝突後の速度を求めてください。",
      "given": "m₁ = 2 kg、u₁ = +3 m/s、m₂ = 1 kg、u₂ = −1 m/s",
      "target": "衝突後の速度",
      "unit": "m/s",
      "formula": "v = (m₁u₁ + m₂u₂) / (m₁ + m₂)",
      "hint": "右向きを正とします。符号付きの運動量を合計してから、全質量で割ります。",
      "steps": [
        "台車がくっつくので、完全非弾性衝突です。",
        "運動量保存より m₁u₁ + m₂u₂ = (m₁ + m₂)v です。",
        "代入すると (2 × 3 + 1 × −1) / (2 + 1) = 5/3 です。",
        "共通速度は約+1.67 m/sで、右向きに進みます。"
      ]
    },
    "elastic-rebound": {
      "title": "弾性衝突後の速度",
      "scenario": "+4.0 m/sで進む質量1.0 kgの台車が、静止している質量3.0 kgの台車に弾性衝突します。衝突後の1.0 kgの台車の速度はいくらですか。符号も含めて答えてください。",
      "given": "m₁ = 1.0 kg、u₁ = +4.0 m/s、m₂ = 3.0 kg、u₂ = 0、弾性衝突",
      "target": "軽い台車の速度 v₁",
      "unit": "m/s",
      "formula": "v₁ = (m₁ − m₂) u₁ / (m₁ + m₂)",
      "hint": "弾性衝突では運動量と運動エネルギーの両方が保存されます。2つの式を連立するか、相対速度の条件 v₂ − v₁ = u₁ − u₂ を使います。",
      "steps": [
        "運動量: m₁u₁ = m₁v₁ + m₂v₂。弾性衝突なので相対速度が反転します: v₂ − v₁ = u₁。",
        "解くと v₁ = (m₁ − m₂) u₁ / (m₁ + m₂)、v₂ = 2m₁u₁ / (m₁ + m₂) です。",
        "v₁ = (1.0 − 3.0) × 4.0 / 4.0 = −2.0 m/s、v₂ = +2.0 m/s です。",
        "確認: 運動量 4.0 = −2.0 + 6.0 kg·m/s、運動エネルギー 8.0 J = 2.0 J + 6.0 J。軽い台車は跳ね返ります。"
      ]
    },
    "projectile-horizontal": {
      "title": "ベンチからボールを転がす",
      "scenario": "ボールが高さ1.25 mのベンチから水平に2.0 m/sで転がり落ちます。空気抵抗は無視し、g = 9.8 m/s²とします。ボールはベンチからどれだけ離れた所に着地しますか。",
      "given": "高さ h = 1.25 m、水平方向の速さ vₓ = 2.0 m/s、g = 9.8 m/s²",
      "target": "水平距離",
      "unit": "m",
      "formula": "t = √(2h/g)、x = vₓ t",
      "hint": "鉛直方向と水平方向の運動を別々に考えます。落下時間は高さだけで決まり、水平方向の速さは一定です。",
      "steps": [
        "鉛直方向では、ボールは速さ0から h = ½ g t² だけ落下します。",
        "t = √(2 × 1.25 / 9.8) ≈ 0.505 s です。",
        "水平方向には力が働かないので x = vₓ t = 2.0 m/s × 0.505 s ≈ 1.01 m です。",
        "速く転がせば遠くに着地しますが、床に届くまでの時間は同じです。"
      ]
    },
    "projectile-range": {
      "title": "飛距離を計算する",
      "scenario": "ボールを水平面から30°の角度で20 m/sで投げます。空気抵抗を無視し、g = 9.8 m/s²とします。着地点までの水平距離はいくらですか。",
      "given": "v₀ = 20 m/s、θ = 30°、g = 9.8 m/s²",
      "target": "水平到達距離",
      "unit": "m",
      "formula": "R = v₀² sin(2θ) / g",
      "hint": "発射点と着地点の高さが同じ場合の式を使います。sin(30°)ではなくsin(60°)を計算します。",
      "steps": [
        "発射点と同じ高さに着地する場合、R = v₀² sin(2θ) / g です。",
        "代入すると R = 20² × sin(60°) / 9.8 です。",
        "計算すると R ≈ 400 × 0.8660 / 9.8 ≈ 35.35 m です。",
        "理想化した水平到達距離は約35.35 mです。空気抵抗がなく、発射点と着地点の高さが同じと仮定しています。"
      ]
    },
    "time-dilation": {
      "title": "時間の遅れを計算する",
      "scenario": "0.80cで移動する時計が、その経路上の2つの事象の間を4.0 μsと測りました。時計が動いて見える観測者は、時間間隔をいくらと測りますか。",
      "given": "固有時間 Δτ = 4.0 μs、速度 v = 0.80c",
      "target": "観測者の時間間隔",
      "unit": "μs",
      "formula": "Δt = γΔτ; γ = 1 / √(1 − v²/c²)",
      "hint": "まずv/c = 0.80でγを計算します。移動する時計の時間は固有時間なので、別の慣性系ではより長い時間になります。",
      "steps": [
        "時計自身の系で測る時間は固有時間 Δτ = 4.0 μs です。",
        "ローレンツ因子は γ = 1/√(1 − 0.80²) = 1/0.6 = 5/3 です。",
        "時間の遅れより Δt = γΔτ = (5/3)(4.0 μs) ≈ 6.67 μs です。",
        "観測者が測る時間は約6.67 μsです。同じ2つの事象を比較しています。"
      ]
    },
    "simultaneity-offset": {
      "title": "誰にとって同時か",
      "scenario": "6.0光秒離れた2つのランプが、地球の座標系で同時に光ります。宇宙船が2つを結ぶ線に沿って0.80cで飛んでいます。宇宙船の座標系では、2つの閃光の時刻はどれだけずれていますか。",
      "given": "Δx = 6.0光秒、Δt = 0（地球の座標系）、v = 0.80c",
      "target": "宇宙船の座標系での時間差 |Δt′|",
      "unit": "s",
      "formula": "Δt′ = γ (Δt − v Δx / c²)",
      "hint": "Δt = 0として時間のローレンツ変換を使います。光秒と秒で表すと、v Δx / c² は単に 0.80 × 6.0 s です。",
      "steps": [
        "γ = 1 / √(1 − 0.80²) = 1 / 0.60 ≈ 1.667 です。",
        "Δt = 0 なので Δt′ = −γ v Δx / c² = −1.667 × 0.80 × 6.0 s です。",
        "|Δt′| ≈ 8.0 s。宇宙船の進行方向前方の閃光が、宇宙船の座標系では先に起こります。",
        "どちらの座標系も正しいのです。同時性は座標系によりますが、2つの事象の間隔はどちらでも同じです。"
      ]
    },
    "interval-proper-time": {
      "title": "移動する時計が示す時間",
      "scenario": "地球の座標系で、2つの事象は時間で5.0 s、空間で3.0光秒離れています。時計が一定の速さで最初の事象から2番目の事象へ移動します。その間に時計が示す時間はいくらですか。",
      "given": "Δt = 5.0 s、Δx = 3.0光秒（地球の座標系）",
      "target": "移動する時計の固有時 Δτ",
      "unit": "s",
      "formula": "(c Δτ)² = (c Δt)² − Δx²",
      "hint": "時空間隔はどの座標系でも同じです。秒と光秒で表すと Δτ² = Δt² − Δx² です。",
      "steps": [
        "時計は両方の事象に立ち会うので、その間の固有時を測ります。",
        "Δτ² = (5.0 s)² − (3.0 s)² = 25 − 9 = 16 s² です。",
        "Δτ = 4.0 s で、地球の座標系での5.0 sより短くなります。",
        "このマイナス符号こそが、2つの2乗を足す通常の空間と時空との違いです。"
      ]
    },
    "lorentz-time": {
      "title": "宇宙船にとってはいつ起きたか",
      "scenario": "宇宙船が0.60cでt = 0に地球を通過します。地球の座標系で、ある事象が3.0光年離れた所（宇宙船の進行方向）でt = 5.0年に起こります。宇宙船の座標系では何年に起こりますか。",
      "given": "v = 0.60c、x = 3.0光年、t = 5.0年（地球の座標系）、宇宙船が地球を通過するとき両方の時計は0",
      "target": "宇宙船の座標系での時刻 t′",
      "unit": "年",
      "formula": "t′ = γ (t − v x / c²)",
      "hint": "まずγを求めます。年と光年で表すと、v x / c² は 0.60 × 3.0年です。",
      "steps": [
        "γ = 1 / √(1 − 0.60²) = 1 / 0.80 = 1.25 です。",
        "v x / c² = 0.60 × 3.0年 = 1.8年です。",
        "t′ = 1.25 × (5.0 − 1.8)年 = 1.25 × 3.2年 = 4.0年です。",
        "ガリレイ変換なら t′ = t = 5.0年となりますが、実験はローレンツ変換と一致します。"
      ]
    },
    "length-contraction": {
      "title": "移動する宇宙船の長さを測る",
      "scenario": "宇宙船の固有長は100 mです。宇宙船は0.60cで観測者の前を通過します。観測者の系で両端の位置を同時に記録したとき、長さはいくらですか。",
      "given": "固有長 L₀ = 100 m、速度 v = 0.60c",
      "target": "測定される長さ",
      "unit": "m",
      "formula": "L = L₀ / γ; γ = 1 / √(1 − v²/c²)",
      "hint": "0.60cでγを計算し、固有長をその値で割ります。",
      "steps": [
        "宇宙船の静止系での長さは固有長 L₀ = 100 m です。",
        "γ = 1/√(1 − 0.60²) = 1/0.8 = 1.25 です。",
        "長さの収縮より L = L₀/γ = 100/1.25 = 80 m です。",
        "観測者の系で両端の位置を同時に記録すると、測定値は80 mになります。"
      ]
    },
    "gps-net": {
      "title": "GPS時計の補正を合計する",
      "scenario": "地上の時計と比べると、GPS衛星の時計は高度での重力が弱いため1日あたり約45.7 μs進み、軌道速度のため1日あたり約7.2 μs遅れます。1日あたりの正味の変化はいくらですか。",
      "given": "重力による進み = +45.7 μs/日、速度による効果 = −7.2 μs/日",
      "target": "1日あたりの正味の進み",
      "unit": "μs",
      "formula": "正味 = 重力の効果 + 速度の効果",
      "hint": "符号に注意しましょう。一方の効果は衛星の時計を速め、もう一方は遅らせます。",
      "steps": [
        "衛星の高度では重力が弱いので、時計は速く進みます: 1日あたり +45.7 μs。",
        "軌道速度によって時計は遅れます: 1日あたり −7.2 μs。",
        "正味: 45.7 − 7.2 ≈ +38.5 μs/日。",
        "光は38 μsで約11 km進むので、この補正がなければ位置は毎日数キロメートルずれていきます。"
      ]
    },
    "height-clock-gain": {
      "title": "山の上の時計",
      "scenario": "地表付近で、一方の時計がもう一方より1000 m高い所にあります（g = 9.81 m/s²、c = 3.00 × 10⁸ m/s）。弱い重力場の近似で、高い方の時計は1日（86 400 s）でどれだけ進みますか。",
      "given": "h = 1000 m、g = 9.81 m/s²、c = 3.00 × 10⁸ m/s、1日 = 86 400 s",
      "target": "1日あたりの進み",
      "unit": "ns",
      "formula": "Δτ/τ ≈ g h / c²",
      "hint": "まず割合の差 g h / c² を求め、1日の秒数を掛けます。1 ns = 10⁻⁹ s です。",
      "steps": [
        "進み方の割合の差: g h / c² = 9.81 × 1000 / (3.00 × 10⁸)² ≈ 1.09 × 10⁻¹³。",
        "1日あたりの進み: 1.09 × 10⁻¹³ × 86 400 s ≈ 9.42 × 10⁻⁹ s。",
        "つまり1日あたり約9.4 nsです。",
        "光格子時計などの光学原子時計は、数センチメートルの高さの差でもこの効果を検出できます。"
      ]
    },
    "sun-schwarzschild-radius": {
      "title": "太陽をブラックホールに圧縮する",
      "scenario": "太陽の質量は1.99 × 10³⁰ kgです。シュワルツシルト半径、すなわちブラックホールになるために太陽を押し込む必要がある半径はいくらですか。G = 6.67 × 10⁻¹¹ N·m²/kg²、c = 3.00 × 10⁸ m/sとします。",
      "given": "M = 1.99 × 10³⁰ kg、G = 6.67 × 10⁻¹¹ N·m²/kg²、c = 3.00 × 10⁸ m/s",
      "target": "シュワルツシルト半径",
      "unit": "km",
      "formula": "r_s = 2 G M / c²",
      "hint": "SI単位で計算してメートルを求め、1000で割ってキロメートルにします。10のべき乗は別に扱いましょう。",
      "steps": [
        "r_s = 2 × 6.67 × 10⁻¹¹ × 1.99 × 10³⁰ / (3.00 × 10⁸)²。",
        "分子 ≈ 2.65 × 10²⁰、分母 = 9.00 × 10¹⁶。",
        "r_s ≈ 2.95 × 10³ m ≈ 2.95 km。",
        "太陽の実際の半径は約70万kmなので、重力は強い場の効果には弱すぎます。太陽の周りの軌道はほぼニュートン的です。"
      ]
    },
    "mercury-precession": {
      "title": "水星の余分な近日点移動",
      "scenario": "ほぼニュートン的な軌道では、一般相対性理論により近点は1周あたり Δφ = 3π r_s / (a (1 − e²)) ラジアン進むと予測されます。太陽を回る水星では r_s = 2.95 km、a = 5.79 × 10⁷ km、e = 0.206 で、水星は1世紀に415周します。1世紀あたりの移動は何秒角ですか。",
      "given": "r_s = 2.95 km、a = 5.79 × 10⁷ km、e = 0.206、1世紀に415周、1 rad = 206 265″",
      "target": "1世紀あたりの近点移動",
      "unit": "″",
      "formula": "1周あたり Δφ = 3π r_s / (a (1 − e²))",
      "hint": "1周あたりのΔφをラジアンで求め（kmは約分されます）、秒角に直してから周回数を掛けます。",
      "steps": [
        "a (1 − e²) = 5.79 × 10⁷ km × (1 − 0.0424) ≈ 5.54 × 10⁷ km。",
        "Δφ = 3π × 2.95 / 5.54 × 10⁷ ≈ 5.01 × 10⁻⁷ rad/周 ≈ 0.103″/周。",
        "1世紀あたり: 0.103″ × 415 ≈ 43″。",
        "これは、他の惑星の引力を含めてもニュートン重力では説明できなかった1世紀あたり43″と一致します。"
      ]
    },
    "cosmological-redshift": {
      "title": "赤方偏移と膨張を結び付ける",
      "scenario": "今日観測された光の宇宙論的赤方偏移はz = 1.5です。一様な膨張宇宙モデルで、光が放出されてからスケール因子は何倍になりましたか。",
      "given": "赤方偏移 z = 1.5",
      "target": "膨張率 a_現在 / a_放出時",
      "unit": "×",
      "formula": "1 + z = a_現在 / a_放出時",
      "hint": "赤方偏移に1を足します。これはスケール因子の比であり、速度ではありません。",
      "steps": [
        "FLRWモデルの宇宙論的赤方偏移では 1 + z = a_現在/a_放出時 です。",
        "z = 1.5を代入すると a_現在/a_放出時 = 1 + 1.5 です。",
        "比は2.5です。",
        "スケール因子は光の放出時から現在までに2.5倍になりました。銀河が局所的に光速の2.5倍で空間を移動するという意味ではありません。"
      ]
    },
    "hubble-time": {
      "title": "ハッブル時間",
      "scenario": "ハッブル定数は H₀ = 70 km/s/Mpc です。ハッブル時間 1/H₀ は何Gyr（10億年）ですか。1 Mpc = 3.086 × 10¹⁹ km、1 Gyr = 3.156 × 10¹⁶ sとします。",
      "given": "H₀ = 70 km/s/Mpc、1 Mpc = 3.086 × 10¹⁹ km、1 Gyr（10億年）= 3.156 × 10¹⁶ s",
      "target": "ハッブル時間 1/H₀",
      "unit": "Gyr",
      "formula": "t_H = 1/H₀",
      "hint": "1メガパーセクのキロメートル数で割ってH₀を1/sの単位に直し、逆数をとって秒をGyrに換算します。",
      "steps": [
        "H₀ = 70 km/s / (3.086 × 10¹⁹ km) ≈ 2.27 × 10⁻¹⁸ s⁻¹。",
        "1/H₀ ≈ 4.41 × 10¹⁷ s。",
        "Gyrでは 4.41 × 10¹⁷ s / 3.156 × 10¹⁶ s ≈ 14.0 Gyr。",
        "ハッブル時間は膨張の時間スケールを与えます。実際の年齢は膨張率の変化によって決まり、それは宇宙の中身によります。"
      ]
    },
    "matter-age": {
      "title": "物質だけの宇宙の年齢",
      "scenario": "物質だけを含む平坦な宇宙では、スケール因子は a ∝ t^(2/3) で増加します。H₀ = 70 km/s/Mpc（ハッブル時間 1/H₀ ≈ 13.97 Gyr）のとき、このモデル宇宙の現在の年齢はいくらですか。",
      "given": "a ∝ t^(2/3)、1/H₀ ≈ 13.97 Gyr（10億年）",
      "target": "モデル宇宙の年齢",
      "unit": "Gyr",
      "formula": "H = ȧ/a = 2/(3t) より t₀ = 2/(3H₀)",
      "hint": "a ∝ t^(2/3) を微分して H = ȧ/a をtの関数として求め、H = H₀ となるtを解きます。",
      "steps": [
        "a = k t^(2/3) とすると ȧ = (2/3) k t^(−1/3)。",
        "H = ȧ / a = 2 / (3t) なので、現在の年齢は t₀ = 2 / (3H₀)。",
        "t₀ = (2/3) × 13.97 Gyr ≈ 9.31 Gyr。",
        "9.3 Gyrより古い恒星があることは、物質だけのモデルが私たちの宇宙ではない兆候の一つです。暗黒エネルギーは膨張を加速させ、年齢を長くします。"
      ]
    },
  "work-energy-speed": {
    "title": "台車のエネルギーはどこへ移った？",
    "scenario": "質量10 kgの台車が2 m/sで動いています。モーターは進行方向に50 N、動摩擦力は反対向きに10 Nを及ぼし、その状態で4 m進みます。最後の速さはいくらですか？",
    "given": "m = 10 kg; vᵢ = 2 m/s; Fmotor = 50 N; fₖ = 10 N; d = 4 m",
    "target": "最後の速さ", "unit": "m/s",
    "formula": "合力の仕事 W = (Fmotor − fₖ)d; Kf = Ki + W; v_f = √(2Kf/m)",
    "hint": "各力の仕事を符号付きで計算します。摩擦の仕事は負です。合計の仕事を最初の運動エネルギーに加えます。",
    "steps": ["最初の運動エネルギーは Ki = ½mvᵢ² = 20 Jです。", "モーターの仕事は +200 J、摩擦の仕事は −40 Jです。合計の仕事は +160 Jです。", "仕事とエネルギーの定理より Kf = Ki + W = 180 Jです。", "v_f = √(2Kf/m) = 6 m/sです。モーターから移ったエネルギーの一部は摩擦で散逸し、残りが運動エネルギーを増やします。"]
  },
  "circular-orbit-energy": {
    "title": "軌道の全エネルギーは正か負か？",
    "scenario": "地球の中心から半径6.77 × 10⁶ mの円軌道を回る衛星を考えます。GM = 3.99 × 10¹⁴ m³/s²として、質量1 kgあたりの全力学的エネルギーをMJ/kgで求めてください。",
    "given": "r = 6.77 × 10⁶ m; GM = 3.99 × 10¹⁴ m³/s²",
    "target": "単位質量あたりの全軌道エネルギー", "unit": "MJ/kg",
    "formula": "ε = K/m + U/m = v²/2 − GM/r = −GM/(2r)",
    "hint": "円軌道ではv² = GM/rです。無限遠をゼロとする重力ポテンシャルエネルギーと、単位質量あたりの運動エネルギーを足します。",
    "steps": ["無限遠で重力ポテンシャルをゼロとすると、U/m = −GM/r ≈ −5.90 × 10⁷ J/kgです。", "円軌道ではv² = GM/rなので、K/m = v²/2 = GM/(2r) ≈ +2.95 × 10⁷ J/kgです。", "全エネルギーは ε = K/m + U/m = −GM/(2r) ≈ −2.95 × 10⁷ J/kgです。", "したがって −29.5 MJ/kgです。全エネルギーが負なので、このニュートン力学モデルでは衛星は重力に束縛されています。無限遠でエネルギーをゼロにするにはエネルギーを加える必要があります。"]
  },
}
}

const LEVEL_ORDER: Record<Level, number> = { beginner: 0, intermediate: 1, advanced: 2 }

/** The problems for one experiment in one language, easiest first. */
export function problemsFor(experiment: string, locale: Locale): PhysicsProblem[] {
  return PROBLEM_SOURCES
    .filter((problem) => problem.experiment === experiment)
    .sort((a, b) => LEVEL_ORDER[a.minLevel] - LEVEL_ORDER[b.minLevel])
    .map((problem) => {
      const text = PROBLEM_COPY[locale][problem.id] ?? PROBLEM_COPY.en[problem.id]
      if (!text) throw new Error(`Missing problem copy for ${problem.id}`)
      return { ...problem, ...text }
    })
}

/**
 * Reads a learner's typed number, or null when it is not one. Accepts a
 * decimal comma, spaces (including thin spaces between digit groups) and any
 * common minus or dash character. The marker and the feedback both use it, so
 * they always agree about what was typed.
 */
export function parseNumericAnswer(raw: string): number | null {
  const text = raw.trim().replace(/[\s\u2009\u202f]/g, '').replace(',', '.').replace(/[\u2212\u2013\u2014\u2010]/g, '-')
  // Accept ordinary decimal and scientific notation, not JavaScript-only
  // numeric syntaxes such as hexadecimal, binary or Infinity.
  if (!/^[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?$/.test(text)) return null
  const value = Number(text)
  return Number.isFinite(value) ? value : null
}

/** Absorbs floating-point rounding, so an answer exactly on a boundary (10.2 for 10) counts as on it. */
export const BOUNDARY_EPSILON = 1e-9

/** True when `value` is within RELATIVE_TOLERANCE of `expected`. */
export function isWithinTolerance(expected: number, value: number): boolean {
  if (!Number.isFinite(expected) || !Number.isFinite(value)) return false
  // A zero-valued target has no relative scale; use the documented absolute
  // floating-point boundary instead of accepting every value as "within 0%".
  if (expected === 0) return Math.abs(value) <= BOUNDARY_EPSILON
  return Math.abs(value - expected) <= (RELATIVE_TOLERANCE + BOUNDARY_EPSILON) * Math.abs(expected)
}

/** True when `raw` is a number within RELATIVE_TOLERANCE of the answer. */
export function isNumericallyCorrect(problem: Pick<ProblemSource, 'answer'>, raw: string): boolean {
  const value = parseNumericAnswer(raw)
  return value !== null && isWithinTolerance(problem.answer, value)
}
