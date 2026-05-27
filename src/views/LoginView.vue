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
  <div style="padding: 40px; max-width: 400px; margin: 0 auto; text-align: center;">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="entrar">
      <input v-model="email" type="email" placeholder="Correo" required style="width: 100%; padding: 10px; margin-bottom: 10px;"><br>
      <input v-model="password" type="password" placeholder="Contraseña" required style="width: 100%; padding: 10px; margin-bottom: 20px;"><br>
      <button type="submit" style="padding: 10px 20px; width: 100%; background: #2196F3; color: white; border: none;">Entrar</button>
    </form>
  </div>
</template>