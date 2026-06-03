import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(credentials) {
      this.token = 'token-seguro-123'
      
      // 1. Preparamos variables por defecto (Tu acceso)
      let rolAsignado = 'admin'
      let nombreAsignado = 'Diego'

      // 2. Evaluamos qué correo intentó iniciar sesión
      if (credentials.email === 'editor@tienda.com') {
        rolAsignado = 'editor'
        nombreAsignado = 'Editor'
      } else if (credentials.email === 'cliente@tienda.com') {
        rolAsignado = 'cliente'
        nombreAsignado = 'Cliente'
      }

      // 3. Guardamos al usuario con el rol correcto
      this.user = { 
        name: nombreAsignado, 
        email: credentials.email, 
        rol: rolAsignado 
      }
      
      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})