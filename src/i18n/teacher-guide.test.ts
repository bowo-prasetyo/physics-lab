import { describe, expect, it } from 'vitest'
import { IMPLEMENTED_EXPERIMENTS, MODULES } from '@/modules'
import { SUPPORTED_LOCALES } from './locales'
import { LESSON_EXPERIMENTS, getTeacherGuide } from './teacher-guide'

describe('teacher guide coverage', () => {
  it('has one experiment list per lesson, in every locale', () => {
    for (const locale of SUPPORTED_LOCALES) expect(getTeacherGuide(locale).lessons).toHaveLength(LESSON_EXPERIMENTS.length)
  })

  it('gives every implemented experiment at least one lesson outline', () => {
    const taught = new Set(LESSON_EXPERIMENTS.flatMap((lesson) => lesson.experiments))
    for (const experiment of IMPLEMENTED_EXPERIMENTS) expect(taught.has(experiment.path), experiment.path).toBe(true)
  })

  it('links each lesson only to experiments of its own module', () => {
    const moduleOf = new Map(IMPLEMENTED_EXPERIMENTS.map((e) => [e.path, e.module]))
    for (const lesson of LESSON_EXPERIMENTS) {
      for (const path of lesson.experiments) expect(moduleOf.get(path), path).toBe(lesson.moduleNumber)
    }
  })

  it('has a lesson for every module, so every "Teacher resources for Module N" link has a target', () => {
    const modules = new Set(LESSON_EXPERIMENTS.map((lesson) => lesson.moduleNumber))
    for (const module of MODULES) expect(modules.has(module.number), `module ${module.number}`).toBe(true)
  })

  it('labels each lesson with its module, in every locale', () => {
    for (const locale of SUPPORTED_LOCALES) {
      getTeacherGuide(locale).lessons.forEach((lesson, index) => {
        expect(lesson.module, `${locale} lesson ${index + 1}`).toMatch(new RegExp(String(LESSON_EXPERIMENTS[index]?.moduleNumber)))
      })
    }
  })
})
