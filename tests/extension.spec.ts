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

  // 2. Navega para a página de resultados de pesquisa do Google.
  await page.goto('https://www.google.com/search?q=Playwright');

  // --- PASSO DE INTELIGÊNCIA #1: LIDAR COM O POP-UP DE FORMA ROBUSTA ---
  // Procuramos pelo botão de consentimento pelo TEXTO, que é mais confiável.
  try {
    // Procura por um botão que contenha "Rejeitar tudo" ou "Reject all" (ignora maiúsculas/minúsculas)
    await page.getByRole('button', { name: /Rejeitar tudo|Reject all/i }).click({ timeout: 5000 });
  } catch (error) {
    console.log('Pop-up de consentimento não encontrado ou já tratado, prosseguindo...');
  }
  
  // --- PASSO DE INTELIGÊNCIA #2: ESPERAR A PÁGINA REAL CARREGAR ---
  // Antes de procurar nosso <div>, vamos esperar por um elemento que SÓ existe
  // na página de resultados: a barra de pesquisa no topo.
  const searchBar = page.locator('textarea[name="q"]');
  await expect(searchBar).toBeVisible({ timeout: 10000 });

  // 3. AGORA SIM: Com a página pronta, procuramos pelo nosso elemento.
  const marker = page.locator('#bootcamp-extension-test-marker');

  // 4. Verifica se o elemento está visível
  await expect(marker).toBeVisible({ timeout: 10000 });

  // 5. Fecha o navegador
  await context.close();
});