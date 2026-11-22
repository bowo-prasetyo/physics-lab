import type { RunRecord } from '@/physics'

/** A run of Experiment A together with the settings the motion model does not track. */
export interface ExperimentRun extends RunRecord {
  /**
   * Velocity of the second observer during this run (m/s). It is fixed for
   * the whole run: the observer starts at x = 0 when t = 0 and is at x = u·t
   * later, which only holds if u never changes mid-run.
   */
  readonly u: number
}
