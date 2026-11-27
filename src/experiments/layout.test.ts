import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CONCEPT_BRIDGE_EXPERIMENTS } from '@/i18n/concept-bridges'

/**
 * Every experiment page follows one layout, so learners always find the same
 * things in the same place:
 *
 *   header → Share → investigation guide (ExperimentSupport)
 *   → 1 Predict (shared prediction cards)
 *   → 2 Experiment
 *   → 3 Mathematics, collapsed in a disclosure
 *   → 4 Meaning, collapsed in a disclosure: established physics, then interpretation
 *   → next steps
 *
 * Predict and Experiment are always open; Mathematics and Meaning start
 * collapsed so the page leads with the phenomenon. Translated background
 * notes (LocalizedExperimentGuide) belong inside Meaning, never above Predict.
 */

const root = join(__dirname)
const pages = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .flatMap((dir) => readdirSync(join(root, dir.name)).filter((file) => file.endsWith('View.vue')).map((file) => join(dir.name, file)))

function template(path: string): string {
  const source = readFileSync(join(root, path), 'utf8')
  return source.slice(source.indexOf('<template>'))
}

function indexOf(text: string, marker: string, from = 0): number {
  const index = text.indexOf(marker, from)
  return index
}

/** The disclosure that directly wraps the section headed by `headingId`. */
function wrappedInDisclosure(text: string, headingId: string): boolean {
  const heading = text.indexOf(`id="${headingId}"`)
  const open = text.lastIndexOf('<details class="lesson-disclosure">', heading)
  return open >= 0 && text.lastIndexOf('</details>', heading) < open
}

/** Components that explain results. They belong after the evidence, inside Meaning. */
const EXPLANATIONS = ['LocalizedExperimentGuide', 'ConceptBridge']

describe('explanations stay out of the investigation guide', () => {
  it('ExperimentSupport, which renders above Predict, contains no explanation component', () => {
    const support = readFileSync(join(root, '..', 'components', 'ExperimentSupport.vue'), 'utf8')
    for (const component of EXPLANATIONS) expect(support, component).not.toContain(component)
  })

  it('places every concept bridge on exactly one experiment page', () => {
    const rendered = pages.flatMap((page) => [...template(page).matchAll(/<ConceptBridge experiment-id="([^"]+)"/g)].map((m) => m[1]))
    expect(rendered.sort()).toEqual([...CONCEPT_BRIDGE_EXPERIMENTS].sort())
  })
})

describe('experiment page layout', () => {
  it('finds every experiment page', () => {
    expect(pages.length).toBeGreaterThanOrEqual(13)
  })

  for (const page of pages) {
    describe(page, () => {
      const text = template(page)

      it('puts the sections in the standard order', () => {
        const order = [
          '<header class="lesson-head"',
          '<ShareExperiment',
          '<ExperimentSupport',
          'id="predict-title"',
          '<PredictionCard',
          'id="experiment-title"',
          'id="maths-title"',
          'id="meaning-title"',
          'kind="physics"',
          'kind="interpretation"',
          '<nav class="next card"',
        ]
        let position = -1
        for (const marker of order) {
          const found = indexOf(text, marker, position + 1)
          expect(found, `${marker} should follow the previous section`).toBeGreaterThan(position)
          position = found
        }
      })

      it('keeps Mathematics and Meaning in collapsed disclosures', () => {
        expect(wrappedInDisclosure(text, 'maths-title')).toBe(true)
        expect(wrappedInDisclosure(text, 'meaning-title')).toBe(true)
        expect(text).not.toMatch(/<details class="lesson-disclosure"[^>]*\sopen/)
      })

      it('shows explanations (background notes, concept bridges) only inside Meaning, never above Predict', () => {
        const meaning = text.indexOf('id="meaning-title"')
        for (const component of EXPLANATIONS) {
          const at = text.indexOf(`<${component}`)
          if (at >= 0) expect(at, `${component} must sit inside Meaning`).toBeGreaterThan(meaning)
        }
      })

      it('lets a teacher share the setup as a link', () => {
        const source = readFileSync(join(root, page), 'utf8')
        expect(source).toContain('useQuerySync(')
      })
    })
  }
})
