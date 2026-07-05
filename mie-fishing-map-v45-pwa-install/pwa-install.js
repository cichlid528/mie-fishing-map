(() => {
  "use strict";

  const APP_VERSION = "v45";
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

  function isAndroid() {
    return /android/i.test(window.navigator.userAgent || "");
  }

  function setInstallStatus(message) {
    if (!installStatus) return;
    installStatus.textContent = message;
  }

  function updateInstallStatus(message = "") {
    if (message) {
      setInstallStatus(message);
      return;
    }

    if (isStandalone()) {
      setInstallStatus("すでにホーム画面のアイコンからアプリとして起動しています。");
    } else if (deferredInstallPrompt) {
      setInstallStatus("Android / Chrome では、この画面のボタンからインストールできます。");
    } else if (isIOS()) {
      setInstallStatus("iPhoneはSafariで開き、共有ボタンから『ホーム画面に追加』を選んでください。");
    } else if (isAndroid()) {
      setInstallStatus("Chrome右上の『︙』から『アプリをインストール』または『ホーム画面に追加』を選んでください。");
    } else {
      setInstallStatus("ブラウザのメニューから『アプリをインストール』または『ホーム画面に追加』を選んでください。");
    }
  }

  function openInstallPanel(message = "") {
    updateInstallStatus(message);
    installPanel?.classList.add("is-open");
    installPanel?.setAttribute("aria-hidden", "false");
  }

  function closeInstallPanel() {
    installPanel?.classList.remove("is-open");
    installPanel?.setAttribute("aria-hidden", "true");
  }

  async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      updateInstallStatus("このブラウザはアプリのインストールに必要な機能に対応していません。");
      return;
    }

    if (!window.isSecureContext) {
      updateInstallStatus("アプリとして使うにはHTTPSで開いてください。GitHub PagesのURLで開けば大丈夫です。");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register(`./sw.js?${APP_VERSION}`, { scope: "./" });
      registration.update?.();
      updateInstallStatus();
    } catch (error) {
      updateInstallStatus("アプリの準備に失敗しました。再読み込みしてもう一度試してください。");
    }
  }

  async function handleInstallClick() {
    if (isStandalone()) {
      openInstallPanel("すでにアプリとして起動しています。ホーム画面のアイコンから開けます。");
      return;
    }

    if (deferredInstallPrompt) {
      try {
        deferredInstallPrompt.prompt();
        const choice = await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        if (choice?.outcome === "accepted") {
          openInstallPanel("インストールを開始しました。ホーム画面のアイコンを確認してください。");
        } else {
          openInstallPanel("インストールはキャンセルされました。必要なときにもう一度押してください。");
        }
      } catch (error) {
        openInstallPanel("自動インストール画面を開けませんでした。ブラウザのメニューからホーム画面に追加してください。");
      }
      return;
    }

    if (isIOS()) {
      openInstallPanel("iPhoneはSafariで開いて、共有ボタンから『ホーム画面に追加』を選んでください。");
    } else {
      openInstallPanel("この端末ではブラウザのメニューから『アプリをインストール』または『ホーム画面に追加』を選んでください。");
    }
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updateInstallStatus("Android / Chrome では、このボタンからインストールできます。");
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    openInstallPanel("インストールが完了しました。ホーム画面のアイコンから起動できます。");
  });

  installButton?.addEventListener("click", handleInstallClick);
  closeInstallPanelButton?.addEventListener("click", closeInstallPanel);
  closeInstallDoneButton?.addEventListener("click", closeInstallPanel);

  window.addEventListener("load", registerServiceWorker);
  updateInstallStatus();
})();
