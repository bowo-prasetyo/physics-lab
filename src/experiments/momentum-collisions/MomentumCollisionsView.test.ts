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

  it('keeps results hidden until a predicted collision completes and resets when inputs change', async () => {
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
    await router.push('/mechanics/momentum-collisions')
    root = document.createElement('div')
    document.body.append(root)
    app = createApp(App)
    app.use(router)
    app.mount(root)
    await router.isReady()
    await nextTick()

    expect(root.querySelector('.results')).toBeNull()
    const runButton = root.querySelector<HTMLButtonElement>('.run-button')
    expect(runButton).not.toBeNull()
    expect(runButton?.disabled).toBe(true)

    const prediction = root.querySelector<HTMLInputElement>('input[name="collision-prediction"][value="cart2"]')
    expect(prediction).not.toBeNull()
    if (!prediction) throw new Error('Prediction control was not rendered')
    prediction.checked = true
    prediction.dispatchEvent(new Event('change', { bubbles: true }))
    await nextTick()
    expect(runButton?.disabled).toBe(false)

    runButton?.click()
    await nextTick()
    expect(root.querySelector('.simulation')?.classList.contains('phase-approaching')).toBe(true)
    expect(root.querySelector('.results')).toBeNull()

    await new Promise(resolve => setTimeout(resolve, 1050))
    await nextTick()
    expect(root.querySelector('.simulation')?.classList.contains('phase-complete')).toBe(true)
    expect(root.querySelector('.results')).not.toBeNull()
    expect(root.querySelector('.results')?.textContent).toContain('Momentum before')

    const cart1Velocity = root.querySelectorAll<HTMLInputElement>('input[type="range"]')[2]
    expect(cart1Velocity).toBeDefined()
    if (!cart1Velocity) throw new Error('Cart 1 velocity control was not rendered')
    cart1Velocity.value = '-8'
    cart1Velocity.dispatchEvent(new Event('input', { bubbles: true }))
    cart1Velocity.dispatchEvent(new Event('change', { bubbles: true }))
    await nextTick()

    expect(root.querySelector('.results')).toBeNull()
    expect(root.textContent).toContain('No collision')
    expect(runButton?.disabled).toBe(true)
  }, 10_000)
})
