import { test, expect } from "@playwright/test";

test.describe("Funcionalidad de Listado de Tiendas", () => {
  test.beforeEach(async ({ page }) => {
    // Visitamos la página principal antes de cada test
    await page.goto("/");
  });

  test("Debe filtrar tiendas por texto de búsqueda", async ({ page }) => {
    // Esperar a que carguen las tiendas
    await expect(page.getByText("Máquina Monster")).toBeVisible();
    await expect(page.getByText("Subway")).toBeVisible();

    // Interactuar con el buscador (con debounce de 500ms en el frontend)
    const searchInput = page.getByLabel("Buscar tienda...");
    await searchInput.fill("Monster");

    // Esperar el debounce y la recarga
    await page.waitForTimeout(600);

    // Verificaciones
    await expect(page.getByText("Máquina Monster")).toBeVisible();
    await expect(page.getByText("Subway")).not.toBeVisible();
  });

  test("Debe filtrar tiendas por categoría", async ({ page }) => {
    // Asegurarse que cargó la lista inicial
    await expect(page.getByText("Abuelita Yoli")).toBeVisible();

    // Usamos una estrategia visual: buscar el FormControl que contiene el texto "Categoría"
    // y dentro de él hacer click en el combobox.
    await page
      .locator(".MuiFormControl-root")
      .filter({ hasText: "Categoría" })
      .getByRole("combobox")
      .click();

    await page.getByRole("option", { name: "Food Truck" }).click();

    // Verificar resultados
    await expect(page.getByText("Abuelita Yoli")).toBeVisible();
    await expect(page.getByText("Subway")).not.toBeVisible();
    await expect(page.getByText("Máquina Monster")).not.toBeVisible();
  });

  test("Debe mostrar mensaje cuando no hay resultados", async ({ page }) => {
    const searchInput = page.getByLabel("Buscar tienda...");
    await searchInput.fill("Tienda Inexistente XYZ");

    await page.waitForTimeout(600);

    await expect(page.getByText("No se encontraron tiendas.")).toBeVisible();
  });
});
