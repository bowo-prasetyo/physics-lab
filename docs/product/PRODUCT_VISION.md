# Product vision, principles, audiences and learning outcomes

## Product vision

**Physica helps learners understand the physical universe by letting them investigate phenomena, test predictions, connect observations to mathematics, and reason carefully about what the evidence does—and does not—establish.**

We want learners to move beyond memorising equations. They should be able to ask a physical question, make a prediction, design or run a simple investigation, interpret what happens, and use mathematical models to explain the result.

Physica is an interactive learning environment, not a general-purpose simulator and not a digital textbook with animations. Its defining experience is a guided cycle of inquiry:

1. **Phenomenon** — encounter a concrete physical situation.
2. **Predict** — commit to an expectation before seeing the explanation.
3. **Experiment** — vary meaningful parameters and observe the consequences.
4. **Mathematics** — describe and explain the observation at an appropriate level.
5. **Meaning** — distinguish the established physical result from assumptions, limitations, and interpretation.

The long-term ambition is to make this way of learning available across the fundamental ideas of physics, while maintaining scientific care and a coherent progression from intuitive reasoning to mathematical depth.

## What Physica is about: space, time and motion

Physica follows one thread: **space, time and motion**. It starts from where things are, how time is measured and how motion changes, and follows those same questions into relativity, curved spacetime and the expanding universe, where the everyday picture has to be revised.

| Modules | Role in the thread |
|---|---|
| 1 · Understanding space | Where things are; which descriptions depend on the chosen coordinates and which do not |
| 2 · Understanding time | How time is measured; every clock is a physical process |
| 3 · Understanding motion | How motion changes and why: forces, momentum and reference frames. This is the Newtonian picture that relativity later revises |
| 4 · Special relativity | Time and length measurements depend on the observer; space and time combine into spacetime |
| 5 · General relativity | Gravity as spacetime geometry: clock rates and free-fall paths |
| 6 · Cosmology | Space and time on the largest scale, and where the models stop |

Consequences for product decisions:

- **Mechanics serves the thread.** Module 3 is not a general mechanics course. Its experiments are chosen because relativity later revisits their ideas: net force and acceleration, momentum conservation (later tied to the symmetry of space), Galilean frames and orbits.
- **Breadth beyond the thread is deliberate.** Waves, electromagnetism, thermodynamics and quantum physics (roadmap P3) would be new threads, not more of this one. Add them only after the current thread has demonstrated learning value.
- **One learning path, built from the catalogue.** The learning path (`/learning`) walks the thread chapter by chapter: its chapters are the modules and its steps are the experiments, in catalogue order. It adds only what the catalogue does not have: why each step matters, what to know first, and practice. It never introduces a second structure, numbering or set of titles. It is the product's front door: the home page has one call to action, *Start the learning path*, and the catalogue below it is for browsing.
- **Practice follows the method.** A step's practice unlocks only after the learner has tested a prediction in that experiment, and it asks learners to transfer the idea to a new situation rather than recall it. Practice has four types, in this order:
  - *Concept questions* (multiple choice). Every experiment has at least one at Beginner. Harder ones are fewer: every module has at least one at Intermediate or Advanced.
  - *Graph questions* (multiple choice, answered by reading a graph). A step can attach a graph, followed by questions whose answers must be read from it. The graph is either a position–time run, drawn with the experiments' own graph component, or a model curve such as a(F), y(t) or T(L) computed by the physics engine, on scales that start at zero with readable values. A graph never shows anything the model would not produce. Graph questions are ordinary practice questions with a graph, so they share the concept questions' shuffled options, hints, explanations and levels, and any step can have them by adding data, not code. Today *Space versus time*, *Force Lab*, the *Projectile launcher* and *Pendulum clocks* have one each.
  - *Synthesis questions* (multiple choice, combining two experiments). A question can require other experiments as well as its own. It sits on the step of the later experiment, names the others from the catalogue, appears once that step is explored and unlocks when the others have been explored too. Combining two models is never a first step, so these are always Intermediate or Advanced. Today there are three: Force Lab with the Projectile launcher; Force, mass and acceleration with Momentum and collisions; and Different clocks with Gravity and clock rates.
  - *Apply it* (numerical problems with hints and worked solutions). Every experiment has a Beginner problem, and every module has at least one Intermediate and one Advanced problem. Answers within 2% count as correct, so learners are not penalised for sensible rounding. A wrong answer gets feedback on the likely slip (a reversed sign, a power of ten with the factor and the unit named, rounding, or the model), using the same number parser and tolerance as the marking.

  **Practice budget.** Counting all types together, every step has at least 2 items at Beginner and between 3 and 7 at Advanced. The minimum means no step is left thin; the maximum stops a few steps growing far beyond the rest. New practice goes first to steps near the minimum, and any larger rebalancing waits for evidence from the assessment pilot. Wrong options must be real misconceptions, not fillers: when no credible fourth option exists, a question has three.

  Levels add practice; they never hide a topic. There is no separate, formula-first problem area: calculation is practised on the model the learner has just tested. Progress is session-only by default and is never sent anywhere (see the privacy decision below). `learning-content.test.ts` and `problem-bank.test.ts` check these coverage rules.
- **Review, not exams.** At the end of each chapter, once its last step is explored, a *chapter review* mixes questions from the steps already explored. It keeps no score and shows every explanation: practice, not assessment. Scored assessment happens only in the assessment pilot.
- **Learning aids never give answers away.** Graph-reading prompts and problem workspaces guide how to read or reason; they never show values derived from a question's answer.
- **Progress stays with the learner (ratified decision).** Progress is session-only by default. A learner may opt in to remembering which experiments they have explored in this browser on this device; nothing is ever sent to Physica, a teacher or anyone else. Two safeguards are part of the decision: a visible *Forget progress on this device* control whenever remembering is on, and a note that on a shared or school device the next person will see the progress. There are still no accounts, rosters or analytics; anything beyond device-local memory needs its own privacy and safeguarding design.
- **No letters on experiments.** Experiments are named, not lettered; cross-references use the experiment's name.
- **Levels are mathematical depth, not audiences.** The product does not label levels or modules with school years or degree stages; where a topic needs prerequisites, it states them.

## Product principles

These principles guide product, curriculum, content, design, and engineering decisions.

### 1. Phenomena before formalism

Begin with something learners can investigate. Introduce equations when they help explain, quantify, or generalise what has been observed—not as a barrier learners must cross before engaging with the phenomenon.

### 2. Prediction before explanation

Ask learners to make a meaningful prediction before revealing the relevant explanation. Feedback should help them compare their expectation with evidence and revise their mental model. A correct guess alone is not evidence of understanding.

### 3. Experimentation must change understanding

Controls should expose meaningful physical relationships, not merely decorate a scene. Every important interaction should help answer a question, test a prediction, compare cases, or reveal a model's limits.

### 4. One phenomenon, increasing mathematical depth

Beginner, Intermediate, and Advanced levels should investigate the same underlying physical phenomenon. The mathematical language and depth may increase—from qualitative reasoning, algebra, graphs and tables to calculus, vectors, transformations and more formal models—but the underlying physics must remain consistent.

### 5. Make the model and its assumptions visible

State important idealisations, approximations, coordinate choices, domains of validity, and omitted effects. Do not present a model result as a universal statement when it depends on specific conditions.

### 6. Separate evidence, theory, and interpretation

Clearly distinguish:
- what an experiment or observation establishes;
- what a physical theory or mathematical model predicts;
- what remains an interpretation, philosophical question, or open problem.

Do not imply that a philosophical interpretation is experimentally settled, or that a model is invalid merely because its interpretation is debated.

### 7. Scientific correctness is a product requirement

Equations, units, numerical methods, visualisations, labels, and explanations must agree. Prefer exact solutions where available; validate numerical methods against analytical cases and document known limitations. Simplicity must not come at the cost of teaching a false idea.

### 8. Accessibility without concealing the physics

Use clear language, progressive disclosure, readable diagrams, and worked examples. Reduce unnecessary cognitive load while retaining the physical relationships learners need to understand. Mathematical depth should be approachable, not artificially removed.

### 9. The physics model is independent of its presentation

Keep the physics engine independent of UI frameworks, browser APIs, and rendering. This makes the science testable, reusable, and less likely to become entangled with a particular visualisation.

### 10. Build a coherent learning journey, not a feature collection

New experiments should strengthen a module, connect ideas across modules, or address a demonstrated learning need. Do not add simulations solely because a phenomenon is visually impressive or technically interesting.

## Target audiences

### Primary audience: high-school learners

Learners encountering core physics ideas and developing confidence with physical reasoning, algebra, graphs, and basic mathematical models.

Their needs:
- concrete phenomena before abstract equations;
- clear prompts and feedback that encourage prediction;
- intuitive controls and visual explanations;
- a gradual path from qualitative reasoning to quantitative understanding;
- explicit explanations of unfamiliar concepts and assumptions.

The Beginner level is the default entry point for this audience, but it is not an age restriction or a substitute for a learner's actual preparation.

### Secondary audience: undergraduate physics learners

Learners who want to deepen conceptual understanding, connect mathematical formalisms to physical meaning, and compare models or reference frames.

Their needs:
- quantitative experiments with adjustable parameters;
- calculus, vectors, coordinate transformations, and appropriate formalism;
- worked derivations and numerical results tied to the current experiment;
- clear treatment of assumptions, approximations, and model validity;
- opportunities to compare alternative descriptions of the same physical situation.

Intermediate and Advanced levels serve this audience, with Advanced intended particularly for learners comfortable with undergraduate physics.

### Supporting audience: teachers and educators

Teachers, tutors, and other educators may use experiments as demonstrations, guided investigations, or discussion prompts. They need clear learning goals, reliable and reproducible setups, and material that can be shared with learners.

The product includes a teacher guide with a lesson outline for every experiment (learning intentions, suggested timings, a classroom sequence, discussion prompts and a check for understanding), and a small, anonymous assessment pilot (see [the pilot plan](ASSESSMENT_PILOT_PLAN.md)). Teachers remain a supporting audience: the product does not yet provide class rosters, student accounts, assignment distribution, grading, or learner-progress dashboards. Those capabilities require separate evidence of need and an explicit privacy and safeguarding model.

### Audience and level are related, not interchangeable

The three mathematical levels describe the depth of treatment, not a strict age, grade, or qualification boundary. Learners should be able to choose a level based on their preparation and goals. Where a topic requires substantial prerequisites, the product should state them rather than relying on the level label alone.

## Learning outcomes by module

The outcomes below describe what a learner should be able to do after completing the relevant module's learning path. They are curriculum-level targets, not a claim that every outcome is already fully covered by the current experiment catalogue. The scope notes identify where current experiments provide a foundation but further lessons are needed.

### Module 1 — Understanding space

After completing this module, learners should be able to:
1. Describe an object's position relative to a stated origin and coordinate system.
2. Distinguish distance travelled (path length) from displacement (change in position).
3. Represent position and displacement using components in one, two, or three dimensions.
4. Explain how a change of coordinate origin or orientation changes coordinate descriptions without changing the underlying geometric displacement.
5. Use diagrams, vectors, and the Pythagorean relationship or dot product, at an appropriate level, to reason about spatial measurements.

**Current foundation:** motion along a track and displacement in 3D, including coordinate-system changes and vector relationships.

### Module 2 — Understanding time

After completing this module, learners should be able to:
1. Explain how a clock measures time through a repeatable physical process.
2. Define and measure the period and frequency of periodic motion, and relate them mathematically.
3. Describe how a pendulum's period depends on its length and release amplitude within the model's stated assumptions.
4. Compare idealised and more realistic pendulum behaviour, identifying when the small-angle approximation is appropriate.
5. Explain why a clock calibrated in one environment may not keep the same rate in another, and recognise that clock behaviour must be understood through the physical processes involved.

**Current foundation:** pendulum dynamics, period measurement, small-angle and exact-period treatments, and comparisons across environments. Relativistic clock-rate effects are developed in Modules 4 and 5.

### Module 3 — Understanding motion

After completing this module, learners should be able to:
1. State Newton's second law and calculate acceleration from a specified net force and mass.
2. Explain how acceleration changes when net force or mass changes while the other quantity is held fixed.
3. Draw and interpret free-body diagrams for objects subject to multiple forces.
4. Resolve projectile motion into horizontal and vertical components and explain the independence of those components in the ideal no-drag model.
5. Explain how launch speed, launch angle, launch height, and gravitational acceleration affect a projectile's trajectory.
6. Compare descriptions of the same motion from different Galilean reference frames.
7. Distinguish ideal projectile motion from motion with air resistance, and interpret the associated changes in energy and trajectory.
8. Explain why motion in a circle at constant speed needs a net force towards the centre, F = mv²/r, and identify gravity as that force for an orbit.
9. Use the circular-orbit speed and T² ∝ r³ to compare orbits, and explain how the launch speed decides between circular, elliptical and escape paths.
10. Calculate work from a constant force and displacement, including negative work by friction.
11. Apply the work–energy theorem to determine changes in kinetic energy, and distinguish energy transfer from energy conservation.
12. Calculate kinetic and gravitational potential energy in near-surface and Newtonian orbital settings, stating the chosen zero of potential energy.

**Current foundation:** Newton's second law (constant net force and mass, one dimension); free-body diagrams with multiple forces, static and kinetic friction and inclined planes (Force Lab); one-dimensional momentum, impulse and elastic/inelastic collisions; projectile motion with Galilean observers and optional quadratic air resistance; uniform circular motion and Newtonian orbits with Kepler's third law, the Newtonian reference for Module 5's geodesics. Work and energy are explored in the experiments: Force Lab shows the work done by each force and the kinetic energy gained in every trial (net work equals ΔK), with a prediction on friction's negative work; Circular motion and orbits shows kinetic and potential energy per kilogram at an orbit's closest and farthest points, with a prediction that the total stays the same. These are focused applications, not a complete survey of energy methods.

### Module 4 — Special relativity

After completing this module, learners should be able to:
1. Explain why Galilean transformations do not preserve the measured speed of light and why a relativistic description is required.
2. Apply the Lorentz factor and Lorentz transformations to simple comparisons between inertial observers.
3. Explain time dilation and relativity of simultaneity, including why reciprocal time-dilation descriptions do not by themselves create a contradiction.
4. Interpret events, worldlines, and simultaneity lines on a spacetime diagram.
5. Use the invariant spacetime interval to distinguish observer-dependent coordinate descriptions from invariant relationships.
6. Compare Galilean, Lorentzian space-and-time, and spacetime descriptions, and identify which predictions agree with experiment.

**Current foundation:** moving-clock comparisons, reference-frame changes, simultaneity, interval invariance, comparison of alternative descriptions, and a dedicated length-contraction measurement lab (proper length, endpoint simultaneity and its ship-frame timing). Velocity addition and relativistic momentum still need dedicated lessons.

### Module 5 — General relativity

After completing this module, learners should be able to:
1. Explain, within the stated static and spherically symmetric setting, how gravitational potential affects the rate of clocks at different heights.
2. Compare gravitational and kinematic contributions to clock-rate differences in a practical system such as GPS.
3. Interpret the Schwarzschild exterior solution and identify the assumptions under which it applies.
4. Distinguish coordinate radial separation from proper ruler distance in curved spatial geometry.
5. Explain what a gravitational time-dilation model predicts near a Schwarzschild horizon, while recognising the limits of the chosen coordinates and idealisations.
6. Identify the difference between a demonstrated clock-rate effect and a broader claim about the nature of gravity or spacetime.

**Current foundation:** Schwarzschild clock rates, light-signal comparisons, spatial ruler distance, horizon behaviour, GPS corrections, and timelike geodesics (free-fall orbits, measured periapsis precession and the Newtonian limit). The field equations and the equivalence-principle bridge to curved spacetime still need dedicated learning experiences.

### Module 6 — Cosmology

After completing this module, learners should be able to:
1. Explain the cosmological scale factor as a description of how distances between comoving locations evolve in a homogeneous expanding-universe model.
2. Relate the scale factor to redshift and describe the observational meaning of cosmological redshift.
3. Interpret the Hubble rate and distinguish expansion of space from ordinary motion through static space.
4. Compare the qualitative evolution of simple matter-, radiation-, and dark-energy-dominated cosmological models.
5. Explain how the contents of a model universe affect whether expansion accelerates or decelerates.
6. Identify where a classical cosmological model ceases to provide a reliable description, and avoid treating a mathematical boundary as a complete physical account of the earliest universe.

**Current foundation:** numerical FLRW/Friedmann evolution, scale factor, redshift, Hubble quantities, model comparisons, acceleration, and stated limits as the scale factor approaches zero. The experiment is an educational model, not a complete treatment of observational cosmology or the quantum-gravity regime.

## Related product documents

- [Curriculum coverage and prioritized roadmap](CURRICULUM_ROADMAP.md) maps outcomes to current experiments and future work.
- [Learning effectiveness metrics](LEARNING_EFFECTIVENESS.md) defines how to evaluate understanding, transfer, and retention.

## How to use these outcomes

- Use outcomes to decide what belongs in a module and what an experiment must help learners understand.
- Design predictions, explanations, worked examples, and end-of-module checks around observable learner actions.
- Label outcomes as **covered**, **partially covered**, or **planned** as the curriculum evolves.
- Do not mark an outcome as covered merely because a topic name appears in a module description.
- Evaluate learning through explanations, transfer to a new case, and the ability to justify a prediction—not interaction counts or a correct guess alone.
- Keep this document focused on stable product direction. Detailed lesson plans, assessment rubrics, and release sequencing belong in separate documents when they become necessary.
