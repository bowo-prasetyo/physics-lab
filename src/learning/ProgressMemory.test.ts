// @vitest-environment jsdom
import { createApp, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import App from '@/App.vue'
import { router } from '@/router'
import { setLocale } from '@/i18n'
import { resetExplored } from './session-progress'

describe('remembering progress on this device', () => {
  afterEach(() => { document.body.innerHTML = ''; localStorage.clear(); resetExplored(); setLocale('en') })

  it('offers a visible "forget" control with a shared-device note, and forgetting clears the device', async () => {
    setLocale('en')
    const root = document.createElement('div')
    document.body.append(root)
    const app = createApp(App)
    app.use(router)
    await router.push('/learning')
    await router.isReady()
    app.mount(root)
    await nextTick()

    const box = root.querySelector<HTMLInputElement>('.remember-toggle input')!
    expect(root.textContent).not.toContain('Forget progress on this device')
    box.click()
    await nextTick()
    expect(root.textContent).toContain('On a shared or school device, the next person will see this progress')
    expect(localStorage.getItem('physica.learning-progress.v1.enabled')).toBe('true')

    const forget = Array.from(root.querySelectorAll('button')).find((b) => b.textContent?.includes('Forget progress on this device'))!
    forget.click()
    await nextTick()
    expect(box.checked).toBe(false)
    // Only progress is forgotten; the interface language preference is not learner data.
    expect(Object.keys(localStorage).filter((key) => key.startsWith('physica.learning-progress'))).toEqual([])
    expect(root.textContent).not.toContain('Forget progress on this device')
    app.unmount()
  })
})
