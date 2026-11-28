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

## Sources of empirical values

Values that come from measurement, with their source and uncertainty. The same note sits next to each constant in the code.

| Value | Used | Source and uncertainty |
|---|---|---|
| Speed of light | 299 792 458 m/s | Exact by definition of the metre (SI, 1983) |
| Gravitational constant G | 6.6743 × 10⁻¹¹ m³ kg⁻¹ s⁻² | CODATA 2018: 6.67430(15) × 10⁻¹¹ |
| Solar mass | 1.98847 × 10³⁰ kg | IAU 2015 nominal GM☉ with CODATA 2018 G; ± 0.00007 × 10³⁰ |
| Earth mass | 5.9722 × 10²⁴ kg | IAU 2009 system of astronomical constants; ± 0.0006 × 10²⁴ |
| Earth GM | 3.986004418 × 10¹⁴ m³/s² | WGS 84 / IERS Conventions 2010; ± 8 × 10⁵ |
| Earth mean radius | 6371 km | IUGG mean radius (6371.0088 km) |
| Surface gravity in near-surface models | 9.81 m/s² | A rounded teaching value; standard gravity is 9.80665 m/s² exactly, and local g varies by about 0.5 % |
| Sun radius | 6.957 × 10⁸ m | IAU 2015 Resolution B3 nominal value |
| Sirius B | 1.018 M☉, 0.0084 R☉ | Bond et al. 2017, ApJ 840, 70; mass ± 0.011 M☉ |
| GPS orbital radius | 26 560 km | GPS interface specification IS-GPS-200 (semi-major axis) |
| Hubble constant (model) | 67.66 km/s/Mpc | Planck 2018 VI, TT,TE,EE+lowE+lensing+BAO; ± 0.42 |
| Matter density Ωₘ (model) | 0.3111 | Planck 2018 VI, same combination; ± 0.0056 |
| Radiation density Ωᵣ (model) | 9.2 × 10⁻⁵ | Derived from T_CMB with three massless neutrino species (about 9 × 10⁻⁵ for h = 0.6766) |
| CMB temperature today | 2.7255 K | Fixsen 2009, ApJ 707, 916; ± 0.0006 K |

Values quoted in learner-facing evidence and explanations:

| Claim | Source |
|---|---|
| Light from sources at 0.99975c travels at c, to about 1 part in 10⁴ | Alväger et al. 1964, Physics Letters 12, 260 (CERN) |
| Muons at γ ≈ 29.3 live 29.3 times longer, to about 0.1 % | Bailey et al. 1977, Nature 268, 301 (CERN muon storage ring) |
| Light in flowing water is dragged by v(1 − 1/n²) | Fizeau 1851; the relativistic velocity addition to first order in v |
| Fast electrons follow p = γmv, not mv | Bucherer 1908 |
| LHC protons: about 7 000 mc at 0.999999991c | 6.8 TeV per proton (LHC Run 3, from 2022) and m_pc² = 0.938 GeV give γ ≈ 7 250 |
| All bodies fall alike to about one part in 10¹⁵ | MICROSCOPE final results, Touboul et al. 2022, PRL 129, 121102 |
| Hubble’s 1929 diagram had 24 galaxies | Hubble 1929, PNAS 15, 168 |
| H₀ from nearby supernovae is about 73 km/s/Mpc | Riess et al. 2022, ApJL 934, L7: 73.04 ± 1.04 |

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
