chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "ksContext",
    title: "Convert Kanji",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "ksContext") {
    chrome.storage.local.set({ selectedText: info.selectionText }, async () => {
      const popupUrl = chrome.runtime.getURL("ks.html");
      const popup = await chrome.windows.create({
        url: popupUrl,
        type: "popup",
        width: 250,
        height: 400
      });
    });
  }
});