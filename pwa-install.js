(() => {
  "use strict";
  window.__MIE_PWA_INSTALL_MANAGED__ = true;

  const APP_VERSION = "v84-mobile-stability";
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
  window.addEventListener("load", clearOldAppCache);
})();
