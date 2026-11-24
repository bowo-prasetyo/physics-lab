import { describe, expect, it } from 'vitest'
import { calculateForceLab } from '@/physics/forceLab'

describe('Force Lab scenarios', () => {
  it('shows zero acceleration when the forces balance on a level surface', () => {
    const result = calculateForceLab({
      scenario: 'horizontal', mass: 4, appliedForce: 0,
      staticFrictionCoefficient: 0.4, kineticFrictionCoefficient: 0.2,
      inclineAngle: 0, duration: 3,
    })
    expect(result.frictionRegime).toBe('static')
    expect(result.netForce).toBe(0)
    expect(result.acceleration).toBe(0)
  })

  it('shows the effect of a steeper incline on the downhill component of weight', () => {
    const shallow = calculateForceLab({
      scenario: 'incline', mass: 5, appliedForce: 0,
      staticFrictionCoefficient: 0, kineticFrictionCoefficient: 0,
      inclineAngle: 15, duration: 1,
    })
    const steep = calculateForceLab({
      scenario: 'incline', mass: 5, appliedForce: 0,
      staticFrictionCoefficient: 0, kineticFrictionCoefficient: 0,
      inclineAngle: 30, duration: 1,
    })
    expect(Math.abs(steep.netForce)).toBeGreaterThan(Math.abs(shallow.netForce))
  })
})
