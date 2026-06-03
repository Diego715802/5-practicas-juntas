import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { vCan } from './directives/can' // <-- Importa la directiva

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.directive('can', vCan) // <-- Regístrala

app.mount('#app')