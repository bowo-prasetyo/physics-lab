/**
 * Predict–observe–explain prompts, shared by all experiments.
 *
 * Each prediction has an `observed` test: a pure function over the runs the
 * student has performed that decides whether they have actually carried out
 * the experiment that answers the question. The explanation is revealed only
 * then, so students compare their prediction with what they saw rather than
 * with what they were told. `Run` is whatever an experiment records per run.
 */

import type { Level } from '@/levels'

export interface PredictionOption {
  readonly id: string
  readonly label: string
}

/** The parts of a prediction a card displays. */
export interface PredictionText {
  readonly id: string
  readonly question: string
  /** What the student must do in the experiment to test the prediction. */
  readonly task: string
  readonly options: readonly PredictionOption[]
  readonly correct: string
  /** Shown after the observation, whatever the student predicted. */
  readonly explanation: string
}

export interface Prediction<Run> extends PredictionText {
  /** Lowest level at which the prompt is shown. */
  readonly minLevel: Level
  readonly observed: (runs: readonly Run[]) => boolean
  /**
   * Optional nudge for a near-miss: given the runs so far, explain what to do
   * differently when the student is trying but has not yet made the
   * observation. Returns null when there is nothing to say.
   */
  readonly hint?: (runs: readonly Run[]) => string | null
}
