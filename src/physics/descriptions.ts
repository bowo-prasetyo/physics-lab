/**
 * Three descriptions of the same physical situations, for Experiment E.
 *
 * Each function answers a question about something that can be measured,
 * using only the tools of one description:
 *
 *   galilean   separate space and absolute time (Galilean transformation)
 *   lorentz    separate space and time, related by the Lorentz transformation
 *   spacetime  4-vectors, the invariant interval and boosts as rapidity rotations
 *
 * The lorentz and spacetime versions are deliberately computed by different
 * routes; tests check that they always agree, and that galilean agrees with
 * them only when speeds are small compared with c. Units: c = 1.
 */

import { galileanBoost, relativeVelocity, type Event1D } from './frames'
import { boostByRapidity, intervalSquared, lorentzBoost, rapidity, velocityInFrame } from './spacetime'

export type Description = 'galilean' | 'lorentz' | 'spacetime'
export type Scenario = 'light' | 'flashes' | 'clock'

export const DESCRIPTIONS: readonly Description[] = ['galilean', 'lorentz', 'spacetime']

/** Flashes strike at x = ±FLASH_HALF_SEPARATION (light-seconds) at t = 0, Earth frame. */
export const FLASH_HALF_SEPARATION = 5
/** The ship clock is read when the Earth clock shows this time (s), Earth frame. */
export const CLOCK_EARTH_TIME = 10

/**
 * Light scenario. A ship moving at β relative to the Earth switches on its
 * headlight, pointing forward. Prediction: the light's speed measured from
 * the Earth (in units of c).
 */
export function headlightSpeedSeenFromEarth(description: Description, beta: number): number {
  switch (description) {
    case 'galilean':
      // Velocities add: c relative to the ship, plus the ship's own speed.
      return relativeVelocity(1, -beta)
    case 'lorentz':
      // Relativistic velocity transformation from the ship frame (moving at −β relative to the ship).
      return velocityInFrame(1, -beta)
    case 'spacetime': {
      // Light's 4-vector (1, 1) is null. Boost it to the Earth frame and read off dx/dt.
      const k = boostByRapidity({ t: 1, x: 1 }, rapidity(-beta))
      return k.x / k.t
    }
  }
}

/** The two flashes, as events in the Earth frame. */
export const FLASHES: { readonly front: Event1D; readonly rear: Event1D } = {
  front: { t: 0, x: FLASH_HALF_SEPARATION },
  rear: { t: 0, x: -FLASH_HALF_SEPARATION },
}

/**
 * Flashes scenario. Two flashes strike simultaneously in the Earth frame at
 * x = ±L. Prediction: for a ship moving at β in the +x direction, how long
 * before the rear flash does the front flash happen (s)? Zero means the ship
 * also finds them simultaneous.
 */
export function frontFlashLead(description: Description, beta: number): number {
  switch (description) {
    case 'galilean': {
      const front = galileanBoost(FLASHES.front, beta)
      const rear = galileanBoost(FLASHES.rear, beta)
      return rear.t - front.t
    }
    case 'lorentz': {
      const front = lorentzBoost(FLASHES.front, beta)
      const rear = lorentzBoost(FLASHES.rear, beta)
      return rear.t - front.t
    }
    case 'spacetime': {
      // Boost the separation 4-vector Δx^μ = (0, 2L) and read its time component.
      const separation = { t: FLASHES.front.t - FLASHES.rear.t, x: FLASHES.front.x - FLASHES.rear.x }
      return -boostByRapidity(separation, rapidity(beta)).t
    }
  }
}

/**
 * Clock scenario. A ship passes the Earth at β; both clocks read 0 as they
 * pass. Prediction: what the ship clock reads at the event where, in the
 * Earth frame, the Earth clock reads T (s).
 */
export function shipClockReading(description: Description, beta: number): number {
  const event: Event1D = { t: CLOCK_EARTH_TIME, x: beta * CLOCK_EARTH_TIME }
  switch (description) {
    case 'galilean':
      return galileanBoost(event, beta).t
    case 'lorentz':
      return lorentzBoost(event, beta).t
    case 'spacetime':
      // Proper time is the invariant length of the worldline: τ = √(s²). No boost needed.
      return Math.sqrt(intervalSquared(event))
  }
}

/** The measurable quantity of a scenario, as predicted by a description. */
export function predict(scenario: Scenario, description: Description, beta: number): number {
  switch (scenario) {
    case 'light':
      return headlightSpeedSeenFromEarth(description, beta)
    case 'flashes':
      return frontFlashLead(description, beta)
    case 'clock':
      return shipClockReading(description, beta)
  }
}
