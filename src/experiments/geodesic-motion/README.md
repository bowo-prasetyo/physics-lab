# Geodesic Motion Lab

Module 5 · General relativity

## Learning question
Why does a freely falling object follow a curved orbit if no non-gravitational force acts on it locally?

## Learning sequence
1. Commit to predictions on the shared prediction cards: a slightly perturbed orbit, an exactly circular one, and which accelerometer reads zero, the orbiting or the hovering spacecraft's (Beginner), how the periapsis shift changes with distance (Intermediate), and the weak-field estimate applied to Mercury (Advanced). Each explanation unlocks only after the orbits that test it (`predictions.ts`).
2. Run the experiment. The orbit is integrated only on a run, and the paths and readouts stay hidden until the current settings have been run. Every level shows two accelerometers: zero on the freely falling spacecraft, and 1/√(1 − rₛ/r) times the Newtonian pull GM/r² on a spacecraft hovering at the starting radius.
3. From Intermediate, read the measured periapsis shift per orbit (from interpolated periapsis angles) and compare runs in the table; at Advanced, compare it with the near-circular estimate 360°·(1/√(1 − 3rₛ/r) − 1).

## Model
An equatorial timelike geodesic in the vacuum exterior of a static, spherical, non-rotating mass (Schwarzschild spacetime). Geometric units use the Schwarzschild radius and its light-crossing time:
- radius: r / rₛ
- proper time: τ / (rₛ/c)
- specific angular momentum: L / (rₛc)

The radial equation is d²r/dτ² = −1/(2r²) + L²/r³ − 3L²/(2r⁴), with dφ/dτ = L/r². The plotted Newtonian comparison removes the final curvature correction while holding initial data fixed.

## Scope
This is a test-particle exterior model. It does not solve Einstein's field equations, model a rotating mass, include radiation reaction or multiple bodies, or continue Schwarzschild coordinates through the horizon. Circular timelike orbits exist for r > 1.5 rₛ; stable circular orbits require r ≥ 3 rₛ. The default slightly perturbed bound orbit illustrates periapsis precession.

## Validation
`geodesic.test.ts` checks circular-orbit angular momentum, the photon-sphere domain guard, circular-orbit stability under the ideal initial condition, relativistic precession relative to the Newtonian reference, and finite integration output. The hovering acceleration (`src/physics/equivalence.ts`) is checked against c² times the gradient of the static clock rate, its Newtonian limit, and its divergence at the horizon. `../rebuilt-predictions.test.ts` checks that the measured shift per orbit agrees with the near-circular formula to within 5 % at 8 and 12 rₛ, that the Newtonian reference shows no shift, and that the shift shrinks with distance.
