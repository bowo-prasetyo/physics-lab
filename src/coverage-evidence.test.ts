import { describe, expect, it } from 'vitest'
import { IMPLEMENTED_EXPERIMENTS, MODULES } from '@/modules'
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

/**
 * Honest coverage: a module lists a topic as covered only when an experiment
 * lets learners predict and then see the evidence for it. Practice questions
 * alone never count (CLAUDE.md, "Honest coverage").
 *
 * Every `coverage` entry in src/modules.ts must name, here, the experiment
 * predictions where learners test it. A new claim without one fails; so does
 * removing a prediction that backs a claim. This rule was first written for
 * the work-and-energy topics (#92) and widened to every module after the
 * Module 4–6 additions (#96) claimed topics backed only by practice.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Bank = readonly Prediction<any>[]

const BANKS: Readonly<Record<string, Bank>> = {
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

type Evidence = readonly (readonly [path: string, prediction: string])[]

const EVIDENCE: Readonly<Record<string, Evidence>> = {
  // Module 1
  'Position and reference points': [['/space/space-vs-time', 'rest'], ['/space/displacement-3d', 'shift']],
  'Distance and displacement': [['/space/displacement-3d', 'round-trip'], ['/space/displacement-3d', 'triangle']],
  '3D vectors and coordinate systems': [['/space/displacement-3d', 'rotation']],
  'Euclidean spatial measurements': [['/space/displacement-3d', 'diagonal']],
  // Module 2
  'Clocks as physical processes': [['/time/pendulum', 'time-itself']],
  'Periodic motion, period and frequency': [['/time/pendulum', 'length']],
  'Pendulum dynamics and clock calibration': [['/time/pendulum', 'mass'], ['/time/pendulum', 'moon']],
  'Small-angle approximation and exact pendulum period': [['/time/pendulum', 'amplitude']],
  // Module 3
  'Newton’s second law: net force, mass and acceleration': [['/mechanics/newtonian', 'mass'], ['/mechanics/newtonian', 'force']],
  'Free-body diagrams and multiple forces': [['/mechanics/force-lab', 'held'], ['/mechanics/force-lab', 'incline-normal']],
  'Static and kinetic friction, and force components on an inclined plane': [['/mechanics/force-lab', 'breakaway'], ['/mechanics/force-lab', 'incline-normal'], ['/mechanics/force-lab', 'mass-independence']],
  'Linear momentum and impulse': [['/mechanics/momentum-collisions', 'stick'], ['/mechanics/momentum-collisions', 'heavy-light']],
  'One-dimensional elastic and inelastic collisions': [['/mechanics/momentum-collisions', 'swap'], ['/mechanics/momentum-collisions', 'stick']],
  'Momentum conservation and kinetic-energy change': [['/mechanics/momentum-collisions', 'conserved']],
  'Ideal projectile motion': [['/mechanics/projectile', 'drop'], ['/mechanics/projectile', 'best-angle']],
  'Effects of launch conditions and gravitational acceleration': [['/mechanics/projectile', 'best-angle'], ['/mechanics/projectile', 'moon']],
  'Galilean reference frames': [['/mechanics/projectile', 'train']],
  'Quadratic air resistance and energy loss': [['/mechanics/projectile', 'drag-angle']],
  'Work by constant forces and signed work by friction': [['/mechanics/force-lab', 'friction-work']],
  'Work–energy theorem and changes in kinetic energy': [['/mechanics/force-lab', 'friction-work']],
  'Kinetic and gravitational potential energy': [['/mechanics/circular-orbits', 'energy']],
  'Mechanical-energy conservation for conservative forces': [['/mechanics/circular-orbits', 'energy']],
  'Energy of bound circular orbits': [['/mechanics/circular-orbits', 'energy']],
  'Uniform circular motion and centripetal force': [['/mechanics/circular-orbits', 'direction']],
  'Newtonian gravitation and circular, elliptical and escape orbits': [['/mechanics/circular-orbits', 'faster'], ['/mechanics/circular-orbits', 'escape']],
  'Kepler’s third law': [['/mechanics/circular-orbits', 'kepler']],
  // Module 4
  'Galilean and Lorentz transformations': [['/relativity/two-perspectives', 'everyday'], ['/relativity/two-perspectives', 'headlight']],
  'Time dilation and proper time': [['/relativity/moving-clocks', 'dilation'], ['/relativity/moving-clocks', 'own-clock']],
  'Length contraction and proper length': [['/relativity/length-contraction', 'moving'], ['/relativity/length-contraction', 'rest']],
  'Relativity of simultaneity': [['/relativity/two-perspectives', 'simultaneity'], ['/relativity/length-contraction', 'simultaneity']],
  'Spacetime diagrams and invariant interval': [['/relativity/moving-clocks', 'reciprocal'], ['/relativity/moving-clocks', 'invariant']],
  'Comparison of equivalent relativistic descriptions': [['/relativity/two-perspectives', 'equivalence']],
  'Relativistic velocity addition': [['/relativity/two-perspectives', 'probe'], ['/relativity/two-perspectives', 'headlight']],
  'Relativistic momentum, p = γmv': [['/relativity/two-perspectives', 'momentum']],
  // Module 5
  'Gravitational time dilation in the Schwarzschild exterior': [['/gravity/clock-rates', 'mountain']],
  'GPS gravitational and kinematic clock corrections': [['/gravity/clock-rates', 'gps'], ['/gravity/clock-rates', 'uncorrected']],
  'Static spherical geometry and proper radial distance': [['/gravity/clock-rates', 'ruler']],
  'Light signals and clock rates near a Schwarzschild horizon': [['/gravity/clock-rates', 'horizon'], ['/gravity/clock-rates', 'agree']],
  'Timelike geodesics and free-fall orbits in Schwarzschild spacetime': [['/gravity/geodesic-motion', 'perturbed'], ['/gravity/geodesic-motion', 'circular']],
  'Periapsis precession and the Newtonian limit': [['/gravity/geodesic-motion', 'distance'], ['/gravity/geodesic-motion', 'mercury']],
  'The equivalence principle: free fall cancels gravity locally': [['/gravity/geodesic-motion', 'accelerometer']],
  // Module 6
  'Scale factor in homogeneous and isotropic FLRW models': [['/cosmology/evolving-space', 'centre'], ['/cosmology/evolving-space', 'bound']],
  'Redshift and Hubble expansion': [['/cosmology/evolving-space', 'faster']],
  'Matter-, radiation- and dark-energy-dominated model histories': [['/cosmology/evolving-space', 'age']],
  'Limits of classical evolution as the scale factor approaches zero': [['/cosmology/evolving-space', 'breakdown']],
  'Accelerating and decelerating expansion': [['/cosmology/evolving-space', 'acceleration']],
  'The Hubble diagram: estimating H₀ from scattered data': [['/cosmology/evolving-space', 'hubble-diagram'], ['/cosmology/evolving-space', 'estimate']],
}

describe('coverage claims are backed by experiments', () => {
  const claims = MODULES.flatMap((m) => m.coverage.map((topic) => ({ module: m.number, topic })))

  it('every covered topic names the predictions where learners test it', () => {
    const unbacked = claims.filter(({ topic }) => !(topic in EVIDENCE))
    expect(unbacked, 'Covered without an experiment prediction: give it one, or list it under plannedTopics').toEqual([])
  })

  it('every named prediction exists, in an experiment of the same module', () => {
    for (const { module, topic } of claims) {
      for (const [path, id] of EVIDENCE[topic] ?? []) {
        const experiment = IMPLEMENTED_EXPERIMENTS.find((e) => e.path === path)
        expect(experiment?.module, `${topic} → ${path}`).toBe(module)
        expect(BANKS[path]?.some((p) => p.id === id), `${topic} → ${path} ${id}`).toBe(true)
      }
    }
  })

  it('has no stale entries', () => {
    const topics = new Set(claims.map((c) => c.topic))
    expect(Object.keys(EVIDENCE).filter((t) => !topics.has(t))).toEqual([])
  })

  it('every implemented experiment has a prediction bank here', () => {
    expect(IMPLEMENTED_EXPERIMENTS.map((e) => e.path).filter((p) => !(p in BANKS))).toEqual([])
  })
})
