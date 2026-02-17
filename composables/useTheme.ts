import { useAppStore } from '~/stores/app'
import type { Theme } from '~/stores/app'

export const useTheme = () => {
  const appStore = useAppStore()
  const colorMode = useColorMode()

  const currentTheme = computed<Theme>(() => appStore.theme)
  const isDark = computed<boolean>(() => appStore.isDark)

  const applyTheme = (theme: Theme) => {
    if (theme === 'system') {
      colorMode.preference = 'system'
    } else {
      colorMode.preference = theme
    }
  }

  const setTheme = (theme: Theme) => {
    appStore.setTheme(theme)
    applyTheme(theme)
  }

  const toggleTheme = () => {
    const next: Theme = appStore.isDark ? 'light' : 'dark'
    setTheme(next)
  }

  const initTheme = () => {
    appStore.restoreTheme()
    applyTheme(appStore.theme)
  }

  return {
    currentTheme,
    isDark,
    setTheme,
    toggleTheme,
    initTheme,
  }
}
