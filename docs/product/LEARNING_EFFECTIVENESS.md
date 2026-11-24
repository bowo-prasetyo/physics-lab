# Learning effectiveness metrics

## Purpose

Physica exists to improve learners' understanding of physics, not simply to maximise time spent interacting with simulations. This document defines a practical measurement framework for testing whether the product's phenomenon → predict → experiment → mathematics → meaning cycle supports learning.

The in-app assessment pilot now provides a deliberately small, voluntary workflow. It is a measurement aid, not evidence that Physica has already improved learning. Establish baselines before setting numerical targets. The [assessment pilot plan](ASSESSMENT_PILOT_PLAN.md) describes how to run the first cohorts and record the results.

## Measurement principles

1. **Measure learning, not clicks.** Interaction and completion data can diagnose the experience, but cannot establish understanding.
2. **Assess transfer.** A learner should be able to use an idea in a changed context, not only repeat the exact experiment.
3. **Use multiple signals.** Combine concept questions, explanations, prediction reasoning, and delayed checks.
4. **Respect different starting points.** Report pre/post change alongside the starting level; avoid comparing learners without accounting for prior knowledge.
5. **Keep assessment aligned with outcomes.** Each question must map to one or more published module outcomes.
6. **Prefer useful evidence over vanity dashboards.** Collect only data that can inform a product or teaching decision.
7. **Protect learners.** Do not collect names, precise location, or unnecessary personal data. Any future telemetry should be transparent, minimised, access-controlled, and subject to appropriate consent and retention rules, especially for minors.

## Pilot implementation

Open **For teachers → Run the learning assessment pilot** (route `/assessment-pilot`). The first pilot covers two contrasting experiments:

- **Force Lab (Module 3):** an introductory mechanics assessment about static friction and the relationship between net force, mass, and acceleration.
- **Length Contraction Lab (Module 4):** a mathematically advanced assessment about proper length, frame-dependent measurement, and simultaneity.

Each immediate session uses two pre-check concept questions, two parallel post-check questions, and one changed-context transfer question. Answer options appear in a different order for each participant, so a fixed answer position cannot score full marks; scoring uses the option, not its position. The facilitator also scores a short learner explanation using the 0–3 rubric below. The delayed option uses the post and transfer items after a delay (suggested: 1–2 weeks); it is explicitly an unmatched follow-up sample, not an individual retention measure.

### Privacy and operating procedure

- Participation is voluntary and requires an explicit acknowledgement. It is not a grade. This acknowledgement does not replace any school, guardian, or research-ethics approval required for the setting.
- Do not ask for or enter names, email addresses, school identifiers, or other personal information.
- Responses and the written explanation exist only in the current page session. No answer-level record is stored in local storage, cookies, a database, or a server.
- The written explanation is used for the facilitator's rubric judgment and is discarded; only the 0–3 score enters the aggregate.
- The page retains cohort totals in memory only. A facilitator can export an aggregate CSV before closing or refreshing the tab. Refreshing clears the in-memory cohort.
- Delayed checks are reported separately and are not linked to immediate participants. Record the elapsed delay in the facilitator's study notes, not in a learner identifier.
- Keep cohort reporting aggregated. For small groups, consider suppressing breakdowns that could identify a learner.

The pilot intentionally does not create learner accounts, persistent identifiers, class rosters, individual progress records, remote analytics, or a teacher dashboard. It also does not verify whether the learner actually completed the experiment; the facilitator should guide the normal prediction → experiment → explanation sequence.

## North-star learning measure

**Transferable learning gain:** the change between a learner's pre-learning and post-learning performance on concept and transfer questions aligned to the module outcomes.

For a short assessment scored from 0 to 1, report:
- pre-assessment score;
- post-assessment score;
- absolute gain (post minus pre);
- normalised gain only where the pre-score is below the maximum and the cohort/sample is appropriate.

Normalised gain may be calculated as:

`g = (post - pre) / (1 - pre)`

Do not use normalised gain alone: it behaves poorly for learners who begin near the maximum and can obscure differences in starting knowledge. Always report sample size, score distribution, and assessment conditions. A matched delayed assessment should be used where feasible to test retention; the current pilot's delayed option is intentionally unmatched.

## Core learning measures

| Measure | What it tells us | How to collect it | Interpretation |
|---|---|---|---|
| Conceptual gain | Whether core concepts improved during a learning sequence | Short aligned pre/post questions with conceptual distractors | Primary learning outcome; compare matched cohorts and report uncertainty |
| Transfer success | Whether learners can apply an idea to a new situation or changed parameters | One or more unseen scenario questions after the experiment | Stronger evidence of understanding than repeating the original task |
| Explanation quality | Whether learners can justify a result using evidence and a suitable model | Score a short written or structured explanation with a 0–3 rubric | Reveals whether learners connect observation, model, and conclusion |
| Prediction reasoning | Whether learners can explain why they expected a result and revise their model after evidence | Capture prediction plus a post-experiment reflection | A changed answer is not automatically learning; assess the quality of reasoning |
| Delayed retention | Whether learning persists beyond the immediate session | Repeat a small subset of concept/transfer questions after a delay | Report the delay and completion bias; do not treat missing responses as failure |
| Outcome coverage | Which published module outcomes have an aligned experiment and assessment | Maintain an outcome-to-experiment-to-assessment map | Curriculum completeness measure, not learner mastery |

### Explanation rubric (0–3)

- **0 — Unsupported:** no relevant explanation, or a claim inconsistent with the observed result.
- **1 — Descriptive:** states what happened but does not connect it to a physical relationship.
- **2 — Partly explanatory:** identifies a relevant relationship or model but omits an important condition, assumption, or link to evidence.
- **3 — Well justified:** connects the observation to an appropriate physical model, uses evidence or quantities correctly, and states relevant assumptions or limits.

Use topic-specific rubrics where needed. The rubric should reward sound reasoning, not verbosity or advanced vocabulary.

## Experience and diagnostic measures

These measures help identify friction in the learning journey. They are diagnostic, not substitutes for learning outcomes.

| Measure | Definition | What it can diagnose |
|---|---|---|
| Experiment start-to-finish rate | Share of experiment starters who reach the final learning step | Navigation, task length, or interaction friction |
| Prediction participation | Share of starters who submit a prediction before experimenting | Whether the inquiry cycle is being used as intended |
| Evidence encounter rate | Share who perform the action needed to test the prediction | Whether the experiment makes the relevant evidence discoverable |
| Explanation reach rate | Share who reach the explanation after testing the relevant prediction | Whether the transition from experiment to explanation works |
| Hint use and recovery | How often hints are used and whether learners subsequently complete the relevant test | Prompt clarity and misconception patterns; hint use is not inherently negative |
| Level progression | Learners choosing a deeper mathematical level after completing a foundation | Possible readiness or interest signal, not proof of mastery |
| Return to an experiment | Learners revisiting a saved/shared experiment or repeating a setup | Possible value or unresolved confusion; interpret with qualitative feedback |

Define denominators consistently. For example, an explanation reach rate should use learners who actually reached the prerequisite evidence step, not all page views.

## Reporting and decision rules

A useful learning report should include:
- module and experiment;
- learning outcomes assessed;
- number of learners invited and number completing each assessment;
- pre/post score distributions and absolute gains;
- transfer-question performance;
- explanation-rubric distribution;
- delayed retention results and elapsed delay, if available;
- relevant experience diagnostics;
- known limitations, missing data, and selection bias.

Do not claim causal impact from a simple before/after comparison. The current delayed sample is unpaired and cannot establish individual retention.

Use results to decide whether to clarify a prediction prompt, change an interaction so evidence is easier to observe, improve an explanation or worked example, add prerequisite teaching, revise an outcome, or prioritise a new experiment. Do not optimise for completion rate at the expense of challenge, or for correct predictions at the expense of meaningful reasoning.

## Future measurement boundary

This pilot is a local, voluntary assessment workflow, not an analytics system. Any future telemetry or matched delayed assessment requires a separate purpose, data-minimisation, consent, retention, access, and deletion design. Do not collect personally identifying information or sensitive learner profiles to calculate these measures.
