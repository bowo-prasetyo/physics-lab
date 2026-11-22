# Space & Time Laboratory

Interactive physics experiments about space, time and motion for high-school and undergraduate students.

Most introductory material starts with equations. Here every experiment follows the opposite order:

1. **Phenomenon.** Start from something physical.
2. **Predict.** The student commits to an answer before experimenting.
3. **Experiment.** Change parameters and observe the result immediately.
4. **Mathematics.** Describe what was seen, at the student's chosen level.
5. **Meaning.** Separate established physics from philosophical interpretation.

The same phenomenon is offered at three mathematical levels (Beginner, Intermediate and Advanced). The experiment never changes with the level; only the depth of the mathematics does.

## Status

Four experiments are complete. The other modules are listed in the app as planned.

**Experiment A, Space versus time** (Module 1):
- A track and a live position–time graph, with earlier runs overlaid for comparison.
- Velocity changes mid-run, and ends of the track where the object stops while the clock keeps running.
- A second, moving observer at the Advanced level, showing that rest depends on the frame of reference.

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
│   └── gravity.ts          Schwarzschild clock rates (precision-safe), light signals, ruler distance, GPS breakdown
├── experiments/
│   ├── prediction.ts       Shared predict–observe–explain types
│   ├── space-vs-time/      Experiment A: state composable, predictions, maths, page
│   ├── moving-clocks/      Experiment B: state composable, predictions, maths, page
│   ├── two-perspectives/   Experiment E: state composable, content and derivations, predictions, maths, page
│   └── gravity-clocks/     Experiment C: state composable, formatting, predictions, maths, page
├── components/           Reusable UI: graphs, track, spacetime diagram, prediction chart, clock-rate chart, sliders, prediction card, KaTeX
├── composables/          Animation loop, shared level setting, URL sync
├── views/                Home page
├── levels.ts             Beginner / Intermediate / Advanced
└── modules.ts            Module and experiment catalogue
```

**The physics engine stays independent of the visualization.** This is enforced in two ways:

- `tsconfig.physics.json` compiles `src/physics` without the DOM library, so any browser API is a type error.
- `architecture.test.ts` fails if a physics file imports anything outside `src/physics`.

**Physics is computed exactly where possible.** Uniform motion uses its closed-form solution, so results do not depend on the animation frame rate. Tests check this explicitly. When later modules need numerical integration (orbits, for example), they should use a symplectic method such as velocity Verlet, so that energy does not drift.

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

Vue 3, Vue Router, TypeScript, Vite, KaTeX and Vitest. Graphs are hand-written SVG, which keeps them small, sharp and themeable. Three.js is planned for the 3D experiments.

## License

MIT
