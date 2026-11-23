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

Home-page module and experiment titles, summaries, audience labels, and planned-topic lists are maintained in `src/i18n/home-catalog.ts`. Keep the six-module/nine-experiment structure and route paths identical across locales.

### P2 — Experiment and teaching content

The teacher guide is localized as structured curriculum content in `src/i18n/teacher-guide.ts`, with all six lesson outlines translated in each supported locale. The guide view reads the active locale through `useLocale()`; lesson data is not embedded in the Vue template.

The experiment-specific prediction banks, experiment introductions and explanations, chart/diagram labels, and accessibility descriptions are a larger content migration and remain a follow-on part of P2. Migrate these into typed locale catalogues incrementally, preserving prediction IDs, option IDs, thresholds, equations, and observation callbacks. Never translate values that participate in simulation logic. Add locale parity and stable-ID tests for every migrated experiment.

## Translation quality

Physics terminology should be consistent across locales and reviewed by fluent speakers with physics knowledge. Preserve the distinction between established model results, assumptions, and interpretation. Avoid translating scientific symbols or silently changing the physical meaning of an explanation.
