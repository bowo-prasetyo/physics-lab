import { describe, expect, it } from 'vitest'
import { niceCeil } from './chartScale'

describe('chart axis limit', () => {
  it('fits the data snugly with round quarter ticks', () => {
    expect(niceCeil(10)).toBe(10) // moving clock: Galilean line at 10 s
    expect(niceCeil(1.99)).toBe(2) // headlight: Galilean up to 1.99c
    expect(niceCeil(70.18)).toBe(80) // flashes at 0.99c
    expect(niceCeil(1.3)).toBe(1.6)
    expect(niceCeil(0)).toBe(1)
  })
})
