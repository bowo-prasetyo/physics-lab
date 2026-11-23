<script setup lang="ts">
import { MODULES } from '@/modules'
import { LEVELS } from '@/levels'

const availableCount = MODULES.reduce((count, module) => count + module.experiments.filter((experiment) => experiment.path).length, 0)
</script>

<template>
  <div class="home container">
    <section class="hero">
      <p class="eyebrow">An interactive physics laboratory</p>
      <h1>Understand physics by experimenting.</h1>
      <p class="lead">
        Change a physical setup, make a prediction, and see what happens. Then explore the mathematics behind the result—from a first
        introduction to more advanced treatments.
      </p>
      <div class="home-actions">
        <RouterLink class="btn btn-primary start" to="/space/space-vs-time">Start your first experiment <span aria-hidden="true">→</span></RouterLink>
        <RouterLink class="btn teacher-cta" to="/teachers">Teacher resources</RouterLink>
      </div>
      <ol class="method" aria-label="How Physica works">
        <li><strong>Predict</strong><span>What do you expect?</span></li>
        <li><strong>Experiment</strong><span>Change parameters and observe.</span></li>
        <li><strong>Explain</strong><span>Connect the result to physics.</span></li>
      </ol>
    </section>

    <section id="experiments" class="explore" aria-labelledby="experiments-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Learn by doing</p>
          <h2 id="experiments-title">Explore experiments</h2>
          <p class="muted">{{ availableCount }} interactive experiments across six modules. Choose a topic to get started.</p>
        </div>
      </div>

      <div class="modules">
        <article v-for="module in MODULES" :key="module.number" class="module-card card">
          <div class="module-heading">
            <span class="module-number">0{{ module.number }}</span>
            <div>
              <p class="module-audience">{{ module.audience }}</p>
              <h3>{{ module.title }}</h3>
            </div>
          </div>
          <ul class="experiments">
            <li v-for="experiment in module.experiments" :key="experiment.title">
              <RouterLink v-if="experiment.path" :to="experiment.path" class="experiment-link">
                <span class="experiment-title">{{ experiment.title }}</span>
                <span class="experiment-summary">{{ experiment.summary }}</span>
                <span class="experiment-arrow" aria-hidden="true">→</span>
              </RouterLink>
              <div v-else class="planned-experiment">
                <span class="experiment-title">{{ experiment.title }} <span class="planned-badge">Planned</span></span>
                <span class="experiment-summary">{{ experiment.summary }}</span>
              </div>
            </li>
          </ul>
          <details v-if="module.plannedTopics.length" class="module-more">
            <summary>More topics planned for this module</summary>
            <ul>
              <li v-for="topic in module.plannedTopics" :key="topic">{{ topic }}</li>
            </ul>
          </details>
        </article>
      </div>
    </section>

    <section class="levels-section" aria-labelledby="levels-title">
      <div>
        <p class="eyebrow">Choose your depth</p>
        <h2 id="levels-title">Three levels, one experiment</h2>
        <p class="muted levels-intro">
          The physical setup, assumptions, and observed results stay the same at every level. Only the mathematical tools and depth of
          explanation change. Switch levels at the top of the page at any time.
        </p>
      </div>
      <div class="levels">
        <article v-for="info in LEVELS" :key="info.id" class="level-card card">
          <h3>{{ info.label }}</h3>
          <p class="level-audience">{{ info.audience }}</p>
          <p>{{ info.maths }}</p>
        </article>
      </div>
      <p class="level-note"><strong>Important:</strong> Advanced does not mean a different or more speculative version of the physics. It means a deeper mathematical treatment of the same model, with its assumptions and limits made explicit.</p>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding-top: 36px;
  padding-bottom: 56px;
}
.hero {
  padding: 8px 0 4px;
}
.eyebrow {
  margin: 0 0 8px;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 750;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}
.hero h1 {
  max-width: 19ch;
  margin-bottom: 12px;
  font-size: clamp(2.1rem, 5vw, 3.2rem);
  letter-spacing: -0.035em;
}
.lead {
  max-width: 65ch;
  margin-bottom: 20px;
  color: var(--text-muted);
  font-size: 1.12rem;
}
.home-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.start, .teacher-cta {
  min-height: 46px;
  text-decoration: none;
}
.method {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  max-width: 850px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
}
.method li {
  display: grid;
  gap: 3px;
  padding: 12px 14px;
  border-left: 3px solid var(--accent);
  background: var(--surface);
}
.method strong { font-size: 0.92rem; }
.method span { color: var(--text-muted); font-size: 0.84rem; }
.section-heading { margin-bottom: 18px; }
.section-heading h2, .levels-section h2 { margin-bottom: 6px; }
.section-heading p:last-child { margin-bottom: 0; }
.modules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 310px), 1fr));
  gap: 14px;
}
.module-card {
  padding: 18px;
}
.module-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.module-number {
  display: grid;
  place-items: center;
  flex: 0 0 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 0.9rem;
  font-weight: 750;
}
.module-audience {
  margin: 0 0 2px;
  color: var(--text-muted);
  font-size: 0.75rem;
}
.module-heading h3 { margin: 0; }
.experiments {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.experiment-link, .planned-experiment {
  position: relative;
  display: grid;
  gap: 3px;
  padding: 11px 32px 11px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  text-decoration: none;
}
.experiment-link {
  color: var(--text);
  background: var(--surface);
}
.experiment-link:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
}
.experiment-title { font-weight: 700; }
.experiment-summary { color: var(--text-muted); font-size: 0.84rem; line-height: 1.4; }
.experiment-arrow {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: var(--accent);
  font-size: 1.1rem;
}
.planned-experiment {
  padding-right: 12px;
  background: var(--surface-2);
  color: var(--text-muted);
}
.planned-badge {
  display: inline-block;
  margin-left: 4px;
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--border);
  font-size: 0.68rem;
  vertical-align: 2px;
}
.module-more {
  margin-top: 12px;
  color: var(--text-muted);
  font-size: 0.82rem;
}
.module-more summary { cursor: pointer; color: var(--accent); font-weight: 600; }
.module-more ul { display: grid; gap: 5px; padding-left: 18px; }
.levels-section { display: grid; gap: 16px; }
.levels-intro { max-width: 75ch; margin: 0; }
.levels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 12px;
}
.level-card { padding: 16px 18px; }
.level-card h3 { margin-bottom: 3px; }
.level-card p { margin: 0; }
.level-card .level-audience { margin-bottom: 8px; color: var(--text-muted); font-size: 0.82rem; }
.level-note {
  max-width: 85ch;
  margin: 0;
  padding: 12px 14px;
  border-left: 3px solid var(--accent);
  background: var(--surface);
  color: var(--text-muted);
  font-size: 0.9rem;
}
.level-note strong { color: var(--text); }
@media (max-width: 620px) {
  .home { gap: 36px; padding-top: 26px; }
  .method { grid-template-columns: 1fr; gap: 7px; margin-top: 20px; }
  .method li { grid-template-columns: 105px 1fr; align-items: baseline; }
}
</style>
