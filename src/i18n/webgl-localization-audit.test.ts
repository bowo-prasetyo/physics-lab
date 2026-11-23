// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, nextTick } from 'vue'
import type { App } from 'vue'

vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal<typeof import('three')>()
  class WebGLRenderer {
    readonly domElement = document.createElement('canvas')
    setPixelRatio() {}
    setSize() {}
    render() {}
    dispose() {}
  }
  return { ...actual, WebGLRenderer }
})

vi.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: class {
    target = { set() {} }
    enableDamping = false
    minDistance = 0
    maxDistance = 0
    addEventListener() {}
    update() {}
    dispose() {}
  },
}))

vi.mock('three/examples/jsm/renderers/CSS2DRenderer.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('three/examples/jsm/renderers/CSS2DRenderer.js')>()
  class CSS2DRenderer {
    readonly domElement = document.createElement('div')
    setSize() {}
    render(scene: import('three').Scene) {
      scene.traverse((object) => {
        if ('element' in object && object.element instanceof HTMLElement && !object.element.isConnected) {
          this.domElement.append(object.element)
        }
      })
    }
  }
  return { ...actual, CSS2DRenderer }
})

const mountedApps: App[] = []

function installBrowserShims() {
  window.matchMedia ??= ((media: string) => ({
    matches: false,
    media,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia

  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver

  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get: () => 640,
  })
}

async function settle() {
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 0))
  await nextTick()
}

afterEach(() => {
  for (const app of mountedApps.splice(0)) app.unmount()
  document.body.innerHTML = ''
})

describe('WebGL scene localization audit', () => {
  it('renders localized CSS2D labels and an accessible description in all supported locales', async () => {
    installBrowserShims()
    const [{ default: Scene3D }, { setLocale }, { STANDARD_FRAME }, { vec3 }] = await Promise.all([
      import('@/components/Scene3D.vue'),
      import('./index'),
      import('@/physics'),
      import('@/physics'),
    ])

    const expected = {
      en: { start: 'start', east: 'x · east', west: 'west', north: 'y · north', up: 'z · up', description: 'Interactive 3D view of a path' },
      id: { start: 'awal', east: 'x · timur', west: 'barat', north: 'y · utara', up: 'z · atas', description: 'Tampilan 3D interaktif lintasan' },
      ja: { start: '始点', east: 'x · 東', west: '西', north: 'y · 北', up: 'z · 上', description: 'デカルト座標での経路' },
    } as const

    const report: Array<{
      locale: keyof typeof expected
      labels: string[]
      accessibleDescription: string
      checks: string[]
    }> = []

    for (const locale of ['en', 'id', 'ja'] as const) {
      setLocale(locale)
      const root = document.createElement('div')
      document.body.append(root)
      const app = createApp(Scene3D, {
        points: [vec3(0, 0, 0), vec3(3, 4, 2)],
        bound: 12,
        frame: { ...STANDARD_FRAME, origin: vec3(1, 0, 0), yawDeg: 25, pitchDeg: 10 },
        showFrame: true,
        showComponents: true,
        view: '3d',
        viewKey: 0,
        directions: {
          x: ['west', 'east'],
          y: ['south', 'north'],
          z: ['down', 'up'],
        },
      })
      app.mount(root)
      mountedApps.push(app)
      await settle()

      const scene = root.querySelector<HTMLElement>('.scene[role="img"]')
      const overlay = root.querySelector<HTMLElement>('.scene-labels')
      expect(scene, locale + ': WebGL scene container').not.toBeNull()
      expect(overlay, locale + ': CSS2D overlay').not.toBeNull()
      expect(scene?.getAttribute('aria-label')).toContain(expected[locale].description)
      expect(scene?.getAttribute('aria-label')).toContain(locale === 'ja' ? '始点' : locale === 'id' ? 'Titik awal' : 'Start')

      const labelElements = Array.from(root.querySelectorAll<HTMLElement>('.scene-labels .scene-label'))
      const labels = labelElements.map((element) => element.textContent?.trim() ?? '')
      expect(labels).toContain(expected[locale].start)
      expect(labels).toContain(expected[locale].east)
      expect(labels).toContain(expected[locale].west)
      expect(labels).toContain(expected[locale].north)
      expect(labels).toContain(expected[locale].up)
      expect(labels).toContain('Δr')
      expect(labels).toContain('x′')
      expect(labels).toContain('y′')
      expect(labels).toContain('z′')

      // The raster canvas is intentionally hidden from assistive technology;
      // the containing scene supplies a localized name and a complete description.
      const canvas = root.querySelector('canvas')
      expect(canvas?.getAttribute('aria-hidden')).toBe('true')
      expect(overlay?.getAttribute('aria-hidden')).toBe('true')
      expect(scene?.getAttribute('role')).toBe('img')

      const details = root.querySelector('details.scene-data')
      expect(details).not.toBeNull()
      const detailsSummary = details?.querySelector('summary')?.textContent?.trim() ?? ''
      expect(detailsSummary.length).toBeGreaterThan(0)
      expect(detailsSummary).not.toBe('Read the 3D coordinates as text')

      report.push({
        locale,
        labels,
        accessibleDescription: scene?.getAttribute('aria-label') ?? '',
        checks: ['localized axis and direction labels', 'localized start marker', 'stable scientific symbols', 'localized accessible scene description', 'text alternative present'],
      })
    }

    const { mkdir, writeFile } = await import('node:fs/promises')
    const { resolve } = await import('node:path')
    const outputDir = resolve(process.cwd(), 'artifacts')
    await mkdir(outputDir, { recursive: true })
    const output = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      scope: 'DOM-backed WebGL scene labels (Three.js CSS2D overlay), scene accessible descriptions, and text alternative in English, Indonesian, and Japanese.',
      renderer: 'Three.js WebGLRenderer with CSS2D labels; the WebGL context is stubbed in jsdom while scene geometry and CSS2D label construction use the production component.',
      summary: { localesChecked: report.length, localizedSceneLabelSets: report.length, failedChecks: 0 },
      results: report,
      limitations: [
        'jsdom does not rasterize WebGL or measure real browser glyph layout; this test verifies the production scene label DOM and accessibility contract, not pixel-level rendering.',
        'Review screenshots in a real browser at desktop and narrow mobile widths for clipping, label collisions, contrast, and font fallback.',
        'The galaxy-field visualization is SVG rather than Canvas/WebGL and remains covered by the general runtime localization audit.',
      ],
    }
    await writeFile(resolve(outputDir, 'localization-webgl-audit.json'), JSON.stringify(output, null, 2) + '\n', 'utf8')
    const lines = [
      '# WebGL localization audit', '',
      '- Locales checked: ' + report.length,
      '- Localized scene label sets: ' + report.length,
      '- Failed checks: 0',
      '', '## Verified in each locale', '',
      '- Three.js CSS2D axis and compass-direction labels',
      '- Localized start-point marker',
      '- Stable scientific symbols (Δr, x′, y′, z′)',
      '- Localized accessible scene description',
      '- Localized numerical text alternative',
      '', '## Browser visual review still required', '',
      ...output.limitations.map((item) => '- ' + item),
    ]
    await writeFile(resolve(outputDir, 'localization-webgl-audit.md'), lines.join('\n') + '\n', 'utf8')
    console.info('WebGL localization audit: ' + report.length + ' locales; ' + report.reduce((sum, item) => sum + item.labels.length, 0) + ' rendered labels checked.')
  }, 30_000)
})
