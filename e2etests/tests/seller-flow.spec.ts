import { test, expect } from "@playwright/test";

test.describe("Flujo de Solicitud de Vendedor", () => {
  const timestamp = Date.now();
  const username = `wannabe_seller_${timestamp}`;
  const password = "password123";

  test("Usuario solicita ser vendedor y admin aprueba", async ({ page }) => {
    // 1. Registrar usuario nuevo
    await page.goto("/signup");
    await page.getByLabel("Usuario").fill(username);
    await page.getByLabel(/^Contraseña/).fill(password);
    await page.getByLabel("Confirmar Contraseña").fill(password);
    await page.getByRole("button", { name: "Registrarse" }).click();
    await expect(page).toHaveURL("/");

    // 2. Solicitar ser vendedor
    // El botón "Sé Vendedor" debe estar visible para reviewers
    await page.getByRole("link", { name: "Sé Vendedor" }).click();
    await expect(page).toHaveURL("/become-seller");

    await page.getByLabel("Nombre Completo").fill("Juan Vendedor");
    // Usamos un RUT válido (Módulo 11) para pasar la validación
    await page.getByLabel("RUT").fill("12.345.678-5");
    await page.getByLabel("Correo de Contacto").fill("juan@example.com");
    await page
      .getByLabel("Cuéntanos de ti y tu negocio")
      .fill("Quiero vender las mejores empanadas de la facultad.");

    await page.getByRole("button", { name: "Solicitar" }).click();

    // Verificar mensaje de éxito y redirección
    await expect(page.getByText("Solicitud enviada con éxito")).toBeVisible();
    await expect(page).toHaveURL("/");

    // 3. Logout usuario
    await page.getByRole("button", { name: username }).click();
    await page.getByRole("menuitem", { name: "Logout" }).click();

    // 4. Login Admin (usando credenciales del seed)
    await page.getByLabel("Usuario").fill("admin");
    await page.getByLabel(/^Contraseña/).fill("admin123");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();

    // 5. Ir a Solicitudes
    await page.getByRole("button", { name: "admin" }).click();
    await page.getByRole("menuitem", { name: "Solicitudes" }).click();
    await expect(page).toHaveURL("/admin/requests");

    // 6. Aprobar solicitud
    // Buscamos la fila que contiene el nombre del usuario
    const row = page.getByRole("row", { name: username });
    await expect(row).toBeVisible();

    // Click en botón de aprobar (Primer botón en la celda de acciones, color success)
    await row.getByRole("button").first().click();

    // Verificar confirmación visual y que la fila desaparezca de pendientes
    await expect(page.getByText("Solicitud aprobada")).toBeVisible();
    await expect(row).not.toBeVisible();

    // 7. Logout Admin
    await page.getByRole("button", { name: "admin" }).click();
    await page.getByRole("menuitem", { name: "Logout" }).click();

    // 8. Login Usuario nuevamente
    await page.getByLabel("Usuario").fill(username);
    await page.getByLabel(/^Contraseña/).fill(password);
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();

    // 9. Verificar cambio de rol
    // Ahora debería ver "Mis Tiendas" en el navbar (visible solo para sellers y admins)
    await expect(page.getByRole("link", { name: "Mis Tiendas" })).toBeVisible();
    // Y ya no debería ver el botón de solicitar ser vendedor
    await expect(page.getByRole("link", { name: "Sé Vendedor" })).not.toBeVisible();
  });
});
