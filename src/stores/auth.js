import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    // Simulamos un login rápido para que no te bloquees
    async login(credentials) {
      this.token = 'token-simulado-123'
      this.user = { name: 'Diego', email: credentials.email }
      localStorage.setItem('token', this.token)
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
})