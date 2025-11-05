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
});

let kuroshiro;
let isKuroshiroInitialized = false;

async function convertText(text, type) {
  if (!isKuroshiroInitialized) {
    try {
      kuroshiro = new Kuroshiro.default();
      await kuroshiro.init(new KuromojiAnalyzer({ dictPath: "./dict" }));
      isKuroshiroInitialized = true;
    } catch (error) {
      console.error("Kuroshiro init failed:", error);
      throw error;
    }
  }

  try {
    const result = await kuroshiro.convert(text, { to: type });
    return result;
  } catch (error) {
    console.error("Conversion error:", error);
    return "Error during conversion.";
  }
}

async function convert() {
  const text = textInput.value.trim();
  const type = convertTypeSelect.value;
  if (!text) return;
  resultInput.value = "Converting...";
  resultInput.value = await convertText(text, type);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.text) {
    textInput.value = message.text;
    convert();
  }
});
