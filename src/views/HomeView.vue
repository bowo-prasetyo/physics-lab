<script setup lang="ts">
import { MODULES } from '@/modules'
import { LEVELS } from '@/levels'
</script>

<template>
  <div class="home container">
    <section class="hero">
      <h1>Explore how space and time are related, by experimenting</h1>
      <p class="lead">
        Each experiment starts with something you can see and change. You predict, observe and only then meet the mathematics that
        describes it, at the level that suits you.
      </p>
      <ol class="method">
        <li><strong>Phenomenon.</strong> Start from something physical.</li>
        <li><strong>Predict.</strong> Commit to what you think will happen.</li>
        <li><strong>Experiment.</strong> Change parameters and observe.</li>
        <li><strong>Mathematics.</strong> Describe what you saw.</li>
        <li><strong>Meaning.</strong> Separate established physics from interpretation.</li>
      </ol>
      <RouterLink class="btn btn-primary start" to="/space/space-vs-time">Start with Experiment A: space versus time</RouterLink>
    </section>

    <section aria-labelledby="levels-title">
      <h2 id="levels-title">Three levels, one phenomenon</h2>
      <p class="muted">Pick a level at the top of any page. The experiment stays the same; only the depth of the mathematics changes.</p>
      <div class="levels">
        <div v-for="info in LEVELS" :key="info.id" class="card level">
          <h3>{{ info.label }}</h3>
          <p class="muted">{{ info.audience }}</p>
          <p>{{ info.maths }}</p>
        </div>
      </div>
    </section>

    <section aria-labelledby="modules-title">
      <h2 id="modules-title">Modules</h2>
      <p class="muted">Each module distinguishes what current experiments cover from important topics still planned. A topic appearing in the roadmap is not a claim that it is already taught.</p>
      <div class="modules">
        <article v-for="module in MODULES" :key="module.number" class="card module">
          <p class="module-no">Module {{ module.number }} · {{ module.audience }}</p>
          <h3>{{ module.title }}</h3>
          <h4 class="scope-title">Explored now</h4>
          <p class="topics muted">{{ module.coverage.join(' · ') }}</p>
          <h4 class="scope-title">Planned coverage</h4>
          <p class="topics muted">{{ module.plannedTopics.join(' · ') }}</p>
          <ul class="experiments">
            <li v-for="exp in module.experiments" :key="exp.title" :class="{ planned: !exp.path }">
              <RouterLink v-if="exp.path" :to="exp.path" class="exp-title">{{ exp.title }}</RouterLink>
              <span v-else class="exp-title">{{ exp.title }} <span class="badge">Planned</span></span>
              <span class="muted exp-summary">{{ exp.summary }}</span>
            </li>
          </ul>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-top: 40px;
  padding-bottom: 56px;
}

.hero h1 {
  max-width: 24ch;
}

.lead {
  max-width: 62ch;
  font-size: 1.15rem;
  color: var(--text-muted);
}

.method {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 8px;
  margin: 20px 0 24px;
  padding: 0;
  list-style: none;
  counter-reset: step;
}

.method li {
  counter-increment: step;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  font-size: 0.92rem;
}

.method li::before {
  content: counter(step);
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  margin-right: 8px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 700;
  font-size: 0.8rem;
}

.start {
  text-decoration: none;
  min-height: 46px;
  text-align: center;
}

.levels,
.modules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.level p {
  margin: 0;
}

.module-no {
  margin: 0 0 4px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--accent);
}

.scope-title {
  margin: 12px 0 4px;
  font-size: 0.82rem;
  font-weight: 700;
}

.topics {
  font-size: 0.9rem;
  margin: 0;
}

.experiments {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.experiments li {
  display: grid;
  gap: 2px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

.exp-title {
  font-weight: 650;
}

.planned .exp-title {
  color: var(--text-muted);
}

.exp-summary {
  font-size: 0.9rem;
}

.badge {
  display: inline-block;
  margin-left: 4px;
  padding: 0 7px;
  border-radius: 999px;
  background: var(--surface-2);
  font-size: 0.72rem;
  font-weight: 700;
  vertical-align: 2px;
}

@media (max-width: 480px) {
  .levels,
  .modules,
  .method {
    grid-template-columns: 1fr;
  }
}
</style>
