# Physica

Interactive physics experiments about space, time and motion for high-school and undergraduate students.

**Product direction:** [Product vision, principles, audiences and learning outcomes](docs/product/PRODUCT_VISION.md).

Most introductory material starts with equations. Here every experiment follows the opposite order:

1. **Phenomenon.** Start from something physical.
2. **Predict.** The student commits to an answer before experimenting.
3. **Experiment.** Change parameters and observe the result immediately.
4. **Mathematics.** Describe what was seen, at the student's chosen level.
5. **Meaning.** Separate established physics from philosophical interpretation.

The same phenomenon is offered at three mathematical levels (Beginner, Intermediate and Advanced). The experiment never changes with the level; only the depth of the mathematics does.

**For educators:** the in-app [Teacher guide](#/teachers) provides lesson outlines, learning intentions, classroom sequences, discussion prompts and checks for understanding. Experiment settings can be shared through their URL where supported.

## Curriculum coverage

The home page distinguishes topics explored by implemented experiments from planned curriculum topics. See the [curriculum coverage and roadmap](docs/product/CURRICULUM_ROADMAP.md) and [learning effectiveness metrics](docs/product/LEARNING_EFFECTIVENESS.md) for scope, priorities, and evaluation.

## Status

Ten experiments are currently implemented across the six modules. Further experiments are listed in the app as planned.

**Force Lab: free-body diagrams and multiple forces** (Module 3):
- Compare horizontal and inclined surfaces; vary mass, applied force, friction and incline angle.
- Build a live free-body diagram with applied, friction, normal and resolved weight components; compare the net force with acceleration, velocity and displacement.
- Includes Beginner, Intermediate and Advanced mathematics, plus explicit assumptions and model limits.

**Force, mass and acceleration** (Module 3):
- Investigate Newton’s second law by varying net force and cart mass independently.
- Record trials and compare acceleration, then connect the result to velocity and displacement from rest.
- Makes the constant-net-force, constant-mass, one-dimensional and friction-free assumptions explicit.

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
- Two clocks held at rest at adjustable heights above the Earth and compact objects, with clock-rate comparisons.
- GPS gravitational and kinematic clock corrections.
- At Advanced: light signals, the approach to the horizon, curved space and the ADM lapse as the clock rate.

**Experiment D, Evolving space** (Module 6):
- Four model universes: ΛCDM, matter only, radiation only, and dark energy only.
- Evolve the scale factor, redshift and Hubble quantities; compare expansion histories and model limits.

**Projectile launcher** (Module 3):
- Launch speed, angle and height; the Earth, Moon, Mars or Jupiter; optional air resistance; an optional ball dropped at the same moment.
- Compare trajectories and velocity/height graphs, and watch from the ground or a moving train (Galilean frames).

**Pendulum clocks** (Module 2):
- A pendulum with adjustable length, release angle, bob mass and world; compare measured period with small-angle and exact predictions.
- Compare a pendulum clock with an atomic clock and explore calibration across environments.

All experiments include:
- Predict–observe–explain cards. Each explanation unlocks only after the student has performed the experiment that tests it, with hints for near-misses.
- Mathematics at three levels, with worked examples where available.
- Shareable links that encode the level and experiment setup where supported.

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

The build is fully static and uses hash-based routes with relative asset paths, so `dist/` can be hosted anywhere (GitHub Pages, a school web server, a network share) without server configuration.

## Deployment

Every push to `main` is tested, built and published to GitHub Pages by `.github/workflows/deploy.yml`. This requires a one-time setting: **Settings → Pages → Build and deployment → Source: GitHub Actions**. With the "Deploy from a branch" source, Pages serves the unbuilt source files and the site is blank.

## Architecture

The physics engine under `src/physics/` is framework-independent TypeScript. It is tested separately from the Vue interface. The Newtonian force model is intentionally small and explicit about its domain; the teacher guide provides classroom context without introducing student tracking or class-management infrastructure.

## Technology

Vue 3, Vue Router, TypeScript, Vite, KaTeX and Vitest. Graphs are hand-written SVG, which keeps them small, sharp and themeable. Three.js draws the 3D scene; it is loaded only on the page that uses it, so the rest of the site stays light.

## License

MIT License
