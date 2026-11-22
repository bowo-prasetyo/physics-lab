import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// The physics engine must stay independent of the UI so the same models can
// drive any visualisation. tsconfig.physics.json already rejects DOM access;
// this test rejects imports of anything outside src/physics (Vue, KaTeX, app code).
describe('physics engine architecture', () => {
  const dir = dirname(fileURLToPath(import.meta.url))
  const sources = readdirSync(dir).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))

  it.each(sources)('%s imports only other physics modules', (file) => {
    const code = readFileSync(join(dir, file), 'utf8')
    const specifiers = [...code.matchAll(/\bfrom\s+['"]([^'"]+)['"]/g)].map((m) => m[1])
    for (const specifier of specifiers) expect(specifier).toMatch(/^\.\/[\w-]+$/)
  })
})
