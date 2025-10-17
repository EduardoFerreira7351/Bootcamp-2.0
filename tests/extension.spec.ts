import { test, expect, chromium } from '@playwright/test';
import path from 'node:path';

const distPath = path.resolve(__dirname, '..', 'dist');

test('A extensão deve injetar o content script na página correta', async ({}, testInfo) => {
  // Mantemos o timeout generoso por segurança
  testInfo.setTimeout(120000);

  // --- PASSO 1: LANÇAR O NAVEGADOR COM A EXTENSÃO ---
  // Esta é a parte crucial que estava faltando.
  const context = await chromium.launchPersistentContext('', {
    headless: true,
    args: [
      `--disable-extensions-except=${distPath}`,
      `--load-extension=${distPath}`,
    ],
  });
  const page = await context.newPage();

  // --- PASSO 2: EXECUTAR O TESTE ---
  // Agora, neste navegador que TEM a extensão, vamos para a página.
  await page.goto('https://example.com/');

  // Procura pelo elemento que o content script deveria ter criado
  const marker = page.locator('#bootcamp-extension-test-marker');

  // Verifica se o elemento está visível
  await expect(marker).toBeVisible({ timeout: 15000 });

  // Fecha o navegador
  await context.close();
});