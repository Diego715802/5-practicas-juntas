<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'

const categorias = ref([])
const mensaje = ref({ texto: '', tipo: '' })
const cargando = ref(false)
const formData = ref({ nombre: '', descripcion: '' })

const cargarCategorias = async () => {
  cargando.value = true
  try {
    const { data } = await api.get('/categorias')
    categorias.value = data.data || data
  } catch (error) {
    mostrarMensaje('Error al cargar categorías', 'error')
  } finally {
    cargando.value = false
  }
}

onMounted(() => cargarCategorias())

const guardarCategoria = async () => {
  cargando.value = true
  try {
    // Laravel generará el "slug" automáticamente o puedes enviarlo
    await api.post('/categorias', {
      nombre: formData.value.nombre,
      slug: formData.value.nombre.toLowerCase().replace(/ /g, '-'),
      descripcion: formData.value.descripcion
    })
    mostrarMensaje('Categoría creada con éxito', 'exito')
    formData.value = { nombre: '', descripcion: '' }
    await cargarCategorias()
  } catch (error) {
    mostrarMensaje('Error al crear categoría', 'error')
  } finally {
    cargando.value = false
  }
}

const eliminarCategoria = async (id) => {
  if (window.confirm('¿Seguro que deseas eliminar esta categoría?')) {
    cargando.value = true
    try {
      await api.delete(`/categorias/${id}`)
      mostrarMensaje('Categoría eliminada', 'exito')
      await cargarCategorias()
    } catch (error) {
      mostrarMensaje('Error al eliminar. Puede que tenga productos asociados.', 'error')
    } finally {
      cargando.value = false
    }
  }
}

const mostrarMensaje = (texto, tipo) => {
  mensaje.value = { texto, tipo }
  setTimeout(() => { mensaje.value.texto = '' }, 3000)
}
</script>

<template>
  <div class="container">
    <h1>Gestión de Categorías</h1>
    
    <div v-if="mensaje.texto" :class="['alert', mensaje.tipo === 'exito' ? 'success' : 'error']">
      {{ mensaje.texto }}
    </div>

    <div class="card">
      <h2>Nueva Categoría</h2>
      <form @submit.prevent="guardarCategoria">
        <div class="form-group">
          <label>Nombre:</label>
          <input v-model="formData.nombre" type="text" required placeholder="Ej. Electrónica" />
        </div>
        
        <div class="form-group">
          <label>Descripción:</label>
          <textarea v-model="formData.descripcion" placeholder="Opcional"></textarea>
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="cargando">
          {{ cargando ? 'Guardando...' : 'Crear Categoría' }}
        </button>
      </form>
    </div>

    <div class="card mt-2">
      <h2>Lista de Categorías</h2>
      <div v-if="cargando" style="text-align: center; padding: 20px;">Cargando... ⏳</div>
      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Ruta (Slug)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categorias" :key="cat.id">
            <td>{{ cat.id }}</td>
            <td><strong>{{ cat.nombre }}</strong></td>
            <td style="color: #666;">/{{ cat.slug }}</td>
            <td>
              <button @click="eliminarCategoria(cat.id)" class="btn btn-danger">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 900px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
.card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-bottom: 20px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }
.form-group input, .form-group textarea { width: 100%; padding: 10px; box-sizing: border-box; border-radius: 4px; border: 1px solid #ccc; font-family: inherit; }
.btn { padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px; color: white; font-weight: bold; transition: 0.3s; }
.btn-primary { background-color: #4CAF50; }
.btn-primary:hover:not(:disabled) { background-color: #45a049; }
.btn-primary:disabled { background-color: #9E9E9E; cursor: not-allowed; }
.btn-danger { background-color: #f44336; }
.btn-danger:hover { background-color: #d32f2f; }
table { width: 100%; border-collapse: collapse; margin-top: 15px; background: white;}
th, td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; vertical-align: middle; }
th { background-color: #f8f9fa; color: #333; }
.alert { padding: 15px; margin-bottom: 20px; border-radius: 4px; font-weight: bold; }
.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
</style>