// @vitest-environment jsdom
import { createApp, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import App from '@/App.vue'
import { router } from '@/router'
import { setLocale } from '@/i18n'

describe('Momentum and Collisions Lab interaction', () => {
  let app: ReturnType<typeof createApp> | undefined
  let root: HTMLDivElement | undefined
  let originalResizeObserver: typeof ResizeObserver | undefined

  afterEach(() => {
    app?.unmount()
    root?.remove()
    app = undefined
    root = undefined
    setLocale('en')
    if (originalResizeObserver) globalThis.ResizeObserver = originalResizeObserver
    else delete (globalThis as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver
  })

  it('hides results until the collision has run, and unlocks explanations only after the matching run', async () => {
    document.body.innerHTML = ''
    window.matchMedia ??= ((media: string) => ({
      matches: false, media, onchange: null,
      addListener: () => undefined, removeListener: () => undefined,
      addEventListener: () => undefined, removeEventListener: () => undefined,
      dispatchEvent: () => false,
    })) as typeof window.matchMedia
    originalResizeObserver = globalThis.ResizeObserver
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver

    setLocale('en')
    await router.push('/mechanics/momentum-collisions?level=beginner&m1=2&m2=2&v1=4&v2=0&e=1')
    root = document.createElement('div')
    document.body.append(root)
    app = createApp(App)
    app.use(router)
    app.mount(root)
    await router.isReady()
    await nextTick()

    // The shared prediction cards: lock in an answer to the first question.
    const firstCard = root.querySelector<HTMLElement>('article.prediction')
    expect(firstCard).not.toBeNull()
    const option = firstCard?.querySelector<HTMLInputElement>('input[type="radio"][value="swap"]')
    if (!option) throw new Error('Prediction option was not rendered')
    option.checked = true
    option.dispatchEvent(new Event('change', { bubbles: true }))
    await nextTick()
    firstCard?.querySelector<HTMLButtonElement>('button[type="submit"]')?.click()
    await nextTick()
    expect(firstCard?.querySelector('.observe')).not.toBeNull()

    const runButton = root.querySelector<HTMLButtonElement>('.run-button')
    expect(runButton?.disabled).toBe(false)
    expect(root.querySelector('.results')).toBeNull()

    runButton?.click()
    await nextTick()
    expect(root.querySelector('.simulation')?.classList.contains('phase-approaching')).toBe(true)
    expect(runButton?.disabled).toBe(true)
    expect(root.querySelector('#collision-run-guidance')?.textContent).toContain('animation is running')
    expect(root.querySelector('.results')).toBeNull()

    await new Promise(resolve => setTimeout(resolve, 1050))
    await nextTick()
    expect(root.querySelector('.simulation')?.classList.contains('phase-complete')).toBe(true)
    expect(root.querySelector('.results')?.textContent).toContain('Momentum before')
    // Equal masses, cart 2 at rest, e = 1: the run that tests question 1.
    expect(firstCard?.querySelector('.explain')).not.toBeNull()
    expect(firstCard?.querySelector('.verdict')?.textContent).toContain('matches')

    // Changing the setup hides the old results until the next run.
    const cart1Velocity = root.querySelectorAll<HTMLInputElement>('input[type="range"]')[2]
    if (!cart1Velocity) throw new Error('Cart 1 velocity control was not rendered')
    cart1Velocity.value = '-8'
    cart1Velocity.dispatchEvent(new Event('input', { bubbles: true }))
    cart1Velocity.dispatchEvent(new Event('change', { bubbles: true }))
    await nextTick()
    expect(root.querySelector('.results')).toBeNull()
    expect(root.textContent).toContain('No collision')
    expect(runButton?.disabled).toBe(true)
    expect(root.querySelector('#collision-run-guidance')?.textContent).toContain('v₁ > v₂')
    expect(runButton?.getAttribute('aria-describedby')).toBe('collision-run-guidance')
    // The answered question stays answered.
    expect(firstCard?.querySelector('.explain')).not.toBeNull()
  }, 10_000)
})
