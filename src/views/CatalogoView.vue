<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCarritoStore } from '../stores/carrito'
import { getProductos } from '../services/productoService' 

const productos = ref([])
const busqueda = ref('')
const carrito = useCarritoStore()

onMounted(async () => {
  try {
    const respuesta = await getProductos()
    productos.value = respuesta.data
  } catch (error) {
    console.error("Error al cargar productos", error)
  }
})

const productosFiltrados = computed(() => {
  return productos.value.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})
</script>

<template>
  <div style="padding: 20px; max-width: 1000px; margin: 0 auto;">
    <h1>Catálogo de Productos</h1>
    <input v-model="busqueda" placeholder="Buscar producto..." style="padding: 10px; width: 100%; margin-bottom: 20px; box-sizing: border-box;" />

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
      <div v-for="producto in productosFiltrados" :key="producto.id" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0;">{{ producto.nombre }}</h3>
        <p style="font-size: 1.2em; color: #4CAF50; font-weight: bold;">${{ producto.precio }}</p>
        
        <button @click="carrito.agregar(producto)" style="width: 100%; padding: 10px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
          <template v-if="carrito.cantidadDeProducto(producto.id) > 0">
            En carrito ({{ carrito.cantidadDeProducto(producto.id) }})
          </template>
          <template v-else>
            Agregar al carrito
          </template>
        </button>
      </div>
    </div>
  </div>
</template>