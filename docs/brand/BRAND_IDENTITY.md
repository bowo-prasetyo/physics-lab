# Physica brand identity

## Concept

The Physica symbol is a compact, abstract spacetime path. Its upright white reference line evokes an axis or frame of reference; the curved teal worldline suggests motion through space and time; and the amber point marks a measurable event. Together they communicate physics as something explored through observation, models, and experiments—not as a single subfield or a generic atom symbol.

## Assets

- `public/physica-logo.svg`: horizontal primary logo for the application and other wide placements.
- `public/favicon.svg`: simplified standalone symbol for browser tabs and compact app surfaces.

Both assets are SVG, scale-independent, and use the same geometry and palette.

## Brand palette

| Color | Hex | Role |
| --- | --- | --- |
| Midnight blue | `#142B4A` | Primary brand color, wordmark, and primary buttons |
| Signal teal | `#67D5CF` | Worldline, exploration, and graphical highlights |
| Event amber | `#FFC857` | Event marker and occasional graphical emphasis |
| White | `#FFFFFF` | Contrast inside the symbol |

## Application theme

The application uses the brand palette within a restrained, neutral interface. The page and card surfaces remain neutral so experiments, charts, and explanatory content stay easy to read.

| Token | Light theme | Dark theme | Intended use |
| --- | --- | --- | --- |
| `--bg` | `#F6F7FB` | `#0E131D` | Page background |
| `--surface` | `#FFFFFF` | `#161D2A` | Cards and panels |
| `--surface-2` | `#EEF1F7` | `#1E2738` | Hover and secondary surfaces |
| `--text` | `#172033` | `#E7EAF1` | Main text |
| `--text-muted` | `#556079` | `#AAB4C7` | Supporting text |
| `--accent` | `#245B85` | `#9CCFFF` | Links, focus indicators, and interactive accents |
| `--brand-midnight` | `#142B4A` | `#142B4A` | Primary buttons and brand anchors |
| `--brand-teal` | `#67D5CF` | `#67D5CF` | Decorative and data visualization highlights |
| `--brand-amber` | `#FFC857` | `#FFC857` | Event markers and data visualization highlights |

## Visualization palette

The shared CSS tokens `--series-1` through `--series-4` provide a coordinated palette for plotted quantities. Use teal and amber for meaningful experimental quantities and highlights, while keeping axes and grids neutral. Use line styles, point shapes, labels, or other non-color cues alongside color so the data remains distinguishable for users with color-vision deficiencies and in monochrome output.

The observer/reference-frame color remains separate from the brand accents. Semantic success and warning colors retain their own meaning and should not be repurposed as decorative brand colors.

## Accessibility

- Do not use the bright teal or amber brand swatches as small text on white backgrounds; their contrast is insufficient. Use `--brand-teal-ink` or `--brand-amber-ink` for text and icons that need to meet contrast requirements.
- Primary buttons use midnight blue with white text. Links and focus indicators use the darker accessible accent in light mode and a light accent in dark mode.
- Preserve visible keyboard focus indicators.
- Never rely on color alone to communicate state, identify a plotted quantity, or distinguish experimental results.

## Usage

- Prefer the horizontal logo on light backgrounds.
- Use the standalone favicon symbol where the wordmark would be too small to read.
- Preserve the original proportions; do not stretch, rotate, or recolor individual elements.
- Keep clear space around the logo at least equal to the width of the symbol's vertical stroke.
- Do not add shadows, gradients, outlines, or decorative effects.
- The symbol is designed to remain recognizable at small sizes; avoid adding detail to favicon variants.
