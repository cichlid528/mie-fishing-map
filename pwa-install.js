(() => {
  "use strict";
  window.__MIE_PWA_INSTALL_MANAGED__ = true;

  const APP_VERSION = "v54-mie-only";
  const CURRENT_CACHE = "bass-spot-log-v54-mie-only";
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

  async function clearOldCaches() {
    if (!("caches" in window)) return;
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith("bass-spot-log-") && key !== CURRENT_CACHE)
      .map((key) => caches.delete(key)));
  }

  async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      setStatus("このブラウザはアプリ化に必要なService Workerに対応していません。");
      return;
    }
    if (!window.isSecureContext) {
      setStatus("HTTPSのGitHub Pages URLで開いてください。");
      return;
    }

    try {
      await clearOldCaches();
      const registration = await navigator.serviceWorker.register(`./sw.js?${APP_VERSION}`, { scope: "./" });
      await registration.update?.();
      if (isStandalone()) {
        setStatus("アプリはホーム画面から起動できます。地図が古い場合は一度閉じて開き直してください。");
      } else if (deferredInstallPrompt) {
        setStatus("Android / Chromeでは、このボタンからインストールできます。");
      } else if (isIOS()) {
        setStatus("iPhoneはSafariの共有ボタンから『ホーム画面に追加』を選んでください。");
      } else {
        setStatus("ブラウザのメニューから『アプリをインストール』または『ホーム画面に追加』を選んでください。");
      }
    } catch (error) {
      setStatus("アプリ更新の準備に失敗しました。再読み込みしてもう一度試してください。");
    }
  }

  async function installApp() {
    if (isStandalone()) {
      openInstallPanel("すでにホーム画面のアイコンからアプリとして起動しています。");
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
  window.addEventListener("load", registerServiceWorker);
})();
