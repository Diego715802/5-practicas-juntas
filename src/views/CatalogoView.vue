<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCarritoStore } from '../stores/carrito'
import { getProductos } from '../services/productoService' 
import api from '@/plugins/axios'

const productos = ref([])
const categorias = ref([])
const categoriaActiva = ref(null)
const busqueda = ref('')
const cargando = ref(true)
const carrito = useCarritoStore()

const cargarTodo = async () => {
  cargando.value = true
  try {
    const catResponse = await api.get('/categorias')
    categorias.value = catResponse.data.data || catResponse.data

    const prodResponse = await getProductos()
    productos.value = prodResponse.data.data || prodResponse.data
  } catch (error) {
    console.error("Error al cargar datos", error)
  } finally {
    cargando.value = false
  }
}

const filtrarPorCategoria = async (cat) => {
  categoriaActiva.value = cat
  cargando.value = true
  try {
    if (!cat) {
      const { data } = await getProductos()
      productos.value = data.data || data
    } else {
      const { data } = await api.get(`/categorias/${cat.id}/productos`)
      productos.value = data.data || data
    }
  } catch (error) {
    console.error("Error al filtrar", error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => cargarTodo())

const productosFiltrados = computed(() => {
  if (!Array.isArray(productos.value)) return []
  return productos.value.filter(p => 
    p.nombre && p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})
</script>

<template>
  <div class="catalogo-container">
    <div class="header-section">
      <h1>Catálogo de Productos</h1>
      <input 
        type="text" 
        v-model="busqueda" 
        placeholder="Buscar un producto..." 
        class="search-bar"
      />
    </div>

    <div class="categorias-tabs">
      <button 
        @click="filtrarPorCategoria(null)" 
        :class="['btn-categoria', { active: !categoriaActiva }]">
        Todos
      </button>
      <button 
        v-for="cat in categorias" 
        :key="cat.id" 
        @click="filtrarPorCategoria(cat)" 
        :class="['btn-categoria', { active: categoriaActiva?.id === cat.id }]">
        {{ cat.nombre }}
      </button>
    </div>

    <div v-if="cargando" class="loading">Cargando datos...</div>

    <div v-else class="grid">
      <div v-for="producto in productosFiltrados" :key="producto.id" class="card">
        
        <img 
          :src="producto.imagen_url || 'https://via.placeholder.com/300x200?text=Sin+Imagen'" 
          :alt="producto.nombre" 
          class="producto-imagen"
          @error="e => e.target.src = 'https://via.placeholder.com/300x200?text=Error'" 
        />

        <h3>{{ producto.nombre }}</h3>
        <span v-if="producto.categoria" class="badge-cat">{{ producto.categoria.nombre }}</span>
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
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; color: #333; flex-wrap: wrap; gap: 1rem;}
.search-bar { padding: 10px 20px; width: 300px; border-radius: 4px; border: 1px solid #ccc; outline: none; font-size: 1rem; }

.categorias-tabs { display: flex; gap: 10px; margin-bottom: 2rem; overflow-x: auto; padding-bottom: 10px; }
.btn-categoria { padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 20px; cursor: pointer; transition: 0.3s; font-weight: bold; color: #666; }
.btn-categoria:hover { border-color: #2196F3; color: #2196F3; }
.btn-categoria.active { background: #2196F3; color: white; border-color: #2196F3; }

.loading { text-align: center; font-size: 1.2rem; padding: 2rem; }
.empty { text-align: center; font-size: 1.2rem; padding: 2rem; color: #666; }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }

.card {
  background: white;
  border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;
  text-align: center; transition: transform 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.card:hover { transform: translateY(-5px); box-shadow: 0 8px 15px rgba(0,0,0,0.1); }

.producto-imagen { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px; background-color: #f4f6f8; }

h3 { margin: 0 0 10px 0; color: #333; }
.badge-cat { display: inline-block; background: #e3f2fd; color: #1976D2; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; margin-bottom: 10px; }
.precio { font-size: 1.5rem; font-weight: bold; color: #4CAF50; margin: 10px 0; }

.btn-carrito {
  width: 100%; padding: 12px; background: #2196F3; color: white;
  border: none; border-radius: 4px; font-weight: bold; font-size: 1rem;
  cursor: pointer; transition: 0.3s; margin-bottom: 10px;
}
.btn-carrito:hover { background: #1976D2; }

.btn-detalles {
  display: inline-block; width: 100%; padding: 10px; box-sizing: border-box;
  background: transparent; color: #2196F3; border: 1px solid #2196F3;
  text-decoration: none; border-radius: 4px; font-weight: bold;
}
.btn-detalles:hover { background: #e3f2fd; }
</style>