import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { IMPLEMENTED_EXPERIMENTS, MODULES } from './modules'

/**
 * The README's experiment list is generated from src/modules.ts, so its
 * count and contents cannot drift from the app. If this test fails, run
 *
 *     npm run docs:catalogue
 *
 * to rewrite the block between the markers, then commit the README.
 */

const README = join(__dirname, '..', 'README.md')
const START = '<!-- catalogue:start (generated from src/modules.ts by `npm run docs:catalogue`; do not edit by hand) -->'
const END = '<!-- catalogue:end -->'

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']
const inWords = (n: number) => NUMBER_WORDS[n] ?? String(n)
const capitalised = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function catalogueMarkdown(): string {
  const lines = [
    `${capitalised(inWords(IMPLEMENTED_EXPERIMENTS.length))} experiments across ${inWords(MODULES.length)} modules. Modules 1–3 build the everyday picture of space, time and motion; Modules 4–6 follow the same questions into relativity, curved spacetime and cosmology.`,
  ]
  for (const module of MODULES) {
    lines.push('', `**Module ${module.number} · ${module.title}.** ${module.role}`, '')
    for (const experiment of module.experiments) {
      const title = experiment.path ? `[${experiment.title}](https://bowo-prasetyo.github.io/physics-lab/#${experiment.path})` : `${experiment.title} (planned)`
      lines.push(`- ${title}: ${experiment.summary}`)
    }
  }
  return lines.join('\n')
}

describe('README experiment catalogue', () => {
  it('matches src/modules.ts', () => {
    const readme = readFileSync(README, 'utf8')
    const start = readme.indexOf(START)
    const end = readme.indexOf(END)
    expect(start, 'README is missing the catalogue start marker').toBeGreaterThanOrEqual(0)
    expect(end, 'README is missing the catalogue end marker').toBeGreaterThan(start)
    const expected = `${START}\n${catalogueMarkdown()}\n${END}`
    const actual = readme.slice(start, end + END.length)
    if (actual !== expected && process.env.UPDATE_README === '1') {
      writeFileSync(README, readme.slice(0, start) + expected + readme.slice(end + END.length))
      return
    }
    expect(actual, 'The README catalogue is out of date: run `npm run docs:catalogue`').toBe(expected)
  })
})
