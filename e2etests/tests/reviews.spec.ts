import { test, expect } from "@playwright/test";

test.describe("CRUD de Reseñas (Entidad)", () => {
  const timestamp = Date.now();
  const username = `reviewer_${timestamp}`;
  const password = "password123";
  const reviewComment = `Esta es una reseña de prueba ${timestamp}`;
  const reviewCommentEdited = `Esta es una reseña EDITADA ${timestamp}`;

  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel("Usuario").fill(username);
    await page.getByLabel(/^Contraseña/).fill(password);
    await page.getByLabel("Confirmar Contraseña").fill(password);
    await page.getByRole("button", { name: "Registrarse" }).click();
    await expect(page).toHaveURL("/");
  });

  test("Debe permitir crear, editar y eliminar una reseña", async ({ page }) => {
    // --- LEER ---
    const firstStoreCard = page.locator(".MuiCardActionArea-root").first();
    await firstStoreCard.waitFor();
    await firstStoreCard.click();
    await expect(page).toHaveURL(/\/store\//);

    // --- CREAR ---
    await page.getByRole("button", { name: "Agregar Reseña" }).click();
    await expect(page.getByRole("heading", { name: "Agregar Reseña" })).toBeVisible();

    const createModal = page.locator('[role="presentation"]').first();
    const createRating = createModal.locator(".MuiRating-root");
    await createRating.locator("label >> nth=4").click();

    await page.getByLabel("Comentario").fill(reviewComment);
    await page.getByRole("button", { name: "Enviar", exact: true }).click();

    await expect(page.getByText("Reseña agregada con éxito")).toBeVisible();
    await expect(page.getByText(reviewComment)).toBeVisible();

    // --- EDITAR ---
    const editButton = page.getByRole("button", { name: "Editar mi Reseña" });
    await expect(editButton).toBeVisible();
    await editButton.click();

    await expect(page.getByRole("heading", { name: "Editar Reseña" })).toBeVisible();

    const editModal = page.locator('[role="presentation"]').last();
    const editRating = editModal.locator(".MuiRating-root");
    await editRating.locator("label >> nth=3").click();

    await page.getByLabel("Comentario").fill(reviewCommentEdited);

    // --- GUARDAR Y ESPERAR ---
    const [editResponse] = await Promise.all([
      page.waitForResponse(
        (resp) => resp.url().includes("/api/reviews/") && resp.request().method() === "PUT",
      ),
      page.getByRole("button", { name: "Enviar", exact: true }).click(),
    ]);

    expect(editResponse.status()).toBe(200);

    await expect(page.getByText(reviewCommentEdited)).toBeVisible();

    // --- RELOAD (Para probar persistencia) ---
    const [reloadResponse] = await Promise.all([
      page.waitForResponse((resp) => resp.url().includes("/api/stores/") && resp.status() === 200),
      page.reload(),
    ]);
    expect(reloadResponse.status()).toBe(200);

    // --- ELIMINAR ---
    await expect(page.getByRole("heading", { name: "Reseñas" })).toBeVisible();

    const reviewCard = page.locator(".MuiPaper-root").filter({ hasText: reviewCommentEdited });

    await expect(reviewCard).toBeVisible({ timeout: 10000 });
    await reviewCard.scrollIntoViewIfNeeded();

    const deleteButton = reviewCard
      .getByRole("button")
      .filter({ has: page.locator('svg[data-testid="DeleteIcon"]') });

    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    await expect(page.getByText("¿Eliminar esta reseña?")).toBeVisible();
    await page.getByRole("button", { name: "Eliminar" }).click();

    await expect(page.getByText("Reseña eliminada")).toBeVisible();
    await expect(page.getByText(reviewCommentEdited)).not.toBeVisible();
  });
});
