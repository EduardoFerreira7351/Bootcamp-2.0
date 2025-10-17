import { test, expect, chromium } from '@playwright/test';
import path from 'node:path';

const distPath = path.resolve(__dirname, '..', 'dist');

test('popup da extensão deve carregar e ter o título correto', async ({}, testInfo) => {
  testInfo.setTimeout(120000); 

 
  const browser = await chromium.launch({
    headless: true,
    args: [
      `--disable-extensions-except=${distPath}`,
      `--load-extension=${distPath}`,
    ],
  });
  const context = browser.contexts()[0];

  
  const serviceWorker = await context.waitForEvent('serviceworker', { timeout: 20000 });

  const extensionId = serviceWorker.url().split('/')[2];

  const popupPage = await context.newPage();
  await popupPage.goto(`chrome-extension://${extensionId}/pages/popup/popup.html`);

  await expect(popupPage).toHaveTitle('Bootcamp Helper');

  
  await browser.close();
});