import { defineConfig, devices } from "@playwright/test";

/**
 * Configuración para pruebas E2E de BeaucheFoods.
 * Se asume que el frontend corre en http://localhost:5173
 * y el backend en http://localhost:3001
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  // Configuración del WebServer: Playwright levantará el backend y frontend automáticamente
  webServer: [
    {
      // Backend en modo TEST (hace seed automático + usa DB test)
      command: "cd ../backend && npm run start:test",
      port: 3001,
      timeout: 120 * 1000, // Dar tiempo al seed y compile
      reuseExistingServer: !process.env.CI,
    },
    {
      // Frontend
      command: "cd ../frontend && npm run dev",
      port: 5173,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
  ],

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Descomentar estos para probar en otros navegadores
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
