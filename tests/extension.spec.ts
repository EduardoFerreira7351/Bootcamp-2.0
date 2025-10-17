import { test, expect, chromium } from '@playwright/test';
import path from 'node:path';

const distPath = path.resolve(__dirname, '..', 'dist');

test('popup da extensão deve carregar e ter o título correto', async ({}, testInfo) => {
  testInfo.setTimeout(120000); // Mantemos o timeout generoso

  const context = await chromium.launchPersistentContext('', {
    headless: true,
    args: [
      `--disable-extensions-except=${distPath}`,
      `--load-extension=${distPath}`,
    ],
  });

  // --- A JOGADA FINAL: O "EMPURRÃO" ---
  // Abrimos uma nova página em branco. Este ato força o navegador
  // a inicializar completamente todos os componentes carregados, incluindo nossa extensão.
  await context.newPage();

  // Agora que a extensão foi "acordada", nossa lógica de busca vai funcionar.
  let extensionId = null;
  for (let i = 0; i < 20; i++) {
    for (const worker of context.serviceWorkers()) {
      if (worker.url().startsWith('chrome-extension://')) {
        extensionId = worker.url().split('/')[2];
        break;
      }
    }
    if (extensionId) break;

    for (const page of context.pages()) {
      if (page.url().startsWith('chrome-extension://')) {
        extensionId = page.url().split('/')[2];
        break;
      }
    }
    if (extensionId) break;
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  if (!extensionId) {
    throw new Error("ERRO FINAL: A extensão não inicializou mesmo após o estímulo.");
  }

  // Com o ID finalmente em mãos, o resto do teste é rápido
  const popupPage = await context.newPage();
  await popupPage.goto(`chrome-extension://${extensionId}/pages/popup/popup.html`);

  await expect(popupPage).toHaveTitle('Bootcamp Helper');

  await context.close();
});