# Force Lab — free-body diagrams and multiple forces

## Learning sequence

1. Predict the direction of acceleration before running the model.
2. Choose a horizontal surface or a fixed inclined plane.
3. Vary mass, an applied force parallel to the surface, kinetic friction and (on an incline) the angle.
4. Inspect the free-body diagram and compare the force magnitudes.
5. Relate the vector sum to acceleration, then to velocity and displacement from rest.
6. Open the mathematics and meaning sections for the level-appropriate explanation and model limits.

## Mathematical depth

- **Beginner:** balanced versus unbalanced forces; acceleration follows the net force.
- **Intermediate:** resolve weight into components parallel and perpendicular to the plane, sum forces and use Newton's second law.
- **Advanced:** formulate the equations in a local orthonormal basis and distinguish the tangential equation of motion from the normal constraint equation.

All levels use the same physical model and numerical results.

## Model contract

The pure TypeScript model uses a two-dimensional local basis: +x points up the surface and +y points away from it. The block is already sliding, kinetic friction opposes the tendency to slide, and the applied force is parallel to the surface. The normal acceleration is zero. Each trial starts from rest under a constant net force.

The model intentionally excludes static friction, rotation, ropes/pulleys, air resistance, changing contact and non-inertial frames. These are future extensions, not silently approximated features.
