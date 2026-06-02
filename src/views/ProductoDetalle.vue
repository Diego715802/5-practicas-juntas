<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'

const props = defineProps(['id']) 
const router = useRouter()
const producto = ref(null)
const cargando = ref(true)

onMounted(async () => {
  try {
    const response = await api.get(`/productos/${props.id}`)
    producto.value = response.data
  } catch (error) {
    console.error("Producto no encontrado")
  } finally {
    cargando.value = false
  }
})

const regresar = () => {
  router.back() 
}
</script>

<template>
  <div class="detalle-container">
    <button @click="regresar" class="btn-volver">← Volver al catálogo</button>
    
    <div v-if="cargando" class="loading">Cargando información...</div>
    
    <div v-else-if="producto" class="card-detalle">
      <div style="flex: 1;">
        <img 
          :src="producto.imagen_url || 'https://via.placeholder.com/400x300?text=Sin+Imagen'" 
          :alt="producto.nombre" 
          class="img-detalle"
          @error="e => e.target.src = 'https://via.placeholder.com/400x300?text=Error'" 
        />
      </div>
      <div style="flex: 1;">
        <h1>{{ producto.nombre }}</h1>
        <span v-if="producto.categoria" class="badge-cat">{{ producto.categoria.nombre }}</span>
        <p class="desc">{{ producto.descripcion }}</p>
        <div class="stats">
          <span class="badge badge-precio">Precio: ${{ producto.precio }}</span>
          <span class="badge badge-stock">Stock: {{ producto.stock }} unidades</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detalle-container { padding: 40px; max-width: 900px; margin: 0 auto; color: #333; }
.btn-volver { background: transparent; border: none; color: #2196F3; font-size: 1.1rem; cursor: pointer; margin-bottom: 20px; font-weight: bold; padding: 0;}
.btn-volver:hover { text-decoration: underline; }

.card-detalle {
  background: white; padding: 40px; border-radius: 8px; border: 1px solid #e0e0e0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; gap: 40px; flex-wrap: wrap;
}
.img-detalle { width: 100%; border-radius: 8px; object-fit: cover; }
h1 { margin-top: 0; color: #2c3e50; }
.badge-cat { display: inline-block; background: #e3f2fd; color: #1976D2; padding: 4px 10px; border-radius: 12px; font-size: 0.9rem; font-weight: bold; margin-bottom: 15px; }
.desc { font-size: 1.1rem; line-height: 1.6; color: #555; margin-bottom: 30px; }
.stats { display: flex; gap: 15px; flex-wrap: wrap; }
.badge { padding: 10px 20px; border-radius: 4px; font-weight: bold; }
.badge-precio { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
.badge-stock { background: #f5f5f5; color: #616161; border: 1px solid #e0e0e0; }
</style>