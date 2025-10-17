import { test, expect, chromium } from '@playwright/test';
import path from 'node:path';

const distPath = path.resolve(__dirname, '..', 'dist');

test('popup da extensão deve carregar e ter o título correto', async ({}, testInfo) => {
 
  testInfo.setTimeout(120000);

  const context = await chromium.launchPersistentContext('', {
    headless: true,
    args: [
      `--disable-extensions-except=${distPath}`,
      `--load-extension=${distPath}`,
    ],
  });

  const backgroundPage = context.backgroundPages()[0];
  if (!backgroundPage) {
    throw new Error("Erro Crítico: Não foi possível encontrar a 'background page' da extensão.");
  }

 
  const extensionId = backgroundPage.url().split('/')[2];


  const popupPage = await context.newPage();
  await popupPage.goto(`chrome-extension://${extensionId}/pages/popup/popup.html`);

  
  await expect(popupPage).toHaveTitle('Bootcamp Helper');

  await context.close();
});