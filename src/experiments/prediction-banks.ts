/**
 * Every experiment's prediction bank, keyed by its catalogue path.
 *
 * Tests that reason across experiments (honest coverage, levels, the outcome
 * map) read the banks from here, so there is one list to keep in step with
 * `src/modules.ts`. Pages import their own bank directly.
 */
import type { Prediction } from '@/experiments/prediction'
import { PREDICTIONS as spaceVsTime } from '@/experiments/space-vs-time/predictions'
import { PREDICTIONS as displacement3d } from '@/experiments/displacement3d/predictions'
import { PREDICTIONS as pendulum } from '@/experiments/pendulum/predictions'
import { PREDICTIONS as newtonian } from '@/experiments/newtonian/predictions'
import { PREDICTIONS as forceLab } from '@/experiments/force-lab/predictions'
import { PREDICTIONS as momentumCollisions } from '@/experiments/momentum-collisions/predictions'
import { PREDICTIONS as projectile } from '@/experiments/projectile/predictions'
import { PREDICTIONS as circularOrbits } from '@/experiments/circular-orbits/predictions'
import { PREDICTIONS as movingClocks } from '@/experiments/moving-clocks/predictions'
import { PREDICTIONS as twoPerspectives } from '@/experiments/two-perspectives/predictions'
import { PREDICTIONS as lengthContraction } from '@/experiments/length-contraction/predictions'
import { PREDICTIONS as gravityClocks } from '@/experiments/gravity-clocks/predictions'
import { PREDICTIONS as geodesicMotion } from '@/experiments/geodesic-motion/predictions'
import { PREDICTIONS as evolvingSpace } from '@/experiments/evolving-space/predictions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PredictionBank = readonly Prediction<any>[]

export const PREDICTION_BANKS: Readonly<Record<string, PredictionBank>> = {
  '/space/space-vs-time': spaceVsTime,
  '/space/displacement-3d': displacement3d,
  '/time/pendulum': pendulum,
  '/mechanics/newtonian': newtonian,
  '/mechanics/force-lab': forceLab,
  '/mechanics/momentum-collisions': momentumCollisions,
  '/mechanics/projectile': projectile,
  '/mechanics/circular-orbits': circularOrbits,
  '/relativity/moving-clocks': movingClocks,
  '/relativity/two-perspectives': twoPerspectives,
  '/relativity/length-contraction': lengthContraction,
  '/gravity/clock-rates': gravityClocks,
  '/gravity/geodesic-motion': geodesicMotion,
  '/cosmology/evolving-space': evolvingSpace,
}
