// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { IMPLEMENTED_EXPERIMENTS, MODULES } from '@/modules'
import { router } from '@/router'
import { CATALOGUE_TRANSLATIONS, getLocalizedModules } from './home-catalog'

describe('localized home catalogue', () => {
  it.each(['en', 'id', 'ja'] as const)('has exactly the structure of MODULES in %s', (locale) => {
    const localized = getLocalizedModules(locale)
    expect(localized.map((m) => m.number)).toEqual(MODULES.map((m) => m.number))
    localized.forEach((module, i) => {
      expect(module.experiments.map((e) => e.path)).toEqual(MODULES[i]?.experiments.map((e) => e.path))
      expect(module.plannedTopics).toHaveLength(MODULES[i]?.plannedTopics.length ?? 0)
    })
  })

  it.each(['id', 'ja'] as const)('translates every module and experiment in %s', (locale) => {
    const table = CATALOGUE_TRANSLATIONS[locale]
    for (const module of MODULES) {
      const copy = table.modules[module.number]
      expect(copy, `module ${module.number}`).toBeDefined()
      expect(copy?.role.trim().length).toBeGreaterThan(0)
      expect(copy?.plannedTopics, `planned topics of module ${module.number}`).toHaveLength(module.plannedTopics.length)
    }
    for (const experiment of IMPLEMENTED_EXPERIMENTS) {
      const copy = table.experiments[experiment.path]
      expect(copy, experiment.path).toBeDefined()
      expect(copy?.title).not.toBe(experiment.title)
    }
    // No stale entries for experiments that no longer exist.
    expect(Object.keys(table.experiments).sort()).toEqual(IMPLEMENTED_EXPERIMENTS.map((e) => e.path).sort())
  })

  it('links only to routes that exist, with no experiment letters in titles', () => {
    const paths = new Set(router.getRoutes().map((r) => r.path))
    for (const experiment of IMPLEMENTED_EXPERIMENTS) {
      expect(paths.has(experiment.path), experiment.path).toBe(true)
      expect(experiment.title).not.toMatch(/^[A-G] · /)
    }
  })

  it('gives every module a role on the space, time and motion path, not an audience label', () => {
    for (const module of MODULES) {
      expect(module.role.length).toBeGreaterThan(40)
      expect(module).not.toHaveProperty('audience')
    }
  })
})
