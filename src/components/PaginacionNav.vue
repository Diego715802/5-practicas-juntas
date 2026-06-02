<script setup>
import { computed } from 'vue'

const props = defineProps({
  meta: { type: Object, required: true }
})
const emit = defineEmits(['cambio-pagina'])

const paginas = computed(() => {
  if (!props.meta.last_page) return []
  let pages = []
  for (let i = 1; i <= props.meta.last_page; i++) { pages.push(i) }
  return pages
})
</script>

<template>
  <div class="paginacion-container" v-if="meta && meta.last_page > 1">
    <button 
      class="btn-page" 
      :disabled="meta.current_page === 1" 
      @click="emit('cambio-pagina', meta.current_page - 1)">
      Anterior
    </button>
    
    <div class="pages-list">
      <button 
        v-for="p in paginas" 
        :key="p" 
        :class="['btn-page num', { active: p === meta.current_page }]"
        @click="emit('cambio-pagina', p)">
        {{ p }}
      </button>
    </div>

    <button 
      class="btn-page" 
      :disabled="meta.current_page === meta.last_page" 
      @click="emit('cambio-pagina', meta.current_page + 1)">
      Siguiente
    </button>
  </div>
</template>

<style scoped>
.paginacion-container { display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 30px; padding: 20px 0; }
.pages-list { display: flex; gap: 5px; }
.btn-page { padding: 8px 15px; background: white; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; color: #333; font-weight: bold; transition: 0.2s; }
.btn-page:hover:not(:disabled) { border-color: #2196F3; color: #2196F3; }
.btn-page:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-page.num { padding: 8px 12px; }
.btn-page.active { background: #2196F3; color: white; border-color: #2196F3; }
</style>