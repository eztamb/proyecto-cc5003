# Guía de Deploy — Aplicación BeaucheFoods

Este documento describe detalladamente el proceso de despliegue de la aplicación **BeaucheFoods** en el servidor del curso **fullstack.dcc.uchile.cl**. Se incluyen los comandos utilizados, la preparación del entorno y la configuración de las variables necesarias para el entorno de producción.

---

## 1. Compilación Local

Antes de realizar el despliegue, se debe compilar tanto el frontend como el backend en el entorno local para subir únicamente los archivos necesarios al servidor.

### 1.1 Compilación del Frontend

Desde la raíz del proyecto:

```bash
cd frontend
npm install
npm run build
```

El proceso generará la carpeta `frontend/dist` con la versión compilada del frontend.

---

### 1.2 Preparación del Backend

Mover los archivos compilados del frontend hacia el backend, dentro de una carpeta `public`, para que el servidor pueda servirlos directamente.

```bash
# desde la raíz del proyecto
mkdir -p backend/public
cp -r frontend/dist/* backend/public/
```

---

### 1.3 Compilación del Backend

```bash
cd backend
npm install
npm run build
```

Este comando genera la carpeta `backend/dist`, que contiene el código JavaScript compilado del servidor.

---

## 2. Preparación del Paquete para Despliegue

Solo se debe subir al servidor la carpeta `backend`, la cual incluye el frontend compilado y el `package.json` correspondiente.

### 2.1 Empaquetado Local

Opcionalmente, eliminar o excluir `node_modules`, los archivos fuente y el archivo `.env` para reducir el tamaño del archivo comprimido:

```bash
zip -r deploy.zip backend -x "backend/node_modules/*" "backend/src/*" "backend/.env"
```

---

## 3. Transferencia al Servidor

Subir el archivo comprimido al servidor por medio de `scp`:

```bash
scp -P 219 deploy.zip fullstack@fullstack.dcc.uchile.cl:~/beauchefoods/
```

Ingresar la contraseña cuando el sistema lo solicite.

---

## 4. Configuración en el Servidor

### 4.1 Conexión vía SSH

```bash
ssh -p 219 fullstack@fullstack.dcc.uchile.cl
```

---

### 4.2 Descompresión e Instalación de Dependencias

Una vez dentro del servidor:

```bash
unzip deploy.zip
cd backend
npm install --production
```

---

### 4.3 Creación del Archivo `.env`

El archivo `.env` debe configurarse con las variables de entorno necesarias para el funcionamiento en producción:

```bash
nano .env
```

Contenido de ejemplo:

```env
MONGODB_URI=mongodb://fulls:fulls@fullstack.dcc.uchile.cl:27019/fullstack?authSource=admin
JWT_SECRET=una_clave_muy_segura_y_secreta_para_prod
PORT=7135
NODE_ENV=production
```

Guardar y cerrar el editor (`Ctrl+O`, `Enter`, luego `Ctrl+X`).

---

## 5. Ejecución de la Aplicación

Para mantener el proceso activo, puede utilizarse `screen`:

```bash
screen -S beauchefoods
```

Ejecutar el servidor:

```bash
node dist/app.js
```

Para salir de la sesión de `screen` sin detener el proceso: `Ctrl + A`, luego `D`.

---

## 6. Verificación del Despliegue

Una vez iniciado el servidor, verificar el correcto funcionamiento accediendo a la URL:

```
https://fullstack.dcc.uchile.cl:7135
```

(Dependiendo de la configuración, puede ser `http` en lugar de `https`).

---

## 7. Estructura Final del Proyecto en el Servidor

La estructura esperada dentro del directorio `~/backend` es la siguiente:

```text
backend/
├── dist/           # código compilado del backend
├── public/         # archivos compilados del frontend (build)
├── node_modules/   # dependencias de producción
├── .env            # variables de entorno
└── package.json
```

---

## 8. Resumen

**Servidor:** `fullstack.dcc.uchile.cl`

**Puerto de aplicación:** `7135`

**Base de datos:** `MongoDB (fullstack.dcc.uchile.cl:27019)`

**Ejecución en producción:** `node dist/app.js` dentro de un `screen`

---
