# Tienda Estelar - Proyecto Integrador Full-Stack (Práctica 05)

Este proyecto es una SPA completa construida con Vue.js 3 y Laravel 11. Incluye autenticación con Sanctum, carrito de compras persistente con Pinia, enrutamiento seguro con Vue Router y subida de archivos (imágenes) procesados a través de FormData.

## Requisitos
- PHP 8.2+
- Composer
- Node.js 18+
- Base de datos MySQL

## Instrucciones de Instalación

### 1. Configuración del Backend (Laravel)
\`\`\`bash
cd practica1-api
composer install
cp .env.example .env
php artisan key:generate
# Configura tu base de datos en el archivo .env y asegúrate de tener FILESYSTEM_DISK=public
php artisan migrate
php artisan storage:link # Importante para hacer públicas las imágenes subidas
php artisan serve
\`\`\`

### 2. Configuración del Frontend (Vue)
\`\`\`bash
cd practica1-frontend
npm install
npm run dev
\`\`\`

## Características Principales
* **Catálogo Público:** Busca productos en tiempo real (Computed properties). Las imágenes son cargadas desde el storage del servidor backend.
* **Carrito (Pinia):** Gestión global del carrito, incrementa cantidades o elimina productos. Se guarda en localStorage.
* **Autenticación (Sanctum):** Login y Registro que retornan un token Bearer inyectado en cada petición mediante Axios Interceptors.
* **Panel de Admin:** Rutas privadas donde solo usuarios autenticados pueden crear, editar, y eliminar productos y subir sus imágenes de portada (FormData Multipart).