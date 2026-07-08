(() => {
  "use strict";
  window.__MIE_PWA_INSTALL_MANAGED__ = true;

  const APP_VERSION = "v140-speech-pointer-bubble";
  const STATUS_LABEL = "v140・釣りニャン指差し吹き出し採用版";
  const PET_NAME = "爆釣にゃん師匠";
  const PET_BUBBLE_IMAGE_SRC = `assets/turi-nyan-speech-bubble-v140.png?v=${APP_VERSION}`;
  const PET_IMAGE_SRC = `assets/turi-nyan-pose-front-v138.png?v=${APP_VERSION}`;
  const PET_BACK_IMAGE_SRC = `assets/turi-nyan-back-v138.png?v=${APP_VERSION}`;
  const PET_SIDE_IMAGE_SRC = `assets/turi-nyan-side-v138.png?v=${APP_VERSION}`;
  const PET_SQUAT_IMAGE_SRC = `assets/turi-nyan-squat-front-v138.png?v=${APP_VERSION}`;
  const PET_EXPRESSION_IMAGES = {
    smile: `assets/turi-nyan-expression-smile-v139.png?v=${APP_VERSION}`,
    serious: `assets/turi-nyan-expression-serious-v139.png?v=${APP_VERSION}`,
    wink: `assets/turi-nyan-expression-wink-v139.png?v=${APP_VERSION}`,
    surprise: `assets/turi-nyan-expression-surprise-v139.png?v=${APP_VERSION}`,
    thinking: `assets/turi-nyan-expression-thinking-v139.png?v=${APP_VERSION}`,
    happy: `assets/turi-nyan-expression-happy-v139.png?v=${APP_VERSION}`,
    sad: `assets/turi-nyan-expression-sad-v139.png?v=${APP_VERSION}`,
    angry: `assets/turi-nyan-expression-angry-v139.png?v=${APP_VERSION}`,
    shy: `assets/turi-nyan-expression-shy-v139.png?v=${APP_VERSION}`,
    dreamy: `assets/turi-nyan-expression-dreamy-v139.png?v=${APP_VERSION}`,
    worried: `assets/turi-nyan-expression-worried-v139.png?v=${APP_VERSION}`,
    sleepy: `assets/turi-nyan-expression-sleepy-v139.png?v=${APP_VERSION}`
  };
  const PET_MODE_LABELS = {
    front: "立ち姿",
    lookout: "後ろ姿",
    side: "横向き",
    squat: "しゃがみ",
    smile: "笑顔",
    serious: "キリッ",
    wink: "ウインク",
    surprise: "驚き",
    thinking: "考え中",
    happy: "やったー",
    sad: "残念",
    angry: "怒り",
    shy: "ドヤ顔",
    dreamy: "うっとり",
    worried: "焦り",
    sleepy: "ねむい"
  };
  const installButton = document.querySelector("#installAppButton");
  const installPanel = document.querySelector("#installPanel");
  const installStatus = document.querySelector("#installStatus");
  const closeInstallPanelButton = document.querySelector("#closeInstallPanel");
  const closeInstallDoneButton = document.querySelector("#closeInstallDone");
  let deferredInstallPrompt = null;
  let petHideTimer = null;
  let petMotionTimer = null;
  let patrolMotionTimer = null;

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
      .replaceAll("v134・宮川ダム・七色ダム・池原ダム反映版", STATUS_LABEL)
      .replaceAll("v135・釣りニャン追加版", STATUS_LABEL)
      .replaceAll("v136・釣りニャン後ろ姿モーション追加版", STATUS_LABEL)
      .replaceAll("v137・釣りニャン表情モーション採用版", STATUS_LABEL)
      .replaceAll("v138・釣りニャン丸アイコン撤去・漫画吹き出し版", STATUS_LABEL)
      .replaceAll("v139・釣りニャン口元透過修正版", STATUS_LABEL)
      .replaceAll("v131-remove-chusei-green-park", APP_VERSION)
      .replaceAll("v133-miyagawa-nanairo-ikehara", APP_VERSION)
      .replaceAll("v134-nanairo-dam-fix", APP_VERSION)
      .replaceAll("v135-turi-nyan-pet", APP_VERSION)
      .replaceAll("v136-turi-nyan-motion", APP_VERSION)
      .replaceAll("v137-turi-nyan-motion-sheet", APP_VERSION)
      .replaceAll("v138-turi-nyan-no-circle-bubble", APP_VERSION)
      .replaceAll("v139-turi-nyan-mouth-alpha-fix", APP_VERSION);
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
        width: min(330px, calc(100vw - 34px));
        min-height: 172px;
        padding: 46px 42px 62px 48px;
        border: 0;
        border-radius: 0;
        background-color: transparent;
        background-image: var(--turi-nyan-bubble-image);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
        color: #17120d;
        box-shadow: none;
        font-weight: 900;
        line-height: 1.48;
        pointer-events: auto;
        text-shadow: none;
      }
      #turiNyanPet .pet-bubble::before,
      #turiNyanPet .pet-bubble::after {
        content: none !important;
        display: none !important;
      }
      #turiNyanPet.is-speaking .pet-bubble { display: block; }
      #turiNyanPet .pet-bubble strong { color: #8d321d; font-size: 1.02em; }
      #turiNyanPet .pet-actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
      #turiNyanPet .pet-actions button {
        border: 0;
        min-height: 30px;
        padding: 5px 9px;
        border-radius: 999px;
        background: #0f6f5f;
        color: #fff;
        font-weight: 900;
        box-shadow: 0 5px 12px rgba(15,111,95,.18);
      }
      #turiNyanPet .pet-actions button.pet-secondary { background: rgba(15,111,95,.10); color: #0d5f52; }
      #turiNyanPet .pet-actions button.pet-lookout { background: rgba(201,79,39,.12); color: #8d321d; }
      #turiNyanPet .pet-button {
        width: 112px;
        height: 112px;
        border: 0;
        border-radius: 0;
        padding: 0;
        background: transparent;
        box-shadow: none;
        overflow: visible;
        cursor: pointer;
        pointer-events: auto;
        animation: turiNyanBob 3.2s ease-in-out infinite;
        touch-action: manipulation;
      }
      #turiNyanPet .pet-button img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: contain;
        filter: drop-shadow(0 12px 14px rgba(0,0,0,.30));
        transition: transform .35s ease, opacity .25s ease;
      }
      #turiNyanPet.is-speaking .pet-button { animation-duration: 1.6s; }
      #turiNyanPet.is-lookout .pet-button {
        animation: turiNyanLookout 4.8s ease-in-out infinite;
        box-shadow: none;
      }
      #turiNyanPet.is-lookout .pet-button img {
        transform: scale(1.04);
      }
      @keyframes turiNyanBob {
        0%, 100% { transform: translateY(0) rotate(-1deg); }
        50% { transform: translateY(-5px) rotate(1deg); }
      }
      @keyframes turiNyanLookout {
        0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
        50% { transform: translateY(-3px) rotate(2deg) scale(1.03); }
      }
      @media (max-width: 920px) {
        #turiNyanPet {
          right: calc(10px + env(safe-area-inset-right));
          bottom: calc(96px + env(safe-area-inset-bottom));
        }
        #turiNyanPet .pet-button { width: 92px; height: 92px; }
        #turiNyanPet .pet-bubble { width: min(286px, calc(100vw - 28px)); min-height: 150px; padding: 38px 34px 52px 38px; font-size: .82rem; }
        body.menu-open #turiNyanPet,
        body.panel-open #turiNyanPet,
        body.position-adjusting #turiNyanPet,
        body.map-popup-open #turiNyanPet,
        body.record-popup-open #turiNyanPet,
        body.spot-card-open #turiNyanPet { display: none !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        #turiNyanPet .pet-button { animation: none; }
      }
    `;
    document.head.appendChild(style);
  }


  function randomExpressionMode() {
    const modes = ["smile", "serious", "wink", "surprise", "thinking", "happy", "sad", "shy", "dreamy", "worried", "sleepy"];
    return modes[Math.floor(Math.random() * modes.length)];
  }

  function expressionMessage(mode) {
    const messages = {
      smile: "笑顔で案内するにゃ。今日も楽しく安全第一にゃ。",
      serious: "キリッと確認するにゃ。現地看板とルールは最優先にゃ。",
      wink: "このポイント、ちょっと気になるにゃ。あとで記録しておくにゃ。",
      surprise: "おっ、反応ありそうにゃ。水面と風をよく見るにゃ。",
      thinking: "考え中にゃ。前回の釣果と天気を比べるにゃ。",
      happy: "やったーにゃ。釣れたらサイズもルアーも残すにゃ。",
      sad: "残念な日もあるにゃ。次の一匹につながる記録にするにゃ。",
      angry: "危ない場所や禁止場所はダメにゃ。無理せず撤退にゃ。",
      shy: "ドヤ顔にゃ。爆釣にゃん師匠、今日も見守るにゃ。",
      dreamy: "うっとりにゃ。夕まずめの景色も釣りの楽しみだにゃ。",
      worried: "焦らなくていいにゃ。足場と天気を確認するにゃ。",
      sleepy: "ねむいにゃ…。でもバックアップだけは忘れないでにゃ。"
    };
    return messages[mode] || "今日も釣りをサポートするにゃ。";
  }

  function imageForPetMode(mode) {
    if (mode === "lookout") return PET_BACK_IMAGE_SRC;
    if (mode === "side") return PET_SIDE_IMAGE_SRC;
    if (mode === "squat") return PET_SQUAT_IMAGE_SRC;
    return PET_EXPRESSION_IMAGES[mode] || PET_IMAGE_SRC;
  }

  function randomPetMessage() {
    const messages = [
      "今日も安全第一でいくにゃ。現地看板は必ず確認にゃ。",
      "釣果を残すと、あとで強いパターンが見えてくるにゃ。",
      "バックアップ忘れは危ないにゃ。大事な記録は守るにゃ。",
      "宮川ダム、七色ダム、池原ダムも見られるようにしたにゃ。",
      "笑顔・ウインク・考え中・焦りまで、表情を切り替えるにゃ。",
      "海も川も見回り中にゃ。表情モーションも増えたにゃ。",
      "釣れた場所だけじゃなく、天気と水位もメモすると強いにゃ。"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  function setPetMotion(mode = "front", durationMs = 0) {
    const pet = document.getElementById("turiNyanPet");
    const image = document.getElementById("turiNyanImage");
    if (!pet || !image) return;
    window.clearTimeout(petMotionTimer);
    const isLookout = mode === "lookout";
    pet.classList.toggle("is-lookout", isLookout);
    const nextSrc = imageForPetMode(mode);
    if (image.getAttribute("src") !== nextSrc) image.setAttribute("src", nextSrc);
    const label = PET_MODE_LABELS[mode] || "通常";
    image.setAttribute("alt", `${PET_NAME}の${label}`);
    if (durationMs > 0) {
      petMotionTimer = window.setTimeout(() => setPetMotion("front"), durationMs);
    }
  }

  function speakPet(message = randomPetMessage(), autoHideMs = 6500, motion = "auto") {
    const pet = document.getElementById("turiNyanPet");
    const messageEl = document.getElementById("turiNyanMessage");
    if (!pet || !messageEl) return;
    const selectedMotion = motion === "auto" ? randomExpressionMode() : motion;
    messageEl.textContent = message;
    pet.classList.add("is-speaking");
    setPetMotion(selectedMotion, selectedMotion === "lookout" ? Math.max(3200, autoHideMs - 500) : 0);
    window.clearTimeout(petHideTimer);
    if (autoHideMs > 0) {
      petHideTimer = window.setTimeout(() => {
        pet.classList.remove("is-speaking");
        setPetMotion("front");
      }, autoHideMs);
    }
  }

  function speakLookout() {
    speakPet("海も川も任せるにゃ。後ろ姿でしっかり見回り中にゃ。", 7600, "lookout");
  }

  function schedulePatrolMotion() {
    window.clearTimeout(patrolMotionTimer);
    patrolMotionTimer = window.setTimeout(() => {
      const pet = document.getElementById("turiNyanPet");
      if (pet && !pet.classList.contains("is-speaking") && !document.body.classList.contains("menu-open") && !document.body.classList.contains("panel-open")) {
        speakPet("夕まずめの景色を確認中にゃ。後ろ姿で見回るにゃ。", 5600, "lookout");
      }
      schedulePatrolMotion();
    }, 42000);
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
        <strong>${PET_NAME}</strong><br>
        <span id="turiNyanMessage">今日も安全第一でいくにゃ。</span>
        <div class="pet-actions">
          <button id="turiNyanRecord" type="button">釣果記録</button>
          <button id="turiNyanLookout" class="pet-lookout" type="button">見回り</button>
          <button id="turiNyanMood" class="pet-secondary" type="button">表情</button>
          <button id="turiNyanClose" class="pet-secondary" type="button">閉じる</button>
        </div>
      </div>
      <button class="pet-button" id="turiNyanButton" type="button" aria-label="${PET_NAME}に話しかける">
        <img id="turiNyanImage" src="${PET_IMAGE_SRC}" alt="${PET_NAME}">
      </button>
    `;
    document.body.appendChild(pet);

    document.getElementById("turiNyanButton")?.addEventListener("click", () => {
      if (pet.classList.contains("is-speaking") && pet.classList.contains("is-lookout")) {
        speakPet(randomPetMessage(), 6500, "auto");
      } else if (pet.classList.contains("is-speaking")) {
        speakLookout();
      } else {
        speakPet("呼んだかにゃ？ 指定の吹き出しを採用したにゃ。", 8000, "wink");
      }
    });
    document.getElementById("turiNyanClose")?.addEventListener("click", (event) => {
      event.stopPropagation();
      pet.classList.remove("is-speaking");
      setPetMotion("front");
    });
    document.getElementById("turiNyanLookout")?.addEventListener("click", (event) => {
      event.stopPropagation();
      speakLookout();
    });
    document.getElementById("turiNyanMood")?.addEventListener("click", (event) => {
      event.stopPropagation();
      const mode = randomExpressionMode();
      speakPet(expressionMessage(mode), 6800, mode);
    });
    document.getElementById("turiNyanRecord")?.addEventListener("click", (event) => {
      event.stopPropagation();
      const button = document.querySelector("#addCatchMode");
      if (button) {
        button.click();
        speakPet("釣果を残すにゃ。サイズ・ルアー・天気も入れるとあとで役立つにゃ。", 7000, "happy");
      } else {
        speakPet("釣果記録ボタンがまだ準備中にゃ。少し待ってもう一回にゃ。", 7000);
      }
    });

    window.setTimeout(() => speakPet("爆釣にゃん師匠だにゃ。新しい漫画吹き出しで案内するにゃ。", 7600, "happy"), 1600);
    window.setTimeout(() => speakLookout(), 10500);
    schedulePatrolMotion();
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
    document.addEventListener("DOMContentLoaded", () => {
      startTextPatch();
      injectPet();
    }, { once: true });
  } else {
    startTextPatch();
    injectPet();
  }

  window.addEventListener("load", () => {
    patchNode(document.body);
    injectPet();
    clearOldAppCache();
  });
})();
