import { test, expect, chromium } from '@playwright/test';
import path from 'node:path';

const distPath = path.resolve(__dirname, '..', 'dist');

test('Exemplo de teste: popup da extensão deve ter um título', async () => {
  // O Playwright precisa de uma página para abrir o popup da extensão
  const page = await chromium.launchPersistentContext('', {
    args: [
      `--disable-extensions-except=${distPath}`,
      `--load-extension=${distPath}`,
    ],
  }).then(context => context.newPage());

  // Navega para a página de extensões para encontrar o ID da sua
  await page.goto('chrome://extensions');
  await page.waitForTimeout(500); // pequena espera para a página carregar

  const extensionId = await page.evaluate(async () => {
      // Este código roda no navegador para encontrar o ID da extensão
      const extensions = await (globalThis as any).chrome.management.getAll();
      const myExtension = extensions.find((ext: { name: string; }) => ext.name === 'Minha Extensão de Exemplo'); // <-- MUDE AQUI
      return myExtension.id;
  });

  // Abre o popup da extensão em uma nova aba
  const popupPage = await page.context().newPage();
  await popupPage.goto(`chrome-extension://${extensionId}/popup/popup.html`); // <-- VERIFIQUE O CAMINHO

  // Agora você pode testar o conteúdo do popup
  const pageTitle = await popupPage.title();
  expect(pageTitle).toBe('Título do Popup'); // <-- MUDE AQUI para o título real do seu popup.html

  // Exemplo: verificar se um elemento existe
  // const locator = popupPage.locator('#meu-botao');
  // await expect(locator).toBeVisible();

  await page.context().close();
});