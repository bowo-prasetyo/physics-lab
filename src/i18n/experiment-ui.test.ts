import { describe, expect, it } from 'vitest'
import { localizeExperimentText } from './experiment-ui'

describe('experiment UI localization', () => {
  it('keeps English hints unchanged', () => {
    const hint = 'Make at least three moves and come back to where you started (or load “Round trip”).'
    expect(localizeExperimentText(hint, 'en')).toBe(hint)
  })

  it('translates dynamic hints in Indonesian and Japanese', () => {
    const hint = 'Set the ship speed to at least 0.80c and make the measurement again.'
    expect(localizeExperimentText(hint, 'id')).toContain('0.80c')
    expect(localizeExperimentText(hint, 'id')).toContain('kecepatan kapal')
    expect(localizeExperimentText(hint, 'ja')).toContain('0.80c')
    expect(localizeExperimentText(hint, 'ja')).toContain('宇宙船')
  })

  it('translates visualization controls and axis labels', () => {
    expect(localizeExperimentText('Playback speed', 'id')).toBe('Kecepatan pemutaran')
    expect(localizeExperimentText('time t (s)', 'ja')).toBe('時間 t (s)')
    expect(localizeExperimentText('View the plotted values as a table', 'id')).toBe('Lihat nilai grafik sebagai tabel')
  })

  it('translates individual experiment control labels and instructions', () => {
    expect(localizeExperimentText('A distant galaxy, today at', 'id')).toBe('Jarak galaksi jauh saat ini')
    expect(localizeExperimentText('Ship speed', 'ja')).toBe('宇宙船の速度')
    expect(localizeExperimentText('Distance today, in billions of light-years.', 'ja')).toBe('現在の距離（10 億光年単位）。')
  })

  it('preserves scientific notation and unknown text', () => {
    expect(localizeExperimentText('Δr = 12 m; v = 0.80c', 'ja')).toBe('Δr = 12 m; v = 0.80c')
    expect(localizeExperimentText('A new experimental label', 'id')).toBe('A new experimental label')
    expect(localizeExperimentText(null, 'id')).toBeUndefined()
  })

  it('translates the introductory copy for all priority experiment views', () => {
    const introductions = [
      'Evolving space',
      'Space versus time',
      'Displacement in 3D',
      'Pendulum clocks',
      'Force, mass and acceleration',
      'Projectile launcher',
      'Different clocks, different elapsed times',
      'Space and time versus spacetime',
      'A model universe filled with galaxies. Run it forwards and backwards in time. What grows, what stays the same, and where does the model stop making sense?',
      'An object sits on a straight track while a clock runs. You control where it starts and how fast it moves. What happens to its position, and what happens to time, when you stop it?',
      'Move an object through three-dimensional space and measure where it ends up. Then change the coordinate system and find out which numbers change, and which belong to space itself.',
      'For three centuries the best clocks were pendulums. Find out what sets the beat of a pendulum, then take a pendulum clock to the Moon and compare it with an atomic clock. What is a clock really measuring?',
      'Push a cart with a constant net force. Change the force or the cart’s mass, predict what will happen, and test Newton’s second law.',
      'Launch a ball at any speed and angle, from the ground or a tower, on the Earth, the Moon, Mars or Jupiter, with or without air. Watch it from the ground, or from a moving train.',
      'A spaceship flies past the Earth. At the moment they pass, both clocks read zero. How much time has passed on each clock a little later, and does the answer depend on who you ask?',
      'Three mathematical descriptions of the same situations. Which ones match what we measure, and do the ones that match disagree about anything at all?',
    ]
    for (const source of introductions) {
      expect(localizeExperimentText(source, 'id')).not.toBe(source)
      expect(localizeExperimentText(source, 'ja')).not.toBe(source)
    }
  })


  it('localizes visualization labels, tables, and accessibility descriptions', () => {
    const labels = [
      'Starting point (x, y, z)',
      'Current point (x, y, z)',
      'Displacement (Δx, Δy, Δz)',
      'Distance between start and current point',
      'Path points recorded',
      'observer',
      'Horizontal position',
      'Horizontal velocity',
      'Vertical velocity',
      'Launched ball',
      'Dropped ball',
      'Before launch',
      'Not moving',
      'Read the current projectile measurements as a table',
      'Observer',
      'Current event (t, x)',
      'Proper time elapsed',
      'Position at each whole second of the current run',
      'Start the clock to fill in the table.',
      'Light (45°)',
      'Measured',
      'parts per million',
      'parts per billion',
      'parts per trillion',
    ]
    for (const source of labels) {
      expect(localizeExperimentText(source, 'id')).not.toBe(source)
      expect(localizeExperimentText(source, 'ja')).not.toBe(source)
    }
    expect(localizeExperimentText('position x (m)', 'id')).toBe('posisi x (m)')
    expect(localizeExperimentText('height (m)', 'ja')).toBe('高さ (m)')
  })

  it('localizes dynamic descriptions without changing scientific values', () => {
    const description = 'Interactive 3D view of a path in Cartesian coordinates. x points east, y north and z up. Start (0.00, 0.00, 0.00); current position (1.00, 2.00, 3.00); displacement (1.00, 2.00, 3.00) metres. Use the view presets for standard camera angles. A numerical alternative follows.'
    const translated = localizeExperimentText(description, 'id') ?? ''
    expect(translated).toContain('(0.00, 0.00, 0.00)')
    expect(translated).toContain('1.00, 2.00, 3.00')
    expect(translated).not.toContain('Interactive 3D view')
    expect(translated).not.toContain('current position')
  })

})
