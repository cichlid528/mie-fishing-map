(() => {
  "use strict";
  window.__MIE_PWA_INSTALL_MANAGED__ = true;

  const APP_VERSION = "v154-default-background";
  const STATUS_LABEL = "v154・釣りニャン初期背景採用版";
  const PET_NAME = "爆釣にゃん師匠";
  const PET_BUBBLE_IMAGE_SRC = `assets/turi-nyan-speech-bubble-v149.png?v=${APP_VERSION}`;
  const PET_IMAGE_SRC = `assets/turi-nyan-pose-front-v149.png?v=${APP_VERSION}`;
  const PET_BACK_IMAGE_SRC = `assets/turi-nyan-back-v149.png?v=${APP_VERSION}`;
  const PET_SIDE_IMAGE_SRC = `assets/turi-nyan-side-v149.png?v=${APP_VERSION}`;
  const PET_SQUAT_IMAGE_SRC = `assets/turi-nyan-squat-front-v149.png?v=${APP_VERSION}`;
  const PET_CELEBRATE_IMAGE_SRC = `assets/turi-nyan-medetai-v149.png?v=${APP_VERSION}`;
  const PET_EXPRESSION_IMAGES = {
    smile: `assets/turi-nyan-expression-smile-v149.png?v=${APP_VERSION}`,
    serious: `assets/turi-nyan-expression-serious-v149.png?v=${APP_VERSION}`,
    wink: `assets/turi-nyan-expression-wink-v149.png?v=${APP_VERSION}`,
    surprise: `assets/turi-nyan-expression-surprise-v149.png?v=${APP_VERSION}`,
    thinking: `assets/turi-nyan-expression-thinking-v149.png?v=${APP_VERSION}`,
    happy: `assets/turi-nyan-expression-happy-v149.png?v=${APP_VERSION}`,
    sad: `assets/turi-nyan-expression-sad-v149.png?v=${APP_VERSION}`,
    angry: `assets/turi-nyan-expression-angry-v149.png?v=${APP_VERSION}`,
    shy: `assets/turi-nyan-expression-shy-v149.png?v=${APP_VERSION}`,
    dreamy: `assets/turi-nyan-expression-dreamy-v149.png?v=${APP_VERSION}`,
    worried: `assets/turi-nyan-expression-worried-v149.png?v=${APP_VERSION}`,
    sleepy: `assets/turi-nyan-expression-sleepy-v149.png?v=${APP_VERSION}`
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
    sleepy: "ねむい",
    celebrate: "めでたい"
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
  let knownCatchCount = 0;
  const CATCH_STORAGE_KEY = "mie-bass-catches-v1";
  const BACKUP_META_STORAGE_KEY = "mie-fishing-map-backup-meta-v1";
  const PET_LAST_NO_RECORD_PROMPT_KEY = "mie-fishing-map-pet-no-record-prompt-v148";
  const PET_LAST_BACKUP_PROMPT_KEY = "mie-fishing-map-pet-backup-prompt-v148";

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
      .replaceAll("v140・釣りニャン指差し吹き出し採用版", STATUS_LABEL)
      .replaceAll("v141・釣りニャン吹き出し文字調整版", STATUS_LABEL)
      .replaceAll("v142・釣りニャン吹き出し右下しっぽ版", STATUS_LABEL)
      .replaceAll("v143・釣りニャン吹き出し文字内側調整版", STATUS_LABEL)
      .replaceAll("v144・釣りニャン吹き出し文字右寄せ調整版", STATUS_LABEL)
      .replaceAll("v145・釣りニャン吹き出し文字下げ調整版", STATUS_LABEL)
      .replaceAll("v146・釣りニャン反応モード追加版", STATUS_LABEL)
      .replaceAll("v147・釣りニャン釣果記録ボタン連動版", STATUS_LABEL)
      .replaceAll("v148・釣りニャン釣果記録高速化版", STATUS_LABEL)
      .replaceAll("v149・釣りニャン高速化・軽量化版", STATUS_LABEL)
      .replaceAll("v150・釣りニャン軽量ふわふわ復活版", STATUS_LABEL)
      .replaceAll("v151・釣りニャンスマホ表示少し大きめ版", STATUS_LABEL)
      .replaceAll("v152・釣りニャンスマホ表示さらに大きめ版", STATUS_LABEL)
      .replaceAll("v153・釣りニャンスマホ表示ほぼ倍サイズ版", STATUS_LABEL)
      .replaceAll("v131-remove-chusei-green-park", APP_VERSION)
      .replaceAll("v133-miyagawa-nanairo-ikehara", APP_VERSION)
      .replaceAll("v134-nanairo-dam-fix", APP_VERSION)
      .replaceAll("v135-turi-nyan-pet", APP_VERSION)
      .replaceAll("v136-turi-nyan-motion", APP_VERSION)
      .replaceAll("v137-turi-nyan-motion-sheet", APP_VERSION)
      .replaceAll("v138-turi-nyan-no-circle-bubble", APP_VERSION)
      .replaceAll("v139-turi-nyan-mouth-alpha-fix", APP_VERSION)
      .replaceAll("v140-speech-pointer-bubble", APP_VERSION)
      .replaceAll("v141-bubble-text-fit", APP_VERSION)
      .replaceAll("v142-bubble-tail-right", APP_VERSION)
      .replaceAll("v143-bubble-text-inside", APP_VERSION)
      .replaceAll("v144-bubble-text-right", APP_VERSION)
      .replaceAll("v145-bubble-text-lower", APP_VERSION)
      .replaceAll("v146-pet-reaction-mode", APP_VERSION)
      .replaceAll("v147-pet-catch-record-button", APP_VERSION)
      .replaceAll("v148-pet-catch-button-fast", APP_VERSION)
      .replaceAll("v149-pet-speed-light-bigger-text", APP_VERSION)
      .replaceAll("v150-pet-light-float", APP_VERSION)
      .replaceAll("v151-pet-mobile-size-up", APP_VERSION)
      .replaceAll("v152-pet-mobile-icon-bigger", APP_VERSION)
      .replaceAll("v153-pet-mobile-icon-double", APP_VERSION);
  }

  function patchSingleNode(node) {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const next = patchText(node.nodeValue || "");
      if (next !== node.nodeValue) node.nodeValue = next;
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE && node.attributes) {
      for (const attr of Array.from(node.attributes)) {
        const next = patchText(attr.value || "");
        if (next !== attr.value) node.setAttribute(attr.name, next);
      }
    }
  }

  function patchNode(node) {
    if (!node) return;
    patchSingleNode(node);
    if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_NODE) return;
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let current = walker.nextNode();
    while (current) {
      patchSingleNode(current);
      current = walker.nextNode();
    }
  }

  function startTextPatch() {
    patchNode(document.body);
    if (!document.body) return;
    let scheduled = false;
    const schedulePatch = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame?.(() => {
        scheduled = false;
        patchNode(document.body);
      }) || window.setTimeout(() => { scheduled = false; patchNode(document.body); }, 35);
    };
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          patchSingleNode(mutation.target);
        } else if (mutation.addedNodes?.length) {
          mutation.addedNodes.forEach(patchNode);
        } else {
          schedulePatch();
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
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
        width: min(404px, calc(100vw - 24px));
        aspect-ratio: 1 / 1;
        min-height: 0;
        padding: 104px 68px 118px 104px;
        border: 0;
        border-radius: 0;
        background-color: transparent;
        background-image: var(--turi-nyan-bubble-image);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
        color: #17120d;
        box-shadow: none;
        font-size: .78rem;
        font-weight: 900;
        line-height: 1.24;
        letter-spacing: -.02em;
        pointer-events: auto;
        text-shadow: none;
        overflow: hidden;
      }
      #turiNyanPet .pet-bubble::before,
      #turiNyanPet .pet-bubble::after {
        content: none !important;
        display: none !important;
      }
      #turiNyanPet.is-speaking .pet-bubble { display: block; }
      #turiNyanPet .pet-bubble strong { display: block; color: #8d321d; font-size: .78rem; line-height: 1.05; margin-bottom: 2px; white-space: nowrap; }
      #turiNyanPet #turiNyanMessage { display: block; max-width: 100%; min-height: 2.0em; max-height: 3.7em; font-size: .62rem; line-height: 1.16; overflow: hidden; overflow-wrap: anywhere; word-break: keep-all; }
      #turiNyanPet .pet-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3px; margin-top: 5px; max-width: 100%; }
      #turiNyanPet .pet-actions button {
        border: 0;
        min-height: 25px;
        padding: 4px 6px;
        border-radius: 999px;
        background: #0f6f5f;
        color: #fff;
        font-size: .62rem;
        line-height: 1;
        font-weight: 900;
        box-shadow: 0 5px 12px rgba(15,111,95,.18);
        white-space: nowrap;
      }
      #turiNyanPet .pet-actions button.pet-secondary { background: rgba(15,111,95,.10); color: #0d5f52; }
      #turiNyanPet .pet-actions button.pet-lookout { background: rgba(201,79,39,.12); color: #8d321d; }
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
        will-change: transform;
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
          right: calc(4px + env(safe-area-inset-right));
          bottom: calc(68px + env(safe-area-inset-bottom));
        }
        #turiNyanPet .pet-button { width: 168px; height: 168px; animation: turiNyanBob 5.2s ease-in-out infinite; }
        #turiNyanPet .pet-button img { transform: scale(1.45); transform-origin: center bottom; }
        #turiNyanPet.is-lookout .pet-button img { transform: scale(1.50); }
        #turiNyanPet .pet-bubble { width: min(344px, calc(100vw - 10px)); aspect-ratio: 1 / 1; min-height: 0; padding: 94px 54px 104px 96px; font-size: .70rem; }
        #turiNyanPet .pet-bubble strong { font-size: .68rem; margin-bottom: 2px; }
        #turiNyanPet #turiNyanMessage { min-height: 2.1em; max-height: 3.5em; font-size: .54rem; line-height: 1.14; }
        #turiNyanPet .pet-actions { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; margin-top: 6px; }
        #turiNyanPet .pet-actions button { min-height: 24px; padding: 4px 5px; font-size: .54rem; }
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
      smile: "笑顔で案内にゃ。安全第一にゃ。",
      serious: "キリッと確認にゃ。ルール優先にゃ。",
      wink: "気になるポイントにゃ。記録にゃ。",
      surprise: "反応ありそうにゃ。水面確認にゃ。",
      thinking: "考え中にゃ。前回と比べるにゃ。",
      happy: "やったーにゃ。サイズも残すにゃ。",
      sad: "残念でも記録が次に効くにゃ。",
      angry: "危ない場所はダメにゃ。撤退にゃ。",
      shy: "ドヤ顔にゃ。今日も見守るにゃ。",
      dreamy: "夕まずめ最高にゃ。",
      worried: "足場と天気を確認にゃ。",
      sleepy: "ねむいにゃ…。保存忘れずにゃ。"
    };
    return messages[mode] || "今日も釣りをサポートするにゃ。";
  }

  function imageForPetMode(mode) {
    if (mode === "lookout") return PET_BACK_IMAGE_SRC;
    if (mode === "side") return PET_SIDE_IMAGE_SRC;
    if (mode === "squat") return PET_SQUAT_IMAGE_SRC;
    if (mode === "celebrate") return PET_CELEBRATE_IMAGE_SRC;
    return PET_EXPRESSION_IMAGES[mode] || PET_IMAGE_SRC;
  }

  function randomPetMessage() {
    const messages = [
      "今日も安全第一にゃ",
      "釣果を記録するにゃ",
      "バックアップ忘れてないかにゃ？",
      "このポイントは現地確認してにゃ",
      "そろそろ釣り行くにゃ？",
      "大漁祈願にゃ！",
      "記録を守るにゃ"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }


  function safeJson(value, fallback) {
    try { return JSON.parse(value || ""); } catch (error) { return fallback; }
  }

  function catchRecordsFrom(value) {
    const records = Array.isArray(value) ? value : safeJson(value, []);
    return Array.isArray(records) ? records.filter((record) => record && (record.recordType !== "note")) : [];
  }

  function currentCatchRecords() {
    return catchRecordsFrom(localStorage.getItem(CATCH_STORAGE_KEY));
  }

  function recordDateMs(record) {
    const raw = record?.time || record?.datetime || record?.createdAt || record?.updatedAt || "";
    const ms = Date.parse(raw);
    return Number.isFinite(ms) ? ms : 0;
  }

  function recordSizeCm(record) {
    const candidates = [record?.sizeCm, record?.actualSizeCm, record?.size, record?.sizeClass];
    for (const value of candidates) {
      const match = String(value || "").match(/(\d+(?:\.\d+)?)/);
      if (match) return Number(match[1]);
    }
    return 0;
  }

  function newestRecord(records) {
    return records.slice().sort((a, b) => recordDateMs(b) - recordDateMs(a))[0] || records[records.length - 1] || null;
  }

  function isRateLimited(key, hours = 12) {
    const last = Number(localStorage.getItem(key) || 0);
    if (last && Date.now() - last < hours * 60 * 60 * 1000) return true;
    localStorage.setItem(key, String(Date.now()));
    return false;
  }

  function showCatchReaction(records) {
    const latest = newestRecord(records) || {};
    if (recordSizeCm(latest) >= 50) {
      speakPet("大漁祈願にゃ！", 9000, "celebrate");
      return;
    }
    speakPet("釣果記録できたにゃ！", 8200, "celebrate");
  }

  function handleCatchStorageChange(beforeRaw, afterRaw) {
    const before = catchRecordsFrom(beforeRaw);
    const after = catchRecordsFrom(afterRaw);
    if (after.length > Math.max(before.length, knownCatchCount)) {
      knownCatchCount = after.length;
      window.setTimeout(() => showCatchReaction(after), 250);
    } else {
      knownCatchCount = Math.max(knownCatchCount, after.length);
    }
  }

  function installPetRecordWatcher() {
    if (window.__TURI_NYAN_RECORD_WATCHER__) return;
    window.__TURI_NYAN_RECORD_WATCHER__ = true;
    knownCatchCount = currentCatchRecords().length;
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      const stringKey = String(key || "");
      const before = stringKey === CATCH_STORAGE_KEY ? localStorage.getItem(CATCH_STORAGE_KEY) : null;
      const result = originalSetItem.apply(this, arguments);
      if (this === window.localStorage && stringKey === CATCH_STORAGE_KEY) {
        window.setTimeout(() => handleCatchStorageChange(before, String(value || "")), 0);
      }
      return result;
    };
  }

  function latestCatchAgeDays() {
    const records = currentCatchRecords();
    if (!records.length) return Infinity;
    const latest = newestRecord(records);
    const ms = recordDateMs(latest);
    if (!ms) return Infinity;
    return (Date.now() - ms) / (24 * 60 * 60 * 1000);
  }

  function backupLooksOld() {
    const records = currentCatchRecords();
    if (!records.length) return false;
    const meta = safeJson(localStorage.getItem(BACKUP_META_STORAGE_KEY), null);
    if (!meta || typeof meta !== "object") return true;
    const raw = meta.lastBackupAt || meta.backupAt || meta.exportedAt || meta.updatedAt || meta.createdAt || "";
    const ms = Date.parse(raw);
    if (!Number.isFinite(ms)) return true;
    return Date.now() - ms > 14 * 24 * 60 * 60 * 1000;
  }

  function runPetCareChecks() {
    window.setTimeout(() => {
      if (backupLooksOld() && !isRateLimited(PET_LAST_BACKUP_PROMPT_KEY, 12)) {
        speakPet("バックアップ忘れてないかにゃ？", 8500, "worried");
      }
    }, 14500);
    window.setTimeout(() => {
      if (latestCatchAgeDays() >= 14 && !isRateLimited(PET_LAST_NO_RECORD_PROMPT_KEY, 18)) {
        speakPet("そろそろ釣り行くにゃ？", 8500, "thinking");
      }
    }, 25500);
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
    speakPet("見回り中にゃ。", 7600, "lookout");
  }

  function schedulePatrolMotion() {
    window.clearTimeout(patrolMotionTimer);
    patrolMotionTimer = window.setTimeout(() => {
      const pet = document.getElementById("turiNyanPet");
      if (pet && !pet.classList.contains("is-speaking") && !document.body.classList.contains("menu-open") && !document.body.classList.contains("panel-open")) {
        speakPet("夕まずめ見回り中にゃ。", 5600, "lookout");
      }
      schedulePatrolMotion();
    }, 120000);
  }


  function waitForCatchPanelBridge(timeoutMs = 320) {
    const existing = window.__MIE_OPEN_CATCH_PANEL_FROM_PET__;
    if (typeof existing === "function") return Promise.resolve(existing);
    return new Promise((resolve) => {
      let done = false;
      const startedAt = Date.now();
      let timer = null;
      const finish = (fn = null) => {
        if (done) return;
        done = true;
        window.clearInterval(timer);
        window.removeEventListener("mie:pet-catch-bridge-ready", onReady);
        resolve(fn);
      };
      const onReady = () => {
        const fn = window.__MIE_OPEN_CATCH_PANEL_FROM_PET__;
        finish(typeof fn === "function" ? fn : null);
      };
      window.addEventListener("mie:pet-catch-bridge-ready", onReady, { once: true });
      timer = window.setInterval(() => {
        const fn = window.__MIE_OPEN_CATCH_PANEL_FROM_PET__;
        if (typeof fn === "function") {
          finish(fn);
          return;
        }
        if (Date.now() - startedAt >= timeoutMs) finish(null);
      }, 35);
      window.setTimeout(() => finish(typeof window.__MIE_OPEN_CATCH_PANEL_FROM_PET__ === "function" ? window.__MIE_OPEN_CATCH_PANEL_FROM_PET__ : null), timeoutMs + 120);
    });
  }

  async function openCatchRecordFromPet(button = null) {
    if (button?.dataset?.busy === "1") return;
    if (button) {
      button.dataset.busy = "1";
      button.disabled = true;
    }
    const instantOpen = window.__MIE_OPEN_CATCH_PANEL_FROM_PET__;
    if (!instantOpen) speakPet("釣果記録を開くにゃ", 1400, "thinking");
    try {
      const openFromPet = window.__MIE_OPEN_CATCH_PANEL_FROM_PET__ || await waitForCatchPanelBridge(320);
      if (typeof openFromPet === "function" && openFromPet()) {
        window.setTimeout(() => speakPet("釣果記録を開いたにゃ", 4200, "happy"), 120);
        return;
      }
      const catchModeButton = document.querySelector("#addCatchMode");
      if (catchModeButton) {
        catchModeButton.click();
        speakPet("地図をタップして記録にゃ", 5200, "happy");
        return;
      }
      speakPet("まだ準備中にゃ。少し待ってにゃ", 6200, "worried");
    } catch (error) {
      console.error("釣りニャンから釣果記録を開けませんでした", error);
      speakPet("釣果記録を開けなかったにゃ", 6200, "worried");
    } finally {
      if (button) {
        button.disabled = false;
        delete button.dataset.busy;
      }
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
        <strong>${PET_NAME}</strong><br>
        <span id="turiNyanMessage">今日も安全第一にゃ</span>
        <div class="pet-actions">
          <button id="turiNyanRecord" type="button">釣果記録</button>
          <button id="turiNyanLookout" class="pet-lookout" type="button">見回り</button>
          <button id="turiNyanMood" class="pet-secondary" type="button">表情</button>
          <button id="turiNyanClose" class="pet-secondary" type="button">閉じる</button>
        </div>
      </div>
      <button class="pet-button" id="turiNyanButton" type="button" aria-label="${PET_NAME}に話しかける">
        <img id="turiNyanImage" src="${PET_IMAGE_SRC}" alt="${PET_NAME}" decoding="async" loading="lazy">
      </button>
    `;
    document.body.appendChild(pet);

    document.getElementById("turiNyanButton")?.addEventListener("click", () => {
      if (pet.classList.contains("is-speaking") && pet.classList.contains("is-lookout")) {
        speakPet(randomPetMessage(), 6500, "auto");
      } else if (pet.classList.contains("is-speaking")) {
        speakLookout();
      } else {
        speakPet(randomPetMessage(), 8000, "wink");
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
      openCatchRecordFromPet(event.currentTarget);
    });

    window.setTimeout(() => speakPet("今日も安全第一にゃ", 5200, "happy"), 1200);
    if (!window.matchMedia?.("(max-width: 920px)")?.matches) {
      window.setTimeout(() => speakLookout(), 14000);
      schedulePatrolMotion();
    }
    runPetCareChecks();
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

  installPetRecordWatcher();

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
