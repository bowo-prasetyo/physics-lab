import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('optional learning progress persistence', () => {
  let values: Map<string, string>
  let progress: typeof import('./session-progress')

  beforeEach(async () => {
    values = new Map()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value) },
      removeItem: (key: string) => { values.delete(key) },
    })
    vi.resetModules()
    progress = await import('./session-progress')
  })

  afterEach(() => vi.unstubAllGlobals())

  it('remembers explored experiments only after the learner opts in', () => {
    progress.markExplored('/time/pendulum')
    expect(values.has('physica.learning-progress.v1')).toBe(false)

    progress.setProgressPersistenceEnabled(true)
    progress.markExplored('/mechanics/projectile')
    expect(JSON.parse(values.get('physica.learning-progress.v1') ?? '[]')).toEqual([
      '/time/pendulum', '/mechanics/projectile',
    ])
  })

  it('restores opted-in progress and clears it when the learner opts out', async () => {
    values.set('physica.learning-progress.v1.enabled', 'true')
    values.set('physica.learning-progress.v1', JSON.stringify(['/space/space-vs-time']))
    vi.resetModules()
    progress = await import('./session-progress')
    expect(progress.isExplored('/space/space-vs-time')).toBe(true)
    expect(progress.isProgressPersistenceEnabled()).toBe(true)

    progress.setProgressPersistenceEnabled(false)
    expect(values.has('physica.learning-progress.v1')).toBe(false)
    expect(values.has('physica.learning-progress.v1.enabled')).toBe(false)
  })

  it('ignores malformed saved data', async () => {
    values.set('physica.learning-progress.v1.enabled', 'true')
    values.set('physica.learning-progress.v1', '{broken')
    vi.resetModules()
    progress = await import('./session-progress')
    expect(progress.isExplored('/space/space-vs-time')).toBe(false)
  })

  it('forgets everything on this device in one step, for shared and school devices', () => {
    progress.setProgressPersistenceEnabled(true)
    progress.markExplored('/time/pendulum')
    expect(values.size).toBeGreaterThan(0)

    progress.forgetProgressOnThisDevice()
    expect(values.size).toBe(0)
    expect(progress.isExplored('/time/pendulum')).toBe(false)
    expect(progress.isProgressPersistenceEnabled()).toBe(false)
    progress.markExplored('/time/pendulum') // back to session-only: nothing is written
    expect(values.size).toBe(0)
  })
})
