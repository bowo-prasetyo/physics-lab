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
