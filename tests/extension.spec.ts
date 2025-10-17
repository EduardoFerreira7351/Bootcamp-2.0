import { test, expect } from '@playwright/test';

test('A extensão deve injetar o content script na página correta', async ({ page }) => {
  // 1. Navega para a página onde o content script deve atuar
  await page.goto('https://example.com/');

  // 2. Procura pelo elemento que o content script deveria ter criado
  const marker = page.locator('#bootcamp-extension-test-marker');

  // 3. Verifica se o elemento está visível
  // Se a extensão funcionou, este teste vai passar.
  // Se não funcionou, ele vai falhar aqui.
  await expect(marker).toBeVisible({ timeout: 15000 });
});