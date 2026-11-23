# Space & Time Laboratory

Interactive physics experiments about space, time and motion for high-school and undergraduate students.

**Product direction:** [Product vision, principles, audiences and learning outcomes](docs/product/PRODUCT_VISION.md).

Most introductory material starts with equations. Here every experiment follows the opposite order:

1. **Phenomenon.** Start from something physical.
2. **Predict.** The student commits to an answer before experimenting.
3. **Experiment.** Change parameters and observe the result immediately.
4. **Mathematics.** Describe what was seen, at the student's chosen level.
5. **Meaning.** Separate established physics from philosophical interpretation.

The same phenomenon is offered at three mathematical levels (Beginner, Intermediate and Advanced). The experiment never changes with the level; only the depth of the mathematics does.

## Curriculum coverage

The home page distinguishes topics explored by implemented experiments from planned curriculum topics. See the [curriculum coverage and roadmap](docs/product/CURRICULUM_ROADMAP.md) and [learning effectiveness metrics](docs/product/LEARNING_EFFECTIVENESS.md) for scope, priorities, and evaluation.

## Status

Eight experiments are currently implemented across the six modules. Further experiments are listed in the app as planned.

**Experiment A, Space versus time** (Module 1):
- A track and a live position–time graph, with earlier runs overlaid for comparison.
- Velocity changes mid-run, and ends of the track where the object stops while the clock keeps running.
- A second, moving observer at the Advanced level, showing that rest depends on the frame of reference.

**Displacement in 3D** (Module 1):
- Move an object through 3D space with 1 m steps, by typing a point, or with example journeys, in a Three.js scene you can turn and zoom, or look at from above, the front or the side.
- Live readouts of position, displacement Δr, its size |Δr| and the distance travelled; the components of Δr are drawn as dashed lines.
- At Intermediate: a second coordinate system that can be moved and turned (and tilted at Advanced). Every coordinate changes; the length of the displacement does not.
- At Advanced: the rotation matrix, the invariant dot product, direction cosines, and the triangle inequality, which spacetime reverses (the twin paradox).

**Experiment B, Different clocks, different elapsed times** (Module 4):
- A spacetime diagram (time up, light at 45°) of an Earth clock and a ship clock passing at up to 0.99c. Dots mark each second on each clock.
- A "Seen from" switch between the Earth's and the ship's frame, showing that time dilation is reciprocal.
- From Intermediate on, the moving observer's tilted line of "now" (relativity of simultaneity). At Advanced, the invariant interval s² = τ².
- A section separating established physics (muons, Hafele–Keating, GPS) from interpretation (is there a universal "now"?), and a note on seeing versus measuring.

**Experiment E, Space and time versus spacetime** ("Two perspectives", Module 4):
- Three situations (a ship's headlight, two lightning flashes, a moving clock) and a ship speed up to 0.99c.
- Three descriptions side by side: Galilean (space + absolute time), space + time related by Lorentz transformations, and spacetime (4-vectors, the interval, boosts as rapidity rotations). Each shows its working with the student's numbers and its prediction.
- A "Make the measurement" step reveals what experiments find, with the evidence, and marks each prediction as matching or not. A chart shows all three predictions at every speed.
- The lesson: Galilean physics is the low-speed limit, except for light. The two relativistic descriptions agree on every measurement, so the question of whether spacetime is fundamental is one of interpretation.

**Experiment C, Gravity and clock rates** (Module 5):
- Two clocks held at rest at adjustable heights (logarithmic sliders with presets: 33 cm, the Pound–Rebka tower, Everest, GPS height) above the Earth, the Sun, a white dwarf, a neutron star or a black hole, running in time-lapse.
- A chart of the gravity "well": how much a clock is slowed at each height. Readouts of each clock's slowdown and how far apart the clocks drift.
- A GPS setup: +45.7 μs/day from weaker gravity, −7.2 μs/day from orbital speed, net +38.5 μs/day. Switch the relativity correction off to watch the position error grow by about 11.5 km per day.
- At Advanced: light signals between the clocks (both observers agree the lower clock is slow, unlike Experiment B), the approach to the horizon, curved space (ruler distance exceeds Δr), and the ADM lapse as the clock rate.

**Experiment D, Evolving space** (Module 6):
- Four model universes: ours (ΛCDM with Planck 2018 values), matter only, radiation only, and dark energy only (de Sitter). The scale factor a(t) comes from integrating the Friedmann equation.
- Run time forwards and backwards, or jump to milestones (Big Bang, first light, first galaxies, today). A field of galaxies spreads apart, with recession arrows from whichever galaxy you choose as "home". The pattern repeats, so there is no edge and no centre, and galaxies keep their own size.
- A chart of a(t), plus readouts for redshift, background temperature, Hubble rate and distance, whether the expansion is slowing or speeding up, and a distant galaxy's recession speed (which can exceed c).
- Shows where the model stops being valid as a → 0, rather than drawing a point explosion.

**Projectile launcher** (Module 3):
- Launch speed, angle and height; the Earth, the Moon, Mars or Jupiter; optional air resistance (a baseball, integrated with RK4); an optional ball dropped at the same moment.
- A to-scale view with earlier throws kept for comparison, and live graphs of height and velocity against time.
- Watch from the ground or from a moving train (Galilean frames): matched to the ball's horizontal speed, the train sees it go straight up and down.
- At Advanced: energy lost to the air and the best launch angle for the current settings.

**Pendulum clocks** (Module 2):
- A pendulum drawn to scale, with adjustable length, release angle, bob mass and world. It is integrated live with the symplectic Störmer–Verlet method, and its period is measured from successive swings.
- A pendulum clock adjusted on the Earth runs beside an atomic clock, showing how far it drifts on other worlds or with wide swings.
- A graph of the angle against time; at Advanced, a phase portrait and the exact (elliptic-integral) period.
- Leads to the question behind the whole lab: if every clock is a physical process, what is time?

All experiments include:
- Predict–observe–explain cards. Each explanation unlocks only after the student has performed the experiment that tests it, with hints for near-misses. Every level adds questions of its own.
- Mathematics at three levels, with worked examples using the student's own numbers.
- Shareable links that encode the level and the exact setup, e.g. `#/relativity/moving-clocks?level=advanced&beta=0.8&frame=ship`.

## Getting started

Requires Node.js 22 or later.

```bash
npm install
```

```bash
npm run dev
```

Other scripts:

| Command | Purpose |
| --- | --- |
| `npm test` | Run the unit tests (Vitest) |
| `npm run typecheck` | Type-check the physics engine, the app and the tests |
| `npm run build` | Type-check, then build static files into `dist/` |
| `npm run preview` | Serve the production build locally |

The build is fully static and uses hash-based routes with relative asset paths, so `dist/` can be hosted anywhere (GitHub Pages, a school web server, a network share) without server configuration.

## Deployment

Every push to `main` is tested, built and published to GitHub Pages by `.github/workflows/deploy.yml`. This requires a one-time setting: **Settings → Pages → Build and deployment → Source: GitHub Actions**. With the "Deploy from a branch" source, Pages serves the unbuilt source files and the site is blank.

## Architecture

```
src/
├── physics/              Physics engine: pure TypeScript, no DOM, no Vue
│   ├── vector.ts           3-vector algebra
│   ├── kinematics.ts       Closed-form motion (uniform, constant acceleration)
│   ├── frames.ts           Events and Galilean transformations
│   ├── motionRun.ts        Piecewise-uniform experiment run (exact, frame-rate independent)
│   ├── relativity.ts       Lorentz factor (numerically stable γ − 1)
│   ├── spacetime.ts        Lorentz boosts, interval, velocity addition, proper time, simultaneity (c = 1)
│   ├── descriptions.ts     The same predictions computed three ways: Galilean, Lorentz, spacetime
│   ├── gravity.ts          Schwarzschild clock rates (precision-safe), light signals, ruler distance, GPS breakdown
│   ├── cosmology.ts        Friedmann equation, tabulated a(t), Hubble rate, deceleration, redshift
│   ├── projectile.ts       Exact projectile motion; quadratic drag integrated with RK4; best angle
│   ├── pendulum.ts         Pendulum periods (small-angle and exact via the AGM); Störmer–Verlet integration
│   └── space3d.ts          Path length, displacement, rotated and shifted coordinate systems, direction angles
├── experiments/
│   ├── prediction.ts       Shared predict–observe–explain types
│   ├── space-vs-time/      Experiment A: state composable, predictions, maths, page
│   ├── moving-clocks/      Experiment B: state composable, predictions, maths, page
│   ├── two-perspectives/   Experiment E: state composable, content and derivations, predictions, maths, page
│   ├── gravity-clocks/     Experiment C: state composable, formatting, predictions, maths, page
│   ├── evolving-space/     Experiment D: state composable, predictions, maths, page
│   ├── projectile/         Projectile launcher: state composable, predictions, maths, page
│   ├── pendulum/           Pendulum clocks: state composable, predictions, maths, page
│   └── displacement3d/     Displacement in 3D: state composable, predictions, maths, page
├── components/           Reusable UI: graphs, track, spacetime diagram, prediction chart, clock-rate chart, galaxy field, scale-factor chart, trajectory view, pendulum, phase portrait, line chart, 3D scene (Three.js), sliders, prediction card, KaTeX
├── composables/          Animation loop, shared level setting, URL sync
├── styles/               Design tokens (main.css) and layout shared by lesson pages (lesson.css)
├── views/                Home page
├── levels.ts             Beginner / Intermediate / Advanced
└── modules.ts            Module and experiment catalogue
```

**The physics engine stays independent of the visualization.** This is enforced in two ways:

- `tsconfig.physics.json` compiles `src/physics` without the DOM library, so any browser API is a type error.
- `architecture.test.ts` fails if a physics file imports anything outside `src/physics`.

**Physics is computed exactly where possible.** Uniform motion uses its closed-form solution, so results do not depend on the animation frame rate. Tests check this explicitly. Where numerical integration is needed (the Friedmann equation, projectiles with air resistance, the pendulum), the result is tested against the exact solutions that exist for special cases. RK4 is checked to be fourth order, and the pendulum's symplectic Störmer–Verlet integrator is checked to keep its energy error bounded while RK4's grows. Use a symplectic method for anything that oscillates or orbits for a long time.

**Prediction gates are pure functions.** Each prediction's `observed(runs)` test decides when a student has done the relevant experiment. These functions are unit-tested.

### Adding an experiment

1. Put any new physics in `src/physics/` with tests. It must have no UI dependencies.
2. Create `src/experiments/<name>/` containing:
   - a state composable that owns the model and the animation;
   - `predictions.ts`, typed with `Prediction<YourRun>` from `experiments/prediction.ts`;
   - a levelled maths component;
   - a page view, using `useQuerySync` to keep the setup in the URL.
3. Register the route in `src/router.ts` and add a `path` to the experiment's entry in `src/modules.ts`.

## Technology

Vue 3, Vue Router, TypeScript, Vite, KaTeX and Vitest. Graphs are hand-written SVG, which keeps them small, sharp and themeable. Three.js draws the 3D scene; it is loaded only on the page that uses it, so the rest of the site stays light.

## License

MIT
