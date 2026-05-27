<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'

const props = defineProps(['id']) // Recibe el ID de la ruta 
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
  router.back() // Regresa a la vista anterior sin recargar [cite: 261]
}
</script>

<template>
  <div class="detalle-container">
    <button @click="regresar" class="btn-volver">← Volver al catálogo</button>
    
    <div v-if="cargando" class="loading">Cargando información...</div>
    
    <div v-else-if="producto" class="glass-panel">
      <h1>{{ producto.nombre }}</h1>
      <p class="desc">{{ producto.descripcion }}</p>
      <div class="stats">
        <span class="badge">Precio: ${{ producto.precio }}</span>
        <span class="badge">Stock: {{ producto.stock }} unidades</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detalle-container { padding: 40px; max-width: 800px; margin: 0 auto; color: white; }
.btn-volver { background: transparent; border: none; color: #ffd56b; font-size: 1.1rem; cursor: pointer; margin-bottom: 20px; }
.glass-panel {
  background: rgba(25, 30, 50, 0.4); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
  padding: 40px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.15);
}
.desc { font-size: 1.2rem; line-height: 1.6; margin: 20px 0; }
.stats { display: flex; gap: 15px; }
.badge { padding: 10px 20px; background: rgba(255, 255, 255, 0.2); border-radius: 30px; font-weight: bold; }
</style>