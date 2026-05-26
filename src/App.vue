<script setup>
import { ref, onMounted } from 'vue'
import { getProductos, createProducto, updateProducto, deleteProducto } from './services/productoService'

// Estados
const productos = ref([])
const mensaje = ref({ texto: '', tipo: '' })
const isEditing = ref(false)

// Formulario con v-model [cite: 73]
const formData = ref({
  id: null,
  nombre: '',
  descripcion: '',
  precio: 0,
  stock: 0
})

// Cargar productos al iniciar [cite: 71]
const cargarProductos = async () => {
  try {
    const respuesta = await getProductos()
    productos.value = respuesta.data
  } catch (error) {
    mostrarMensaje('Error al cargar los productos', 'error')
  }
}

onMounted(() => {
  cargarProductos()
})

// Guardar o Actualizar [cite: 74]
const guardarProducto = async () => {
  try {
    if (isEditing.value) {
      await updateProducto(formData.value.id, formData.value)
      mostrarMensaje('Producto actualizado exitosamente', 'exito')
    } else {
      await createProducto(formData.value)
      mostrarMensaje('Producto creado exitosamente', 'exito')
    }
    limpiarFormulario()
    cargarProductos() // Recarga la lista sin refrescar la página [cite: 18]
  } catch (error) {
    mostrarMensaje('Ocurrió un error al guardar', 'error')
  }
}

// Editar (Cargar datos en el formulario) [cite: 70]
const editarProducto = (producto) => {
  formData.value = { ...producto }
  isEditing.value = true
}

// Eliminar con confirmación [cite: 70, 76]
const eliminarProducto = async (id) => {
  if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    try {
      await deleteProducto(id)
      mostrarMensaje('Producto eliminado', 'exito')
      cargarProductos()
    } catch (error) {
      mostrarMensaje('Error al eliminar', 'error')
    }
  }
}

// Utilidades
const limpiarFormulario = () => {
  formData.value = { id: null, nombre: '', descripcion: '', precio: 0, stock: 0 }
  isEditing.value = false
}

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
        <div class="form-group">
          <label>Precio:</label>
          <input v-model="formData.precio" type="number" step="0.01" required />
        </div>
        <div class="form-group">
          <label>Stock:</label>
          <input v-model="formData.stock" type="number" required />
        </div>
        
        <button type="submit" class="btn btn-primary">
          {{ isEditing ? 'Actualizar' : 'Crear' }}
        </button>
        <button type="button" v-if="isEditing" @click="limpiarFormulario" class="btn btn-secondary">
          Cancelar
        </button>
      </form>
    </div>

    <div class="card mt-2">
      <h2>Lista de Productos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productos" :key="producto.id">
            <td>{{ producto.id }}</td>
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
/* Estilos básicos para cumplir la rúbrica de código limpio */
.container { max-width: 800px; margin: 0 auto; padding: 20px; font-family: sans-serif; }
.card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
.form-group input, .form-group textarea { width: 100%; padding: 8px; box-sizing: border-box; }
.btn { padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px; color: white; }
.btn-primary { background-color: #4CAF50; }
.btn-secondary { background-color: #6c757d; }
.btn-edit { background-color: #2196F3; }
.btn-danger { background-color: #f44336; }
table { width: 100%; border-collapse: collapse; margin-top: 15px; }
th, td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
.alert { padding: 10px; margin-bottom: 20px; border-radius: 4px; }
.success { background-color: #d4edda; color: #155724; }
.error { background-color: #f8d7da; color: #721c24; }
</style>