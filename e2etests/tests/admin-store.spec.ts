import { test, expect } from "@playwright/test";

test.describe("Administración de Tiendas (Requiere Rol Admin)", () => {
  const storeName = `Tienda Test ${Date.now()}`;

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

  test("Debe crear y eliminar una tienda correctamente", async ({ page }) => {
    const addStoreBtn = page.getByRole("link", { name: "Agregar Tienda" });

    // --- CREAR TIENDA ---
    await addStoreBtn.click();
    await expect(page).toHaveURL("/new-store");

    await page.getByLabel("Nombre").fill(storeName);
    await page.getByLabel("Descripción").fill("Descripción de prueba e2e");
    await page.getByLabel("Ubicación").fill("Patio Central");

    // Seleccionar Categoría
    // Nota: Usamos force: true o interacción específica si el select de MUI lo requiere,
    // pero click standard suele funcionar si el label está bien asociado.
    await page.getByLabel("Categoría").click();
    await page.getByRole("option", { name: "Otro" }).click();

    await page.getByLabel("Acepta Junaeb").check();

    await page.getByRole("button", { name: "Guardar Tienda" }).click();

    // Verificar redirección y mensaje éxito
    await expect(page).toHaveURL("/");
    await expect(page.getByText("Tienda creada con éxito")).toBeVisible();

    // Verificar que aparece en la lista
    await expect(page.getByRole("heading", { name: storeName })).toBeVisible();

    // --- ELIMINAR TIENDA ---
    await page.getByRole("heading", { name: storeName }).click();

    // Verificar botones de admin en el detalle
    await expect(page.getByRole("button", { name: "Eliminar Tienda" })).toBeVisible();

    // Click Eliminar
    await page.getByRole("button", { name: "Eliminar Tienda" }).click();

    // Confirmar en el diálogo
    await expect(
      page.getByText(`¿Estás seguro de que quieres eliminar ${storeName}?`),
    ).toBeVisible();
    await page.getByRole("button", { name: "Eliminar" }).click();

    // Verificar vuelta al inicio y desaparición
    await expect(page).toHaveURL("/");
    await expect(page.getByText("Tienda eliminada")).toBeVisible();
    await expect(page.getByRole("heading", { name: storeName })).not.toBeVisible();
  });
});
