# Assessment pilot plan

## Why run it now

Physica has thirteen experiments and no evidence yet about whether any of them improves understanding. The roadmap's next step is to collect that evidence before choosing the next experiment. This plan describes how to run the first cohorts with the in-app pilot (`/assessment-pilot`) and how to turn the results into decisions.

It is a small, descriptive pilot. It can show whether learners' answers and explanations improve after an experiment, and where they get stuck. It cannot show that Physica *causes* the improvement: there is no control group, and the delayed check is not matched to individuals. See [Learning effectiveness metrics](LEARNING_EFFECTIVENESS.md) for the measurement framework and privacy principles.

## What is measured

Two experiments, chosen to contrast an introductory and an advanced topic:

| Experiment | Module | Pre-check | Post-check | Transfer | Explanation |
|---|---|---|---|---|---|
| Force Lab | 3 · Understanding motion | 2 questions (static friction; F = ma) | 2 parallel questions | 1 changed-context question | Facilitator scores a short written explanation 0–3 |
| Length contraction | 4 · Special relativity | 2 questions (measured length; simultaneous endpoints) | 2 parallel questions | 1 changed-context question | As above |

Answer options appear in a different order for each participant. Only aggregate totals leave the page, as a CSV.

## Before the session

- [ ] Confirm that the setting allows a voluntary, anonymous classroom activity of this kind (school, guardian or research-ethics approval where required). The in-app acknowledgement does not replace that approval.
- [ ] Choose one experiment and a level that matches the learners' preparation: Beginner for Force Lab with most high-school classes; Intermediate or Advanced for length contraction.
- [ ] Open the experiment and the teacher guide's lesson outline for it, and check that both work on the classroom devices and display.
- [ ] Decide on device logistics (below), and keep one notes sheet with: date, setting (type of school or course; no names), level used, number of learners invited, number who completed, timings, and anything that went differently from the plan.

### Device logistics

The cohort summary lives only in the browser tab where results are entered; a reload clears it. Two ways to run a class:

1. **One facilitator device (simplest).** Learners explore the experiment on their own devices; each learner answers the pre- and post-check on the facilitator's device in turn, and the facilitator scores the explanation there. Export the CSV once, at the end.
2. **Several devices.** Each device runs its own cohort and exports its own CSV at the end. Combine them by adding `participants`, `transfer_correct` and the `rubric_*` counts, and by weighting the means by `participants`: combined mean = Σ(mean × participants) / Σ participants.

Export before closing or reloading any tab.

## Running a session (about 50 minutes)

| Time | Step |
|---|---|
| 0–5 min | Explain the purpose: an improvement activity, not a test or a grade. Participation is optional; no names. Each participant ticks the acknowledgement themselves. |
| 5–10 min | **Pre-check.** "Immediate assessment", two questions, without the experiment open. |
| 10–35 min | **Experiment.** Follow the teacher guide's lesson outline: predict on the cards, run the experiment, discuss. Learners should reach the explanations of at least the Beginner questions. |
| 35–45 min | **Post-check and transfer.** Three questions, then a written explanation (two or three sentences) in answer to the on-screen prompt. |
| 45–50 min | Facilitator scores each explanation with the rubric (below), adds the result, and finally exports the CSV. |

Score the explanation from what is written, not from what the learner said aloud. The text is discarded once the score is added.

### Explanation rubric

| Score | Meaning | Force Lab example | Length contraction example |
|---|---|---|---|
| 0 | No relevant explanation, or one that contradicts the result | "Heavy things are slower." | "It looks smaller because it is far away." |
| 1 | Describes what happened, without the physical relationship | "The loaded trolley speeds up less." | "The moving ship is measured shorter." |
| 2 | Names the relationship, but misses a condition or the link to evidence | "a = F/m, so more mass means less acceleration." | "L = L₀/γ, so it is shorter when it moves." |
| 3 | Connects observation, model and conditions | "With the same net force, a = F/m: doubling the mass halves the acceleration. We saw this when we kept the force fixed." | "Earth records both ends at the same Earth time; the ship disagrees about which events are simultaneous, so Earth measures L₀/γ. The ship itself is unchanged." |

Reward the reasoning, not the vocabulary or the length.

### Delayed check (optional)

One to two weeks later, run "Optional delayed check" with whoever is present. It repeats the post-check and transfer questions without the pre-check. These learners are **not** matched to the first session: report the delayed results as a separate, unmatched sample and record the delay in your notes.

## Reading the results

From the CSV (or the on-screen summary), per experiment:

- **Absolute gain** = mean post-check − mean pre-check (both out of 2).
- **Transfer rate** = `mean_transfer_rate`.
- **Explanation distribution** = the `rubric_0` … `rubric_3` counts.

Report the number of participants with every figure. With fewer than about 15 participants, treat the numbers as a description of that group, not a population estimate. Do not report normalised gain for a group whose pre-check mean is already close to 2.

## Turning results into decisions

| What you see | Likely meaning | What to change first |
|---|---|---|
| Post-check gain, but transfer below about 50 % | Learners recognise the parallel question but cannot apply the idea | Add a changed-context question to the experiment's prediction cards; strengthen the Meaning section |
| Little or no gain, and many explanations scored 0–1 | The experiment does not make the evidence visible, or the explanation does not land | Watch learners use the experiment; check that the decisive run is easy to find; revise the hints and explanation |
| High pre-check scores (most learners at 2/2) | The questions are too easy for this group, or the topic was already taught | Use a deeper level, or revise the items before drawing conclusions |
| Gain and transfer hold in the delayed check | Some learning appears to persist | Keep the experiment; extend the pilot to a module without an assessment yet |
| Results differ sharply between levels or languages | The level or the translation may be the obstacle | Review the level's maths section or the translation with a fluent physics teacher |

Record each decision and its reason next to the results, for example as an issue in the repository.

## Results template

Copy this table for each cohort.

| Field | Value |
|---|---|
| Experiment | |
| Date and setting (no names) | |
| Level used | |
| Learners invited / completed | |
| Mean pre-check (out of 2) | |
| Mean post-check (out of 2) | |
| Absolute gain | |
| Transfer rate | |
| Rubric 0 / 1 / 2 / 3 | |
| Delayed check: participants, delay, mean post, transfer rate | |
| Deviations from the plan | |
| Decision and reason | |

## After the first cohorts

Once both experiments have at least one cohort's results and a recorded decision, extend the item bank to one experiment per module, starting where the decisions point. Any wider data collection (accounts, matched delayed checks, remote analytics) needs its own purpose, consent, retention and deletion design first; see [Learning effectiveness metrics](LEARNING_EFFECTIVENESS.md).
