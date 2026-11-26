/**
 * Work and mechanical energy for Newtonian mechanics (SI units).
 * Work is signed; potential energy is defined relative to an explicit zero.
 */
function finite(name: string, value: number): void {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`)
}
export function kineticEnergy(mass: number, speed: number): number {
  finite('mass', mass); finite('speed', speed)
  if (mass <= 0) throw new RangeError('Mass must be greater than zero')
  return 0.5 * mass * speed ** 2
}
/** Work by a constant force over a straight displacement; angle is in degrees. */
export function workByConstantForce(force: number, displacement: number, angleDeg = 0): number {
  finite('force', force); finite('displacement', displacement); finite('angleDeg', angleDeg)
  return force * displacement * Math.cos(angleDeg * Math.PI / 180)
}
/** Near a planet's surface, with height measured from the chosen zero level. */
export function gravitationalPotentialEnergy(mass: number, height: number, g = 9.81): number {
  finite('mass', mass); finite('height', height); finite('g', g)
  if (mass <= 0 || g < 0) throw new RangeError('Mass must be positive and g cannot be negative')
  return mass * g * height
}
/** Newtonian gravitational potential energy, zero at infinite separation. */
export function universalGravitationalPotentialEnergy(mass: number, centralMass: number, radius: number, gravitationalConstant = 6.6743e-11): number {
  for (const [name, value] of Object.entries({ mass, centralMass, radius, gravitationalConstant })) finite(name, value)
  if (mass <= 0 || centralMass <= 0 || radius <= 0 || gravitationalConstant <= 0) throw new RangeError('Masses, radius and G must be positive')
  return -gravitationalConstant * centralMass * mass / radius
}
export function mechanicalEnergy(mass: number, speed: number, height: number, g = 9.81): number {
  return kineticEnergy(mass, speed) + gravitationalPotentialEnergy(mass, height, g)
}
export interface WorkEnergyResult {
  readonly initialKineticEnergy: number
  readonly netWork: number
  readonly finalKineticEnergy: number
  readonly finalSpeed: number
}
/** Work–energy theorem: Kf = Ki + ΣW. The final direction is not determined. */
export function applyWorkEnergyTheorem(mass: number, initialSpeed: number, works: readonly number[]): WorkEnergyResult {
  const initialKineticEnergy = kineticEnergy(mass, initialSpeed)
  for (const work of works) finite('work', work)
  const netWork = works.reduce((sum, work) => sum + work, 0)
  const rawFinal = initialKineticEnergy + netWork
  const roundoff = 1e-12 * Math.max(1, initialKineticEnergy, Math.abs(netWork))
  if (rawFinal < -roundoff) throw new RangeError('The stated work would require negative final kinetic energy')
  const finalKineticEnergy = Math.max(0, rawFinal)
  return { initialKineticEnergy, netWork, finalKineticEnergy, finalSpeed: Math.sqrt(2 * finalKineticEnergy / mass) }
}
/** Specific total energy of a circular Newtonian orbit: ε = −GM/(2r), in J/kg. */
export function circularOrbitSpecificEnergy(centralMass: number, radius: number, gravitationalConstant = 6.6743e-11): number {
  for (const [name, value] of Object.entries({ centralMass, radius, gravitationalConstant })) finite(name, value)
  if (centralMass <= 0 || radius <= 0 || gravitationalConstant <= 0) throw new RangeError('Mass, radius and G must be positive')
  return -(gravitationalConstant * centralMass) / (2 * radius)
}
