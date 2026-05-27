<script setup>
import { ref, onMounted } from 'vue'
import { getProductos, createProducto, updateProducto, deleteProducto } from '@/services/productoService'

const productos = ref([])
const mensaje = ref({ texto: '', tipo: '' })
const isEditing = ref(false)
const cargando = ref(false) // Spinner de carga
const imagenFile = ref(null) // Archivo físico
const preview = ref(null) // URL temporal para preview

const formData = ref({ id: null, nombre: '', descripcion: '', precio: 0, stock: 0 })

const cargarProductos = async () => {
  cargando.value = true
  try {
    const respuesta = await getProductos()
    productos.value = respuesta.data
  } catch (error) {
    mostrarMensaje('Error al cargar inventario', 'error')
  } finally {
    cargando.value = false
  }
}

onMounted(() => cargarProductos())

// Manejo de la imagen [cite: 388, 389, 391, 392]
const onImageChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  imagenFile.value = file
  preview.value = URL.createObjectURL(file)
}

const guardarProducto = async () => {
  cargando.value = true
  // Crear el FormData [cite: 383, 394, 395]
  const fd = new FormData()
  fd.append('nombre', formData.value.nombre)
  fd.append('descripcion', formData.value.descripcion || '')
  fd.append('precio', formData.value.precio)
  fd.append('stock', formData.value.stock)
  if (imagenFile.value) fd.append('imagen', imagenFile.value) // Agrega imagen [cite: 398]

  try {
    if (isEditing.value) {
      await updateProducto(formData.value.id, fd)
      mostrarMensaje('Producto actualizado', 'exito')
    } else {
      await createProducto(fd)
      mostrarMensaje('Producto creado', 'exito')
    }
    limpiarFormulario()
    await cargarProductos()
  } catch (error) {
    mostrarMensaje('Verifica los datos e intenta de nuevo', 'error')
  } finally {
    cargando.value = false
  }
}

const editarProducto = (producto) => {
  formData.value = { ...producto }
  preview.value = producto.imagen_url // Muestra la imagen actual del server
  imagenFile.value = null
  isEditing.value = true
}

const eliminarProducto = async (id) => {
  if (window.confirm('¿Seguro que deseas eliminarlo?')) {
    cargando.value = true
    try {
      await deleteProducto(id)
      mostrarMensaje('Eliminado correctamente', 'exito')
      await cargarProductos()
    } catch (error) {
      mostrarMensaje('Error al eliminar', 'error')
    } finally {
      cargando.value = false
    }
  }
}

const limpiarFormulario = () => {
  formData.value = { id: null, nombre: '', descripcion: '', precio: 0, stock: 0 }
  imagenFile.value = null
  preview.value = null
  isEditing.value = false
  document.getElementById('fileInput').value = '' // Resetea el input file
}

// Alerta con auto-cierre (setTimeout) [cite: 418]
const mostrarMensaje = (texto, tipo) => {
  mensaje.value = { texto, tipo }
  setTimeout(() => { mensaje.value.texto = '' }, 3000)
}
</script>

<template>
  <div class="container">
    <h1>Gestión de Productos</h1>
    <div v-if="mensaje.texto" :class="['alert', mensaje.tipo === 'exito' ? 'success' : 'error']">
      {{ mensaje.texto }}
    </div>

    <div class="card">
      <h2>{{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
      <form @submit.prevent="guardarProducto">
        <div class="form-group">
          <label>Nombre:</label>
          <input v-model="formData.nombre" type="text" required />
        </div>
        <div class="form-group">
          <label>Descripción:</label>
          <textarea v-model="formData.descripcion"></textarea>
        </div>
        <div style="display: flex; gap: 15px;">
          <div class="form-group" style="flex: 1;">
            <label>Precio:</label>
            <input v-model="formData.precio" type="number" step="0.01" required />
          </div>
          <div class="form-group" style="flex: 1;">
            <label>Stock:</label>
            <input v-model="formData.stock" type="number" required />
          </div>
        </div>
        
        <div class="form-group">
          <label>Imagen de Portada:</label>
          <input type="file" id="fileInput" accept="image/*" @change="onImageChange" />
          
          <div v-if="preview" style="margin-top: 10px;">
            <img :src="preview" alt="Preview" style="max-width: 150px; border-radius: 8px; border: 1px solid #ddd;" />
          </div>
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="cargando">
          {{ cargando ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
        </button>
        <button type="button" v-if="isEditing" @click="limpiarFormulario" class="btn btn-secondary">
          Cancelar
        </button>
      </form>
    </div>

    <div class="card mt-2">
      <h2>Inventario</h2>
      <div v-if="cargando" style="text-align: center; padding: 20px;">Cargando base de datos... ⏳</div>
      <table v-else>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productos" :key="producto.id">
            <td>
              <img :src="producto.imagen_url || '/img/placeholder.png'" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" @error="e => e.target.src = '/img/placeholder.png'" />
            </td>
            <td>{{ producto.nombre }}</td>
            <td>${{ producto.precio }}</td>
            <td>{{ producto.stock }}</td>
            <td>
              <button @click="editarProducto(producto)" class="btn btn-edit">Editar</button>
              <button @click="eliminarProducto(producto.id)" class="btn btn-danger">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 900px; margin: 0 auto; padding: 20px; font-family: sans-serif; }
.card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-bottom: 20px; background: white; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
.form-group input, .form-group textarea { width: 100%; padding: 10px; box-sizing: border-box; border-radius: 4px; border: 1px solid #ccc; }
.btn { padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px; color: white; font-weight: bold; }
.btn-primary { background-color: #4CAF50; }
.btn-primary:disabled { background-color: #9E9E9E; cursor: not-allowed; }
.btn-secondary { background-color: #6c757d; }
.btn-edit { background-color: #2196F3; }
.btn-danger { background-color: #f44336; }
table { width: 100%; border-collapse: collapse; margin-top: 15px; background: white;}
th, td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; vertical-align: middle; }
.alert { padding: 15px; margin-bottom: 20px; border-radius: 4px; font-weight: bold; }
.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
</style>