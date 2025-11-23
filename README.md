````markdown
# 🌯🍝🍟 BeaucheFoods 🥗🍔🍕

Proyecto para el curso de Aplicaciones Web Reactivas (CC5003), semestre Primavera 2025.

## Descripción

BeaucheFoods es una aplicación web SPA (Single Page Application) desarrollada con React (Vite + TypeScript) y un backend en Node.js (Express + TypeScript + Mongoose). Su objetivo es ayudar a los estudiantes de Bauchef a encontrar, explorar y reseñar diferentes opciones de comida dentro o cerca de la facultad. Incluye autenticación de usuarios y roles (administrador, reviewer, seller).

## Requisitos previos

- Node.js (versión 18 o superior) instalado en tu sistema.
- npm (viene incluido con Node.js).
- MongoDB (instalado localmente o una instancia en la nube como MongoDB Atlas).

## Variables de Entorno

El backend requiere un archivo `.env` en la carpeta `backend` con las siguientes variables:

```dotenv
# backend/.env
MONGODB_URI=mongodb://localhost:27017/<tu-db-name> # Reemplaza con tu connection string de MongoDB
JWT_SECRET=tu_clave_super_secreta_y_larga_generada_aqui # Genera una clave secreta segura y larga
```

Puedes copiar el archivo `backend/.env.example` como punto de partida. Asegúrate de reemplazar `<tu-db-name>` y generar una `JWT_SECRET` segura.

## Instalación y ejecución local

El proyecto está dividido en dos carpetas principales: `backend` y `frontend`.

### Opción 1: Usar el script de inicio (recomendado)

1.  **Configura el archivo `.env` en la carpeta `backend`** (ver sección "Variables de Entorno").
2.  **Abre una terminal en la raíz del proyecto.**
3.  **Dale permisos de ejecución al script:**
    ```bash
    chmod +x start.sh
    ```
4.  **Ejecuta el script:**
    ```bash
    ./start.sh
    ```

Esto hará lo siguiente automáticamente:

- Instalará las dependencias en `backend` y `frontend` (si no existen `node_modules`).
- Compilará el backend de TypeScript a JavaScript (necesario para `npm run start` o `npm run dev` según esté configurado el script).
- Iniciará el servidor backend (Express) en `http://localhost:3001` (o el puerto configurado).
- Esperará unos segundos para que el backend esté listo.
- Iniciará el frontend (Vite) en `http://localhost:5173` (puerto por defecto de Vite).

Abre tu navegador en `http://localhost:5173` para ver la aplicación. El backend se detendrá automáticamente cuando cierres el frontend (Ctrl+C).

### Opción 2: Ejecución manual (paso a paso)

1.  **Configura el archivo `.env` en la carpeta `backend`.**
2.  **Instalar dependencias y compilar/iniciar backend (en una terminal):**
    ```bash
    cd backend
    npm install
    npm run build # Compila TypeScript a JavaScript (necesario la primera vez)
    npm run dev   # Inicia el backend en modo desarrollo (con ts-node-dev)
    # O usa 'npm start' para ejecutar el código compilado
    ```
    El backend estará corriendo en `http://localhost:3001`. Déjalo corriendo.
3.  **Instalar dependencias e iniciar frontend (en otra terminal):**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    Abre `http://localhost:5173` en tu navegador.

Para detener todo, usa Ctrl+C en cada terminal.

---

## Informe de entrega

A continuación se entrega lo pedido en el informe del Hito 3.

### Tema general del proyecto

BeaucheFoods es una aplicación web SPA desarrollada con React (Vite + TypeScript) y un backend en Node.js (Express + TypeScript + Mongoose). La idea de la aplicación es permitirle a los estudiantes de Beauchef el poder buscar tiendas y productos, dejar reseñas, y gestionar sus tiendas (deoendiendo del rol). Permite buscar tanto productos como tiendas específicas para ver reseñas y comparar precios.

### Estructura del estado global

- Librería de estado: Zustand (ver `frontend/package.json`, dependencia `zustand`).
- Stores principales (carpeta `frontend/src/stores`):
  - `useAuthStore.ts`: mantiene `user` y `isLoading`, métodos `checkAuth`, `login`, `signup`, `logout`. `checkAuth` consulta el backend al iniciar la app para restablecer la sesión.
  - `useStoreStore.ts`: store para tiendas y productos — mantiene estados de tiendas, filtros y carga; ver código en `frontend/src/stores`.
  - `useUIStore.ts`: estado UI global: loaders, estado modal, etc.

Entradas, salidas y errores
- Entrada: acciones UI (login, logout, fetch stores, apply seller, crear tienda, etc.).
- Salida: datos serializables (objetos `User`, `Store`, `Review`) y flags de loading/error.
- Errores: surfaceados al UI mediante `NotificationSnackbar` o estados en las stores.

### Mapa de rutas y flujo de autenticación

Rutas principales (definidas en `frontend/src/App.tsx`):

- `/` — Lista de tiendas (pública).
- `/store/:storeId` — Detalle de tienda (pública).
- `/product-search` — Búsqueda de productos (pública).
- `/login` — Página de login.
- `/signup` — Página de registro.

Rutas protegidas (requieren autenticación y algunos solo son accesibles para roles específicos):

- `/users` — Gestión de usuarios (solo `admin`).
- `/admin/requests` — Peticiones de seller (solo `admin`).
- `/new-store`, `/edit-store/:storeId`, `/my-stores` — Crear/editar/mis tiendas (roles de `seller` o `admin`).
- `/become-seller` — Aplicación para seller (rol `reviewer` en la aplicación actual como requerimiento).

Flujo de autenticación:
- Al cargar la app, `useAuthStore.checkAuth()` se ejecuta para consultar al backend si existe sesión. Mientras tanto `isLoading` muestra un loader global.
- Si el usuario no está autenticado y accede a una ruta protegida que redirige a `/login`.
- `useAuthStore` mantiene el `user` con la propiedad `role` usada por `ProtectedRoute` para validar accesos por rol.

### Descripción de los tests E2E

- Herramienta: Playwright (ubicado en `e2etests/`. `e2etests/package.json` y `playwright.config.ts`).
- Scripts disponibles:
  - `cd e2etests && npm install` para instalar dependencias.
  - `npm run test` (ejecuta `playwright test`).

- Flujos cubiertos (archivos en `e2etests/tests`):
  - `auth.spec.ts`: login, signup y flujo básico de sesión.
  - `items.spec.ts`: interacciones con productos.
  - `reviews.spec.ts`: crear y visualizar reseñas.
  - `admin-store.spec.ts`: tareas administrativas sobre stores.
  - `seller-flow.spec.ts`: flujo de solicitud/operación como seller.
  - `stores-filter.spec.ts`: filtrado y paginación de stores.
  - `security.spec.ts`: validaciones de permisos para rutas protegidas.

Notas de ejecución: los tests E2E asumen que backend y frontend están corriendo y que la base de datos está en el estado esperado.

### Librería de estilos utilizada y decisiones de diseño

- Librerías usadas:
  - Material UI v5 (`@mui/material`, `@mui/icons-material`) para componentes accesibles y consistentes.
  - Emotion (`@emotion/react`, `@emotion/styled`) para estilos CSS-in-JS y customización de MUI.
  - Tailwind CSS para utilidades y retoques rápidos de layout (`tailwindcss` y `@tailwindcss/vite`).

Decisiones de diseño:
- MUI se usó como base de componentes (botones, inputs, modal, layout) por su rapidez de desarrollo y accesibilidad.
- Tailwind se utilizó para utilidades puntuales (spacing, responsividad) sin reemplazar el sistema de temas centralizado de MUI.
- Se usó un tema MUI oscuro (en `App.tsx`) para colores primarios/secondary y tipografía permitiendo mantener una apariencia coherente y responsiva.

### URL de la aplicación desplegada

La URL de despliegue es:

```
https://fullstack.dcc.uchile.cl:7135
```