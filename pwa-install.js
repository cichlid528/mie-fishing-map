(() => {
  "use strict";
  window.__MIE_PWA_INSTALL_MANAGED__ = true;

  const APP_VERSION = "v134-nanairo-dam-fix";
  const STATUS_LABEL = "v134・宮川ダム・七色ダム・池原ダム反映版";
  const installButton = document.querySelector("#installAppButton");
  const installPanel = document.querySelector("#installPanel");
  const installStatus = document.querySelector("#installStatus");
  const closeInstallPanelButton = document.querySelector("#closeInstallPanel");
  const closeInstallDoneButton = document.querySelector("#closeInstallDone");
  let deferredInstallPrompt = null;

  function isStandalone() {
    return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
  }

  function isIOS() {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent || "");
  }

  function setStatus(message) {
    if (installStatus) installStatus.textContent = message;
  }

  function openInstallPanel(message = "") {
    if (message) setStatus(message);
    installPanel?.classList.add("is-open");
    installPanel?.setAttribute("aria-hidden", "false");
  }

  function closeInstallPanel() {
    installPanel?.classList.remove("is-open");
    installPanel?.setAttribute("aria-hidden", "true");
  }

  function patchText(value) {
    if (typeof value !== "string") return value;
    return value
      .replaceAll("大杉湖", "宮川ダム")
      .replaceAll("七色貯水池", "七色ダム")
      .replaceAll("v131・中勢グリーンパーク削除版", STATUS_LABEL)
      .replaceAll("v133・宮川ダム・七色ダム・池原ダム追加版", STATUS_LABEL)
      .replaceAll("v131-remove-chusei-green-park", APP_VERSION)
      .replaceAll("v133-miyagawa-nanairo-ikehara", APP_VERSION);
  }

  function patchNode(node) {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const next = patchText(node.nodeValue || "");
      if (next !== node.nodeValue) node.nodeValue = next;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_NODE) return;
    if (node.nodeType === Node.ELEMENT_NODE && node.attributes) {
      Array.from(node.attributes).forEach((attr) => {
        const next = patchText(attr.value || "");
        if (next !== attr.value) node.setAttribute(attr.name, next);
      });
    }
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let current = walker.nextNode();
    while (current) {
      patchNode(current);
      current = walker.nextNode();
    }
  }

  function startTextPatch() {
    patchNode(document.body);
    if (!document.body) return;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") patchNode(mutation.target);
        if (mutation.type === "attributes") patchNode(mutation.target);
        mutation.addedNodes.forEach(patchNode);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true });
  }

  async function clearOldAppCache() {
    try {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.filter((key) => key.startsWith("bass-spot-log-")).map((key) => caches.delete(key)));
      }
      setStatus(`古いアプリキャッシュを削除しました。最新版 ${APP_VERSION} で表示します。`);
    } catch (error) {
      setStatus("古いキャッシュの削除に失敗しました。reset-cache.html を開いてください。");
    }
  }

  async function installApp() {
    if (isStandalone()) {
      openInstallPanel("すでにホーム画面のアイコンからアプリとして起動しています。古い表示なら一度閉じて、reset-cache.html?auto=1 を開いてください。");
      return;
    }
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      openInstallPanel(choice?.outcome === "accepted"
        ? "インストールを開始しました。ホーム画面のアイコンを確認してください。"
        : "インストールはキャンセルされました。必要なときにもう一度押してください。");
      return;
    }
    openInstallPanel(isIOS()
      ? "iPhoneはSafariで開いて、共有ボタンから『ホーム画面に追加』を選んでください。"
      : "Chrome右上の『︙』から『アプリをインストール』または『ホーム画面に追加』を選んでください。");
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    setStatus("Android / Chromeでは、このボタンからインストールできます。");
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    openInstallPanel("インストールが完了しました。ホーム画面のアイコンから起動できます。");
  });

  installButton?.addEventListener("click", installApp);
  closeInstallPanelButton?.addEventListener("click", closeInstallPanel);
  closeInstallDoneButton?.addEventListener("click", closeInstallPanel);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startTextPatch, { once: true });
  } else {
    startTextPatch();
  }

  window.addEventListener("load", () => {
    patchNode(document.body);
    clearOldAppCache();
  });
})();
