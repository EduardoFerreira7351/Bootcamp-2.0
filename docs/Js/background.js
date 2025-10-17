
chrome.runtime.onInstalled.addListener(() => {
  
  chrome.storage.local.set({ "extensaoAtiva": true });
  console.log("Service Worker da extensão iniciado e status salvo.");
});