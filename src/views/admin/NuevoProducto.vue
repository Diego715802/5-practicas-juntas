<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const cargando = ref(false)

const registrar = async () => {
  if (password.value !== password_confirmation.value) {
    alert('Las contraseñas no coinciden')
    return
  }
  cargando.value = true
  try {
    await auth.register({ name: name.value, email: email.value, password: password.value })
    alert('¡Cuenta creada con éxito!')
    router.push('/admin/productos')
  } catch (error) {
    alert('Error al registrar. Verifica tus datos.')
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div style="padding: 40px; max-width: 400px; margin: 50px auto; text-align: center; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
    <h2 style="color: #2c3e50;">Crear Cuenta</h2>
    <form @submit.prevent="registrar">
      <input v-model="name" type="text" placeholder="Nombre completo" required style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
      <input v-model="email" type="email" placeholder="Correo electrónico" required style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
      <input v-model="password" type="password" placeholder="Contraseña" required style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
      <input v-model="password_confirmation" type="password" placeholder="Confirmar contraseña" required style="width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
      
      <button type="submit" :disabled="cargando" style="padding: 12px 20px; width: 100%; background: #4CAF50; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; margin-bottom: 15px; font-weight: bold;">
        {{ cargando ? 'Guardando...' : 'Registrarse' }}
      </button>
    </form>

    <div style="margin-top: 15px; font-size: 0.9em;">
      <router-link to="/login" style="color: #2196F3; text-decoration: none; font-weight: bold;">¿Ya tienes cuenta? Inicia sesión aquí</router-link>
    </div>
  </div>
</template>