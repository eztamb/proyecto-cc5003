import { test, expect } from "@playwright/test";

test.describe("Gestión de Productos (Items)", () => {
  // Nota: El backend actual soporta Create y Read para Items.
  // Update y Delete de Items aún no están implementados en la API.

  test.beforeEach(async ({ page }) => {
    // Login como ADMIN para tener permisos en las tiendas por defecto
    await page.goto("/login");
    await page.getByLabel("Usuario").fill("admin");
    await page.getByLabel(/^Contraseña/).fill("admin123");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
  });

  test("Debe permitir agregar un producto nuevo a una tienda y visualizarlo", async ({ page }) => {
    // Ir a una tienda existente (usamos una del seed por nombre)
    await page.getByText("Almacén Buen Pan").click();
    await expect(page).toHaveURL(/\/store\//);

    // --- CREAR ITEM ---
    const addItemBtn = page.getByRole("button", { name: "Agregar Item" });
    await expect(addItemBtn).toBeVisible();
    await addItemBtn.click();

    const itemName = `Sándwich Test ${Date.now()}`;
    const itemPrice = "3500";

    // Verificar modal
    await expect(page.getByRole("heading", { name: "Agregar Item" })).toBeVisible();

    // Llenar formulario
    await page.getByLabel("Nombre").fill(itemName);
    await page.getByLabel("Descripción").fill("Descripción autogenerada para test e2e");
    await page.getByLabel("Precio").fill(itemPrice);
    // Dejar imagen vacía o poner URL de prueba si se valida

    await page.getByRole("button", { name: "Agregar Item" }).click();

    // --- LEER ITEM ---
    // Verificar mensaje de éxito
    await expect(page.getByText("Item agregado con éxito")).toBeVisible();

    // Verificar que el item aparece en la lista de productos de la tienda
    await expect(page.getByText(itemName)).toBeVisible();

    // Verificar precio (El frontend formatea el precio)
    // Corrección: El entorno de pruebas usa formato en-US (,), ajustamos la expectativa.
    const productCard = page.locator(".MuiCardContent-root").filter({ hasText: itemName });
    await expect(productCard).toBeVisible();
    await expect(productCard).toContainText("3.500");
  });
});
