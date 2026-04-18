(async () => {
  const src = chrome.runtime.getURL('src/content/content-main.js');
  await import(src);
})();