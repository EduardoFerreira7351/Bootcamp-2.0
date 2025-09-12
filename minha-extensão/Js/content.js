console.log("Content Script injetado na página.");

// Fica "ouvindo" por mensagens vindas de outras partes da extensão (como o popup)
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // Verifica se a mensagem é a que esperamos
    if (request.action === "mudarCorDeFundo") {
      document.body.style.backgroundColor = "lightyellow";
      // Opcional: envia uma resposta de volta
      sendResponse({ status: "Cor alterada com sucesso!" });
    }
  }
);