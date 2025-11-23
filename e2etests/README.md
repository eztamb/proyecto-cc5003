# Pruebas E2E para BeaucheFoods

Este directorio contiene las pruebas End-to-End (E2E) automatizadas utilizando [Playwright](https://playwright.dev/). Estas pruebas verifican flujos críticos de la aplicación simulando un usuario real en el navegador.

## Requisitos Previos

1.  Tener **Node.js** instalado.
2.  La aplicación **BeaucheFoods** (Backend y Frontend) debe estar ejecutándose localmente.
    - Frontend: `http://localhost:5173`
    - Backend: `http://localhost:3001`
    - Puedes usar el script `start-test.sh` en la raíz del proyecto para levantar ambos.

## Instalación

Desde la raíz del proyecto, navega a esta carpeta e instala las dependencias:

```bash
cd e2etests
npm install
```
