import { computed, ref, watch } from 'vue'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'physica-theme'

function readPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // Storage may be unavailable; fall back to the operating-system preference.
  }
  return 'system'
}

const preference = ref<ThemePreference>(readPreference())
const mediaQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null
const systemPrefersDark = ref(mediaQuery?.matches ?? false)

mediaQuery?.addEventListener('change', (event) => {
  systemPrefersDark.value = event.matches
})

const resolvedTheme = computed<ResolvedTheme>(() => {
  if (preference.value === 'system') return systemPrefersDark.value ? 'dark' : 'light'
  return preference.value
})

watch(resolvedTheme, (theme) => {
  if (typeof document !== 'undefined') document.documentElement.dataset.theme = theme
}, { immediate: true })

watch(preference, (theme) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // The selection still applies for this session when storage is unavailable.
  }
})

export function useTheme() {
  return { preference, resolvedTheme }
}
