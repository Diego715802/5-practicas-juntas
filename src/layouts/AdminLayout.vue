<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<template>
  <div class="admin-wrapper">
    <aside class="sidebar glass-sidebar">
      <div class="user-profile">
        <div class="avatar"></div>
        <h3>{{ auth.user?.name || 'Administrador' }}</h3>
      </div>
      <nav class="admin-nav">
        <router-link to="/admin" exact-active-class="active">Dashboard</router-link>
        <router-link to="/admin/productos" active-class="active">Inventario</router-link>
        <button @click="auth.logout" class="btn-logout">Cerrar Sesión</button>
      </nav>
    </aside>

    <main class="admin-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.admin-wrapper { display: flex; min-height: 100vh; background: #f4f6f8; color: #333; }
.sidebar { width: 250px; padding: 20px; display: flex; flex-direction: column; background: white; box-shadow: 2px 0 10px rgba(0,0,0,0.05); }
.user-profile { text-align: center; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
.avatar { width: 80px; height: 80px; background: linear-gradient(135deg, #7597de, #f68084); border-radius: 50%; margin: 0 auto 10px; }
.admin-nav { display: flex; flex-direction: column; gap: 10px; }
.admin-nav a { padding: 12px 15px; text-decoration: none; color: #555; border-radius: 8px; font-weight: 500; transition: background 0.3s; }
.admin-nav a:hover, .admin-nav a.active { background: #7597de; color: white; }
.btn-logout { margin-top: auto; background: #ff4757; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; }
.admin-content { flex: 1; padding: 40px; }
</style>