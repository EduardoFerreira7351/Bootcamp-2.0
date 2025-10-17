import { test, expect, chromium } from '@playwright/test';
import path from 'node:path';

const distPath = path.resolve(__dirname, '..', 'dist');

test('popup da extensão deve carregar e ter o título correto', async ({}, testInfo) => {
  // Mantemos um tempo limite alto por segurança
  testInfo.setTimeout(120000);

  const context = await chromium.launchPersistentContext('', {
    headless: true,
    args: [
      `--disable-extensions-except=${distPath}`,
      `--load-extension=${distPath}`,
    ],
  });

  // --- ESTRATÉGIA FINAL: POLLING ATIVO ---
  // Em vez de esperar por um evento que pode não acontecer, vamos procurar
  // ativamente pelo Service Worker por até 10 segundos.
  let serviceWorker;
  try {
    serviceWorker = await context.waitForEvent('serviceworker', { timeout: 10000 });
  } catch (e) {
      throw new Error("TIMEOUT CRÍTICO: O Service Worker da extensão não foi encontrado após 10 segundos. Verifique o manifest.json.");
  }

  // Com o Service Worker encontrado, o resto do teste é rápido.
  const extensionId = serviceWorker.url().split('/')[2];

  const popupPage = await context.newPage();
  await popupPage.goto(`chrome-extension://${extensionId}/pages/popup/popup.html`);

  await expect(popupPage).toHaveTitle('Bootcamp Helper');

  await context.close();
});