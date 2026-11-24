import {describe,expect,it} from 'vitest'
import {calculateMomentumCollision} from './momentumCollisions'
describe('calculateMomentumCollision',()=>{
 it('exchanges velocities for equal-mass elastic impact and conserves momentum and energy',()=>{
  const r=calculateMomentumCollision({mass1:2,mass2:2,velocity1:3,velocity2:0,restitution:1})
  expect(r.velocity1After).toBeCloseTo(0);expect(r.velocity2After).toBeCloseTo(3);expect(r.momentumAfter).toBeCloseTo(r.momentumBefore);expect(r.kineticEnergyAfter).toBeCloseTo(r.kineticEnergyBefore)
 })
 it('gives a shared velocity for perfectly inelastic collision',()=>{
  const r=calculateMomentumCollision({mass1:2,mass2:3,velocity1:5,velocity2:-1,restitution:0})
  expect(r.velocity1After).toBeCloseTo(1.4);expect(r.velocity2After).toBeCloseTo(1.4);expect(r.momentumAfter).toBeCloseTo(r.momentumBefore);expect(r.kineticEnergyAfter).toBeLessThan(r.kineticEnergyBefore)
 })
 it('obeys restitution and equal-opposite impulses for inelastic collision',()=>{
  const r=calculateMomentumCollision({mass1:1,mass2:4,velocity1:6,velocity2:-2,restitution:.35})
  expect(r.momentumAfter).toBeCloseTo(r.momentumBefore);expect(r.impulseOn1).toBeCloseTo(-r.impulseOn2);expect(r.relativeSpeedAfter).toBeCloseTo(.35*r.relativeSpeedBefore);expect(r.kineticEnergyAfter).toBeLessThan(r.kineticEnergyBefore)
 })
 it('returns no impulse for equal initial velocities',()=>{
  const r=calculateMomentumCollision({mass1:1,mass2:3,velocity1:-2,velocity2:-2,restitution:.2})
  expect(r.velocity1After).toBeCloseTo(-2);expect(r.velocity2After).toBeCloseTo(-2);expect(r.impulseOn1).toBeCloseTo(0);expect(r.impulseOn2).toBeCloseTo(0)
 })
 it('rejects invalid inputs',()=>{
  expect(()=>calculateMomentumCollision({mass1:0,mass2:1,velocity1:0,velocity2:1,restitution:1})).toThrow(RangeError)
  expect(()=>calculateMomentumCollision({mass1:1,mass2:-1,velocity1:0,velocity2:1,restitution:1})).toThrow(RangeError)
  expect(()=>calculateMomentumCollision({mass1:1,mass2:1,velocity1:NaN,velocity2:1,restitution:1})).toThrow(RangeError)
  expect(()=>calculateMomentumCollision({mass1:1,mass2:1,velocity1:0,velocity2:1,restitution:1.1})).toThrow(RangeError)
 })
})