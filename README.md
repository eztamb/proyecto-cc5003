# 🌯🍝🍟 BeaucheFoods 🥗🍔🍕

Proyecto para el curso **CC5003 — Aplicaciones Web Reactivas (Primavera 2025)**  
Universidad de Chile — Departamento de Ciencias de la Computación.

---

## 💬 Tema general del proyecto

**BeaucheFoods** es una aplicación web **SPA (Single Page Application)** desarrollada con **React (Vite + TypeScript)** y un backend en **Node.js (Express + TypeScript + Mongoose)**.  
El objetivo del proyecto es permitir a los estudiantes de Beauchef explorar tiendas y productos de comida, dejar reseñas, y gestionar locales según el rol del usuario (administrador, reviewer o seller).

- Los **usuarios reviewers** pueden explorar y reseñar productos y tiendas. Pueden optar a ser vendedores mediante un formulario de solicitud.
- Los **vendedores** (sellers) pueden crear y administrar sus tiendas.
- Los **administradores** pueden gestionar usuarios, aprobar solicitudes de vendedores y moderar contenido.

Los usuarios no autenticados se consideran **invitados** y solo tienen permisos de lectura sobre las tiendas y sus respectivos productos y reseñas.

---

## 🧠 Estructura del estado global

- **Librería de estado global:** [Zustand](https://github.com/pmndrs/zustand)
- **Ubicación:** `frontend/src/stores`

Stores principales:

| Store              | Responsabilidad                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| `useAuthStore.ts`  | Maneja autenticación y sesión (`user`, `isLoading`). Métodos: `checkAuth`, `login`, `signup`, `logout`. |
| `useStoreStore.ts` | Controla las tiendas y productos, sus filtros, resultados y estado de carga.                            |
| `useUIStore.ts`    | Estado global de la interfaz: modales, loaders y notificaciones.                                        |

### Flujo general del estado

1. Al iniciar la aplicación, `useAuthStore.checkAuth()` verifica una sesión existente con el backend.
2. El `user.role` (admin, reviewer, seller) determina qué rutas son accesibles.
3. Los errores se muestran mediante un componente global `NotificationSnackbar`.

Para ver más detalles de implementación, consulta la [documentación del frontend](./frontend/README.md).

---

## 🗺️ Mapa de rutas y flujo de autenticación

### Rutas principales (públicas)

- `/` — Lista de tiendas
- `/store/:storeId` — Detalle de tienda
- `/product-search` — Búsqueda de productos
- `/login` — Inicio de sesión
- `/signup` — Registro de usuario

### Rutas protegidas

| Ruta                                               | Rol requerido      |
| -------------------------------------------------- | ------------------ |
| `/users`                                           | `admin`            |
| `/admin/requests`                                  | `admin`            |
| `/new-store`, `/edit-store/:storeId`, `/my-stores` | `seller` o `admin` |
| `/become-seller`                                   | `reviewer`         |

### Flujo de autenticación

1. `useAuthStore.checkAuth()` valida la sesión contra el backend al cargar la app.
2. Si el usuario no está autenticado y solicita una ruta protegida → redirección a `/login`.
3. La propiedad `user.role` se usa en componentes `ProtectedRoute` para filtrar acceso según el tipo de usuario.

---

## 🧪 Descripción de los tests E2E

Las pruebas End-to-End están implementadas con **[Playwright](https://playwright.dev/)** en el directorio [`/e2etests`](./e2etests/).

### Flujos cubiertos

- **Autenticación:** login, signup, persistencia de sesión.
- **Productos y tiendas:** búsqueda, creación, reseñas.
- **Flujo de seller:** solicitud de rol, creación y edición de tiendas.
- **Permisos:** validación de acceso a rutas restringidas.
- **Administrador:** gestión de peticiones y control del sistema.

Se genera automáticamente un informe HTML de los tests que se puede ver con `npx playwright show-report`.

Detalles de configuración y ejecución [aquí](./e2etests/README.md).

---

## 🎨 Librería de estilos y decisiones de diseño

- Librerías utilizadas:
  - **Material UI v5** (`@mui/material`, `@mui/icons-material`)
  - **Emotion** (`@emotion/react`, `@emotion/styled`)
  - **Tailwind CSS** (a través de `@tailwindcss/vite`)

**Decisiones de diseño:**

- **MUI** se usa como base de componentes accesibles y responsivos.
- **Tailwind** se aplica para ajustes rápidos de layout y espaciado.
- Se mantiene un **tema oscuro unificado**, configurado en `App.tsx`, para coherencia visual.
- La tipografía y escala de color provienen del tema MUI centralizado.

Más detalles de implementación visual [aquí](./frontend/README.md).

---

## 🌐 URL de la aplicación desplegada

Aplicación alojada en el servidor de la Facultad:

https://fullstack.dcc.uchile.cl:7035

---

## 📁 Documentación adicional

- [`frontend/README.md`](./frontend/README.md): detalles de la configuración del frontend, Vite, React, ESLint y estado global.
- [`backend/README.md`](./backend/README.md): requisitos, variables de entorno, comandos y estructura del servidor Express.
- [`e2etests/README.md`](./e2etests/README.md): guía para correr y analizar las pruebas E2E.

---
