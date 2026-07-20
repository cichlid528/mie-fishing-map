(() => {
  "use strict";
  window.__MIE_PWA_INSTALL_MANAGED__ = true;
  const APP_VERSION = "v185-free-install-guide";
  const PET_NAME = "爆釣にゃん師匠";
  const PET_MOTION_NAMES = ["idle", "kiriri", "wink", "happy", "surprise", "think", "angry", "sleepy", "doya", "guide", "smile", "sad", "dreamy", "focus", "side", "back"];
  const PET_MOTION_IMAGES = PET_MOTION_NAMES.map((name) => `assets/nyan-motion-${name}-v177.png?v=${APP_VERSION}`);
  const PET_IMAGE_SRC = PET_MOTION_IMAGES[0];
  const PET_IMAGE_FALLBACK_SRC = PET_MOTION_IMAGES[0];
  const PET_BUBBLE_IMAGE_SRC = `assets/turi-nyan-speech-bubble-comic-transparent-v176.png?v=${APP_VERSION}`;

  function patchText(value) {
    if (typeof value !== "string") return value;
    return value
      .replaceAll("爆調ニャンコ視聴", PET_NAME)
      .replaceAll("爆調ツインニャンコ", "爆釣ツインニャンコ")
      .replaceAll("v156-menu-bg-map-fix", APP_VERSION)
      .replaceAll("v163-menu-points-fix", APP_VERSION)
      .replaceAll("v172-spot-checklist-restore", APP_VERSION)
      .replaceAll("v173-motion-nyan-sensei", APP_VERSION)
      .replaceAll("v176-spot-species-picker-fix", APP_VERSION);
  }

  function patchNode(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let node = walker.currentNode;
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const next = patchText(node.nodeValue || "");
        if (next !== node.nodeValue) node.nodeValue = next;
      } else if (node.nodeType === Node.ELEMENT_NODE && node.attributes) {
        for (const attr of Array.from(node.attributes)) {
          const next = patchText(attr.value || "");
          if (next !== attr.value) node.setAttribute(attr.name, next);
        }
      }
      node = walker.nextNode();
    }
  }

  function injectPetStyles() {
    if (document.getElementById("turiNyanPetStyles")) return;
    const style = document.createElement("style");
    style.id = "turiNyanPetStyles";
    style.textContent = `
      :root { --turi-nyan-bubble-image: url("${PET_BUBBLE_IMAGE_SRC}"); }
      #turiNyanPet { --nyan-icon-size: 124px; --nyan-bubble-size: 284px; --nyan-edge-gap: 10px; position: fixed; right: calc(var(--nyan-edge-gap) + env(safe-area-inset-right)); bottom: calc(78px + env(safe-area-inset-bottom)); z-index: 2147483200; display: grid; justify-items: end; pointer-events: none; }
      #turiNyanPet .pet-bubble { display: none; width: min(var(--nyan-bubble-size), calc(100vw - 14px)); max-height: calc(100dvh - 120px - env(safe-area-inset-top) - env(safe-area-inset-bottom)); aspect-ratio: 1 / 1; padding: 72px 64px 82px 56px; box-sizing: border-box; background-color: transparent !important; background-image: var(--turi-nyan-bubble-image) !important; background-repeat: no-repeat !important; background-size: 100% 100% !important; background-position: center !important; border: 0 !important; box-shadow: none !important; color: #17120d; font-size: .50rem; font-weight: 900; line-height: 1.08; pointer-events: auto; overflow: hidden; }
      #turiNyanPet.is-speaking .pet-bubble { display: block; }
      #turiNyanPet .pet-bubble strong { display: block; color: #8d321d; font-size: .56rem; line-height: 1.04; margin-bottom: 2px; white-space: nowrap; }
      #turiNyanPet #turiNyanMessage { display: -webkit-box; max-height: 3.54em; overflow: hidden; overflow-wrap: anywhere; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
      #turiNyanPet .pet-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3px; margin-top: 4px; }
      #turiNyanPet .pet-actions button { min-height: 19px; padding: 2px 4px; border-radius: 999px; font-size: .46rem; font-weight: 900; pointer-events: auto; }
      #turiNyanPet .pet-button { width: var(--nyan-icon-size); height: var(--nyan-icon-size); padding: 0; border: 0; border-radius: 999px; background: transparent; pointer-events: auto; filter: drop-shadow(0 10px 18px rgba(0,0,0,.20)); }
      #turiNyanPet .pet-button img { width: 100%; height: 100%; object-fit: contain; transform: scale(1.10); transform-origin: center bottom; transition: opacity .12s ease, transform .18s ease; animation: turiNyanFloat 1.9s ease-in-out infinite; will-change: transform, opacity; }
      #turiNyanPet.is-motioning .pet-button img { transform: scale(1.18) translateY(-4px) rotate(-2deg); }
      #turiNyanPet.is-speaking .pet-button img { animation-duration: 2.2s; }
      @keyframes turiNyanFloat {
        0%, 100% { transform: scale(1.10) translateY(0) rotate(0deg); }
        35% { transform: scale(1.13) translateY(-5px) rotate(-1deg); }
        70% { transform: scale(1.11) translateY(-1px) rotate(1deg); }
      }
      @media (prefers-reduced-motion: reduce) {
        #turiNyanPet .pet-button img { animation: none !important; transition: none !important; }
      }
      @media (max-width: 480px) {
        #turiNyanPet { --nyan-icon-size: 108px; --nyan-bubble-size: 260px; --nyan-edge-gap: 8px; right: calc(var(--nyan-edge-gap) + env(safe-area-inset-right)); bottom: calc(70px + env(safe-area-inset-bottom)); }
        #turiNyanPet .pet-bubble { width: min(var(--nyan-bubble-size), calc(100vw - 20px)); padding: 52px 45px 58px 40px; font-size: clamp(.64rem, 2.6vw, .76rem); line-height: 1.18; }
        #turiNyanPet .pet-bubble strong { font-size: clamp(.68rem, 2.8vw, .82rem); line-height: 1.12; margin-bottom: 2px; white-space: normal; }
        #turiNyanPet .pet-actions { gap: 4px; margin-top: 4px; }
        #turiNyanPet .pet-actions button { min-height: 28px; padding: 3px 6px; font-size: clamp(.60rem, 2.4vw, .72rem); touch-action: manipulation; }
      }
      @media (max-width: 390px) {
        #turiNyanPet { --nyan-icon-size: 84px; --nyan-bubble-size: 218px; --nyan-edge-gap: 7px; right: calc(var(--nyan-edge-gap) + env(safe-area-inset-right)); bottom: calc(68px + env(safe-area-inset-bottom)); }
        #turiNyanPet .pet-bubble { padding: 48px 41px 54px 37px; }
        #turiNyanPet .pet-button img { transform: scale(1.04); }
        #turiNyanPet.is-motioning .pet-button img { transform: scale(1.07) translateY(-2px) rotate(-1deg); }
      }
      @media (max-width: 360px) {
        #turiNyanPet { --nyan-icon-size: 72px; --nyan-bubble-size: 190px; --nyan-edge-gap: 5px; right: calc(var(--nyan-edge-gap) + env(safe-area-inset-right)); bottom: calc(62px + env(safe-area-inset-bottom)); }
        #turiNyanPet .pet-bubble { padding: 45px 38px 50px 34px; }
      }
      @media (max-height: 620px) {
        #turiNyanPet { --nyan-icon-size: 70px; --nyan-bubble-size: 184px; bottom: calc(54px + env(safe-area-inset-bottom)); }
      }
      body.menu-open #turiNyanPet, body.panel-open #turiNyanPet, body.position-adjusting #turiNyanPet, body.map-popup-open #turiNyanPet, body.record-popup-open #turiNyanPet, body.spot-card-open #turiNyanPet, body.catch-detail-open #turiNyanPet { display: none !important; }
    `;
    document.head.appendChild(style);
  }

  function preloadMotionImages() {
    PET_MOTION_IMAGES.forEach((src) => {
      try { const img = new Image(); img.src = src; } catch (error) {}
    });
  }

  function installPet() {
    if (document.getElementById("turiNyanPet")) return;
    preloadMotionImages();
    const pet = document.createElement("aside");
    pet.id = "turiNyanPet";
    pet.innerHTML = `<div class="pet-bubble"><strong>${PET_NAME}</strong><span id="turiNyanMessage">魚種をボタンで選べるにゃ。</span><div class="pet-actions"><button type="button" data-pet-close>閉じる</button><button type="button" data-pet-map>地図</button></div></div><button class="pet-button" type="button" aria-label="${PET_NAME}"><img id="turiNyanPetImage" src="${PET_IMAGE_SRC}" alt="${PET_NAME}" data-motion-animated="0"></button>`;
    document.body.appendChild(pet);

    const petButton = pet.querySelector(".pet-button");
    const petImage = pet.querySelector("#turiNyanPetImage");
    const messageEl = pet.querySelector("#turiNyanMessage");
    let motionIndex = 0;
    let motionTimer = null;
    let hideSpeechTimer = null;
    let lastManualMotionAt = 0;
    petImage?.addEventListener("error", () => {
      petImage.dataset.motionAnimated = "0";
      if (petImage.getAttribute("src") !== PET_IMAGE_FALLBACK_SRC) petImage.src = PET_IMAGE_FALLBACK_SRC;
    }, { once: true });

    const setMotionFrame = (index, lively = true) => {
      if (!petImage) return;
      motionIndex = ((index % PET_MOTION_IMAGES.length) + PET_MOTION_IMAGES.length) % PET_MOTION_IMAGES.length;
      const nextSrc = PET_MOTION_IMAGES[motionIndex];
      if (petImage.dataset.motionAnimated !== "1" && petImage.getAttribute("src") !== nextSrc) petImage.setAttribute("src", nextSrc);
      if (lively) {
        pet.classList.add("is-motioning");
        window.setTimeout(() => pet.classList.remove("is-motioning"), 360);
      }
    };

    window.__MIE_NYAN_MOTION__ = (motionName = "idle", message = "", autoHideMs = 4200) => {
      const index = PET_MOTION_NAMES.indexOf(String(motionName || "idle"));
      setMotionFrame(index >= 0 ? index : 0, true);
      if (messageEl && message) messageEl.textContent = message;
      if (message) {
        pet.classList.add("is-speaking");
        if (hideSpeechTimer) window.clearTimeout(hideSpeechTimer);
        hideSpeechTimer = window.setTimeout(() => pet.classList.remove("is-speaking"), Math.max(Number(autoHideMs) || 4200, 1200));
      }
    };

    const advanceMotion = (manual = false) => {
      if (document.hidden && !manual) return;
      setMotionFrame(motionIndex + 1, true);
    };

    motionTimer = window.setInterval(() => advanceMotion(false), 900);
    window.addEventListener("pagehide", () => { if (motionTimer) window.clearInterval(motionTimer); }, { once: true });

    petButton?.addEventListener("click", () => {
      const now = Date.now();
      if (now - lastManualMotionAt > 260) {
        lastManualMotionAt = now;
        advanceMotion(true);
      }
      pet.classList.toggle("is-speaking");
    });
    petButton?.addEventListener("pointerenter", () => advanceMotion(true));
    pet.querySelector("[data-pet-close]")?.addEventListener("click", () => pet.classList.remove("is-speaking"));

    // v170: 吹き出し内の「地図」ボタンを、タップ/クリックどちらでも確実に地図画面へ戻す。
    const mapButton = pet.querySelector("[data-pet-map]");
    let lastMapButtonAt = 0;
    const openMapFromPet = (event) => {
      try { event?.preventDefault?.(); } catch (error) {}
      try { event?.stopPropagation?.(); } catch (error) {}
      const now = Date.now();
      if (now - lastMapButtonAt < 280) return;
      lastMapButtonAt = now;

      let handled = false;
      try {
        if (typeof window.__MIE_OPEN_MAP_VIEW__ === "function") {
          handled = window.__MIE_OPEN_MAP_VIEW__("pet-map-button") === true;
        }
      } catch (error) {}

      if (!handled) {
        const screen = document.getElementById("appStartScreen");
        if (screen) {
          screen.classList.add("is-hidden", "is-closing");
          screen.setAttribute("aria-hidden", "true");
          screen.style.setProperty("display", "none", "important");
          screen.style.setProperty("pointer-events", "none", "important");
        }
        document.getElementById("mobileMenu")?.classList.remove("is-open");
        document.getElementById("menuBackdrop")?.classList.remove("is-open");
        document.getElementById("menuToggle")?.setAttribute("aria-expanded", "false");
        document.querySelectorAll(".catch-panel").forEach((panel) => {
          panel.classList.remove("is-open");
          panel.classList.add("is-hidden");
          panel.setAttribute("aria-hidden", "true");
          panel.style.removeProperty("display");
        });
        document.body.classList.remove("start-screen-active", "start-screen-launching", "menu-open", "panel-open", "position-adjusting", "map-popup-open", "record-popup-open", "spot-card-open");
        document.body.classList.add("start-screen-done");
        [40, 120, 300, 700].forEach((ms) => window.setTimeout(() => {
          try { window.dispatchEvent(new Event("resize")); } catch (error) {}
        }, ms));
      }
      pet.classList.remove("is-speaking");
      setMotionFrame(3, true);
    };
    mapButton?.addEventListener("click", openMapFromPet, { capture: true });
    mapButton?.addEventListener("pointerup", openMapFromPet, { capture: true });
    mapButton?.addEventListener("touchend", openMapFromPet, { passive: false, capture: true });
  }

  function installServiceWorkerUpdates() {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
    let refreshing = false;
    const show = (worker) => {
      if (!worker || document.getElementById("mieUpdateNotice")) return;
      const notice = document.createElement("aside");
      notice.id = "mieUpdateNotice";
      notice.setAttribute("role", "status");
      const message = document.createElement("span");
      message.textContent = "新しいバージョンがあります";
      const update = document.createElement("button");
      update.type = "button";
      update.textContent = "最新版に更新";
      update.addEventListener("click", () => worker.postMessage({ type: "SKIP_WAITING" }));
      notice.append(message, update);
      document.body.appendChild(notice);
    };
    navigator.serviceWorker.register("sw.js?v=" + APP_VERSION, { scope: "./" }).then((registration) => {
      if (registration.waiting) show(registration.waiting);
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) show(worker);
        });
      });
    }).catch(() => {});
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) { refreshing = true; location.reload(); }
    });
  }

  // Keep the menu's install button useful on every device. Android Chrome can
  // show the native prompt; iPhone and unsupported browsers always get the
  // platform-specific installation guide instead of an unresponsive button.
  function installDownloadButton() {
    let deferredPrompt = null;
    const openGuide = () => {
      window.location.href = `install.html?v=${APP_VERSION}`;
    };

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredPrompt = event;
      const button = document.getElementById("installAppButton");
      if (button) button.textContent = "アプリをインストール";
    });

    window.addEventListener("appinstalled", () => {
      const button = document.getElementById("installAppButton");
      if (button) {
        button.textContent = "インストール済み";
        button.disabled = true;
      }
    });

    const bind = () => {
      const button = document.getElementById("installAppButton");
      if (!button || button.dataset.pwaInstallBound === "true") return;
      button.dataset.pwaInstallBound = "true";
      button.addEventListener("click", async () => {
        if (!deferredPrompt) {
          openGuide();
          return;
        }
        try {
          await deferredPrompt.prompt();
          await deferredPrompt.userChoice;
        } catch (error) {
          openGuide();
        } finally {
          deferredPrompt = null;
        }
      });
    };

    bind();
    window.setTimeout(bind, 250);
  }

  // The app has historically shipped the backup controls in the page markup
  // before the corresponding handlers. Keep them available independently of
  // older app.js versions, without changing or clearing the user's records.
  function installInfoAndBackupControls() {
    const storageKeys = {
      spotsState: "mie-bass-map-v1",
      catches: "mie-bass-catches-v1",
      customSpots: "mie-bass-custom-spots-v1",
      positionOverrides: "mie-fishing-map-position-overrides-v86",
      sidebarBackground: "mie-fishing-map-sidebar-background-v1"
    };
    const $ = (id) => document.getElementById(id);
    const setStatus = (message) => {
      const backupStatus = $("backupStatus");
      const dataStatus = $("dataStatus");
      if (backupStatus) backupStatus.textContent = message;
      if (dataStatus) dataStatus.textContent = message;
    };
    const openInfo = () => {
      const panel = $("infoPanel");
      if (!panel) return;
      panel.classList.add("is-open");
      panel.classList.remove("is-hidden");
      panel.setAttribute("aria-hidden", "false");
      document.body.classList.add("panel-open");
      $("mobileMenu")?.classList.remove("is-open");
      $("menuBackdrop")?.classList.remove("is-open");
      $("menuToggle")?.setAttribute("aria-expanded", "false");
    };
    const closeInfo = () => {
      const panel = $("infoPanel");
      if (!panel) return;
      panel.classList.remove("is-open");
      panel.classList.add("is-hidden");
      panel.setAttribute("aria-hidden", "true");
      document.body.classList.remove("panel-open");
    };
    const readStoredJson = (key, fallback) => {
      try { return JSON.parse(localStorage.getItem(key) || "") ?? fallback; } catch (error) { return fallback; }
    };
    const writeStoredJson = (key, value) => {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (error) { return false; }
    };
    const objectValue = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const arrayValue = (value) => Array.isArray(value) ? value : [];
    const mergeById = (saved, incoming) => {
      const result = new Map();
      arrayValue(saved).forEach((item, index) => result.set(String(item?.id || `saved-${index}`), item));
      arrayValue(incoming).forEach((item, index) => result.set(String(item?.id || `imported-${index}`), item));
      return [...result.values()];
    };
    const exportBackup = () => {
      const backup = {
        schema: "mie-fishing-map-backup-v2",
        appVersion: APP_VERSION,
        exportedAt: new Date().toISOString(),
        data: {
          spotsState: readStoredJson(storageKeys.spotsState, {}),
          catches: readStoredJson(storageKeys.catches, []),
          customSpots: readStoredJson(storageKeys.customSpots, []),
          positionOverrides: readStoredJson(storageKeys.positionOverrides, {}),
          sidebarBackground: localStorage.getItem(storageKeys.sidebarBackground) || ""
        }
      };
      const stamp = new Date().toISOString().slice(0, 10);
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `mie-fishing-map-backup-${stamp}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      openInfo();
      setStatus("バックアップを保存しました。ダウンロードされたJSONファイルを大切に保管してください。");
    };
    const importBackup = (file) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onerror = () => setStatus("バックアップファイルを読み込めませんでした。JSONファイルを選び直してください。");
      reader.onload = () => {
        let parsed;
        try { parsed = JSON.parse(String(reader.result || "")); } catch (error) {
          setStatus("バックアップファイルの形式を確認できませんでした。");
          return;
        }
        const data = objectValue(parsed?.data || parsed?.backup || parsed);
        const savedState = data.spotsState ?? data.savedState ?? data[storageKeys.spotsState];
        const catches = data.catches ?? data.catchRecords ?? data[storageKeys.catches];
        const customSpots = data.customSpots ?? data[storageKeys.customSpots];
        const positions = data.positionOverrides ?? data[storageKeys.positionOverrides];
        const background = data.sidebarBackground ?? data[storageKeys.sidebarBackground];
        const hasData = savedState !== undefined || catches !== undefined || customSpots !== undefined || positions !== undefined || typeof background === "string";
        if (!hasData) {
          setStatus("このJSONには三重県釣りマップのバックアップデータが見つかりませんでした。");
          return;
        }
        let success = true;
        if (savedState !== undefined) success = writeStoredJson(storageKeys.spotsState, { ...objectValue(readStoredJson(storageKeys.spotsState, {})), ...objectValue(savedState) }) && success;
        if (catches !== undefined) success = writeStoredJson(storageKeys.catches, mergeById(readStoredJson(storageKeys.catches, []), catches)) && success;
        if (customSpots !== undefined) success = writeStoredJson(storageKeys.customSpots, mergeById(readStoredJson(storageKeys.customSpots, []), customSpots)) && success;
        if (positions !== undefined) success = writeStoredJson(storageKeys.positionOverrides, { ...objectValue(readStoredJson(storageKeys.positionOverrides, {})), ...objectValue(positions) }) && success;
        if (typeof background === "string" && background) {
          try { localStorage.setItem(storageKeys.sidebarBackground, background); } catch (error) { success = false; }
        }
        if (!success) {
          setStatus("一部のデータを保存できませんでした。端末の空き容量を確認してください。");
          return;
        }
        openInfo();
        setStatus("バックアップを読み込みました。画面を更新して反映します。");
        window.setTimeout(() => window.location.reload(), 900);
      };
      reader.readAsText(file, "utf-8");
    };
    const bind = () => {
      const infoButton = $("openInfoPanel");
      const exportButton = $("exportDataButton");
      const importInput = $("importDataFile");
      if (infoButton && infoButton.dataset.infoBound !== "true") {
        infoButton.dataset.infoBound = "true";
        infoButton.addEventListener("click", openInfo);
      }
      [$("closeInfoPanel"), $("closeInfoDone")].forEach((button) => {
        if (!button || button.dataset.infoBound === "true") return;
        button.dataset.infoBound = "true";
        button.addEventListener("click", closeInfo);
      });
      if (exportButton && exportButton.dataset.backupBound !== "true") {
        exportButton.dataset.backupBound = "true";
        exportButton.addEventListener("click", exportBackup);
      }
      if (importInput && importInput.dataset.backupBound !== "true") {
        importInput.dataset.backupBound = "true";
        importInput.addEventListener("change", () => {
          importBackup(importInput.files?.[0]);
          importInput.value = "";
        });
      }
    };
    bind();
    window.setTimeout(bind, 300);
  }
  function init() {
    injectPetStyles();
    patchNode(document.body);
    try { new MutationObserver(() => patchNode(document.body)).observe(document.body, { childList: true, subtree: true, characterData: true }); } catch (error) {}
    installPet();
    installServiceWorkerUpdates();
    installDownloadButton();
    installInfoAndBackupControls();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
