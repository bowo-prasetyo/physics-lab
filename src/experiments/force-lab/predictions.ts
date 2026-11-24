import type { Prediction } from '@/experiments/prediction'
import type { ForceLabFrictionRegime, ForceLabScenario } from '@/physics/forceLab'

/** One recorded Force Lab trial: its settings and what the model found. */
export interface ForceTrial {
  readonly scenario: ForceLabScenario
  readonly mass: number
  readonly appliedForce: number
  readonly staticFrictionCoefficient: number
  readonly kineticFrictionCoefficient: number
  /** Incline angle in degrees (0 on the horizontal surface). */
  readonly inclineAngle: number
  readonly frictionRegime: ForceLabFrictionRegime
  readonly frictionForce: number
  readonly normalForce: number
  readonly netForce: number
  readonly acceleration: number
}

const close = (a: number, b: number, tolerance = 1e-9) => Math.abs(a - b) <= tolerance
const sameSurface = (a: ForceTrial, b: ForceTrial) =>
  a.scenario === b.scenario &&
  close(a.inclineAngle, b.inclineAngle) &&
  close(a.staticFrictionCoefficient, b.staticFrictionCoefficient) &&
  close(a.kineticFrictionCoefficient, b.kineticFrictionCoefficient)

/** A push on the level surface that static friction holds: the block stays at rest. */
export function observedHeldAtRest(trials: readonly ForceTrial[]): boolean {
  return trials.some((t) => t.scenario === 'horizontal' && t.appliedForce > 0 && t.frictionRegime === 'static')
}

/** The same block and surface held at one push and sliding at a larger push, with μk < μs. */
export function observedBreakaway(trials: readonly ForceTrial[]): boolean {
  return trials.some((held) =>
    held.frictionRegime === 'static' &&
    held.appliedForce > 0 &&
    held.kineticFrictionCoefficient < held.staticFrictionCoefficient &&
    trials.some((sliding) => sliding.frictionRegime === 'kinetic' && sameSurface(held, sliding) && close(held.mass, sliding.mass)),
  )
}

/** A trial on an incline steep enough for the normal force to differ clearly from the weight. */
export function observedInclineNormal(trials: readonly ForceTrial[]): boolean {
  return trials.some((t) => t.scenario === 'incline' && t.inclineAngle >= 15)
}

/** Two unpushed blocks of different mass on the same incline. */
export function observedMassIndependence(trials: readonly ForceTrial[]): boolean {
  return trials.some((a) => trials.some((b) =>
    a !== b && a.scenario === 'incline' && sameSurface(a, b) &&
    close(a.appliedForce, 0) && close(b.appliedForce, 0) && !close(a.mass, b.mass),
  ))
}

export const PREDICTIONS: readonly Prediction<ForceTrial>[] = [
  {
    id: 'held',
    minLevel: 'beginner',
    question: 'A 5 kg block rests on a level floor. You push it sideways with 10 N, but it does not move. How big is the friction force on it?',
    task: 'On the horizontal surface, choose a push small enough that the block stays at rest, run the trial, and read the friction force.',
    options: [
      { id: 'zero', label: 'Zero: nothing is moving, so there is no friction' },
      { id: 'equal', label: '10 N, exactly balancing the push' },
      { id: 'maximum', label: 'Its maximum value, μsN' },
      { id: 'larger', label: 'More than 10 N, or the block would move' },
    ],
    correct: 'equal',
    explanation:
      'The block stays at rest, so the net force on it is zero and friction must exactly cancel the push: 10 N. Static friction is not a fixed amount. It takes whatever value is needed to prevent sliding, up to a maximum of μsN. Push harder and it grows with you, until that limit is reached.',
    observed: observedHeldAtRest,
    hint: (trials) =>
      observedHeldAtRest(trials)
        ? null
        : trials.length > 0
          ? 'The block slid in every horizontal trial. Lower the push below the maximum static friction, μs·m·g.'
          : null,
  },
  {
    id: 'breakaway',
    minLevel: 'beginner',
    question: 'You keep increasing the push until the block starts to slide. Once it is sliding, the friction force is…',
    task: 'Keep the block and surface the same. Run one trial where the block stays at rest and one with a push large enough to make it slide, then compare the friction forces.',
    options: [
      { id: 'larger', label: 'Larger than the largest static friction' },
      { id: 'smaller', label: 'Smaller: kinetic friction μkN is less than the static maximum μsN' },
      { id: 'same', label: 'Exactly the same as the static maximum' },
      { id: 'zero', label: 'Zero, because the block has broken free' },
    ],
    correct: 'smaller',
    explanation:
      'Once the block slides, friction becomes kinetic friction, μkN, which for most surfaces is smaller than the static maximum μsN. That is why it takes a harder shove to get a heavy box moving than to keep it moving. Kinetic friction does not grow with the push: any extra push now goes into acceleration.',
    observed: observedBreakaway,
    hint: (trials) => {
      if (observedBreakaway(trials)) return null
      if (trials.some((t) => t.frictionRegime === 'static' && t.appliedForce > 0)) return 'Now increase only the push until the block slides, and run again.'
      if (trials.some((t) => t.frictionRegime === 'kinetic')) return 'Now lower only the push until static friction holds the block, and run again.'
      return null
    },
  },
  {
    id: 'incline-normal',
    minLevel: 'intermediate',
    question: 'A block rests on a 30° incline. Compared with its weight mg, the normal force from the surface is…',
    task: 'Choose the inclined plane at 15° or steeper, run a trial, and compare the normal force with the weight.',
    options: [
      { id: 'equal', label: 'Equal to mg: the surface always supports the full weight' },
      { id: 'cos', label: 'Smaller: mg cos θ' },
      { id: 'sin', label: 'Smaller: mg sin θ' },
      { id: 'larger', label: 'Larger than mg' },
    ],
    correct: 'cos',
    explanation:
      'The surface pushes perpendicular to itself, so the normal force only has to cancel the part of the weight that points into the surface: N = mg cos θ (87 % of the weight at 30°). The other part, mg sin θ, points down the slope. Because maximum friction is μsN, a steeper slope also lowers the friction limit.',
    observed: observedInclineNormal,
    hint: (trials) => (trials.some((t) => t.scenario === 'incline') && !observedInclineNormal(trials) ? 'Make the incline steeper (15° or more) and run again.' : null),
  },
  {
    id: 'mass-independence',
    minLevel: 'advanced',
    question: 'With no push, a light block and a heavy block made of the same material rest on the same incline. As the slope is raised, which one starts to slide first?',
    task: 'On the incline with the push at 0 N, run the same angle and friction coefficients with two different masses. Try angles on both sides of the point where sliding starts.',
    options: [
      { id: 'heavy', label: 'The heavy block: its weight pulls harder down the slope' },
      { id: 'light', label: 'The light block: less friction holds it' },
      { id: 'same', label: 'Both at the same angle, where tan θ = μs' },
      { id: 'never', label: 'Neither: friction always holds a block at rest' },
    ],
    correct: 'same',
    explanation:
      'The pull down the slope, mg sin θ, and the friction limit, μs mg cos θ, are both proportional to the mass, so the mass cancels: sliding begins when tan θ > μs, for any mass (about 21.8° for μs = 0.40). Once sliding, a = g(sin θ − μk cos θ) is also independent of mass. Measuring the angle at which a block starts to slide is a standard way to measure μs.',
    observed: observedMassIndependence,
    hint: (trials) => {
      if (observedMassIndependence(trials)) return null
      if (trials.some((t) => t.scenario === 'incline' && t.appliedForce > 0)) return 'Set the push to 0 N, so only gravity, the normal force and friction act.'
      if (trials.some((t) => t.scenario === 'incline')) return 'Keep the angle and the friction coefficients, and run again with a different mass.'
      return null
    },
  },
]
