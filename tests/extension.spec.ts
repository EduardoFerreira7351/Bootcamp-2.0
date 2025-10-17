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
  await page.goto('https://www.google.com/search?q=Playwright');

  // --- A JOGADA FINAL: DERROTANDO O POP-UP DE COOKIES ---
  // Procuramos pelo botão "Rejeitar tudo" e clicamos nele se ele aparecer.
  // O 'catch' garante que o teste continue mesmo se o pop-up não aparecer.
  try {
    const rejectButton = page.locator('#W0wltc'); // Este é o ID do botão "Rejeitar tudo"
    await rejectButton.click({ timeout: 5000 }); // Damos 5s para ele aparecer
  } catch (error) {
    // Se o botão não for encontrado, ótimo! A página está limpa.
    console.log('Pop-up de consentimento não encontrado, prosseguindo...');
  }
  
  // 3. Procura pelo elemento que o content script deveria ter criado.
  const marker = page.locator('#bootcamp-extension-test-marker');

  // 4. Verifica se o elemento está visível
  await expect(marker).toBeVisible({ timeout: 15000 });

  // 5. Fecha o navegador
  await context.close();
});