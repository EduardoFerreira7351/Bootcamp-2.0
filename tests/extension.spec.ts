import { test, expect, chromium } from '@playwright/test';
import path from 'node:path';

const distPath = path.resolve(__dirname, '..', 'dist');

test('popup da extensão deve carregar e ter o título correto', async ({}, testInfo) => {
  // Aumenta o tempo limite do teste, pois carregar a extensão pode ser um pouco lento
  testInfo.setTimeout(testInfo.timeout + 10000);

  // Lança o navegador com a sua extensão carregada
  const context = await chromium.launchPersistentContext('', {
    headless: true,
    args: [
      `--disable-extensions-except=${distPath}`,
      `--load-extension=${distPath}`,
    ],
  });

  // Procura pelo Service Worker da extensão. É a forma moderna de encontrá-la.
  let [serviceWorker] = context.serviceWorkers();
  if (!serviceWorker) {
    serviceWorker = await context.waitForEvent('serviceworker');
  }

  // Extrai o ID da extensão a partir da URL do Service Worker
  const extensionId = serviceWorker.url().split('/')[2];

  // Abre a página do popup diretamente, usando o ID que encontramos
  const popupPage = await context.newPage();
  // VERIFIQUE SE ESTE CAMINHO PARA O SEU POPUP ESTÁ CORRETO!
  await popupPage.goto(`chrome-extension://${extensionId}/pages/popup/popup.html`);

  // Verifica se o título da página do popup está correto
  await expect(popupPage).toHaveTitle('Bootcamp Helper');

  // Fecha o contexto do navegador
  await context.close();
});