import { test, expect } from "@playwright/test";

test.describe("Gestión de Productos (Items)", () => {
  test.beforeEach(async ({ page }) => {
    // Login como ADMIN para tener permisos en las tiendas por defecto
    await page.goto("/login");
    await page.getByLabel("Usuario").fill("admin");
    await page.getByLabel(/^Contraseña/).fill("admin123");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();
  });

  test("Debe permitir agregar, editar y eliminar un producto", async ({ page }) => {
    // 1. Ir a una tienda existente
    await page.getByText("Almacén Buen Pan").click();
    await expect(page).toHaveURL(/\/store\//);

    // --- CREAR ITEM ---
    const addItemBtn = page.getByRole("button", { name: "Agregar Item" });
    await expect(addItemBtn).toBeVisible();
    await addItemBtn.click();

    const itemName = `Sándwich Test ${Date.now()}`;
    const itemNameEdited = `${itemName} (Editado)`;
    const itemPrice = "3500";
    const itemPriceEdited = "4500";

    // Llenar formulario
    await expect(page.getByRole("heading", { name: "Agregar Item" })).toBeVisible();
    await page.getByLabel("Nombre").fill(itemName);
    await page.getByLabel("Descripción").fill("Descripción inicial");
    await page.getByLabel("Precio").fill(itemPrice);
    await page.getByRole("button", { name: "Agregar Item" }).click();

    // Verificar creación
    await expect(page.getByText("Item agregado con éxito")).toBeVisible();
    await expect(page.getByText(itemName)).toBeVisible();

    // --- EDITAR ITEM ---
    // Buscar la card del item creado
    const itemCard = page
      .locator(".MuiCardContent-root")
      .filter({ hasText: itemName })
      .locator(".."); // subir al Card container para ver los botones de acción

    // Click en botón editar (icono lápiz)
    await itemCard.hover(); // hover para asegurar visibilidad si está oculta
    await itemCard.getByRole("button").first().click(); // Asumiendo que el primer botón es editar

    // Verificar modal de edición
    await expect(page.getByRole("heading", { name: "Editar Item" })).toBeVisible();
    await expect(page.getByLabel("Nombre")).toHaveValue(itemName);

    // Modificar datos
    await page.getByLabel("Nombre").fill(itemNameEdited);
    await page.getByLabel("Precio").fill(itemPriceEdited);
    await page.getByRole("button", { name: "Guardar Cambios" }).click();

    // Verificar edición
    await expect(page.getByText("Item actualizado con éxito")).toBeVisible();
    await expect(page.getByText(itemNameEdited)).toBeVisible();

    // Usar { exact: true } para asegurar que no haga match con el nombre editado
    await expect(page.getByText(itemName, { exact: true })).not.toBeVisible();

    // 4500 -> 4.500 en formato chileno
    await expect(
      page.locator(".MuiCardContent-root").filter({ hasText: itemNameEdited }),
    ).toContainText("4.500");

    // --- ELIMINAR ITEM ---
    const itemCardEdited = page
      .locator(".MuiCardContent-root")
      .filter({ hasText: itemNameEdited })
      .locator("..");

    // Click en botón eliminar (icono basurero, segundo botón)
    await itemCardEdited.getByRole("button").nth(1).click();

    // Confirmar diálogo
    await expect(
      page.getByText("¿Estás seguro de que deseas eliminar este producto?"),
    ).toBeVisible();
    await page.getByRole("button", { name: "Eliminar" }).click();

    // Verificar eliminación
    await expect(page.getByText("Producto eliminado")).toBeVisible();
    await expect(page.getByText(itemNameEdited)).not.toBeVisible();
  });
});
