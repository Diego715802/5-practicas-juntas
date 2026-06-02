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
  <div style="padding: 20px; max-width: 800px; margin: 0 auto; color: #333;">
    <h1 style="color: #2c3e50;">Tu Carrito de Compras</h1>
    
    <div v-if="carrito.items.length === 0" style="text-align: center; padding: 50px; background: white; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
      <p style="color: #666; font-size: 1.1rem;">Tu carrito está vacío.</p>
      <router-link to="/catalogo" style="color: #2196F3; font-weight: bold; text-decoration: none;">Ir al catálogo</router-link>
    </div>

    <div v-else>
      <div v-for="item in carrito.items" :key="item.id" style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 20px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
        <div style="flex: 2;">
          <h3 style="margin: 0; color: #333;">{{ item.nombre }}</h3>
          <p style="margin: 5px 0 0 0; color: #666;">${{ item.precio }} c/u</p>
        </div>
        
        <div style="display: flex; align-items: center; gap: 10px; flex: 1; justify-content: center;">
          <button @click="carrito.cambiarCantidad(item.id, item.cantidad - 1)" style="padding: 5px 12px; cursor: pointer; border: 1px solid #ccc; background: #f9f9f9; border-radius: 4px; font-weight: bold;">-</button>
          <span style="font-weight: bold; width: 20px; text-align: center;">{{ item.cantidad }}</span>
          <button @click="carrito.cambiarCantidad(item.id, item.cantidad + 1)" style="padding: 5px 12px; cursor: pointer; border: 1px solid #ccc; background: #f9f9f9; border-radius: 4px; font-weight: bold;">+</button>
        </div>

        <div style="flex: 1; text-align: right; font-weight: bold; font-size: 1.1rem; color: #2e7d32;">
          ${{ (item.precio * item.cantidad).toFixed(2) }}
        </div>

        <button @click="carrito.quitar(item.id)" style="margin-left: 20px; background: #ff4757; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">X</button>
      </div>

      <div style="margin-top: 30px; background: white; padding: 25px; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
        <h2 style="margin-top: 0; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 15px; color: #2c3e50;">
          <span>Total:</span>
          <span style="color: #4CAF50;">${{ carrito.totalPrecio.toFixed(2) }}</span>
        </h2>
        <button @click="finalizarCompra" style="width: 100%; padding: 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; margin-bottom: 10px; font-weight: bold;">Finalizar Compra</button>
        <button @click="carrito.vaciar" style="width: 100%; padding: 12px; background: transparent; color: #ff4757; border: 1px solid #ff4757; border-radius: 4px; cursor: pointer; font-weight: bold;">Vaciar Carrito</button>
      </div>
    </div>
  </div>
</template>