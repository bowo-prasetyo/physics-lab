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
| 3. Understanding motion | Force, mass and acceleration; Force Lab; Momentum and collisions; Projectile launcher; Circular motion and orbits | Newton’s second law; free-body diagrams and vector addition of multiple forces; normal forces and weight components; static-friction limits and kinetic friction on horizontal/inclined surfaces; one-dimensional momentum and impulse; elastic and inelastic collisions; momentum conservation and kinetic-energy change; ideal projectile motion, initial-condition dependence, gravitational acceleration, Galilean observers, optional quadratic drag and energy loss; uniform circular motion and centripetal force; Newtonian gravitation and circular, elliptical and escape orbits; Kepler’s third law | Work and energy beyond the projectile and orbit examples |
| 4. Special relativity | Different clocks, different elapsed times; Space and time versus spacetime; Length contraction | Lorentz transformations, time dilation, proper time, proper length and length contraction, frame-dependent simultaneity, spacetime diagrams, interval invariance, comparison of equivalent relativistic descriptions | Velocity addition and relativistic momentum, deeper experimental evidence connections |
| 5. General relativity | Gravity and clock rates; Geodesic Motion Lab | Schwarzschild exterior clock rates, GPS clock corrections, static spherical geometry, timelike geodesics, free-fall orbits, periapsis precession and the Newtonian limit | Einstein field equations and stress-energy, equivalence-principle bridge, non-Schwarzschild settings |
| 6. Cosmology | Evolving space | Homogeneous/isotropic FLRW models, scale factor, redshift, Hubble expansion, simple matter/radiation/dark-energy histories, acceleration and classical-model limits | Observational parameter inference, distance measures and horizons, inflation/early-universe physics, limits of extrapolation toward the initial singularity |

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

- **Honest coverage.** The home page separates what implemented experiments explore from planned topics. `src/modules.ts` is the single catalogue; the translated catalogues, the teacher guide's lesson coverage and the README are checked against it, so they cannot drift.
- **One learning loop.** Every experiment uses the shared predict–observe–explain cards. Each level adds its own question, each explanation unlocks only after the run that tests it, and results stay hidden until the learner has run the current setup.
- **One page layout.** Every experiment page has the same sections in the same order (header, share, investigation guide, Predict, Experiment, Mathematics, Meaning, next steps), enforced by a test.
- **Experiments:** Module 3 Force Lab, Momentum and collisions, and Circular motion and orbits; Module 4 length contraction; Module 5 geodesic motion. Circular motion and orbits closes a prerequisite gap: the Geodesic Motion Lab compares curved-spacetime paths with Newtonian ellipses that Module 3 now teaches.
- **Teaching support.** A lesson outline for every experiment, in all three languages, and an anonymous assessment pilot with pre/post, transfer and explanation items for Force Lab and length contraction.
- **Identity.** Module 3 renamed "Understanding motion"; experiment letters and audience labels on levels and modules removed.
- **Learning path.** One path through the thread (`/learning`): chapters are the modules, steps are the experiments, both taken from `src/modules.ts`, with prerequisites for every chapter and step. Concept questions (22, at least one per experiment, at least one harder per module) unlock after the learner has tested a prediction in the experiment, and their options are shuffled.
- **Synthesis questions.** Three questions in Modules 3 and 5 combine models from two experiments: force components with projectile motion, impulse with Newton’s second law, and the moving-clock effect with gravitational clock rates. They are practice questions that `require` the other experiment, so they share the practice data, tests and shuffled options; they name experiments from the catalogue and unlock only after both experiments are explored. Their wrong options are real misconceptions (for example, that a horizontal force changes the flight time, or that the two clock effects cancel in every orbit). A first version kept them in a separate store with hand-copied experiment names, which had already drifted from the catalogue.
- **Practice budget.** Every step has at least 2 practice items at Beginner and 3–7 at Advanced, enforced by a test. Length contraction and Force, mass and acceleration were topped up to the minimum.
- **Apply it: numerical problems in the learning path.** The standalone Physics Problem-Solving Lab (`/problem-solving`, now a redirect to `/learning`) was folded into the learning path, because a separate, ungated, formula-first area contradicted *prediction before explanation* and *practice follows the method*. The 28 numerical problems unlock with their step's concept questions; every experiment has a Beginner problem and every module has Intermediate and Advanced ones. Answers within 2% count as correct, and each answer is checked against the physics engine in the tests. Answers remain in page memory only; this is practice, not assessment.
- **One front door.** The home page has a single call to action, *Start the learning path*; the header links to the learning path and the teacher guide only.
- **Graph questions.** A third practice type: questions answered by reading a graph, defined in the learning content so any step can use one. Graphs are position–time runs or model curves computed by the physics engine (a(F) for Force Lab, height against time for the projectile launcher, T(L) for pendulum clocks), on scales that start at zero. *Space versus time* has four questions, from Beginner to Advanced; the other three steps have a Beginner and an Intermediate question each. A first version of the cross-experiment graphs sat outside the steps, was hand-drawn and drew a projectile curve that gravity cannot produce; it was rebuilt on this design.
- **Progressive worked solutions.** Numerical problem solutions now reveal one reasoning step at a time, so learners can pause between model selection, substitution and interpretation instead of seeing the entire worked answer at once. The existing answer checker and numeric diagnosis remain the source of correctness and feedback.
- **House rules and guard tests.** `CLAUDE.md` lists the conventions that changes most often broke. Tests now enforce the main ones: multiple-choice only through the practice data, no hand-drawn graphics in the learning path, no new inline translations (a ratchet over older files), and no English words inside translated accessible labels.
- **Diagnostic feedback on numerical answers.** A wrong answer is told the likely slip: a reversed sign, a power of ten (with the factor and the unit named), rounding (2–5% off) or the model. Marking and feedback share one number parser and one tolerance.
- **Learner experience.** A progress summary across the course; an optional workspace on numerical problems (choose the model, substitute with units, check the result); graph-reading prompts that never show answer values; and an unscored chapter review once a chapter's last step is explored. A first version showed an "average rate" under every graph that answered two of the graph questions and gave a straight-line rate for the curved pendulum graph, and called the review a scored "exam"; both were reworked.
- **Device-local progress (ratified).** Learners may opt in to remembering explored experiments in their own browser, with a visible *Forget progress on this device* control and a shared-device note. Nothing is sent anywhere.
- **Localized page titles.** Every page's browser title follows the selected language: experiments use their catalogue title, other pages a translated message.

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

1. **Module 4: velocity addition and relativistic momentum.** Completes the special-relativity measurement set; connects to Momentum and collisions in Module 3.
2. **Module 5: the equivalence principle.** A careful bridge from free fall to curved spacetime; Circular motion and orbits now provides the Newtonian free-fall picture it starts from.
3. **Module 6: observational connection.** Link model parameters to a few measured cosmological quantities, with uncertainty and model dependence explicit.
4. **Modules 1–2: consolidation.** Add only spatial-geometry or clock-measurement lessons that solve observed learning gaps; do not add experiments merely to equalise module sizes.

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
