console.log("Content Script injetado na página.");


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    
    if (request.action === "mudarCorDeFundo") {
      document.body.style.backgroundColor = "lightyellow";
      
      sendResponse({ status: "Cor alterada com sucesso!" });
    }
  }
);