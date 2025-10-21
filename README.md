# 🌯🍝🍟 BeaucheFoods 🥗🍔🍕

Proyecto para el curso de Aplicaciones Web Reactivas (CC5003), semestre Primavera 2025.

## Descripción

BeaucheFoods es una aplicación web SPA (Single Page Application) desarrollada con React (Vite + TypeScript) y un backend en Node.js (Express + TypeScript + Mongoose). Permite a los usuarios encontrar, explorar y reseñar diferentes opciones de comida dentro o cerca de la facultad. Incluye autenticación de usuarios y roles (administrador, reviewer).

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
