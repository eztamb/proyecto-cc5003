import { test, expect } from "@playwright/test";

test.describe("Seguridad y Roles (Usuario Reviewer)", () => {
  // Definimos variables let para que sean accesibles en los tests
  let username = "";
  let password = "password123";

  test.beforeEach(async ({ page }) => {
    // Generar credenciales ÚNICAS para cada ejecución/intento
    // Esto evita el error E11000 duplicate key si el test se reintenta
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    username = `reviewer_${timestamp}_${random}`;

    // Registrar un usuario (será reviewer porque ya corrimos el seed y existe un admin)
    await page.goto("/signup");
    await page.getByLabel("Usuario").fill(username);
    await page.getByLabel(/^Contraseña/).fill(password);
    await page.getByLabel("Confirmar Contraseña").fill(password);
    await page.getByRole("button", { name: "Registrarse" }).click();
    await expect(page).toHaveURL("/");
  });

  test("No debe mostrar botones de administración a usuarios normales", async ({ page }) => {
    // Verificar que NO ve el botón de agregar tienda
    await expect(page.getByRole("button", { name: "Agregar Tienda" })).not.toBeVisible();

    // Verificar que NO ve el botón de administrar usuarios en el navbar
    await expect(page.getByRole("link", { name: "Administrar Usuarios" })).not.toBeVisible();
  });

  test("Debe proteger rutas administrativas", async ({ page }) => {
    // Intentar navegar directamente a la gestión de usuarios
    await page.goto("/users");

    // Debería redirigir al home
    await expect(page).toHaveURL("/");

    // Intentar navegar a crear tienda
    await page.goto("/new-store");
    await expect(page).toHaveURL("/");
  });
});
