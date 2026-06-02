<script setup>
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useCarritoStore } from './stores/carrito'
import { useAuthStore } from './stores/auth'

const carrito = useCarritoStore()
const auth = useAuthStore()
const router = useRouter()

const cerrarSesion = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <!-- NAVBAR PRINCIPAL -->
  <nav class="navbar">
    <div class="nav-links">
      <RouterLink to="/" class="nav-item">Inicio</RouterLink>
      <RouterLink to="/catalogo" class="nav-item">Catálogo</RouterLink>
      <RouterLink to="/admin/productos" class="nav-item">Inventario Admin</RouterLink>
      
    </div>
    
    <div class="nav-actions">
      <!-- Botón del Carrito -->
      <RouterLink to="/carrito" class="cart-btn">
        🛒 Carrito
        <span v-if="carrito.totalItems > 0" class="cart-badge">
          {{ carrito.totalItems }}
        </span>
      </RouterLink>

      <!-- Botones de Autenticación -->
      <template v-if="!auth.isAuthenticated">
        <RouterLink to="/login" class="login-btn">Iniciar Sesión</RouterLink>
      </template>
      <template v-else>
        <button @click="cerrarSesion" class="logout-btn">Cerrar Sesión</button>
      </template>
    </div>
  </nav>
  
  <!-- CONTENIDO DINÁMICO DE LAS PÁGINAS -->
  <div class="app-container">
    <RouterView />
  </div>
</template>

<style>
/* Estilos Globales */
body { 
  margin: 0; 
  font-family: Arial, sans-serif; 
  background: #f4f6f8; 
  color: #333;
}

/* Estilos de la Navbar */
.navbar {
  background: #2c3e50; 
  padding: 15px 40px; 
  display: flex; 
  justify-content: space-between; /* Separa los links a la izquierda y botones a la derecha */
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-links {
  display: flex;
  gap: 25px;
}

.nav-actions {
  display: flex;
  gap: 25px;
  align-items: center;
}

.nav-item {
  color: white; 
  text-decoration: none; 
  font-weight: bold;
  font-size: 1.05rem;
  transition: color 0.3s;
}

.nav-item:hover {
  color: #4CAF50;
}

.cart-btn {
  color: #4CAF50; 
  text-decoration: none; 
  font-weight: bold; 
  position: relative;
  font-size: 1.05rem;
}

.cart-badge {
  background: #ff4757; 
  color: white; 
  border-radius: 50%; 
  padding: 2px 6px; 
  font-size: 12px; 
  position: absolute; 
  top: -12px; 
  right: -20px;
  font-weight: bold;
}

.login-btn {
  color: white; 
  text-decoration: none; 
  border: 1px solid white; 
  padding: 8px 16px; 
  border-radius: 4px;
  font-weight: bold;
  transition: all 0.3s;
}

.login-btn:hover {
  background: white;
  color: #2c3e50;
}

.logout-btn {
  background: #ff4757; 
  color: white; 
  border: none; 
  padding: 8px 16px; 
  border-radius: 4px; 
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #ff2a3f;
}
</style>