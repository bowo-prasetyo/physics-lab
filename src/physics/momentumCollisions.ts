/** Framework-independent one-dimensional, isolated two-body collision model. */
export interface MomentumCollisionInput { readonly mass1:number; readonly mass2:number; readonly velocity1:number; readonly velocity2:number; readonly restitution:number }
export interface MomentumCollisionResult {
 readonly momentumBefore:number; readonly momentumAfter:number; readonly momentumChange:number
 readonly velocity1After:number; readonly velocity2After:number
 readonly kineticEnergyBefore:number; readonly kineticEnergyAfter:number; readonly kineticEnergyChange:number; readonly kineticEnergyLost:number
 readonly impulseOn1:number; readonly impulseOn2:number; readonly centerOfMassVelocity:number
 readonly relativeSpeedBefore:number; readonly relativeSpeedAfter:number
 readonly collisionType:'elastic'|'inelastic'|'perfectly-inelastic'|'no-collision'
}
export function calculateMomentumCollision(input:MomentumCollisionInput):MomentumCollisionResult {
 const {mass1:m1,mass2:m2,velocity1:u1,velocity2:u2,restitution:e}=input
 for(const [name,value] of Object.entries({mass1:m1,mass2:m2,velocity1:u1,velocity2:u2,restitution:e})) if(!Number.isFinite(value)) throw new RangeError(`${name} must be finite`)
 if(m1<=0||m2<=0) throw new RangeError('Masses must be greater than zero')
 if(e<0||e>1) throw new RangeError('Restitution must be between zero and one')
 const total=m1+m2
 // Cart 1 is positioned behind cart 2. A collision occurs only while it approaches faster.
 if(u1<=u2) return {momentumBefore:m1*u1+m2*u2,momentumAfter:m1*u1+m2*u2,momentumChange:0,
 velocity1After:u1,velocity2After:u2,kineticEnergyBefore:.5*m1*u1**2+.5*m2*u2**2,
 kineticEnergyAfter:.5*m1*u1**2+.5*m2*u2**2,kineticEnergyChange:0,kineticEnergyLost:0,
 impulseOn1:0,impulseOn2:0,centerOfMassVelocity:(m1*u1+m2*u2)/total,
 relativeSpeedBefore:Math.abs(u1-u2),relativeSpeedAfter:Math.abs(u1-u2),collisionType:'no-collision'}
 const v1=((m1-e*m2)*u1+(1+e)*m2*u2)/total
 const v2=((m2-e*m1)*u2+(1+e)*m1*u1)/total
 const p0=m1*u1+m2*u2,p1=m1*v1+m2*v2
 const k0=.5*m1*u1**2+.5*m2*u2**2,k1=.5*m1*v1**2+.5*m2*v2**2
 return {momentumBefore:p0,momentumAfter:p1,momentumChange:p1-p0,velocity1After:v1,velocity2After:v2,
 kineticEnergyBefore:k0,kineticEnergyAfter:k1,kineticEnergyChange:k1-k0,kineticEnergyLost:Math.max(0,k0-k1),
 impulseOn1:m1*(v1-u1),impulseOn2:m2*(v2-u2),centerOfMassVelocity:p0/total,
 relativeSpeedBefore:Math.abs(u1-u2),relativeSpeedAfter:Math.abs(v2-v1),
 collisionType:e===1?'elastic':e===0?'perfectly-inelastic':'inelastic'}
}