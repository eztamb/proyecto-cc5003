# 🧪 BeaucheFoods — Pruebas E2E

Este módulo contiene las pruebas End-to-End (E2E) implementadas con **[Playwright](https://playwright.dev/)**.

---

## 🧩 Requisitos

1. Tener **Node.js** instalado.
2. Configurar el backend con su `.env`.
3. Tener backend y frontend ejecutándose:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3001`

Para facilitar lo último, se incluye el script:

```bash
./start-test.sh
```

Este script levanta ambos servicios en modo test y ejecuta un [script semilla](`../backend/src/scripts/seed.ts`) que rellena la base de datos con datos de prueba.

**Importante:** Debes esperar algunos segundos para que el backend y el frontend estén listos antes de probar con Playwright. De lo contrario, es posible que encuentres errores durante la ejecución.

---

## ⚙️ Instalación

```bash
cd e2etests
npm install
```

---

## 🚀 Ejecución de los tests

```bash
npx playwright test
```

Para abrir el reporte HTML:

```bash
npx playwright show-report
```

---

## 🧭 Flujos cubiertos

| Archivo de test         | Escenario principal                   |
| ----------------------- | ------------------------------------- |
| `auth.spec.ts`          | Login, signup, persistencia de sesión |
| `items.spec.ts`         | Navegación por productos y tiendas    |
| `reviews.spec.ts`       | Creación y visualización de reseñas   |
| `seller-flow.spec.ts`   | Solicitud y operación como seller     |
| `admin-store.spec.ts`   | Funcionalidades exclusivas del admin  |
| `stores-filter.spec.ts` | Filtros y paginación                  |
| `security.spec.ts`      | Accesos no autorizados                |

---

## 🧠 Arquitectura y dependencias

- **Playwright Test Runner** para ejecución paralela.
- Configuración principal: `playwright.config.ts`
- Scripts de npm para instalación y ejecución rápida.

---

## 📎 Referencias

- Documentación del backend: [`../backend/README.md`](../backend/README.md)
- Frontend y rutas: [`../frontend/README.md`](../frontend/README.md)
- Informe general: [`../README.md`](../README.md)

---
