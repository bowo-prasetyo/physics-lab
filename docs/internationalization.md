# Internationalization

Physica currently supports English (`en`), Indonesian (`id`), and Japanese (`ja`). English is the fallback locale.

## Adding or changing messages

- Add stable, descriptive keys to `src/i18n/messages.ts`; keep the same key set in every locale.
- Use keys based on meaning and context (for example, `app.navigation.forTeachers`), not the English wording.
- Keep UI copy separate from experiment and curriculum content so those domains can be translated and reviewed independently.
- Use `useLocale()` in Vue components and call `t('namespace.key')` in templates.
- Do not put translated prose into physics calculations, model state, or identifiers. Translate only presentation text.
- Keep equations, variable names, SI unit symbols, and scientific notation intact unless a locale-specific convention is explicitly required.

## Locale behavior

- A valid `physica-locale` local-storage preference takes precedence.
- On a first visit, the app selects the first supported language in the browser's language preference list.
- Unsupported browser languages fall back to English.
- An explicit language selection is persisted and updates `<html lang>`.
- Locale selection is intentionally independent of the experiment query string, so shared experiment links remain stable.

## Number and date formatting

Use `formatNumber` and `formatDate` from `src/i18n/formatters.ts` for user-facing numbers and dates. These use the active locale through the platform `Intl` APIs. Keep raw numeric values in calculations and simulation state; format only at the presentation boundary.

## Translation quality

Translations in this foundation cover the application shell only. Experiment descriptions, predictions, charts, accessibility text, teacher resources, and route metadata are to be migrated in subsequent phases. Physics terminology should be reviewed consistently across locales before those catalogs are expanded.
