import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useFiltros() {
  const route = useRoute()
  const router = useRouter()

  // Estado reactivo que lee la URL al cargar
  const filtros = reactive({
    busqueda: route.query.busqueda || '',
    categoria_id: route.query.categoria || '',
    precio_min: route.query.min || '',
    precio_max: route.query.max || '',
    orden: route.query.orden || 'nombre',
    dir: route.query.dir || 'asc',
    pagina: Number(route.query.p) || 1,
  })

  // Sincronizar filtros → URL (para que puedas compartir el link)
  watch(filtros, () => {
    router.push({ query: {
      busqueda: filtros.busqueda || undefined,
      categoria: filtros.categoria_id || undefined,
      min: filtros.precio_min || undefined,
      max: filtros.precio_max || undefined,
      orden: filtros.orden !== 'nombre' ? filtros.orden : undefined,
      dir: filtros.dir !== 'asc' ? filtros.dir : undefined,
      p: filtros.pagina > 1 ? filtros.pagina : undefined,
    }})
  }, { deep: true }) 

  return { filtros }
}