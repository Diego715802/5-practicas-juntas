import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/catalogo', name: 'catalogo', component: () => import('../views/CatalogoView.vue') },
  { path: '/carrito', name: 'carrito', component: () => import('../views/CartView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { 
    path: '/admin', 
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
      { path: 'productos', name: 'productos', component: () => import('../views/admin/Productos.vue') },
      { path: 'nuevo', name: 'nuevo', component: () => import('../views/admin/NuevoProducto.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guarda global de navegación
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router