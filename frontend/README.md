# 🥗 BeaucheFoods — Frontend

Interfaz de usuario desarrollada con **React + Vite + TypeScript**, utilizando **Zustand** para el estado global y **Material UI + TailwindCSS** para el diseño.

---

## ⚙️ Requisitos Previos

- Node.js v18+
- npm
- Backend en ejecución en `http://localhost:3001`

---

## 🚀 Ejecución local

Opción rápida:

```bash
npm install
npm run dev
```

Abre en el navegador: [http://localhost:5173](http://localhost:5173)

También se puede iniciar junto con el backend mediante `../start.sh`.

---

## 🧠 Estado Global — Zustand

Ubicación: `src/stores/`

| Store              | Estado                         |
| ------------------ | ------------------------------ |
| `useAuthStore.ts`  | Usuario, sesión, autenticación |
| `useStoreStore.ts` | Tiendas, productos, filtros    |
| `useUIStore.ts`    | Estados de interfaz y loaders  |

El estado se comparte a través de hooks React y los errores o loaders se propagan mediante un `Snackbar` global.

---

## 🗺️ Rutas principales

Configuradas en `src/App.tsx`:

| Ruta                            | Acceso           | Descripción             |
| ------------------------------- | ---------------- | ----------------------- |
| `/`                             | Público          | Lista de tiendas        |
| `/store/:storeId`               | Público          | Detalle de tienda       |
| `/login`, `/signup`             | Público          | Autenticación           |
| `/become-seller`                | Usuario reviewer | Solicitud de rol Seller |
| `/new-store`, `/edit-store/:id` | Seller/Admin     | Gestión de tiendas      |
| `/admin/requests`, `/users`     | Admin            | Administración          |

Flujo de autenticación y validación de roles manejado mediante `ProtectedRoute` y `useAuthStore`.

---

## 🎨 Librerías de UI y estilos

- **Material UI (MUI)** — Componentes principales y theming.
- **Emotion** — Soporte de CSS-in-JS en MUI.
- **TailwindCSS** — Utilidades rápidas (layout, spacing, colors).

Temática: modo **oscuro** y esquema de color personalizado (definido en `App.tsx`).

---

## ✅ Linter y configuración TS

Se usa ESLint configurado para TypeScript y React. Ajustado para projects con:

```js
parserOptions: {
  project: ['./tsconfig.node.json', './tsconfig.app.json'],
}
```

y las configuraciones extendidas de `tseslint.configs.recommendedTypeChecked`.

---

## 📎 Referencias adicionales

- Backend y API: [`../backend/README.md`](../backend/README.md)
- Pruebas E2E: [`../e2etests/README.md`](../e2etests/README.md)

---
