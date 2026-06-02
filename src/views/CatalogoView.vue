<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCarritoStore } from '../stores/carrito'
import api from '@/plugins/axios'
import { useFiltros } from '../composables/useFiltros'
import FiltrosPanel from '../components/FiltrosPanel.vue'
import PaginacionNav from '../components/PaginacionNav.vue'

const { filtros } = useFiltros()
const route = useRoute()
const carrito = useCarritoStore()

const resultado = ref({ data: [], meta: {} })
const cargando = ref(false)

const cargarProductos = async () => {
  cargando.value = true
  try {
    // 💡 TRUCO: Creamos un objeto limpio solo con los datos básicos
    const parametrosLimpios = {
      orden: filtros.orden || 'nombre',
      dir: filtros.dir || 'asc',
      page: filtros.pagina || 1,
      por_pagina: 6 // 6 productos por página en el catálogo
    }
    
    // Solo agregamos los filtros si realmente tienen texto/números
    if (filtros.busqueda) parametrosLimpios.busqueda = filtros.busqueda
    if (filtros.categoria_id) parametrosLimpios.categoria_id = filtros.categoria_id
    if (filtros.precio_min) parametrosLimpios.precio_min = filtros.precio_min
    if (filtros.precio_max) parametrosLimpios.precio_max = filtros.precio_max

    // Hacemos la petición con los parámetros ya limpios
    const respuesta = await api.get('/productos', { params: parametrosLimpios })
    
    resultado.value = {
      data: respuesta.data.data || [],
      meta: respuesta.data.meta || {}
    }
  } catch (error) {
    console.error("Error cargando el catálogo:", error)
  } finally {
    cargando.value = false
  }
}

// Escuchamos la URL. Esto arranca la búsqueda automáticamente al entrar a la página
watch(() => route.query, cargarProductos, { immediate: true })

const cambiarPagina = (nuevaPagina) => {
  filtros.pagina = nuevaPagina
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="catalogo-layout">
    
    <aside class="sidebar">
      <FiltrosPanel :filtros="filtros" />
    </aside>

    <main class="main-content">
      <div class="header-section">
        <h1>Catálogo de Productos</h1>
        <p class="resultados-text" v-if="resultado.meta.total">
          Mostrando {{ resultado.data.length }} de {{ resultado.meta.total }} productos
        </p>
      </div>

      <div v-if="cargando" class="loading">Sincronizando inventario...</div>
      
      <div v-else-if="resultado.data.length === 0" class="empty">
        No se encontraron productos con estos filtros.
      </div>

      <div v-else class="grid">
        <div v-for="producto in resultado.data" :key="producto.id" class="card">
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
            <template v-else>Agregar al carrito</template>
          </button>
          
          <router-link :to="`/catalogo/${producto.id}`" class="btn-detalles">Ver Detalles</router-link>
        </div>
      </div>

      <PaginacionNav 
        v-if="!cargando && resultado.meta.last_page > 1"
        :meta="resultado.meta" 
        @cambio-pagina="cambiarPagina" 
      />
    </main>

  </div>
</template>

<style scoped>
.catalogo-layout { display: grid; grid-template-columns: 280px 1fr; gap: 30px; max-width: 1300px; margin: 0 auto; padding: 30px; }
@media (max-width: 768px) { .catalogo-layout { grid-template-columns: 1fr; } }

.header-section { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #ccc; margin-bottom: 20px; padding-bottom: 10px; }
h1 { margin: 0; color: #2c3e50; }
.resultados-text { color: #666; font-size: 0.9rem; font-weight: bold; }

.loading, .empty { text-align: center; padding: 50px; font-size: 1.2rem; color: #666; background: white; border-radius: 8px; border: 1px solid #e0e0e0; }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }

.card { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; text-align: center; transition: transform 0.3s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; flex-direction: column; }
.card:hover { transform: translateY(-5px); box-shadow: 0 8px 15px rgba(0,0,0,0.1); }

.producto-imagen { width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 15px; background-color: #f4f6f8; }
h3 { margin: 0 0 10px 0; color: #333; font-size: 1.1rem; }
.badge-cat { display: inline-block; background: #e3f2fd; color: #1976D2; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; margin-bottom: auto; align-self: center;}
.precio { font-size: 1.4rem; font-weight: bold; color: #4CAF50; margin: 15px 0; }

.btn-carrito { width: 100%; padding: 10px; background: #2196F3; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; transition: 0.3s; margin-bottom: 10px; }
.btn-carrito:hover { background: #1976D2; }
.btn-detalles { display: inline-block; width: 100%; padding: 10px; box-sizing: border-box; background: transparent; color: #2196F3; border: 1px solid #2196F3; text-decoration: none; border-radius: 4px; font-weight: bold; transition: 0.3s; }
.btn-detalles:hover { background: #e3f2fd; }
</style>