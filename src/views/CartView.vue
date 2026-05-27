<script setup>
import { useCarritoStore } from '../stores/carrito'
import { useRouter } from 'vue-router'

const carrito = useCarritoStore()
const router = useRouter()

const finalizarCompra = () => {
  if (carrito.items.length === 0) return
  alert('¡Compra finalizada con éxito! 🚀')
  carrito.vaciar()
  router.push('/')
}
</script>

<template>
  <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
    <h1>Tu Carrito de Compras</h1>
    
    <div v-if="carrito.items.length === 0" style="text-align: center; padding: 50px; background: white; border-radius: 8px;">
      <p>Tu carrito está vacío.</p>
      <router-link to="/catalogo" style="color: #2196F3;">Ir al catálogo</router-link>
    </div>

    <div v-else>
      <div v-for="item in carrito.items" :key="item.id" style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <div style="flex: 2;">
          <h3 style="margin: 0;">{{ item.nombre }}</h3>
          <p style="margin: 5px 0 0 0; color: gray;">${{ item.precio }} c/u</p>
        </div>
        
        <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
          <button @click="carrito.cambiarCantidad(item.id, item.cantidad - 1)" style="padding: 5px 10px; cursor: pointer;">-</button>
          <span>{{ item.cantidad }}</span>
          <button @click="carrito.cambiarCantidad(item.id, item.cantidad + 1)" style="padding: 5px 10px; cursor: pointer;">+</button>
        </div>

        <div style="flex: 1; text-align: right; font-weight: bold;">
          ${{ (item.precio * item.cantidad).toFixed(2) }}
        </div>

        <button @click="carrito.quitar(item.id)" style="margin-left: 20px; background: #ff4757; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">X</button>
      </div>

      <div style="margin-top: 30px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="margin-top: 0; display: flex; justify-content: space-between;">
          <span>Total:</span>
          <span>${{ carrito.totalPrecio.toFixed(2) }}</span>
        </h2>
        <button @click="finalizarCompra" style="width: 100%; padding: 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; margin-bottom: 10px; font-weight: bold;">Finalizar Compra</button>
        <button @click="carrito.vaciar" style="width: 100%; padding: 10px; background: transparent; color: #ff4757; border: 1px solid #ff4757; border-radius: 4px; cursor: pointer;">Vaciar Carrito</button>
      </div>
    </div>
  </div>
</template>