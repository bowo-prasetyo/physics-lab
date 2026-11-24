/** Catalogue of learning modules and their experiments, shown on the home page. */

export interface ExperimentEntry {
  readonly title: string
  readonly summary: string
  /** Route path when available; omitted for planned experiments. */
  readonly path?: string
}

export interface ModuleEntry {
  readonly number: number
  readonly title: string
  readonly audience: string
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
    audience: 'High school',
    coverage: ['Position and reference points', 'Distance and displacement', '3D vectors and coordinate systems', 'Euclidean spatial measurements'],
    plannedTopics: ['2D coordinate geometry and transformations in greater depth', 'Spatial measurement and geometry beyond the current vector examples'],
    experiments: [
      { title: 'A · Space versus time', summary: 'Move an object along a track, then stop it. Does time stop too?', path: '/space/space-vs-time' },
      { title: 'Displacement in 3D', summary: 'Move an object through 3D space, measure its displacement, and find out what changing the coordinates does.', path: '/space/displacement-3d' },
    ],
  },
  {
    number: 2,
    title: 'Understanding time',
    audience: 'High school',
    coverage: ['Clocks as physical processes', 'Periodic motion, period and frequency', 'Pendulum dynamics and clock calibration', 'Small-angle approximation and exact pendulum period'],
    plannedTopics: ['Other physical clock mechanisms and their comparison', 'A broader treatment of time measurement and uncertainty'],
    experiments: [
      { title: 'Pendulum clocks', summary: 'Measure a pendulum’s period, take a pendulum clock to the Moon, and ask what a clock really measures.', path: '/time/pendulum' },
    ],
  },
  {
    number: 3,
    title: 'Classical mechanics',
    audience: 'High school / Undergraduate',
    coverage: ['Newton’s second law: net force, mass and acceleration', 'Free-body diagrams and multiple forces', 'Friction limits and force components on an inclined plane', 'Ideal projectile motion', 'Effects of launch conditions and gravitational acceleration', 'Galilean reference frames', 'Quadratic air resistance and energy loss'],
    plannedTopics: ['Static friction and limiting equilibrium', 'Circular motion', 'Momentum and collisions', 'Work, energy and conservation beyond projectile examples', 'Gravitation as a force and orbital motion'],
    experiments: [
      { title: 'Force, mass and acceleration', summary: 'Vary net force and cart mass to investigate Newton’s second law.', path: '/mechanics/newtonian' },
      { title: 'Force Lab: free-body diagrams and multiple forces', summary: 'Build a free-body diagram, resolve forces on a level surface or incline, and test how the net force determines acceleration.', path: '/mechanics/force-lab' },
      { title: 'Projectile launcher', summary: 'Launch a ball on the Earth, Moon, Mars or Jupiter, with or without air, and watch it from the ground or a moving train.', path: '/mechanics/projectile' },
    ],
  },
  {
    number: 4,
    title: 'Special relativity',
    audience: 'Undergraduate',
    coverage: ['Galilean and Lorentz transformations', 'Time dilation and proper time', 'Length contraction and proper length', 'Relativity of simultaneity', 'Spacetime diagrams and invariant interval', 'Comparison of equivalent relativistic descriptions'],
    plannedTopics: ['Velocity addition and relativistic momentum', 'More explicit links between inertial-frame measurements and experimental evidence'],
    experiments: [
      { title: 'B · Different clocks, different elapsed times', summary: 'A spaceship passes the Earth. Compare their clocks on a spacetime diagram, from either point of view.', path: '/relativity/moving-clocks' },
      { title: 'E · Space and time versus spacetime', summary: 'Two perspectives: compare Galilean, space + time (Lorentz) and spacetime predictions with what experiments find.', path: '/relativity/two-perspectives' },
      { title: 'F · Length contraction', summary: 'Measure a moving spaceship by recording both endpoints at the same time. Compare its measured length with its proper length.', path: '/relativity/length-contraction' },
    ],
  },
  {
    number: 5,
    title: 'General relativity',
    audience: 'Advanced undergraduate',
    coverage: ['Gravitational time dilation in the Schwarzschild exterior', 'GPS gravitational and kinematic clock corrections', 'Static spherical geometry and proper radial distance', 'Light signals and clock rates near a Schwarzschild horizon'],
    plannedTopics: ['Geodesic motion and free fall', 'Einstein field equations and the role of stress-energy', 'A careful bridge from the equivalence principle to curved spacetime', 'Beyond the static, spherical Schwarzschild setting'],
    experiments: [
      { title: 'C · Gravity and clock rates', summary: 'Two clocks at different heights, from the Earth to a black hole, and why GPS needs relativity.', path: '/gravity/clock-rates' },
    ],
  },
  {
    number: 6,
    title: 'Cosmology',
    audience: 'Advanced undergraduate',
    coverage: ['Scale factor in homogeneous and isotropic FLRW models', 'Redshift and Hubble expansion', 'Matter-, radiation- and dark-energy-dominated model histories', 'Accelerating and decelerating expansion', 'Limits of classical evolution as the scale factor approaches zero'],
    plannedTopics: ['Observational evidence and parameter inference in modern cosmology', 'Cosmic distance measures and horizons', 'A deeper treatment of the early universe and inflation', 'The status and limits of extrapolating classical cosmology toward the initial singularity'],
    experiments: [
      { title: 'D · Evolving space', summary: 'Run a model universe forwards and backwards: Hubble’s law, redshift, dark energy and where the model breaks down.', path: '/cosmology/evolving-space' },
    ],
  },
]
