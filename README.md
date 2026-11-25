# Physica

Interactive experiments about space, time and motion, from where things are and how clocks keep time to relativity, curved spacetime and the expanding universe. For high-school and undergraduate learners, and the teachers who work with them.

**Product direction:** [vision, principles, audiences and learning outcomes](docs/product/PRODUCT_VISION.md) · [curriculum coverage and roadmap](docs/product/CURRICULUM_ROADMAP.md) · [learning effectiveness](docs/product/LEARNING_EFFECTIVENESS.md) · [assessment pilot plan](docs/product/ASSESSMENT_PILOT_PLAN.md)

## One thread: space, time and motion

Physica follows a single thread. Modules 1–3 build the everyday picture: where things are, how time is measured, and how motion changes and why. Modules 4–6 follow the same questions into special relativity, general relativity and cosmology, where that picture has to be revised. The mechanics experiments in Module 3 are steps on this path: forces, momentum and reference frames are what relativity later reinterprets.

Most introductory material starts with equations. Here every experiment follows the opposite order, and every experiment page has the same layout:

1. **Predict.** The learner commits to an answer before seeing the result. Each explanation unlocks only after the learner has run the experiment that tests it.
2. **Experiment.** Change parameters and observe. Results appear only after a run.
3. **Mathematics.** Describe what was seen, at the learner's chosen level.
4. **Meaning.** Separate established physics from interpretation, and state the model's assumptions and limits.

Every experiment works at three mathematical levels (Beginner, Intermediate and Advanced), and each level adds questions of its own. The levels describe mathematical depth, not age or school year: the experiment and its physics never change with the level.

## Experiments

<!-- catalogue:start (generated from src/modules.ts by `npm run docs:catalogue`; do not edit by hand) -->
Thirteen experiments across six modules. Modules 1–3 build the everyday picture of space, time and motion; Modules 4–6 follow the same questions into relativity, curved spacetime and cosmology.

**Module 1 · Understanding space.** Where things are: positions, distances and displacements, and which of them depend on the coordinates you choose.

- [Space versus time](https://bowo-prasetyo.github.io/physics-lab/#/space/space-vs-time): Move an object along a track, then stop it. Does time stop too?
- [Displacement in 3D](https://bowo-prasetyo.github.io/physics-lab/#/space/displacement-3d): Move an object through 3D space, measure its displacement, and find out what changing the coordinates does.

**Module 2 · Understanding time.** How time is measured: every clock is a physical process that repeats, and it keeps time only as well as its physics allows.

- [Pendulum clocks](https://bowo-prasetyo.github.io/physics-lab/#/time/pendulum): Measure a pendulum’s period, take a pendulum clock to the Moon, and ask what a clock really measures.

**Module 3 · Understanding motion.** How motion through space changes over time, and why: forces, momentum and reference frames. This Newtonian picture is the one relativity later revises.

- [Force, mass and acceleration](https://bowo-prasetyo.github.io/physics-lab/#/mechanics/newtonian): Vary net force and cart mass to investigate Newton’s second law.
- [Force Lab: free-body diagrams and multiple forces](https://bowo-prasetyo.github.io/physics-lab/#/mechanics/force-lab): Build a free-body diagram, resolve forces on a level surface or incline, and test how the net force determines acceleration.
- [Momentum and collisions](https://bowo-prasetyo.github.io/physics-lab/#/mechanics/momentum-collisions): Predict how two carts move after colliding; compare elastic and inelastic outcomes, momentum conservation and kinetic-energy changes.
- [Projectile launcher](https://bowo-prasetyo.github.io/physics-lab/#/mechanics/projectile): Launch a ball on the Earth, Moon, Mars or Jupiter, with or without air, and watch it from the ground or a moving train.

**Module 4 · Special relativity.** Near the speed of light, measurements of time and length depend on the observer, and space and time combine into spacetime.

- [Different clocks, different elapsed times](https://bowo-prasetyo.github.io/physics-lab/#/relativity/moving-clocks): A spaceship passes the Earth. Compare their clocks on a spacetime diagram, from either point of view.
- [Space and time versus spacetime](https://bowo-prasetyo.github.io/physics-lab/#/relativity/two-perspectives): Two perspectives: compare Galilean, space + time (Lorentz) and spacetime predictions with what experiments find.
- [Length contraction](https://bowo-prasetyo.github.io/physics-lab/#/relativity/length-contraction): Measure a moving spaceship by recording both endpoints at the same time. Compare its measured length with its proper length.

**Module 5 · General relativity.** Gravity as the geometry of spacetime: clocks at different heights run at different rates, and free fall follows the straightest possible paths.

- [Gravity and clock rates](https://bowo-prasetyo.github.io/physics-lab/#/gravity/clock-rates): Two clocks at different heights, from the Earth to a black hole, and why GPS needs relativity.
- [Geodesic Motion Lab](https://bowo-prasetyo.github.io/physics-lab/#/gravity/geodesic-motion): Compare Newtonian orbits with free-fall paths through Schwarzschild spacetime; investigate periapsis precession.

**Module 6 · Cosmology.** Space and time on the largest scale: how the universe’s own expansion evolves, and where our models stop being reliable.

- [Evolving space](https://bowo-prasetyo.github.io/physics-lab/#/cosmology/evolving-space): Run a model universe forwards and backwards: Hubble’s law, redshift, dark energy and where the model breaks down.
<!-- catalogue:end -->

Every experiment page has shareable links that encode the level and setup, an investigation guide, and full translations into Indonesian and Japanese.

**Learning path:** the [learning path](https://bowo-prasetyo.github.io/physics-lab/#/learning) walks the same thread chapter by chapter, from Module 1 to Module 6. Each step links to an experiment and says what to know first. Once the learner has tested a prediction in that experiment, the step unlocks practice questions and then an **Apply it** set of numerical problems with hints and worked solutions (answers within 2% count as correct). Progress lasts for the browser session only. The home page has one call to action, *Start the learning path*; the experiment catalogue below it is for browsing.

**For teachers:** the in-app [teacher guide](https://bowo-prasetyo.github.io/physics-lab/#/teachers) has a lesson outline for every experiment: learning intentions, timings, a classroom sequence, discussion prompts and a check for understanding. The [learning assessment pilot](https://bowo-prasetyo.github.io/physics-lab/#/assessment-pilot) runs short, anonymous pre/post checks; see the [pilot plan](docs/product/ASSESSMENT_PILOT_PLAN.md).

## Getting started

Requires Node.js 22 or later.

```bash
npm install
npm run dev
```

Other scripts:

| Command | Purpose |
| --- | --- |
| `npm test` | Run the unit tests (Vitest) |
| `npm run typecheck` | Type-check the physics engine, the app and the tests |
| `npm run build` | Type-check, then build static files into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run docs:catalogue` | Regenerate the README's experiment list from `src/modules.ts` |

The build is fully static and uses hash-based routes with relative asset paths, so `dist/` can be hosted anywhere (GitHub Pages, a school web server, a network share) without server configuration.

## Deployment

Every push to `main` is tested, built and published to GitHub Pages by `.github/workflows/deploy.yml`. This requires a one-time setting: **Settings → Pages → Build and deployment → Source: GitHub Actions**. With the "Deploy from a branch" source, Pages serves the unbuilt source files and the site is blank.

## Architecture

- **Physics engine.** `src/physics/` is framework-independent TypeScript with no DOM access, tested separately from the interface (`architecture.test.ts` enforces this). Numerical methods are checked against exact solutions where they exist.
- **One catalogue.** `src/modules.ts` is the single source for modules and experiments. The home page, the translated catalogues (keyed by route), the learning path, the teacher guide's lesson coverage and this README are all checked against it.
- **One learning loop.** Every experiment uses the shared prediction cards (`src/experiments/prediction.ts`, `PredictionCard.vue`): each level adds questions, and each explanation unlocks only after the run that tests it.
- **One page layout.** `src/experiments/layout.test.ts` checks that every experiment page has the same sections in the same order.
- **Localization.** English, Indonesian and Japanese, with tests for completeness and runtime audits (`npm run audit:localization:runtime`). See [docs/internationalization.md](docs/internationalization.md).
- **No learner tracking.** The teacher guide and the assessment pilot work without accounts, rosters or analytics; pilot answers stay in the browser tab.

## Technology

Vue 3, Vue Router, TypeScript, Vite, KaTeX and Vitest. Graphs are hand-written SVG, which keeps them small, sharp and themeable. Three.js draws the 3D scene; it is loaded only on the page that uses it, so the rest of the site stays light.

## License

MIT License
