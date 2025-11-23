import { test, expect } from "@playwright/test";

test.describe("CRUD de Reseñas (Entidad)", () => {
  const timestamp = Date.now();
  const username = `reviewer_${timestamp}`;
  const password = "password123";
  const reviewComment = `Esta es una reseña de prueba ${timestamp}`;
  const reviewCommentEdited = `Esta es una reseña EDITADA ${timestamp}`;

  test.beforeEach(async ({ page }) => {
    // Registrar usuario antes de cada test para tener sesión
    await page.goto("/signup");
    await page.getByLabel("Usuario").fill(username);
    await page.getByLabel(/^Contraseña/).fill(password);
    await page.getByLabel("Confirmar Contraseña").fill(password);
    await page.getByRole("button", { name: "Registrarse" }).click();
    await expect(page).toHaveURL("/");
  });

  test("Debe permitir crear, editar y eliminar una reseña", async ({ page }) => {
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

    await page.getByRole("button", { name: "Enviar", exact: true }).click();

    // Verificar mensaje de éxito
    await expect(page.getByText("Reseña agregada con éxito")).toBeVisible();
    await expect(page.getByText(reviewComment)).toBeVisible();

    // --- EDITAR (Modificar Reseña) ---
    const editButton = page.getByRole("button", { name: "Editar mi Reseña" });
    await expect(editButton).toBeVisible();
    await editButton.click();

    await expect(page.getByRole("heading", { name: "Editar Reseña" })).toBeVisible();

    // Cambiar rating a 4 y comentario
    await page.getByRole("radio", { name: "4 Stars" }).click({ force: true });
    await page.getByLabel("Comentario").fill(reviewCommentEdited);

    await page.getByRole("button", { name: "Enviar", exact: true }).click();

    // Esperar a que el texto cambie en la UI
    await expect(page.getByText(reviewCommentEdited)).toBeVisible();

    // --- RELOAD / PERSISTENCIA ---
    // Recargamos la página para asegurar persistencia.
    // Esperamos explícitamente a que la respuesta de la API de la tienda llegue.
    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes("/api/stores/") && resp.status() === 200,
    );
    await page.reload();
    await responsePromise;

    // --- ELIMINAR (Borrar la reseña) ---

    // Asegurarse de que la sección de reseñas se renderizó
    await expect(page.getByRole("heading", { name: "Reseñas" })).toBeVisible();

    // Buscamos la tarjeta específica que contiene el texto editado
    const reviewCard = page.locator(".MuiPaper-root").filter({ hasText: reviewCommentEdited });

    // Hacemos scroll para asegurar que playwrigt pueda interactuar con ella
    await reviewCard.scrollIntoViewIfNeeded();
    await expect(reviewCard).toBeVisible();

    // Dentro de esa tarjeta, buscamos el botón de eliminar
    const deleteButton = reviewCard
      .getByRole("button")
      .filter({ has: page.locator('svg[data-testid="DeleteIcon"]') });

    // Aseguramos que el botón sea visible antes de clickear
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // Confirmar en el diálogo
    await expect(page.getByText("¿Eliminar esta reseña?")).toBeVisible();
    await page.getByRole("button", { name: "Eliminar" }).click();

    // Verificar que desapareció
    await expect(page.getByText("Reseña eliminada")).toBeVisible();
    await expect(page.getByText(reviewCommentEdited)).not.toBeVisible();
  });
});
