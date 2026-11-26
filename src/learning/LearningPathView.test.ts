// @vitest-environment jsdom
import { createSSRApp, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it } from 'vitest'
import App from '@/App.vue'
import { router } from '@/router'
import { setLocale } from '@/i18n'
import { useLevel } from '@/composables/useLevel'
import { PROBLEM_COPY } from './problem-bank'
import { markExplored, resetExplored } from './session-progress'

async function render(path: string): Promise<string> {
  const app = createSSRApp(App)
  app.use(router)
  await router.push(path)
  await router.isReady()
  await nextTick()
  return renderToString(app)
}

describe('learning path: Apply it', () => {
  afterEach(() => {
    resetExplored()
    useLevel().value = 'beginner'
    setLocale('en')
  })

  it('keeps problems locked until the experiment has been explored', async () => {
    setLocale('en')
    const html = await render('/learning?module=2')
    expect(html).toContain('Questions and problems unlock once you have tested a prediction in this experiment.')
    expect(html).not.toContain('Apply it')
  })

  it('unlocks visual graph interpretation only after the matching experiment is explored', async () => {
    setLocale('en')
    let html = await render('/learning?module=1')
    expect(html).not.toContain('Read a position–time graph')
    markExplored('/space/space-vs-time')
    html = await render('/learning?module=1')
    expect(html).toContain('Read a position–time graph')
    expect(html).toContain('Graph of position x against time t.') // the experiments' own graph component
    expect(html).toContain('What is the object doing between 2 s and 4 s?')
    expect(html).not.toContain('What is the object’s average velocity') // Intermediate: hidden at Beginner
  })

  it('shows the step’s problems once explored, adding harder ones at higher levels', async () => {
    setLocale('en')
    markExplored('/time/pendulum')
    let html = await render('/learning?module=2')
    expect(html).toContain('Apply it')
    expect(html).toContain(PROBLEM_COPY.en['pendulum-period']!.scenario.slice(0, 40))
    expect(html).not.toContain(PROBLEM_COPY.en['pendulum-moon']!.scenario.slice(0, 40))
    expect(html).not.toContain(PROBLEM_COPY.en['pendulum-amplitude']!.scenario.slice(0, 40))

    useLevel().value = 'advanced'
    html = await render('/learning?module=2')
    expect(html).toContain(PROBLEM_COPY.en['pendulum-moon']!.scenario.slice(0, 40))
    expect(html).toContain(PROBLEM_COPY.en['pendulum-amplitude']!.scenario.slice(0, 40))
  })

  it('renders problem labels from the translation system', async () => {
    setLocale('ja')
    markExplored('/time/pendulum')
    const html = await render('/learning?module=2')
    expect(html).toContain('応用してみよう')
    expect(html).toContain('あなたの答え')
    expect(html).toContain(PROBLEM_COPY.ja['pendulum-period']!.title)
  })
})

describe('learning path: synthesis questions', () => {
  afterEach(() => {
    resetExplored()
    useLevel().value = 'beginner'
    setLocale('en')
  })

  it('appear only once their own step is explored, and wait for the other experiment', async () => {
    useLevel().value = 'intermediate'
    let html = await render('/learning?module=3')
    expect(html).not.toContain('Connect experiments') // the projectile step itself is still locked

    markExplored('/mechanics/projectile')
    html = await render('/learning?module=3')
    expect(html).toContain('Connect experiments')
    expect(html).toContain('Combines this experiment with “Force Lab: free-body diagrams and multiple forces”.')
    expect(html).toContain('Unlocks once you have also explored:')
    expect(html).not.toContain('A steady horizontal net force now acts on it')

    markExplored('/mechanics/force-lab')
    html = await render('/learning?module=3')
    expect(html).toContain('A steady horizontal net force now acts on it')
  })

  it('are hidden at Beginner, like every harder question, and use the catalogue names in Japanese', async () => {
    markExplored('/mechanics/projectile')
    expect(await render('/learning?module=3')).not.toContain('Connect experiments')
    useLevel().value = 'intermediate'
    setLocale('ja')
    expect(await render('/learning?module=3')).toContain('この実験と「力の実験室：自由物体図と複数の力」を組み合わせます。')
  })
})

describe('home page front door', () => {
  it('has exactly one call to action, which starts the learning path', async () => {
    setLocale('en')
    const html = await render('/')
    const hero = html.slice(html.indexOf('class="hero"'), html.indexOf('id="experiments"'))
    const buttons = hero.match(/class="btn[^"]*"/g) ?? []
    expect(buttons).toHaveLength(1)
    expect(hero).toContain('href="#/learning"')
    expect(hero).toContain('Start the learning path')
    expect(html).not.toContain('problem-solving')
  })
})
