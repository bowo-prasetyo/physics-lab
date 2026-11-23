import { describe, expect, it } from 'vitest'
import { localizeExperimentText } from './experiment-ui'

describe('experiment UI localization', () => {
  it('localizes the primed-coordinate readout labels', () => {
    for (const locale of ['id', 'ja'] as const) {
      expect(localizeExperimentText('Position r', locale)).not.toBe('Position r')
      expect(localizeExperimentText('Displacement Δr', locale)).not.toBe('Displacement Δr')
      expect(localizeExperimentText('Size |Δr|', locale)).not.toBe('Size |Δr|')
    }
  })

  it('localizes dynamic cosmology and track-boundary states', () => {
    expect(localizeExperimentText('model fails', 'id')).toBe('model tidak berlaku')
    expect(localizeExperimentText('model fails', 'ja')).toBe('モデルの適用限界')
    expect(localizeExperimentText('coasting', 'id')).toBe('laju ekspansi konstan')
    expect(localizeExperimentText('coasting', 'ja')).toBe('等速膨張')
    expect(localizeExperimentText('slowing down', 'id')).toBe('melambat')
    expect(localizeExperimentText('slowing down', 'ja')).toBe('減速中')
    const boundary = 'Held at the end of the track: the object cannot move further, but the clock keeps running.'
    expect(localizeExperimentText(boundary, 'id')).toContain('Berhenti di ujung lintasan')
    expect(localizeExperimentText(boundary, 'ja')).toContain('トラックの端')
    expect(localizeExperimentText('A second observer moving along the track, passing x = 0 at t = 0. Fixed for the whole run.', 'ja')).toContain('第 2 の観測者')
    expect(localizeExperimentText('Reset the clock to change the observer’s velocity.', 'id')).toContain('Atur ulang jam')
    expect(localizeExperimentText('million years', 'id')).toBe('juta tahun')
    expect(localizeExperimentText('thousand years', 'ja')).toBe('千年')
  })

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
    expect(localizeExperimentText('Track from 0 to 10 metres. The object is at x = 2.00 m, started at x₀ = 0.0 m, moving at 1.0 m/s.', 'id')).toContain('Lintasan dari 0 hingga 10 meter')
    expect(localizeExperimentText('Launcher ready, seen from the ground: 12 m/s at 30 degrees from 2 m.', 'ja')).toContain('地上から見た')
  })


  it('localizes phase portraits and early-universe visualization captions', () => {
    expect(localizeExperimentText('Phase portrait: angle across, angular velocity up. Each swing traces the same closed loop.', 'id')).toContain('Potret fase')
    expect(localizeExperimentText('Phase portrait: one closed loop per swing. The loop does not spiral, because energy is conserved.', 'ja')).toContain('エネルギーが保存')
    expect(localizeExperimentText('First light: the universe becomes transparent.', 'id')).toBe('Cahaya pertama: alam semesta menjadi transparan.')
    expect(localizeExperimentText('Make this galaxy home', 'ja')).not.toBe('Make this galaxy home')
  })


  it('translates long-form experiment explanations and interpretation in Indonesian and Japanese', () => {
    const explanations = [
      'Over everyday distances, space is described extremely well by Euclidean geometry: Pythagoras holds, and triangles have angles adding up to 180°.',
      'Coordinates are a human choice; distances, lengths and angles are not. Physical laws are written so that they do not depend on the choice.',
      'Newton treated space as a container that exists even when empty; Leibniz argued that only the distances and directions between objects are real. Their followers debated it in letters in 1715–16, and the question is still discussed.',
      'Distant galaxies recede with speeds proportional to their distance (Lemaître, 1927; Hubble, 1929).',
      'The universe was once hot and dense: the cosmic microwave background, discovered in 1965, is light released when it became transparent, now cooled to 2.7 K. The amounts of hydrogen, helium and lithium agree with nuclear reactions in the first minutes.',
      'In some approaches to quantum gravity the basic equation has no time in it, and time emerges from how parts of the universe change relative to each other, for example using the size of the universe itself as a clock. This bears directly on whether space and time are separate fundamental things.',
      'The effect is symmetric: each of two inertial observers finds the other’s clock running slow.',
      'For two clocks that just fly past each other, “which one is really slower” has no frame-independent answer: it depends on which events you call simultaneous. A frame-independent difference only appears when the clocks meet again (the twin paradox).',
      'The tilted lines of simultaneity show that observers disagree about which distant events are happening now. Some philosophers argue this favours a “block universe”, in which past, present and future events all exist equally. Others defend a privileged present. Physics makes the same predictions either way; the debate is about interpretation.',
      'The speed of light is the same for every observer, whatever the motion of its source (Michelson and Morley, 1887; CERN, 1964). The Galilean description cannot accommodate this.',
      'Equivalent predictions cannot settle this. Some physicists and philosophers take the four-dimensional geometry as the basic reality; others see it as a compact way of describing how measurements by different observers relate, with space and time (or the behaviour of rods and clocks) more basic.',
      'Without air, a projectile’s path is a parabola, and its horizontal and vertical motions are independent (Galileo, Two New Sciences, 1638).',
      'This is a one-dimensional Newtonian model in an inertial reference frame. The mass is constant, the net force is constant, and friction is omitted. The selected force represents the sum of all forces along the track; it is not simply the applied push if other forces oppose it.',
      'Galileo noticed that a pendulum keeps a nearly steady beat, and Christiaan Huygens built the first pendulum clock in 1656. Pendulum clocks were the most accurate timekeepers until quartz clocks in the 1930s.',
      'Atoms, crystals and planets, built on completely different physics, keep step with each other when they are together. Some see that agreement as evidence of a single underlying time; others see time as nothing but that web of agreements. Relativity adds that clocks in different places or states of motion need not agree at all (Experiments B and C).',
      'Clocks lower in a gravitational field run slower, and observers at both heights agree which clock is slow.',
      'Measured again and again: gamma rays up a 22.5 m tower (Pound and Rebka, 1959), a hydrogen-maser clock launched on a rocket (Gravity Probe A, 1976, agreeing to about 7 parts in 100 000), and optical clocks that detect a height change of about 33 cm (2010). GPS corrects for it every day.',
      'Every clock and every process slows by the same factor, so no measurement can separate the two. Whether that means “time itself” runs slower depends on what you think time is: something that exists on its own, or a measure of how physical processes relate.',
      'General relativity describes it as the curvature of spacetime, and the lapse in the 3 + 1 split is exactly the clock rate you measured. Other formulations, such as the teleparallel equivalent of general relativity, describe gravity differently but make the same predictions. As in Experiment E, equal predictions leave the interpretation open.',
      'Newton’s second law relates the net force on an object to its acceleration:',
      'With v = 0, the position stays constant while the clock reading keeps increasing.',
      'What an astronaut would literally see through a telescope also includes that travel delay (and the Doppler effect), so the images can run faster or slower still. Time dilation is what remains after correcting for it.',
      'Did time begin at the Big Bang?',
      'In classical general relativity the model has an edge at',
      ', but the theory is not expected to hold there. Proposals include a quantum “no-boundary” beginning, a bounce from an earlier contracting phase, and eternal inflation. None is confirmed.',
      'Is time fundamental?',
      'Is space really stretching?',
      '“Expanding space” is a natural description in these coordinates. Some physicists prefer to describe the same thing as galaxies moving apart. As in Experiment E, the predictions are the same.',
      'Measured from any inertial frame, a clock moving at speed',
      'runs slow by the factor γ.',
      'Newton’s time flows equally for everyone, which is the assumption',
      ' used for the train here. Experiments A, B and E show how relativity changed that, and keep the question of what space and time really are open.',
      'At speeds close to light, they do not (Module 4).',
      'Experiment B, where clocks that move disagree, and Experiment C, where gravity changes how fast time passes.',
      'Experiment E describes the same situations with separate space and time, and with a single spacetime.',
      'The curve has the shape of the gravity “well”: deeper means slower. Clocks are held at rest at these heights (a real satellite would be moving; see the GPS setup).',
      '“Received” rates are relative to the receiver’s own clock: negative means the ticks arrive slowed (redshift), positive sped up (blueshift).',
      'Before launch, each satellite clock is set to tick at 10.22999999543 MHz instead of 10.23 MHz, so that in orbit it runs at the right rate as seen from the ground. Switch the correction off to see what would happen without it.',
      'Clocks lower in a gravitational field run slower, and observers at both heights agree which clock is slow.',
      'Measured again and again: gamma rays up a 22.5 m tower (Pound and Rebka, 1959), a hydrogen-maser clock launched on a rocket (Gravity Probe A, 1976, agreeing to about 7 parts in 100 000), and optical clocks that detect a height change of about 33 cm (2010). GPS corrects for it every day.',
      'A clock falling into a black hole ticks normally by its own measure and crosses the horizon after a finite time on its own dial.',
      'Does gravity slow time itself, or only clocks?',
      'Every clock and every process slows by the same factor, so no measurement can separate the two. Whether that means “time itself” runs slower depends on what you think time is: something that exists on its own, or a measure of how physical processes relate.',
      'Is gravity a force or geometry?',
      'General relativity describes it as the curvature of spacetime, and the lapse in the 3 + 1 split is exactly the clock rate you measured. Other formulations, such as the teleparallel equivalent of general relativity, describe gravity differently but make the same predictions. As in Experiment E, equal predictions leave the interpretation open.',
      'With v = 0, the position stays constant while the clock reading keeps increasing.',
      '. At speeds close to light, they do not (Module 4).',
      'Next: Experiment C, in which gravity, not motion, changes how fast clocks tick.',
    ]
    for (const source of explanations) {
      expect(localizeExperimentText(source, 'id'), source).not.toBe(source)
      expect(localizeExperimentText(source, 'ja'), source).not.toBe(source)
    }
  })


  it('localizes remaining experiment-view explanatory copy in Indonesian and Japanese', () => {
    const explanations = [
      'Drawn to scale: one metre across equals one metre up. Dashed lines are earlier throws.',
      'Arrows show the sideways (green) and vertical (yellow) velocity.',
      'Dashed lines show its x, y and z components.',
      'Jump to a time',
      'Distances compared with today',
      'Expansion is',
      'Light from now, seen today: redshift z',
      'Background radiation',
      'Hubble rate H',
      'Hubble distance c/H',
      'Click any galaxy to make it “home”. Arrows show how fast the others recede from it. The galaxies themselves keep their size: gravity holds them together. The pattern repeats in every direction, so no galaxy is at an edge.',
      'the Earth',
      'the ship',
      'Moving clock ÷ resting clock',
      'Ship event',
      'Interval',
      'Ship clock squared',
      'The pendulum clock was adjusted on the Earth, with small swings, for this length.',
      'Complete swings counted',
      'Measured period',
      'Small-swing formula 2π√(L/g)',
      'Exact period for this swing',
      'Changing a setting releases the pendulum again from rest. Measurements you made are kept for the questions.',
      'Choose an answer before running the model. Each explanation unlocks only after you have compared the relevant cases.',
      'Teacher guide',
      'Observer measures',
      'Nature decides. Compare the three predictions, then check them against real measurements.',
      'Gravity and clock rates',
    ]

    for (const source of explanations) {
      expect(localizeExperimentText(source, 'id'), `Indonesian: ${source}`).not.toBe(source)
      expect(localizeExperimentText(source, 'ja'), `Japanese: ${source}`).not.toBe(source)
    }
  })


  it('localizes dynamic visualization descriptions while preserving measured values', () => {
    const prediction = 'Chart of measured distance against ship speed, one line per description. Lorentz: 12.50 at the top speed.'
    const scaleFactor = 'Scale factor a against time. time since the Big Bang (billion years). Today a = 1.'
    for (const locale of ['id', 'ja'] as const) {
      const predictionText = localizeExperimentText(prediction, locale)
      const scaleText = localizeExperimentText(scaleFactor, locale)
      expect(predictionText).not.toContain('Chart of')
      expect(predictionText).not.toContain('one line per description')
      expect(predictionText).not.toContain('at the top speed')
      expect(predictionText).toContain('12.50')
      expect(scaleText).not.toContain('Scale factor a against time')
      expect(scaleText).not.toContain('time since the Big Bang')
      expect(scaleText).not.toContain('Today')
      expect(scaleText).toContain('1')
    }
  })

  it('localizes dynamic SVG visualization captions and accessibility descriptions', () => {
    const descriptions = [
      'Model universe with 24 galaxies on a grid, seen from the home galaxy. Distances are 1.250 times today\'s. Before the first galaxies. Cooling gas, slowly clumping under gravity. Arrows show recession speeds, longer for more distant galaxies.',
      'Interactive 3D view of a path in Cartesian coordinates. x points east, y north and z up. Start (0.00, 0.00, 0.00); current position (3.00, 4.00, 12.00); displacement (3.00, 4.00, 12.00) metres. Use the view presets for standard camera angles. A numerical alternative follows.',
      'Track from -10 to 10 metres. The object is at x = 2.00 m, started at x₀ = 0.0 m, moving at 1.0 m/s.',
      'Pendulum 1.00 m long with a 2.0 kg bob, at 30 degrees from the vertical.',
    ]
    for (const source of descriptions) {
      for (const locale of ['id', 'ja'] as const) {
        const translated = localizeExperimentText(source, locale)
        expect(translated).not.toBe(source)
        expect(translated).not.toContain('Interactive 3D view')
        expect(translated).not.toContain('Track from')
        expect(translated).not.toContain('Pendulum ')
        expect(translated).not.toContain('Cooling gas')
        for (const number of source.matchAll(/\d+(?:\.\d+)?/g)) expect(translated).toContain(number[0])
      }
    }
  })
})
