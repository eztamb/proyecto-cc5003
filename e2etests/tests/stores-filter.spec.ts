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

    // Abrir el select de Material UI
    // Nota: En MUI el select a veces es un div con role button o combobox asociado al label
    await page.getByLabel("Categoría").click();

    // Seleccionar la opción en el dropdown (portal)
    await page.getByRole("option", { name: "Food Truck" }).click();

    // Verificar que solo aparece la tienda correspondiente
    await expect(page.getByText("Abuelita Yoli")).toBeVisible();
    await expect(page.getByText("Subway")).not.toBeVisible(); // Es Restaurante
    await expect(page.getByText("Máquina Monster")).not.toBeVisible(); // Es Máquina
  });

  test("Debe mostrar mensaje cuando no hay resultados", async ({ page }) => {
    const searchInput = page.getByLabel("Buscar tienda...");
    await searchInput.fill("Tienda Inexistente XYZ");

    await page.waitForTimeout(600);

    await expect(
      page.getByText("No se encontraron tiendas con los filtros aplicados"),
    ).toBeVisible();
  });
});
