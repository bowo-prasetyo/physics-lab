# Curriculum coverage and prioritized roadmap

## Purpose

This document connects the six-module curriculum to the experiments that exist today, makes the gaps explicit, and sets a priority order for future work. It is a direction-setting roadmap, not a release-date commitment.

The product vision and module learning outcomes live in [Product vision, principles, audiences and learning outcomes](PRODUCT_VISION.md). The learner-facing catalogue in `src/modules.ts` is the source for the home-page distinction between current and planned coverage. Classroom lesson outlines are available in the in-app [teacher guide](https://bowo-prasetyo.github.io/physics-lab/#/teachers).

## Coverage principles

- A topic is **currently explored** only when an implemented experiment provides a meaningful opportunity to investigate it.
- A topic is **partially explored** when an experiment establishes a foundation but does not teach the broader subject.
- A topic is **planned** when it needs a dedicated learning experience, not merely a mention in a topic list.
- One experiment may support several outcomes, but the presence of a label is not evidence that an outcome is mastered.
- Keep the three mathematical levels focused on the same phenomenon; do not use levels as a substitute for missing curriculum topics.

## Module-by-module coverage

| Module | Current experiments | Meaningful current coverage | Important gaps |
|---|---|---|---|
| 1. Understanding space | Space versus time; Displacement in 3D | Position, reference points, path length versus displacement, 3D vectors, coordinate-system changes, Euclidean spatial measurements | Broader 2D coordinate geometry and spatial measurement beyond the current examples |
| 2. Understanding time | Pendulum clocks | Periodic motion, period and frequency, pendulum dynamics, small-angle versus exact period, clocks as physical processes | Other clock mechanisms, measurement uncertainty, and a broader treatment of time standards |
| 3. Understanding motion | Force, mass and acceleration; Force Lab; Momentum and collisions; Projectile launcher; Circular motion and orbits | Newton’s second law; free-body diagrams and vector addition of multiple forces; normal forces and weight components; static-friction limits and kinetic friction on horizontal/inclined surfaces; one-dimensional momentum and impulse; elastic and inelastic collisions; momentum conservation and kinetic-energy change; ideal projectile motion, initial-condition dependence, gravitational acceleration, Galilean observers, optional quadratic drag and energy loss; work by constant forces, signed work by friction, the work–energy theorem, kinetic and near-surface gravitational potential energy, mechanical-energy conservation, and the negative total energy of a bound circular orbit; uniform circular motion and centripetal force; Newtonian gravitation and circular, elliptical and escape orbits; Kepler’s third law | — |
| 4. Special relativity | Different clocks, different elapsed times; Space and time versus spacetime; Length contraction | Lorentz transformations, time dilation, proper time, proper length and length contraction, frame-dependent simultaneity, spacetime diagrams, interval invariance, comparison of equivalent relativistic descriptions, relativistic velocity addition, relativistic momentum p = γmv | Deeper experimental evidence connections |
| 5. General relativity | Gravity and clock rates; Geodesic Motion Lab | Schwarzschild exterior clock rates, GPS clock corrections, static spherical geometry, timelike geodesics, free-fall orbits, periapsis precession and the Newtonian limit, the equivalence principle (free fall cancels gravity locally; hovering does not) | Einstein field equations and stress-energy, non-Schwarzschild settings |
| 6. Cosmology | Evolving space | Homogeneous/isotropic FLRW models, scale factor, redshift, Hubble expansion, simple matter/radiation/dark-energy histories, acceleration and classical-model limits, the Hubble diagram and estimating H₀ from scattered (illustrative) data | Parameter inference from real observations, distance measures and horizons, inflation/early-universe physics, limits of extrapolation toward the initial singularity |

### Scope clarifications

- **Module 1:** The current 3D displacement experiment provides a strong vector and coordinate foundation; it is not a complete course in Euclidean geometry.
- **Module 2:** The pendulum is a useful example of a physical clock, not a survey of clock technologies or precision timekeeping.
- **Module 3:** Force Lab now provides free-body diagrams, multiple force components, static friction up to \(\mu_sN\), and kinetic friction \(\mu_kN\) after breakaway. It remains a translational model from rest with a force parallel to the surface; rotation, ropes/pulleys, air resistance and changing contact are outside its scope. Circular motion and orbits launches from a fixed, uniform, spherical Earth with no air, Moon or rotation; the launch is always horizontal and the path is the exact Newtonian conic. The projectile launcher remains a focused kinematics and force-of-gravity application.
- **Module 4:** Length Contraction Lab complements the moving-clocks lesson by making the operational definition of length explicit: record both endpoint positions simultaneously in the measuring frame. It distinguishes proper length from the contracted measured length and from optical appearance. The model is one-dimensional, inertial and idealized; it does not simulate acceleration or light propagation to a camera.
- **Module 5:** The clock-rate and geodesic lessons use the Schwarzschild exterior of a static, spherical, non-rotating mass. The geodesic lab is a test-particle, equatorial, timelike-orbit model; it does not solve the Einstein field equations, include spin or radiation reaction, or cover general spacetime solutions.
- **Module 6:** The evolving-space lesson is a controlled FLRW/Friedmann model laboratory. It does not constitute a complete observational or early-universe cosmology course. The behaviour as the scale factor approaches zero is a model boundary, not a complete explanation of the beginning of the universe.

## Prioritized roadmap

Priorities are based on educational value, curriculum coherence, scientific prerequisites, and how much each item improves the existing learning journey. Horizons describe sequence, not calendar dates. Physica's thread is space, time and motion (see the [product vision](PRODUCT_VISION.md)); work that strengthens that thread comes before new threads.

### Delivered

What has been built, and what had to be reworked on the way, is recorded in the [changelog](../../CHANGELOG.md). This roadmap lists only what comes next; the [outcome map](OUTCOME_MAP.md) shows which learning outcomes the current experiments cover.

### How we will know the learning path works

The path collects no data, so evidence comes from facilitated sessions, alongside the assessment pilot:

1. **Navigation.** In a session, learners who start from the path can say which experiment comes next and why, without help. Record how many needed help.
2. **Unlocking.** Facilitators note whether learners reach the explanation of at least one prediction per step before attempting practice. If many get stuck, the step's prerequisite text or the experiment's first prediction needs work.
3. **Transfer.** Compare pilot transfer scores for groups that used the path before the post-check with groups that did not. Treat the comparison as descriptive: groups differ in more than the path.

Once cohorts exist, revisit the path's design after the first two. Until then, path changes follow the build-first approach below.

### Now — build first, measure later

We are deliberately building ahead of evidence. Earlier versions of this roadmap said to run the assessment pilot before adding anything; in practice we kept building, and the roadmap should say what actually guides the work. Physica is young, no classroom is available yet, and a complete, coherent thread is easier to evaluate than a partial one.

This choice has a cost. Until a pilot runs, nothing here is known to improve understanding, and anything built now may have to change or go once results arrive. So building first comes with conditions:

1. **Build only on the thread.** New work closes a gap in space, time and motion and passes the decision rules below. Nothing from "Later" until the thread has been measured.
2. **Keep everything measurable.** Every new experiment ships with predictions that unlock only after the decisive run, practice at every level, and a lesson outline, so it can enter a pilot without rework.
3. **Keep the pilot ready, not running.** The [assessment pilot](ASSESSMENT_PILOT_PLAN.md) (Force Lab and length contraction) stays maintained, so the first cohort can run as soon as a teacher can host a session.
4. **Claim nothing we have not measured.** Product documents describe what exists and what it is designed to do, never that it works. Practice results are not evidence of learning.

**When measuring starts:** at the first chance to run one session with real learners, and in any case before starting a new thread. Then follow the pilot plan and the section above on knowing whether the path works, and let the results reorder "Next".

### Next — close gaps on the thread

Choose using the decision rules below, and the pilot's results once they exist. Candidates, each tied to an outcome in the vision:

1. **Modules 1–2: consolidation.** Add only spatial-geometry or clock-measurement lessons that solve observed learning gaps; do not add experiments merely to equalise module sizes.

### Later — new threads, selectively

Potential directions, only after the space, time and motion thread has demonstrated learning value: waves and oscillations beyond the pendulum, optics, electromagnetism, thermodynamics and statistical physics, quantum physics. These are options, not commitments. Each would be a new thread and should be evaluated against learner needs, prerequisite structure, scientific validation cost and the phenomenon-first method.

## Roadmap decision rules

Before approving a new experiment, answer:

1. Which specific learning outcome does it support?
2. What misconception or unanswered learner question does it address?
3. What will the learner predict, vary, observe, and explain?
4. What assumptions and limits must be made explicit?
5. How will we tell whether learners understood it, including on a new example?
6. Does it improve the sequence, or merely add another simulation?

Prefer improving an existing experiment or filling a prerequisite gap over adding a visually impressive but disconnected topic. Do not set delivery dates or numeric adoption targets until usage and learning baselines exist.
