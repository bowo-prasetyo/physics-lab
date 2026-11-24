// @vitest-environment jsdom
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createApp, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import App from '@/App.vue'
import { router } from '@/router'
import { localizeForceLabText } from '@/experiments/force-lab/copy'
import { setLocale, SUPPORTED_LOCALES, type Locale } from './index'

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/teachers', name: 'teachers' },
  { path: '/mechanics/newtonian', name: 'newtonian' },
  { path: '/space/space-vs-time', name: 'space-vs-time' },
  { path: '/relativity/moving-clocks', name: 'moving-clocks' },
  { path: '/relativity/two-perspectives', name: 'two-perspectives' },
  { path: '/gravity/clock-rates', name: 'gravity-clocks' },
  { path: '/cosmology/evolving-space', name: 'evolving-space' },
  { path: '/mechanics/projectile', name: 'projectile' },
  { path: '/time/pendulum', name: 'pendulum' },
  { path: '/space/displacement-3d', name: 'displacement-3d' },
  // Each Force Lab difficulty is mounted independently so conditional lessons are checked.
  { path: '/mechanics/force-lab?level=beginner', name: 'force-lab-beginner', difficultyLevel: 'beginner' },
  { path: '/mechanics/force-lab?level=intermediate', name: 'force-lab-intermediate', difficultyLevel: 'intermediate' },
  { path: '/mechanics/force-lab?level=advanced', name: 'force-lab-advanced', difficultyLevel: 'advanced' },
] as const

const REVIEWED_ATTRIBUTES = [
  'aria-label', 'aria-description', 'aria-valuetext', 'alt', 'title', 'placeholder',
] as const
const INTENTIONALLY_SHARED_COPY = new Set([
  'English', 'Bahasa Indonesia', 'Physica', 'MIT License', 'LEARNING_EFFECTIVENESS.md',
])

type CopyRecord = {
  kind: 'visible-text' | 'accessibility-attribute'
  attribute?: string
  text: string
}
type Candidate = CopyRecord & { route: string; locale: Exclude<Locale, 'en'>; states: string[] }

function normalize(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function isEnglishLike(value: string): boolean {
  if (INTENTIONALLY_SHARED_COPY.has(value)) return false
  if (/^[A-Z0-9_-]+(?:\.[A-Z0-9_-]+)+$/.test(value)) return false
  if (/^\d+(?:[.,]\d+)?\s+(?:Gly|Gyr)$/.test(value)) return false
  const words = value.match(/[A-Za-z]{3,}/g) ?? []
  return words.length > 0 && value.length >= 5 && !/^https?:\/\//i.test(value)
    && !/^[A-Z\d\s._:+\/()–—-]+$/.test(value)
}

function collectCopy(root: HTMLElement): CopyRecord[] {
  const records: CopyRecord[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    const parent = node.parentElement
    if (!parent || parent.closest('script, style, pre, code, math, [aria-hidden="true"]')) continue
    const text = normalize(node.textContent ?? '')
    if (isEnglishLike(text)) records.push({ kind: 'visible-text', text })
  }
  for (const element of Array.from(root.querySelectorAll<HTMLElement>('*'))) {
    if (element.closest('script, style, pre, code, math, [aria-hidden="true"]')) continue
    for (const attribute of REVIEWED_ATTRIBUTES) {
      const value = normalize(element.getAttribute(attribute) ?? '')
      if (value && isEnglishLike(value)) records.push({ kind: 'accessibility-attribute', attribute, text: value })
    }
  }
  return records
}

function recordKey(record: CopyRecord): string {
  return [record.kind, record.attribute ?? '', record.text].join('::')
}

function accessibleName(element: Element, root: HTMLElement): string {
  const explicit = normalize(element.getAttribute('aria-label') ?? '')
  if (explicit) return explicit
  const ids = (element.getAttribute('aria-labelledby') ?? '').split(/\s+/).filter(Boolean)
  const labelledBy = ids.map((id) => Array.from(root.querySelectorAll<HTMLElement>('[id]'))
    .find((candidate) => candidate.id === id)?.textContent ?? '').map(normalize).filter(Boolean).join(' ')
  if (labelledBy) return labelledBy
  const title = normalize(element.getAttribute('title') ?? '')
  if (title) return title
  if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
    const labels = Array.from(element.labels ?? []).map((label) => normalize(label.textContent ?? '')).filter(Boolean)
    if (labels.length) return labels.join(' ')
  }
  const label = element.closest('label')
  if (label) return normalize(label.textContent ?? '')
  const clone = element.cloneNode(true) as Element
  clone.querySelectorAll('[aria-hidden="true"]').forEach((hidden) => hidden.remove())
  return normalize(clone.textContent ?? '')
}

function dispatchControlEvent(element: Element, type: string): void {
  element.dispatchEvent(new Event(type, { bubbles: true }))
}

function controlDescription(element: Element, index: number): string {
  const tag = element.tagName.toLowerCase()
  const type = element instanceof HTMLInputElement ? element.type : ''
  return tag + (type ? ':' + type : '') + '#' + index
}

async function settle(): Promise<void> {
  await nextTick()
  await new Promise((resolveTick) => setTimeout(resolveTick, 0))
  await nextTick()
}


function verifyForceLabDifficulty(root: HTMLElement, level: 'beginner' | 'intermediate' | 'advanced', locale: Locale): void {
  const renderedText = normalize(root.textContent ?? '')
  const beginnerCopy = localizeForceLabText('Beginner: balanced forces cancel. Static friction can take any value needed for rest, up to its maximum. If the tendency to slide exceeds that maximum, kinetic friction acts while the block slides.', locale)
  const intermediateCopy = localizeForceLabText('Intermediate: resolve each force into components parallel and perpendicular to the surface, then compare the tangential tendency with the maximum static friction.', locale)
  const advancedCopy = localizeForceLabText('Advanced: at rest, friction is a constraint force that takes the value required by tangential equilibrium, provided that value does not exceed the Coulomb limit. Beyond the threshold, the model switches to kinetic friction opposite the impending motion.', locale)

  expect(renderedText, 'Force Lab beginner explanation must be visible in every difficulty').toContain(beginnerCopy)
  expect(renderedText.includes(intermediateCopy), 'Intermediate explanation visibility must match the selected difficulty').toBe(level !== 'beginner')
  expect(renderedText.includes(advancedCopy), 'Advanced explanation visibility must match the selected difficulty').toBe(level === 'advanced')
}

/** Exercise each user-editable control and safe in-page action, recording each resulting state. */
async function exercisePage(root: HTMLElement, route: string, locale: Locale, snapshots: Map<string, CopyRecord[]>, stats: { controls: number; buttons: number; disclosures: number; states: number }, accessibilityIssues: Array<{ route: string; locale: Locale; state: string; element: string }>, languageIssues: Array<{ route: string; locale: Locale; state: string; actual: string }>): Promise<void> {
  const save = (state: string) => {
    snapshots.set([route, locale, state].join('::'), collectCopy(root))
    const selectors = 'button, input:not([type="hidden"]), select, textarea, a[href], summary, [role="button"], [role="img"], svg[role="group"]'
    for (const element of Array.from(root.querySelectorAll(selectors))) {
      if (!accessibleName(element, root)) accessibilityIssues.push({ route, locale, state, element: element.tagName.toLowerCase() })
    }
    if (document.documentElement.lang !== locale) languageIssues.push({ route, locale, state, actual: document.documentElement.lang })
    stats.states += 1
  }
  save('default')

  const controls = Array.from(root.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    'main input:not([type="hidden"]), main select, main textarea',
  ))
  for (let index = 0; index < controls.length; index += 1) {
    const element = controls[index]
    if (!element || !element.isConnected || element.disabled) continue
    const statePrefix = controlDescription(element, index)
    if (element instanceof HTMLInputElement) {
      if (element.type === 'range' || element.type === 'number') {
        const min = Number(element.min || 0)
        const max = Number(element.max || 100)
        const original = element.value
        const values = [...new Set([String(min + (max - min) / 2), String(max)])]
        for (let step = 0; step < values.length; step += 1) {
          const value = values[step]
          if (value === undefined || value === original) continue
          element.value = value
          dispatchControlEvent(element, 'input')
          dispatchControlEvent(element, 'change')
          await settle()
          save(statePrefix + ':value-' + step)
          stats.controls += 1
        }
      } else if (element.type === 'checkbox') {
        element.checked = !element.checked
        dispatchControlEvent(element, 'change')
        await settle()
        save(statePrefix + ':toggled')
        stats.controls += 1
      } else if (element.type === 'radio' && !element.checked) {
        element.checked = true
        dispatchControlEvent(element, 'change')
        await settle()
        save(statePrefix + ':selected')
        stats.controls += 1
      }
    } else if (element instanceof HTMLSelectElement) {
      const optionIndex = element.options.length - 1
      if (optionIndex >= 0 && element.selectedIndex !== optionIndex) {
        element.selectedIndex = optionIndex
        dispatchControlEvent(element, 'change')
        await settle()
        save(statePrefix + ':last-option')
        stats.controls += 1
      }
    } else if (element instanceof HTMLTextAreaElement) {
      element.value = element.value || 'Localization audit'
      dispatchControlEvent(element, 'input')
      dispatchControlEvent(element, 'change')
      await settle()
      save(statePrefix + ':edited')
      stats.controls += 1
    }
  }

  const summaries = Array.from(root.querySelectorAll<HTMLElement>('main details > summary'))
  for (let index = 0; index < summaries.length; index += 1) {
    const summary = summaries[index]
    if (!summary) continue
    summary.click()
    await settle()
    save('disclosure#' + index + ':opened')
    stats.disclosures += 1
  }

  // Exercise in-page workflow buttons, but do not trigger navigation, sharing,
  // clipboard, downloads, reset, or other external/destructive actions.
  const excludedAction = /share|copy|download|export|reset|restart|clear|random|home|teacher|language|theme|fullscreen|back|forward|previous|next page/i
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('main button'))
  for (let index = 0; index < buttons.length && index < 40; index += 1) {
    const button = buttons[index]
    if (!button) continue
    const label = normalize(button.innerText || button.getAttribute('aria-label') || button.title)
    if (!button.isConnected || button.disabled || button.closest('.share-experiment') || excludedAction.test(label)) continue
    button.click()
    await settle()
    save('button#' + index + ':activated')
    stats.buttons += 1
  }
}

describe('interactive runtime localization audit', () => {
  it('exercises editable controls, disclosures, and safe workflow buttons in every locale', async () => {
    document.body.innerHTML = ''
    window.prompt = () => null
    window.matchMedia ??= ((media: string) => ({
      matches: false, media, onchange: null,
      addListener: () => undefined, removeListener: () => undefined,
      addEventListener: () => undefined, removeEventListener: () => undefined,
      dispatchEvent: () => false,
    })) as typeof window.matchMedia
    const snapshots = new Map<string, CopyRecord[]>()
    const accessibilityIssues: Array<{ route: string; locale: Locale; state: string; element: string }> = []
    const languageIssues: Array<{ route: string; locale: Locale; state: string; actual: string }> = []
    const stats = { controls: 0, buttons: 0, disclosures: 0, states: 0, forceLabDifficultyChecks: 0 }

    const originalResizeObserver = globalThis.ResizeObserver
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver

    try {
      for (const route of ROUTES) {
        for (const locale of SUPPORTED_LOCALES) {
          setLocale(locale)
          await router.push(route.path)
          const root = document.createElement('div')
          document.body.append(root)
          const app = createApp(App)
          app.use(router)
          app.mount(root)
          await router.isReady()
          await settle()

          try {
            if ('difficultyLevel' in route) {
              verifyForceLabDifficulty(root, route.difficultyLevel, locale)
              stats.forceLabDifficultyChecks += 1
            }
            await exercisePage(root, route.name, locale, snapshots, stats, accessibilityIssues, languageIssues)
          } finally {
            app.unmount()
            root.remove()
          }
        }
      }
    } finally {
      setLocale('en')
      if (originalResizeObserver) globalThis.ResizeObserver = originalResizeObserver
      else delete (globalThis as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver
    }

    const candidateMap = new Map<string, Candidate>()
    for (const route of ROUTES) {
      const englishStates = [...snapshots.entries()]
        .filter(([key]) => key.startsWith(route.name + '::en::'))
      for (const locale of ['id', 'ja'] as const) {
        for (const [englishKey, englishRecords] of englishStates) {
          const state = englishKey.split('::').slice(2).join('::')
          const localized = snapshots.get([route.name, locale, state].join('::')) ?? []
          const englishKeys = new Set(englishRecords.map(recordKey))
          for (const record of localized) {
            if (!englishKeys.has(recordKey(record))) continue
            const key = [route.name, locale, recordKey(record)].join('::')
            const existing = candidateMap.get(key)
            if (existing) {
              if (!existing.states.includes(state)) existing.states.push(state)
            } else {
              candidateMap.set(key, { route: route.name, locale, states: [state], ...record })
            }
          }
        }
      }
    }
    const candidates = [...candidateMap.values()]

    const report = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      scope: 'Mounted application states after changing range/number inputs, checkboxes, radio buttons, selects, textareas, opening disclosures, and activating safe in-page workflow buttons in all supported locales.',
      locales: [...SUPPORTED_LOCALES],
      routes: ROUTES.map(({ path, name }) => ({ path, name })),
      summary: {
        routeCount: ROUTES.length,
        localeCount: SUPPORTED_LOCALES.length,
        renderedStates: stats.states,
        exercisedControlChanges: stats.controls,
        activatedWorkflowButtons: stats.buttons,
        openedDisclosures: stats.disclosures,
      forceLabDifficultyChecks: stats.forceLabDifficultyChecks,
        unchangedEnglishCandidates: candidates.length,
        unnamedInteractiveElements: accessibilityIssues.length,
        documentLanguageMismatches: languageIssues.length,
      },
      accessibilityIssues,
      documentLanguageIssues: languageIssues,
      candidates,
      limitations: [
        'This deterministic sweep tests controls and safe in-page buttons present at initial route render; it does not enumerate every possible value combination or every time-dependent animation frame.',
        'Buttons identified as navigation, sharing, clipboard, download, reset, or external/destructive actions are intentionally not activated.',
        'Canvas/WebGL pixels and browser-native dialogs are not inspected; retain the separate visual review checklist for those surfaces.',
        'A zero-candidate result is a regression signal, not proof of natural or scientifically accurate translation.',
      ],
    }

    const outputDir = resolve(process.cwd(), 'artifacts')
    await mkdir(outputDir, { recursive: true })
    await writeFile(resolve(outputDir, 'localization-interactive-audit.json'), JSON.stringify(report, null, 2) + '\n', 'utf8')
    const lines = [
      '# Interactive localization audit', '',
      '## Summary', '',
      '- Routes: ' + report.summary.routeCount,
      '- Locales: ' + report.summary.localeCount,
      '- Mounted route/locale states: ' + report.summary.renderedStates,
      '- Control changes exercised: ' + stats.controls,
      '- Workflow buttons activated: ' + stats.buttons,
      '- Disclosures opened: ' + stats.disclosures,
      '- Force Lab difficulty/locale combinations verified: ' + stats.forceLabDifficultyChecks,
      '- Unchanged-English candidates: ' + candidates.length,
      '- Unnamed interactive elements: ' + accessibilityIssues.length,
      '- Document language mismatches: ' + languageIssues.length,
      '', '## Unchanged-English candidates', '',
    ]
    if (!candidates.length) lines.push('No unchanged-English candidates were found in the exercised states.')
    for (const item of candidates) lines.push('- **' + item.route + ' / ' + item.locale + '** — ' + item.kind + (item.attribute ? ' (' + item.attribute + ')' : '') + ': ' + item.text + ' (states: ' + item.states.join(', ') + ')')
    lines.push('', '## Limitations', '', ...report.limitations.map((item) => '- ' + item))
    await writeFile(resolve(outputDir, 'localization-interactive-audit.md'), lines.join('\n') + '\n', 'utf8')

    expect(languageIssues, 'The document language must follow the selected locale in every exercised state').toEqual([])
    expect(accessibilityIssues, 'Interactive elements must retain accessible names after state changes').toEqual([])
    expect(stats.forceLabDifficultyChecks).toBe(3 * SUPPORTED_LOCALES.length)
    expect(stats.states).toBeGreaterThan(ROUTES.length * SUPPORTED_LOCALES.length)
    console.info('Interactive localization audit: ' + stats.states + ' states; ' + stats.controls + ' control changes; ' + stats.buttons + ' button activations; ' + candidates.length + ' unchanged-English candidates.')
  }, 180_000)
})
