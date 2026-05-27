<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/plugins/axios'

const productos = ref([])
const busqueda = ref('')
const cargando = ref(true)

// Petición a tu API de Laravel
const cargarProductos = async () => {
  try {
    const response = await api.get('/productos')
    productos.value = response.data
  } catch (error) {
    console.error("Error cargando el catálogo", error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarProductos()
})

// Filtrado reactivo en tiempo real [cite: 252]
const productosFiltrados = computed(() => {
  return productos.value.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})
</script>

<template>
  <div class="catalogo-container">
    <div class="header-section">
      <h1>Catálogo Estelar</h1>
      <input 
        type="text" 
        v-model="busqueda" 
        placeholder="Buscar un producto..." 
        class="search-bar glass-input"
      />
    </div>

    <div v-if="cargando" class="loading">Sincronizando datos...</div>

    <div v-else class="grid">
      <div v-for="producto in productosFiltrados" :key="producto.id" class="card glass-card">
        <h3>{{ producto.nombre }}</h3>
        <p class="precio">${{ producto.precio }}</p>
        <router-link :to="`/catalogo/${producto.id}`" class="btn-detalles">
          Ver Detalles
        </router-link>
      </div>
    </div>
    
    <div v-if="!cargando && productosFiltrados.length === 0" class="empty">
      No se encontraron coincidencias.
    </div>
  </div>
</template>

<style scoped>
.catalogo-container { padding: 2rem; min-height: 80vh; }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; color: white; }
.glass-input {
  padding: 10px 20px; width: 300px; border-radius: 20px;
  background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5); color: white; outline: none;
}
.glass-input::placeholder { color: rgba(255, 255, 255, 0.7); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
.glass-card {
  background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 15px; padding: 20px;
  color: white; text-align: center; transition: transform 0.3s ease;
}
.glass-card:hover { transform: translateY(-5px); background: rgba(255, 255, 255, 0.2); }
.precio { font-size: 1.5rem; font-weight: bold; color: #ffd56b; margin: 10px 0; }
.btn-detalles {
  display: inline-block; padding: 8px 16px; background: rgba(255, 255, 255, 0.3);
  color: white; text-decoration: none; border-radius: 8px; margin-top: 10px;
}
</style>