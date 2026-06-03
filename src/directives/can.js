import { useAuthStore } from '@/stores/auth'
export const vCan = {
  mounted(el, binding) {
    const auth = useAuthStore()
    if (!auth.permisos?.[binding.value]) el.style.display = 'none'
  }
}