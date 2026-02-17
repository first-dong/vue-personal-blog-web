import { defineStore } from 'pinia'

export interface User {
  id: number
  username: string
  email: string
  avatar: string
  role: string
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    refreshToken: null,
  }),

  getters: {
    isLoggedIn: (state): boolean => !!state.token,
    isAdmin: (state): boolean => state.user?.role === 'ADMIN',
    currentUser: (state): User | null => state.user,
  },

  actions: {
    setTokens(token: string, refreshToken: string) {
      this.token = token
      this.refreshToken = refreshToken
      if (import.meta.client) {
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', refreshToken)
      }
    },

    setUser(user: User) {
      this.user = user
    },

    restoreFromStorage() {
      if (import.meta.client) {
        this.token = localStorage.getItem('token')
        this.refreshToken = localStorage.getItem('refreshToken')
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.refreshToken = null
      if (import.meta.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
      }
    },
  },
})
