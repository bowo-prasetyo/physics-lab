# Force Lab — free-body diagrams and multiple forces

## Learning sequence

1. Commit to predictions on the shared prediction cards: static friction holding a pushed block, breakaway to kinetic friction (Beginner), the normal force on an incline (Intermediate), and the mass-independent sliding angle tan θ = μs (Advanced). Each explanation unlocks only after the trials that test it (`predictions.ts`).
2. Choose a horizontal surface or a fixed inclined plane.
3. Vary mass, an applied force parallel to the surface, the static and kinetic friction coefficients and (on an incline) the angle.
4. Run the trial. Until the current setup has been run, only the push is drawn; then the free-body diagram, friction regime and force magnitudes appear.
5. Compare the tangential force tendency with the maximum static friction to identify when sliding begins.
6. Relate the vector sum to acceleration, then to velocity and displacement from rest.
7. Open the mathematics and meaning sections for the level-appropriate explanation and model limits.

## Mathematical depth

- **Beginner:** static friction adjusts to maintain rest up to a maximum; kinetic friction acts after the static limit is exceeded.
- **Intermediate:** resolve weight into components parallel and perpendicular to the plane, compare the tangential tendency with \(\mu_s N\), and use \(f_k=\mu_kN\) while sliding.
- **Advanced:** formulate the equations in a local orthonormal basis and distinguish the static constraint from the kinetic-friction equation of motion.

All levels use the same physical model and numerical results.

## Model contract

The pure TypeScript model uses a two-dimensional local basis: +x points up the surface and +y points away from it. The block starts from rest. Static friction takes the value required for tangential equilibrium, up to \(f_{s,\max}=\mu_sN\). If the tangential tendency exceeds that limit, the model switches to kinetic friction of magnitude \(f_k=\mu_kN\), opposing the impending direction of motion. The applied force is parallel to the surface; the normal acceleration is zero; each trial uses constant forces after the friction regime is selected.

The regime switch represents breakaway without resolving its short transient. Kinetic friction is constant in magnitude. Rotation, ropes/pulleys, air resistance, changing contact and non-inertial frames are outside this model's scope.
