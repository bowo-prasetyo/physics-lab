import { describe, expect, it } from 'vitest'
import { MODULES } from '@/modules'
import { PREDICTIONS as forceLab } from '@/experiments/force-lab/predictions'
import { PREDICTIONS as circularOrbits } from '@/experiments/circular-orbits/predictions'

/**
 * Honest coverage: the roadmap counts a topic as explored only when an
 * experiment lets learners investigate it. For topics added after that rule
 * was broken once (work and energy, PR #92), each claim names the experiment
 * prediction where learners predict and then see the evidence. Removing the
 * prediction, or claiming the topic without one, fails here.
 */
const EVIDENCE: Readonly<Record<string, { readonly bank: readonly { id: string }[]; readonly prediction: string }>> = {
  'Work by constant forces and signed work by friction': { bank: forceLab, prediction: 'friction-work' },
  'Work–energy theorem and changes in kinetic energy': { bank: forceLab, prediction: 'friction-work' },
  'Kinetic and gravitational potential energy': { bank: circularOrbits, prediction: 'energy' },
  'Mechanical-energy conservation for conservative forces': { bank: circularOrbits, prediction: 'energy' },
  'Energy of bound circular orbits': { bank: circularOrbits, prediction: 'energy' },
}

describe('coverage claims are backed by experiments', () => {
  it('every energy topic in Module 3 has a prediction where learners test it', () => {
    const coverage = MODULES.find((m) => m.number === 3)!.coverage
    const energyClaims = coverage.filter((topic) => /energy|work/i.test(topic) && !/momentum|air resistance/i.test(topic))
    expect(energyClaims.sort()).toEqual(Object.keys(EVIDENCE).sort())
    for (const [topic, { bank, prediction }] of Object.entries(EVIDENCE)) {
      expect(bank.some((p) => p.id === prediction), `${topic} → ${prediction}`).toBe(true)
    }
  })
})
