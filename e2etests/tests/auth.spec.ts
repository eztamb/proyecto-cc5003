import { test, expect } from "@playwright/test";

test.describe("Autenticación y Acceso Protegido", () => {
  // Generamos un usuario único para cada ejecución
  const timestamp = Date.now();
  const username = `testuser_${timestamp}`;
  const password = "password123";

  test("Debe permitir registrarse, iniciar sesión y ver elementos protegidos", async ({ page }) => {
    // 1. Navegar al registro
    await page.goto("/signup");

    // 2. Llenar formulario de registro
    await page.getByLabel("Usuario").fill(username);
    await page.getByLabel(/^Contraseña/).fill(password);
    await page.getByLabel("Confirmar Contraseña").fill(password);

    // 3. Enviar registro (esto también hace login automático según el código del frontend)
    await page.getByRole("button", { name: "Registrarse" }).click();

    // 4. Verificar redirección y mensaje de éxito
    await expect(page).toHaveURL("/");
    await expect(page.getByText("Cuenta creada con éxito")).toBeVisible();

    // 5. Verificar acceso a elementos protegidos
    // El nombre de usuario debe estar visible en el Navbar
    const userMenuButton = page.getByRole("button", { name: username });
    await expect(userMenuButton).toBeVisible();

    // 6. Probar Logout
    // Primero debemos hacer clic en el usuario para abrir el menú.
    await userMenuButton.click();

    // Ahora el botón de Logout debería ser visible
    await expect(page.getByRole("menuitem", { name: "Logout" })).toBeVisible();
    await page.getByRole("menuitem", { name: "Logout" }).click();

    // Verificar redirección al login
    await expect(page).toHaveURL("/login");
    await expect(page.getByRole("button", { name: "Iniciar Sesión" })).toBeVisible();
  });

  test("Debe fallar login con credenciales incorrectas", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Usuario").fill("usuario_no_existe");
    await page.getByLabel("Contraseña").fill("clave_falsa");
    await page.getByRole("button", { name: "Iniciar Sesión" }).click();

    await expect(page.getByText("Usuario o contraseña incorrectos")).toBeVisible();
  });
});
