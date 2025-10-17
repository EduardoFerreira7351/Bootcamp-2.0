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

  // --- ESTRATÉGIA FINAL - VERSÃO CORRIGIDA ---
  let extensionId = null;
  for (let i = 0; i < 20; i++) {
    
    // Primeiro, procuramos nos Service Workers
    for (const worker of context.serviceWorkers()) {
      if (worker.url().startsWith('chrome-extension://')) {
        extensionId = worker.url().split('/')[2];
        break;
      }
    }
    if (extensionId) break;

    // Se não achou, procuramos em todas as páginas abertas
    for (const page of context.pages()) {
      if (page.url().startsWith('chrome-extension://')) {
        extensionId = page.url().split('/')[2];
        break;
      }
    }
    if (extensionId) break;

    // --- CORREÇÃO FINAL ---
    // Usamos uma pausa padrão do JavaScript que não gera erro no linter
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  if (!extensionId) {
    throw new Error("ERRO FINAL: Não foi possível encontrar NENHUM componente da extensão carregado após 10 segundos.");
  }

  const popupPage = await context.newPage();
  await popupPage.goto(`chrome-extension://${extensionId}/pages/popup/popup.html`);

  await expect(popupPage).toHaveTitle('Bootcamp Helper');

  await context.close();
});