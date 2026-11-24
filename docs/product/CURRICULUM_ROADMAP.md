# Curriculum coverage and prioritized roadmap

## Purpose

This document connects the six-module curriculum to the experiments that exist today, makes the gaps explicit, and sets a priority order for future work. It is a direction-setting roadmap, not a release-date commitment.

The product vision and module learning outcomes live in [Product vision, principles, audiences and learning outcomes](PRODUCT_VISION.md). The learner-facing catalogue in `src/modules.ts` is the source for the home-page distinction between current and planned coverage. Classroom lesson outlines are available in the in-app [Teacher guide](#/teachers).

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
| 3. Classical mechanics | Force, mass and acceleration; Force Lab; Projectile launcher | Newton’s second law; free-body diagrams and vector addition of multiple forces; normal forces and weight components; static-friction limits and kinetic friction on horizontal/inclined surfaces; ideal projectile motion, initial-condition dependence, gravitational acceleration, Galilean observers, optional quadratic drag and energy loss | Circular motion, momentum/collisions, work and energy beyond projectile examples, orbital gravitation |
| 4. Special relativity | Different clocks, different elapsed times; Length Contraction Lab; Space and time versus spacetime | Lorentz transformations, time dilation, proper time, proper length and length contraction, frame-dependent simultaneity, spacetime diagrams, interval invariance, comparison of equivalent relativistic descriptions | Velocity addition and relativistic momentum, deeper experimental evidence connections |
| 5. General relativity | Gravity and clock rates | Schwarzschild exterior clock rates, GPS clock corrections, static spherical geometry, proper radial distance, light signals and horizon behaviour | Geodesic/free-fall motion, Einstein field equations and stress-energy, equivalence-principle bridge, non-Schwarzschild settings |
| 6. Cosmology | Evolving space | Homogeneous/isotropic FLRW models, scale factor, redshift, Hubble expansion, simple matter/radiation/dark-energy histories, acceleration and classical-model limits | Observational parameter inference, distance measures and horizons, inflation/early-universe physics, limits of extrapolation toward the initial singularity |

### Scope clarifications

- **Module 1:** The current 3D displacement experiment provides a strong vector and coordinate foundation; it is not a complete course in Euclidean geometry.
- **Module 2:** The pendulum is a useful example of a physical clock, not a survey of clock technologies or precision timekeeping.
- **Module 3:** Force Lab now provides free-body diagrams, multiple force components, static friction up to \(\mu_sN\), and kinetic friction \(\mu_kN\) after breakaway. It remains a translational model from rest with a force parallel to the surface; rotation, ropes/pulleys, air resistance and changing contact are outside its scope. The projectile launcher remains a focused kinematics and force-of-gravity application.
- **Module 4:** Length Contraction Lab complements the moving-clocks lesson by making the operational definition of length explicit: record both endpoint positions simultaneously in the measuring frame. It distinguishes proper length from the contracted measured length and from optical appearance. The model is one-dimensional, inertial and idealized; it does not simulate acceleration or light propagation to a camera.
- **Module 5:** The current lesson uses the Schwarzschild exterior and static clock comparisons. It is not a general introduction to all solutions or the full mathematical structure of general relativity; geodesics are not yet taught.
- **Module 6:** The evolving-space lesson is a controlled FLRW/Friedmann model laboratory. It does not constitute a complete observational or early-universe cosmology course. The behaviour as the scale factor approaches zero is a model boundary, not a complete explanation of the beginning of the universe.

## Prioritized roadmap

Priorities are based on educational value, curriculum coherence, scientific prerequisites, and how much each item improves the existing learning journey. Horizons describe sequence, not calendar dates.

### P1 — Make the existing curriculum honest and measurable (completed foundation)

1. **Keep current and planned coverage distinct.** The home-page catalogue shows what implemented experiments explore and what remains planned.
2. **Align module outcomes with actual experiments.** Do not mark an outcome as covered until an experiment and an assessment task support it.
3. **Establish learning-effectiveness measures.** Pilot short pre/post concept checks, transfer questions, explanation rubrics, and delayed retention checks before selecting numerical targets.
4. **Improve the learning loop before adding breadth.** Review prediction prompts, evidence, hints, explanations, and worked examples for the existing experiments.

**Exit condition:** learners and educators can tell what each module currently teaches, what it does not yet teach, and how learning will be evaluated.

### P1 — Complete the core special-relativity measurement pair (in progress)

1. **Length contraction (delivered in this branch).** Add a prediction-first measurement lab that connects proper length, Lorentz contraction and frame-dependent simultaneity using endpoint events and a spacetime diagram.
2. **Velocity addition and relativistic momentum.** Develop the next dedicated investigations after the measurement pair is established.

**Exit condition:** learners can distinguish proper length from a length measured in a moving frame, explain why endpoint simultaneity matters, and connect the result to the Lorentz transformation.

### P2 — Support teaching and close the highest-value curriculum gaps (in progress)

1. **Teacher-oriented workflows (delivered foundation).** Provide a persistent teacher entry point and practical lesson outlines with learning intentions, timings, facilitation sequences, discussion prompts, and checks for understanding. Reuse shareable experiment setups; do not add class rosters, learner accounts or analytics until a genuine need and privacy model are established.
2. **Module 3: Newtonian foundations (first investigation delivered).** The force-and-acceleration lesson tests proportionality to net force and inverse proportionality to mass under explicit ideal assumptions. **Delivered:** Force Lab adds free-body diagrams, multiple forces, distinct static and kinetic friction coefficients, the breakaway threshold, and force components on horizontal and inclined surfaces. The next useful step is a focused momentum/collisions or work/energy lesson.
3. **Module 4: Length contraction.** Add a dedicated operational measurement experiment, carefully distinguishing object length measured at simultaneous endpoints in a frame from visual appearance.
4. **Module 5: Geodesic motion.** Add free fall/orbits in a clearly stated spacetime geometry, building on the existing Schwarzschild clock-rate lesson. Keep coordinate assumptions and the model's domain visible.
5. **Module 6: Observational connection.** Connect model parameters and expansion history to a small number of measured cosmological quantities, with uncertainty and model dependence made explicit.
6. **Modules 1–2: Consolidation.** Add only the spatial geometry or clock-measurement lessons that solve observed learning gaps; avoid expanding these modules merely to equalise experiment counts.

**Exit condition:** module titles and outcomes are supported by a coherent sequence rather than isolated demonstrations, and teachers can prepare and facilitate lessons without a separate class-management system.

### P3 — Extend the lab selectively

Potential directions, only after the core six modules have demonstrated learning value:

- Waves, oscillations beyond the pendulum, and optics.
- Electromagnetism.
- Thermodynamics and statistical physics.
- Quantum physics.
- Deeper general relativity and cosmology.

These are options, not commitments. Each proposal should be evaluated against learner needs, prerequisite structure, scientific validation cost, and the product's phenomenon-first method.

## Roadmap decision rules

Before approving a new experiment, answer:

1. Which specific learning outcome does it support?
2. What misconception or unanswered learner question does it address?
3. What will the learner predict, vary, observe, and explain?
4. What assumptions and limits must be made explicit?
5. How will we tell whether learners understood it, including on a new example?
6. Does it improve the sequence, or merely add another simulation?

Prefer improving an existing experiment or filling a prerequisite gap over adding a visually impressive but disconnected topic. Do not set delivery dates or numeric adoption targets until usage and learning baselines exist.
