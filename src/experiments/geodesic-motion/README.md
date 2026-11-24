# Geodesic Motion Lab

Module 5 · General relativity

## Learning question
Why does a freely falling object follow a curved orbit if no non-gravitational force acts on it locally?

## Model
An equatorial timelike geodesic in the vacuum exterior of a static, spherical, non-rotating mass (Schwarzschild spacetime). Geometric units use the Schwarzschild radius and its light-crossing time:
- radius: r / rₛ
- proper time: τ / (rₛ/c)
- specific angular momentum: L / (rₛc)

The radial equation is d²r/dτ² = −1/(2r²) + L²/r³ − 3L²/(2r⁴), with dφ/dτ = L/r². The plotted Newtonian comparison removes the final curvature correction while holding initial data fixed.

## Scope
This is a test-particle exterior model. It does not solve Einstein's field equations, model a rotating mass, include radiation reaction or multiple bodies, or continue Schwarzschild coordinates through the horizon. Circular timelike orbits exist for r > 1.5 rₛ; stable circular orbits require r ≥ 3 rₛ. The default slightly perturbed bound orbit illustrates periapsis precession.

## Validation
`geodesic.test.ts` checks circular-orbit angular momentum, the photon-sphere domain guard, circular-orbit stability under the ideal initial condition, relativistic precession relative to the Newtonian reference, and finite integration output.
