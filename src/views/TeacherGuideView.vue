<script setup lang="ts">
const lessons = [
  {
    module: 'Module 1 · Understanding space',
    title: 'Position, distance and displacement',
    time: '35–45 minutes',
    links: [{ label: 'Space versus time', to: '/space/space-vs-time' }, { label: 'Displacement in 3D', to: '/space/displacement-3d' }],
    outcomes: ['Describe position relative to an origin.', 'Distinguish path length from displacement.', 'Explain why coordinate changes do not change a geometric displacement.'],
    sequence: ['Ask learners to describe a journey without using a map. What information is missing?', 'Have pairs predict whether distance travelled and displacement must be equal.', 'Explore a journey in 3D, then change the coordinate frame and compare the components.', 'Ask learners to explain what changed and what stayed invariant.'],
    prompts: ['Can two different paths have the same displacement?', 'Can an object travel a non-zero distance and have zero displacement?', 'Which quantities depend on the coordinate origin?'],
    check: 'Give a new journey with a return to the starting point. Ask learners to state its distance and displacement separately.',
  },
  {
    module: 'Module 2 · Understanding time',
    title: 'What does a clock measure?',
    time: '35–45 minutes',
    links: [{ label: 'Pendulum clocks', to: '/time/pendulum' }],
    outcomes: ['Relate period and frequency.', 'Identify the variables that affect a pendulum period.', 'Explain why a physical clock must be calibrated for its environment.'],
    sequence: ['Show a pendulum and ask what could make its ticking faster or slower.', 'Ask learners to predict the effects of changing length, mass and release angle.', 'Vary one parameter at a time and record the measured period.', 'Compare the small-angle prediction with larger swings and discuss model limits.'],
    prompts: ['Does a heavier bob swing faster?', 'When does the small-angle approximation become less reliable?', 'What would happen to a pendulum clock on the Moon?'],
    check: 'Ask learners to diagnose a clock that loses time after being moved to a different gravitational environment.',
  },
  {
    module: 'Module 3 · Classical mechanics',
    title: 'From net force to motion',
    time: '45–60 minutes',
    links: [{ label: 'Force, mass and acceleration', to: '/mechanics/newtonian' }, { label: 'Projectile launcher', to: '/mechanics/projectile' }],
    outcomes: ['Use the net force, rather than one isolated force, to reason about acceleration.', 'Predict how acceleration changes with force and mass.', 'Connect constant downward gravitational acceleration to projectile motion.'],
    sequence: ['Ask what makes a moving cart speed up, slow down or change direction.', 'Have learners predict the acceleration when force doubles and when mass doubles.', 'Use the force-and-mass investigation, changing one variable at a time; record trial values.', 'Transfer the idea to a projectile: identify gravity as the net vertical force in the ideal model.', 'Discuss why a projectile can have horizontal velocity while accelerating vertically.'],
    prompts: ['If an object is moving, must there be a net force in the direction of motion?', 'What is the difference between an applied force and the net force?', 'Why does a horizontally thrown ball accelerate downward?'],
    check: 'Present two carts with different masses and equal net forces. Ask learners to compare accelerations and justify the answer using a = F_net/m.',
  },
  {
    module: 'Module 4 · Special relativity',
    title: 'Observers, clocks and spacetime',
    time: '50–70 minutes',
    links: [{ label: 'Different clocks, different elapsed times', to: '/relativity/moving-clocks' }, { label: 'Space and time versus spacetime', to: '/relativity/two-perspectives' }],
    outcomes: ['Interpret worldlines and simultaneity lines.', 'Explain time dilation without treating reciprocal descriptions as contradictory.', 'Separate invariant interval from frame-dependent coordinates.'],
    sequence: ['Ask learners to predict what two inertial observers say about each other’s clock.', 'Compare the same events from each frame on the spacetime diagram.', 'Identify the different simultaneity slices before discussing elapsed times.', 'Use the alternative-description lesson to compare predictions with evidence.'],
    prompts: ['Which events are shared by both observers?', 'What does each observer mean by “at the same time”?', 'Which quantities are invariant?'],
    check: 'Give a new pair of events and ask learners to identify what changes under a frame transformation and what does not.',
  },
  {
    module: 'Module 5 · General relativity',
    title: 'Gravity and clock rates',
    time: '45–60 minutes',
    links: [{ label: 'Gravity and clock rates', to: '/gravity/clock-rates' }],
    outcomes: ['Compare clock rates at different gravitational potentials in the stated model.', 'Distinguish gravitational and kinematic GPS corrections.', 'Identify assumptions of the Schwarzschild exterior.'],
    sequence: ['Ask whether two identical clocks must always remain synchronised.', 'Compare clocks at different heights and inspect the model’s stated geometry.', 'Separate gravitational and kinematic contributions in the GPS example.', 'Discuss why a static Schwarzschild model is not a complete description of every gravitational situation.'],
    prompts: ['What is being held fixed in this comparison?', 'Why is the GPS correction not purely gravitational?', 'Which conclusions depend on the Schwarzschild assumptions?'],
    check: 'Ask learners to explain why the two GPS correction terms have opposite signs.',
  },
  {
    module: 'Module 6 · Cosmology',
    title: 'A model universe changes with time',
    time: '45–60 minutes',
    links: [{ label: 'Evolving space', to: '/cosmology/evolving-space' }],
    outcomes: ['Interpret the scale factor and redshift.', 'Compare expansion histories for different model contents.', 'Recognise the limits of extrapolating a classical model.'],
    sequence: ['Ask learners what it means for distant galaxies to recede as the universe expands.', 'Run different model universes and compare their scale-factor histories.', 'Relate a(t) to redshift and the Hubble rate.', 'Identify which claims are model outputs and which require observational evidence.'],
    prompts: ['Does expansion require a centre in space?', 'Can recession speed exceed c without local objects travelling through space faster than light?', 'What does the model not tell us about the earliest universe?'],
    check: 'Ask learners to explain what a redshift measurement can constrain and why a model choice is still required.',
  },
]
</script>

<template>
  <article class="teacher container">
    <header class="teacher-head">
      <p class="eyebrow">For educators · Classroom planning</p>
      <h1>Teacher guide</h1>
      <p class="lead">A practical starting point for using Physics Lab in demonstrations, guided investigations and classroom discussion. Each outline connects a lesson intention to a prediction, an experiment and a check for understanding.</p>
      <div class="teacher-actions">
        <a class="btn btn-primary" href="#lesson-plans">Browse lesson outlines</a>
        <RouterLink class="btn" to="/">Explore learner experiments</RouterLink>
      </div>
    </header>

    <section class="card teacher-note">
      <h2>Before class</h2>
      <ul>
        <li>Open the experiment and check that it works on the classroom device and display.</li>
        <li>Choose the mathematical level to match the learning objective—not simply the learners’ age.</li>
        <li>Set up a reproducible example, then share its URL with learners. Experiment settings and level are encoded in the link where supported.</li>
        <li>Ask learners to predict before revealing explanations. Treat an incorrect prediction as useful evidence about their current model.</li>
      </ul>
      <p class="muted small">These are teaching aids, not a learning-management system. The app does not create classes, collect student identities, grade submissions or track learner progress.</p>
    </section>

    <section id="lesson-plans" aria-labelledby="plans-title">
      <h2 id="plans-title">Lesson outlines</h2>
      <p class="muted">Suggested timings are starting points. Adjust them for prior knowledge, class size and discussion time.</p>
      <div class="lesson-grid">
        <article v-for="lesson in lessons" :key="lesson.module" class="card lesson-card">
          <p class="eyebrow">{{ lesson.module }}</p>
          <h3>{{ lesson.title }}</h3>
          <p class="time">{{ lesson.time }}</p>
          <h4>Learning intentions</h4>
          <ul><li v-for="outcome in lesson.outcomes" :key="outcome">{{ outcome }}</li></ul>
          <h4>Suggested sequence</h4>
          <ol><li v-for="step in lesson.sequence" :key="step">{{ step }}</li></ol>
          <h4>Discussion prompts</h4>
          <ul><li v-for="prompt in lesson.prompts" :key="prompt">{{ prompt }}</li></ul>
          <h4>Check for understanding</h4>
          <p>{{ lesson.check }}</p>
          <div class="lesson-links">
            <RouterLink v-for="link in lesson.links" :key="link.to" :to="link.to">{{ link.label }}</RouterLink>
          </div>
        </article>
      </div>
    </section>

    <section class="card teacher-note">
      <h2>Assessment and inclusion</h2>
      <ul>
        <li>Use a short pre-question and a changed-context follow-up question; a correct guess alone is not evidence of understanding.</li>
        <li>Invite learners to explain the observation in words, with a sketch, or with equations appropriate to their preparation.</li>
        <li>For learners who need more support, reduce the number of variables and change one setting at a time. For extension, ask them to derive a relationship or identify the model’s limits.</li>
        <li>Do not interpret time spent, number of clicks or experiment completion as proof of learning.</li>
      </ul>
      <p>For the measurement framework, see <RouterLink to="/">the product's learning approach</RouterLink> and the <a href="https://github.com/bowo-prasetyo/physics-lab/blob/main/docs/product/LEARNING_EFFECTIVENESS.md">learning-effectiveness guidance</a>.</p>
    </section>
  </article>
</template>

<style scoped>
.teacher { display: flex; flex-direction: column; gap: 28px; padding-top: 40px; padding-bottom: 56px; }
.teacher-head { max-width: 760px; }
.lead { max-width: 68ch; font-size: 1.1rem; color: var(--text-muted); }
.teacher-actions, .lesson-links { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
.teacher-actions a { text-decoration: none; }
.teacher-note { max-width: 900px; }
.small { font-size: .85rem; }
.lesson-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr)); gap: 16px; }
.lesson-card { display: flex; flex-direction: column; align-items: flex-start; }
.lesson-card .eyebrow { margin: 0 0 4px; font-size: .78rem; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: .04em; }
.lesson-card h3 { margin-bottom: 4px; }
.lesson-card h4 { margin: 14px 0 4px; font-size: .9rem; }
.lesson-card ul, .lesson-card ol { margin: 0; padding-left: 22px; }
.lesson-card li { margin: 3px 0; }
.time { color: var(--text-muted); font-size: .9rem; }
.lesson-links { margin-top: auto; padding-top: 16px; }
@media print {
  .teacher { max-width: none; padding: 0; }
  .teacher-actions { display: none; }
  .lesson-grid { display: block; }
  .lesson-card, .teacher-note { break-inside: avoid; box-shadow: none; margin-bottom: 14px; }
}
</style>
