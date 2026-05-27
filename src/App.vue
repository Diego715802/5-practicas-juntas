<script setup>
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useCarritoStore } from './stores/carrito'
import { useAuthStore } from './stores/auth' // Importamos la sesión

const carrito = useCarritoStore()
const auth = useAuthStore()
const router = useRouter()

// Función para salir de la cuenta
const cerrarSesion = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav style="background: #2c3e50; padding: 15px 30px; display: flex; gap: 20px; align-items: center;">
    <RouterLink to="/" style="color: white; text-decoration: none; font-weight: bold;">Inicio</RouterLink>
    <RouterLink to="/catalogo" style="color: white; text-decoration: none;">Catálogo</RouterLink>
    <RouterLink to="/admin/productos" style="color: white; text-decoration: none;">Inventario Admin</RouterLink>
    
    <RouterLink to="/carrito" style="color: #4CAF50; text-decoration: none; margin-left: auto; font-weight: bold; position: relative; margin-right: 20px;">
      🛒 Carrito
      <span v-if="carrito.totalItems > 0" style="background: #ff4757; color: white; border-radius: 50%; padding: 2px 8px; font-size: 12px; position: absolute; top: -10px; right: -20px;">
        {{ carrito.totalItems }}
      </span>
    </RouterLink>

    <template v-if="!auth.isAuthenticated">
      <RouterLink to="/login" style="color: white; text-decoration: none; border: 1px solid white; padding: 5px 10px; border-radius: 4px;">Iniciar Sesión</RouterLink>
    </template>
    <template v-else>
      <button @click="cerrarSesion" style="background: #ff4757; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Cerrar Sesión</button>
    </template>
  </nav>
  
  <div class="app-container">
    <RouterView />
  </div>
</template>

<style>
body { margin: 0; font-family: Arial, sans-serif; background: #f4f6f8; }
</style>