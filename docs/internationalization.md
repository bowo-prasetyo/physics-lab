# Internationalization

Physica supports English (`en`), Indonesian (`id`), and Japanese (`ja`). English is the fallback locale.

## Adding or changing messages

- Add stable, descriptive keys to `src/i18n/messages.ts`; keep the same key set in every locale.
- Use keys based on meaning and context, not the English wording.
- Keep application-shell copy separate from experiment and curriculum content.
- Use `useLocale()` in Vue components and `t('namespace.key')` in templates.
- Keep translated prose out of physics calculations, model state, route paths, and identifiers.
- Keep equations, variable names, SI unit symbols, and scientific notation intact unless a locale-specific convention is explicitly required.

## Locale behavior

- A valid `physica-locale` local-storage preference takes precedence.
- On a first visit, the app selects the first supported language in the browser's language preference list.
- Unsupported browser languages fall back to English.
- An explicit language selection is persisted and updates `<html lang>`.
- Locale selection is independent of experiment query strings, so shared experiment links remain stable.

## Number and date formatting

Use `formatNumber` and `formatDate` from `src/i18n/formatters.ts` for user-facing numbers and dates. Keep raw numeric values in calculations and simulation state; format only at the presentation boundary.

## Localization phases

### P0 — Foundation

The locale preference, browser-language detection, document language, message lookup, and locale-aware formatters provide the shared foundation.

### P1 — Application interface

The shared interface and home-page catalogue are localized in English, Indonesian, and Japanese. This includes navigation, mathematical-level selection, experiment navigation, sharing, prediction workflow chrome, and experiment-support UI. The translated catalogue (`src/i18n/home-catalog.ts`) is keyed by module number and experiment route: its structure always comes from `src/modules.ts`, and `home-catalog.test.ts` fails if any module or experiment lacks a translation or if a stale entry remains.

### P2 — Experiment and teaching content

The teacher guide is localized in `src/i18n/teacher-guide.ts`, with a lesson outline for every experiment (twelve outlines) in all supported locales.

The predict–observe–explain banks of all thirteen experiments are localized in `src/i18n/experiment-content.ts`, keyed by experiment and prediction ID. The catalogue covers every question, task, answer option and revealed explanation; `experiment-content.test.ts` checks every bank in both translated locales.

The active locale is applied at the view boundary. Prediction IDs, option IDs, correct-answer IDs, level thresholds, observation predicates, hint logic, route paths, query parameters, and physics calculations remain in the experiment modules and are not translated. This separation keeps saved/shared experiment setups and assessment behavior stable across languages.

Nine experiment views also use `src/components/LocalizedExperimentGuide.vue` for Indonesian and Japanese notes on established physics, interpretive questions and text descriptions of the key visualizations. These notes appear inside the Meaning section, never above Predict, so the page layout is the same in every language. The four longer learning prompts in each experiment's support panel (key concept, prediction question, suggested activity, and reflection) are localized through `src/i18n/experiment-support.ts`. The English long-form interpretation remains the source-language presentation. These descriptions provide a text alternative to the visual evidence and explain axes, markers, reference frames, and model limits where relevant.

The translated guides are presentation-only. They do not alter experiment state, equations, plotted data, or observation logic. Dynamic prediction hints are localized at the experiment-view boundary through `src/i18n/experiment-ui.ts`, preserving the original prediction functions and observation logic. Shared line, prediction, clock-rate, scale-factor, position–time, and spacetime visualizations localize axis titles, accessible chart descriptions, table summaries and key data headings. The 3D scene and galaxy field expose localized accessible descriptions and galaxy-selection labels. The experiment views also localize key control-group and navigation labels. This includes individual experiment controls: slider labels and hints, common action buttons, recorded-trial and view controls, and disclosure/fieldset labels.

The UI text helper deliberately preserves numeric values, scientific symbols, units, and unknown text. The experiment-support prose is presentation-only and retains the original English text as the fallback. Less prominent SVG annotations may still be English; localization coverage should be assessed against the current UI rather than assumed to be complete.

### P3 — Localization quality assurance

Run `npm test`, `npm run audit:localization`, `npm run audit:localization:runtime`, and `npm run build` for every localization change. Use `npm run audit:localization:interactive` to run only the interactive-state sweep. The automated suite checks:

- Message-key parity across all supported locales, non-empty values, and matching interpolation placeholders.
- Static text and selected accessibility attributes in every Vue template under `src/`; the audit writes JSON and Markdown reports to `artifacts/localization-audit.*`.
- Interactive state sweeps across routes and locales, including accessible names and document language after state changes.
- A focused Three.js WebGL scene audit that mounts the production scene, checks localized CSS2D axis/direction labels, the start marker, scientific symbols, accessible scene description, and numerical text alternative in all three locales. Reports are written to `artifacts/localization-webgl-audit.*`.
- Locale selector metadata and browser-language fallback behavior.
- Stable experiment routes and catalogue structure across languages.
- Complete teacher-guide lesson structure and experiment-support copy.
- Prediction question, task, option, and explanation coverage, including preservation of stable prediction and option IDs.
- Locale-aware number and date formatting.

The WebGL audit stubs the GPU renderer in jsdom but uses the production scene and CSS2D label construction. It verifies DOM-backed labels and accessibility, not actual raster pixels or real-browser glyph layout. The galaxy-field visualization is SVG, not Canvas/WebGL, and is covered by the runtime DOM audit. Browser screenshot review is still required for label collisions, clipping, contrast, font fallback, and responsive layout.

The source audit is a review aid, not an automatic missing-translation verdict: it flags literal Latin-language text in Vue templates, including SVG text and static accessibility attributes. Some candidates may be intentional English fallback or shared technical labels. It does not inspect TypeScript-generated labels, Canvas/WebGL drawing text, remote content, or runtime-only props. CI uploads the generated JSON and Markdown reports as the `localization-audit` artifact.

Automated checks cannot judge translation naturalness, register, terminology consistency, or scientific nuance. Before release, review each locale in the running application and complete the following checklist:

- [ ] Review English, Indonesian, and Japanese on desktop and narrow mobile layouts.
- [ ] Check that headings, buttons, hints, support panels, teacher resources, chart labels, SVG annotations, and accessible names use the selected language where translations are available.
- [ ] Check that long Japanese and Indonesian text wraps without clipping, overlap, or horizontal overflow.
- [ ] Inspect the 3D WebGL scene in a real browser at desktop and narrow mobile widths; check axis labels, direction labels, point markers, and text alternatives for clipping, collisions, contrast, and font fallback.
- [ ] Check number/date separators and ensure units, symbols, equations, and significant digits remain meaningful.
- [ ] Check interpolation in context (counts, progress, module numbers) and confirm no raw placeholder tokens are visible.
- [ ] Check language switching, reload persistence, browser-language detection, and English fallback.
- [ ] Have a fluent reviewer with physics knowledge check terminology, assumptions, model limits, and whether translations preserve the source meaning.
- [ ] Re-run the prediction workflow in each locale and confirm that only presentation changes: IDs, answers, observations, and physics results remain identical.

Record any remaining English text as a known coverage gap rather than silently treating it as translated. Translation review is a human sign-off; passing automated tests does not certify linguistic or scientific accuracy.

## Translation quality

Physics terminology should be consistent across locales and reviewed by fluent speakers with physics knowledge. Preserve the distinction between established model results, assumptions, and interpretation. Avoid translating scientific symbols or silently changing the physical meaning of an explanation.
