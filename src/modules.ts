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
    experiments: [
      {
        title: 'Projectile launcher',
        summary: 'Launch a ball on the Earth, Moon, Mars or Jupiter, with or without air, and watch it from the ground or a moving train.',
        path: '/mechanics/projectile',
      },
    ],
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
    experiments: [
      {
        title: 'C · Gravity and clock rates',
        summary: 'Two clocks at different heights, from the Earth to a black hole, and why GPS needs relativity.',
        path: '/gravity/clock-rates',
      },
    ],
  },
  {
    number: 6,
    title: 'Cosmology',
    audience: 'Advanced undergraduate',
    topics: ['Scale factor and expansion', 'The early universe', 'Where classical models break down', 'The problem of time (discussion)'],
    experiments: [
      {
        title: 'D · Evolving space',
        summary: 'Run a model universe forwards and backwards: Hubble’s law, redshift, dark energy and where the model breaks down.',
        path: '/cosmology/evolving-space',
      },
    ],
  },
]
