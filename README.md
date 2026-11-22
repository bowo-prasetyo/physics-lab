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

The first vertical slice is complete: **Experiment A, Space versus time** (Module 1). It covers:

- A track and a live position–time graph, with earlier runs overlaid for comparison.
- Predict–observe–explain cards. Each explanation unlocks only after the student has performed the experiment that tests it.
- Velocity changes mid-run, so distance and displacement can be compared.
- Ends of the track where the object stops while the clock keeps running.
- Levelled mathematics with worked examples using the student's own run:
  - Beginner: algebra and tables.
  - Intermediate: calculus and vectors.
  - Advanced: worldlines, Galilean frames, and how small the relativistic correction is.
- A second, moving observer at the Advanced level, showing that rest depends on the frame of reference.
- Shareable links that encode an exact setup, e.g. `#/space/space-vs-time?x0=-4&v=1.5`.

The other modules are listed in the app as planned.

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

The build is fully static and uses hash-based routes, so `dist/` can be hosted anywhere (GitHub Pages, a school web server, a network share) without server configuration.

## Architecture

```
src/
├── physics/            Physics engine: pure TypeScript, no DOM, no Vue
│   ├── vector.ts         3-vector algebra
│   ├── kinematics.ts     Closed-form motion (uniform, constant acceleration)
│   ├── frames.ts         Events and Galilean transformations
│   ├── motionRun.ts      Piecewise-uniform experiment run (exact, frame-rate independent)
│   └── relativity.ts     Lorentz factor (numerically stable γ − 1)
├── experiments/
│   └── space-vs-time/    Experiment A: state composable, predictions, maths, page
├── components/         Reusable UI: graph, track, sliders, prediction card, KaTeX
├── composables/        Animation loop, shared level setting
├── views/              Home page
├── levels.ts           Beginner / Intermediate / Advanced
└── modules.ts          Module and experiment catalogue
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
   - `predictions.ts`;
   - a levelled maths component;
   - a page view.
3. Register the route in `src/router.ts` and add a `path` to the experiment's entry in `src/modules.ts`.

## Technology

Vue 3, Vue Router, TypeScript, Vite, KaTeX and Vitest. Graphs are hand-written SVG, which keeps them small, sharp and themeable. Three.js is planned for the 3D experiments.

## License

MIT
