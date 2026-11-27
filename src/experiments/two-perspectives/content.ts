/**
 * Text and worked derivations for “Space and time versus spacetime”. Each derivation is written in
 * the language of its own description, with the student's current speed.
 */

import { FLASH_HALF_SEPARATION, CLOCK_EARTH_TIME, PROBE_SPEED, gamma, predict, rapidity, type Description, type Scenario } from '@/physics'

export interface ScenarioInfo {
  readonly id: Scenario
  readonly tab: string
  readonly setup: string
  /** The measurable quantity, phrased as what is being predicted. */
  readonly quantity: string
  /** Short form of the quantity for a chart axis. */
  readonly axis: string
  readonly unit: string
  readonly digits: number
  /** What real experiments have found, and how sure we are. */
  readonly evidence: string
}

export const SCENARIO_INFO: Record<Scenario, ScenarioInfo> = {
  light: {
    id: 'light',
    tab: 'Headlight',
    setup: 'A spaceship moving at speed v switches on its headlight, pointing forward.',
    quantity: 'Speed of the light, measured from the Earth',
    axis: 'light speed seen from Earth (c)',
    unit: 'c',
    digits: 4,
    evidence:
      'Always c, whatever the speed of the source. In 1964 at CERN, gamma rays emitted by particles moving at 0.99975c were timed ' +
      'travelling at c, to about 1 part in 10 000. Since 1983 the metre has been defined by taking c as exact.',
  },
  flashes: {
    id: 'flashes',
    tab: 'Two flashes',
    setup:
      `Two lightning bolts strike the ground at the same moment in the Earth frame, ${2 * FLASH_HALF_SEPARATION} light-seconds apart. ` +
      'A spaceship flies past at speed v, heading towards the front bolt.',
    quantity: 'How much earlier the front flash happens, for the ship',
    axis: 'front flash earlier by (s)',
    unit: 's',
    digits: 3,
    evidence:
      'Simultaneity of distant events cannot be read off a single clock: it depends on how distant clocks are synchronised, normally ' +
      'with light signals. Because c is measured to be the same for everyone, each observer’s synchronised clocks give this relativistic ' +
      'value. The same reasoning underlies GPS timing, which works.',
  },
  clock: {
    id: 'clock',
    tab: 'Moving clock',
    setup: `A spaceship passes the Earth at speed v; both clocks read 0 s as they pass. Later the Earth clock reads ${CLOCK_EARTH_TIME} s (Earth frame).`,
    quantity: 'What the ship clock reads at that moment',
    axis: 'ship clock reading (s)',
    unit: 's',
    digits: 4,
    evidence:
      'Moving clocks run slow by γ. Muons circulating at γ ≈ 29.3 in a storage ring at CERN (1977) lived 29.3 times longer than at rest, ' +
      'agreeing with relativity to about 0.1%. Atomic clocks flown on airliners and GPS satellites confirm it too.',
  },
  probe: {
    id: 'probe',
    tab: 'Probe',
    setup: `A spaceship moving at speed v launches a probe forward, at ${PROBE_SPEED}c relative to the ship.`,
    quantity: 'Speed of the probe, measured from the Earth',
    axis: 'probe speed seen from Earth (c)',
    unit: 'c',
    digits: 3,
    evidence:
      'Speeds below c never add up to c or more. Fizeau (1851) measured light in flowing water: it was dragged along by only a fraction ' +
      'of the water’s speed, c/n + v(1 − 1/n²), which is what relativistic addition gives to first order in v. In particle accelerators, particles produced ' +
      'by fast-moving particles are never measured travelling faster than c.',
  },
  momentum: {
    id: 'momentum',
    tab: 'Momentum',
    setup: 'A spaceship of mass m passes the Earth at speed v.',
    quantity: 'The ship’s momentum, measured from the Earth',
    axis: 'momentum (units of mc)',
    unit: 'mc',
    digits: 3,
    evidence:
      'Momentum is p = γmv. Bucherer (1908) bent fast electrons from radium in electric and magnetic fields and found this, not mv. ' +
      'Particle accelerators are built on it: the LHC’s magnets bend protons moving at 0.999999991c whose momentum is about 7 000 times mc; ' +
      'with p = mv it would be less than mc.',
  },
}

export interface DescriptionInfo {
  readonly id: Description
  readonly title: string
  readonly assumption: string
}

export const DESCRIPTION_INFO: Record<Description, DescriptionInfo> = {
  galilean: {
    id: 'galilean',
    title: 'Galilean: space + absolute time',
    assumption: 'There is one universal time for everyone (t′ = t), and velocities simply add.',
  },
  lorentz: {
    id: 'lorentz',
    title: 'Space + time, Lorentz-related',
    assumption: 'Space and time are separate coordinates, but changing observer mixes them: t′ = γ(t − vx/c²).',
  },
  spacetime: {
    id: 'spacetime',
    title: 'Spacetime',
    assumption: 'One four-dimensional geometry. Every observer agrees on the interval s² = c²t² − x².',
  },
}

/** Format a number for TeX, never printing "-0.0000". */
function f(value: number, digits: number): string {
  const text = Math.abs(value).toFixed(digits)
  return value < 0 && Number(text) !== 0 ? `-${text}` : text
}

/** The worked derivation of a prediction, as TeX (c = 1 units). */
export function derivation(scenario: Scenario, description: Description, beta: number): string {
  const b = f(beta, 2)
  const g = f(gamma(beta), 4)
  const value = predict(scenario, description, beta)
  const L = FLASH_HALF_SEPARATION
  const T = CLOCK_EARTH_TIME

  if (scenario === 'light') {
    if (description === 'galilean') return `\\begin{aligned} w &= c + v \\\\ &= 1 + ${b} = ${f(value, 4)}\\,c \\end{aligned}`
    if (description === 'lorentz')
      return `\\begin{aligned} w &= \\frac{c + v}{1 + c\\,v/c^2} \\\\ &= \\frac{1 + ${b}}{1 + ${b}} = ${f(value, 4)}\\,c \\end{aligned}`
    const phi = rapidity(beta)
    return (
      `\\begin{aligned} k^\\mu &= (1, 1) \\\\ s^2 &= 1^2 - 1^2 = 0 \\\\ ` +
      `k'^\\mu &= e^{\\varphi}(1, 1) \\\\ &= ${f(Math.exp(phi), 3)}\\,(1, 1) \\\\ ` +
      `\\frac{dx'}{dt'} &= ${f(value, 4)}\\,c \\end{aligned}`
    )
  }

  if (scenario === 'flashes') {
    if (description === 'galilean')
      return `\\begin{aligned} t'_{\\text{front}} &= t'_{\\text{rear}} \\\\ &= t = 0 \\\\ \\text{lead} &= ${f(value, 3)}\\ \\text{s} \\end{aligned}`
    if (description === 'lorentz') {
      const a = gamma(beta) * beta * L
      return (
        `\\begin{aligned} t' &= \\gamma\\,(t - v\\,x/c^2) \\\\ ` +
        `t'_{\\text{front}} &= ${g}\\,(0 - ${b} \\times ${L}) \\\\ &= ${f(-a, 3)} \\\\ ` +
        `t'_{\\text{rear}} &= ${f(a, 3)} \\\\ ` +
        `\\text{lead} &= ${f(value, 3)}\\ \\text{s} \\end{aligned}`
      )
    }
    return (
      `\\begin{aligned} \\Delta x^\\mu &= (0, ${2 * L}) \\\\ s^2 &= -${(2 * L) ** 2} \\ \\text{(spacelike)} \\\\ ` +
      `c\\,\\Delta t' &= -${2 * L} \\sinh\\varphi \\\\ \\varphi &= ${f(rapidity(beta), 4)} \\\\ ` +
      `\\text{lead} &= ${f(value, 3)}\\ \\text{s} \\end{aligned}`
    )
  }

  if (scenario === 'probe') {
    const u = f(PROBE_SPEED, 2)
    if (description === 'galilean') return `\\begin{aligned} w &= u + v \\\\ &= ${u} + ${b} = ${f(value, 3)}\\,c \\end{aligned}`
    if (description === 'lorentz')
      return `\\begin{aligned} w &= \\frac{u + v}{1 + u\\,v/c^2} \\\\ &= \\frac{${u} + ${b}}{1 + ${u} \\times ${b}} = ${f(value, 3)}\\,c \\end{aligned}`
    return (
      `\\begin{aligned} \\varphi_w &= \\varphi_u + \\varphi_v \\\\ &= ${f(rapidity(PROBE_SPEED), 4)} + ${f(rapidity(beta), 4)} \\\\ ` +
      `w &= \\tanh \\varphi_w = ${f(value, 3)}\\,c \\end{aligned}`
    )
  }

  if (scenario === 'momentum') {
    if (description === 'galilean') return `\\begin{aligned} p &= m\\,\\frac{\\Delta x}{\\Delta t} = m v \\\\ &= ${f(value, 3)}\\ mc \\end{aligned}`
    if (description === 'lorentz')
      return (
        `\\begin{aligned} \\Delta\\tau &= \\gamma\\,(\\Delta t - v\\,\\Delta x/c^2) \\\\ &= ${g}\\,(1 - ${b} \\times ${b}) = ${f(1 / gamma(beta), 4)} \\\\ ` +
        `p &= m\\,\\frac{\\Delta x}{\\Delta\\tau} = \\frac{${b}}{${f(1 / gamma(beta), 4)}} = ${f(value, 3)}\\ mc \\end{aligned}`
      )
    return (
      `\\begin{aligned} p^\\mu &= m\\,(\\cosh\\varphi, \\sinh\\varphi) \\\\ \\varphi &= ${f(rapidity(beta), 4)} \\\\ ` +
      `p &= m \\sinh\\varphi = ${f(value, 3)}\\ mc \\end{aligned}`
    )
  }

  const x = beta * T
  if (description === 'galilean') return `\\begin{aligned} t' &= t \\\\ &= ${f(value, 4)}\\ \\text{s} \\end{aligned}`
  if (description === 'lorentz')
    return (
      `\\begin{aligned} t' &= \\gamma\\,(t - v\\,x/c^2) \\\\ ` +
      `&= ${g}\\,(${T} - ${b} \\times ${f(x, 2)}) \\\\ &= ${f(value, 4)}\\ \\text{s} \\end{aligned}`
    )
  return `\\begin{aligned} \\tau &= \\sqrt{t^2 - x^2} \\\\ &= \\sqrt{${T}^2 - ${f(x, 2)}^2} \\\\ &= ${f(value, 4)}\\ \\text{s} \\end{aligned}`
}
