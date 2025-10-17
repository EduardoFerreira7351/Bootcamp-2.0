document.addEventListener('DOMContentLoaded', function() {
  const changeColorBtn = document.getElementById('changeColorBtn');

  changeColorBtn.addEventListener('click', function() {
    // Encontra a aba que está ativa na janela atual
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      // Envia uma mensagem para o content script daquela aba
      chrome.tabs.sendMessage(tabs[0].id, { action: "mudarCorDeFundo" });
    });
  });
});