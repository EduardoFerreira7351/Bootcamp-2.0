import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

// Caminho para a pasta da extensão "buildada"
const distPath = path.join(__dirname, 'dist');

export default defineConfig({
  testDir: './tests', // Onde os testes estão
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  use: {
    headless: true, // Roda os testes sem interface gráfica (essencial para o CI)
  },
  projects: [
    {
      name: 'chromium-with-extension',
      use: {
        ...devices['Desktop Chrome'],
        // Argumentos para o navegador carregar sua extensão
        launchOptions: {
          args: [
            `--disable-extensions-except=${distPath}`,
            `--load-extension=${distPath}`,
          ],
        },
      },
    },
  ],
});