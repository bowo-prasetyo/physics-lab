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

The shared interface and home-page catalogue are localized in English, Indonesian, and Japanese. This includes navigation, mathematical-level selection, experiment navigation, sharing, prediction workflow chrome, and experiment-support UI.

### P2 — Experiment and teaching content

The teacher guide is localized in `src/i18n/teacher-guide.ts`, with six complete lesson outlines in all supported locales.

The nine experiment-specific predict–observe–explain banks are localized in `src/i18n/experiment-content.ts`. The catalogue covers every question, task, answer option, and revealed explanation in the following experiments:

1. Position and time (`space-vs-time`)
2. Three-dimensional displacement (`displacement3d`)
3. Pendulum clocks (`pendulum`)
4. Newtonian force, mass, and acceleration (`newtonian`)
5. Projectile motion (`projectile`)
6. Moving clocks (`moving-clocks`)
7. Two perspectives on special relativity (`two-perspectives`)
8. Gravity and clock rates (`gravity-clocks`)
9. Evolving space (`evolving-space`)

The active locale is applied at the view boundary. Prediction IDs, option IDs, correct-answer IDs, level thresholds, observation predicates, hint logic, route paths, query parameters, and physics calculations remain in the experiment modules and are not translated. This separation keeps saved/shared experiment setups and assessment behavior stable across languages.

The nine experiment views also use `src/components/LocalizedExperimentGuide.vue` for Indonesian and Japanese explanations of established physics, interpretive questions, and text descriptions of the key visualizations. The English long-form interpretation remains the source-language presentation. These descriptions provide a text alternative to the visual evidence and explain axes, markers, reference frames, and model limits where relevant.

The translated guides are presentation-only. They do not alter experiment state, equations, plotted data, or observation logic. Dynamic experiment hints, every individual SVG/chart control label, and the remaining native accessibility labels are still candidates for further localization. Preserve scientific symbols, units, equations, assumptions, and uncertainty language when extending coverage.

## Translation quality

Physics terminology should be consistent across locales and reviewed by fluent speakers with physics knowledge. Preserve the distinction between established model results, assumptions, and interpretation. Avoid translating scientific symbols or silently changing the physical meaning of an explanation.
