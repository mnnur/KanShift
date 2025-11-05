let textInput = document.getElementById('japan-input');
let resultInput = document.getElementById('result-input');
let buttonConvert = document.getElementById('buttonConvert');
let convertTypeSelect = document.getElementById('convert-type');

window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("convertType", (data) => {
    if (data.convertType) convertTypeSelect.value = data.convertType;
  });

  buttonConvert.addEventListener("click", convert);

  convertTypeSelect.addEventListener("change", () => {
    chrome.storage.local.set({ convertType: convertTypeSelect.value });
  });


  chrome.storage.local.get("selectedText", (data) => {
    if (data.selectedText) {
      textInput.value = data.selectedText;
      convert();
      chrome.storage.local.remove("selectedText");
    }
  });


});



let kuroshiro;
let isKuroshiroInitialized = false;

async function initKuroshiro() {
  if (!isKuroshiroInitialized) {
    kuroshiro = new Kuroshiro.default();
    await kuroshiro.init(new KuromojiAnalyzer({ dictPath: "./dict" }));
    isKuroshiroInitialized = true;
  }
}

async function convertText(text, type) {
  await initKuroshiro();
  return await kuroshiro.convert(text, { to: type });
}

async function convert() {
  const text = textInput.value.trim();
  if (!text) return;

  const type = convertTypeSelect.value;
  resultInput.value = "Converting...";

  try {
    const result = await convertText(text, type);
    resultInput.value = result;
  } catch (error) {
    resultInput.value = "Error: " + error.message;
    console.error(error);
  }
}


chrome.runtime.onMessage.addListener((message) => {
  if (message.text) {
    textInput.value = message.text;
    convert();
  }
});
