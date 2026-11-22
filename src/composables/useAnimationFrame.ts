import { onBeforeUnmount, watch, type Ref } from 'vue'

/** Longest real-time step passed to the callback (s); avoids jumps after a hidden tab. */
const MAX_STEP = 0.1

/**
 * Calls `onFrame(dt)` on every animation frame while `active` is true, with dt
 * the elapsed real time in seconds.
 */
export function useAnimationFrame(active: Ref<boolean>, onFrame: (dt: number) => void): void {
  let handle = 0
  let last = 0

  const loop = (now: number) => {
    const dt = Math.min((now - last) / 1000, MAX_STEP)
    last = now
    if (dt > 0) onFrame(dt)
    if (active.value) handle = requestAnimationFrame(loop)
  }

  const stop = () => {
    if (handle) cancelAnimationFrame(handle)
    handle = 0
  }

  watch(
    active,
    (isActive) => {
      stop()
      if (isActive) {
        last = performance.now()
        handle = requestAnimationFrame(loop)
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(stop)
}
