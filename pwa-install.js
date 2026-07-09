(() => {
  "use strict";
  window.__MIE_PWA_INSTALL_MANAGED__ = true;

  const APP_VERSION = "v158-bubble-size-menu-bg-fix";
  const STATUS_LABEL = "v158・吹き出しサイズとメニュー背景修正版";
  const PET_NAME = "爆釣にゃん師匠";
  const PET_IMAGE_SRC = `assets/turi-nyan-pose-front-v149.png?v=${APP_VERSION}`;
  const PET_BACK_IMAGE_SRC = `assets/turi-nyan-back-v149.png?v=${APP_VERSION}`;
  const PET_BUBBLE_IMAGE_SRC = `assets/turi-nyan-speech-bubble-comic-v158.png?v=${APP_VERSION}`;

  let deferredInstallPrompt = null;
  let petHideTimer = null;

  function patchText(value) {
    if (typeof value !== "string") return value;
    return value
      .replaceAll("爆調ツインニャンコ", "爆釣ツインニャンコ")
      .replaceAll("v131・中勢グリーンパーク削除版", STATUS_LABEL)
      .replaceAll("v155・釣りニャン初期背景強制反映版", STATUS_LABEL)
      .replaceAll("v156・メニュー背景と地図反映修正版", STATUS_LABEL)
      .replaceAll("v157・漫画風吹き出しとメニュー背景修正版", STATUS_LABEL)
      .replaceAll("v131-remove-chusei-green-park", APP_VERSION)
      .replaceAll("v155-default-background-force", APP_VERSION)
      .replaceAll("v156-menu-bg-map-fix", APP_VERSION)
      .replaceAll("v157-comic-bubble-menu-bg", APP_VERSION);
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

  function startTextPatch() {
    patchNode(document.body);
    try {
      const observer = new MutationObserver(() => window.requestAnimationFrame?.(() => patchNode(document.body)) || window.setTimeout(() => patchNode(document.body), 30));
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    } catch (error) {}
  }

  function injectPetStyles() {
    if (document.getElementById("turiNyanPetStyles")) return;
    const style = document.createElement("style");
    style.id = "turiNyanPetStyles";
    style.textContent = `
      #turiNyanPet {
        position: fixed;
        right: calc(14px + env(safe-area-inset-right));
        bottom: calc(92px + env(safe-area-inset-bottom));
        z-index: 2147483200;
        display: grid;
        justify-items: end;
        gap: 8px;
        pointer-events: none;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      #turiNyanPet .pet-bubble {
        display: none;
        position: relative;
        box-sizing: border-box;
        width: min(304px, calc(100vw - 18px));
        aspect-ratio: 1 / 1;
        min-height: 0;
        padding: 78px 68px 88px 62px;
        border: 0;
        border-radius: 0;
        background-color: transparent;
        background-image: var(--turi-nyan-bubble-image);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
        color: #17120d;
        box-shadow: none;
        font-size: .60rem;
        font-weight: 900;
        line-height: 1.10;
        pointer-events: auto;
        text-shadow: none;
        overflow: hidden;
      }
      #turiNyanPet.is-speaking .pet-bubble { display: block; }
      #turiNyanPet .pet-bubble strong { display: block; color: #8d321d; font-size: .62rem; line-height: 1.04; margin-bottom: 2px; white-space: nowrap; }
      #turiNyanPet #turiNyanMessage { display: block; max-height: 2.5em; overflow: hidden; overflow-wrap: anywhere; word-break: keep-all; }
      #turiNyanPet .pet-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3px; margin-top: 4px; }
      #turiNyanPet .pet-actions button {
        border: 0;
        min-height: 21px;
        padding: 3px 5px;
        border-radius: 999px;
        background: #0f6f5f;
        color: #fff;
        font-size: .50rem;
        font-weight: 900;
        white-space: nowrap;
      }
      #turiNyanPet .pet-actions button.pet-secondary { background: rgba(15,111,95,.10); color: #0d5f52; }
      #turiNyanPet .pet-button {
        width: 104px;
        height: 104px;
        border: 0;
        border-radius: 0;
        padding: 0;
        background: transparent;
        box-shadow: none;
        overflow: visible;
        cursor: pointer;
        pointer-events: auto;
        animation: turiNyanBob 4.8s ease-in-out infinite;
        touch-action: manipulation;
      }
      #turiNyanPet .pet-button img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: contain;
        filter: drop-shadow(0 12px 14px rgba(0,0,0,.30));
      }
      @keyframes turiNyanBob {
        0%, 100% { transform: translateY(0) rotate(-1deg); }
        50% { transform: translateY(-5px) rotate(1deg); }
      }
      @media (max-width: 920px) {
        #turiNyanPet {
          right: calc(6px + env(safe-area-inset-right));
          bottom: calc(76px + env(safe-area-inset-bottom));
          max-width: calc(100vw - 12px);
        }
        #turiNyanPet .pet-button { width: 118px !important; height: 118px !important; }
        #turiNyanPet .pet-button img { transform: scale(1.12) !important; transform-origin: center bottom !important; }
        #turiNyanPet.is-lookout .pet-button img { transform: scale(1.16) !important; }
        #turiNyanPet .pet-bubble { width: min(284px, calc(100vw - 14px)) !important; padding: 72px 64px 82px 56px !important; }
        body.menu-open #turiNyanPet,
        body.panel-open #turiNyanPet,
        body.position-adjusting #turiNyanPet,
        body.map-popup-open #turiNyanPet,
        body.record-popup-open #turiNyanPet,
        body.spot-card-open #turiNyanPet { display: none !important; }
        #turiNyanPet .pet-bubble strong { font-size: .56rem !important; }
        #turiNyanPet #turiNyanMessage { font-size: .48rem !important; line-height: 1.08 !important; max-height: 2.25em !important; }
        #turiNyanPet .pet-actions button { min-height: 19px !important; padding: 2px 4px !important; font-size: .46rem !important; }
      }
      @media (prefers-reduced-motion: reduce) { #turiNyanPet .pet-button { animation: none; } }
    `;
    document.head.appendChild(style);
  }

  function speakPet(message = "今日も安全第一にゃ", autoHideMs = 6500, lookout = false) {
    const pet = document.getElementById("turiNyanPet");
    const messageEl = document.getElementById("turiNyanMessage");
    const image = document.getElementById("turiNyanImage");
    if (!pet || !messageEl) return;
    messageEl.textContent = message;
    if (image) image.src = lookout ? PET_BACK_IMAGE_SRC : PET_IMAGE_SRC;
    pet.classList.toggle("is-lookout", lookout);
    pet.classList.add("is-speaking");
    window.clearTimeout(petHideTimer);
    if (autoHideMs > 0) {
      petHideTimer = window.setTimeout(() => {
        pet.classList.remove("is-speaking", "is-lookout");
        if (image) image.src = PET_IMAGE_SRC;
      }, autoHideMs);
    }
  }

  async function openCatchRecordFromPet(button = null) {
    if (button?.dataset?.busy === "1") return;
    if (button) { button.dataset.busy = "1"; button.disabled = true; }
    try {
      const fn = window.__MIE_OPEN_CATCH_PANEL_FROM_PET__;
      if (typeof fn === "function" && fn()) {
        window.setTimeout(() => speakPet("釣果記録を開いたにゃ", 4200), 120);
        return;
      }
      const catchModeButton = document.querySelector("#addCatchMode");
      if (catchModeButton) {
        catchModeButton.click();
        speakPet("地図をタップして記録にゃ", 5200);
        return;
      }
      speakPet("まだ準備中にゃ。少し待ってにゃ", 6200);
    } finally {
      if (button) { button.disabled = false; delete button.dataset.busy; }
    }
  }

  function injectPet() {
    if (!document.body || document.getElementById("turiNyanPet")) return;
    injectPetStyles();
    const pet = document.createElement("aside");
    pet.id = "turiNyanPet";
    pet.setAttribute("aria-label", `${PET_NAME} ナビ`);
    pet.style.setProperty("--turi-nyan-bubble-image", `url("${PET_BUBBLE_IMAGE_SRC}")`);
    pet.innerHTML = `
      <div class="pet-bubble" role="status" aria-live="polite">
        <strong>${PET_NAME}</strong>
        <span id="turiNyanMessage">今日も安全第一にゃ</span>
        <div class="pet-actions">
          <button id="turiNyanRecord" type="button">釣果記録</button>
          <button id="turiNyanLookout" type="button">見回り</button>
          <button id="turiNyanClose" class="pet-secondary" type="button">閉じる</button>
          <button id="turiNyanMood" class="pet-secondary" type="button">表情</button>
        </div>
      </div>
      <button class="pet-button" id="turiNyanButton" type="button" aria-label="${PET_NAME}に話しかける">
        <img id="turiNyanImage" src="${PET_IMAGE_SRC}" alt="${PET_NAME}" decoding="async" loading="lazy">
      </button>
    `;
    document.body.appendChild(pet);
    document.getElementById("turiNyanButton")?.addEventListener("click", () => speakPet("今日も安全第一にゃ", 6500));
    document.getElementById("turiNyanClose")?.addEventListener("click", (event) => { event.stopPropagation(); pet.classList.remove("is-speaking", "is-lookout"); });
    document.getElementById("turiNyanLookout")?.addEventListener("click", (event) => { event.stopPropagation(); speakPet("見回り中にゃ。", 6500, true); });
    document.getElementById("turiNyanMood")?.addEventListener("click", (event) => { event.stopPropagation(); speakPet("大漁祈願にゃ！", 6500); });
    document.getElementById("turiNyanRecord")?.addEventListener("click", (event) => { event.stopPropagation(); openCatchRecordFromPet(event.currentTarget); });
    window.setTimeout(() => speakPet("今日も安全第一にゃ", 4200), 1200);
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
    } catch (error) {}
  }

  function isStandalone() {
    return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
  }

  function openInstallPanel(message = "") {
    const panel = document.querySelector("#installPanel");
    const status = document.querySelector("#installStatus");
    if (status && message) status.textContent = message;
    panel?.classList.add("is-open");
    panel?.setAttribute("aria-hidden", "false");
  }

  async function installApp() {
    if (isStandalone()) {
      openInstallPanel("すでにホーム画面のアイコンからアプリとして起動しています。古い表示なら reset-cache.html?auto=1 を開いてください。");
      return;
    }
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      openInstallPanel(choice?.outcome === "accepted" ? "インストールを開始しました。" : "インストールはキャンセルされました。必要なときにもう一度押してください。");
      return;
    }
    openInstallPanel("AndroidはChrome右上の『︙』から、iPhoneはSafari共有ボタンから『ホーム画面に追加』を選んでください。");
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    const status = document.querySelector("#installStatus");
    if (status) status.textContent = "Android / Chromeでは、このボタンからインストールできます。";
  });

  function boot() {
    startTextPatch();
    injectPet();
    document.querySelector("#installAppButton")?.addEventListener("click", installApp);
    document.querySelector("#closeInstallPanel")?.addEventListener("click", () => document.querySelector("#installPanel")?.classList.remove("is-open"));
    document.querySelector("#closeInstallDone")?.addEventListener("click", () => document.querySelector("#installPanel")?.classList.remove("is-open"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
  window.addEventListener("load", () => { patchNode(document.body); injectPet(); clearOldAppCache(); });
})();
