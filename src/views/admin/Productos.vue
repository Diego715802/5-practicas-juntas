<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import PaginacionNav from '@/components/PaginacionNav.vue'
import InputField from '@/components/InputField.vue'
import { createProducto, updateProducto, deleteProducto } from '@/services/productoService'
import { useAuthStore } from '@/stores/auth'

import { useForm, useField } from 'vee-validate'
import { productoSchema } from '@/schemas/productoSchema'

const auth = useAuthStore()

const productos = ref([])
const categorias = ref([])
const metaPaginacion = ref({}) 
const paginaActual = ref(1)

const mensaje = ref({ texto: '', tipo: '' })
const isEditing = ref(false)
const productoEditId = ref(null) 
const cargando = ref(false) 
const imagenFile = ref(null) 
const preview = ref(null) 
const erroresServidor = ref({}) 

const { handleSubmit, errors, resetForm, setValues } = useForm({
  validationSchema: productoSchema,
  initialValues: { nombre: '', descripcion: '', precio: 0, stock: 0, categoria_id: '' }
})

const { value: nombre } = useField('nombre')
const { value: descripcion } = useField('descripcion')
const { value: precio } = useField('precio')
const { value: stock } = useField('stock')
const { value: categoria_id } = useField('categoria_id')

const cargarProductos = async () => {
  cargando.value = true
  try {
    const catRes = await api.get('/categorias')
    categorias.value = catRes.data.data || catRes.data

    const respuesta = await api.get('/productos', {
      params: { page: paginaActual.value, por_pagina: 5 }
    })
    
    productos.value = respuesta.data.data 
    metaPaginacion.value = respuesta.data.meta 
  } catch (error) {
    mostrarMensaje('Error al cargar base de datos', 'error')
  } finally {
    cargando.value = false
  }
}

onMounted(() => cargarProductos())

const cambiarPagina = (nuevaPagina) => {
  paginaActual.value = nuevaPagina
  cargarProductos()
}

const onImageChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  imagenFile.value = file
  preview.value = URL.createObjectURL(file)
}

const guardarProducto = handleSubmit(async (values) => {
  cargando.value = true
  erroresServidor.value = {} 

  const fd = new FormData()
  fd.append('nombre', values.nombre)
  fd.append('descripcion', values.descripcion || '')
  fd.append('precio', values.precio)
  fd.append('stock', values.stock)
  fd.append('categoria_id', values.categoria_id || '')
  if (imagenFile.value) fd.append('imagen', imagenFile.value) 

  try {
    if (isEditing.value) {
      await updateProducto(productoEditId.value, fd)
      mostrarMensaje('Producto actualizado', 'exito')
    } else {
      await createProducto(fd)
      mostrarMensaje('Producto creado', 'exito')
    }
    limpiarFormulario()
    await cargarProductos()
  } catch (error) {
    if (error.response?.status === 422) {
      erroresServidor.value = error.response.data.errors
      mostrarMensaje('Revisa los errores en rojo', 'error')
    } else {
      mostrarMensaje('Ocurrió un error en el servidor', 'error')
    }
  } finally {
    cargando.value = false
  }
})

const editarProducto = (producto) => {
  setValues({
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    stock: producto.stock,
    categoria_id: producto.categoria_id || ''
  })
  productoEditId.value = producto.id
  preview.value = producto.imagen_url 
  imagenFile.value = null
  isEditing.value = true
  erroresServidor.value = {}
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
  resetForm() 
  imagenFile.value = null
  preview.value = null
  isEditing.value = false
  productoEditId.value = null
  erroresServidor.value = {}
  document.getElementById('fileInput').value = '' 
}

const mostrarMensaje = (texto, tipo) => {
  mensaje.value = { texto, tipo }
  setTimeout(() => { mensaje.value.texto = '' }, 3000)
}
</script>

<template>
  <div class="container">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h1 style="margin: 0; color: #2c3e50;">Gestión de Productos</h1>
      <span style="background: #e3f2fd; color: #1976D2; padding: 5px 15px; border-radius: 20px; font-weight: bold; text-transform: uppercase;">
        Rol actual: {{ auth.user?.rol || 'No definido' }}
      </span>
    </div>
    
    <div v-if="mensaje.texto" :class="['alert', mensaje.tipo === 'exito' ? 'success' : 'error']">
      {{ mensaje.texto }}
    </div>

    <div class="card" v-if="auth.user?.rol === 'admin' || auth.user?.rol === 'editor'">
      <h2>{{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
      
      <form @submit.prevent="guardarProducto">
        <InputField 
          label="Nombre del producto" 
          name="nombre" 
          v-model="nombre" 
          :error="errors.nombre || erroresServidor.nombre?.[0]" 
        />
        
        <div class="form-group">
          <label>Descripción:</label>
          <textarea v-model="descripcion" :class="{ 'input-error': errors.descripcion || erroresServidor.descripcion }"></textarea>
          <span class="error-msg" v-if="errors.descripcion || erroresServidor.descripcion?.[0]">
            {{ errors.descripcion || erroresServidor.descripcion?.[0] }}
          </span>
        </div>

        <div class="form-group">
          <label>Categoría:</label>
          <select v-model="categoria_id" :class="{ 'input-error': errors.categoria_id || erroresServidor.categoria_id }">
            <option value="">Sin categoría</option>
            <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
          </select>
          <span class="error-msg" v-if="errors.categoria_id || erroresServidor.categoria_id?.[0]">
            {{ errors.categoria_id || erroresServidor.categoria_id?.[0] }}
          </span>
        </div>

        <div style="display: flex; gap: 15px;">
          <div style="flex: 1;">
            <InputField 
              label="Precio" 
              name="precio" 
              type="number" 
              step="0.01"
              v-model="precio" 
              :error="errors.precio || erroresServidor.precio?.[0]" 
            />
          </div>
          <div style="flex: 1;">
            <InputField 
              label="Stock" 
              name="stock" 
              type="number" 
              v-model="stock" 
              :error="errors.stock || erroresServidor.stock?.[0]" 
            />
          </div>
        </div>
        
        <div class="form-group">
          <label>Imagen de Portada:</label>
          <input type="file" id="fileInput" accept="image/*" @change="onImageChange" :class="{ 'input-error': erroresServidor.imagen }" />
          <span class="error-msg" v-if="erroresServidor.imagen?.[0]">
            {{ erroresServidor.imagen?.[0] }}
          </span>
          <div v-if="preview" style="margin-top: 10px;">
            <img :src="preview" alt="Preview" style="max-width: 150px; border-radius: 8px; border: 1px solid #ddd;" />
          </div>
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="cargando">
          {{ cargando ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
        </button>
        <button type="button" v-if="isEditing" @click="limpiarFormulario" class="btn btn-secondary">Cancelar</button>
      </form>
    </div>

    <div class="card mt-2">
      <h2>Inventario</h2>
      <div v-if="cargando" style="text-align: center; padding: 20px;">Cargando base de datos... ⏳</div>
      <div v-else>
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="producto in productos" :key="producto.id">
              <td>
                <img :src="producto.imagen_url || 'https://dummyimage.com/50x50/cccccc/000000.png&text=Foto'" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" @error="e => e.target.src = 'https://dummyimage.com/50x50/cccccc/000000.png&text=Foto'" />
              </td>
              <td><strong>{{ producto.nombre }}</strong></td>
              <td>{{ producto.categoria ? producto.categoria.nombre : 'Sin categoría' }}</td>
              <td style="color: #4CAF50; font-weight: bold;">${{ producto.precio }}</td>
              <td>{{ producto.stock }}</td>
              <td>
                <button v-if="auth.user?.rol === 'admin' || auth.user?.rol === 'editor'" @click="editarProducto(producto)" class="btn btn-edit">Editar</button>
                
                <button v-if="auth.user?.rol === 'admin'" @click="eliminarProducto(producto.id)" class="btn btn-danger">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <PaginacionNav 
          v-if="metaPaginacion && metaPaginacion.last_page > 1" 
          :meta="metaPaginacion" 
          @cambio-pagina="cambiarPagina" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 900px; margin: 0 auto; padding: 20px; font-family: sans-serif; }
.card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-bottom: 20px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; color: #555;}
.form-group textarea, .form-group select, input[type="file"] { width: 100%; padding: 10px; box-sizing: border-box; border-radius: 4px; border: 1px solid #ccc; font-family: inherit; transition: 0.3s;}
.input-error { border-color: #f44336 !important; background-color: #fff8f8; }
.error-msg { color: #f44336; font-size: 0.85rem; font-weight: bold; margin-top: 4px; display: block; }

.btn { padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px; color: white; font-weight: bold; transition: 0.3s;}
.btn-primary { background-color: #4CAF50; }
.btn-primary:hover { background-color: #388E3C; }
.btn-primary:disabled { background-color: #9E9E9E; cursor: not-allowed; }
.btn-secondary { background-color: #6c757d; }
.btn-edit { background-color: #2196F3; }
.btn-edit:hover { background-color: #1976D2; }
.btn-danger { background-color: #f44336; }
.btn-danger:hover { background-color: #d32f2f; }

table { width: 100%; border-collapse: collapse; margin-top: 15px; background: white;}
th, td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; vertical-align: middle; }
th { background-color: #f9f9f9; color: #333; }
.alert { padding: 15px; margin-bottom: 20px; border-radius: 4px; font-weight: bold; }
.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
</style>