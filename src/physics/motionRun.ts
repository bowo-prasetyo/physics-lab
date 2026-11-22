/**
 * A one-dimensional "experiment run": an object moving along a straight track
 * while a clock advances.
 *
 * The motion is piecewise uniform. Each time the velocity changes (because the
 * student moves the slider, or the object reaches the end of the track) a new
 * segment starts. Within a segment x(t) = x_start + v·(t − t_start) holds
 * exactly, so positions are computed analytically rather than by numerical
 * integration — even when the animation frame rate is irregular.
 *
 * Note what the model does *not* do: it never stops the clock. When the object
 * comes to rest, time keeps advancing. That is the central observation of the
 * "space versus time" experiment.
 */

import { uniformPosition } from './kinematics'

export interface Segment {
  /** Time at which this segment begins (s). */
  readonly tStart: number
  /** Position at the start of the segment (m). */
  readonly xStart: number
  /** Constant velocity during the segment (m/s). */
  readonly v: number
}

export interface TrackBounds {
  readonly min: number
  readonly max: number
}

export interface MotionRunOptions {
  /** Initial position x₀ (m). */
  readonly x0: number
  /** Initial velocity (m/s). */
  readonly v: number
  /** Length of the run on the clock (s). */
  readonly duration: number
  /** Ends of the track (m). The object stops when it reaches one. */
  readonly bounds: TrackBounds
}

/** Plain, serialisable snapshot of a run, used for history and for analysis. */
export interface RunRecord {
  readonly x0: number
  readonly segments: readonly Segment[]
  /** Clock time when the snapshot was taken (s). */
  readonly tEnd: number
  /** Total path length travelled (m). */
  readonly distance: number
}

/** Position at time t (0 ≤ t ≤ tEnd) from a list of segments. */
export function positionAtTime(segments: readonly Segment[], t: number): number {
  let active = segments[0]
  if (!active) throw new Error('A run must contain at least one segment')
  for (const segment of segments) {
    if (segment.tStart <= t) active = segment
    else break
  }
  return uniformPosition(active.xStart, active.v, t - active.tStart)
}

/**
 * Corner points of the x(t) graph: the start of every segment plus the end
 * point. Because each segment is a straight line, joining these points draws
 * the graph exactly.
 */
export function graphVertices(record: RunRecord): { t: number; x: number }[] {
  const points = record.segments.map((s) => ({ t: s.tStart, x: s.xStart }))
  points.push({ t: record.tEnd, x: positionAtTime(record.segments, record.tEnd) })
  return points
}

export class MotionRun {
  readonly x0: number
  readonly duration: number
  readonly bounds: TrackBounds

  private readonly _segments: Segment[]
  private _t = 0
  private _distance = 0

  constructor(options: MotionRunOptions) {
    if (!(options.duration > 0)) throw new Error('duration must be positive')
    if (!(options.bounds.min < options.bounds.max)) throw new Error('bounds.min must be below bounds.max')
    this.x0 = clamp(options.x0, options.bounds.min, options.bounds.max)
    this.duration = options.duration
    this.bounds = options.bounds
    this._segments = [{ tStart: 0, xStart: this.x0, v: this.allowedVelocity(this.x0, options.v) }]
  }

  /** Clock time since the start of the run (s). */
  get t(): number {
    return this._t
  }

  /** Current position (m). */
  get x(): number {
    return positionAtTime(this._segments, this._t)
  }

  /** Current velocity (m/s). Zero while held against the end of the track. */
  get v(): number {
    return this.currentSegment.v
  }

  /** Displacement Δx = x − x₀ (m). Can be negative. */
  get displacement(): number {
    return this.x - this.x0
  }

  /** Total path length travelled (m). Never negative, never less than |Δx|. */
  get distance(): number {
    return this._distance
  }

  get finished(): boolean {
    return this._t >= this.duration
  }

  /** True when the object is pressed against an end of the track. */
  get atBoundary(): boolean {
    const x = this.x
    return x <= this.bounds.min || x >= this.bounds.max
  }

  get segments(): readonly Segment[] {
    return this._segments
  }

  /**
   * Change the velocity from the current moment on. If the object is at an end
   * of the track and the new velocity points off the track, it stays at rest.
   */
  setVelocity(v: number): void {
    const x = this.x
    const allowed = this.allowedVelocity(x, v)
    const current = this.currentSegment
    if (current.v === allowed) return
    if (current.tStart === this._t) {
      // No time has passed in the current segment: replace it rather than
      // leave a zero-length segment behind.
      this._segments[this._segments.length - 1] = { ...current, v: allowed }
    } else {
      this._segments.push({ tStart: this._t, xStart: x, v: allowed })
    }
  }

  /**
   * Advance the clock by dt seconds (clamped to the end of the run). Motion is
   * computed exactly, including the moment the object reaches the end of the
   * track part-way through the step.
   */
  advance(dt: number): void {
    if (!(dt > 0)) return
    let remaining = Math.min(dt, this.duration - this._t)
    while (remaining > 0) {
      const { v } = this.currentSegment
      const x = this.x
      if (v !== 0) {
        const wall = v > 0 ? this.bounds.max : this.bounds.min
        const tHit = (wall - x) / v
        if (tHit <= remaining) {
          this._t += tHit
          this._distance += Math.abs(v) * tHit
          remaining -= tHit
          this._segments.push({ tStart: this._t, xStart: wall, v: 0 })
          continue
        }
      }
      this._t += remaining
      this._distance += Math.abs(v) * remaining
      remaining = 0
    }
    // Guard against floating-point drift past the end of the run.
    if (this.duration - this._t < 1e-12) this._t = this.duration
  }

  toRecord(): RunRecord {
    return {
      x0: this.x0,
      segments: this._segments.map((s) => ({ ...s })),
      tEnd: this._t,
      distance: this._distance,
    }
  }

  private get currentSegment(): Segment {
    const segment = this._segments[this._segments.length - 1]
    if (!segment) throw new Error('A run must contain at least one segment')
    return segment
  }

  private allowedVelocity(x: number, v: number): number {
    if ((x >= this.bounds.max && v > 0) || (x <= this.bounds.min && v < 0)) return 0
    return v
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
