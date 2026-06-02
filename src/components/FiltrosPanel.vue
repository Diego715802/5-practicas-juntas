<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'

const props = defineProps({
  filtros: { type: Object, required: true }
})

const categorias = ref([])
const busquedaLocal = ref(props.filtros.busqueda)
let timeout

// Cargar categorías dinámicamente
onMounted(async () => {
  const { data } = await api.get('/categorias')
  categorias.value = data.data || data
})

// Debounce para el input de texto
const onInputBusqueda = () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    props.filtros.busqueda = busquedaLocal.value
    props.filtros.pagina = 1 // Al buscar, regresamos a la pag 1
  }, 300)
}

const limpiarFiltros = () => {
  busquedaLocal.value = ''
  props.filtros.busqueda = ''
  props.filtros.categoria_id = ''
  props.filtros.precio_min = ''
  props.filtros.precio_max = ''
  props.filtros.orden = 'nombre'
  props.filtros.dir = 'asc'
  props.filtros.pagina = 1
}
</script>

<template>
  <div class="filtros-card">
    <h3 style="margin-top: 0;">Filtros</h3>

    <div class="form-group">
      <label>Buscar producto</label>
      <input type="text" v-model="busquedaLocal" @input="onInputBusqueda" placeholder="Ej. Laptop..." class="input-light" />
    </div>

    <div class="form-group">
      <label>Categoría</label>
      <select v-model="filtros.categoria_id" @change="filtros.pagina = 1" class="input-light">
        <option value="">Todas las categorías</option>
        <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
      </select>
    </div>

    <div class="form-group">
      <label>Rango de Precio</label>
      <div style="display: flex; gap: 10px;">
        <input type="number" v-model="filtros.precio_min" @change="filtros.pagina = 1" placeholder="Min" class="input-light min-max" />
        <input type="number" v-model="filtros.precio_max" @change="filtros.pagina = 1" placeholder="Max" class="input-light min-max" />
      </div>
    </div>

    <div class="form-group">
      <label>Ordenar por</label>
      <select v-model="filtros.orden" @change="filtros.pagina = 1" class="input-light">
        <option value="nombre">Nombre</option>
        <option value="precio">Precio</option>
      </select>
    </div>

    <div class="form-group" v-if="filtros.orden === 'precio'">
      <label>Dirección</label>
      <select v-model="filtros.dir" @change="filtros.pagina = 1" class="input-light">
        <option value="asc">De menor a mayor</option>
        <option value="desc">De mayor a menor</option>
      </select>
    </div>

    <button @click="limpiarFiltros" class="btn-clear">Limpiar filtros</button>
  </div>
</template>

<style scoped>
.filtros-card { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; font-size: 0.9rem; font-weight: bold; color: #555; margin-bottom: 5px; }
.input-light { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-family: inherit; }
.input-light:focus { outline: none; border-color: #2196F3; }
.min-max { width: 50%; }
.btn-clear { width: 100%; padding: 10px; margin-top: 10px; background: transparent; border: 1px solid #ff4757; color: #ff4757; border-radius: 4px; font-weight: bold; cursor: pointer; transition: 0.3s; }
.btn-clear:hover { background: #ffebee; }
</style>