<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const cargando = ref(false)

const entrar = async () => {
  cargando.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push('/admin/productos')
  } catch (error) {
    alert("Credenciales incorrectas")
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div style="padding: 40px; max-width: 400px; margin: 50px auto; text-align: center; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
    <h2 style="color: #2c3e50;">Iniciar Sesión</h2>
    <form @submit.prevent="entrar">
      <input v-model="email" type="email" placeholder="Correo electrónico" required style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"><br>
      <input v-model="password" type="password" placeholder="Contraseña" required style="width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"><br>
      
      <button type="submit" :disabled="cargando" style="padding: 12px 20px; width: 100%; background: #2196F3; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; margin-bottom: 15px; font-weight: bold;">
        {{ cargando ? 'Iniciando...' : 'Entrar' }}
      </button>
    </form>

    <div style="margin-top: 15px; font-size: 0.9em; display: flex; flex-direction: column; gap: 10px;">
      <router-link to="/register" style="color: #4CAF50; text-decoration: none; font-weight: bold;">¿No tienes cuenta? Regístrate</router-link>
      <router-link to="/catalogo" style="color: #666; text-decoration: none;">← Regresar al catálogo</router-link>
    </div>
  </div>
</template>