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
  readonly topics: readonly string[]
  readonly experiments: readonly ExperimentEntry[]
}

export const MODULES: readonly ModuleEntry[] = [
  {
    number: 1,
    title: 'Understanding space',
    audience: 'High school',
    topics: ['Coordinates', 'Distance and displacement', 'Position and direction', 'Euclidean geometry'],
    experiments: [
      {
        title: 'A · Space versus time',
        summary: 'Move an object along a track, then stop it. Does time stop too?',
        path: '/space/space-vs-time',
      },
      { title: 'Displacement in 3D', summary: 'Move an object through a 3D coordinate system and measure its displacement.' },
    ],
  },
  {
    number: 2,
    title: 'Understanding time',
    audience: 'High school',
    topics: ['Clocks and intervals', 'Periodic motion', 'Frequency and oscillation', 'Every clock is a physical process'],
    experiments: [{ title: 'Pendulum clocks', summary: 'Measure a pendulum’s period and compare different clocks.' }],
  },
  {
    number: 3,
    title: 'Classical mechanics',
    audience: 'High school / Undergraduate',
    topics: ['Newton’s laws', 'Projectile and circular motion', 'Momentum and energy', 'Gravitation'],
    experiments: [{ title: 'Projectile launcher', summary: 'Launch projectiles with adjustable initial velocity and gravity.' }],
  },
  {
    number: 4,
    title: 'Special relativity',
    audience: 'Undergraduate',
    topics: ['Galilean and Lorentz transformations', 'Time dilation', 'Length contraction', 'Relativity of simultaneity'],
    experiments: [
      {
        title: 'B · Different clocks, different elapsed times',
        summary: 'A spaceship passes the Earth. Compare their clocks on a spacetime diagram, from either point of view.',
        path: '/relativity/moving-clocks',
      },
      {
        title: 'E · Space and time versus spacetime',
        summary: 'Two perspectives: compare Galilean, space + time (Lorentz) and spacetime predictions with what experiments find.',
        path: '/relativity/two-perspectives',
      },
    ],
  },
  {
    number: 5,
    title: 'General relativity',
    audience: 'Advanced undergraduate',
    topics: ['Gravitational time dilation', 'Spatial curvature', 'Geodesics', 'Schwarzschild geometry'],
    experiments: [{ title: 'C · Gravity and clock rates', summary: 'Change a mass and see how clock rates depend on distance from it, including GPS.' }],
  },
  {
    number: 6,
    title: 'Cosmology',
    audience: 'Advanced undergraduate',
    topics: ['Scale factor and expansion', 'The early universe', 'Where classical models break down', 'The problem of time (discussion)'],
    experiments: [{ title: 'D · Evolving space', summary: 'Run a model universe forwards and backwards and watch comoving distances change.' }],
  },
]
