import { test, expect } from "@playwright/test";

test.describe("CRUD de Reseñas (Entidad)", () => {
  const timestamp = Date.now();
  const username = `reviewer_${timestamp}`;
  const password = "password123";
  const reviewComment = `Esta es una reseña de prueba ${timestamp}`;

  test.beforeEach(async ({ page }) => {
    // Registrar usuario antes de cada test para tener sesión
    await page.goto("/signup");
    await page.getByLabel("Usuario").fill(username);
    await page.getByLabel(/^Contraseña/).fill(password);
    await page.getByLabel("Confirmar Contraseña").fill(password);
    await page.getByRole("button", { name: "Registrarse" }).click();
    await expect(page).toHaveURL("/");
  });

  test("Debe permitir crear, visualizar y eliminar una reseña", async ({ page }) => {
    // --- LEER (Listar tiendas y entrar a una) ---
    const firstStoreCard = page.locator(".MuiCardActionArea-root").first();
    await firstStoreCard.waitFor();
    await firstStoreCard.click();

    // Verificar que estamos en el detalle de la tienda
    await expect(page).toHaveURL(/\/store\//);

    // --- CREAR (Agregar Reseña) ---
    await page.getByRole("button", { name: "Agregar Reseña" }).click();

    await expect(page.getByRole("heading", { name: "Agregar Reseña" })).toBeVisible();

    // Usar force: true para el Rating de MUI
    await page.getByRole("radio", { name: "5 Stars" }).click({ force: true });

    await page.getByLabel("Comentario").fill(reviewComment);

    // Corrección: El botón en ReviewForm dice "Enviar", no "Enviar Reseña"
    await page.getByRole("button", { name: "Enviar", exact: true }).click();

    // Verificar mensaje de éxito
    await expect(page.getByText("Reseña agregada con éxito")).toBeVisible();

    // --- LEER (Verificar que la reseña aparece en la lista) ---
    await expect(page.getByText(reviewComment)).toBeVisible();
    await expect(page.getByText(username, { exact: false }).first()).toBeVisible();

    // --- ELIMINAR (Borrar la reseña) ---
    const reviewCard = page.locator(".MuiPaper-root").filter({ hasText: reviewComment });
    const deleteButton = reviewCard
      .getByRole("button")
      .filter({ has: page.locator('svg[data-testid="DeleteIcon"]') });

    await deleteButton.click();

    // Confirmar en el diálogo
    await expect(page.getByText("¿Eliminar esta reseña?")).toBeVisible();
    await page.getByRole("button", { name: "Eliminar" }).click();

    // Verificar que desapareció
    await expect(page.getByText("Reseña eliminada")).toBeVisible();
    await expect(page.getByText(reviewComment)).not.toBeVisible();
  });
});
