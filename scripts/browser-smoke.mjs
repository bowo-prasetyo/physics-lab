import assert from 'node:assert/strict'
import { chromium, firefox, webkit } from 'playwright'

const engines = [['Chromium', chromium], ['Firefox', firefox], ['WebKit', webkit]]
const viewports = [
  { width: 390, height: 844, label: 'mobile' },
  { width: 1365, height: 900, label: 'desktop' },
]

for (const [name, engine] of engines) {
  const browser = await engine.launch({ headless: true })
  try {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport })
      const pageErrors = []
      page.on('pageerror', (error) => pageErrors.push(error.message))
      await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
      await page.locator('main').waitFor({ state: 'visible' })
      assert.equal(await page.title(), 'Physica', `${name} ${viewport.label}: document title`)
      assert.match(await page.locator('html').getAttribute('lang') ?? '', /^(en|id|ja)$/, `${name}: document language`)
      assert.ok(await page.locator('main h1, main h2').first().isVisible(), `${name} ${viewport.label}: visible page heading`)

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      assert.ok(overflow <= 2, `${name} ${viewport.label}: horizontal overflow is ${overflow}px`)

      const unnamed = await page.locator('a:visible, button:visible, input:visible, select:visible, textarea:visible, [role="button"]:visible, [role="link"]:visible').evaluateAll((elements) =>
        elements.flatMap((el) => {
          const labelledBy = el.getAttribute('aria-labelledby')
          const referenced = labelledBy ? labelledBy.split(/\\s+/).map((id) => document.getElementById(id)?.textContent ?? '').join(' ') : ''
          const label = el.getAttribute('aria-label') || referenced || el.getAttribute('title') ||
            el.textContent || el.querySelector('img[alt]')?.getAttribute('alt') ||
            (el.id ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`)?.textContent : '')
          return label?.trim() ? [] : [`${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}`]
        }),
      )
      assert.deepEqual(unnamed, [], `${name} ${viewport.label}: every visible control has an accessible name`)

      await page.keyboard.press('Tab')
      const focused = await page.evaluate(() => {
        const element = document.activeElement
        return Boolean(element && element !== document.body && element.getClientRects().length)
      })
      assert.ok(focused, `${name} ${viewport.label}: keyboard focus reaches a visible control`)
      assert.deepEqual(pageErrors, [], `${name} ${viewport.label}: no uncaught page errors`)
      await page.close()
      process.stdout.write(`PASS ${name} ${viewport.label}\\n`)
    }
  } finally {
    await browser.close()
  }
}
