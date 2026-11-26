// @vitest-environment jsdom
import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { setLocale } from '@/i18n'
import { getLearningPath } from './learning-content'
import ChapterReview from './ChapterReview.vue'

describe('chapter review', () => {
  afterEach(() => { document.body.innerHTML = ''; setLocale('en') })

  it('shows each answer’s explanation after checking, and never a score', async () => {
    setLocale('en')
    const path = getLearningPath('en')
    const questions = path.chapters.flatMap((c) => c.steps).flatMap((s) => s.questions).slice(0, 7)
    const root = document.createElement('div')
    document.body.append(root)
    const app = createApp({ render: () => h(ChapterReview, { questions, seed: 3, ui: path.ui }) })
    app.mount(root)
    root.querySelector<HTMLButtonElement>('.btn-primary')!.click()
    await nextTick()
    const items = root.querySelectorAll('.review-questions > li')
    expect(items).toHaveLength(5)
    for (const item of Array.from(items)) item.querySelector<HTMLInputElement>('input[type=radio]')!.click()
    await nextTick()
    root.querySelector<HTMLButtonElement>('.actions .btn-primary')!.click()
    await nextTick()
    expect(root.querySelectorAll('.answer-review')).toHaveLength(5)
    expect(root.textContent).toContain('Why?')
    expect(root.textContent).not.toMatch(/\d+\s*(of|\/)\s*5/) // no '3 of 5' or '3/5'
    expect(root.querySelector('[class*=score]')).toBeNull()
    app.unmount()
  })
})
