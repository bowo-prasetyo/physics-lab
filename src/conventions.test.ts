import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * House rules that reviews kept having to restore (see CLAUDE.md). Each rule
 * was broken by a merged change at least once; these tests make the next
 * break fail in CI instead of reaching learners.
 */

const SRC = __dirname
function files(dir: string, ext: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return files(path, ext)
    return path.endsWith(ext) ? [path] : []
  })
}
const rel = (path: string) => relative(SRC, path).split('\\').join('/')
const read = (path: string) => readFileSync(path, 'utf8')
const template = (source: string) => source.slice(source.indexOf('<template>'))

describe('learning-path practice', () => {
  const learning = files(join(SRC, 'learning'), '.vue')

  it('asks multiple-choice questions only through PracticeQuestion, so every one comes from the practice data and is shuffled', () => {
    const withRadios = learning.filter((path) => /type="radio"/.test(read(path))).map(rel)
    expect(withRadios).toEqual(['learning/PracticeQuestion.vue'])
  })

  it('draws no graphics of its own: graphs use the shared components, whose curves come from the physics engine', () => {
    const drawing = learning.filter((path) => /<(polyline|path|polygon|line|circle)\b/.test(template(read(path)))).map(rel)
    expect(drawing).toEqual([])
  })
})

describe('translation', () => {
  /** Inline language checks and per-language objects in components bypass messages.ts and its key-parity tests. */
  const INLINE_LANGUAGE = /locale(\.value)?\s*===\s*'(en|id|ja)'|\{\s*en:\s*['{]/

  /**
   * Older files that still translate inline. This list may only shrink: move
   * a file's text into the translation system, then remove it here.
   */
  const LEGACY = [
    'assessment/AssessmentPilotView.vue',
    'components/ClockRateChart.vue',
    'components/LocalizedExperimentGuide.vue',
    'components/Scene3D.vue',
    'experiments/displacement3d/Displacement3DView.vue',
    'experiments/gravity-clocks/GravityClocksView.vue',
    'experiments/newtonian/NewtonianView.vue',
    'views/TeacherGuideView.vue',
  ]

  it('keeps inline language checks out of components (new ones go in messages.ts or a tested copy file)', () => {
    const offenders = files(SRC, '.vue').filter((path) => INLINE_LANGUAGE.test(read(path))).map(rel).sort()
    expect(offenders.filter((path) => !LEGACY.includes(path)), 'new inline translations').toEqual([])
    expect(LEGACY.filter((path) => !offenders.includes(path)), 'cleaned files: remove them from LEGACY').toEqual([])
  })
})
