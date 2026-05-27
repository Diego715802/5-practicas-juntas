<template>
  <div class="error-page">
    <h1>404</h1>
    <p>Parece que te has perdido en el espacio. Esta ruta no existe.</p>
    <router-link to="/" class="btn-home">Llevame a casa</router-link>
  </div>
</template>

<style scoped>
.error-page { height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; text-align: center; }
h1 { font-size: 8rem; margin: 0; background: -webkit-linear-gradient(#ffd56b, #f68084); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.btn-home { margin-top: 20px; padding: 10px 25px; background: white; color: #7597de; text-decoration: none; border-radius: 20px; font-weight: bold; }
</style>
