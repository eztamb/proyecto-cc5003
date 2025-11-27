# Pruebas E2E para BeaucheFoods

Este directorio contiene las pruebas End-to-End (E2E) automatizadas utilizando [Playwright](https://playwright.dev/). Estas pruebas verifican flujos críticos de la aplicación simulando un usuario real en el navegador.

## Requisitos Previos

1.  Tener **Node.js** instalado.
2.  Configurar las variables de entorno en el backend. Revisa la guía [aquí](../backend/README.md).
3.  La aplicación **BeaucheFoods** (Backend y Frontend) debe estar ejecutándose localmente.
    - Frontend: `http://localhost:5173`
    - Backend: `http://localhost:3001`
    - Puedes usar el script `start-test.sh` en la raíz del proyecto para levantar ambos. Esto correrá la aplicación en modo test y usará un [script semilla](../backend/src/scripts/seed.ts) para poblar la base de datos de prueba.

## Instalación

Desde la raíz del proyecto, navega a esta carpeta e instala las dependencias:

```bash
cd e2etests
npm install
```

## Ejecución

Solo tienes que ejecutar el siguiente comando para correr los tests:

```bash
npx playwright test
```

## Resultados

Para ver los resultados de los tests con más detalle, puedes ver el reporte HTML generado automáticamente por Playwright. Debes ejecutar:

```bash
npx playwright show-report
```

Deberías ver en la consola un mensaje como este:

```
Serving HTML report at http://localhost:9323. Press Ctrl+C to quit.
```

Si visitas la URL, podrás ver todos los detalles de la última ejecución de los tests E2E.
