# Scientific validation policy

This document describes what the physics-engine tests establish and what they do
not establish. A passing test suite is evidence that an implementation agrees
with specified equations, limits and independent benchmarks; it is not a
substitute for expert review or experimental validation.

## Validation layers

1. **Domain and units.** Reject inputs outside a model's stated domain rather
   than silently returning NaN, infinity or a plausible-looking number.
   Keep units and sign conventions in public function documentation.
2. **Analytical limits.** Test exact special cases (zero speed, weak field,
   circular orbit, zero scatter, matter-only and radiation-only expansion).
3. **Independent benchmarks.** Compare against textbook values or a separate
   numerical method, not only another function that shares the same formula.
4. **Conservation and invariants.** Check momentum/energy conservation,
   spacetime interval invariance, the work–energy theorem and other applicable
   invariants across representative inputs.
5. **Pedagogical claims.** A topic is not marked as covered merely because a
   formula or practice question mentions it; the experiment must let learners
   make a prediction and observe evidence.

## Input-domain safeguards

The cosmology engine requires finite, positive scale factors and a finite, positive Hubble constant. Radiation, matter and cosmological-constant density parameters must be finite and non-negative; the derived curvature parameter may still be positive, zero or negative. Synthetic Hubble samples require a valid positive distance interval and finite noise parameters. A fit requires at least two galaxies with finite positive measured distances and finite observed speeds; negative observed speeds remain valid because nearby peculiar motion can overcome the Hubble recession component.

## Existing benchmark coverage

The physics-engine tests include independent or limiting checks for:

- Newtonian kinematics, vector algebra and Galilean transformations.
- Relativistic Lorentz factors, velocity addition, momentum and collision
  limits; length contraction and spacetime invariants.
- Pendulum small-angle and finite-amplitude periods, plus numerical integration
  behaviour and energy error.
- Newtonian orbital speeds and periods, Kepler scaling, escape speed, and
  comparison of predicted orbits with a separate RK4 integration.
- Schwarzschild radius, clock rates, gravitational redshift, GPS corrections,
  proper radial distance and the weak-field limit.
- FLRW expansion against exact radiation-only, matter-only, de Sitter and
  flat matter-plus-cosmological-constant solutions.
- Hubble-diagram synthetic data, exact zero-scatter recovery, seeded
  reproducibility, finite-sample behaviour and the documented distance-error
  bias.

These tests validate the mathematical models under their declared assumptions.
They do not establish that a simplified model describes every real system.

## Hubble-diagram interpretation

The current Hubble fit is ordinary least squares through the origin,

\[
\hat H_0 = \frac{\sum_i v_i d_i}{\sum_i d_i^2}.
\]

Its reported standard error treats measured distances as fixed and speed
residuals as independent with a common variance. It does **not** include
distance-measurement uncertainty, correlated peculiar velocities, selection
effects, calibration uncertainty or a full cosmological distance-redshift
model. The plotted sample is synthetic and illustrative, not observational
data. Real-data inference remains outside the current experiment's scope.

## Model boundaries to keep visible

- Newtonian mechanics assumes the stated inertial-frame, point-particle,
  constant-force or ideal-orbit conditions.
- Special-relativistic experiments use ideal inertial frames and one-dimensional
  or otherwise explicitly stated setups.
- General-relativistic clock and orbit models use the Schwarzschild exterior
  of a static, spherical, non-rotating mass; the geodesic lab does not solve
  Einstein's field equations.
- The cosmology lab uses homogeneous and isotropic FLRW/Friedmann models. Its
  early-time boundary is not a complete account of the origin of the universe.
- Simulations are models, not measurements. Distinguish exact definitions,
  empirical inputs, approximations, synthetic data and numerical estimates in
  learner-facing explanations.

## Change checklist

When changing a physics model, add or update tests for:

- valid and invalid input domains, including boundary values;
- dimensions, units and sign conventions;
- at least one analytical limit or independent benchmark;
- relevant conservation laws or invariants;
- numerical convergence or error bounds when an integrator or fit is involved;
- the assumptions and limitations shown to learners.

When a claim depends on external empirical constants or a published data set,
record the source, version/date and uncertainty near the constant or in this
document. Do not label illustrative or synthetic values as observations.
