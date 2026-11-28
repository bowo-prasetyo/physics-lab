import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { PREDICTION_BANKS } from '@/experiments/prediction-banks'
import { pilotExperiments } from '@/assessment/pilot'

/**
 * The outcome map (docs/product/OUTCOME_MAP.md) links every learning outcome
 * in the product vision to the predictions that test it and the pilot items
 * that assess it. This test keeps it from drifting: the outcomes must match
 * the vision word for word, every reference must exist, and every prediction
 * is either mapped to an outcome or listed as not tied to one.
 */
const DOCS = join(__dirname, '..', 'docs', 'product')
const vision = readFileSync(join(DOCS, 'PRODUCT_VISION.md'), 'utf8')
const map = readFileSync(join(DOCS, 'OUTCOME_MAP.md'), 'utf8')

const STATUSES = new Set(['covered', 'partial', 'planned'])

function visionOutcomes(): string[] {
  const outcomes: string[] = []
  for (const section of vision.matchAll(/### Module (\d) — [^\n]+\n([\s\S]*?)\*\*Current foundation/g)) {
    for (const [index, item] of [...section[2]!.matchAll(/^\d+\. (.+)$/gm)].entries()) outcomes.push(`${section[1]}.${index + 1} ${item[1]}`)
  }
  return outcomes
}

interface Row { readonly id: string; readonly outcome: string; readonly predictions: string[]; readonly pilot: string[]; readonly status: string }

const refs = (cell: string, pattern: RegExp) => [...cell.matchAll(pattern)].map((m) => m[1]!)
const [mapSection, unmappedSection] = map.split('## Predictions not tied to any outcome')

const rows: Row[] = [...mapSection!.matchAll(/^\| (\d\.\d+) \| (.+?) \| (.*?) \| (.*?) \| (\w+) \| .* \|$/gm)].map((m) => ({
  id: m[1]!, outcome: m[2]!, predictions: refs(m[3]!, /`(\/[^`#]+#[^`]+)`/g), pilot: refs(m[4]!, /`pilot:([^`]+)`/g), status: m[5]!,
}))
const unmapped = refs(unmappedSection ?? '', /^\| `(\/[^`#]+#[^`]+)` \|/gm)

const allPredictions = Object.entries(PREDICTION_BANKS).flatMap(([path, bank]) => bank.map((p) => `${path}#${p.id}`))
const pilotItems = new Set(pilotExperiments.flatMap((e) => [...e.pre, ...e.post, e.transfer].map((q) => q.id)))

describe('outcome map', () => {
  it('lists every outcome in the vision, in order and word for word', () => {
    expect(visionOutcomes().length).toBeGreaterThan(0)
    expect(rows.map((r) => `${r.id} ${r.outcome}`)).toEqual(visionOutcomes())
  })

  it('names only predictions and pilot items that exist', () => {
    for (const row of rows) {
      for (const ref of row.predictions) expect(allPredictions, `${row.id} → ${ref}`).toContain(ref)
      for (const item of row.pilot) expect(pilotItems.has(item), `${row.id} → pilot:${item}`).toBe(true)
    }
    for (const ref of unmapped) expect(allPredictions, `unmapped list → ${ref}`).toContain(ref)
  })

  it('gives every outcome a status that its evidence supports', () => {
    for (const row of rows) {
      expect(STATUSES.has(row.status), `${row.id} status ${row.status}`).toBe(true)
      if (row.status === 'planned') expect(row.predictions, `${row.id} is planned but names predictions`).toEqual([])
      else expect(row.predictions.length, `${row.id} is ${row.status} without a prediction`).toBeGreaterThan(0)
    }
  })

  it('accounts for every prediction exactly once: mapped, or listed as not tied to an outcome', () => {
    const mapped = new Set(rows.flatMap((r) => r.predictions))
    const both = unmapped.filter((ref) => mapped.has(ref))
    expect(both, 'mapped to an outcome and also listed as unmapped').toEqual([])
    const missing = allPredictions.filter((ref) => !mapped.has(ref) && !unmapped.includes(ref))
    expect(missing, 'not in any row: map it to an outcome or add it to "Predictions not tied to any outcome"').toEqual([])
  })
})
