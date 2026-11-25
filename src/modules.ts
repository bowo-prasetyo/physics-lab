/**
 * Catalogue of learning modules and their experiments, shown on the home page.
 *
 * Physica follows one thread: space, time and motion. Modules 1–3 build the
 * everyday picture (where things are, how time is measured, how motion
 * changes); Modules 4–6 follow the same questions into relativity, curved
 * spacetime and the expanding universe. Each module's `role` says where it
 * sits on that path.
 *
 * This file is the single source for the catalogue: the home page, the
 * translated catalogues (keyed by path) and the README's experiment list are
 * all checked against it.
 */

export interface ExperimentEntry {
  readonly title: string
  readonly summary: string
  /** Route path when available; omitted for planned experiments. */
  readonly path?: string
}

export interface ModuleEntry {
  readonly number: number
  readonly title: string
  /** One sentence: the module's place in the space, time and motion thread. */
  readonly role: string
  /** Topics substantially explored by experiments that are currently implemented. */
  readonly coverage: readonly string[]
  /** Important curriculum topics that still need dedicated learning experiences. */
  readonly plannedTopics: readonly string[]
  readonly experiments: readonly ExperimentEntry[]
}

export const MODULES: readonly ModuleEntry[] = [
  {
    number: 1,
    title: 'Understanding space',
    role: 'Where things are: positions, distances and displacements, and which of them depend on the coordinates you choose.',
    coverage: ['Position and reference points', 'Distance and displacement', '3D vectors and coordinate systems', 'Euclidean spatial measurements'],
    plannedTopics: ['2D coordinate geometry and transformations in greater depth', 'Spatial measurement and geometry beyond the current vector examples'],
    experiments: [
      { title: 'Space versus time', summary: 'Move an object along a track, then stop it. Does time stop too?', path: '/space/space-vs-time' },
      { title: 'Displacement in 3D', summary: 'Move an object through 3D space, measure its displacement, and find out what changing the coordinates does.', path: '/space/displacement-3d' },
    ],
  },
  {
    number: 2,
    title: 'Understanding time',
    role: 'How time is measured: every clock is a physical process that repeats, and it keeps time only as well as its physics allows.',
    coverage: ['Clocks as physical processes', 'Periodic motion, period and frequency', 'Pendulum dynamics and clock calibration', 'Small-angle approximation and exact pendulum period'],
    plannedTopics: ['Other physical clock mechanisms and their comparison', 'A broader treatment of time measurement and uncertainty'],
    experiments: [
      { title: 'Pendulum clocks', summary: 'Measure a pendulum’s period, take a pendulum clock to the Moon, and ask what a clock really measures.', path: '/time/pendulum' },
    ],
  },
  {
    number: 3,
    title: 'Understanding motion',
    role: 'How motion through space changes over time, and why: forces, momentum and reference frames. This Newtonian picture is the one relativity later revises.',
    coverage: ['Newton’s second law: net force, mass and acceleration', 'Free-body diagrams and multiple forces', 'Static and kinetic friction, and force components on an inclined plane', 'Linear momentum and impulse', 'One-dimensional elastic and inelastic collisions', 'Momentum conservation and kinetic-energy change', 'Ideal projectile motion', 'Effects of launch conditions and gravitational acceleration', 'Galilean reference frames', 'Quadratic air resistance and energy loss', 'Uniform circular motion and centripetal force', 'Newtonian gravitation and circular, elliptical and escape orbits', 'Kepler’s third law'],
    plannedTopics: ['Work, energy and conservation beyond projectile examples'],
    experiments: [
      { title: 'Force, mass and acceleration', summary: 'Vary net force and cart mass to investigate Newton’s second law.', path: '/mechanics/newtonian' },
      { title: 'Force Lab: free-body diagrams and multiple forces', summary: 'Build a free-body diagram, resolve forces on a level surface or incline, and test how the net force determines acceleration.', path: '/mechanics/force-lab' },
      { title: 'Momentum and collisions', summary: 'Predict how two carts move after colliding; compare elastic and inelastic outcomes, momentum conservation and kinetic-energy changes.', path: '/mechanics/momentum-collisions' },
      { title: 'Projectile launcher', summary: 'Launch a ball on the Earth, Moon, Mars or Jupiter, with or without air, and watch it from the ground or a moving train.', path: '/mechanics/projectile' },
      { title: 'Circular motion and orbits', summary: 'Launch a satellite sideways: find the speed for a circular orbit, see what gravity must supply, and push it into an ellipse or out of reach.', path: '/mechanics/circular-orbits' },
    ],
  },
  {
    number: 4,
    title: 'Special relativity',
    role: 'Near the speed of light, measurements of time and length depend on the observer, and space and time combine into spacetime.',
    coverage: ['Galilean and Lorentz transformations', 'Time dilation and proper time', 'Length contraction and proper length', 'Relativity of simultaneity', 'Spacetime diagrams and invariant interval', 'Comparison of equivalent relativistic descriptions'],
    plannedTopics: ['Velocity addition and relativistic momentum', 'More explicit links between inertial-frame measurements and experimental evidence'],
    experiments: [
      { title: 'Different clocks, different elapsed times', summary: 'A spaceship passes the Earth. Compare their clocks on a spacetime diagram, from either point of view.', path: '/relativity/moving-clocks' },
      { title: 'Space and time versus spacetime', summary: 'Two perspectives: compare Galilean, space + time (Lorentz) and spacetime predictions with what experiments find.', path: '/relativity/two-perspectives' },
      { title: 'Length contraction', summary: 'Measure a moving spaceship by recording both endpoints at the same time. Compare its measured length with its proper length.', path: '/relativity/length-contraction' },
    ],
  },
  {
    number: 5,
    title: 'General relativity',
    role: 'Gravity as the geometry of spacetime: clocks at different heights run at different rates, and free fall follows the straightest possible paths.',
    coverage: ['Gravitational time dilation in the Schwarzschild exterior', 'GPS gravitational and kinematic clock corrections', 'Static spherical geometry and proper radial distance', 'Light signals and clock rates near a Schwarzschild horizon', 'Timelike geodesics and free-fall orbits in Schwarzschild spacetime', 'Periapsis precession and the Newtonian limit'],
    plannedTopics: ['Einstein field equations and the role of stress-energy', 'A careful bridge from the equivalence principle to curved spacetime', 'Beyond the static, spherical Schwarzschild setting'],
    experiments: [
      { title: 'Gravity and clock rates', summary: 'Two clocks at different heights, from the Earth to a black hole, and why GPS needs relativity.', path: '/gravity/clock-rates' },
      { title: 'Geodesic Motion Lab', summary: 'Compare Newtonian orbits with free-fall paths through Schwarzschild spacetime; investigate periapsis precession.', path: '/gravity/geodesic-motion' },
    ],
  },
  {
    number: 6,
    title: 'Cosmology',
    role: 'Space and time on the largest scale: how the universe’s own expansion evolves, and where our models stop being reliable.',
    coverage: ['Scale factor in homogeneous and isotropic FLRW models', 'Redshift and Hubble expansion', 'Matter-, radiation- and dark-energy-dominated model histories', 'Accelerating and decelerating expansion', 'Limits of classical evolution as the scale factor approaches zero'],
    plannedTopics: ['Observational evidence and parameter inference in modern cosmology', 'Cosmic distance measures and horizons', 'A deeper treatment of the early universe and inflation', 'The status and limits of extrapolating classical cosmology toward the initial singularity'],
    experiments: [
      { title: 'Evolving space', summary: 'Run a model universe forwards and backwards: Hubble’s law, redshift, dark energy and where the model breaks down.', path: '/cosmology/evolving-space' },
    ],
  },
]

/** Every implemented experiment, in catalogue order. */
export const IMPLEMENTED_EXPERIMENTS: readonly (ExperimentEntry & { readonly path: string; readonly module: number })[] = MODULES.flatMap((module) =>
  module.experiments.flatMap((experiment) => (experiment.path ? [{ ...experiment, path: experiment.path, module: module.number }] : [])),
)
