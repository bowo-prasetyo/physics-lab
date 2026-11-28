# Outcome map: outcomes → experiments → assessment

**Status: draft for the product owner's review.** The statuses below are a first judgement against the rules in this document. They are not results from learners.

This map links each learning outcome in [the product vision](PRODUCT_VISION.md) to the experiment predictions that let learners test it, and to the [assessment pilot](ASSESSMENT_PILOT_PLAN.md) items that assess it. It answers a different question from the catalogue's coverage list in `src/modules.ts`, which records *topics*. An outcome is something a learner should be able to *do*, and a topic can be covered while an outcome that uses it is not.

`src/outcome-map.test.ts` reads this file. It checks that every outcome in the vision has a row with the same text, that every prediction and pilot item named here exists, and that the list of predictions not tied to any outcome (at the end) is complete and current.

## How to read the statuses

- **covered**: at least one prediction makes the learner commit to the outcome's key claim and then see the evidence in a run.
- **partial**: predictions test part of the outcome. *Gap* says which part is shown only in readouts, maths or Meaning text, or is not in the model.
- **planned**: no prediction tests the outcome yet.

A covered outcome is not a learned one. Only the pilot items can say anything about learning, and today they assess five outcomes in two modules (3.1–3.3, 4.2 and 4.3).

Predictions are written as `path#id`: the experiment's catalogue path and the prediction's id in its `predictions.ts`. Pilot items are written as `pilot:id`, from `src/assessment/pilot.ts`.

## Summary

- **Most outcomes are covered.** Where they are only partial, the evidence usually exists on the page (a readout, a table, the maths section) but no prediction asks the learner to commit to it first. Adding a prediction is usually cheaper than adding an experiment.
- **The pilot assesses only Modules 3 and 4.** Modules 1, 2, 5 and 6 have no assessment item. The pilot's Force Lab items on F = ma (3.1, 3.2) are tested by predictions in *Force, mass and acceleration*, not in Force Lab itself.
- **Outcome 5.6 is planned.** It asks learners to tell a demonstrated clock-rate effect from a broader claim about the nature of gravity, and no prediction tests that.
- **Several experiments test things the vision promises no outcome for.** See the last section. Momentum and collisions, the Geodesic Motion Lab, friction and the equivalence principle are all covered topics in the catalogue, but the vision's outcome lists don't mention them. The fix belongs in the vision, which needs the product owner's sign-off.

## Map

### Module 1 — Understanding space

| # | Outcome | Experiment predictions | Pilot items | Status | Gap |
|---|---|---|---|---|---|
| 1.1 | Describe an object's position relative to a stated origin and coordinate system. | `/space/space-vs-time#rest` `/space/displacement-3d#shift` | — | covered | — |
| 1.2 | Distinguish distance travelled (path length) from displacement (change in position). | `/space/displacement-3d#round-trip` `/space/displacement-3d#triangle` `/space/space-vs-time#reverse` | — | covered | — |
| 1.3 | Represent position and displacement using components in one, two, or three dimensions. | `/space/displacement-3d#diagonal` `/space/displacement-3d#rotation` | — | covered | Components are read in 3D; no prediction is set in 1D or 2D components on their own. |
| 1.4 | Explain how a change of coordinate origin or orientation changes coordinate descriptions without changing the underlying geometric displacement. | `/space/displacement-3d#shift` `/space/displacement-3d#rotation` | — | covered | — |
| 1.5 | Use diagrams, vectors, and the Pythagorean relationship or dot product, at an appropriate level, to reason about spatial measurements. | `/space/displacement-3d#diagonal` | — | partial | The Pythagorean length is tested; the dot product appears only in the Advanced maths, with no prediction. |

### Module 2 — Understanding time

| # | Outcome | Experiment predictions | Pilot items | Status | Gap |
|---|---|---|---|---|---|
| 2.1 | Explain how a clock measures time through a repeatable physical process. | `/time/pendulum#time-itself` | — | covered | — |
| 2.2 | Define and measure the period and frequency of periodic motion, and relate them mathematically. | `/time/pendulum#length` | — | partial | Period is measured and predicted; frequency and f = 1/T are not the subject of any prediction. |
| 2.3 | Describe how a pendulum's period depends on its length and release amplitude within the model's stated assumptions. | `/time/pendulum#length` `/time/pendulum#mass` `/time/pendulum#amplitude` | — | covered | — |
| 2.4 | Compare idealised and more realistic pendulum behaviour, identifying when the small-angle approximation is appropriate. | `/time/pendulum#amplitude` | — | partial | Small-angle against exact period is tested; other departures from the ideal (damping, a real rod) are outside the model. |
| 2.5 | Explain why a clock calibrated in one environment may not keep the same rate in another, and recognise that clock behaviour must be understood through the physical processes involved. | `/time/pendulum#moon` `/time/pendulum#time-itself` | — | covered | — |

### Module 3 — Understanding motion

| # | Outcome | Experiment predictions | Pilot items | Status | Gap |
|---|---|---|---|---|---|
| 3.1 | State Newton's second law and calculate acceleration from a specified net force and mass. | `/mechanics/newtonian#mass` `/mechanics/newtonian#force` `/mechanics/newtonian#ratio` | `pilot:force-pre-2` `pilot:force-post-2` | covered | — |
| 3.2 | Explain how acceleration changes when net force or mass changes while the other quantity is held fixed. | `/mechanics/newtonian#mass` `/mechanics/newtonian#force` | `pilot:force-pre-2` `pilot:force-post-2` `pilot:force-transfer` | covered | The pilot assesses this with Force Lab, but the predictions that test it are in Force, mass and acceleration. |
| 3.3 | Draw and interpret free-body diagrams for objects subject to multiple forces. | `/mechanics/force-lab#held` `/mechanics/force-lab#incline-normal` | `pilot:force-pre-1` `pilot:force-post-1` | covered | — |
| 3.4 | Resolve projectile motion into horizontal and vertical components and explain the independence of those components in the ideal no-drag model. | `/mechanics/projectile#drop` | — | covered | — |
| 3.5 | Explain how launch speed, launch angle, launch height, and gravitational acceleration affect a projectile's trajectory. | `/mechanics/projectile#best-angle` `/mechanics/projectile#moon` | — | partial | Angle and gravitational acceleration are tested; launch speed and launch height have no prediction. |
| 3.6 | Compare descriptions of the same motion from different Galilean reference frames. | `/mechanics/projectile#train` `/space/space-vs-time#moving-observer` | — | covered | — |
| 3.7 | Distinguish ideal projectile motion from motion with air resistance, and interpret the associated changes in energy and trajectory. | `/mechanics/projectile#drag-angle` | — | partial | The change in trajectory is tested; the energy lost to drag is shown but not predicted. |
| 3.8 | Explain why motion in a circle at constant speed needs a net force towards the centre, F = mv²/r, and identify gravity as that force for an orbit. | `/mechanics/circular-orbits#direction` | — | covered | — |
| 3.9 | Use the circular-orbit speed and T² ∝ r³ to compare orbits, and explain how the launch speed decides between circular, elliptical and escape paths. | `/mechanics/circular-orbits#kepler` `/mechanics/circular-orbits#faster` `/mechanics/circular-orbits#escape` | — | covered | — |
| 3.10 | Calculate work from a constant force and displacement, including negative work by friction. | `/mechanics/force-lab#friction-work` | — | covered | — |
| 3.11 | Apply the work–energy theorem to determine changes in kinetic energy, and distinguish energy transfer from energy conservation. | `/mechanics/force-lab#friction-work` `/mechanics/circular-orbits#energy` | — | partial | Net work equals ΔK is shown in every Force Lab trial, but no prediction asks for ΔK from the net work. |
| 3.12 | Calculate kinetic and gravitational potential energy in near-surface and Newtonian orbital settings, stating the chosen zero of potential energy. | `/mechanics/circular-orbits#energy` | — | partial | Orbital kinetic and potential energy are tested; near-surface potential energy mgh has no prediction. |

### Module 4 — Special relativity

| # | Outcome | Experiment predictions | Pilot items | Status | Gap |
|---|---|---|---|---|---|
| 4.1 | Explain why Galilean transformations do not preserve the measured speed of light and why a relativistic description is required. | `/relativity/two-perspectives#headlight` `/relativity/two-perspectives#everyday` | — | covered | — |
| 4.2 | Apply the Lorentz factor and Lorentz transformations to simple comparisons between inertial observers. | `/relativity/moving-clocks#dilation` `/relativity/length-contraction#moving` `/relativity/length-contraction#rest` `/relativity/length-contraction#doubling` `/relativity/two-perspectives#probe` | `pilot:length-pre-1` `pilot:length-post-1` `pilot:length-transfer` | covered | — |
| 4.3 | Explain time dilation and relativity of simultaneity, including why reciprocal time-dilation descriptions do not by themselves create a contradiction. | `/relativity/moving-clocks#own-clock` `/relativity/moving-clocks#reciprocal` `/relativity/two-perspectives#simultaneity` `/relativity/length-contraction#simultaneity` | `pilot:length-pre-2` `pilot:length-post-2` | covered | — |
| 4.4 | Interpret events, worldlines, and simultaneity lines on a spacetime diagram. | `/relativity/moving-clocks#dilation` `/relativity/moving-clocks#reciprocal` | — | covered | — |
| 4.5 | Use the invariant spacetime interval to distinguish observer-dependent coordinate descriptions from invariant relationships. | `/relativity/moving-clocks#invariant` | — | covered | — |
| 4.6 | Compare Galilean, Lorentzian space-and-time, and spacetime descriptions, and identify which predictions agree with experiment. | `/relativity/two-perspectives#equivalence` `/relativity/two-perspectives#everyday` | — | covered | — |

### Module 5 — General relativity

| # | Outcome | Experiment predictions | Pilot items | Status | Gap |
|---|---|---|---|---|---|
| 5.1 | Explain, within the stated static and spherically symmetric setting, how gravitational potential affects the rate of clocks at different heights. | `/gravity/clock-rates#mountain` | — | covered | — |
| 5.2 | Compare gravitational and kinematic contributions to clock-rate differences in a practical system such as GPS. | `/gravity/clock-rates#gps` `/gravity/clock-rates#uncorrected` | — | covered | — |
| 5.3 | Interpret the Schwarzschild exterior solution and identify the assumptions under which it applies. | `/gravity/clock-rates#horizon` | — | partial | Learners use the Schwarzschild exterior, and its assumptions are stated under Meaning, but no prediction asks when it applies. |
| 5.4 | Distinguish coordinate radial separation from proper ruler distance in curved spatial geometry. | `/gravity/clock-rates#ruler` | — | covered | — |
| 5.5 | Explain what a gravitational time-dilation model predicts near a Schwarzschild horizon, while recognising the limits of the chosen coordinates and idealisations. | `/gravity/clock-rates#horizon` `/gravity/clock-rates#agree` | — | covered | — |
| 5.6 | Identify the difference between a demonstrated clock-rate effect and a broader claim about the nature of gravity or spacetime. | — | — | planned | Meaning sections separate the measured effect from interpretation, but no prediction or pilot item tests it. |

### Module 6 — Cosmology

| # | Outcome | Experiment predictions | Pilot items | Status | Gap |
|---|---|---|---|---|---|
| 6.1 | Explain the cosmological scale factor as a description of how distances between comoving locations evolve in a homogeneous expanding-universe model. | `/cosmology/evolving-space#centre` `/cosmology/evolving-space#bound` | — | covered | — |
| 6.2 | Relate the scale factor to redshift and describe the observational meaning of cosmological redshift. | `/cosmology/evolving-space#faster` | — | partial | Redshift appears in readouts; no prediction asks how 1 + z relates to the scale factor. |
| 6.3 | Interpret the Hubble rate and distinguish expansion of space from ordinary motion through static space. | `/cosmology/evolving-space#centre` `/cosmology/evolving-space#faster` `/cosmology/evolving-space#hubble-diagram` `/cosmology/evolving-space#estimate` | — | covered | — |
| 6.4 | Compare the qualitative evolution of simple matter-, radiation-, and dark-energy-dominated cosmological models. | `/cosmology/evolving-space#age` | — | partial | The age prediction depends on the contents, but no prediction compares matter-, radiation- and dark-energy-dominated histories. |
| 6.5 | Explain how the contents of a model universe affect whether expansion accelerates or decelerates. | `/cosmology/evolving-space#acceleration` | — | covered | — |
| 6.6 | Identify where a classical cosmological model ceases to provide a reliable description, and avoid treating a mathematical boundary as a complete physical account of the earliest universe. | `/cosmology/evolving-space#breakdown` | — | covered | — |
## Predictions not tied to any outcome

These predictions test something real, but no outcome in the vision asks for it. Each line suggests an outcome the product owner could add. None has been added: the vision's outcomes are a product decision.

| Prediction | What it tests | Suggested outcome |
|---|---|---|
| `/space/space-vs-time#double` | Velocity as the slope of a position–time graph | Module 1: read velocity as the slope of a position–time graph |
| `/mechanics/newtonian#time-squared` | Displacement from rest grows as t² under a constant net force | Module 3: use v = at and Δx = ½at² for motion from rest under a constant net force |
| `/mechanics/force-lab#breakaway` | Kinetic friction once sliding starts | Module 3: distinguish static friction, which adjusts up to μsN, from kinetic friction μkN |
| `/mechanics/force-lab#mass-independence` | The sliding angle on an incline does not depend on mass | (as above) |
| `/mechanics/momentum-collisions#swap` | Elastic collision of equal masses | Module 3: use momentum conservation in one-dimensional collisions, and distinguish elastic from inelastic collisions by kinetic energy |
| `/mechanics/momentum-collisions#stick` | Perfectly inelastic collision | (as above) |
| `/mechanics/momentum-collisions#conserved` | What a partly elastic collision conserves | (as above) |
| `/mechanics/momentum-collisions#heavy-light` | Heavy cart striking a light one | (as above) |
| `/relativity/two-perspectives#momentum` | Relativistic momentum p = γmv | Module 4: explain why relativistic momentum grows without limit as v approaches c |
| `/gravity/geodesic-motion#perturbed` | A near-circular free-fall orbit precesses | Module 5: describe free fall as motion along a timelike geodesic, and compare it with the Newtonian orbit |
| `/gravity/geodesic-motion#circular` | A circular geodesic orbit | (as above) |
| `/gravity/geodesic-motion#distance` | Precession falls off with distance | Module 5: explain periapsis precession and recover the Newtonian limit far from the mass |
| `/gravity/geodesic-motion#mercury` | Mercury's precession from 3π rₛ/r | (as above) |
| `/gravity/geodesic-motion#accelerometer` | Free fall reads zero; hovering does not | Module 5: state the equivalence principle and its local limit |

## Keeping the map current

- When you add or remove a prediction, either name it in a row or add it to the list above. The test fails until you do one or the other.
- When an outcome changes in the vision, change its row here in the same pull request.
- When pilot items are added, name them against the outcome they assess.
- After a pilot cohort, record the decision in the pilot plan's results template, not here. This map says what the product offers, not what learners learned.
