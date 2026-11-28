// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { IMPLEMENTED_EXPERIMENTS, MODULES } from '@/modules'
import { router } from '@/router'
import { SUPPORTED_LOCALES } from '@/i18n/locales'
import { getLocalizedModules } from '@/i18n/home-catalog'
import { seededShuffle } from '@/shuffle'
import { CHAPTER_PREREQUISITES, GRAPHS, GRAPH_CART_MASS, GRAPH_COPY, GRAPH_PROJECTILE, PRACTICE_BANK, PRACTICE_COPY, STEP_COPY, getLearningPath, type FunctionGraph } from './learning-content'
import { accelerationFromNetForce, exactFlightTime, exactMaxHeight, exactState, smallAnglePeriod } from '@/physics'
import { isExplored, markExplored, resetExplored } from './session-progress'

describe('learning path structure', () => {
  it.each(SUPPORTED_LOCALES)('follows the module catalogue exactly in %s', (locale) => {
    const { chapters } = getLearningPath(locale)
    expect(chapters.map((c) => c.number)).toEqual(MODULES.map((m) => m.number))
    chapters.forEach((chapter, i) => {
      const module = MODULES[i]!
      expect(chapter.steps.map((s) => s.path)).toEqual(module.experiments.flatMap((e) => (e.path ? [e.path] : [])))
      expect(chapter.prerequisites.trim().length).toBeGreaterThan(20)
    })
  })

  it('has teaching text for every experiment and module in every language, and no stale entries', () => {
    const paths = IMPLEMENTED_EXPERIMENTS.map((e) => e.path).sort()
    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(STEP_COPY[locale]).sort(), locale).toEqual(paths)
      expect(Object.keys(CHAPTER_PREREQUISITES[locale]).map(Number).sort(), locale).toEqual(MODULES.map((m) => m.number))
      for (const copy of Object.values(STEP_COPY[locale])) {
        expect(copy.focus.trim()).not.toBe('')
        expect(copy.idea.trim()).not.toBe('')
        expect(copy.prerequisite.trim().length).toBeGreaterThan(20)
      }
    }
  })

  it('links only to routes that exist', () => {
    const routes = new Set(router.getRoutes().map((r) => r.path))
    for (const q of PRACTICE_BANK) expect(routes.has(q.experiment), q.experiment).toBe(true)
    for (const chapter of getLearningPath('en').chapters) for (const step of chapter.steps) expect(routes.has(step.path), step.path).toBe(true)
  })
})

describe('practice questions', () => {
  it('give every experiment a Beginner question and every module a harder one', () => {
    for (const experiment of IMPLEMENTED_EXPERIMENTS) {
      expect(PRACTICE_BANK.some((q) => q.experiment === experiment.path && q.minLevel === 'beginner'), experiment.path).toBe(true)
    }
    for (const module of MODULES) {
      const paths = new Set(module.experiments.map((e) => e.path))
      expect(PRACTICE_BANK.some((q) => paths.has(q.experiment) && q.minLevel !== 'beginner'), `module ${module.number}`).toBe(true)
    }
  })

  it('are complete and consistent in every language', () => {
    const ids = PRACTICE_BANK.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const q of PRACTICE_BANK) {
      expect(q.options).toContain(q.answer)
      expect(new Set(q.options).size).toBe(q.options.length)
    }
    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(PRACTICE_COPY[locale]).sort(), locale).toEqual([...ids].sort())
      for (const q of PRACTICE_BANK) {
        const copy = PRACTICE_COPY[locale][q.id]!
        expect(Object.keys(copy.options).sort(), `${locale} ${q.id}`).toEqual([...q.options].sort())
        for (const text of [copy.prompt, copy.hint, copy.explanation, ...Object.values(copy.options)]) expect(text.trim()).not.toBe('')
        if (locale !== 'en') expect(copy.prompt).not.toBe(PRACTICE_COPY.en[q.id]!.prompt)
      }
    }
  })

  it('cannot be passed by always choosing the same position', () => {
    // Concept, graph and synthesis questions alike: every multiple-choice question in the path.
    const questions = getLearningPath('en').chapters.flatMap((c) => c.steps.flatMap((s) => [...s.questions, ...s.graphs.flatMap((g) => g.questions), ...s.syntheses.map((x) => x.question)]))
    expect(questions.length).toBe(PRACTICE_BANK.length)
    for (let seed = 0; seed < 50; seed += 1) {
      for (let position = 0; position < 4; position += 1) {
        const allRight = questions.every((q) => seededShuffle(q.options, q.id, seed)[position]?.id === q.answer)
        expect(allRight).toBe(false)
      }
    }
    for (const q of questions) {
      const seen = new Set<number>()
      for (let seed = 0; seed < 200; seed += 1) seen.add(seededShuffle(q.options, q.id, seed).findIndex((o) => o.id === q.answer))
      expect(seen.size, q.id).toBe(q.options.length)
    }
  })
})

describe('graph questions', () => {
  it('refer only to defined graphs, and every graph has questions and copy in every language', () => {
    const used = new Set(PRACTICE_BANK.flatMap((q) => ('graph' in q && q.graph ? [q.graph] : [])))
    expect([...used].sort()).toEqual(Object.keys(GRAPHS).sort())
    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(GRAPH_COPY[locale]).sort(), locale).toEqual(Object.keys(GRAPHS).sort())
      for (const [id, copy] of Object.entries(GRAPH_COPY[locale])) {
        expect(copy.title.trim(), `${locale} ${id}`).not.toBe('')
        expect(copy.intro.trim(), `${locale} ${id}`).not.toBe('')
        if (locale !== 'en') expect(copy.intro).not.toBe(GRAPH_COPY.en[id]!.intro)
      }
    }
  })

  it('group under their step, separate from the concept questions, with questions at every level', () => {
    const step = getLearningPath('en').chapters.flatMap((c) => c.steps).find((s) => s.path === '/space/space-vs-time')!
    expect(step.questions.every((q) => !q.graph)).toBe(true)
    expect(step.graphs.map((g) => g.id)).toEqual(['walk-stop-return'])
    expect(new Set(step.graphs[0]!.questions.map((q) => q.minLevel))).toEqual(new Set(['beginner', 'intermediate', 'advanced']))
  })

  it('draw a run that matches the questions’ answers', () => {
    const graph = GRAPHS['walk-stop-return']!
    if (graph.kind !== 'motion') throw new Error('expected a run')
    const { record, duration } = graph
    expect(duration).toBe(6)
    expect(record.segments.map((s) => [s.tStart, s.xStart, s.v])).toEqual([[0, 0, 2], [2, 4, 0], [4, 4, -2]])
    expect(record.distance).toBe(8)
  })
})

describe('model-curve graphs', () => {
  const fn = (id: string): FunctionGraph => {
    const graph = GRAPHS[id]
    if (!graph || graph.kind !== 'function') throw new Error(`${id} is not a function graph`)
    return graph
  }
  const samples = (g: FunctionGraph) => Array.from({ length: 41 }, (_, i) => (g.x.max * i) / 40)

  it('plot exactly what the physics engine computes', () => {
    for (const x of samples(fn('force-acceleration'))) expect(fn('force-acceleration').f(x)).toBe(accelerationFromNetForce(x, GRAPH_CART_MASS))
    for (const x of samples(fn('pendulum-length'))) expect(fn('pendulum-length').f(x)).toBe(smallAnglePeriod(x, 9.81))
    for (const t of samples(fn('projectile-height'))) expect(fn('projectile-height').f(t)).toBeCloseTo(Math.max(0, exactState(GRAPH_PROJECTILE, t).y), 12)
  })

  it('draw the right shapes: a line and a √L curve through the origin, and a true parabola', () => {
    expect(fn('force-acceleration').f(0)).toBe(0)
    expect(fn('pendulum-length').f(0)).toBe(0)
    // Equal time steps: the height changes by amounts that fall by the same step each time (constant g).
    const h = fn('projectile-height').f
    const steps = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75].map((t) => h(t + 0.25) - h(t))
    const second = steps.slice(1).map((d, i) => d - steps[i]!)
    for (const d of second) expect(d).toBeCloseTo(-GRAPH_PROJECTILE.g * 0.25 ** 2, 9)
  })

  it('fit their scales, so the whole curve and the values the questions need are readable', () => {
    for (const id of Object.keys(GRAPHS)) {
      const g = GRAPHS[id]!
      if (g.kind !== 'function') continue
      for (const x of samples(g)) {
        expect(g.f(x), id).toBeGreaterThanOrEqual(0)
        expect(g.f(x), id).toBeLessThanOrEqual(g.y.max)
      }
      for (const x of g.table) expect(x, id).toBeLessThanOrEqual(g.x.max)
    }
    // The numbers the questions quote are what the scales show.
    expect(fn('force-acceleration').f(10) / 10).toBe(0.5) // slope 0.5 (m/s²)/N, so m = 2 kg
    expect(exactMaxHeight(GRAPH_PROJECTILE)).toBeCloseTo(4.9, 9)
    expect(exactFlightTime(GRAPH_PROJECTILE)).toBeCloseTo(fn('projectile-height').x.max, 9)
    expect(fn('pendulum-length').f(2) / fn('pendulum-length').f(0.5)).toBeCloseTo(2, 12) // four times the length, twice the period
  })

  it('have axis labels in every language, and sit on the experiment they are about', () => {
    for (const locale of SUPPORTED_LOCALES) {
      for (const id of Object.keys(GRAPHS)) {
        if (GRAPHS[id]!.kind !== 'function') continue
        expect(GRAPH_COPY[locale][id]?.xLabel?.trim(), `${locale} ${id}`).toBeTruthy()
        expect(GRAPH_COPY[locale][id]?.yLabel?.trim(), `${locale} ${id}`).toBeTruthy()
      }
    }
    const homeOf = (graph: string) => new Set(PRACTICE_BANK.filter((q) => 'graph' in q && q.graph === graph).map((q) => q.experiment))
    expect([...homeOf('force-acceleration')]).toEqual(['/mechanics/force-lab'])
    expect([...homeOf('projectile-height')]).toEqual(['/mechanics/projectile'])
    expect([...homeOf('pendulum-length')]).toEqual(['/time/pendulum'])
  })
})

describe('synthesis questions', () => {
  const order = IMPLEMENTED_EXPERIMENTS.map((e) => e.path)
  const synthesis = PRACTICE_BANK.filter((q) => 'requires' in q && q.requires?.length)

  it('combine real experiments and sit on the step that comes after all of them', () => {
    expect(synthesis.length).toBeGreaterThanOrEqual(3)
    for (const q of synthesis) {
      for (const path of q.requires!) {
        expect(order.includes(path), `${q.id} requires ${path}`).toBe(true)
        expect(order.indexOf(path), `${q.id}: ${path} must come before ${q.experiment}`).toBeLessThan(order.indexOf(q.experiment))
      }
      expect(q.minLevel, q.id).not.toBe('beginner') // combining two models is never the first step
    }
  })

  it('name the experiments they combine from the localized catalogue, never from copied text', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const titles = new Map(getLocalizedModules(locale).flatMap((m) => m.experiments).map((e) => [e.path, e.title]))
      const steps = getLearningPath(locale).chapters.flatMap((c) => c.steps)
      expect(steps.flatMap((s) => s.syntheses).length).toBe(synthesis.length)
      for (const step of steps) {
        expect(step.questions.some((q) => q.requires), step.path).toBe(false)
        for (const item of step.syntheses) for (const r of item.requires) expect(r.title, `${locale} ${r.path}`).toBe(titles.get(r.path))
      }
    }
  })
})

describe('practice budget', () => {
  /**
   * Practice per step, all types together (concept, graph, synthesis, Apply it).
   * The vision sets these bounds: enough practice on every step, and no step
   * growing far beyond the others until a pilot shows where more is needed.
   */
  const BUDGET = { beginnerMin: 2, advancedMin: 3, advancedMax: 7 }

  it('keeps every step within the budget', () => {
    for (const step of getLearningPath('en').chapters.flatMap((c) => c.steps)) {
      const all = [...step.questions, ...step.graphs.flatMap((g) => g.questions), ...step.syntheses.map((x) => x.question), ...step.problems]
      const beginner = all.filter((q) => q.minLevel === 'beginner').length
      expect(beginner, `${step.path} at Beginner`).toBeGreaterThanOrEqual(BUDGET.beginnerMin)
      expect(all.length, `${step.path} at Advanced`).toBeGreaterThanOrEqual(BUDGET.advancedMin)
      expect(all.length, `${step.path} at Advanced`).toBeLessThanOrEqual(BUDGET.advancedMax)
    }
  })
})

describe('session progress', () => {
  it('records explored experiments in memory only', () => {
    resetExplored()
    expect(isExplored('/time/pendulum')).toBe(false)
    markExplored('/time/pendulum')
    expect(isExplored('/time/pendulum')).toBe(true)
    resetExplored()
    expect(isExplored('/time/pendulum')).toBe(false)
  })
})


describe('graph evidence integrity', () => {
  it('keeps every function graph finite, in-domain and within its labelled scale', () => {
    for (const [id, graph] of Object.entries(GRAPHS)) {
      if (graph.kind !== 'function') continue
      expect(graph.x.max, id).toBeGreaterThan(0)
      expect(graph.x.step, id).toBeGreaterThan(0)
      expect(graph.y.max, id).toBeGreaterThan(0)
      expect(graph.y.step, id).toBeGreaterThan(0)
      for (const x of graph.table) {
        expect(x, `${id}: table x`).toBeGreaterThanOrEqual(0)
        expect(x, `${id}: table x`).toBeLessThanOrEqual(graph.x.max)
        expect(Number.isFinite(graph.f(x)), `${id}: f(${x})`).toBe(true)
      }
      for (let sample = 0; sample <= 100; sample += 1) {
        const x = graph.x.max * sample / 100
        const y = graph.f(x)
        expect(Number.isFinite(y), `${id}: f(${x})`).toBe(true)
        expect(y, `${id}: f(${x}) below axis`).toBeGreaterThanOrEqual(-1e-9)
        expect(y, `${id}: f(${x}) above axis`).toBeLessThanOrEqual(graph.y.max + 1e-9)
      }
    }
  })

  it('keeps every graph question attached to one graph-backed step', () => {
    const graphQuestions = PRACTICE_BANK.filter((question) => 'graph' in question && question.graph)
    expect(graphQuestions.length).toBeGreaterThan(0)
    for (const question of graphQuestions) {
      expect(GRAPHS[question.graph!], question.id).toBeDefined()
      expect(IMPLEMENTED_EXPERIMENTS.some((experiment) => experiment.path === question.experiment), question.id).toBe(true)
      expect(question.options.some((option) => option.id === question.answer), question.id).toBe(true)
    }
  })
})
