import { test, expect, chromium } from '@playwright/test';
import path from 'node:path';

const distPath = path.resolve(__dirname, '..', 'dist');

test('A extensão deve injetar o content script na página de resultados do Google', async ({}, testInfo) => {
  testInfo.setTimeout(120000); // Mantemos um timeout generoso

  // 1. Lançamos um navegador com a extensão carregada.
  const context = await chromium.launchPersistentContext('', {
    headless: true,
    args: [
      `--disable-extensions-except=${distPath}`,
      `--load-extension=${distPath}`,
    ],
  });
  const page = await context.newPage();

  // 2. Navega para uma página de resultados de pesquisa do Google.
  // A URL precisa conter "/search" para ativar o content script.
  await page.goto('https://www.google.com/search?q=Playwright');

  // 3. Procura pelo elemento que o content script deveria ter criado.
  // Garanta que seu content.js cria este elemento!
  const marker = page.locator('#bootcamp-extension-test-marker');

  // 4. Verifica se o elemento está visível
  await expect(marker).toBeVisible({ timeout: 15000 });

  // 5. Fecha o navegador
  await context.close();
});