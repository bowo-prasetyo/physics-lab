import { describe, expect, it } from 'vitest'
import { getLocalizedModules } from './home-catalog'

describe('Force Lab catalogue entry', () => {
  it.each(['en', 'id', 'ja'] as const)('appears once in the %s catalogue', (locale) => {
    const mechanics = getLocalizedModules(locale).find((module) => module.number === 3)
    expect(mechanics?.experiments.filter((experiment) => experiment.path === '/mechanics/force-lab')).toHaveLength(1)
  })
})

describe('Length Contraction Lab catalogue entry', () => {
  it.each(['en', 'id', 'ja'] as const)('appears once in the %s Module 4 catalogue', (locale) => {
    const relativity = getLocalizedModules(locale).find((module) => module.number === 4)
    expect(relativity?.experiments.filter((experiment) => experiment.path === '/relativity/length-contraction')).toHaveLength(1)
  })
})

describe('Geodesic Motion Lab catalogue entry', () => {
  it.each(['en', 'id', 'ja'] as const)('appears once in the %s Module 5 catalogue', (locale) => {
    const relativity = getLocalizedModules(locale).find((module) => module.number === 5)
    expect(relativity?.experiments.filter((experiment) => experiment.path === '/gravity/geodesic-motion')).toHaveLength(1)
  })
})
