import { test, expect } from "@playwright/test";

test.describe("Administración de Tiendas (Requiere Rol Admin)", () => {
  const storeName = `Tienda Test ${Date.now()}`;
  const storeNameEdited = `${storeName} Editada`;

  test.beforeEach(async ({ page }) => {
    // Login como el ADMIN creado por el seed (admin / admin123)
    await page.goto("/login");
    await page.getByLabel("Usuario").fill("admin");
    await page.getByLabel(/^Contraseña/).fill("admin123");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();

    // Verificar que entramos y somos admin (vemos el botón)
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("link", { name: "Agregar Tienda" })).toBeVisible();
  });

  test("CRUD Completo de Tienda: Crear, Editar y Eliminar", async ({ page }) => {
    const addStoreBtn = page.getByRole("link", { name: "Agregar Tienda" });

    // --- CREAR TIENDA ---
    await addStoreBtn.click();
    await expect(page).toHaveURL("/new-store");

    await page.getByLabel("Nombre").fill(storeName);
    await page.getByLabel("Descripción").fill("Descripción de prueba e2e");
    await page.getByLabel("Ubicación").fill("Patio Central");

    // Seleccionar Categoría
    await page.getByRole("combobox", { name: /Categoría/i }).click();
    await page.getByRole("option", { name: "Otro" }).click();

    await page.getByLabel("Acepta Junaeb").check();

    await page.getByRole("button", { name: "Guardar Tienda" }).click();

    // Verificar redirección y mensaje éxito
    await expect(page).toHaveURL("/");
    await expect(page.getByText("Tienda creada con éxito")).toBeVisible();
    await expect(page.getByText(storeName)).toBeVisible();

    // --- EDITAR TIENDA ---
    // Ir al detalle de la tienda creada
    await page.getByText(storeName).click();

    // Verificar botones de admin y hacer click en Editar
    await expect(page.getByRole("link", { name: "Editar" })).toBeVisible();
    await page.getByRole("link", { name: "Editar" }).click();

    // Verificar que estamos en la pantalla de edición
    await expect(page.getByRole("heading", { name: "Editar Tienda" })).toBeVisible();

    // Modificar el nombre
    await page.getByLabel("Nombre").fill(storeNameEdited);
    await page.getByRole("button", { name: "Guardar Tienda" }).click();

    // Verificar éxito y redirección
    await expect(page.getByText("Tienda actualizada con éxito")).toBeVisible();
    await expect(page).toHaveURL("/");

    // Verificar que el nombre cambió en la lista
    await expect(page.getByText(storeNameEdited)).toBeVisible();

    // --- ELIMINAR TIENDA ---
    // Entrar a la tienda editada
    await page.getByText(storeNameEdited).click();

    // Click Eliminar
    await page.getByRole("button", { name: "Eliminar" }).click();

    // Confirmar en el diálogo
    await expect(page.getByText(`¿Eliminar ${storeNameEdited}?`)).toBeVisible();
    await page.getByRole("button", { name: "Eliminar" }).click();

    // Verificar vuelta al inicio y desaparición
    await expect(page).toHaveURL("/");
    await expect(page.getByText("Tienda eliminada")).toBeVisible();
    await expect(page.getByText(storeNameEdited)).not.toBeVisible();
  });
});
