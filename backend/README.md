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
TEST_MONGODB_URI=mongodb://localhost:27017/<tu-test-db-name>
JWT_SECRET=tu_clave_super_secreta_y_larga
```

Ejemplo inicial: `backend/.env.example`.
_Nota: `TEST_MONGODB_URI` es utilizada automáticamente cuando se corren los scripts de prueba._

---

## 🧩 Scripts Principales

```bash
npm install           # Instala dependencias
npm run build         # Compila TypeScript a JavaScript (dist/)
npm run dev           # Dev mode con ts-node-dev (hot reload)
npm start             # Ejecuta la versión compilada
npm run start:test    # Ejecuta en modo test (seed automático + DB de pruebas)
```
