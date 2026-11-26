# Physica: house rules

Physica is an interactive physics learning app (Vue 3, TypeScript, Vite) on one thread: space, time and motion. Read [the product vision](docs/product/PRODUCT_VISION.md) before adding a feature and [the roadmap](docs/product/CURRICULUM_ROADMAP.md) before choosing one. The rules below are the ones changes most often break; most are enforced by tests.

## Before you push

Run what CI runs:

```bash
npm test
```

```bash
npm run audit:localization && npm run audit:localization:runtime
```

```bash
npm run build
```

If you change `src/modules.ts`, regenerate the README catalogue with `npm run docs:catalogue`.

Fill in the pull-request template (`.github/pull_request_template.md`): its product check is the roadmap's decision rules, answered before review.

## Product rules

- **One thread.** New work must close a gap in space, time and motion and pass the roadmap's decision rules. Do not start a new topic thread.
- **Predict, then evidence.** Every experiment uses the shared prediction cards (`src/experiments/prediction.ts`, `PredictionCard.vue`). An explanation unlocks only after the run that tests it.
- **One page layout.** Every experiment page has the same sections in the same order; `src/experiments/layout.test.ts` checks it. Copy an existing page such as `src/experiments/circular-orbits/`.
- **One learning path.** `/learning` follows the catalogue. Never add a second structure, a block outside the steps, or a separate practice area.
- **Levels add, never hide.** Beginner, Intermediate and Advanced are mathematical depth. A higher level adds questions and problems; no topic is hidden at a lower one.
- **Claim nothing unmeasured.** Docs describe what exists and what it is designed to do, never that it improves learning. Practice is not assessment.

## Where things live

| Thing | Single source | Notes |
|---|---|---|
| Modules and experiments | `src/modules.ts` | Home page, translations, learning path, teacher guide and README are checked against it |
| Physics | `src/physics/` | Framework-free TypeScript, no imports from outside (`architecture.test.ts`). Prefer exact solutions; validate numerical methods against them |
| Concept, graph and synthesis questions | `PRACTICE_BANK` and `PRACTICE_COPY` in `src/learning/learning-content.ts` | Rendered only by `PracticeQuestion.vue`, which shuffles options. Never create a second store for questions |
| Graphs for graph questions | `GRAPHS` in `learning-content.ts` | A position–time run, or a function graph whose `f` calls `src/physics`. Drawn by `PositionTimeGraph.vue` or `FunctionGraph.vue`; never hand-draw a curve |
| Numerical problems | `src/learning/problem-bank.ts` | Answers are checked against the engine in `problem-bank.test.ts`; marking and feedback share `parseNumericAnswer` and `RELATIVE_TOLERANCE` |
| Interface text | `src/i18n/messages.ts` | Same keys in `en`, `id` and `ja`; use `t('key')` |
| An experiment page's text | that experiment's `copy.ts` dictionary, with a completeness test | Prediction text goes in `src/i18n/experiment-content.ts` |

## Adding practice

- **A concept or graph question:** add a source to `PRACTICE_BANK` (with `graph` for a graph question) and its copy in all three languages to `PRACTICE_COPY`. Nothing else: the step picks it up, and shuffling, hints, levels and translation tests apply automatically.
- **A new graph:** add it to `GRAPHS` and its title, intro and axis labels to `GRAPH_COPY`. Function graphs start their scales at zero and compute their curve with the physics engine.
- **A numerical problem:** add a source and its copy to `problem-bank.ts`, and an engine cross-check to `problem-bank.test.ts`.
- **A synthesis question** (combining experiments): a `PRACTICE_BANK` source on the later experiment's step, with `requires` listing the earlier ones, at Intermediate or Advanced. The step names them from the catalogue; never copy experiment names into copy.
- **Wrong options are real misconceptions.** Three credible options beat four with fillers.
- **Stay within the practice budget:** every step has at least 2 items at Beginner and 3–7 at Advanced (`learning-content.test.ts`). Add to the thinnest steps first.

## Translation

- Never write `locale === 'en' ? … : …` or `{ en: …, id: …, ja: … }` in a component. `src/conventions.test.ts` fails on new ones.
- Accessible labels (`aria-label`, `title`, `alt`) must be fully translated. Build them from translated parts or message templates, never by joining translations with English words such as "against" or "versus". The runtime audit fails on these.

## Changing these rules

This file records product decisions. Change it in a pull request of its own, or with the product owner's explicit sign-off in the pull request description, never as a side effect of a feature. If a feature seems to need a new rule or structure, propose the rule first.

## Privacy

No accounts, tracking or analytics. Practice answers live in page memory. Progress is session-only by default; the learner may opt in to remembering explored experiments in this browser on this device. That opt-in is a ratified decision with two safeguards that must stay: a visible "Forget progress on this device" control whenever remembering is on, and a shared-device note. Nothing about a learner is ever sent anywhere; the assessment pilot exports only aggregates.

Practice is never scored as a test (the chapter review keeps no score), and learning aids never show values derived from an answer.
