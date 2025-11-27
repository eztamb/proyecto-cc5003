# 🌯🍝🍟 BeaucheFoods 🥗🍔🍕

Proyecto para el curso **CC5003 — Aplicaciones Web Reactivas (Primavera 2025)** Universidad de Chile — Departamento de Ciencias de la Computación.

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
| `useUIStore.ts`    | Estado global de la interfaz: modales, loaders y notificaciones (Snackbar).                             |

### Flujo general del estado

1. Al iniciar la aplicación, `useAuthStore.checkAuth()` verifica una sesión existente con el backend (vía cookies/token).
2. El `user.role` (admin, reviewer, seller) determina qué rutas son accesibles.
3. Los errores y notificaciones se muestran mediante un componente global `NotificationSnackbar` conectado al `useUIStore`.

---

## 🗺️ Mapa de rutas y flujo de autenticación

### Rutas principales (públicas)

- `/` — Lista de tiendas (Home).
- `/store/:storeId` — Detalle de tienda, productos y reseñas.
- `/product-search` — Búsqueda global de productos.
- `/login` — Inicio de sesión.
- `/signup` — Registro de usuario.

### Rutas protegidas

| Ruta                   | Rol requerido      | Descripción                             |
| ---------------------- | ------------------ | --------------------------------------- |
| `/users`               | `admin`            | Gestión de usuarios.                    |
| `/admin/requests`      | `admin`            | Aprobación de solicitudes de vendedor.  |
| `/new-store`           | `seller` o `admin` | Creación de nuevas tiendas.             |
| `/edit-store/:storeId` | `seller` o `admin` | Edición de tiendas existentes.          |
| `/my-stores`           | `seller` o `admin` | Listado de tiendas propias.             |
| `/become-seller`       | `reviewer`         | Formulario para solicitar ser vendedor. |

### Flujo de autenticación

1. **Persistencia:** `useAuthStore.checkAuth()` valida la sesión contra el endpoint `/api/auth/me` al cargar la app.
2. **Protección:** Si el usuario no está autenticado o no tiene el rol necesario, el componente `ProtectedRoute` redirige a `/login` o al home `/`.
3. **Roles:** La UI se adapta dinámicamente (ej. botones de edición, navbar) según la propiedad `user.role`.

---

## 🧪 Descripción de los tests E2E

Las pruebas End-to-End están implementadas con **[Playwright](https://playwright.dev/)** en el directorio [`/e2etests`](./e2etests/).

### Flujos cubiertos

- **Autenticación (`auth.spec.ts`):** Login, registro, persistencia de sesión y logout.
- **Productos (`items.spec.ts`):** Creación y visualización de productos en tiendas.
- **Filtros (`stores-filter.spec.ts`):** Filtrado de tiendas por buscador (texto) y categoría.
- **Reseñas (`reviews.spec.ts`):** CRUD completo de reseñas (crear, editar, eliminar) y cálculo de rating.
- **Flujo de Seller (`seller-flow.spec.ts`):** Ciclo completo desde solicitud de rol, aprobación por admin y cambio de permisos.
- **Administración (`admin-store.spec.ts`):** Gestión privilegiada de tiendas.
- **Seguridad (`security.spec.ts`):** Verificación de denegación de acceso a rutas protegidas para usuarios sin permisos.

Se genera automáticamente un informe HTML de los tests que se puede ver con `npx playwright show-report`.

Detalles de configuración y ejecución [aquí](./e2etests/README.md).

---

## 🎨 Librería de estilos y decisiones de diseño

- **Framework CSS:** [Tailwind CSS](https://tailwindcss.com/) (vía `@tailwindcss/vite`) para utilidades rápidas, layout y espaciado.
- **Componentes UI:** [Material UI v5 (MUI)](https://mui.com/) (`@mui/material`, `@mui/icons-material`) para componentes complejos (tablas, modales, inputs).
- **CSS-in-JS:** Emotion (dependencia de MUI).

**Decisiones de diseño:**

- **MUI** se usa como base de componentes accesibles y responsivos.
- **Tailwind** se aplica para ajustes rápidos de layout y espaciado.
- Se mantiene un **tema oscuro unificado**, configurado en `App.tsx`, para coherencia visual.
- La tipografía y escala de color provienen del tema MUI centralizado.

Más detalles de implementación visual [aquí](./frontend/README.md).

---

## 🌐 URL de la aplicación desplegada

Aplicación alojada en el servidor de la Facultad:

```
https://fullstack.dcc.uchile.cl:7035
```

---

## 📁 Documentación adicional

- [`frontend/README.md`](./frontend/README.md): detalles de la configuración del frontend, Vite, React, ESLint y estado global. Incluye breve resumen de las rutas disponibles en la app.
- [`backend/README.md`](./backend/README.md): requisitos, variables de entorno y comandos.
- [`e2etests/README.md`](./e2etests/README.md): guía para correr y analizar las pruebas E2E.
- [`README-deploy.md`](./README-deploy.md): secuencia de pasos y comandos ejecutados para el despliegue en el servidor.

---
