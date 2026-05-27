<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')

const entrar = async () => {
  await auth.login({ email: email.value, password: password.value })
  router.push('/admin/productos')
}
</script>

<template>
  <div style="padding: 40px; max-width: 400px; margin: 50px auto; text-align: center; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="entrar">
      <input v-model="email" type="email" placeholder="Correo electrónico" required style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"><br>
      <input v-model="password" type="password" placeholder="Contraseña" required style="width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"><br>
      
      <button type="submit" style="padding: 12px 20px; width: 100%; background: #2196F3; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; margin-bottom: 15px;">
        Entrar
      </button>
    </form>

    <div style="margin-top: 20px; font-size: 0.9em;">
      <router-link to="/catalogo" style="color: #666; text-decoration: none;">← Regresar al catálogo</router-link>
    </div>
  </div>
</template>