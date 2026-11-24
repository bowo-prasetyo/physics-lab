/**
 * State for “Space and time versus spacetime”: one scenario, one ship speed, three descriptions'
 * predictions, and a measurement the student must choose to make.
 */

import { computed, ref, watch } from 'vue'
import { DESCRIPTIONS, predict, type Description, type Scenario } from '@/physics'

export const BETA_RANGE = { min: 0, max: 0.99, step: 0.01 } as const
export const SCENARIOS: readonly Scenario[] = ['light', 'flashes', 'clock']

/** A measurement the student made: which scenario, at which speed. */
export interface Observation {
  readonly scenario: Scenario
  readonly beta: number
}

/**
 * What experiments find. Every measurement so far agrees with relativity, so
 * the measured value is the relativistic prediction (computed here through
 * the space + time route; the spacetime route gives the same number).
 */
export function measuredValue(scenario: Scenario, beta: number): number {
  return predict(scenario, 'lorentz', beta)
}

export function isScenario(value: unknown): value is Scenario {
  return value === 'light' || value === 'flashes' || value === 'clock'
}

export function useTwoPerspectives(initial: { scenario: Scenario; beta: number }) {
  const scenario = ref<Scenario>(initial.scenario)
  const beta = ref(initial.beta)
  /** Whether the measurement has been made for the current scenario and speed. */
  const measured = ref(false)
  const observations = ref<Observation[]>([])

  const predictions = computed(
    () => Object.fromEntries(DESCRIPTIONS.map((d) => [d, predict(scenario.value, d, beta.value)])) as Record<Description, number>,
  )
  const measurement = computed(() => measuredValue(scenario.value, beta.value))

  function measure() {
    measured.value = true
    observations.value = [...observations.value, { scenario: scenario.value, beta: beta.value }]
  }

  // A new setup needs a new measurement.
  watch([scenario, beta], () => {
    measured.value = false
  })

  return { scenario, beta, measured, observations, predictions, measurement, measure }
}
