// Este evento é disparado quando a extensão é instalada pela primeira vez.
chrome.runtime.onInstalled.addListener(() => {
  // Você pode definir valores iniciais no storage aqui.
  chrome.storage.local.set({ "extensaoAtiva": true });
  console.log("Service Worker da extensão iniciado e status salvo.");
});