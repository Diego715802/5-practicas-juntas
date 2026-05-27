<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCarritoStore } from '../stores/carrito'
import { getProductos } from '../services/productoService' 

const productos = ref([])
const busqueda = ref('')
const cargando = ref(true)
const carrito = useCarritoStore()

const cargarProductos = async () => {
  try {
    const respuesta = await getProductos()
    // Si usaste el Resource de Laravel, los datos suelen venir dentro de 'data' [cite: 242]
    productos.value = respuesta.data.data || respuesta.data
  } catch (error) {
    console.error("Error al cargar el catálogo", error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarProductos()
})

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
        
        <img 
          :src="producto.imagen_url || '/img/placeholder.png'" 
          :alt="producto.nombre" 
          class="producto-imagen"
          @error="e => e.target.src = '/img/placeholder.png'" 
        />

        <h3>{{ producto.nombre }}</h3>
        <p class="precio">${{ producto.precio }}</p>
        
        <button @click="carrito.agregar(producto)" class="btn-carrito">
          <template v-if="carrito.cantidadDeProducto(producto.id) > 0">
            En carrito ({{ carrito.cantidadDeProducto(producto.id) }})
          </template>
          <template v-else>
            Agregar al carrito
          </template>
        </button>

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
.catalogo-container { padding: 2rem; min-height: 80vh; max-width: 1200px; margin: 0 auto; }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; color: #333; }
.glass-input {
  padding: 10px 20px; width: 300px; border-radius: 20px;
  border: 1px solid #ccc; outline: none; font-size: 1rem;
}
.loading { text-align: center; font-size: 1.2rem; padding: 2rem; }
.empty { text-align: center; font-size: 1.2rem; padding: 2rem; color: #666; }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }

.glass-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 15px; padding: 20px;
  text-align: center; transition: transform 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}
.glass-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }

.producto-imagen {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
  background-color: #f4f6f8;
}

.precio { font-size: 1.5rem; font-weight: bold; color: #4CAF50; margin: 10px 0; }

.btn-carrito {
  width: 100%; padding: 12px; background: #2196F3; color: white;
  border: none; border-radius: 8px; font-weight: bold; font-size: 1rem;
  cursor: pointer; transition: 0.3s; margin-bottom: 10px;
}
.btn-carrito:hover { background: #1976D2; }

.btn-detalles {
  display: inline-block; width: 100%; padding: 10px; box-sizing: border-box;
  background: transparent; color: #2196F3; border: 1px solid #2196F3;
  text-decoration: none; border-radius: 8px; font-weight: bold;
}
.btn-detalles:hover { background: #e3f2fd; }
</style>