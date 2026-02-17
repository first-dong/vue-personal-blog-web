import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark' | 'system'

export interface AppState {
  theme: Theme
  sidebarOpen: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    theme: 'system',
    sidebarOpen: false,
  }),

  getters: {
    isDark: (state): boolean => {
      if (state.theme === 'system') {
        if (import.meta.client) {
          return window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        return false
      }
      return state.theme === 'dark'
    },
  },

  actions: {
    setTheme(theme: Theme) {
      this.theme = theme
      if (import.meta.client) {
        localStorage.setItem('theme', theme)
      }
    },

    restoreTheme() {
      if (import.meta.client) {
        const saved = localStorage.getItem('theme') as Theme | null
        if (saved && ['light', 'dark', 'system'].includes(saved)) {
          this.theme = saved
        }
      }
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
  },
})
