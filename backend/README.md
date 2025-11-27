# 🍔 BeaucheFoods — Backend

Servidor backend desarrollado en **Node.js (Express + TypeScript + Mongoose)** para manejar autenticación, usuarios, tiendas, productos y reseñas.

---

## 🚀 Requisitos Previos

- Node.js (v18 o superior)
- npm (instalado con Node)
- MongoDB (local o remoto)

---

## ⚙️ Variables de entorno

Archivo `.env` (en `backend/.env`):

```dotenv
MONGODB_URI=mongodb://localhost:27017/<tu-db-name>
JWT_SECRET=tu_clave_super_secreta_y_larga
```

Ejemplo inicial: `backend/.env.example`

---

## 🧩 Scripts Principales

```bash
npm install           # Instala dependencias
npm run build         # Compila TypeScript a JavaScript (dist/)
npm run dev           # Dev mode con ts-node-dev
npm start             # Ejecuta la versión compilada
```

El servidor se inicia en `http://localhost:3001`.

---

## 🧱 Estructura general

| Carpeta / Archivo     | Descripción                                                              |
| --------------------- | ------------------------------------------------------------------------ |
| `src/models`          | Definiciones de esquemas Mongoose (`User`, `Store`, `Product`, `Review`) |
| `src/controllers`     | Controladores de rutas Express                                           |
| `src/routes`          | Rutas agrupadas por recurso                                              |
| `src/middleware`      | Middlewares de autenticación y autorización                              |
| `src/utils`           | Utilidades y helpers                                                     |
| `src/scripts/seed.ts` | Script para poblar la base de datos (modo test)                          |

---

## 🔑 Autenticación y roles

- Basado en **JWT**.
- Roles disponibles:
  - `admin`
  - `seller`
  - `reviewer`
- Middleware de validación: `requireAuth` y `requireRole(...)`.

---

## 🧮 Integración con el frontend

El backend se comunica con el frontend React mediante peticiones REST (`fetch` o `axios`). Los endpoints expuestos incluyen:

- `/auth` – login, signup, check-auth
- `/stores`, `/products`, `/reviews` – operaciones principales
- `/admin` – endpoints restringidos por rol

Más información sobre el frontend y stores: ver [`../frontend/README.md`](../frontend/README.md).

---

## 🧪 Pruebas E2E

Los tests E2E (`/e2etests`) requieren que el backend esté corriendo y que la base de datos esté poblada (ver `src/scripts/seed.ts`).

Detalles: [`../e2etests/README.md`](../e2etests/README.md)

---
